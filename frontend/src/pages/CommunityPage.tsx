import React, { useState } from 'react';
import { Users, Swords, Shield, Zap, Sparkles, Trophy, ArrowRight, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CommunityPage: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [isSearchingMatch, setIsSearchingMatch] = useState(false);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    // Real-time WebSocket matchmaking will connect in future phases
    alert(`Connecting to room ${roomCode.trim().toUpperCase()}... (Multiplayer WebSocket engine activates in Phase 5)`);
  };

  const handleQuickMatch = () => {
    setIsSearchingMatch(true);
    setTimeout(() => {
      setIsSearchingMatch(false);
      alert('Matchmaking queue simulated: Real-time multiplayer battles launch in Phase 5!');
    }, 1500);
  };

  const activeTournaments = [
    {
      id: 'tourney-1',
      title: 'Weekly Etymology Gauntlet',
      participants: 1240,
      reward: '5,000 XP + Master Lexicographer Badge',
      timeLeft: '1d 14h',
      status: 'Live',
    },
    {
      id: 'tourney-2',
      title: 'Vicharanashala Speed Synonyms',
      participants: 872,
      reward: '3,000 XP + Scholar Ribbon',
      timeLeft: '3d 8h',
      status: 'Live',
    },
    {
      id: 'tourney-3',
      title: 'Morphological Blitz Championship',
      participants: 450,
      reward: '10,000 XP + Grandmaster Laurel',
      timeLeft: 'Starts Friday',
      status: 'Upcoming',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
          <Users size={14} />
          <span>Vicharanashala Guilds & Multiplayer</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Community Arena
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-base sm:text-lg leading-relaxed">
          Challenge fellow scholars in real-time synchronous linguistic duels, join study circles, and climb collective guild leaderboards.
        </p>
      </div>

      {/* Duel & Matchmaking Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Match Battle */}
        <div className="p-8 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/70 dark:border-stone-800/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Swords size={24} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Synchronous Quick Battle
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Match against a player with an equivalent ELO score. Race against the clock to decipher anagrams, solve word chains, and verify definitions.
            </p>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={handleQuickMatch}
              disabled={isSearchingMatch}
              className="w-full py-3.5 px-6 rounded-2xl font-medium text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearchingMatch ? (
                <>
                  <Radio size={18} className="animate-pulse text-white" />
                  <span>Searching for opponent...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Find 1v1 Ranked Match</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Private Room / Party Code */}
        <div className="p-8 rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/70 dark:border-stone-800/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Shield size={24} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Private Match Room
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              Create a custom room or enter an alphanumeric room code shared by your peer, teacher, or study group to start a tailored linguistic challenge.
            </p>
          </div>

          <form onSubmit={handleJoinRoom} className="pt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. LEXICON-409"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={12}
              className="flex-1 px-4 py-3 rounded-2xl text-sm bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="py-3 px-6 rounded-2xl font-medium text-sm transition-all flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900"
            >
              <span>Join Room</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Tournaments & Gauntlets */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              Active Tournaments
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              Global asynchronous and scheduled competitive formats with curated seed puzzles.
            </p>
          </div>
          <Link
            to="/leaderboard"
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>View Rankings</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTournaments.map((tourney) => (
            <div
              key={tourney.id}
              className="p-6 rounded-3xl bg-white/60 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60 backdrop-blur-md space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-medium ${
                      tourney.status === 'Live'
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {tourney.status}
                  </span>
                  <span className="text-stone-500 dark:text-stone-400">{tourney.timeLeft}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  {tourney.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <Trophy size={14} className="text-amber-500" />
                  <span>{tourney.reward}</span>
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>{tourney.participants.toLocaleString()} scholars registered</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">Enter &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pedagogical Study Circle Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/60 dark:border-indigo-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles size={14} />
            <span>Vicharanashala Study Circles</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            Host a Classroom or Guild Session
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
            Educators and reading groups can generate synchronous lobby sessions with synchronized puzzle progression, private telemetry, and error-pattern analytics.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Classroom study circles will be enabled in Phase 5: Multiplayer & Community.')}
          className="whitespace-nowrap px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm"
        >
          Create Study Circle
        </button>
      </div>
    </div>
  );
};
