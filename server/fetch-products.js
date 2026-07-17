const https = require('https');
const init = require('./db');
const { v4: uuidv4 } = require('uuid');

const CATEGORY_MAP = {
  'smartphones': 'Electronics', 'laptops': 'Electronics', 'tablets': 'Electronics',
  'mobile-accessories': 'Accessories', 'headphones': 'Electronics', 'speakers': 'Electronics',
  'computer-accessories': 'Electronics', 'computer-peripherals': 'Electronics',
  'home-decoration': 'Home & Kitchen', 'furniture': 'Home & Kitchen', 'kitchen-accessories': 'Home & Kitchen',
  'home-appliances': 'Home & Kitchen', 'groceries': 'Home & Kitchen',
  'clothing': 'Clothing', 'clothing-accessories': 'Accessories', 'mens-shirts': 'Clothing',
  'mens-shoes': 'Clothing', 'mens-watches': 'Accessories', 'womens-dresses': 'Clothing',
  'womens-shoes': 'Clothing', 'womens-watches': 'Accessories', 'womens-bags': 'Accessories',
  'womens-jewellery': 'Accessories', 'sunglasses': 'Accessories', 'tops': 'Clothing',
  'beauty': 'Beauty', 'fragrances': 'Beauty', 'skincare': 'Beauty',
  'sports-accessories': 'Sports & Outdoors', 'sports-equipment': 'Sports & Outdoors',
  'vehicle': 'Gadgets', 'motorcycle': 'Gadgets', 'fitness': 'Sports & Outdoors',
};

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

const IMG = {
  cooler: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800',
  fan140: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800',
  fan120: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7fa?w=800',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
  towerfan: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800',
  purifier: 'https://images.unsplash.com/photo-1624072412656-4b3a199899bd?w=800',
  ac: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',
  fridge: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
  pillow: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
  stand: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=800',
  gear: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
};

const COOLING_PRODUCTS = [
  { name: 'Arctic Freezer 34 eSports Duo CPU Cooler', description: 'Dual-fan CPU air cooler with 120mm PWM fans, direct-touch copper heatpipes, and ultra-low noise operation. Supports Intel LGA1700/1200 and AMD AM5/AM4.', price: 89.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 45, rating: 4.7 },
  { name: 'Noctua NH-D15 Chromax Black CPU Cooler', description: 'Premium dual-tower CPU cooler with two 140mm fans, six heatpipes, and legendary quiet operation. The gold standard for air cooling.', price: 189.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 22, rating: 4.9 },
  { name: 'Corsair H150i Elite LCD XT Liquid Cooler', description: '360mm all-in-one liquid CPU cooler with brilliant LCD pump screen, three AF120 RGB ELITE fans, and extreme cooling performance for high-end CPUs.', price: 289.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 15, rating: 4.8 },
  { name: 'NZXT Kraken X73 RGB Liquid Cooler', description: '360mm AIO liquid cooler with RGB fans and customizable infinity mirror pump design. Silent operation with powerful thermal performance.', price: 259.99, cat: 'Electronics', img: IMG.fan120, imgs: [IMG.fan120, IMG.cooler], stock: 18, rating: 4.6 },
  { name: 'Lian Li Galahad II Trinity 360 AIO', description: '360mm all-in-one liquid cooler with daisy-chainable fans, dual-chamber pump design, and improved cold plate for latest-gen CPUs.', price: 239.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 12, rating: 4.5 },
  { name: 'Dyson Pure Hot+Cool HP07', description: 'Air purifier, heater, and fan all-in-one. Captures 99.97% of pollutants, heats and cools rooms evenly, with intelligent climate control and Dyson Link app.', price: 799.99, cat: 'Home & Kitchen', img: IMG.purifier, imgs: [IMG.purifier], stock: 10, rating: 4.4 },
  { name: 'Dyson AM07 Tower Fan', description: 'Bladeless tower fan with Air Multiplier technology, 40% quieter than previous generation. Oscillation, 10 airflow settings, and sleep timer.', price: 499.99, cat: 'Home & Kitchen', img: IMG.towerfan, imgs: [IMG.towerfan], stock: 14, rating: 4.3 },
  { name: 'Honeywell QuietSet Tower Fan', description: 'Whole-room tower fan with 8 speeds, remote control, and ultra-quiet operation. Electronic touch controls and auto-brightness display.', price: 89.99, cat: 'Home & Kitchen', img: IMG.towerfan, imgs: [IMG.towerfan], stock: 60, rating: 4.1 },
  { name: 'LG Dual Inverter Portable Air Conditioner', description: '14,000 BTU portable AC with dual inverter technology, cools up to 700 sq ft. Wi-Fi enabled, energy-efficient, and ultra-quiet operation.', price: 699.99, cat: 'Home & Kitchen', img: IMG.ac, imgs: [IMG.ac], stock: 8, rating: 4.5 },
  { name: 'Midea U-Shaped Smart Inverter Window AC', description: '8,000 BTU window air conditioner with U-shaped design for noise reduction and security. Wi-Fi control, energy star rated, cools up to 350 sq ft.', price: 449.99, cat: 'Home & Kitchen', img: IMG.ac, imgs: [IMG.ac], stock: 20, rating: 4.3 },
  { name: 'Honeywell Evaporative Air Cooler', description: 'Portable swamp cooler for garage, patio, or workshop. Cools up to 450 sq ft with humidification function. Three speeds and ice compartments.', price: 219.99, cat: 'Home & Kitchen', img: IMG.ac, imgs: [IMG.ac], stock: 25, rating: 3.9 },
  { name: 'Thermaltake TOUGHAIR 510 CPU Cooler', description: 'Dual-tower CPU air cooler with dual 140mm fans, 8 heatpipes, and offset fin design for RAM clearance. 250W TDP cooling capacity.', price: 149.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 28, rating: 4.6 },
  { name: 'be quiet! Dark Rock Pro 5 CPU Cooler', description: 'Premium silent CPU cooler with two fans, 7 high-performance heatpipes, and virtually inaudible operation at 250W TDP. Diamond-cut aluminum.', price: 169.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 18, rating: 4.8 },
  { name: 'Noctua NF-A14 PWM 140mm Fan', description: 'Premium 140mm case fan with advanced aerodynamic design, SSO2 bearing, and superb quietness. Ideal for radiator or case ventilation.', price: 29.99, cat: 'Electronics', img: IMG.fan140, imgs: [IMG.fan140], stock: 120, rating: 4.9 },
  { name: 'Corsair LL120 RGB 120mm Fan 3-Pack', description: 'Three 120mm RGB fans with 16 individually addressable RGB LEDs per fan, PWM speed control, and low-noise operation. Includes Lighting Node Core.', price: 129.99, cat: 'Electronics', img: IMG.fan120, imgs: [IMG.fan120], stock: 45, rating: 4.5 },
  { name: 'Laptop Cooling Pad Arctic X9', description: 'Gaming laptop cooler with 200mm RGB fan, dual 140mm fans, adjustable height stands, and blue LED lighting. Fits laptops up to 19 inches.', price: 69.99, cat: 'Accessories', img: IMG.laptop, imgs: [IMG.laptop, IMG.stand], stock: 35, rating: 4.2 },
  { name: 'Kootek Laptop Cooling Pad', description: 'Chill vent laptop cooler with 5 built-in quiet fans, dual USB ports, 6 adjustable height levels, and blue LED ring. Compatible with 12-17 inch laptops.', price: 39.99, cat: 'Accessories', img: IMG.laptop, imgs: [IMG.laptop], stock: 65, rating: 4.0 },
  { name: 'Frosty Air Conditioner LG Dual Inverter Split', description: '12,000 BTU split air conditioner with dual inverter compressor, energy efficient cooling, Wi-Fi enabled, and auto-cleaning function.', price: 1299.99, cat: 'Home & Kitchen', img: IMG.ac, imgs: [IMG.ac], stock: 7, rating: 4.6 },
  { name: 'IceGiant ProSiphon Elite Cooler', description: 'Thermosiphon CPU cooler with no pump or moving parts. Passive phase-change cooling equals 360mm AIO performance with zero pump noise.', price: 399.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 5, rating: 4.4 },
  { name: 'Dyson TP09 Purifying Fan', description: 'Air purifier and bladeless fan with HEPA H13 filter, real-time air quality display, oscillation, and 10 airflow speeds. Captures 99.95% of particles.', price: 649.99, cat: 'Home & Kitchen', img: IMG.purifier, imgs: [IMG.purifier], stock: 12, rating: 4.5 },
  { name: 'Vornado 660 Whole Room Air Circulator', description: 'Iconic whole-room air circulator with vortex airflow, deep-pitch blades, and 3-speed manual control. Moves air up to 100 feet.', price: 129.99, cat: 'Home & Kitchen', img: IMG.towerfan, imgs: [IMG.towerfan], stock: 30, rating: 4.7 },
  { name: 'EcoFlow Wave 2 Portable AC', description: 'Portable battery-powered air conditioner for camping, van life, and outdoor use. 4000 BTU cooling, 3000 BTU heating, 4-hour battery life, Wi-Fi control.', price: 1299.99, cat: 'Sports & Outdoors', img: IMG.ac, imgs: [IMG.ac], stock: 6, rating: 4.3 },
  { name: 'DeepCool AK620 Zero Dark CPU Cooler', description: 'High-performance dual-tower CPU air cooler with all-black design, 6 copper heatpipes, dual 120mm fans, and excellent RAM clearance. 260W TDP.', price: 129.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 30, rating: 4.7 },
  { name: 'Cooler Master MasterLiquid ML360L V2', description: '360mm AIO RGB liquid cooler with 3rd gen pump, dual chamber design, and three SickleFlow 120mm ARGB fans. Excellent value RGB cooling.', price: 159.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 22, rating: 4.3 },
  { name: 'Frigidaire Portable Ice Maker', description: 'Compact countertop ice maker producing 26 lbs of ice per day. Bullet-shaped ice in 8 minutes. Self-cleaning function, holds 1.5 lbs.', price: 199.99, cat: 'Home & Kitchen', img: IMG.fridge, imgs: [IMG.fridge], stock: 25, rating: 4.2 },
  { name: 'Mini Fridge Cooler for Skincare', description: 'Compact thermoelectric cooler for skincare, beverages, or cosmetics. Holds 6 standard cans, cools to 40F below ambient. Silent operation.', price: 79.99, cat: 'Beauty', img: IMG.fridge, imgs: [IMG.fridge], stock: 40, rating: 4.0 },
  { name: 'Rayhong Interior Car Air Cooler', description: '12V portable car air cooler with three cooling modes, dual fan design, and water tank. Cools car cabin quickly, energy efficient, low noise.', price: 89.99, cat: 'Accessories', img: IMG.towerfan, imgs: [IMG.towerfan], stock: 35, rating: 3.8 },
  { name: 'Desk Fan Portable USB Rechargeable', description: 'Mini USB desk fan with 4000mAh battery, 120° oscillation, 4 speeds, and ultra-quiet operation. Runs up to 24 hours on low. Foldable design.', price: 39.99, cat: 'Accessories', img: IMG.towerfan, imgs: [IMG.towerfan], stock: 100, rating: 4.1 },
  { name: 'Thermalright Peerless Assassin 120 SE', description: 'Dual-tower CPU cooler with six heatpipes, dual 120mm C12 fans, and all-black coating. Exceptional performance for under $50.', price: 44.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 55, rating: 4.8 },
  { name: 'NexiGo PS5 Cooling Stand', description: 'Dual-fan cooling stand for PS5 with RGB lighting, dual controller charging station, and 10 game slots. Keeps console cool during extended gaming.', price: 59.99, cat: 'Gadgets', img: IMG.stand, imgs: [IMG.stand], stock: 20, rating: 4.2 },
  { name: 'Microsoft Xbox Series X Cooling Stand', description: 'Vertical cooling stand for Xbox Series X with enhanced dual-fan cooling, controller charging dock, HDMI cable and game storage.', price: 49.99, cat: 'Gadgets', img: IMG.stand, imgs: [IMG.stand], stock: 18, rating: 4.1 },
  { name: 'RV Portable Air Conditioner 8000 BTU', description: 'Compact rooftop RV AC unit with 8000 BTU cooling, heat pump, remote control, and low power consumption. Fits standard 14x14 roof opening.', price: 899.99, cat: 'Sports & Outdoors', img: IMG.ac, imgs: [IMG.ac], stock: 4, rating: 3.9 },
  { name: 'Water Cooler Dispenser Hot & Cold', description: 'Top-loading water cooler with hot and cold dispensing. Stainless steel tank, child safety lock, energy efficient. For 3-5 gallon bottles.', price: 249.99, cat: 'Home & Kitchen', img: IMG.fridge, imgs: [IMG.fridge], stock: 15, rating: 4.3 },
  { name: 'Gel Cooling Memory Foam Pillow', description: 'Premium gel-infused memory foam pillow with ventilated cooling cover. Medium-firm support, ergonomic contour design, and machine washable cover.', price: 79.99, cat: 'Home & Kitchen', img: IMG.pillow, imgs: [IMG.pillow], stock: 40, rating: 4.4 },
  { name: 'BedJet 3 Climate Control System', description: 'Bed climate control system that blows hot or cool air between sheets. Dual-zone control, ultra-quiet, with smartphone app and Alexa integration.', price: 499.99, cat: 'Home & Kitchen', img: IMG.pillow, imgs: [IMG.pillow], stock: 8, rating: 4.5 },
  { name: 'Smart Neck Fan Portable', description: 'Wearable neck fan with 78 vents, 720° airflow, 4000mAh battery, and 3 speeds. Hands-free cooling for outdoor work, commuting, and travel.', price: 59.99, cat: 'Accessories', img: IMG.gear, imgs: [IMG.gear], stock: 40, rating: 4.1 },
  { name: 'DeepCool LT720 Premium Liquid Cooler', description: '360mm AIO with fourth-generation pump, 3x 120mm FK120 fans, anti-leak technology, and addressable RGB pump cap. High-end cooling for enthusiast builds.', price: 199.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 10, rating: 4.6 },
  { name: 'PC Water Cooling Tube Kit Softline', description: 'Complete softline water cooling kit with 10ft tubing, 8 fittings, fill bottle, drain valve, and coolant. For custom PC water loops.', price: 89.99, cat: 'Electronics', img: IMG.cooler, imgs: [IMG.cooler], stock: 15, rating: 4.0 },
];

async function fetchAllProducts() {
  const res = await httpGet('https://dummyjson.com/products?limit=200');
  return res.products || [];
}

async function main() {
  console.log('Fetching real products from DummyJSON API...');
  const items = await fetchAllProducts();
  console.log(`Fetched ${items.length} products`);

  const db = await init();

  db.prepare('DELETE FROM product_images').run();
  db.prepare('DELETE FROM products').run();

  const catRows = db.prepare('SELECT * FROM categories').all();
  const brandRows = db.prepare('SELECT * FROM brands').all();

  const catMap = {};
  catRows.forEach(c => catMap[c.name] = c);

  const pInsert = db.prepare(`INSERT INTO products (id, name, description, price, comparePrice, categoryId, brandId, category, sku, weight, lowStockAlert, stock, featured, image, features, specifications, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const piInsert = db.prepare('INSERT INTO product_images (id, productId, url, sortOrder) VALUES (?, ?, ?, ?)');

  const MIN_PRICE = 50;
  const filtered = items.filter(item => item.price >= MIN_PRICE);
  console.log(`Filtered to ${filtered.length} products $${MIN_PRICE}+`);

  let inserted = 0;
  const brand = brandRows[0];

  for (const item of filtered) {
    const pid = uuidv4();
    const catName = CATEGORY_MAP[item.category] || 'Accessories';
    const cat = catMap[catName];
    if (!cat) continue;

    const finalPrice = Math.round(item.price * 1.1 * 100) / 100;
    const comparePrice = item.discountPercentage ? Math.round(finalPrice / (1 - item.discountPercentage / 200) * 100) / 100 : null;
    const images = item.images || [];
    const rating = item.rating || parseFloat((3 + Math.random() * 2).toFixed(1));
    const features = item.tags ? JSON.stringify(item.tags.map(t => t.charAt(0).toUpperCase() + t.slice(1))) : '["Premium Quality"]';
    const specs = JSON.stringify({ Brand: item.brand || 'Generic', Rating: rating.toFixed(1) });

    pInsert.run(pid, item.title, item.description, finalPrice, comparePrice, cat.id, brand.id, catName, `EXT-${item.id}`, null, 5, item.stock || 50, item.price >= 500 ? 1 : 0, item.thumbnail || '', features, specs, 1);
    images.forEach((url, idx) => piInsert.run(uuidv4(), pid, url, idx));
    inserted++;
  }

  for (const item of COOLING_PRODUCTS) {
    const pid = uuidv4();
    const cat = catMap[item.cat];
    if (!cat) continue;
    const features = JSON.stringify(['Premium Build', 'Quiet Operation', 'Energy Efficient', 'Easy Installation', '1 Year Warranty']);
    const specs = JSON.stringify({ Brand: 'Horizon Tech', Rating: item.rating.toFixed(1), Warranty: '1 Year' });
    pInsert.run(pid, item.name, item.description, item.price, null, cat.id, brand.id, item.cat, `COOL-${uuidv4().slice(0, 8)}`, null, 3, item.stock, 0, item.img, features, specs, 1);
    item.imgs.forEach((url, idx) => piInsert.run(uuidv4(), pid, url, idx));
    inserted++;
  }

  console.log(`Inserted ${inserted} products into Horizon store`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
