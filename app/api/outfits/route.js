import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const AFFILIATE_TAG = 'stylebot20-20';
const PRODUCTS = {
  "white oxford shirt": { name: "Cotton King Slim Fit Oxford Shirt", url: `https://www.amazon.com/dp/B0D3M26MWK?tag=${AFFILIATE_TAG}`, price: 35, color: "white", formality: "smart casual", styles: ["minimal", "smart casual", "classic"], type: "top" },
  "slim chino pants": { name: "Amazon Essentials Slim Fit Tan Chinos", url: `https://www.amazon.com/dp/B077597W8N?tag=${AFFILIATE_TAG}`, price: 35, color: "tan", formality: "smart casual", styles: ["minimal", "smart casual", "classic"], type: "bottom" },
  "white leather sneakers": { name: "FRACORA White Leather Sneakers", url: `https://www.amazon.com/dp/B0BVQC9D3Y?tag=${AFFILIATE_TAG}`, price: 45, color: "white", formality: "casual", styles: ["minimal", "smart casual", "streetwear"], type: "shoes" },
  "dark wash slim jeans": { name: "Tapered Stretch Denim Jeans", url: `https://www.amazon.com/dp/B0GGB9SPC6?tag=${AFFILIATE_TAG}`, price: 45, color: "dark blue", formality: "casual", styles: ["smart casual", "streetwear", "classic", "rugged"], type: "bottom" },
  "chelsea boots": { name: "Bruno Marc Suede Chelsea Boots", url: `https://www.amazon.com/dp/B06XTW21W5?tag=${AFFILIATE_TAG}`, price: 55, color: "tan", formality: "smart casual", styles: ["smart casual", "classic", "minimal"], type: "shoes" },
  "navy henley": { name: "Cotrasen Long Sleeve Henley", url: `https://www.amazon.com/dp/B0FHQ2774C?tag=${AFFILIATE_TAG}`, price: 30, color: "navy", formality: "casual", styles: ["smart casual", "rugged", "classic"], type: "top" },
  "grey polo shirt": { name: "Cotrasen Performance Polo Shirt", url: `https://www.amazon.com/dp/B0DX281R32?tag=${AFFILIATE_TAG}`, price: 28, color: "grey", formality: "smart casual", styles: ["smart casual", "classic", "minimal"], type: "top" },
  "charcoal joggers": { name: "Libin Stretch Tapered Joggers", url: `https://www.amazon.com/dp/B0CC5VCTFG?tag=${AFFILIATE_TAG}`, price: 38, color: "charcoal", formality: "casual", styles: ["streetwear", "minimal"], type: "bottom" },
  "white crew neck t-shirt": { name: "PURPLE KIWI Ultra-Soft White Crew Tee", url: `https://www.amazon.com/dp/B0G2BD8F6R?tag=${AFFILIATE_TAG}`, price: 22, color: "white", formality: "casual", styles: ["minimal", "streetwear", "smart casual"], type: "top" },
  "black crew neck t-shirt": { name: "PURPLE KIWI Ultra-Soft Black Crew Tee", url: `https://www.amazon.com/dp/B0G2B97KVC?tag=${AFFILIATE_TAG}`, price: 22, color: "black", formality: "casual", styles: ["minimal", "streetwear", "classic"], type: "top" },
  "grey sweatshirt": { name: "Hanes EcoSmart Grey Crewneck Sweatshirt", url: `https://www.amazon.com/dp/B0721C21QY?tag=${AFFILIATE_TAG}`, price: 20, color: "grey", formality: "casual", styles: ["streetwear", "minimal"], type: "top" },
  "flannel shirt": { name: "Amazon Essentials Regular Fit Flannel Shirt", url: `https://www.amazon.com/dp/B0866FN4W6?tag=${AFFILIATE_TAG}`, price: 30, color: "multi", formality: "casual", styles: ["rugged", "smart casual"], type: "top" },
  "denim jacket": { name: "Amazon Essentials Heavyweight Denim Jacket", url: `https://www.amazon.com/dp/B0DX23K8LL?tag=${AFFILIATE_TAG}`, price: 55, color: "blue", formality: "casual", styles: ["streetwear", "rugged", "classic"], type: "top" },
  "bomber jacket": { name: "Calvin Klein Bomber Jacket", url: `https://www.amazon.com/dp/B09B2CSGNR?tag=${AFFILIATE_TAG}`, price: 90, color: "black", formality: "smart casual", styles: ["streetwear", "smart casual", "minimal"], type: "top" },
  "quarter zip pullover": { name: "Nautica Quarter Zip Sweater", url: `https://www.amazon.com/dp/B0846KXRQJ?tag=${AFFILIATE_TAG}`, price: 55, color: "navy", formality: "smart casual", styles: ["classic", "smart casual", "minimal"], type: "top" },
  "black chino pants": { name: "SNOWTEN Classic Stretch Black Chinos", url: `https://www.amazon.com/dp/B0DF5JNWW5?tag=${AFFILIATE_TAG}`, price: 35, color: "black", formality: "smart casual", styles: ["minimal", "smart casual", "classic"], type: "bottom" },
  "grey sweatpants": { name: "Aolesy Tapered Lightweight Joggers", url: `https://www.amazon.com/dp/B0DJNWP2RC?tag=${AFFILIATE_TAG}`, price: 32, color: "grey", formality: "casual", styles: ["streetwear", "minimal"], type: "bottom" },
  "cargo pants": { name: "GINGTTO Slim Fit Cargo Trousers", url: `https://www.amazon.com/dp/B0BRN3CB2J?tag=${AFFILIATE_TAG}`, price: 42, color: "khaki", formality: "casual", styles: ["rugged", "streetwear"], type: "bottom" },
  "white canvas sneakers": { name: "Cole Haan GrandPro White Canvas Sneakers", url: `https://www.amazon.com/dp/B0BGMBCL36?tag=${AFFILIATE_TAG}`, price: 75, color: "white", formality: "smart casual", styles: ["smart casual", "minimal", "classic"], type: "shoes" },
  "black dress shoes": { name: "Clarks Tilden Cap Black Oxford", url: `https://www.amazon.com/dp/B00SMJO8WM?tag=${AFFILIATE_TAG}`, price: 70, color: "black", formality: "formal", styles: ["classic", "smart casual"], type: "shoes" },
  "brown loafers": { name: "HEEZ Brown Leather Loafers", url: `https://www.amazon.com/dp/B0GH6VWP1V?tag=${AFFILIATE_TAG}`, price: 48, color: "brown", formality: "smart casual", styles: ["classic", "smart casual", "minimal"], type: "shoes" },
  "black high top sneakers": { name: "JOUSEN Black High Top Sneakers", url: `https://www.amazon.com/dp/B088BTQGGM?tag=${AFFILIATE_TAG}`, price: 50, color: "black", formality: "casual", styles: ["streetwear"], type: "shoes" },
  "brown leather belt": { name: "WOLFANT Full Grain Brown Leather Belt", url: `https://www.amazon.com/dp/B0FF46D7R7?tag=${AFFILIATE_TAG}`, price: 25, color: "brown", formality: "smart casual", styles: ["classic", "smart casual", "minimal", "rugged"], type: "accessory" },
  "black watch": { name: "Minimalist Waterproof Military Watch", url: `https://www.amazon.com/dp/B07MB37YJ8?tag=${AFFILIATE_TAG}`, price: 30, color: "black", formality: "casual", styles: ["minimal", "streetwear", "smart casual"], type: "accessory" },
  "pocket square": { name: "SelectedStyle White Pocket Square", url: `https://www.amazon.com/dp/B07BFRXFMV?tag=${AFFILIATE_TAG}`, price: 10, color: "white", formality: "formal", styles: ["classic", "smart casual"], type: "accessory" },
  "navy baseball cap": { name: "CHOK LIDS Navy Adjustable Baseball Cap", url: `https://www.amazon.com/dp/B0C8QXWBYY?tag=${AFFILIATE_TAG}`, price: 18, color: "navy", formality: "casual", styles: ["streetwear", "rugged"], type: "accessory" },
  "navy blazer": { name: "COOFANDY Slim Fit Navy Blazer", url: `https://www.amazon.com/dp/B0DDK7SQDT?tag=${AFFILIATE_TAG}`, price: 65, color: "navy", formality: "smart casual", styles: ["smart casual", "classic", "minimal"], type: "top" },
  "white dress shirt": { name: "Alimens Gentle Stretch White Dress Shirt", url: `https://www.amazon.com/dp/B0BRWNDDT8?tag=${AFFILIATE_TAG}`, price: 30, color: "white", formality: "formal", styles: ["classic", "smart casual"], type: "top" },
  "black suit trousers": { name: "Plaid and Plain Slim Fit Black Dress Trousers", url: `https://www.amazon.com/dp/B086C2JHZ3?tag=${AFFILIATE_TAG}`, price: 40, color: "black", formality: "formal", styles: ["classic", "smart casual"], type: "bottom" },
  "brown oxford shoes": { name: "Cole Haan Lenox Hill Brown Oxford", url: `https://www.amazon.com/dp/B00BECIOH4?tag=${AFFILIATE_TAG}`, price: 120, color: "brown", formality: "formal", styles: ["classic", "smart casual"], type: "shoes" },
  "grey overcoat": { name: "COOFANDY Single Breasted Grey Overcoat", url: `https://www.amazon.com/dp/B0FGXKPCBV?tag=${AFFILIATE_TAG}`, price: 89, color: "grey", formality: "smart casual", styles: ["classic", "minimal", "smart casual"], type: "top" },
  "grey zip hoodie": { name: "Hanes Full Zip EcoSmart Grey Hoodie", url: `https://www.amazon.com/dp/B00JUM4TGK?tag=${AFFILIATE_TAG}`, price: 28, color: "grey", formality: "casual", styles: ["streetwear", "minimal"], type: "top" },
  "navy windbreaker": { name: "MAGCOMSEN Lightweight Navy Windbreaker", url: `https://www.amazon.com/dp/B0BJZXCFMR?tag=${AFFILIATE_TAG}`, price: 45, color: "navy", formality: "casual", styles: ["streetwear", "rugged", "minimal"], type: "top" },
  "khaki shorts": { name: "GINGTTO Slim Fit Khaki Chino Shorts", url: `https://www.amazon.com/dp/B0967WCB1M?tag=${AFFILIATE_TAG}`, price: 32, color: "khaki", formality: "casual", styles: ["smart casual", "minimal", "rugged"], type: "bottom" },
  "white linen shirt": { name: "DEMEANOR Lightweight White Linen Shirt", url: `https://www.amazon.com/dp/B0G4N2PYPJ?tag=${AFFILIATE_TAG}`, price: 35, color: "white", formality: "smart casual", styles: ["minimal", "smart casual", "classic"], type: "top" },
  "black turtleneck": { name: "Cotrasen Black Turtleneck Pullover Sweater", url: `https://www.amazon.com/dp/B0FFSJQB1C?tag=${AFFILIATE_TAG}`, price: 38, color: "black", formality: "smart casual", styles: ["minimal", "classic", "smart casual"], type: "top" },
  "black sunglasses": { name: "WearMe Pro Polarized Square Black Sunglasses", url: `https://www.amazon.com/dp/B0986TXSH4?tag=${AFFILIATE_TAG}`, price: 22, color: "black", formality: "casual", styles: ["minimal", "streetwear", "smart casual", "classic"], type: "accessory" }
};
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});

function matchProduct(itemName) {
  const lower = itemName.toLowerCase();
  if (PRODUCTS[lower]) return { key: lower, ...PRODUCTS[lower] };
  for (const [key, product] of Object.entries(PRODUCTS)) {
    if (lower.includes(key)) return { key, ...product };
  }
  for (const [key, product] of Object.entries(PRODUCTS)) {
    const words = key.split(' ').filter(w => w.length > 3);
    const matchCount = words.filter(w => lower.includes(w)).length;
    if (matchCount >= 2) return { key, ...product };
  }
  for (const [key, product] of Object.entries(PRODUCTS)) {
    if (product.name.toLowerCase().includes(lower) || lower.includes(product.name.toLowerCase())) {
      return { key, ...product };
    }
  }
  return null;
}

function validateAndFixOutfit(outfit) {
  const items = outfit.items.map(item => {
    const matched = matchProduct(item.name);
    return matched ? { ...matched, displayName: matched.name } : null;
  }).filter(Boolean);

  const tops = items.filter(i => i.type === 'top');
  const bottoms = items.filter(i => i.type === 'bottom');
  const shoes = items.filter(i => i.type === 'shoes');
  const accessories = items.filter(i => i.type === 'accessory');

  const fixedItems = [tops[0], bottoms[0], shoes[0], accessories[0]].filter(Boolean);

  return {
    ...outfit,
    items: fixedItems.map(item => ({
      name: item.displayName || item.name,
      price: item.price,
      url: item.url
    }))
  };
}
export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const body = await req.json();
  const { occasion, style, budget } = body;

  const validOccasions = ['Date night', 'Casual hangout', 'Party', 'Business casual', 'Formal event', 'Interview'];
  const validStyles = ['Minimal', 'Smart casual', 'Streetwear', 'Classic', 'Rugged'];

  if (!validOccasions.includes(occasion)) {
    return NextResponse.json({ error: 'Invalid occasion' }, { status: 400 });
  }
  if (!validStyles.includes(style)) {
    return NextResponse.json({ error: 'Invalid style' }, { status: 400 });
  }
  if (!budget || typeof budget !== 'number' || budget < 50 || budget > 500) {
    return NextResponse.json({ error: 'Invalid budget' }, { status: 400 });
  }

  const productList = Object.entries(PRODUCTS)
    .map(([key, p]) => '- ' + key + ' | type: ' + p.type + ' | color: ' + p.color + ' | formality: ' + p.formality + ' | styles: ' + p.styles.join(', ') + ' | $' + p.price)
    .join('\n');

  const prompt = 'You are Marcus, an expert mens personal stylist with 10 years of experience. You dress men with confidence and precision.\n\n' +
    'CUSTOMER: Occasion: ' + occasion + ' | Style: ' + style + ' | Budget: $' + budget + '\n\n' +
    'AVAILABLE PRODUCTS (key | type | color | formality | styles | price):\n' +
    productList + '\n\n' +
    'COLOR THEORY SYSTEM:\n' +
    'NEUTRAL COLORS: white, grey, black, navy, tan, khaki, charcoal - all neutrals pair with each other\n\n' +
    'COLOR PAIRING RULES:\n' +
    '- Navy + white = classic, always works\n' +
    '- Navy + tan/khaki = smart casual staple\n' +
    '- Navy + grey = clean and professional\n' +
    '- Black + white = sharp and minimal\n' +
    '- Black + grey = sleek and modern\n' +
    '- Tan + white = warm and clean\n' +
    '- Brown shoes + tan/khaki/navy bottoms = correct\n' +
    '- Brown shoes + black bottoms = NEVER\n' +
    '- Navy + black in same outfit = NEVER\n' +
    '- Belt color must match shoe color when both present\n' +
    '- Maximum 3 colors per outfit\n\n' +
    'FORMALITY RULES:\n' +
    '- Formal event: dress shoes required, no sneakers, blazer or dress shirt preferred\n' +
    '- Interview: dress shoes or clean oxfords, dress shirt or blazer, no joggers\n' +
    '- Business casual: clean sneakers or smart shoes, chinos or trousers, no athletic wear\n' +
    '- Date night: chelsea boots or leather sneakers, elevated casual, no athletic wear\n' +
    '- Party: creative combinations allowed, streetwear elements welcome\n' +
    '- Casual hangout: comfort focused, any clean shoes\n\n' +
    'STYLE RULES:\n' +
    '- Minimal: neutral colors only, clean lines, no patterns\n' +
    '- Classic: navy/white/tan/brown palette, timeless pieces, leather shoes\n' +
    '- Smart casual: elevated basics, clean footwear, structured tops\n' +
    '- Streetwear: bold combos, layers, sneakers required, caps allowed\n' +
    '- Rugged: flannel, denim, boots, cargo, earth tones\n\n' +
    'CONSTRUCTION RULES:\n' +
    '- Each outfit = exactly 1 top + 1 bottom + 1 shoes + max 1 accessory\n' +
    '- Never 2 tops, 2 bottoms, or 2 shoes in same outfit\n' +
    '- All 3 outfits must be distinctly different\n' +
    '- Only use products from the list\n' +
    '- Stay under budget\n\n' +
    'Return EXACTLY 3 outfits as raw JSON only, no markdown:\n' +
    '[{"title":"Confident outfit name","why":"Speak like a stylist to the customer. Mention specific colors, why they work together, and why this is right for this occasion.","items":[{"name":"exact product key","price":0},{"name":"exact product key","price":0},{"name":"exact product key","price":0}]}]';

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error?.message }, { status: 500 });

    const text = data.choices[0].message.content.replace(/```json|```/g, '').trim();
    const outfits = JSON.parse(text);
    const fixedOutfits = outfits.slice(0, 3).map(validateAndFixOutfit);

    return NextResponse.json({ outfits: fixedOutfits });

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}