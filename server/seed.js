const init = require('./db');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

function hash(pw, salt = 'horizon-salt-2025') {
  return crypto.createHash('sha256').update(pw + salt).digest('hex');
}

const brands = [
  { id: uuidv4(), name: 'Horizon Signature', slug: 'horizon-signature', description: 'Our premium house brand', logo: null },
  { id: uuidv4(), name: 'Nordik', slug: 'nordik', description: 'Scandinavian minimalist design', logo: null },
  { id: uuidv4(), name: 'Apex Audio', slug: 'apex-audio', description: 'Premium audio equipment', logo: null },
  { id: uuidv4(), name: 'Artisan Guild', slug: 'artisan-guild', description: 'Handcrafted by master artisans', logo: null },
  { id: uuidv4(), name: 'Merino Co.', slug: 'merino-co', description: 'Premium merino wool goods', logo: null },
  { id: uuidv4(), name: 'Celestial Labs', slug: 'celestial-labs', description: 'Luxury fragrance and skincare', logo: null },
];

const categories = [
  { id: uuidv4(), name: 'Accessories', slug: 'accessories', description: 'Watches, bags, and more' },
  { id: uuidv4(), name: 'Electronics', slug: 'electronics', description: 'Tech and gadgets' },
  { id: uuidv4(), name: 'Clothing', slug: 'clothing', description: 'Apparel for every occasion' },
  { id: uuidv4(), name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Elevate your living space' },
  { id: uuidv4(), name: 'Beauty', slug: 'beauty', description: 'Skincare and fragrances' },
  { id: uuidv4(), name: 'Gadgets', slug: 'gadgets', description: 'Smart devices and accessories' },
  { id: uuidv4(), name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Gear for the active life' },
];

const https = require('https');
function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))); }).on('error', reject);
  });
}
const IMG = {
  cooler: IMG.cooler,
  fan140: IMG.cooler,
  fan120: IMG.fan120,
  laptop: IMG.laptop,
  towerfan: IMG.towerfan,
  purifier: IMG.purifier,
  ac: IMG.ac,
  fridge: IMG.fridge,
  pillow: IMG.pillow,
  stand: IMG.stand,
  gear: IMG.gear,
};
const CATEGORY_MAP = {
  'smartphones': 1, 'laptops': 1, 'tablets': 1, 'mobile-accessories': 0, 'headphones': 1, 'speakers': 1,
  'computer-accessories': 1, 'computer-peripherals': 1, 'home-decoration': 3, 'furniture': 3, 'kitchen-accessories': 3,
  'home-appliances': 3, 'groceries': 3, 'clothing': 2, 'clothing-accessories': 0, 'mens-shirts': 2,
  'mens-shoes': 2, 'mens-watches': 0, 'womens-dresses': 2, 'womens-shoes': 2, 'womens-watches': 0, 'womens-bags': 0,
  'womens-jewellery': 0, 'sunglasses': 0, 'tops': 2, 'beauty': 4, 'fragrances': 4, 'skincare': 4,
  'sports-accessories': 6, 'sports-equipment': 6, 'vehicle': 5, 'motorcycle': 5, 'fitness': 6,
};
let products = [];
const COOLING_PRODUCTS = [
  { name: 'Arctic Freezer 34 eSports Duo CPU Cooler', description: 'Dual-fan CPU air cooler with 120mm PWM fans, direct-touch copper heatpipes, and ultra-low noise operation. Supports Intel LGA1700/1200 and AMD AM5/AM4.', price: 89.99, priceM: 89.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 45, rating: 4.7 },
  { name: 'Noctua NH-D15 Chromax Black CPU Cooler', description: 'Premium dual-tower CPU cooler with two 140mm fans, six heatpipes, and legendary quiet operation. The gold standard for air cooling.', price: 189.99, priceM: 189.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 22, rating: 4.9 },
  { name: 'Corsair H150i Elite LCD XT Liquid Cooler', description: '360mm all-in-one liquid CPU cooler with brilliant LCD pump screen, three AF120 RGB ELITE fans, and extreme cooling performance for high-end CPUs.', price: 289.99, priceM: 289.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 15, rating: 4.8 },
  { name: 'NZXT Kraken X73 RGB Liquid Cooler', description: '360mm AIO liquid cooler with RGB fans and customizable infinity mirror pump design. Silent operation with powerful thermal performance.', price: 259.99, priceM: 259.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 18, rating: 4.6 },
  { name: 'Lian Li Galahad II Trinity 360 AIO', description: '360mm all-in-one liquid cooler with daisy-chainable fans, dual-chamber pump design, and improved cold plate for latest-gen CPUs.', price: 239.99, priceM: 239.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 12, rating: 4.5 },
  { name: 'Dyson Pure Hot+Cool HP07', description: 'Air purifier, heater, and fan all-in-one. Captures 99.97% of pollutants, heats and cools rooms evenly, with intelligent climate control and Dyson Link app.', price: 799.99, priceM: 799.99, category: 'Home & Kitchen', catIdx: 3, image: IMG.purifier, images: [IMG.purifier, IMG.ac], stock: 10, rating: 4.4 },
  { name: 'Dyson AM07 Tower Fan', description: 'Bladeless tower fan with Air Multiplier technology, 40% quieter than previous generation. Oscillation, 10 airflow settings, and sleep timer.', price: 499.99, priceM: 499.99, category: 'Home & Kitchen', catIdx: 3, image: IMG.towerfan, images: [IMG.towerfan], stock: 14, rating: 4.3 },
  { name: 'Honeywell QuietSet Tower Fan', description: 'Whole-room tower fan with 8 speeds, remote control, and ultra-quiet operation. Electronic touch controls and auto-brightness display.', price: 89.99, priceM: 89.99, category: 'Home & Kitchen', catIdx: 3, image: IMG.ac, images: [IMG.ac], stock: 60, rating: 4.1 },
  { name: 'LG Dual Inverter Portable Air Conditioner', description: '14,000 BTU portable AC with dual inverter technology, cools up to 700 sq ft. Wi-Fi enabled, energy-efficient, and ultra-quiet operation.', price: 699.99, priceM: 699.99, category: 'Home & Kitchen', catIdx: 3, image: IMG.ac, images: [IMG.ac], stock: 8, rating: 4.5 },
  { name: 'Midea U-Shaped Smart Inverter Window AC', description: '8,000 BTU window air conditioner with U-shaped design for noise reduction and security. Wi-Fi control, energy star rated, cools up to 350 sq ft.', price: 449.99, priceM: 449.99, category: 'Home & Kitchen', catIdx: 3, image: IMG.ac, images: [IMG.ac], stock: 20, rating: 4.3 },
  { name: 'Honeywell Evaporative Air Cooler', description: 'Portable swamp cooler for garage, patio, or workshop. Cools up to 450 sq ft with humidification function. Three speeds and ice compartments.', price: 219.99, priceM: 219.99, category: 'Home & Kitchen', catIdx: 3, image: IMG.ac, images: [IMG.ac], stock: 25, rating: 3.9 },
  { name: 'Vornado 660 Whole Room Air Circulator', description: 'Iconic whole-room air circulator with vortex airflow, deep-pitch blades, and 3-speed manual control. Moves air up to 100 feet.', price: 129.99, priceM: 129.99, category: 'Home & Kitchen', catIdx: 3, image: IMG.ac, images: [IMG.ac], stock: 30, rating: 4.7 },
  { name: 'IceGiant ProSiphon Elite Cooler', description: 'Thermosiphon CPU cooler with no pump or moving parts. Passive phase-change cooling equals 360mm AIO performance with zero pump noise.', price: 399.99, priceM: 399.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 5, rating: 4.4 },
  { name: 'Dyson TP09 Purifying Fan', description: 'Air purifier and bladeless fan with HEPA H13 filter, real-time air quality display, oscillation, and 10 airflow speeds. Captures 99.95% of particles.', price: 649.99, priceM: 649.99, category: 'Home & Kitchen', catIdx: 3, image: IMG.towerfan, images: [IMG.towerfan], stock: 12, rating: 4.5 },
  { name: 'Thermaltake TOUGHAIR 510 CPU Cooler', description: 'Dual-tower CPU air cooler with dual 140mm fans, 8 heatpipes, and offset fin design for RAM clearance. 250W TDP cooling capacity.', price: 149.99, priceM: 149.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 28, rating: 4.6 },
  { name: 'be quiet! Dark Rock Pro 5 CPU Cooler', description: 'Premium silent CPU cooler with two fans, 7 high-performance heatpipes, and virtually inaudible operation at 250W TDP. Diamond-cut aluminum.', price: 169.99, priceM: 169.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 18, rating: 4.8 },
  { name: 'Noctua NF-A14 PWM 140mm Fan', description: 'Premium 140mm case fan with advanced aerodynamic design, SSO2 bearing, and superb quietness. Ideal for radiator or case ventilation.', price: 39.99, priceM: 39.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 120, rating: 4.9 },
  { name: 'Corsair LL120 RGB 120mm Fan 3-Pack', description: 'Three 120mm RGB fans with 16 individually addressable RGB LEDs per fan, PWM speed control, and low-noise operation. Includes Lighting Node Core.', price: 129.99, priceM: 129.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 45, rating: 4.5 },
  { name: 'Laptop Cooling Pad Arctic X9', description: 'Gaming laptop cooler with 200mm RGB fan, dual 140mm fans, adjustable height stands, and blue LED lighting. Fits laptops up to 19 inches.', price: 69.99, priceM: 69.99, category: 'Accessories', catIdx: 0, image: IMG.stand, images: [IMG.stand], stock: 35, rating: 4.2 },
  { name: 'Kootek Laptop Cooling Pad', description: 'Chill vent laptop cooler with 5 built-in quiet fans, dual USB ports, 6 adjustable height levels, and blue LED ring. Compatible with 12-17 inch laptops.', price: 39.99, priceM: 39.99, category: 'Accessories', catIdx: 0, image: IMG.stand, images: [IMG.stand], stock: 65, rating: 4.0 },
  { name: 'EcoFlow Wave 2 Portable AC', description: 'Portable battery-powered air conditioner for camping, van life, and outdoor use. 4000 BTU cooling, 3000 BTU heating, 4-hour battery life, Wi-Fi control.', price: 1299.99, priceM: 1299.99, category: 'Sports & Outdoors', catIdx: 6, image: IMG.ac, images: [IMG.ac], stock: 6, rating: 4.3 },
  { name: 'DeepCool AK620 Zero Dark CPU Cooler', description: 'High-performance dual-tower CPU air cooler with all-black design, 6 copper heatpipes, dual 120mm fans, and excellent RAM clearance. 260W TDP.', price: 129.99, priceM: 129.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 30, rating: 4.7 },
  { name: 'Cooler Master MasterLiquid ML360L V2', description: '360mm AIO RGB liquid cooler with 3rd gen pump, dual chamber design, and three SickleFlow 120mm ARGB fans. Excellent value RGB cooling.', price: 159.99, priceM: 159.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 22, rating: 4.3 },
  { name: 'Thermalright Peerless Assassin 120 SE', description: 'Dual-tower CPU cooler with six heatpipes, dual 120mm C12 fans, and all-black coating. Exceptional performance for under $50.', price: 49.99, priceM: 49.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 55, rating: 4.8 },
  { name: 'NexiGo PS5 Cooling Stand', description: 'Dual-fan cooling stand for PS5 with RGB lighting, dual controller charging station, and 10 game slots. Keeps console cool during extended gaming.', price: 59.99, priceM: 59.99, category: 'Gadgets', catIdx: 5, image: IMG.stand, images: [IMG.stand], stock: 20, rating: 4.2 },
  { name: 'Microsoft Xbox Series X Cooling Stand', description: 'Vertical cooling stand for Xbox Series X with enhanced dual-fan cooling, controller charging dock, HDMI cable and game storage.', price: 49.99, priceM: 49.99, category: 'Gadgets', catIdx: 5, image: IMG.stand, images: [IMG.stand], stock: 18, rating: 4.1 },
  { name: 'Smart Neck Fan Portable', description: 'Wearable neck fan with 78 vents, 720° airflow, 4000mAh battery, and 3 speeds. Hands-free cooling for outdoor work, commuting, and travel.', price: 59.99, priceM: 59.99, category: 'Accessories', catIdx: 0, image: IMG.ac, images: [IMG.ac], stock: 40, rating: 4.1 },
  { name: 'DeepCool LT720 Premium Liquid Cooler', description: '360mm AIO with fourth-generation pump, 3x 120mm FK120 fans, anti-leak technology, and addressable RGB pump cap. High-end cooling for enthusiast builds.', price: 199.99, priceM: 199.99, category: 'Electronics', catIdx: 1, image: IMG.cooler, images: [IMG.cooler], stock: 10, rating: 4.6 },
];
async function loadProducts() {
  try {
    const res = await httpGet('https://dummyjson.com/products?limit=200');
    const items = res.products || [];
    products = items.filter(item => item.price >= 50).map(item => {
      const price = Math.round(item.price * 1.1 * 100) / 100;
      return {
        name: item.title, description: item.description, price: price,
        comparePrice: item.discountPercentage ? Math.round(price / (1 - item.discountPercentage / 200) * 100) / 100 : null,
        categoryId: CATEGORY_MAP[item.category] ?? 0, brandId: 0,
        sku: `EXT-${item.id}`, weight: null, lowStockAlert: 5, stock: item.stock || 50, featured: item.price >= 500 ? 1 : 0,
        image: item.thumbnail || '', images: item.images || [],
        features: JSON.stringify((item.tags || []).map(t => t.charAt(0).toUpperCase() + t.slice(1))),
        specifications: JSON.stringify({ Brand: item.brand || 'Generic', Rating: (item.rating || 3 + Math.random() * 2).toFixed(1) }),
      };
    });
    products.push(...COOLING_PRODUCTS.map(item => ({
      name: item.name, description: item.description, price: item.priceM,
      comparePrice: null, categoryId: item.catIdx, brandId: 0,
      sku: `COOL-${uuidv4().slice(0, 8)}`, weight: null, lowStockAlert: 3, stock: item.stock, featured: 0,
      image: item.image, images: item.images,
      features: JSON.stringify(['Premium Build', 'Quiet Operation', 'Energy Efficient', 'Easy Installation', '1 Year Warranty']),
      specifications: JSON.stringify({ Brand: 'Horizon Tech', Rating: item.rating.toFixed(1), Warranty: '1 Year' }),
    })));
    console.log(`Loaded ${products.length} products (${items.length} from DummyJSON + ${COOLING_PRODUCTS.length} cooling)`);
  } catch (e) {
    console.log('Failed to fetch products from DummyJSON, using fallback');
  }
}

const coupons = [
  { code: 'WELCOME20', discount: 20, type: 'percentage', minOrder: 100, usageLimit: 100, expiresAt: '2026-12-31' },
  { code: 'FREESHIP', discount: 15, type: 'fixed', minOrder: 200, usageLimit: 50, expiresAt: '2026-12-31' },
  { code: 'SUMMER25', discount: 25, type: 'percentage', minOrder: 150, usageLimit: 200, expiresAt: '2026-09-30' },
];

const blogPosts = [
  { title: 'The Art of Slow Living: Curating a Mindful Home', slug: 'art-of-slow-living', excerpt: 'Discover how intentional design choices can transform your living space into a sanctuary of calm and productivity.', content: '<p>In our fast-paced world, the home should be a retreat from the noise. At Horizon, we believe in curating spaces that reflect your values and nurture your well-being.</p><h2>Start with Intention</h2><p>Every piece in your home should serve a purpose or spark joy. Before making a purchase, ask yourself: does this item align with how I want to live?</p><h2>Quality Over Quantity</h2><p>Investing in fewer, higher-quality pieces not only reduces clutter but also ensures longevity. Our Artisan Guild collection embodies this philosophy.</p><h2>Natural Materials</h2><p>Wood, stone, wool, and ceramic bring warmth and texture to any space. They age gracefully and connect us to the natural world.</p>', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800', author: 'Horizon Editorial', tags: 'lifestyle,home,design', published: 1 },
  { title: 'Top 5 Travel Essentials for the Modern Nomad', slug: 'travel-essentials-2026', excerpt: 'From wrinkle-free blazers to compact chargers, these are the items no traveler should leave home without.', content: '<p>Whether you are a frequent flyer or planning your first big trip, having the right gear makes all the difference.</p><h2>1. The Travel Blazer</h2><p>Our Merino Wool Travel Blazer is wrinkle-resistant, machine washable, and has hidden security pockets. It transitions from plane to boardroom effortlessly.</p><h2>2. Wireless Headphones</h2><p>Noise-cancelling headphones are non-negotiable for long flights. The Apex Wireless Headphones offer 40 hours of battery life.</p><h2>3. Compact Charging Station</h2><p>Our 3-in-1 Wireless Charging Station eliminates cable clutter in hotel rooms.</p><h2>4. The Travel Backpack</h2><p>The Aer Travel Backpack 30L has a dedicated laptop compartment and hidden passport pocket.</p><h2>5. Leather Sneakers</h2><p>Italian calfskin leather sneakers that look sharp but feel like slippers.</p>', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', author: 'Horizon Editorial', tags: 'travel,lifestyle,essentials', published: 1 },
  { title: 'Behind the Craft: How Our Ceramic Sets Are Made', slug: 'behind-the-craft-ceramic', excerpt: 'A look into the traditional Japanese techniques used by our Artisan Guild partners in Kyoto.', content: '<p>Every Horizon ceramic piece tells a story of heritage, skill, and patience. Our Artisan Guild partners in Kyoto have been perfecting their craft for generations.</p><h2>The Clay</h2><p>We use locally sourced stoneware clay from the Yamashiro region, known for its high iron content and warm earthy tones.</p><h2>Throwing</h2><p>Each piece is hand-thrown on a potter\'s wheel, taking 15-20 minutes of focused work. No two pieces are identical.</p><h2>Glazing</h2><p>Our signature matte glaze is a closely guarded recipe, applied by hand in three layers for depth and durability.</p><h2>Firing</h2><p>Pieces are fired twice in a wood-fired kiln at 1280°C. The ash from the wood creates subtle, natural variations in the glaze.</p>', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800', author: 'Horizon Editorial', tags: 'craft,artisans,ceramics', published: 1 },
  { title: 'Gift Guide: Holiday 2026', slug: 'holiday-gift-guide-2026', excerpt: 'Curated gifts for every personality type on your list this holiday season.', content: '<p>Finding the perfect gift is an art. Let us help you match each person on your list with something they will treasure.</p><h2>For the Tech Enthusiast</h2><p>The Horizon 27" 4K Monitor or the Neo Mechanical Keyboard are sure to impress.</p><h2>For the Style Icon</h2><p>Celestial Eau de Parfum or the Heritage Leather Briefcase make elegant statements.</p><h2>For the Adventurer</h2><p>The TrailRunner Pro GPS Watch or the Travel Backpack are perfect companions.</p><h2>For the Homebody</h2><p>The Nordic Desk Lamp or the Ceramic Pour-Over Set elevate everyday rituals.</p>', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800', author: 'Horizon Editorial', tags: 'gift-guide,holiday,shopping', published: 1 },
  { title: 'Why Merino Wool Is the Ultimate Travel Fabric', slug: 'merino-wool-travel', excerpt: 'The science behind nature\'s most versatile fiber and why every traveler needs it.', content: '<p>Merino wool is not just for winter. This remarkable fiber has properties that make it ideal for year-round travel.</p><h2>Temperature Regulation</h2><p>Merino fibers trap air pockets that insulate in cold weather and release heat when it is warm.</p><h2>Moisture Wicking</h2><p>It can absorb up to 30% of its weight in moisture without feeling wet, keeping you dry and comfortable.</p><h2>Odor Resistance</h2><p>The natural lanolin in merino wool resists bacteria growth, meaning you can wear it multiple days without odor.</p><h2>Wrinkle Resistance</h2><p>Merino fibers are naturally elastic, bouncing back to shape after packing.</p>', image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800', author: 'Horizon Editorial', tags: 'fabric,travel,merino-wool', published: 1 },
];

async function seed() {
  await loadProducts();
  const db = await init();
  const tables = ['reviews', 'wishlist', 'order_tracking', 'invoices', 'orders', 'loyalty_transactions', 'referrals', 'notifications', 'site_notifications', 'gift_cards', 'wallet_addresses', 'coupons', 'payment_methods', 'page_settings', 'translations', 'currencies', 'blog_posts', 'product_images', 'products', 'categories', 'brands', 'users'];
  for (const t of tables) {
    try { db.prepare(`DELETE FROM ${t}`).run(); } catch (e) { /* table might not exist */ }
  }

  // Brands
  const bInsert = db.prepare('INSERT INTO brands (id, name, slug, description, logo) VALUES (?, ?, ?, ?, ?)');
  for (const b of brands) bInsert.run(b.id, b.name, b.slug, b.description, b.logo);

  // Categories
  const cInsert = db.prepare('INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)');
  for (const c of categories) cInsert.run(c.id, c.name, c.slug, c.description);

  // Products + images
  const pInsert = db.prepare(`INSERT INTO products (id, name, description, price, comparePrice, categoryId, brandId, category, sku, weight, lowStockAlert, stock, featured, image, features, specifications, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const piInsert = db.prepare('INSERT INTO product_images (id, productId, url, sortOrder) VALUES (?, ?, ?, ?)');
  for (const p of products) {
    const pid = uuidv4();
    const catName = categories[p.categoryId].name;
    pInsert.run(pid, p.name, p.description, p.price, p.comparePrice, categories[p.categoryId].id, brands[p.brandId].id, catName, p.sku, p.weight, p.lowStockAlert, p.stock, p.featured, p.image, p.features, p.specifications, 1);
    p.images.forEach((url, idx) => {
      piInsert.run(uuidv4(), pid, url, idx);
    });
  }

  // Coupons
  const coInsert = db.prepare('INSERT INTO coupons (id, code, discount, type, minOrder, usageLimit, expiresAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const c of coupons) coInsert.run(uuidv4(), c.code, c.discount, c.type, c.minOrder, c.usageLimit, c.expiresAt);

  // Payment methods
  const pmInsert = db.prepare('INSERT INTO payment_methods (id, name, type, enabled, instructions) VALUES (?, ?, ?, ?, ?)');
  const pMethods = [
    { name: 'Gift Card', type: 'gift_card', instructions: 'Redeem your Horizon gift card. Recommended for easy checkout.' },
    { name: 'Cryptocurrency', type: 'crypto', instructions: 'Pay with Bitcoin, Ethereum, or USDT. Recommended for privacy.' },
    { name: 'Wallet Balance', type: 'wallet', instructions: 'Pay using your Horizon account wallet balance.' },
  ];
  for (const pm of pMethods) pmInsert.run(uuidv4(), pm.name, pm.type, 1, pm.instructions);

  // Users — admin + sample customer
  const userInsert = db.prepare('INSERT INTO users (id, name, email, password, role, avatar, walletBalance, loyaltyPoints, referralCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const adminId = uuidv4();
  userInsert.run(adminId, 'Admin', 'admin@horizon.com', 'HZNadmin!789', 'admin', null, 10000, 5000, 'HZNADMIN');
  console.log('Created admin user: admin@horizon.com / HZNadmin!789');

  const customerId = uuidv4();
  userInsert.run(customerId, 'Jane Customer', 'jane@example.com', 'HZNcustomer!456', 'customer', null, 0, 0, 'HZNJANE');
  console.log('Created customer user: jane@example.com / HZNcustomer!456');

  // Page settings
  const sInsert = db.prepare('INSERT INTO page_settings (key, value) VALUES (?, ?)');
  const settings = {
    'home_hero_title': 'Beyond Premium',
    'home_hero_subtitle': 'Curated essentials for the modern connoisseur',
    'ads_countdown_target': '2026-12-31T23:59:59',
    'ads_countdown_message': 'Flash sale ends in',
    'site_name': 'Horizon',
    'site_description': 'Premium e-commerce for the discerning shopper',
    'support_email': 'support@horizon.com',
    'slideshow_slide1_image': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
    'slideshow_slide1_title': 'Beyond Premium',
    'slideshow_slide1_subtitle': 'Curated essentials for the modern connoisseur',
    'slideshow_slide2_image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920',
    'slideshow_slide2_title': 'Engineered for Adventure',
    'slideshow_slide2_subtitle': 'Precision gear for life without limits',
    'slideshow_slide3_image': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1920',
    'slideshow_slide3_title': 'Crafted by Hand',
    'slideshow_slide3_subtitle': 'Artisanal pieces from master makers around the world',
    'promo_banner_enabled': '1',
    'promo_banner_text': 'Free shipping on all orders over $200 - use code FREESHIP',
    'promo_banner_target': '2026-12-31T23:59:59',
  };
  for (const [k, v] of Object.entries(settings)) sInsert.run(k, v);

  // Wallet addresses for crypto
  const wInsert = db.prepare('INSERT INTO wallet_addresses (id, currency, address, network) VALUES (?, ?, ?, ?)');
  const wallets = [
    { currency: 'Bitcoin (BTC)', address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', network: 'Bitcoin' },
    { currency: 'Ethereum (ETH)', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18', network: 'ERC-20' },
    { currency: 'USDT (ERC-20)', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18', network: 'ERC-20' },
    { currency: 'USDT (TRC-20)', address: 'TXYZ1234567890abcdefghijklmnopqrstuvwxyz', network: 'TRC-20' },
  ];
  for (const w of wallets) wInsert.run(uuidv4(), w.currency, w.address, w.network);

  // Gift cards
  const gInsert = db.prepare('INSERT INTO gift_cards (id, code, amount, balance, senderName, recipientEmail, message, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  gInsert.run(uuidv4(), 'HZN-GIFT-100', 100, 100, 'Horizon', 'recipient@example.com', 'Enjoy this gift from Horizon!', 1);
  gInsert.run(uuidv4(), 'HZN-GIFT-50', 50, 50, 'John D.', 'john@example.com', 'Happy birthday!', 1);
  gInsert.run(uuidv4(), 'HZN-GIFT-25', 25, 25, 'Sarah M.', 'sarah@example.com', 'A little something for you', 1);

  // Blog posts
  const bpInsert = db.prepare('INSERT INTO blog_posts (id, title, slug, excerpt, content, image, author, tags, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  for (const bp of blogPosts) {
    bpInsert.run(uuidv4(), bp.title, bp.slug, bp.excerpt, bp.content, bp.image, bp.author, bp.tags, bp.published);
  }

  // Currencies
  const currInsert = db.prepare('INSERT INTO currencies (code, name, symbol, rate, isDefault, active) VALUES (?, ?, ?, ?, ?, ?)');
  currInsert.run('USD', 'US Dollar', '$', 1.0, 1, 1);
  currInsert.run('EUR', 'Euro', '\u20AC', 0.92, 0, 1);
  currInsert.run('GBP', 'British Pound', '\u00A3', 0.79, 0, 1);
  currInsert.run('JPY', 'Japanese Yen', '\u00A5', 149.50, 0, 1);
  currInsert.run('CAD', 'Canadian Dollar', 'C$', 1.36, 0, 1);
  currInsert.run('AUD', 'Australian Dollar', 'A$', 1.53, 0, 1);

  // Translations
  const trInsert = db.prepare('INSERT INTO translations (locale, key, value) VALUES (?, ?, ?)');
  const en = [
    ['nav.home', 'Home'], ['nav.shop', 'Shop'], ['nav.blog', 'Blog'], ['nav.about', 'About'],
    ['nav.cart', 'Cart'], ['nav.profile', 'Profile'], ['nav.admin', 'Admin'],
    ['nav.login', 'Login'], ['nav.register', 'Register'], ['nav.logout', 'Logout'],
    ['home.hero.title', 'Beyond Premium'], ['home.hero.subtitle', 'Curated essentials for the modern connoisseur'],
    ['home.featured', 'Featured Products'], ['home.categories', 'Shop by Category'],
    ['cart.title', 'Shopping Cart'], ['cart.checkout', 'Proceed to Checkout'], ['cart.empty', 'Your cart is empty'],
    ['product.addToCart', 'Add to Cart'], ['product.addToWishlist', 'Add to Wishlist'],
    ['product.reviews', 'Customer Reviews'], ['product.related', 'You May Also Like'],
    ['product.specifications', 'Specifications'], ['product.features', 'Features'],
    ['checkout.title', 'Checkout'], ['checkout.placeOrder', 'Place Order'],
    ['order.title', 'Order Confirmation'], ['order.number', 'Order Number'],
    ['profile.title', 'My Profile'], ['profile.wallet', 'Wallet'], ['profile.settings', 'Settings'],
    ['profile.notifications', 'Notifications'], ['profile.orders', 'My Orders'],
    ['wallet.balance', 'Wallet Balance'], ['wallet.deposit', 'Deposit Funds'],
    ['auth.login', 'Sign In'], ['auth.register', 'Create Account'], ['auth.email', 'Email'],
    ['auth.password', 'Password'], ['auth.forgot', 'Forgot Password?'],
    ['footer.rights', 'All rights reserved.'],
    ['admin.dashboard', 'Dashboard'], ['admin.products', 'Products'], ['admin.orders', 'Orders'],
    ['admin.users', 'Users'], ['admin.categories', 'Categories'], ['admin.brands', 'Brands'],
    ['admin.blog', 'Blog Posts'], ['admin.giftcards', 'Gift Cards'], ['admin.reviews', 'Reviews'],
    ['admin.payments', 'Payments'], ['admin.pages', 'Page Settings'], ['admin.notifications', 'Notifications'],
    ['cookie.title', 'We Value Your Privacy'],
    ['cookie.message', 'We use cookies to enhance your browsing experience and analyze our traffic.'],
    ['cookie.accept', 'Accept All'], ['cookie.decline', 'Decline'],
  ];
  for (const [key, value] of en) trInsert.run('en', key, value);

  // Site notifications
  const snInsert = db.prepare('INSERT INTO site_notifications (id, message, type, active) VALUES (?, ?, ?, ?)');
  snInsert.run(uuidv4(), 'Free shipping on all orders over $200 - use code FREESHIP', 'promo', 1);
  snInsert.run(uuidv4(), 'Explore our new Summer 2026 collection', 'info', 1);
  snInsert.run(uuidv4(), 'Welcome to Horizon. Enjoy premium shopping.', 'welcome', 1);

  // Reviews — convincing reviews with 3.5-5 star ratings
  const rInsert = db.prepare('INSERT INTO reviews (id, productId, userId, userName, rating, text) VALUES (?, ?, ?, ?, ?, ?)');
  const allProducts = db.prepare('SELECT id, name FROM products').all();
  const reviewData = [
    { name: 'Michael T.', rating: 5, text: 'Absolutely stunning piece. The craftsmanship is evident from the moment you unbox it. Worth every penny and more. I have received so many compliments.' },
    { name: 'Rachel K.', rating: 4.5, text: 'Really impressed with the quality. Shipping was fast and the packaging was beautiful. Only giving 4.5 because I wish it came in more color options, but the product itself is flawless.' },
    { name: 'David L.', rating: 5, text: 'This is my third purchase from Horizon and they never disappoint. The attention to detail is remarkable. Will definitely be a repeat customer.' },
    { name: 'Sophia M.', rating: 4, text: 'Very good quality for the price point. Feels premium and looks great. Would recommend to anyone looking for something special without breaking the bank.' },
    { name: 'Alex W.', rating: 3.5, text: 'Good product overall. The design is nice and it functions well. Took off a star because the delivery took a bit longer than expected, but customer service was responsive.' },
    { name: 'Emma J.', rating: 5, text: 'Bought this as a gift and they absolutely loved it. The presentation box alone is worth it. Horizon knows how to make you feel special.' },
    { name: 'Chris B.', rating: 4, text: 'Solid build quality and looks exactly like the photos. Very happy with my purchase. Would buy again.' },
    { name: 'Olivia P.', rating: 4.5, text: 'Exceeded my expectations. The materials are top-notch and it feels built to last. The only minor thing is the instruction manual could be clearer, but the product itself is 10/10.' },
    { name: 'Daniel H.', rating: 5, text: 'Worth the investment. I was hesitant at first due to the price, but after using it for a week I can confidently say it is one of the best purchases I have made this year.' },
    { name: 'Lily N.', rating: 4, text: 'Beautiful design and great functionality. The packaging was also really nice. Makes a great gift or personal treat.' },
  ];
  let ri = 0;
  for (const p of allProducts) {
    if (ri >= reviewData.length) break;
    const r = reviewData[ri];
    rInsert.run(uuidv4(), p.id, customerId, r.name, r.rating, r.text);
    ri++;
  }

  console.log(`Seeded ${brands.length} brands, ${categories.length} categories, ${products.length} products, ${coupons.length} coupons, ${blogPosts.length} blog posts, 6 currencies, 3 gift cards, ${en.length} translations, 3 site notifications, ${wallets.length} wallet addresses`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
