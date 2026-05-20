import { MATCHES } from '../data/matches.js'
import MatchCard from '../components/MatchCard.jsx'

export default function Home() {
  return (
    <div className="animate-fade-in">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden mb-10 pitch-bg
                      bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800
                      border border-gray-800 p-8 sm:p-12">
        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 20% 50%, #f97316 0%, transparent 60%), ' +
              'radial-gradient(ellipse at 80% 50%, #3b82f6 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="animate-pulse-dot w-2 h-2 bg-emerald-400 rounded-full inline-block" />
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
              Live Platform · Anti-Scalping Active
            </span>
          </div>
          <h1 className="font-condensed font-black text-5xl sm:text-7xl uppercase leading-none mb-3">
            Real Fans.<br />
            <span className="text-orange-500">Real Prices.</span>
          </h1>
          <p className="text-gray-400 max-w-lg text-base leading-relaxed">
            Every ticket is cryptographically linked to your identity.
            No bots. No scalpers. Just football.
          </p>
        </div>

        {/* Trust badges */}
        <div className="absolute right-6 top-6 hidden lg:flex flex-col gap-2">
          {['🛡️ ID Verified', '🤖 Bot Detection', '💳 +15% Price Cap'].map((t) => (
            <span
              key={t}
              className="text-xs bg-gray-800/80 border border-gray-700 px-3 py-1.5
                         rounded-full text-gray-300 text-right"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Match list ─────────────────────────────────────────────────────── */}
      <h2 className="font-condensed font-bold text-2xl uppercase tracking-wide text-gray-300 mb-4">
        Upcoming Matches
      </h2>

      <div className="grid gap-4">
        {MATCHES.map((match, i) => (
          <MatchCard key={match.id} match={match} delay={i * 70} />
        ))}
      </div>
    </div>
  )
}
