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

async function fetchAllProducts() {
  const res = await httpGet('https://dummyjson.com/products?limit=200');
  return res.products || [];
}

async function main() {
  console.log('Fetching real products from DummyJSON API...');
  const items = await fetchAllProducts();
  console.log(`Fetched ${items.length} products`);

  const db = await init();

  // Clear existing products
  db.prepare('DELETE FROM product_images').run();
  db.prepare('DELETE FROM products').run();

  // Get categories & brands
  const catRows = db.prepare('SELECT * FROM categories').all();
  const brandRows = db.prepare('SELECT * FROM brands').all();

  const catMap = {};
  catRows.forEach(c => catMap[c.name] = c);
  const brandMap = {};
  brandRows.forEach(b => brandMap[b.name] = b);

  const pInsert = db.prepare(`INSERT INTO products (id, name, description, price, comparePrice, categoryId, brandId, category, sku, weight, lowStockAlert, stock, featured, image, features, specifications, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const piInsert = db.prepare('INSERT INTO product_images (id, productId, url, sortOrder) VALUES (?, ?, ?, ?)');

  let inserted = 0;
  for (const item of items) {
    const pid = uuidv4();
    const catName = CATEGORY_MAP[item.category] || 'Accessories';
    const cat = catMap[catName];
    const brand = brandMap['Horizon Signature'] || brandRows[0];
    if (!cat) continue;

    const price = item.price;
    const comparePrice = item.discountPercentage ? +(price / (1 - item.discountPercentage / 100)).toFixed(2) : null;
    const images = item.images || [];
    const features = item.tags ? JSON.stringify(item.tags.map(t => t.charAt(0).toUpperCase() + t.slice(1))) : '[]';
    const specs = JSON.stringify({ Brand: item.brand || 'Generic', Rating: item.rating, 'Discount': item.discountPercentage ? `${item.discountPercentage}%` : null, SKU: `EXT-${item.id}` });

    pInsert.run(pid, item.title, item.description, price, comparePrice, cat.id, brand.id, catName, `EXT-${item.id}`, null, 5, item.stock || 50, 0, item.thumbnail || '', features, specs, 1);
    images.forEach((url, idx) => piInsert.run(uuidv4(), pid, url, idx));
    inserted++;
  }

  console.log(`Inserted ${inserted} products into Horizon store`);
  console.log('Done!');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
