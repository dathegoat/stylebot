'use client';
import posthog from 'posthog-js';
import { useState, useEffect } from 'react';

const occasions = ['Date night', 'Casual hangout', 'Party', 'Business casual', 'Formal event', 'Interview', 'Other'];
const styles = ['Minimal', 'Smart casual', 'Streetwear', 'Classic', 'Rugged'];
const temperatures = [
  { label: 'Hot', display: '🥵 Hot (75°F+)' },
  { label: 'Warm', display: '😎 Warm (55–75°F)' },
  { label: 'Cool', display: '🧥 Cool (35–55°F)' },
  { label: 'Cold', display: '🥶 Cold (below 35°F)' },
];

const typeIcon = { top: '👔', bottom: '👖', shoes: '👟', accessory: '⌚' };
const typeLabel = { top: 'Top', bottom: 'Bottoms', shoes: 'Shoes', accessory: 'Accessory' };

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

function OutfitCard({ outfit, index, onShare, copied, image }) {
  const total = outfit.items.reduce((s, item) => s + item.price, 0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden mb-4">

      {image !== null && !imgError && (
        <>
          <div className="h-[180px] bg-gray-100 rounded-t-2xl relative overflow-hidden">
            {image?.url && (
              <img
                src={image.url}
                alt={image.alt || outfit.title}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </div>
          {image?.url && imgLoaded && (
            <p className="text-xs text-gray-300 px-5 pt-2">Photo: Unsplash</p>
          )}
        </>
      )}

      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-medium text-gray-900 text-base">{outfit.title}</p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onShare}
              className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full hover:border-gray-300 transition-all"
            >
              {copied ? 'Copied!' : '🔗'}
            </button>
            {index !== undefined && (
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                Outfit {index + 1}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{outfit.why}</p>
      </div>

      <div className="border-t border-gray-100">
        {outfit.items.map((item, j) => (
          <div key={j} className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 last:border-b-0">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-base shrink-0">
              {typeIcon[item.type] || '👕'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{typeLabel[item.type] || 'Item'}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-gray-400">${item.price}</span>
              <a href={item.url} target="_blank"
                onClick={() => posthog.capture('shop_clicked', { item: item.name, price: item.price })}
                className="text-xs px-3 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all">
                Shop
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-base font-medium text-gray-900">${total}</p>
        </div>
        <a href={outfit.items[0]?.url} target="_blank"
          onClick={() => posthog.capture('shop_look_clicked', { outfit: outfit.title })}
          className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:border-gray-400 transition-all">
          Shop this look
        </a>
      </div>

    </div>
  );
}

function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#111111"/>
      <path d="M28 18 L50 72 L72 18 Q62 32 57 30 L50 72 L43 30 Q38 32 28 18Z" fill="none" stroke="#F97316" strokeWidth="3" strokeLinejoin="round"/>
    </svg>
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
  const [temperature, setTemperature] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [customOccasion, setCustomOccasion] = useState('');
  const [sharedOutfit, setSharedOutfit] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [outfitImages, setOutfitImages] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('outfit');
    if (encoded) {
      try {
        const outfit = JSON.parse(atob(encoded));
        setSharedOutfit(outfit);
      } catch (e) {
        // invalid param, ignore
      }
    }
  }, []);

  function shareOutfit(outfit, index) {
    const encoded = btoa(JSON.stringify(outfit));
    const url = `${window.location.origin}/?outfit=${encoded}`;
    navigator.clipboard.writeText(url);
    posthog.capture('outfit_shared', { outfit: outfit.title });
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  async function getOutfits() {
    setLoading(true);
    setError(null);
    setStep(3);
    setOutfitImages({});
    const displayOccasion = occasion === 'Other' ? customOccasion : occasion;
    posthog.capture('outfit_requested', { occasion: displayOccasion, style, temperature, budget });
    try {
      const res = await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion, customOccasion, style, temperature, budget }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutfits(data.outfits);
      posthog.capture('outfit_received', { occasion: displayOccasion, style, temperature, budget });

      data.outfits.forEach((outfit, i) => {
        const topItem = outfit.items.find(item => item.type === 'top');
        const shoesItem = outfit.items.find(item => item.type === 'shoes');
        const query = `${outfit.title} ${style} ${displayOccasion} men ${topItem?.color || ''} ${shoesItem?.color || ''} fashion outfit`;
        fetch('/api/unsplash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        })
          .then(r => r.json())
          .then(imgData => {
            setOutfitImages(prev => ({ ...prev, [i]: imgData.url ? imgData : null }));
          })
          .catch(() => {
            setOutfitImages(prev => ({ ...prev, [i]: null }));
          });
      });
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
    window.history.replaceState({}, '', '/');
    setSharedOutfit(null);
    setStarted(false);
    setStep(1); setOccasion(null); setStyle(null); setTemperature(null); setCustomOccasion('');
    setBudget(150); setOutfits(null); setError(null); setOutfitImages({});
    setEmail(''); setEmailSubmitted(false);
  }

  if (sharedOutfit) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center p-6">
        <div className="w-full max-w-md">
          <div className="mt-8 mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Stylesmith</h1>
            <p className="text-gray-400 text-sm">Someone shared this outfit with you</p>
          </div>
          <OutfitCard
            outfit={sharedOutfit}
            index={undefined}
            onShare={() => shareOutfit(sharedOutfit, 'shared')}
            copied={copiedIndex === 'shared'}
            image={null}
          />
          <button onClick={reset}
            className="w-full py-4 rounded-xl bg-orange-500 text-white font-medium text-base hover:bg-orange-600 transition-all mt-2">
            Get styled for free →
          </button>
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-8">
            <Logo size={56} />
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4 leading-tight">
            Dress like you meant to.
          </h1>
          <p className="text-gray-400 text-base mb-10 leading-relaxed">
            Tell us the occasion and your vibe. Get 3 complete outfits with real products you can buy instantly.
          </p>
          <button onClick={() => setStarted(true)}
            className="w-full py-4 rounded-xl bg-orange-500 text-white font-medium text-base hover:bg-orange-600 transition-all mb-4">
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
            <div className="flex items-center gap-2 mb-1">
              <Logo size={32} />
              <h1 className="text-2xl font-semibold text-gray-900">Stylesmith</h1>
            </div>
            <p className="text-gray-400 text-sm">Your AI stylist. Your best fits.</p>
          </div>
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 underline">
            Home
          </button>
        </div>

        <div className="flex gap-2 mb-8">
          {[1,2,3].map(n => (
            <div key={n} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= n ? 'bg-orange-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">What's the occasion?</h2>
            <p className="text-sm text-gray-400 mb-6">Pick the situation you're dressing for.</p>
            <div className={`flex flex-wrap gap-2 ${occasion === 'Other' ? 'mb-3' : 'mb-8'}`}>
              {occasions.map(o => (
                <button key={o} onClick={() => setOccasion(o)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${occasion === o ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                  {o}
                </button>
              ))}
            </div>
            {occasion === 'Other' && (
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="Describe your occasion..."
                  value={customOccasion}
                  onChange={e => setCustomOccasion(e.target.value.slice(0, 100))}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-gray-900 transition-all"
                />
                <p className="text-xs text-gray-300 mt-1 text-right">{customOccasion.length}/100</p>
              </div>
            )}
            <h2 className="text-lg font-medium text-gray-900 mb-1">What's the temperature?</h2>
            <p className="text-sm text-gray-400 mb-6">So we can recommend the right fabrics and layers.</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {temperatures.map(t => (
                <button key={t.label} onClick={() => setTemperature(t.label)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${temperature === t.label ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}>
                  {t.display}
                </button>
              ))}
            </div>
            <button disabled={!occasion || !temperature || (occasion === 'Other' && !customOccasion.trim())} onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-orange-500 text-white font-medium disabled:opacity-30 hover:bg-orange-600 transition-all">
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
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${style === s ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}>
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
              className="w-full py-3 rounded-xl bg-orange-500 text-white font-medium disabled:opacity-30 hover:bg-orange-600 transition-all">
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
                {loading ? 'Stylesmith is building your looks...' : 'Your outfits'}
              </h2>
              <p className="text-sm text-gray-400">{occasion === 'Other' ? customOccasion : occasion} · {style} · {temperature} · ${budget} budget</p>
            </div>

            {loading && <Skeleton />}

            {error && (
              <div className="bg-red-50 text-red-500 text-sm rounded-xl p-4 mb-4">{error}</div>
            )}

            {outfits && outfits.map((outfit, i) => (
              <OutfitCard
                key={i}
                outfit={outfit}
                index={i}
                onShare={() => shareOutfit(outfit, i)}
                copied={copiedIndex === i}
                image={outfitImages[i]}
              />
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
                    className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-all">
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
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all">
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
