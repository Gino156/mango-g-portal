"use client";

import { useState } from 'react';
import { submitFeedback } from './actions/submit';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';

/** * UX Tip #1: Haptic Feedback Utility 
 * Gumagana sa mobile devices/PWA para sa native app feel.
 */
const triggerHaptic = (pattern: number | number[]) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/** * UX Tip #3: Loading Spinner Component
 * Mas "App Store" tignan kaysa sa plain text lang.
 */
const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

/** * UX Tip #5: Framer Motion Variants
 * FIXED: Inassign ang 'Variants' type para mawala ang TypeScript error sa "spring".
 */
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.1 } 
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setLoading(true);
    setError(null);
    triggerHaptic(40); // Light tap on click
    
    try {
      const result = await submitFeedback(formData);

      if (result && result.error) {
        // UX Tip #4: Human-centered Error Handling
        setError(result.error);
        setLoading(false);
        triggerHaptic([100, 50, 100]); // Double "error" vibrate
        return;
      }

      setIsSubmitted(true);
      triggerHaptic([60, 40]); // Success double-tap
      
      // Auto-reset after a while
      setTimeout(() => setIsSubmitted(false), 8000);
      
    } catch (err: any) {
      setError("Masyado ka nang madaldal! Chill muna. 🥭");
      triggerHaptic(200);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[#FBFBFD] selection:bg-orange-200">
      
      <motion.main 
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* UX Tip #2: Soft Shadows - Premium "floating" look */}
        <div className="overflow-hidden rounded-[48px] bg-white shadow-[0_25px_60px_-15px_rgba(255,150,0,0.18)] border border-zinc-100/50 relative">

          {/* Header */}
          <div className="flex flex-col items-center pt-16 pb-10 px-8 text-center">
            <div className="mb-8 relative group">
              <div className="absolute inset-0 rounded-[28px] bg-linear-to-br from-orange-400 to-red-500 blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700"></div>
              <div className="relative z-10 w-24 h-24 bg-linear-to-br from-yellow-300 to-orange-500 rounded-[28px] flex items-center justify-center shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="/mangoglogo.svg" 
                  alt="Mango G Logo"
                  width={65}
                  height={65}
                  priority
                  className="drop-shadow-sm"
                />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              Send your feedback, <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-600">
                Mango G will listen!
              </span>
            </h1>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400">
              Anonymous Feedback Portal
            </p>
          </div>

          {/* Form / Success Area */}
          <div className="px-8 pb-14">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="feedback-form"
                  action={handleAction} 
                  className="flex flex-col gap-5"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      name="nickname" 
                      placeholder="Nickname (Optional)"
                      className="w-full rounded-2xl bg-zinc-50 border border-zinc-100 px-6 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all placeholder:text-zinc-400"
                    />
                    
                    <textarea 
                      name="message" 
                      required
                      placeholder="Write your honest feedback..."
                      rows={5}
                      className="w-full rounded-3xl bg-zinc-50 border border-zinc-100 px-6 py-5 text-base font-medium outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all resize-none placeholder:text-zinc-400"
                    />
                  </div>

                  {error && (
                    <motion.div 
                      className="rounded-2xl bg-red-50 p-4 border border-red-100"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1, x: [0, -5, 5, -5, 5, 0] }}
                    >
                      <p className="text-[12px] font-bold text-red-600 text-center leading-tight">
                        ⚠️ {error}
                      </p>
                    </motion.div>
                  )}

                  <motion.button 
                    type="submit" 
                    disabled={loading}
                    className="relative group w-full overflow-hidden rounded-2xl bg-zinc-900 py-4 font-bold text-white transition-all active:scale-[0.97] disabled:opacity-70"
                    whileHover={{ y: -2 }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? <LoadingSpinner /> : "SEND FEEDBACK"}
                    </span>
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-screen"
                  className="py-10 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900">Sent!</h2>
                  <p className="text-zinc-500 font-medium mt-2">Mango G will review this shortly.</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-sm font-bold text-orange-600 hover:text-orange-700 underline-offset-4 hover:underline"
                  >
                    Send another one
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <motion.p 
          className="mt-8 text-center text-[12px] text-zinc-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Secure & Encrypted • v1.0.5
        </motion.p>
      </motion.main>
    </div>
  );
}