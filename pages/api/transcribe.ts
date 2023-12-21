import { Configuration, OpenAIApi } from 'openai';
import * as fs from 'fs';
import axios, { AxiosError } from 'axios';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { Database } from '@/types_db';
import { AuthResponse, SupabaseClient, createClient } from '@supabase/supabase-js';

const tableName = process.env.TABLE_NAME!;

const downloadFile = async (fileUrl: any, outputLocationPath: any) => {
  const writer = fs.createWriteStream(outputLocationPath);

  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then((response: any) => {
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  });
};

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

const getFileExtension = (urlString: string) => {
  // Parse the URL to get the pathname
  const parsedUrl = new URL(urlString);
  const pathname = parsedUrl.pathname;

  // Use path.extname to extract the extension from the pathname
  return path.extname(pathname).toLowerCase();
};

const startTranscription = async (url: string, filePath: string, audioPath: string, supabase: SupabaseClient, userId: string) => {
  console.log('Downloading File');
  await downloadFile(url, filePath);

  console.log('Download Step Finished');
  const fileType = getFileType(url);

  let fileForTranscription = filePath;
  if (fileType === 'video') {
    console.log('Extracting Audio From Video');
    await extractAudioFromVideo(filePath, audioPath);
    console.log('Extraction Finished');
    fileForTranscription = audioPath;
  } else if (fileType !== 'audio') {
    throw new Error('Unsupported file type');
  }

  console.log('Starting transcription now');
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);
  const audioStream: any = fs.createReadStream(fileForTranscription);
  openai.createTranscription(
    audioStream,
    'whisper-1'
  ).then(async (resp) => {
    const transcript = resp?.data?.text;

    // Content moderation check
    const response = await openai.createModeration({
      input: transcript,
    });

    if (response?.data?.results[0]?.flagged) {
      console.error({ error: 'Inappropriate content detected. Please try again.' });
      return;
    }
    console.log('Inserting transcription to supabase');

    const { error } = await supabase.from(tableName).insert({
      input_url: url,
      transcribed_data: transcript,
      user_id: userId
    });
    if (error ) {
      console.error("Supabase Error", error);
    } else {
      console.log('Inserting transcription to supabase done');
    }
  }).catch((e: AxiosError | any) => console.error('Exception: ', e));
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
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
  const url = req.body.url;
  const alreadyExist = await supabase.from(tableName).select('*').filter('input_url', 'eq', url);
  if (alreadyExist?.data && alreadyExist?.data?.length) {
    return res.status(400).json({error: 'Already Exist'});
  }


  const fileExt = getFileExtension(url);
  const filePath = path.join('/tmp', `downloadedFile${Date.now()}${fileExt}`); // Temporary file path
  const audioPath = path.join('/tmp', `audio${Date.now()}.wav`); // Temporary audio path

  try {
    startTranscription(url, filePath, audioPath, supabase, userId);

    res.status(200).json({message: 'URL submitted for processing'});
  } catch (error) {
    console.error('server error', error);
    res.status(500).json({ error: 'Error' });
  }
};

export default handler;