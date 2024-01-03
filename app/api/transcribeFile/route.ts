import { Database } from "@/types_db";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { Configuration, OpenAIApi } from 'openai';
import * as fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { createReadStream } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { stat, mkdir, writeFile } from "fs/promises";
import mime from "mime";
import { getSBSessionFromHeaders } from "@/utils/supabase-session";

const execAsync = promisify(exec);

const tableName = process.env.TABLE_NAME!;

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

// Write POST request for AppRouter in Next.js. I want x-refresh-token and authorization header
export async function POST(req: Request) {
  try {
    const headersList = headers();
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    let userId: string;
    try {
      const session = await getSBSessionFromHeaders(headersList, supabase);
      userId = session?.data?.user?.id as string;
    } catch (error) {
      return Response.json({ error: 'Session Expired' });
    }

    const body = await req.formData();

    const file = body.get("file") as Blob | null;
    if (!file) {
      return Response.json(
        { error: "File blob is required." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = `/tmp`;

    try {
      await stat(uploadDir);
    } catch (e: any) {
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error(
          "Error while trying to create directory when uploading a file\n",
          e
        );
        return Response.json(
          { error: "Something went wrong." },
          { status: 500 }
        );
      }
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}.${mime.getExtension(file.type)}`;
    try {
      await writeFile(`${uploadDir}/${filename}`, buffer);
    } catch (e) {
      console.error("Error while trying to upload a file\n", e);
      return Response.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }

    const url = `${uploadDir}/${filename}`;

    if (file && url && fs.existsSync(url)) {
      
      // const startIndex = url.indexOf('/tmp');
      // url = url.substring(startIndex);
      const alreadyExist = await supabase.from(tableName).select('*').filter('input_url', 'eq', url);
      if (alreadyExist?.data && alreadyExist?.data?.length) {
        return Response.json({error: 'Already Exist'}, {status: 400});
      }
    
      const fileExt = getFileExtension(url);
      // const filePath = path.join('/tmp', `downloadedFile${Date.now()}${fileExt}`); // Temporary file path
      const audioPath = path.join('/tmp', `audio${Date.now()}.wav`); // Temporary audio path
    
      try {
        startTranscription(url, audioPath, supabase, userId);
        return Response.json({
          message: 'File submitted for processing'
        }, {status: 200});
      } catch (error) {
        console.error('server error', error);
        return Response.json({ error: 'Error' }, {status: 500});
      }
    } else {
      return Response.json({ error: 'File is required' }, {status: 400});
    }

  } catch (err: any) {
    console.log(err);
    return new Response(
      JSON.stringify({ error: { statusCode: 500, message: err.message } }),
      {
        status: 500
      }
    );
  }
}