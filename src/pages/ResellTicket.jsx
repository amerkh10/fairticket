import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getTicket, updateTicket, formatPrice, formatDate, getMaxResalePrice } from '../utils/storage.js'
import { getMatch } from '../data/matches.js'
import { useToast } from '../App.jsx'

export default function ResellTicket() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()

  const ticket = getTicket(ticketId)
  const match = ticket ? getMatch(ticket.matchId) : null

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    price: '',
    buyerName: '',
    buyerEmail: '',
    buyerId: '',
  })

  // ── Guards ────────────────────────────────────────────────────────────────
  if (!ticket || !match) {
    return (
      <div className="text-center py-20 text-gray-500">
        Ticket not found.{' '}
        <Link to="/my-tickets" className="text-orange-500 underline">
          My Tickets
        </Link>
      </div>
    )
  }
  if (ticket.forSale) {
    return (
      <div className="text-center py-20 text-amber-400">
        <div className="text-5xl mb-4">🔄</div>
        <p className="font-condensed font-bold text-2xl mb-2">Already Listed</p>
        <p className="text-gray-500 mb-6">This ticket is already listed for resale.</p>
        <Link to="/my-tickets" className="btn-primary inline-flex">← My Tickets</Link>
      </div>
    )
  }

  const max = getMaxResalePrice(ticket.price)
  const priceNum = parseInt(form.price) || 0
  const priceOk = priceNum > 0 && priceNum <= max
  const formValid =
    priceOk &&
    form.buyerName.trim().length > 2 &&
    /\S+@\S+\.\S+/.test(form.buyerEmail) &&
    form.buyerId.trim().length > 4

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      updateTicket(ticket.id, {
        forSale: true,
        resalePrice: priceNum,
        buyerName: form.buyerName,
        buyerEmail: form.buyerEmail,
        buyerId: form.buyerId,
      })
      setSubmitting(false)
      setStep(2)
      showToast('Ticket listed for official resale!')
    }, 1600)
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="animate-fade-in max-w-lg mx-auto text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-condensed font-black text-3xl text-emerald-400 mb-2">
          LISTING SUBMITTED
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Your resale request has been submitted. The buyer will receive an
          identity-verified transfer link. FairTicket enforces the price cap
          to protect all fans.
        </p>

        <div className="card p-5 mb-6 text-left space-y-2 text-sm">
          {[
            ['Match',          `${match.home} vs ${match.away}`],
            ['Original price', formatPrice(ticket.price)],
            ['Resale price',   formatPrice(priceNum)],
            ['Max allowed',    formatPrice(max)],
            ['Buyer',          form.buyerName],
            ['Buyer email',    form.buyerEmail],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">{k}</span>
              <span className={`font-semibold ${k === 'Resale price' ? 'text-orange-500' : ''}`}>
                {v}
              </span>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/my-tickets')} className="btn-primary text-lg px-10 py-3">
          ← My Tickets
        </button>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <Link to="/my-tickets" className="text-gray-500 hover:text-orange-500 text-sm mb-6 flex items-center gap-1 transition-colors">
        ← Back to my tickets
      </Link>

      {/* Ticket summary */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Reselling</p>
            <h2 className="font-condensed font-black text-2xl">
              {match.home} <span className="text-orange-500">vs</span> {match.away}
            </h2>
            <p className="text-sm text-gray-400">
              {ticket.zone} · {formatDate(match.date)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Original price: {formatPrice(ticket.price)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5">Maximum resale price</p>
            <p className="font-condensed font-black text-3xl text-emerald-400">
              {formatPrice(max)}
            </p>
            <p className="text-xs text-gray-600">+15% cap enforced by law</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-condensed font-bold text-xl mb-5">Resale Details</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Price */}
          <div className="sm:col-span-2">
            <label className="label">Your Resale Price (MAD)</label>
            <input
              type="number"
              className="input"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder={`1 – ${max}`}
              min={1}
              max={max}
            />
            {form.price && !priceOk && (
              <p className="text-red-400 text-xs mt-1.5">
                ⚠️ Price exceeds the cap of {formatPrice(max)}
              </p>
            )}
            {form.price && priceOk && (
              <p className="text-emerald-400 text-xs mt-1.5">✓ Valid price</p>
            )}
          </div>

          {/* Divider */}
          <div className="sm:col-span-2 border-t border-gray-800 pt-4">
            <p className="label">Buyer Identity Verification</p>
          </div>

          <div>
            <label className="label">Buyer Full Name</label>
            <input
              className="input"
              value={form.buyerName}
              onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
              placeholder="Legal full name"
            />
          </div>
          <div>
            <label className="label">Buyer Email</label>
            <input
              type="email"
              className="input"
              value={form.buyerEmail}
              onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })}
              placeholder="buyer@email.com"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Buyer CIN / Passport Number</label>
            <input
              className="input font-mono tracking-wider"
              value={form.buyerId}
              onChange={(e) =>
                setForm({ ...form, buyerId: e.target.value.toUpperCase() })
              }
              placeholder="Buyer identity document number"
            />
          </div>
        </div>

        <div className="mt-5 p-4 bg-blue-950/30 border border-blue-900/50 rounded-xl text-sm text-blue-300">
          🔒 FairTicket will verify the buyer's identity before completing the
          transfer. The QR code will be re-issued exclusively in the buyer's name.
        </div>

        <button
          disabled={!formValid || submitting}
          onClick={handleSubmit}
          className="btn-primary w-full mt-5 text-lg py-4"
        >
          {submitting ? (
            <><span className="animate-spin inline-block">⟳</span> Submitting…</>
          ) : (
            'Submit Resale Request →'
          )}
        </button>
      </div>
    </div>
  )
}
