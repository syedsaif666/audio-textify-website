import {  AuthResponse, SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "@/types_db";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export const getSBSessionFromHeaders = async(headersList: ReadonlyHeaders, supabase: SupabaseClient): Promise<AuthResponse> => {
  const access_token = headersList.get('authorization')?.split(' ')[1] || '';
  const refresh_token = headersList.get('X-Refresh-Token') || headersList.get('x-refresh-token') || '';

  const session = await supabase.auth.setSession({ access_token, refresh_token: ( typeof refresh_token === 'string' ) ? refresh_token : refresh_token[0] });
  if (!session?.data?.user?.id) throw new Error('Session Expired');
  return session;
};

