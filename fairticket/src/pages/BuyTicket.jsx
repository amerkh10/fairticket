import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getMatch } from '../data/matches.js'
import {
  addTicket,
  generateId,
  formatPrice,
  formatDate,
} from '../utils/storage.js'
import { useToast } from '../App.jsx'
import QRCodeCard from '../components/QRCodeCard.jsx'

const STEPS = ['Identity Verification', 'Review & Pay']

export default function BuyTicket() {
  const { matchId, zone } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()

  const match = getMatch(matchId)
  const seat = match?.seats[zone]

  const [step, setStep] = useState(1)
  const [verifying, setVerifying] = useState(false)
  const [newTicket, setNewTicket] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    idType: 'CIN',
    idNumber: '',
    agree: false,
  })

  // ── Guards ────────────────────────────────────────────────────────────────
  if (!match || !seat) {
    return (
      <div className="text-center py-20 text-gray-500">
        Match or zone not found.{' '}
        <Link to="/" className="text-orange-500 underline">
          Browse matches
        </Link>
      </div>
    )
  }

  // ── Validation ────────────────────────────────────────────────────────────
  const formValid =
    form.name.trim().length > 2 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.idNumber.trim().length > 4 &&
    form.agree

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleVerify = () => {
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      setStep(2)
    }, 1800)
  }

  const handleConfirm = () => {
    const ticket = {
      id: generateId(),
      matchId: match.id,
      zone,
      price: seat.price,
      name: form.name,
      email: form.email,
      idType: form.idType,
      idNumber: form.idNumber,
      purchasedAt: new Date().toISOString(),
      status: 'active',
      forSale: false,
    }
    addTicket(ticket)
    setNewTicket(ticket)
    setStep(3)
    showToast('Ticket purchased successfully!')
  }

  // ── Step 3 — success ──────────────────────────────────────────────────────
  if (step === 3 && newTicket) {
    return (
      <div className="animate-fade-in max-w-lg mx-auto text-center py-10">
        <div className="text-5xl mb-4">🎟️</div>
        <h2 className="font-condensed font-black text-3xl text-emerald-400 mb-2">
          TICKET CONFIRMED!
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Your ticket has been identity-locked and secured against scalping.
          The QR code will activate 24 hours before kick-off.
        </p>

        <div className="card p-6 mb-6 inline-block w-full">
          <div className="flex justify-center mb-4">
            <QRCodeCard ticketId={newTicket.id} matchDateIso={match.date} />
          </div>
          <p className="font-condensed font-black text-xl">
            {match.home} <span className="text-orange-500">vs</span> {match.away}
          </p>
          <p className="text-gray-400 text-sm mt-0.5">
            {zone} · {formatPrice(seat.price)}
          </p>
          <p className="text-gray-600 text-xs mt-1 font-mono">ID: {newTicket.id}</p>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/my-tickets')} className="btn-primary text-base px-8 py-3">
            View My Tickets
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Back to Matches
          </button>
        </div>
      </div>
    )
  }

  // ── Shared step layout ────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <Link to="/" className="text-gray-500 hover:text-orange-500 text-sm mb-6 flex items-center gap-1 transition-colors">
        ← Back to matches
      </Link>

      {/* Match summary */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
              {match.competition}
            </p>
            <h2 className="font-condensed font-black text-2xl">
              {match.home} <span className="text-orange-500">vs</span> {match.away}
            </h2>
            <p className="text-gray-400 text-sm">
              {formatDate(match.date)} · {match.venue}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase">{zone}</p>
            <p className="font-condensed font-black text-3xl text-orange-500">
              {formatPrice(seat.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => {
          const num = i + 1
          const done = step > num
          const active = step === num
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${done ? 'bg-emerald-500 text-black' : active ? 'bg-orange-500 text-black' : 'bg-gray-800 text-gray-500'}`}
              >
                {done ? '✓' : num}
              </div>
              <span className={`text-sm hidden sm:inline ${active ? 'text-white font-semibold' : 'text-gray-500'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 ${step > num ? 'bg-orange-500' : 'bg-gray-800'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Step 1 — form ──────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="card p-6 animate-slide-up">
          <h3 className="font-condensed font-bold text-xl mb-1">Identity Verification</h3>
          <p className="text-gray-500 text-sm mb-6">
            Your ticket will be permanently linked to your ID. Transfers are only
            permitted via FairTicket's official resale at capped prices.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Full Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="As on your ID document"
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="label">ID Type</label>
              <select
                className="input"
                value={form.idType}
                onChange={(e) => setForm({ ...form, idType: e.target.value })}
              >
                <option>CIN</option>
                <option>Passport</option>
                <option>Residence Card</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">{form.idType} Number</label>
              <input
                className="input font-mono tracking-wider"
                value={form.idNumber}
                onChange={(e) =>
                  setForm({ ...form, idNumber: e.target.value.toUpperCase() })
                }
                placeholder={form.idType === 'CIN' ? 'e.g. BE123456' : 'e.g. AB1234567'}
              />
            </div>
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 mt-5 p-4 bg-blue-950/30 border border-blue-900/50
                            rounded-xl cursor-pointer hover:bg-blue-950/40 transition-colors">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
              className="mt-0.5 accent-orange-500 flex-shrink-0"
            />
            <span className="text-sm text-gray-300">
              I confirm my identity details are accurate. I understand this ticket
              is non-transferable except via FairTicket's official resale at original
              price +15% maximum ({formatPrice(Math.round(seat.price * 1.15))}).
            </span>
          </label>

          <button
            disabled={!formValid || verifying}
            onClick={handleVerify}
            className="btn-primary w-full mt-5 text-lg py-4"
          >
            {verifying ? (
              <><span className="animate-spin inline-block">⟳</span> Verifying Identity…</>
            ) : (
              'Verify & Continue →'
            )}
          </button>
        </div>
      )}

      {/* ── Step 2 — review ────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="card p-6 animate-slide-up">
          <h3 className="font-condensed font-bold text-xl mb-1 text-emerald-400">
            ✓ Identity Verified
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Review your order before confirming purchase.
          </p>

          <div className="space-y-0 mb-6 divide-y divide-gray-800">
            {[
              ['Match',    `${match.home} vs ${match.away}`],
              ['Date',     formatDate(match.date)],
              ['Venue',    match.venue],
              ['Zone',     zone],
              ['Name',     form.name],
              ['Email',    form.email],
              [`${form.idType} No.`, form.idNumber],
              ['Total',    formatPrice(seat.price)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5 text-sm">
                <span className="text-gray-500">{k}</span>
                <span
                  className={`font-semibold text-right max-w-xs ${
                    k === 'Total'
                      ? 'text-orange-500 font-condensed font-black text-xl'
                      : 'text-gray-100'
                  }`}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-orange-950/30 border border-orange-900/50 rounded-xl p-4 mb-5 text-sm text-orange-300">
            ⚠️ This ticket is identity-locked. Resale via FairTicket is capped
            at {formatPrice(Math.round(seat.price * 1.15))}.
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary flex-1">
              ← Edit
            </button>
            <button onClick={handleConfirm} className="btn-primary flex-[2] text-lg py-4">
              Confirm Purchase
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
