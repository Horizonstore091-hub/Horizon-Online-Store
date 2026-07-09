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

const products = [
  { name: 'ChronoMaster Automatic Watch', description: 'Swiss-made automatic movement with sapphire crystal. Water-resistant to 100m with a premium stainless steel bracelet and luminescent hands. The perfect companion for the modern professional.', price: 299.00, comparePrice: 499.00, categoryId: 0, brandId: 0, sku: 'HZN-WCH-001', weight: 0.35, lowStockAlert: 5, stock: 25, featured: 1, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800', images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800','https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800','https://images.unsplash.com/photo-1587836374828-4dbafa94cfc8?w=800'], features: '["Swiss automatic movement","Sapphire crystal glass","100m water resistance","Stainless steel bracelet","Luminescent hands","Date display"]', specifications: '{"Movement":"Automatic (SW200)","Case":"316L Stainless Steel","Diameter":"40mm","Water Resistance":"100m","Crystal":"Sapphire","Warranty":"5 years"}' },
  { name: 'Heritage Leather Briefcase', description: 'Handcrafted full-grain Italian leather briefcase with brushed brass hardware. Fits laptops up to 15" with multiple organized compartments for all your essentials.', price: 449.00, comparePrice: 649.00, categoryId: 0, brandId: 1, sku: 'HZN-BAG-001', weight: 1.2, lowStockAlert: 3, stock: 15, featured: 1, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800','https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800','https://images.unsplash.com/photo-1589729132389-8f0e0b53b7e7?w=800'], features: '["Full-grain Italian leather","Brushed brass hardware","Fits 15\" laptop","Multiple compartments","Detachable shoulder strap","YKK zippers"]', specifications: '{"Material":"Full-grain Italian leather","Dimensions":"16\" x 12\" x 5\"","Laptop Compartment":"Up to 15\"","Hardware":"Brushed brass","Strap":"Detachable, adjustable","Weight":"2.5 lbs"}' },
  { name: 'Apex Wireless Headphones', description: 'Premium noise-cancelling over-ear headphones with 40-hour battery life. Spatial audio with adaptive EQ, ultra-comfortable memory foam ear cups, and lossless audio via USB-C.', price: 349.00, comparePrice: 449.00, categoryId: 1, brandId: 2, sku: 'HZN-AUD-001', weight: 0.25, lowStockAlert: 5, stock: 50, featured: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800','https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800','https://images.unsplash.com/photo-1546435770-a3e315126e86?w=800'], features: '["Active noise cancellation","40-hour battery life","Spatial audio with dynamic head tracking","Memory foam ear cups","Lossless USB-C audio","Multipoint Bluetooth 5.3"]', specifications: '{"Driver":"40mm custom","Frequency Response":"4Hz - 40kHz","Battery":"40 hours (ANC on)","Charging":"USB-C, fast charge","Codecs":"LDAC, AAC, SBC","Weight":"250g"}' },
  { name: 'SmartHome Hub Pro', description: 'Central control hub for your smart home. Compatible with 5000+ devices. Voice control, automation routines, and energy monitoring built in.', price: 199.00, comparePrice: 279.00, categoryId: 5, brandId: 0, sku: 'HZN-GAD-001', weight: 0.4, lowStockAlert: 5, stock: 40, featured: 1, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800', images: ['https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800','https://images.unsplash.com/photo-1545259741-0a6e3e1c4b4a?w=800'], features: '["5000+ compatible devices","Voice control (Alexa, Google)","Energy monitoring","Automation routines","Zigbee, Z-Wave, Wi-Fi","Remote access via app"]', specifications: '{"Processor":"Quad-core 2.0GHz","Connectivity":"Wi-Fi 6, Zigbee, Z-Wave","Ports":"USB-C, Ethernet","Voice Assistants":"Alexa, Google Assistant","App":"iOS & Android","Power":"12V DC"}' },
  { name: 'Nordic Minimalist Desk Lamp', description: 'Architect-grade LED desk lamp with adjustable color temperature (2700K-6500K). Touch dimmer, wireless charging base, and a sleek aluminum build.', price: 189.00, comparePrice: null, categoryId: 3, brandId: 1, sku: 'HZN-HOM-001', weight: 0.8, lowStockAlert: 5, stock: 30, featured: 1, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800','https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'], features: '["Adjustable color temperature 2700K-6500K","Wireless charging base","Touch dimmer","Aircraft-grade aluminum","Flicker-free LED","5 brightness levels"]', specifications: '{"Material":"Aluminum","Color Temp":"2700K - 6500K","Brightness":"5 levels","Charging":"Qi wireless 15W","Power":"24W LED","Warranty":"3 years"}' },
  { name: 'Merino Wool Travel Blazer', description: 'Four-season travel blazer in premium New Zealand merino wool. Wrinkle-resistant, machine washable, with hidden security pockets and stretch comfort fit.', price: 395.00, comparePrice: 525.00, categoryId: 2, brandId: 4, sku: 'HZN-APP-002', weight: 0.6, lowStockAlert: 5, stock: 40, featured: 1, image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800', images: ['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'], features: '["New Zealand merino wool","Wrinkle-resistant fabric","Machine washable","Hidden security pockets","4-way stretch","Travel-friendly design"]', specifications: '{"Material":"100% Merino Wool","Fit":"Tailored / Stretch","Care":"Machine washable","Pockets":"6 (2 hidden)","Sizes":"S - 3XL","Weight":"1.2 lbs"}' },
  { name: 'Celestial Eau de Parfum', description: 'An enchanting blend of bergamot, iris, and amber with hints of vanilla and sandalwood. Long-lasting 40% perfume oil concentration in a hand-blown glass bottle.', price: 165.00, comparePrice: 220.00, categoryId: 4, brandId: 5, sku: 'HZN-BTY-001', weight: 0.15, lowStockAlert: 5, stock: 60, featured: 1, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800','https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'], features: '["40% perfume oil concentration","Hand-blown glass bottle","Long-lasting 8-10 hours","Bergamot, iris & amber","Vanilla & sandalwood base","Cruelty-free"]', specifications: '{"Concentration":"Eau de Parfum (40%)","Top Notes":"Bergamot, Pink Pepper","Heart":"Iris, Jasmine","Base":"Amber, Vanilla, Sandalwood","Volume":"50ml","Longevity":"8-10 hours"}' },
  { name: 'Horizon 27" 4K Monitor', description: '27-inch IPS 4K UHD monitor with 99% DCI-P3 color accuracy. USB-C 90W charging, KVM switch, and an ultra-slim bezel design.', price: 699.00, comparePrice: 899.00, categoryId: 1, brandId: 0, sku: 'HZN-MON-001', weight: 5.2, lowStockAlert: 3, stock: 20, featured: 0, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800','https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800'], features: '["27\" 4K UHD IPS panel","99% DCI-P3 color accuracy","USB-C 90W power delivery","Built-in KVM switch","Ultra-slim bezels","VESA mount compatible"]', specifications: '{"Panel":"27\" IPS 4K UHD","Resolution":"3840x2160","Color":"99% DCI-P3","Refresh":"60Hz","Ports":"USB-C, 2x HDMI, DP","Power":"90W USB-C"}' },
  { name: 'Artisan Ceramic Pour-Over Set', description: 'Hand-thrown stoneware dripper with matching carafe and reusable stainless steel filter. Each piece is uniquely crafted by Japanese artisans in Kyoto.', price: 85.00, comparePrice: null, categoryId: 3, brandId: 3, sku: 'HZN-HOM-002', weight: 1.2, lowStockAlert: 5, stock: 35, featured: 0, image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800', images: ['https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800','https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'], features: '["Hand-thrown stoneware","Matching carafe included","Reusable stainless filter","Japanese artisan crafted","Dishwasher safe","Makes 4 cups"]', specifications: '{"Material":"Stoneware","Capacity":"800ml","Filter":"Reusable stainless steel","Origin":"Kyoto, Japan","Care":"Dishwasher safe","Weight":"2.8 lbs"}' },
  { name: 'Wireless Charging Station', description: '3-in-1 wireless charging station for iPhone, Apple Watch, and AirPods. Premium aluminum build with fast-charge capability and LED indicator.', price: 79.00, comparePrice: 99.00, categoryId: 5, brandId: 0, sku: 'HZN-GAD-002', weight: 0.2, lowStockAlert: 10, stock: 70, featured: 0, image: 'https://images.unsplash.com/photo-1622138995121-2f94e67e9ff2?w=800', images: ['https://images.unsplash.com/photo-1622138995121-2f94e67e9ff2?w=800'], features: '["3-in-1 charging","Fast charge 15W","Aluminum build","LED indicator","Overcharge protection","Foldable design"]', specifications: '{"Input":"USB-C 20W","Phone":"15W max","Watch":"5W","Material":"Aluminum","Compatibility":"Qi devices","Cable":"USB-C included"}' },
  { name: 'Signature Leather Sneakers', description: 'Italian calfskin leather sneakers with cushioned Ortholite insoles. Hand-stitched uppers with a classic cup sole.', price: 265.00, comparePrice: 345.00, categoryId: 2, brandId: 0, sku: 'HZN-APP-003', weight: 0.5, lowStockAlert: 5, stock: 55, featured: 0, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800','https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800'], features: '["Italian calfskin leather","Ortholite cushioned insoles","Hand-stitched construction","Classic cup sole","Removable insole","Cotton laces"]', specifications: '{"Material":"Italian calfskin leather","Sole":"Cup sole rubber","Insole":"Ortholite","Construction":"Hand-stitched","Sizes":"7-13 US","Weight":"1.1 lbs each"}' },
  { name: 'Hydra-Glow Serum', description: 'Clinical-strength hyaluronic acid serum with vitamin C and niacinamide. Dermatologist-tested, fragrance-free. Visible results in 14 days.', price: 72.00, comparePrice: 95.00, categoryId: 4, brandId: 5, sku: 'HZN-BTY-002', weight: 0.1, lowStockAlert: 10, stock: 80, featured: 0, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=800', images: ['https://images.unsplash.com/photo-1570194065650-d99fb4ee8e39?w=800','https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'], features: '["2% hyaluronic acid","Vitamin C (ascorbic acid)","4% niacinamide","Dermatologist tested","Fragrance-free","Results in 14 days"]', specifications: '{"Active":"HA 2%, Vitamin C, Niacinamide 4%","Volume":"30ml","Skin Type":"All","Tested":"Dermatologist","Free From":"Fragrance, parabens, sulfates","Shelf Life":"12 months"}' },
  { name: 'TrailRunner Pro GPS Watch', description: 'Multisport GPS watch with heart rate monitoring, built-in maps, and 14-day battery life. Military-grade durability for the toughest adventures.', price: 399.00, comparePrice: 499.00, categoryId: 6, brandId: 0, sku: 'HZN-SPT-001', weight: 0.08, lowStockAlert: 3, stock: 28, featured: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800','https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'], features: '["GPS + GLONASS + Galileo","Heart rate monitor","Built-in topographic maps","14-day battery life","Military-grade durability","100m water resistance"]', specifications: '{"Display":"1.4\" AMOLED","GPS":"GPS+GLONASS+Galileo","Battery":"14 days smartwatch mode","Water Rating":"10 ATM (100m)","Memory":"32GB","Weight":"63g"}' },
  { name: 'Aer Travel Backpack 30L', description: 'Designed for modern travelers. Premium ballistic nylon, dedicated laptop compartment, hidden passport pocket, and compression straps for urban adventures.', price: 189.00, comparePrice: null, categoryId: 0, brandId: 0, sku: 'HZN-BAG-002', weight: 0.9, lowStockAlert: 5, stock: 45, featured: 0, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'], features: '["Ballistic nylon construction","Dedicated 16\" laptop sleeve","Hidden passport pocket","Compression straps","Luggage pass-through","YKK waterproof zippers"]', specifications: '{"Material":"1680D Ballistic Nylon","Capacity":"30L","Laptop":"Fits 16\"","Weight":"2.1 lbs","Pockets":"12 (3 hidden)","Warranty":"Lifetime"}' },
  { name: 'Neo Mechanical Keyboard', description: 'Hot-swappable mechanical keyboard with PBT keycaps, per-key RGB, and a CNC aluminum frame. Gasket-mounted for a premium typing feel.', price: 179.00, comparePrice: 229.00, categoryId: 1, brandId: 0, sku: 'HZN-KEY-001', weight: 1.1, lowStockAlert: 5, stock: 33, featured: 1, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800','https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800'], features: '["Hot-swappable switches","CNC aluminum frame","Per-key RGB lighting","PBT double-shot keycaps","Gasket-mounted plate","USB-C detachable cable"]', specifications: '{"Layout":"75% (84 keys)","Frame":"CNC aluminum","Switches":"Hot-swappable (3/5 pin)","Keycaps":"PBT double-shot","Connectivity":"USB-C","RGB":"Per-key, software configurable"}' },
];

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

  console.log(`Seeded ${brands.length} brands, ${categories.length} categories, ${products.length} products, ${coupons.length} coupons, ${blogPosts.length} blog posts, 6 currencies, 3 gift cards, ${en.length} translations, 3 site notifications`);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
