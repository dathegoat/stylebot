'use client';
import posthog from 'posthog-js';
import { useState } from 'react';

const occasions = ['Date night', 'Casual hangout', 'Party', 'Business casual', 'Formal event', 'Interview'];
const styles = ['Minimal', 'Smart casual', 'Streetwear', 'Classic', 'Rugged'];

function Skeleton() {
  return (
    <div className="animate-pulse">
      {[1,2,3].map(i => (
        <div key={i} className="border border-gray-100 rounded-2xl p-5 mb-4">
          <div className="h-4 bg-gray-100 rounded w-1/3 mb-3"></div>
          <div className="h-3 bg-gray-100 rounded w-2/3 mb-6"></div>
          {[1,2,3,4].map(j => (
            <div key={j} className="flex justify-between py-3 border-t border-gray-100">
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              <div className="h-3 bg-gray-100 rounded w-10"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState(null);
  const [style, setStyle] = useState(null);
  const [budget, setBudget] = useState(150);
  const [outfits, setOutfits] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(null);

  async function getOutfits() {
    setLoading(true);
    setError(null);
    setStep(3);
    posthog.capture('outfit_requested', { occasion, style, budget });
    try {
      const res = await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion, style, budget }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutfits(data.outfits);
      posthog.capture('outfit_received', { occasion, style, budget });
    } catch(e) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  async function submitEmail() {
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email.');
      return;
    }
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEmailSubmitted(true);
      posthog.capture('email_captured');
      setEmailError(null);
    } catch(e) {
      setEmailError('Something went wrong. Please try again.');
    }
  }

  function reset() {
    setStarted(false);
    setStep(1); setOccasion(null); setStyle(null);
    setBudget(150); setOutfits(null); setError(null);
    setEmail(''); setEmailSubmitted(false);
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="inline-block bg-gray-50 border border-gray-100 rounded-full px-4 py-1 text-xs text-gray-400 mb-8">
            AI-powered styling for men
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4 leading-tight">
            Know exactly what<br />to wear. Every time.
          </h1>
          <p className="text-gray-400 text-base mb-10 leading-relaxed">
            Tell us the occasion and your style.<br />
            Get 3 complete outfits with real products<br />
            you can buy instantly.
          </p>
          <button onClick={() => setStarted(true)}
            className="w-full py-4 rounded-xl bg-gray-900 text-white font-medium text-base hover:bg-gray-700 transition-all mb-4">
            Get styled for free
          </button>
          <p className="text-xs text-gray-300">No account needed · Takes 30 seconds</p>
          <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-gray-50">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">30s</p>
              <p className="text-xs text-gray-400 mt-1">To get styled</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">3</p>
              <p className="text-xs text-gray-400 mt-1">Outfit options</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900">$0</p>
              <p className="text-xs text-gray-400 mt-1">Always free</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-md">

        <div className="mt-8 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Stylebot</h1>
            <p className="text-gray-400 text-sm">Your personal men's stylist</p>
          </div>
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 underline">
            Home
          </button>
        </div>

        <div className="flex gap-2 mb-8">
          {[1,2,3].map(n => (
            <div key={n} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= n ? 'bg-gray-900' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">What's the occasion?</h2>
            <p className="text-sm text-gray-400 mb-6">Pick the situation you're dressing for.</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {occasions.map(o => (
                <button key={o} onClick={() => setOccasion(o)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${occasion === o ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                  {o}
                </button>
              ))}
            </div>
            <button disabled={!occasion} onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-30 transition-opacity">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">Your style vibe</h2>
            <p className="text-sm text-gray-400 mb-6">How do you like to dress?</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {styles.map(s => (
                <button key={s} onClick={() => setStyle(s)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${style === s ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Budget</p>
            <div className="flex items-center gap-4 mb-8">
              <input type="range" min="50" max="500" step="50" value={budget}
                onChange={e => setBudget(parseInt(e.target.value))}
                className="flex-1 accent-gray-900" />
              <span className="text-base font-medium text-gray-900 w-16">${budget}</span>
            </div>
            <button disabled={!style} onClick={getOutfits}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-30 transition-opacity">
              Get my outfits
            </button>
            <button onClick={() => setStep(1)}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 font-medium mt-3 hover:border-gray-400 transition-all">
              Back
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-1">
                {loading ? 'Finding your outfits...' : 'Your outfits'}
              </h2>
              <p className="text-sm text-gray-400">{occasion} · {style} · ${budget} budget</p>
            </div>

            {loading && <Skeleton />}

            {error && (
              <div className="bg-red-50 text-red-500 text-sm rounded-xl p-4 mb-4">{error}</div>
            )}

            {outfits && outfits.map((outfit, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-gray-200 transition-all">
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-gray-900">{outfit.title}</p>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full ml-2 shrink-0">
                    Outfit {i + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">{outfit.why}</p>
                {outfit.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between py-2 border-t border-gray-100 text-sm">
                    <span className="text-gray-800">{item.name}</span>
                    <div className="flex items-center gap-3 ml-2 shrink-0">
                      <span className="text-gray-400">${item.price}</span>
                      <a href={item.url} target="_blank"
                        onClick={() => posthog.capture('shop_clicked', { item: item.name, price: item.price })}
                        className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-all">
                        Shop
                      </a>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t border-gray-200 mt-1 text-sm font-medium text-gray-900">
                  <span>Total</span>
                  <span>${outfit.items.reduce((s, i) => s + i.price, 0)}</span>
                </div>
              </div>
            ))}

            {outfits && !emailSubmitted && (
              <div className="border border-gray-100 rounded-2xl p-5 mb-4 bg-gray-50">
                <p className="font-medium text-gray-900 mb-1">Get future outfit drops</p>
                <p className="text-sm text-gray-400 mb-4">We'll send you new styles and seasonal picks. No spam.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                  />
                  <button onClick={submitEmail}
                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-all">
                    Join
                  </button>
                </div>
                {emailError && <p className="text-xs text-red-400 mt-2">{emailError}</p>}
              </div>
            )}

            {outfits && emailSubmitted && (
              <div className="border border-gray-100 rounded-2xl p-5 mb-4 bg-gray-50 text-center">
                <p className="font-medium text-gray-900 mb-1">You're in!</p>
                <p className="text-sm text-gray-400">We'll keep you updated with new styles.</p>
              </div>
            )}

            {!loading && (
              <div className="flex gap-3 mt-2">
                <button onClick={getOutfits}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:border-gray-400 transition-all">
                  Regenerate
                </button>
                <button onClick={reset}
                  className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-700 transition-all">
                  Start over
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}