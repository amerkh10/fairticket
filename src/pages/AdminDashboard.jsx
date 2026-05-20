import { useState, useEffect } from 'react'
import { getTickets, formatPrice, formatDate } from '../utils/storage.js'
import { MATCHES, getFillPct, getTotalSold, getTotalSeats } from '../data/matches.js'
import SuspiciousChart from '../components/SuspiciousChart.jsx'

// ── Simulated threat log seed ─────────────────────────────────────────────────
const SEED_THREATS = [
  { time: '14:32:01', ip: '185.220.101.42', action: '5 tickets bought in 30s',     risk: 'CRITICAL', blocked: true  },
  { time: '14:31:44', ip: '91.108.56.17',   action: 'Repeated CIN pattern',         risk: 'HIGH',     blocked: true  },
  { time: '14:30:12', ip: '45.33.32.156',   action: 'VPN / Proxy detected',          risk: 'MEDIUM',   blocked: false },
  { time: '14:29:55', ip: '198.51.100.7',   action: 'Rapid form submissions',        risk: 'HIGH',     blocked: true  },
  { time: '14:28:30', ip: '203.0.113.99',   action: 'Known scalper fingerprint',     risk: 'CRITICAL', blocked: true  },
]

const RANDOM_IPS = ['91.108.56.18','185.220.101.55','45.33.32.200','172.16.0.77','10.0.0.99','192.168.1.200']
const RANDOM_ACTIONS = [
  'Multiple accounts same device',
  'Unusual purchase velocity',
  'Headless browser detected',
  'CAPTCHA bypass attempt',
  'Suspicious geolocation jump',
  'Rate limit hit × 10',
]

const RISK_STYLE = {
  CRITICAL: 'text-red-400 bg-red-900/40 border border-red-900',
  HIGH:     'text-orange-400 bg-orange-900/30 border border-orange-900',
  MEDIUM:   'text-yellow-400 bg-yellow-900/20 border border-yellow-900',
}

// ── Simulated chart data factory ──────────────────────────────────────────────
function makeChartData(tick, fn) {
  return Array.from({ length: 20 }, (_, i) => Math.max(0, Math.round(fn(i, tick))))
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([])
  const [threats, setThreats] = useState(SEED_THREATS)
  const [tick, setTick] = useState(0)

  // Poll localStorage for new tickets
  useEffect(() => {
    setTickets(getTickets())
    const poll = setInterval(() => setTickets(getTickets()), 2000)
    return () => clearInterval(poll)
  }, [])

  // Simulate live threat activity
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1)
      if (Math.random() > 0.6) {
        setThreats((prev) => [
          {
            time: new Date().toLocaleTimeString(),
            ip:   RANDOM_IPS[Math.floor(Math.random() * RANDOM_IPS.length)],
            action: RANDOM_ACTIONS[Math.floor(Math.random() * RANDOM_ACTIONS.length)],
            risk:    ['HIGH', 'MEDIUM', 'CRITICAL'][Math.floor(Math.random() * 3)],
            blocked: Math.random() > 0.35,
          },
          ...prev.slice(0, 14),
        ])
      }
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Chart datasets
  const requestData = makeChartData(tick, (i, t) => 10 + Math.sin((i + t) * 0.5) * 8 + Math.random() * 14)
  const botData     = makeChartData(tick, (i, t) => 3  + Math.cos((i + t) * 0.7) * 3 + Math.random() *  6)
  const blockData   = makeChartData(tick, (i, t) => 1  + Math.abs(Math.sin((i + t) * 0.9)) * 5 + Math.random() * 3)

  // KPIs
  const totalRevenue   = tickets.reduce((a, t) => a + t.price, 0)
  const resales        = tickets.filter((t) => t.forSale).length
  const blockedCount   = threats.filter((t) => t.blocked).length

  const kpis = [
    { label: 'Tickets Sold',     value: tickets.length,       sub: 'This session',                    color: 'text-orange-500', icon: '🎟️' },
    { label: 'Revenue',          value: formatPrice(totalRevenue), sub: 'All zones combined',          color: 'text-emerald-400', icon: '💰' },
    { label: 'Resale Listings',  value: resales,              sub: 'Capped at +15%',                  color: 'text-blue-400',   icon: '🔄' },
    { label: 'Threats Blocked',  value: blockedCount,         sub: 'AI detection · live feed',        color: 'text-red-400',    icon: '🤖' },
  ]

  return (
    <div className="animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-condensed font-black text-3xl uppercase">
            Admin <span className="text-orange-500">Dashboard</span>
          </h2>
          <p className="text-gray-500 text-sm">Real-time bot detection &amp; scalping prevention</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-900 border border-emerald-900/50
                        px-4 py-2.5 rounded-xl">
          <span className="animate-pulse-dot w-2 h-2 bg-emerald-400 rounded-full inline-block" />
          <span className="text-emerald-400 text-sm font-semibold">AI Shield Active</span>
        </div>
      </div>

      {/* ── KPI cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, sub, color, icon }) => (
          <div key={label} className="card p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-widest leading-tight">
                {label}
              </span>
              <span className="text-xl">{icon}</span>
            </div>
            <div className={`font-condensed font-black text-2xl ${color}`}>{value}</div>
            <div className="text-xs text-gray-600 mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts ─────────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        {[
          { data: requestData, label: 'Purchase Requests / 2.5s', color: '#3b82f6' },
          { data: botData,     label: 'Suspected Bot Traffic',     color: '#ef4444' },
          { data: blockData,   label: 'Blocked Transactions',      color: '#f97316' },
        ].map((c) => (
          <div key={c.label} className="card p-5">
            <SuspiciousChart {...c} />
          </div>
        ))}
      </div>

      {/* ── Match availability + Threat log ────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Match fills */}
        <div className="card p-5">
          <h3 className="font-condensed font-bold text-lg mb-4 uppercase tracking-wide text-gray-300">
            Match Availability
          </h3>
          <div className="space-y-4">
            {MATCHES.map((m) => {
              const fill = getFillPct(m)
              const sold = getTotalSold(m)
              const total = getTotalSeats(m)
              const bar = fill > 0.9 ? '#ef4444' : fill > 0.7 ? '#f97316' : '#22c55e'
              return (
                <div key={m.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold truncate mr-2">
                      {m.home} vs {m.away}
                    </span>
                    <span className="text-gray-400 flex-shrink-0">
                      {Math.round(fill * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${fill * 100}%`, background: bar }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                    <span>{sold} sold</span>
                    <span>{total - sold} remaining</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Threat log */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-condensed font-bold text-lg uppercase tracking-wide text-gray-300">
              Threat Log
            </h3>
            <span className="animate-pulse-dot w-2 h-2 bg-red-400 rounded-full inline-block" />
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {threats.map((e, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-xs border-b border-gray-800 pb-2 animate-fade-in"
              >
                <span className="text-gray-600 font-mono whitespace-nowrap pt-0.5 flex-shrink-0">
                  {e.time}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-gray-400">{e.ip}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${RISK_STYLE[e.risk]}`}>
                      {e.risk}
                    </span>
                    {e.blocked && (
                      <span className="text-red-400 font-semibold text-[10px]">BLOCKED</span>
                    )}
                  </div>
                  <p className="text-gray-500 mt-0.5 truncate">{e.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Issued tickets table ────────────────────────────────────────────── */}
      {tickets.length > 0 && (
        <div className="card p-5">
          <h3 className="font-condensed font-bold text-lg uppercase tracking-wide text-gray-300 mb-4">
            All Issued Tickets ({tickets.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-gray-800">
                  {['ID', 'Match', 'Zone', 'Name', 'Document', 'Price', 'Status', 'Purchased'].map((h) => (
                    <th key={h} className="text-left py-2.5 px-3 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => {
                  const m = MATCHES.find((x) => x.id === t.matchId)
                  return (
                    <tr
                      key={t.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono text-orange-500 text-xs">{t.id}</td>
                      <td className="py-2.5 px-3 font-semibold whitespace-nowrap">
                        {m?.home} vs {m?.away}
                      </td>
                      <td className="py-2.5 px-3 text-gray-400">{t.zone}</td>
                      <td className="py-2.5 px-3">{t.name}</td>
                      <td className="py-2.5 px-3 font-mono text-xs text-gray-400">
                        {t.idType} {t.idNumber}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 font-semibold whitespace-nowrap">
                        {formatPrice(t.price)}
                      </td>
                      <td className="py-2.5 px-3">
                        {t.forSale ? (
                          <span className="text-amber-400 text-xs font-semibold">For Resale</span>
                        ) : (
                          <span className="text-emerald-400 text-xs">Active</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(t.purchasedAt).toLocaleString('en-GB')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
