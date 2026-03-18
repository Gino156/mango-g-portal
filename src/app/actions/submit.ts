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

    // 2. Send to Discord - KAILANGAN NG AWAIT DITO
    // Dahil kung hindi, papatayin ni Vercel ang function bago pa makasend sa Discord
    try {
      const response = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: "🥭 New Mango G Feedback!",
            color: 0xFBBF24, 
            fields: [
              { name: "Sender", value: nickname, inline: true },
              { name: "Message", value: message }
            ],
            timestamp: new Date().toISOString()
          }]
        }),
      });
      
      if (!response.ok) console.error("Discord rejected the request");
    } catch (discordErr) {
      console.error("Discord Fetch Error:", discordErr);
    }

    return { success: true };
  } catch (err) {
    console.error("Critical Error:", err);
    return { error: "Failed to send feedback." };
  }
}