import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getTickets, formatPrice, formatDate } from '../utils/storage.js'
import { getMatch } from '../data/matches.js'
import QRCodeCard from '../components/QRCodeCard.jsx'

export default function MyTickets() {
  // Re-render when localStorage changes (e.g. after purchase)
  const [tickets, setTickets] = useState([])
  useEffect(() => {
    setTickets(getTickets())
  }, [])

  if (tickets.length === 0) {
    return (
      <div className="animate-fade-in text-center py-24">
        <div className="text-6xl mb-4">🎟️</div>
        <h2 className="font-condensed font-black text-3xl text-gray-600 mb-2">
          NO TICKETS YET
        </h2>
        <p className="text-gray-500 mb-6">
          Your purchased tickets will appear here.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          Browse Matches →
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-condensed font-black text-3xl uppercase mb-6">
        My Tickets{' '}
        <span className="text-orange-500">({tickets.length})</span>
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tickets.map((ticket, i) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            delay={i * 60}
          />
        ))}
      </div>
    </div>
  )
}

// ── Single ticket card ────────────────────────────────────────────────────────
function TicketCard({ ticket, delay }) {
  const navigate = useNavigate()
  const match = getMatch(ticket.matchId)
  if (!match) return null

  const maxResale = Math.round(ticket.price * 1.15)

  return (
    <div
      className="card overflow-hidden hover:border-gray-700 transition-all duration-200 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top accent stripe */}
      <div
        className={`h-1.5 ${
          ticket.forSale
            ? 'bg-amber-500'
            : 'bg-gradient-to-r from-orange-500 to-blue-500'
        }`}
      />

      <div className="p-5">
        {/* Status + ID */}
        <div className="flex justify-between items-start mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border
              ${ticket.forSale
                ? 'bg-amber-900/40 text-amber-400 border-amber-800'
                : 'bg-emerald-900/30 text-emerald-400 border-emerald-900'
              }`}
          >
            {ticket.forSale ? '🔄 Listed for Resale' : '✓ Active'}
          </span>
          <span className="text-[10px] text-gray-600 font-mono">{ticket.id}</span>
        </div>

        {/* Match */}
        <p className="font-condensed font-black text-xl uppercase leading-tight mb-0.5">
          {match.home} <span className="text-orange-500">vs</span> {match.away}
        </p>
        <p className="text-gray-400 text-xs mb-4">{formatDate(match.date)}</p>

        {/* QR + info row */}
        <div className="flex items-start gap-4 border-t border-gray-800 pt-4 mb-4">
          <div className="flex-1 space-y-1">
            <p className="text-xs text-gray-500">{ticket.zone}</p>
            <p className="font-condensed font-black text-xl text-orange-500">
              {formatPrice(ticket.price)}
            </p>
            <p className="text-xs text-gray-600">
              Bought {new Date(ticket.purchasedAt).toLocaleDateString('en-GB')}
            </p>
          </div>
          <QRCodeCard
            ticketId={ticket.id}
            matchDateIso={match.date}
            compact
          />
        </div>

        {/* Identity lock */}
        <div className="text-xs text-gray-600 bg-gray-800/50 rounded-lg px-3 py-2 mb-3">
          🔒 {ticket.idType} {ticket.idNumber} · Max resale: {formatPrice(maxResale)}
        </div>

        {/* Resell CTA */}
        {!ticket.forSale && (
          <button
            onClick={() => navigate(`/resell/${ticket.id}`)}
            className="w-full text-sm bg-gray-800 hover:bg-blue-900/30 hover:border-blue-700
                       border border-gray-700 text-gray-300 hover:text-blue-400
                       font-semibold py-2.5 rounded-xl transition-all duration-200"
          >
            Resell This Ticket
          </button>
        )}

        {ticket.forSale && (
          <div className="text-center text-xs text-amber-400 font-semibold py-2">
            Listed · Awaiting buyer verification
          </div>
        )}
      </div>
    </div>
  )
}
