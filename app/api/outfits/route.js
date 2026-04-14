import { NextResponse } from 'next/server';

const AFFILIATE_TAG = 'stylebot20-20';

const PRODUCTS = {
  "white oxford shirt": {
    name: "Cotton King Slim Fit Oxford Shirt",
    url: `https://www.amazon.com/dp/B0D3M26MWK?tag=${AFFILIATE_TAG}`,
    price: 35
  },
  "slim chino pants": {
    name: "Amazon Essentials Slim Fit Chinos",
    url: `https://www.amazon.com/dp/B077597W8N?tag=${AFFILIATE_TAG}`,
    price: 35
  },
  "white leather sneakers": {
    name: "FRACORA White Leather Sneakers",
    url: `https://www.amazon.com/dp/B0BVQC9D3Y?tag=${AFFILIATE_TAG}`,
    price: 45
  },
  "dark wash slim jeans": {
    name: "Tapered Stretch Denim Jeans",
    url: `https://www.amazon.com/dp/B0GGB9SPC6?tag=${AFFILIATE_TAG}`,
    price: 45
  },
  "chelsea boots": {
    name: "Bruno Marc Suede Chelsea Boots",
    url: `https://www.amazon.com/dp/B06XTW21W5?tag=${AFFILIATE_TAG}`,
    price: 55
  },
  "navy henley": {
    name: "Cotrasen Long Sleeve Henley",
    url: `https://www.amazon.com/dp/B0FHQ2774C?tag=${AFFILIATE_TAG}`,
    price: 30
  },
  "grey polo shirt": {
    name: "Cotrasen Performance Polo Shirt",
    url: `https://www.amazon.com/dp/B0DX281R32?tag=${AFFILIATE_TAG}`,
    price: 28
  },
  "charcoal joggers": {
    name: "Libin Stretch Tapered Joggers",
    url: `https://www.amazon.com/dp/B0CC5VCTFG?tag=${AFFILIATE_TAG}`,
    price: 38
  }
};

function matchProduct(itemName) {
  const lower = itemName.toLowerCase();
  for (const [key, product] of Object.entries(PRODUCTS)) {
    if (lower.includes(key) || key.split(' ').some(word => lower.includes(word))) {
      return product;
    }
  }
  return null;
}

export async function POST(req) {
  const { occasion, style, budget } = await req.json();

  const productList = Object.entries(PRODUCTS)
    .map(([key, p]) => `- ${key}: ${p.name} ($${p.price})`)
    .join('\n');

  const prompt = `You are a men's personal stylist. Generate exactly 3 outfit recommendations.

Occasion: ${occasion}
Style preference: ${style}
Budget: $${budget} total

You MUST build outfits using ONLY these available products:
${productList}

Respond ONLY with a raw JSON array, no markdown, no explanation:
[
  {
    "title": "Short outfit name",
    "why": "One sentence why this works.",
    "items": [
      {"name": "exact product key from the list above", "price": 40},
      {"name": "exact product key from the list above", "price": 35},
      {"name": "exact product key from the list above", "price": 25}
    ]
  }
]

Use 3-4 items per outfit. Keep total prices under the budget. Use the exact key names from the product list.`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || 'OpenAI error' }, { status: 500 });
    }

    const text = data.choices[0].message.content.replace(/```json|```/g, '').trim();
    const outfits = JSON.parse(text);

    const outfitsWithLinks = outfits.map(outfit => ({
      ...outfit,
      items: outfit.items.map(item => {
        const matched = matchProduct(item.name);
        return {
          name: matched ? matched.name : item.name,
          price: matched ? matched.price : item.price,
          url: matched ? matched.url : `https://www.amazon.com/s?k=mens+${encodeURIComponent(item.name)}&tag=${AFFILIATE_TAG}`
        };
      })
    }));

    return NextResponse.json({ outfits: outfitsWithLinks });

  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}