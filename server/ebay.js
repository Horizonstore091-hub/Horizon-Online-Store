const https = require('https');
const querystring = require('querystring');

let cachedToken = null;
let tokenExpires = 0;

function request(method, hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const opts = { method, hostname, path, headers, rejectUnauthorized: false };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getToken() {
  if (cachedToken && Date.now() < tokenExpires) return cachedToken;
  const { EBAY_CLIENT_ID, EBAY_CLIENT_SECRET } = process.env;
  if (!EBAY_CLIENT_ID || !EBAY_CLIENT_SECRET) throw new Error('EBAY_CLIENT_ID and EBAY_CLIENT_SECRET env vars required');
  const body = 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope/commerce.catalog.readonly';
  const auth = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString('base64');
  const res = await request('POST', 'api.ebay.com', '/identity/v1/oauth2/token', {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${auth}`
  }, body);
  if (res.access_token) {
    cachedToken = res.access_token;
    tokenExpires = Date.now() + (res.expires_in - 60) * 1000;
    return res.access_token;
  }
  throw new Error(res.error_description || 'eBay OAuth failed');
}

async function searchProducts(query, options = {}) {
  const token = await getToken();
  const params = { q: query, limit: options.limit || 20 };
  if (options.categoryIds) params.category_ids = options.categoryIds;
  if (options.aspectFilter) params.aspect_filter = options.aspectFilter;
  const qs = querystring.stringify(params);
  const res = await request('GET', 'api.ebay.com', `/commerce/catalog/v1_beta/product_summary/search?${qs}`, {
    Authorization: `Bearer ${token}`,
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json'
  });
  return res.productSummaries || [];
}

async function getProduct(epid) {
  const token = await getToken();
  const res = await request('GET', 'api.ebay.com', `/commerce/catalog/v1_beta/product/${epid}`, {
    Authorization: `Bearer ${token}`,
    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
    'Content-Type': 'application/json'
  });
  return res;
}

function mapToProduct(ebayProduct) {
  const images = [];
  if (ebayProduct.image?.imageUrl) images.push(ebayProduct.image.imageUrl);
  if (ebayProduct.additionalImages) ebayProduct.additionalImages.forEach(img => { if (img.imageUrl) images.push(img.imageUrl); });
  const aspects = {};
  let description = '';
  if (ebayProduct.description) description = ebayProduct.description.replace(/<[^>]*>/g, '');
  const features = [];
  if (ebayProduct.aspects) ebayProduct.aspects.forEach(a => {
    if (a.localizedName && a.localizedValues) {
      aspects[a.localizedName] = a.localizedValues.join(', ');
      features.push(`${a.localizedName}: ${a.localizedValues.join(', ')}`);
    }
  });
  const price = ebayProduct.marketingPrice?.originalPrice?.value || ebayProduct.price?.value || 49.99;
  return {
    name: ebayProduct.title || 'Unknown Product',
    description: description || ebayProduct.title || '',
    price: typeof price === 'number' ? price : parseFloat(price) || 49.99,
    image: images[0] || '',
    images: images,
    features: JSON.stringify(features),
    specifications: JSON.stringify(aspects),
    category: 'Electronics',
    stock: Math.floor(Math.random() * 50) + 10,
    sku: 'EBAY-' + (ebayProduct.epid || Date.now()),
  };
}

module.exports = { searchProducts, getProduct, mapToProduct };
