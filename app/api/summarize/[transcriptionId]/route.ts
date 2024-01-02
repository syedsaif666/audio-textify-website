import { headers } from "next/headers";
import {  createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { Configuration, OpenAIApi } from 'openai';
import { AxiosError } from 'axios';

const tableName = process.env.TABLE_NAME!;


export async function GET(req: any, {params}: {params:{transcriptionId: string}}){
  const headersList = headers();
  const access_token = headersList.get('authorization')?.split(' ')[1] || '';
  const refresh_token = headersList.get('X-Refresh-Token') || headersList.get('x-refresh-token') || '';

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  try {
    const session = await supabase.auth.setSession({ access_token, refresh_token: ( typeof refresh_token === 'string' ) ? refresh_token : refresh_token[0] });
    if (!session?.data?.user?.id) throw new Error('Session Expired');

    const transcriptionList  = await supabase.from(tableName).select().eq('id', params.transcriptionId);

    if (!transcriptionList?.data?.length) {
      return Response.json({success: false, message: "Transcription not found"}, {status: 404})
    }

    const transcription = transcriptionList?.data[0];

    const transcriptionText = transcription?.transcribed_data?.map((v: any) => v.text).join(" ");


    console.log("Original Transcription Text:", transcriptionText);

    const summary = await summarizeText(transcriptionText);

    console.log("Summary:", summary);

    return Response.json({ success: true, summary });


  } catch (error) {
    console.error((error as AxiosError)?.response?.data || error);

    return Response.json({ error: 'Session Expired' });
  }
}

async function summarizeText(text: string): Promise<any> {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const prompt = `Summarize the following text:\n${text}`;

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
  });

  const responseData = response.data;

  if (!responseData.choices || responseData.choices.length === 0) {
    throw new Error('No choices found in the OpenAI response');
  }

  return responseData.choices[0]?.message?.content?.trim() || '';
}