import React, { useState } from 'react';
import { Trophy, Medal, Flame } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');

  const leaders = [
    { rank: 1, name: 'Sanskritist_01', score: 2840, streak: 18, badges: 'Master of Cloze' },
    { rank: 2, name: 'LexicalVoyager', score: 2610, streak: 14, badges: 'Vector Cartographer' },
    { rank: 3, name: 'WordSmith99', score: 2390, streak: 12, badges: 'Etymology Guru' },
    { rank: 4, name: 'SyntaxPioneer', score: 2150, streak: 9, badges: 'Root Explorer' },
    { rank: 5, name: 'DeliberateMind', score: 1980, streak: 7, badges: 'Contexto Novice' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Trophy size={24} />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          Linguistic Leaderboard
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
          Recognizing consistent inquiry, accuracy, and active vocabulary growth.
        </p>

        {/* Timeframe Segmented Switcher */}
        <div className="flex items-center justify-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-1.5 rounded-2xl max-w-xs mx-auto mt-6">
          {(['weekly', 'monthly', 'all_time'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeframe(t)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                timeframe === t
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table Skeleton */}
      <div className="rounded-2xl glass-panel overflow-hidden">
        <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
          {leaders.map((player) => (
            <div
              key={player.rank}
              className="flex items-center justify-between p-4 sm:px-6 hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 text-center font-serif font-bold text-base text-stone-500">
                  {player.rank === 1 ? (
                    <Medal size={20} className="text-amber-500 mx-auto" />
                  ) : player.rank === 2 ? (
                    <Medal size={20} className="text-stone-400 mx-auto" />
                  ) : player.rank === 3 ? (
                    <Medal size={20} className="text-amber-700 mx-auto" />
                  ) : (
                    <span>#{player.rank}</span>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">{player.name}</h3>
                  <span className="text-xs text-stone-500 dark:text-stone-400">{player.badges}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <Flame size={14} className="fill-amber-500" />
                  <span>{player.streak}d</span>
                </div>
                <div className="text-right min-w-[70px]">
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {player.score.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-400 block">XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
