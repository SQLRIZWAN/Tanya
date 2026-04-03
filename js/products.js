// ============================================================
//  ShopWorld — Product Data
//  Source: DummyJSON API (live) + curated food data
// ============================================================

const STORES = {
  amazon:   { name:'Amazon',   color:'#ff9900', dark:'#131921', url:'#', cat:['smartphones','laptops','tablets','mobile-accessories'] },
  flipkart: { name:'Flipkart', color:'#2874f0', dark:'#1c4aaa', url:'#', cat:['televisions','furniture','home-decoration'] },
  temu:     { name:'Temu',     color:'#ff4800', dark:'#c73800', url:'#', cat:['womens-dresses','tops','mens-shirts'] },
  meesho:   { name:'Meesho',   color:'#f43397', dark:'#b5156e', url:'#', cat:['womens-bags','womens-jewellery'] },
  myntra:   { name:'Myntra',   color:'#ff3f6c', dark:'#c21e45', url:'#', cat:['womens-watches','mens-watches','sunglasses'] },
  ajio:     { name:'AJIO',     color:'#00b5a0', dark:'#00877a', url:'#', cat:['sports-accessories','mens-shoes','womens-shoes'] },
  snapdeal: { name:'Snapdeal', color:'#e40046', dark:'#a80034', url:'#', cat:['kitchen-accessories','groceries','skin-care'] },
  nykaa:    { name:'Nykaa',    color:'#fc2779', dark:'#b81558', url:'#', cat:['beauty','fragrances','skin-care'] },
  swiggy:   { name:'Swiggy',   color:'#fc8019', dark:'#c05e0d', url:'#', cat:['food'] },
  zomato:   { name:'Zomato',   color:'#e23744', dark:'#b01e2b', url:'#', cat:['food'] },
};

// ── Food data (Swiggy + Zomato) ─────────────────────────────
const FOOD_ITEMS = [
  { id:'f1',  store:'swiggy',  title:'Chicken Dum Biryani (Full)',      price:299, original:399, rating:4.6, reviews:8420,  category:'food', delivery:'30 min', img:'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80', description:'Aromatic basmati rice slow-cooked with tender chicken in traditional dum style.' },
  { id:'f2',  store:'swiggy',  title:'Paneer Butter Masala + 4 Roti',   price:249, original:320, rating:4.5, reviews:6100,  category:'food', delivery:'25 min', img:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', description:'Rich creamy paneer curry served with fresh soft rotis.' },
  { id:'f3',  store:'swiggy',  title:'Margherita Pizza (Medium)',        price:299, original:399, rating:4.4, reviews:9800,  category:'food', delivery:'35 min', img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', description:'Classic pizza with fresh mozzarella, tomato sauce and basil.' },
  { id:'f4',  store:'swiggy',  title:'Double Patty Smash Burger Combo',  price:349, original:449, rating:4.3, reviews:7200,  category:'food', delivery:'28 min', img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', description:'Two juicy beef patties, cheddar, caramelized onions, special sauce + fries.' },
  { id:'f5',  store:'swiggy',  title:'Chole Bhature (2 pcs)',            price:149, original:199, rating:4.5, reviews:11200, category:'food', delivery:'20 min', img:'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80', description:'Spicy chole curry with fluffy deep-fried bhature. A classic combo.' },
  { id:'f6',  store:'swiggy',  title:'Veg Thali — 5 Items + Rice',       price:199, original:280, rating:4.4, reviews:5400,  category:'food', delivery:'30 min', img:'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80', description:'Dal, sabzi, rice, roti, salad & pickle — a wholesome Indian meal.' },
  { id:'f7',  store:'swiggy',  title:'Masala Dosa + Sambar + Chutney',   price:129, original:179, rating:4.6, reviews:13400, category:'food', delivery:'20 min', img:'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80', description:'Crispy golden dosa stuffed with spiced potato, served with sambar & coconut chutney.' },
  { id:'f8',  store:'swiggy',  title:'Chocolate Brownie Sundae',          price:199, original:249, rating:4.7, reviews:4600,  category:'food', delivery:'25 min', img:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80', description:'Warm fudge brownie topped with vanilla ice cream and chocolate drizzle.' },
  { id:'f9',  store:'zomato',  title:'Mutton Rogan Josh + Naan',         price:449, original:549, rating:4.7, reviews:3200,  category:'food', delivery:'40 min', img:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', description:'Slow-cooked Kashmiri mutton in rich aromatic gravy, served with fresh naan.' },
  { id:'f10', store:'zomato',  title:'Sushi Platter — 12 Pieces',        price:699, original:899, rating:4.8, reviews:2100,  category:'food', delivery:'45 min', img:'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80', description:'Chef-selected nigiri and maki rolls with wasabi, pickled ginger and soy sauce.' },
  { id:'f11', store:'zomato',  title:'Pasta Carbonara + Garlic Bread',   price:399, original:499, rating:4.5, reviews:4800,  category:'food', delivery:'35 min', img:'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', description:'Al dente spaghetti in creamy egg & parmesan sauce with crispy pancetta.' },
  { id:'f12', store:'zomato',  title:'Tandoori Platter (Non-Veg)',       price:549, original:699, rating:4.6, reviews:3900,  category:'food', delivery:'40 min', img:'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80', description:'Chicken tikka, seekh kebab, fish tikka & tandoori chicken with mint chutney.' },
  { id:'f13', store:'zomato',  title:'Cold Coffee Frappe (Large)',       price:179, original:219, rating:4.4, reviews:8700,  category:'food', delivery:'15 min', img:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', description:'Blended chilled coffee with milk, ice cream and whipped cream topping.' },
  { id:'f14', store:'zomato',  title:'Peri Peri Chicken Wings (8 pcs)', price:329, original:429, rating:4.5, reviews:6300,  category:'food', delivery:'30 min', img:'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&q=80', description:'Spicy peri-peri marinated chicken wings fried to perfection.' },
];

// ── DummyJSON category → store mapping ──────────────────────
const CAT_STORE_MAP = {
  smartphones:         'amazon',
  laptops:             'amazon',
  tablets:             'amazon',
  'mobile-accessories':'amazon',
  televisions:         'flipkart',
  furniture:           'flipkart',
  'home-decoration':   'flipkart',
  'womens-dresses':    'temu',
  tops:                'temu',
  'mens-shirts':       'meesho',
  'womens-bags':       'meesho',
  'womens-jewellery':  'meesho',
  'womens-watches':    'myntra',
  'mens-watches':      'myntra',
  sunglasses:          'myntra',
  'sports-accessories':'ajio',
  'mens-shoes':        'ajio',
  'womens-shoes':      'ajio',
  'kitchen-accessories':'snapdeal',
  groceries:           'snapdeal',
  beauty:              'nykaa',
  fragrances:          'nykaa',
  'skin-care':         'nykaa',
};

// product cache
let _productCache = null;

async function fetchAllProducts() {
  if (_productCache) return _productCache;

  try {
    const res = await fetch('https://dummyjson.com/products?limit=150&skip=0&select=id,title,price,discountPercentage,rating,stock,images,thumbnail,category,description,brand');
    const data = await res.json();

    const apiProducts = data.products
      .filter(p => CAT_STORE_MAP[p.category])
      .map(p => {
        const discount = p.discountPercentage || 10;
        const original = Math.round(p.price * (1 + discount / 100));
        const store = CAT_STORE_MAP[p.category];
        return {
          id:       'api_' + p.id,
          store,
          title:    p.title,
          price:    Math.round(p.price * 83),      // USD → INR
          original: Math.round(original * 83),
          rating:   parseFloat(p.rating.toFixed(1)),
          reviews:  Math.floor(Math.random() * 20000) + 500,
          category: mapCategory(p.category),
          img:      p.thumbnail,
          images:   p.images || [p.thumbnail],
          description: p.description,
          brand:    p.brand || '',
          delivery: getDeliveryText(store),
          inStock:  p.stock > 0,
        };
      });

    _productCache = [...FOOD_ITEMS, ...apiProducts];
    return _productCache;
  } catch (e) {
    console.warn('DummyJSON fetch failed, using food-only data:', e);
    _productCache = FOOD_ITEMS;
    return _productCache;
  }
}

function mapCategory(djCat) {
  const map = {
    smartphones:'electronics', laptops:'electronics', tablets:'electronics',
    'mobile-accessories':'electronics', televisions:'electronics',
    furniture:'home', 'home-decoration':'home', 'kitchen-accessories':'home',
    groceries:'grocery', 'womens-dresses':'fashion', tops:'fashion',
    'mens-shirts':'fashion', 'womens-bags':'fashion', 'womens-jewellery':'fashion',
    'womens-watches':'fashion', 'mens-watches':'fashion', sunglasses:'fashion',
    'sports-accessories':'sports', 'mens-shoes':'sports', 'womens-shoes':'fashion',
    beauty:'beauty', fragrances:'beauty', 'skin-care':'beauty',
  };
  return map[djCat] || 'general';
}

function getDeliveryText(store) {
  const map = {
    amazon:'Free delivery tomorrow',
    flipkart:'Free delivery in 2 days',
    temu:'Free delivery in 7-12 days',
    meesho:'Free delivery in 4-5 days',
    myntra:'Free delivery in 3 days',
    ajio:'Free delivery in 3 days',
    snapdeal:'Free delivery in 5 days',
    nykaa:'Free delivery in 3 days',
  };
  return map[store] || 'Free delivery';
}
