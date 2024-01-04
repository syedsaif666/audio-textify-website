import { cookies, headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
// import OpenAI from 'openai';
import { Configuration, OpenAIApi } from 'openai';
import { AxiosError } from 'axios';
import { getSBSessionFromHeaders } from "@/utils/supabase-session";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { OpenAIStream, StreamingTextResponse } from 'ai';

const tableName = process.env.TABLE_NAME!;
const supabaseUrl= process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const apiKey = process.env.OPENAI_API_KEY;
const systemMessage = 'You are a helpful assistant.';
export const runtime = 'edge';

export async function POST(req: any, { params }: {
  params: {
    openAiTask: string,
    transcriptionId: string,
    type: string,
  }
}) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    await getSBSessionFromHeaders(supabase);

    const transcriptionList = await supabase.from(tableName).select().eq('id', params.transcriptionId);

    if (!transcriptionList?.data?.length) {
      return Response.json({ success: false, message: "Transcription not found" }, { status: 404 });
    }

    const transcription = transcriptionList?.data[0];
    const transcriptionText = transcription?.transcribed_data?.map((v: any) => v.text).join(" ");

    console.log("Original Transcription Text:", transcriptionText);

    switch (params.openAiTask.toLowerCase()) {
      case 'summarize':
        return await summarizeText(transcriptionText);
        break;
      case 'translate':
        return await translateText(transcriptionText, params.type || 'en');
        break;
      case 'generate':
        return await generateText(transcriptionText, params.type || 'tweet');
        break;
      default:
        throw new Error(`Unsupported type: ${params.openAiTask}`);
    }

  } catch (error) {
    console.error((error as AxiosError)?.response?.data || error);
    return Response.json({ success: false});
  }
}

const summarizeText = async (text: string): Promise<any> => {
  const prompt = `Summarize the following text:\n${text}`;

  return await openAiOperation(systemMessage, prompt);
}

const translateText = async (text: string, language: string) => {
  const prompt = `You will be provided with a sentence in English, and your task is to translate it into ${language}:\n"${text}"`;

  return await openAiOperation(systemMessage, prompt)
}

const generateText = async (text: string, genType: string) => {
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


// const openAiOperation = async (systemMessage: string, prompt: string) => {
//   const openai = new OpenAI({ apiKey });

//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     stream: true,
//     messages: [{ role: 'system', content: systemMessage }, { role: 'user', content: prompt }]
//   })

//   const stream = OpenAIStream(response, {
//     onCompletion:async (completion:string) => {
//         await console.log('Chat completed')
//     }
//   })
//   // Respond with the stream
//   return new StreamingTextResponse(stream)
// };




const openAiOperation = async (systemMessage: string, prompt: string): Promise<StreamingTextResponse> => {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  const apiRequestBody = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: systemMessage }, { role: 'user', content: prompt }],
    stream: true
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(apiRequestBody)
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
};
