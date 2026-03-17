"use server";

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function submitFeedback(formData: FormData) {
  const nickname = formData.get("nickname") || `Guest_${Math.floor(Math.random() * 8999) + 1000}`;
  const message = formData.get("message") as string;

  if (!message || message.length < 3) {
    return { error: "Message is too short!" };
  }

  try {
    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from('feedback')
      .insert([{ nickname, message }]);

    if (dbError) throw dbError;

    // 2. Send to Discord
    // Hindi natin kailangan i-await ito para mabilis ang loading ng user
    fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: "🥭 New Mango G Feedback!",
          color: 0xFBBF24, // Amber/Mango Yellow
          fields: [
            { name: "Sender", value: nickname, inline: true },
            { name: "Message", value: message }
          ],
          timestamp: new Date().toISOString()
        }]
      }),
    }).catch(err => console.error("Discord Error:", err));

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Failed to send feedback." };
  }
}