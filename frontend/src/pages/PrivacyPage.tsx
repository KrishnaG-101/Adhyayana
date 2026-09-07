import React from 'react';
import { Shield, Lock, EyeOff, Database, Server, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-12">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return Home</span>
        </Link>
      </div>

      {/* Hero Header with Bespoke SVG Illustration */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-stone-200/80 dark:border-[#2E2E34]/80">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
            <Shield size={13} />
            <span>Privacy by Design</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-[#E4E4E7]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Effective Date: September 7, 2026 &bull; Version 1.1.0 &bull; Vicharanashala Trust Standard
          </p>
        </div>

        {/* Bespoke Hero SVG: Geometric Vault / Cryptographic Shield */}
        <div className="shrink-0 w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-emerald-50/50 via-stone-100 to-indigo-50/50 dark:from-[#161618] dark:via-[#202024] dark:to-[#161618] border border-stone-200/80 dark:border-[#2E2E34] p-4 flex items-center justify-center shadow-inner">
          <svg
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          >
            {/* Soft Ambient Radiance */}
            <circle cx="80" cy="80" r="55" className="fill-emerald-500/10 dark:fill-emerald-400/10" />

            {/* Hexagonal Geometric Vault Outline */}
            <polygon
              points="80,24 126,50 126,104 80,130 34,104 34,50"
              className="fill-white dark:fill-[#202024] stroke-stone-300 dark:stroke-stone-700"
              strokeWidth="2.5"
            />

            {/* Inner Shield Overlay */}
            <path
              d="M80 44V116C80 116 108 102 108 72V52L80 44Z"
              className="fill-emerald-600/15 dark:fill-emerald-400/20 stroke-emerald-600 dark:stroke-emerald-400"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M80 44V116C80 116 52 102 52 72V52L80 44Z"
              className="fill-indigo-600/10 dark:fill-indigo-400/15 stroke-indigo-600 dark:stroke-indigo-400"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Central Secure Keyhole / Padlock */}
            <circle cx="80" cy="74" r="8" className="fill-stone-800 dark:fill-stone-200" />
            <path
              d="M77 78L75 92H85L83 78"
              className="fill-stone-800 dark:fill-stone-200"
            />
            <circle cx="80" cy="74" r="3" className="fill-emerald-400 dark:fill-emerald-500" />
          </svg>
        </div>
      </div>

      {/* Structured Legal Privacy Sections */}
      <div className="space-y-8 text-stone-700 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
        {/* Section 1: Philosophy & Non-Monetization */}
        <section className="p-6 sm:p-8 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <EyeOff size={18} />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#E4E4E7]">
              1. Our Foundational Privacy Philosophy
            </h2>
          </div>
          <p>
            At <strong>Adhyayana</strong>, we believe educational technology should elevate the mind without surveilling the learner. We do not monetize through targeted advertising, do not profile users for commercial brokers, and will never sell personal or linguistic learning records.
          </p>
          <p>
            The telemetry we capture exists exclusively to compute semantic vector proximities, evaluate morphological deduction accuracy, and present learners with qualitative cognitive feedback.
          </p>
        </section>

        {/* Section 2: Data Collection */}
        <section className="p-6 sm:p-8 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Database size={18} />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#E4E4E7]">
              2. Data Collection: Anonymous Guests vs. Authenticated Accounts
            </h2>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-[#E4E4E7] text-sm mb-1">
                Anonymous Guest Sessions (Default)
              </h3>
              <p className="text-stone-600 dark:text-stone-400">
                You can play every single daily puzzle completely anonymously without providing an email address, name, or phone number. Guest game states and current streak tallies reside locally on your device within your browser's private storage.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-[#E4E4E7] text-sm mb-1">
                Authenticated User Accounts (Optional)
              </h3>
              <p className="text-stone-600 dark:text-stone-400">
                When you create an account to synchronize streaks across desktop and mobile devices, we collect your authentication credentials (email address or OAuth identifier verified via Firebase Authentication) and link your game history snapshots to your encrypted UID.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Cookie & Local Storage Usage */}
        <section className="p-6 sm:p-8 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Server size={18} />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#E4E4E7]">
              3. Local Storage & Functional Cookies
            </h2>
          </div>
          <p>
            Adhyayana avoids third-party advertising and tracking cookies. We utilize native browser storage (`localStorage` and session caches) strictly for essential functionality:
          </p>
          <ul className="space-y-2 text-stone-600 dark:text-stone-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>`adhyayana-theme`</strong>: Remembers your display theme mode (`system`, `light`, or `dark`).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Puzzle Session State</strong>: Preserves in-flight guesses so accidental reloads do not destroy your streak or progress.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Rules Modal Acknowledgment</strong>: Remembers whether you have inspected the pedagogical rules for a specific puzzle mechanic.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Data Retention & User Rights */}
        <section className="p-6 sm:p-8 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Lock size={18} />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#E4E4E7]">
              4. Data Retention, Security & Deletion Rights
            </h2>
          </div>
          <p>
            All communications with our FastAPI backend and Firebase persistence layers are encrypted in transit using industry-standard TLS 1.3 cryptographic protocols.
          </p>
          <p>
            You hold uncompromised dominion over your data. You may request the export or irreversible purging of your player account and all linked puzzle telemetry at any time by contacting our maintainer team or executing the deletion option within your account settings.
          </p>
        </section>
      </div>
    </div>
  );
};
