import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { Configuration, OpenAIApi } from 'openai';
import { AxiosError } from 'axios';
import { getSBSessionFromHeaders } from "@/utils/supabase-session";

const tableName = process.env.TABLE_NAME!;
const supabaseUrl= process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const apiKey = process.env.OPENAI_API_KEY;
const systemMessage = 'You are a helpful assistant.';

export async function GET(req: any, { params }: {
  params: {
    openAiTask: string,
    transcriptionId: string,
    type: string,
  }
}) {
  const headersList = headers();
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  try {
    await getSBSessionFromHeaders(headersList, supabase);

    const transcriptionList = await supabase.from(tableName).select().eq('id', params.transcriptionId);

    if (!transcriptionList?.data?.length) {
      return Response.json({ success: false, message: "Transcription not found" }, { status: 404 });
    }

    const transcription = transcriptionList?.data[0];
    const transcriptionText = transcription?.transcribed_data?.map((v: any) => v.text).join(" ");

    console.log("Original Transcription Text:", transcriptionText);

    let result;

    switch (params.openAiTask.toLowerCase()) {
      case 'summarize':
        result = await summarizeText(transcriptionText);
        console.log('Summarized:', result);
        break;
      case 'translate':
        result = await translateText(transcriptionText, params.type || 'en');
        console.log(`Translated to ${params.type}:`, result);
        break;
      case 'generate':
        result = await generateText(transcriptionText, params.type || 'tweet');
        console.log(`Generated ${params.type || 'tweet-or-thread'} text:`, result);
        break;
      default:
        throw new Error(`Unsupported type: ${params.openAiTask}`);
    }

    return Response.json({ success: true, result });

  } catch (error) {
    console.error((error as AxiosError)?.response?.data || error);
    return Response.json({ success: false});
  }
}

const summarizeText = async (text: string): Promise<any> => {
  const prompt = `Summarize the following text:\n${text}`;

  return await openAiOperation(systemMessage, prompt);
}

const translateText = async (text: string, language: string): Promise<string> => {
  const prompt = `You will be provided with a sentence in English, and your task is to translate it into ${language}:\n"${text}"`;

  return await openAiOperation(systemMessage, prompt)
}

const generateText = async (text: string, genType: string): Promise<string> => {
  let prompt = '';

  switch (genType.toLowerCase()) {
    case 'tweet-or-thread':
      prompt = `You will be provided with a sentence, and your task is to generate a content for tweet or a thread out of it: \n"${text}"`;
      break;
    case 'article':
      prompt = `You will be provided with a sentence, and your task is to generate article: \n"${text}"`;
      break;
    case 'more-details':
      prompt = `You will be provided with a sentence, and your task is to generate more details about the given content: \n"${text}"`;
      break;
    case 'presentation':
      prompt = `You will be provided with a sentence, and your task is to generate presentation content: \n"${text}"`;
      break;
    case 'note-or-memo':
      prompt = `You will be provided with a sentence, and your task is to generate a more or a memo out of it: \n"${text}"`;
      break;
    case 'major-themes':
      prompt = `You will be provided with a sentence, and your task is to generate major themes of the given content: \n"${text}"`;
      break;
    case 'keywords':
      prompt = `You will be provided with a sentence, and your task is to generate keywords out of it: \n"${text}"`;
      break;
    default:
      throw new Error(`Unsupported type: ${genType}`);
  }

  return await openAiOperation(systemMessage, prompt)
}


const openAiOperation = async (systemMessage: string, prompt: string) => {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: systemMessage }, { role: 'user', content: prompt }],
  });

  const responseData = response.data;

  if (!responseData?.choices || responseData?.choices?.length === 0) {
    throw new Error('No choices found in the OpenAI response');
  }

  const assistantReply = responseData.choices[0]?.message?.content || '';
  const result = assistantReply.replace(/^.*?:\s/, '');

  return result.trim();

};
