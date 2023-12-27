import { Configuration, OpenAIApi } from 'openai';
import * as fs from 'fs';
import axios, { AxiosError } from 'axios';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { Database } from '@/types_db';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { createReadStream } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import formidable from 'formidable';

const execAsync = promisify(exec);

const tableName = process.env.TABLE_NAME!;

export const config = {
  api: {
    bodyParser: false
  }
}
const extractAudioFromVideo = (videoFilePath: any, outputAudioPath: any) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoFilePath)
      .output(outputAudioPath)
      .audioCodec('pcm_s16le')
      .on('end', () => resolve(outputAudioPath))
      .on('error', reject)
      .run();
  });
};

const getFileType = (filePath: string) => {
  const extension = path.extname(filePath).toLowerCase();
  console.log(filePath, extension);

  const audioExtensions = ['.mp3', '.mpga', '.m4a', '.wav'];
  const videoExtensions = ['.mp4', '.mpeg', '.webm'];

  if (audioExtensions.includes(extension)) {
    return 'audio';
  } else if (videoExtensions.includes(extension)) {
    return 'video';
  } else {
    return 'unknown';
  }
};

const getFileExtension = (pathname: string) => {
  // Parse the URL to get the pathname
  // const parsedUrl = new URL(urlString);
  // const pathname = parsedUrl.pathname;

  // Use path.extname to extract the extension from the pathname
  return path.extname(pathname).toLowerCase();
};

// Function to get the duration of the audio file
const getAudioDuration = async (filePath: string): Promise<number> => {
  const { stdout } = await execAsync(`ffprobe -i ${filePath} -show_entries format=duration -v quiet -of csv="p=0"`);
  return parseFloat(stdout);
};

// Main transcription function
const startTranscription = async (url: string, audioPath: string, supabase: SupabaseClient, userId: string) => {
  // console.log('Downloading File');
  // await downloadFile(url, filePath);

  // console.log('Download Step Finished');
  const fileType = getFileType(url);

  let fileForTranscription = url;
  if (fileType === 'video') {
    console.log('Extracting Audio From Video');
    await extractAudioFromVideo(url, audioPath);
    console.log('Extraction Finished');
    fileForTranscription = audioPath;
  } else if (fileType !== 'audio') {
    throw new Error('Unsupported file type');
  }

  const segmentDuration = 20; // in seconds
  const audioDuration = await getAudioDuration(fileForTranscription);
  const numberOfSegments = Math.ceil(audioDuration / segmentDuration);

  const transcriptionArray = [];

  for (let i = 0; i < numberOfSegments; i++) {
    const startTime = i * segmentDuration;
    const endTime = Math.min((i + 1) * segmentDuration, audioDuration);
    const segmentPath = `${fileForTranscription}_segment_${i}.wav`;

    // Create a 20-second audio segment
    await execAsync(`ffmpeg -i ${fileForTranscription} -ss ${startTime} -t ${segmentDuration} -c copy ${segmentPath}`);

    // Transcribe each segment and store in the array
    const segmentTranscript = await transcribeSegment(segmentPath, startTime, endTime);
    transcriptionArray.push(segmentTranscript);
  }

  // Insert the array into Supabase
  const insertSuccess = await insertTranscription(url, transcriptionArray, supabase, userId);
  if (insertSuccess) {
    console.log('All transcriptions have been successfully inserted into Supabase.');
  }
};

// Function to transcribe a single segment
const transcribeSegment = async (segmentPath: string, startTime: number, endTime: number): Promise<{startTime: number, endTime: number, text: string}> => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);
  const audioStream: any = createReadStream(segmentPath);
  
  const resp = await openai.createTranscription(audioStream, 'whisper-1');
  const transcript = resp?.data?.text;

  return {
    startTime,
    endTime,
    text: transcript
  };
};

// Function to insert the transcribed array into Supabase
const insertTranscription = async (url: string, transcriptionArray: any[], supabase: SupabaseClient, userId: string): Promise<boolean> => {
  console.log('Inserting transcription to Supabase');

  const { error } = await supabase.from(tableName).insert({
    input_url: url,
    transcribed_data: transcriptionArray,
    user_id: userId
  });

  if (error) {
    console.error("Supabase Error:", error);
    return false;
  } else {
    console.log('Transcription inserted into Supabase successfully.');
    return true;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  const access_token = req?.headers?.authorization?.split(' ')[1] || '';
  const refresh_token = req?.headers['X-Refresh-Token'] || req?.headers['x-refresh-token'] || '';

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  let userId: string;
  try {
    const session = await supabase.auth.setSession({ access_token, refresh_token: ( typeof refresh_token === 'string' ) ? refresh_token : refresh_token[0] });
    if (!session?.data?.user?.id) throw new Error('Session Expired');
    userId = session?.data?.user?.id
  } catch (error) {
    return res.status(403).json({ error: 'Session Expired' });
  }

  const form = formidable({
    uploadDir: '/tmp',
    keepExtensions: true
  });

  const file: any = await new Promise((res, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        res(null)
      } else {
        if (files?.file && files?.file[0]) {
          res(files?.file[0])
        } else  {
          res(null);
        }
      }
    })
  })


  let url = file?.filepath;

  if (file && url && fs.existsSync(url)) {
    
    // const startIndex = url.indexOf('/tmp');
    // url = url.substring(startIndex);
    const alreadyExist = await supabase.from(tableName).select('*').filter('input_url', 'eq', url);
    if (alreadyExist?.data && alreadyExist?.data?.length) {
      return res.status(400).json({error: 'Already Exist'});
    }
  
    const fileExt = getFileExtension(url);
    // const filePath = path.join('/tmp', `downloadedFile${Date.now()}${fileExt}`); // Temporary file path
    const audioPath = path.join('/tmp', `audio${Date.now()}.wav`); // Temporary audio path
  
    try {
      startTranscription(url, audioPath, supabase, userId);
      res.setHeader('Content-Type', 'audio/mpeg'); // Adjust the content type based on your file type
      fs.createReadStream(url).pipe(res);
      res.status(200).json({
        message: 'File submitted for processing'
      });
    } catch (error) {
      console.error('server error', error);
      res.status(500).json({ error: 'Error' });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'File is required'
    })
  }
};

export default handler;