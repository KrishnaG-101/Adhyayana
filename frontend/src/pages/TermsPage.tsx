import React from 'react';
import { Scroll, ShieldCheck, Scale, Award, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
            <Scroll size={13} />
            <span>Legal Documentation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-[#E4E4E7]">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Effective Date: September 7, 2026 &bull; Version 1.1.0 &bull; Platform: Adhyayana (अध्ययन)
          </p>
        </div>

        {/* Bespoke Hero SVG: Editorial Quill, Parchment & Balanced Scales */}
        <div className="shrink-0 w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-stone-100 to-indigo-50/50 dark:from-[#202024] dark:to-[#161618] border border-stone-200/80 dark:border-[#2E2E34] p-4 flex items-center justify-center shadow-inner">
          <svg
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-indigo-600 dark:text-indigo-400"
            aria-hidden="true"
          >
            {/* Ambient Background Glow */}
            <circle cx="80" cy="80" r="60" fill="currentColor" fillOpacity="0.07" />

            {/* Parchment Scroll Base */}
            <rect
              x="38"
              y="32"
              width="84"
              height="96"
              rx="8"
              className="fill-white dark:fill-[#202024] stroke-stone-300 dark:stroke-stone-700"
              strokeWidth="2.5"
            />
            {/* Parchment Text Lines */}
            <line x1="50" y1="48" x2="86" y2="48" className="stroke-stone-300 dark:stroke-stone-600" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="58" x2="110" y2="58" className="stroke-stone-300 dark:stroke-stone-600" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="68" x2="102" y2="68" className="stroke-stone-300 dark:stroke-stone-600" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="78" x2="94" y2="78" className="stroke-stone-300 dark:stroke-stone-600" strokeWidth="2" strokeLinecap="round" />

            {/* Balanced Scales of Justice */}
            <path
              d="M80 82V116M66 116H94"
              className="stroke-stone-500 dark:stroke-stone-400"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M60 92H100"
              className="stroke-indigo-600 dark:stroke-indigo-400"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Left Pan */}
            <path d="M60 92L54 104M60 92L66 104" className="stroke-indigo-500 dark:stroke-indigo-400" strokeWidth="1.5" />
            <path d="M50 104C50 108 70 108 70 104Z" className="fill-amber-400/30 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />
            {/* Right Pan */}
            <path d="M100 92L94 104M100 92L106 104" className="stroke-indigo-500 dark:stroke-indigo-400" strokeWidth="1.5" />
            <path d="M90 104C90 108 110 108 110 104Z" className="fill-amber-400/30 stroke-amber-500 dark:stroke-amber-400" strokeWidth="1.5" />

            {/* Editorial Feather Quill */}
            <path
              d="M124 24C124 24 108 34 102 54C96 74 92 84 92 84L97 86C97 86 102 78 110 68C118 58 126 46 126 24Z"
              className="fill-indigo-600 dark:fill-indigo-400 opacity-90"
            />
            <path
              d="M92 84L86 92L94 88"
              className="stroke-indigo-700 dark:stroke-indigo-300"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Structured Legal Terms Sections */}
      <div className="space-y-8 text-stone-700 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
        {/* Section 1: Use of Service */}
        <section className="p-6 sm:p-8 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Scroll size={18} />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#E4E4E7]">
              1. Acceptance & Use of the Platform
            </h2>
          </div>
          <p>
            By accessing or playing on <strong>Adhyayana (अध्ययन)</strong>, you agree to abide by these Terms and Conditions. Adhyayana is dedicated to linguistic inquiry, vocabulary acquisition, and morphological pedagogy under the <em>Vicharanashala</em> educational framework.
          </p>
          <p>
            Access is provided to you as an individual learner, educator, or scholar. You agree to use the platform solely for lawful educational, reflective, and recreational linguistic activities.
          </p>
        </section>

        {/* Section 2: Intellectual Property */}
        <section className="p-6 sm:p-8 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award size={18} />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#E4E4E7]">
              2. Intellectual Property & Pedagogical Curricula
            </h2>
          </div>
          <p>
            All linguistic engine mechanics, daily challenge sequences, morphological databases, semantic vector projection matrices, UI token designs, and editorial treatises authored by Adhyayana are the intellectual property of the project and its open-source contributors.
          </p>
          <p>
            Open-source software components are licensed under the MIT License as documented in the platform repository. Curated puzzle seed definitions and proprietary linguistic datasets may not be scraped, redistributed for commercial resale, or reverse-engineered to train uncredited commercial models.
          </p>
        </section>

        {/* Section 3: Fair Play & Academic Integrity */}
        <section className="p-6 sm:p-8 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Scale size={18} />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#E4E4E7]">
              3. Fair Play & Cognitive Integrity
            </h2>
          </div>
          <p>
            The essence of Adhyayana is <strong>deliberate inquiry</strong> and authentic active cognitive recall. To protect the competitive integrity of global leaderboards and classroom guilds:
          </p>
          <ul className="list-disc list-inside space-y-2 text-stone-600 dark:text-stone-400 pl-2">
            <li>Automated botting, client-side script injection, and automated dictionary flooding are strictly prohibited.</li>
            <li>Exploiting network telemetry or reverse-engineering daily solution hashes prior to scheduled release violates our fair play contract.</li>
            <li>Any accounts identified with fabricated completion times or automated inputs will be disqualified from competitive standings.</li>
          </ul>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="p-6 sm:p-8 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle size={18} />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#E4E4E7]">
              4. Disclaimer & Limitation of Liability
            </h2>
          </div>
          <p>
            The Adhyayana platform is provided on an "as is" and "as available" basis without express or implied warranties. While we strive for uncompromising pedagogical accuracy in etymologies, definitions, and semantic vector neighborhoods, linguistics is an evolving discipline.
          </p>
          <p>
            Under no circumstances shall Adhyayana or its maintainers be liable for any direct, indirect, or incidental damages arising out of the use or inability to use our platform or offline study modes.
          </p>
        </section>

        {/* Section 5: Modifications & Inquiries */}
        <section className="p-6 sm:p-8 rounded-2xl bg-stone-100/70 dark:bg-[#202024]/50 border border-stone-200/80 dark:border-[#2E2E34] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 dark:text-[#E4E4E7]">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Governance & Legal Inquiries</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            We reserve the right to revise these Terms periodically as new puzzle engines and synchronous multiplayer features activate. Continued use of the platform constitutes acceptance of the latest published revision. For inquiries, reach out through our official open-source repository discussions.
          </p>
        </section>
      </div>
    </div>
  );
};
