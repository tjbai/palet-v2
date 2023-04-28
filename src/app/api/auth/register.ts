import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient("your-supabase-url", "your-supabase-anon-key");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;
  const password_hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const { data, error } = await supabase
    .from("users")
    .upsert({ email, password_hash });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, data });
}
