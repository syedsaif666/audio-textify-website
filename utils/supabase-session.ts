import {  SupabaseClient } from "@supabase/supabase-js";

export const getSBSessionFromHeaders = async (supabase: SupabaseClient) => {
  const session = await supabase.auth.getSession();
  if (session?.error) throw new Error('Session Expired');
  return session;
};

