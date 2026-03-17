"use client";

import { useState } from 'react';
import { submitFeedback } from './actions/submit';

import Image from 'next/image';

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setLoading(true);
    setError(null);
    
    try {
      const result = await submitFeedback(formData);

      // 1. Check errors from Server Action (Supabase/Discord errors)
      if (result && result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // 2. Success logic
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
      
    } catch (err: any) {
      setError(err.message || "Masyado ka nang madaldal! Chill muna. 🥭");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 selection:bg-orange-100">
      <main className="w-full max-w-100 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="overflow-hidden rounded-[40px] bg-white/95 backdrop-blur-md shadow-2xl border border-zinc-100">
          
          {/* <div className="flex flex-col items-center pt-14 pb-8 px-8">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-yellow-400 to-orange-600 shadow-lg ring-4 ring-white">
              <span className="text-4xl">🥭</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tighter italic uppercase text-center">Mango G</h1>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Anonymous Feedback</p>
          </div>
           */}

           <div className="flex flex-col items-center pt-14 pb-8 px-8">
            <div className="mb-6 relative h-24 w-24 flex items-center justify-center">
              {/* Ang Ring/Background ng Logo */}
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-yellow-400 to-orange-600 shadow-lg ring-4 ring-white rotate-3"></div>
              

                  <div className="relative z-10 p-2">
                    <Image 
                      src="mangoglogo.svg"
                      alt="Mango G Logo"
                      width={80}
                      height={80}
                      priority
                      className="drop-shadow-md"
                    />
                  </div>
            </div>
  
              <h1 className="text-2xl font-black text-zinc-900 tracking-tighter italic uppercase text-center">
                Mango G
              </h1>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Anonymous Feedback
              </p>
            </div>

          

          <div className="px-10 pb-12">
            {!isSubmitted ? (
              <form action={handleAction} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  name="nickname" 
                  placeholder="Nickname (Optional)"
                  className="w-full rounded-2xl bg-zinc-50 border border-zinc-100 px-5 py-3 text-sm font-semibold outline-none focus:border-orange-400 transition-all"
                />
                <textarea 
                  name="message" 
                  required
                  placeholder="Write your anonymous feedback..."
                  rows={5}
                  className="w-full rounded-3xl bg-zinc-50 border border-zinc-100 px-5 py-4 text-base font-medium outline-none focus:border-orange-400 transition-all resize-none"
                />

                {/* Error Box UI */}
                {error && (
                  <div className="rounded-2xl bg-red-50 p-4 border border-red-100 animate-in shake duration-300">
                    <p className="text-[11px] font-bold text-red-600 uppercase text-center italic leading-tight">
                      ⚠️ {error}
                    </p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="mt-2 h-16 w-full rounded-full bg-zinc-950 text-white font-black text-xl hover:bg-black active:scale-[0.95] transition-all disabled:opacity-50"
                >
                  {loading ? "SENDING..." : "SEND!"}
                </button>
              </form>
            ) : (
              <div className="py-12 text-center animate-in zoom-in duration-500">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <h2 className="text-xl font-black italic uppercase text-zinc-900">Sent!</h2>
                <p className="text-sm font-bold text-zinc-400 mt-2">Salamat sa feedback!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}