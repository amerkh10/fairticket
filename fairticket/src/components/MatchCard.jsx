import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice, formatDate } from '../utils/storage.js'
import { getMinPrice, getAvailableSeats, getFillPct } from '../data/matches.js'

export default function MatchCard({ match, delay = 0 }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const available = getAvailableSeats(match)
  const fill = getFillPct(match)
  const minPrice = getMinPrice(match)

  const barColor =
    fill > 0.9 ? '#ef4444' : fill > 0.7 ? '#f97316' : '#22c55e'
  const seatLabel =
    available === 0
      ? 'Sold Out'
      : available < 50
      ? `${available} left — Hurry!`
      : available < 300
      ? `${available} seats left`
      : `${available} seats available`
  const seatColor =
    available === 0
      ? 'text-red-400'
      : available < 50
      ? 'text-orange-400'
      : 'text-emerald-400'

  return (
    <div
      className="card overflow-hidden hover:border-gray-700 transition-all duration-200 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Main row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full p-5 sm:p-6 text-left"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Teams */}
          <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl">{match.homeFlag}</span>
              <span className="font-condensed font-black text-lg sm:text-xl uppercase truncate">
                {match.home}
              </span>
            </div>
            <span className="font-condensed font-black text-orange-500 text-xl flex-shrink-0">
              VS
            </span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-condensed font-black text-lg sm:text-xl uppercase truncate">
                {match.away}
              </span>
              <span className="text-2xl">{match.awayFlag}</span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-col items-end gap-1 text-right flex-shrink-0">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full text-white ${match.tagColor}`}>
              {match.tag}
            </span>
            <span className="text-xs text-gray-400">{formatDate(match.date)}</span>
            <span className="text-xs text-gray-500 hidden sm:block">{match.venue}</span>
          </div>
        </div>

        {/* Availability bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${fill * 100}%`, background: barColor }}
            />
          </div>
          <span className={`text-xs font-semibold whitespace-nowrap ${seatColor}`}>
            {seatLabel}
          </span>
          <span className="text-xs text-gray-600 hidden sm:block whitespace-nowrap">
            from {formatPrice(minPrice)}
          </span>
          <span className="text-gray-500 text-sm ml-1">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Zone selector (expanded) */}
      {expanded && (
        <div className="border-t border-gray-800 bg-gray-950/60 p-5 sm:p-6 animate-fade-in">
          <p className="label mb-3">Select Zone</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {Object.entries(match.seats).map(([zone, seat]) => {
              const avail = seat.total - seat.sold
              const soldOut = avail === 0
              return (
                <button
                  key={zone}
                  disabled={soldOut}
                  onClick={() => navigate(`/buy/${match.id}/${zone}`)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-200
                    ${soldOut
                      ? 'border-gray-800 opacity-40 cursor-not-allowed'
                      : 'border-gray-700 hover:border-orange-500 hover:bg-orange-500/5 glow-orange cursor-pointer'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-condensed font-bold text-base uppercase">{zone}</span>
                    {soldOut && (
                      <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded font-semibold">
                        SOLD OUT
                      </span>
                    )}
                  </div>
                  <div className="font-condensed font-black text-2xl text-orange-500">
                    {formatPrice(seat.price)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{avail} seats</div>
                  {!soldOut && (
                    <div className="text-xs text-blue-400 mt-2 font-semibold">→ Buy Now</div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
