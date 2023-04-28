import { supabase } from "../db/supabaseClient";

export default async function trackClickthrough(key: string) {
  const { error } = await supabase.rpc("increment_ref", { ref_key: key });
  if (error) console.error(error.message);
}
