"use client";

import { useState } from 'react';
import { submitFeedback } from './actions/submit';

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    const result = await submitFeedback(formData);
    setLoading(false);

    if (result.success) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <main className="w-full max-w-100 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="overflow-hidden rounded-[40px] bg-white/95 backdrop-blur-md shadow-2xl">
          
          <div className="flex flex-col items-center pt-14 pb-8 px-8">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-yellow-400 to-orange-600 shadow-lg ring-4 ring-white">
              <span className="text-4xl">🥭</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tighter italic uppercase">Mango G</h1>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Anonymous Feedback</p>
          </div>

          <div className="px-10 pb-12">
            {!isSubmitted ? (
              <form action={handleAction} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  name="nickname" 
                  placeholder="Nickname (Optional)"
                  className="w-full rounded-2xl bg-zinc-100 px-5 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-400/20 transition-all"
                />
                <textarea 
                  name="message" 
                  required
                  placeholder="Write your anonymous feedback..."
                  rows={5}
                  className="w-full rounded-3xl bg-zinc-100 px-5 py-4 text-base font-medium outline-none focus:ring-2 focus:ring-orange-400/20 transition-all resize-none"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="mt-4 h-16 w-full rounded-full bg-black text-white font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? "SENDING..." : "SEND!"}
                </button>
              </form>
            ) : (
              <div className="py-12 text-center animate-in zoom-in duration-500">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <h2 className="text-xl font-black italic uppercase">Sent!</h2>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}