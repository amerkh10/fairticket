import { useState, useEffect } from 'react'
import { generateQRCells, QR_SIZE } from '../utils/qr.js'
import { msUntilActivation } from '../utils/storage.js'

const CELL_PX = 7 // px per QR cell

/** Countdown hook — returns null when expired */
function useCountdown(ms) {
  const [remaining, setRemaining] = useState(ms)
  useEffect(() => {
    if (ms <= 0) return
    const t = setInterval(() => setRemaining((r) => r - 1000), 1000)
    return () => clearInterval(t)
  }, [ms])
  if (remaining <= 0) return null
  const s = Math.floor(remaining / 1000)
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

export default function QRCodeCard({ ticketId, matchDateIso, compact = false }) {
  const cells = generateQRCells(ticketId)
  const msLeft = msUntilActivation(matchDateIso)
  const active = msLeft <= 0
  const countdown = useCountdown(active ? 0 : msLeft)

  const size = compact ? 90 : 120

  return (
    <div className="flex flex-col items-center gap-2">
      {/* QR grid */}
      <div
        className={`relative p-2 rounded-lg ${active ? 'bg-white' : 'bg-gray-800'}`}
        style={{ width: size, height: size }}
      >
        {!active && (
          <div className="absolute inset-0 rounded-lg flex items-center justify-center z-10
                          bg-gray-900/85 backdrop-blur-[1px]">
            <span className="text-[9px] text-gray-400 text-center leading-tight px-1">
              Activates<br />in 24h
            </span>
          </div>
        )}
        <div
          className="grid gap-0"
          style={{ gridTemplateColumns: `repeat(${QR_SIZE}, 1fr)` }}
        >
          {cells.map((v, i) => (
            <div
              key={i}
              style={{
                width: compact ? 5 : CELL_PX,
                height: compact ? 5 : CELL_PX,
                background: v ? (active ? '#111827' : '#4b5563') : 'transparent',
              }}
            />
          ))}
        </div>
      </div>

      {/* Status / countdown */}
      {active ? (
        <p className="text-emerald-400 text-xs font-semibold">✓ QR Active</p>
      ) : countdown ? (
        <div className="text-center">
          <p className="text-gray-500 text-[10px] mb-1">Activates in</p>
          <div className="flex gap-1">
            {[['d', countdown.d], ['h', countdown.h], ['m', countdown.m]].map(([unit, val]) => (
              <div key={unit} className="bg-gray-800 rounded px-1.5 py-0.5 text-center min-w-[28px]">
                <div className="font-mono font-bold text-orange-400 text-xs">
                  {String(val).padStart(2, '0')}
                </div>
                <div className="text-gray-600 text-[8px] uppercase">{unit}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
