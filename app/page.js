'use client';
import { useState } from 'react';

const occasions = ['Date night', 'Casual hangout', 'Party', 'Business casual', 'Formal event', 'Interview'];
const styles = ['Minimal', 'Smart casual', 'Streetwear', 'Classic', 'Rugged'];

export default function Home() {
  const [step, setStep] = useState(1);
  const [occasion, setOccasion] = useState(null);
  const [style, setStyle] = useState(null);
  const [budget, setBudget] = useState(150);
  const [outfits, setOutfits] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getOutfits() {
    setLoading(true);
    setStep(3);
    const res = await fetch('/api/outfits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ occasion, style, budget }),
    });
    const data = await res.json();
    setOutfits(data.outfits);
    setLoading(false);
  }

  function reset() {
    setStep(1); setOccasion(null); setStyle(null);
    setBudget(150); setOutfits(null);
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-md">

        <h1 className="text-2xl font-semibold text-gray-900 mb-1 mt-8">Stylebot</h1>
        <p className="text-gray-400 text-sm mb-8">Your personal men's stylist</p>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1,2,3].map(n => (
            <div key={n} className={`h-1 flex-1 rounded-full ${step >= n ? 'bg-gray-900' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Step 1 - Occasion */}
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
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-30">
              Next
            </button>
          </div>
        )}

        {/* Step 2 - Style + Budget */}
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
                className="flex-1" />
              <span className="text-base font-medium text-gray-900 w-16">${budget}</span>
            </div>
            <button disabled={!style} onClick={getOutfits}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-30">
              Get my outfits
            </button>
          </div>
        )}

        {/* Step 3 - Results */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">Your outfits</h2>
            <p className="text-sm text-gray-400 mb-6">{occasion} · {style} · ${budget} budget</p>

            {loading && (
              <div className="text-center py-16 text-gray-400 text-sm">Finding your outfits...</div>
            )}

            {outfits && outfits.map((outfit, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-5 mb-4">
                <p className="font-medium text-gray-900 mb-1">{outfit.title}</p>
                <p className="text-sm text-gray-400 mb-4">{outfit.why}</p>
                {outfit.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between py-2 border-t border-gray-100 text-sm">
                    <span className="text-gray-800">{item.name}</span>
                    <span className="text-gray-400 mx-3">${item.price}</span>
                    <a href={`https://www.google.com/search?q=mens+${encodeURIComponent(item.name)}`}
                      target="_blank"
                      className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                      Shop
                    </a>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t border-gray-200 mt-2 text-sm font-medium text-gray-900">
                  <span>Total</span>
                  <span>${outfit.items.reduce((s, i) => s + i.price, 0)}</span>
                </div>
              </div>
            ))}

            {!loading && (
              <button onClick={reset}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-medium mt-2">
                Start over
              </button>
            )}
          </div>
        )}

      </div>
    </main>
  );
}