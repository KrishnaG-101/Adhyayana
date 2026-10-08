/**
 * LetterTileInput Component
 * Renders tactile letter tiles with locked fixed stems and auto-advancing blank inputs.
 */

import React, { useEffect, useRef, useState } from 'react';
import { CornerDownLeft, Lock } from 'lucide-react';

interface LetterTileInputProps {
  stem: string;
  onSubmit: (word: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  resetSignal?: number;
}

interface TileSlot {
  isFixed: boolean;
  char: string;
  blankIndex?: number;
}

export const LetterTileInput: React.FC<LetterTileInputProps> = ({
  stem,
  onSubmit,
  disabled = false,
  isLoading = false,
  resetSignal = 0,
}) => {
  // Parse stem into slot models
  const tokens = stem.replace(/\s+/g, '').split('');
  let blankCounter = 0;
  const slots: TileSlot[] = tokens.map((char) => {
    if (char === '_') {
      const idx = blankCounter++;
      return { isFixed: false, char: '', blankIndex: idx };
    }
    return { isFixed: true, char: char.toUpperCase() };
  });

  const totalBlanks = blankCounter;
  const [blankValues, setBlankValues] = useState<string[]>(() =>
    Array(totalBlanks).fill('')
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset inputs when stem changes or resetSignal fires
  useEffect(() => {
    setBlankValues(Array(totalBlanks).fill(''));
    // Focus first blank input
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [stem, resetSignal, totalBlanks]);

  // Construct formed word
  const formedWord = slots
    .map((slot) => {
      if (slot.isFixed) return slot.char;
      return blankValues[slot.blankIndex ?? 0] || '';
    })
    .join('');

  const isComplete =
    formedWord.length === slots.length &&
    blankValues.every((val) => val.trim().length === 1);

  const handleInputChange = (blankIdx: number, val: string) => {
    if (disabled || isLoading) return;
    const cleanLetter = val.slice(-1).toUpperCase();
    if (cleanLetter && !/^[A-Z]$/.test(cleanLetter)) return;

    const nextValues = [...blankValues];
    nextValues[blankIdx] = cleanLetter;
    setBlankValues(nextValues);

    // Auto-advance to next blank if letter was entered
    if (cleanLetter && blankIdx + 1 < totalBlanks) {
      inputRefs.current[blankIdx + 1]?.focus();
    }
  };

  const handleKeyDown = (
    blankIdx: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (!blankValues[blankIdx] && blankIdx > 0) {
        e.preventDefault();
        const nextValues = [...blankValues];
        nextValues[blankIdx - 1] = '';
        setBlankValues(nextValues);
        inputRefs.current[blankIdx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && blankIdx > 0) {
      e.preventDefault();
      inputRefs.current[blankIdx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && blankIdx + 1 < totalBlanks) {
      e.preventDefault();
      inputRefs.current[blankIdx + 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isComplete && !disabled && !isLoading) {
        onSubmit(formedWord);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete && !disabled && !isLoading) {
      onSubmit(formedWord);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto"
      data-testid="letter-tile-form"
    >
      {/* Letter Tiles Grid */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-2">
        {slots.map((slot, index) => {
          if (slot.isFixed) {
            return (
              <div
                key={`fixed-${index}`}
                data-testid={`tile-fixed-${index}`}
                className="relative w-12 h-14 sm:w-16 sm:h-20 rounded-2xl bg-stone-200/90 dark:bg-[#28282D] border-2 border-stone-300 dark:border-[#383840] flex flex-col items-center justify-center shadow-inner select-none transition-all"
                title="Fixed stem character"
              >
                <span className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-[#E4E4E7]">
                  {slot.char}
                </span>
                <span className="absolute bottom-1 text-[9px] font-mono tracking-tighter text-stone-400 dark:text-stone-500 uppercase flex items-center gap-0.5">
                  <Lock size={8} />
                </span>
              </div>
            );
          }

          const blankIdx = slot.blankIndex ?? 0;
          return (
            <div key={`blank-${blankIdx}`} className="relative">
              <input
                ref={(el) => {
                  inputRefs.current[blankIdx] = el;
                }}
                data-testid={`tile-blank-${blankIdx}`}
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                maxLength={1}
                value={blankValues[blankIdx]}
                disabled={disabled || isLoading}
                onChange={(e) => handleInputChange(blankIdx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(blankIdx, e)}
                aria-label={`Missing letter position ${index + 1}`}
                className="w-12 h-14 sm:w-16 sm:h-20 rounded-2xl bg-white dark:bg-[#161618] border-2 border-stone-300 dark:border-[#3E3E48] text-center font-serif font-bold text-2xl sm:text-3xl text-stone-900 dark:text-[#E4E4E7] shadow-xs focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 outline-none transition-all placeholder:text-stone-300 dark:placeholder:text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="•"
              />
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500">
                blank
              </span>
            </div>
          );
        })}
      </div>

      {/* Action / Submission Bar */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!isComplete || disabled || isLoading}
          data-testid="submit-guess-button"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-stone-200 dark:disabled:bg-stone-800 text-white disabled:text-stone-400 dark:disabled:text-stone-600 font-semibold text-sm shadow-sm hover:shadow-md disabled:shadow-none transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              <span>Verifying...</span>
            </span>
          ) : (
            <>
              <span>Submit Word</span>
              <span className="inline-flex items-center gap-0.5 text-xs bg-white/20 dark:bg-black/20 px-1.5 py-0.5 rounded font-mono">
                <CornerDownLeft size={11} />
                <span>Enter</span>
              </span>
            </>
          )}
        </button>

        {blankValues.some((v) => v !== '') && (
          <button
            type="button"
            onClick={() => {
              setBlankValues(Array(totalBlanks).fill(''));
              inputRefs.current[0]?.focus();
            }}
            disabled={disabled || isLoading}
            className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline underline-offset-4 px-2 py-1 transition-colors"
          >
            Clear Blanks
          </button>
        )}
      </div>
    </form>
  );
};
