import { headers } from "next/headers";
import {  createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { Configuration, OpenAIApi } from 'openai';
import { AxiosError } from 'axios';

const tableName = process.env.TABLE_NAME!;


export async function GET(req: any, {params}: {params:{transcriptionId: string, type: string}}){
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
    const generatedText = await generateText(transcriptionText, params.type);

    console.log(`Generated ${params.type} text:`, generatedText);

    return Response.json({ success: true, generatedText });


  } catch (error) {
    console.error((error as AxiosError)?.response?.data || error);
    return Response.json({ error: 'Session Expired' });
  }
}

async function generateText(text: string, type: string): Promise<string> {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  let systemMessage = '';

  switch (type.toLowerCase()) {
    case 'tweet':
      systemMessage = 'You will be provided with a sentence in English, and your task is to generate a content for tweet out of it"';
      break;
    case 'presentation':
      systemMessage = 'You will be provided with a sentence in English, and your task is to generate presentation content:';
      break;

    default:
      throw new Error(`Unsupported type: ${type}`);
  }

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: systemMessage }, { role: 'user', content: text }],
  });

  const responseData = response.data;

  if (!responseData.choices || responseData.choices.length === 0) {
    throw new Error('No choices found in the OpenAI response');
  }

  const generatedText = responseData.choices[0]?.message?.content?.trim() || '';

  return generatedText;
}