import { DatabaseSync } from 'node:sqlite'
import crypto from 'node:crypto'

const db = new DatabaseSync('payload.db')

console.log('Connecting to payload.db...')

// 1. Ensure columns exist on products table
const columns = db.prepare('PRAGMA table_info(products)').all().map(c => c.name)
const newCols = [
  { name: 'in_stock', def: 'INTEGER DEFAULT 1' },
  { name: 'is_eggless', def: 'INTEGER DEFAULT 1' },
  { name: 'shelf_life', def: "TEXT DEFAULT 'Consume within 3-4 days'" },
  { name: 'net_weight', def: 'TEXT' },
]

for (const col of newCols) {
  if (!columns.includes(col.name)) {
    try {
      db.exec(`ALTER TABLE products ADD COLUMN ${col.name} ${col.def}`)
      console.log(`+ Added column "${col.name}" to products table`)
    } catch (e) {
      console.log(`Column ${col.name} already exists or error:`, e.message)
    }
  }
}

const now = new Date().toISOString()

// 2. Categories
const categories = [
  { id: 1, title: 'Chocolates', slug: 'chocolates', emoji: '🍫', color_theme: '#5D4037' },
  { id: 2, title: 'Brownies & Cakes', slug: 'brownies', emoji: '🥮', color_theme: '#5D4037' },
  { id: 3, title: 'Cookies & Biscuits', slug: 'cookies', emoji: '🍪', color_theme: '#FBC02D' },
  { id: 4, title: 'Fruit Cupcakes', slug: 'cupcakes', emoji: '🧁', color_theme: '#E91E63' },
  { id: 5, title: 'Gift Hampers', slug: 'hampers', emoji: '🎁', color_theme: '#8E24AA' },
  { id: 6, title: 'Herbal Tea', slug: 'tea', emoji: '🍵', color_theme: '#1e3f20' },
]

const insertCat = db.prepare(`
  INSERT INTO categories (id, title, slug, emoji, color_theme, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    slug = excluded.slug,
    emoji = excluded.emoji,
    color_theme = excluded.color_theme,
    updated_at = excluded.updated_at
`)

for (const c of categories) {
  insertCat.run(c.id, c.title, c.slug, c.emoji, c.color_theme, now, now)
  console.log(`✓ Category: ${c.title} (#${c.id})`)
}

// 3. Products
const products = [
  {
    id: 1,
    name: 'Kunafa Chocolate',
    slug: 'kunafa-chocolate',
    category_id: 1,
    description: 'Crispy toasted kunafa pastry blended with creamy pistachio butter and encased in rich handcrafted Belgian milk chocolate.',
    is_best_seller: 1,
    in_stock: 1,
    is_eggless: 1,
    shelf_life: 'Best before 30 days. Store in cool place.',
    net_weight: '100g / 250g',
    variants: [
      { name: '100 g', price: 199 },
      { name: '250 g', price: 449 },
    ],
  },
  {
    id: 2,
    name: 'Coffee Bites',
    slug: 'coffee-bites',
    category_id: 1,
    description: 'Dark chocolate cubes infused with freshly roasted artisanal Arabica coffee beans. Rich, bold, and velvety smooth.',
    is_best_seller: 1,
    in_stock: 1,
    is_eggless: 1,
    shelf_life: 'Best before 30 days',
    net_weight: '100g / 250g',
    variants: [
      { name: '100 g', price: 199 },
      { name: '250 g', price: 399 },
    ],
  },
  {
    id: 3,
    name: 'Chocolate Brownie',
    slug: 'chocolate-brownie',
    category_id: 2,
    description: 'Fudgy, gooey Belgian chocolate brownies with a crackly top. 100% eggless, baked fresh daily with pure butter.',
    is_best_seller: 1,
    in_stock: 1,
    is_eggless: 1,
    shelf_life: 'Best consumed within 4 days. Keep refrigerated.',
    net_weight: 'Box of 4 / Box of 8',
    variants: [
      { name: '4 pcs', price: 199 },
      { name: '8 pcs', price: 349 },
    ],
  },
  {
    id: 4,
    name: 'Fruit Cupcakes',
    slug: 'fruit-cupcakes',
    category_id: 4,
    description: 'Moist and fluffy sponge cupcakes infused with real tropical fruit extracts and topped with light whipped frosting.',
    is_best_seller: 1,
    in_stock: 1,
    is_eggless: 1,
    shelf_life: 'Best consumed within 2 days. Keep refrigerated.',
    net_weight: 'Pack of 2 / Pack of 6',
    variants: [
      { name: 'Orange (2 pcs)', price: 120 },
      { name: 'Pineapple (2 pcs)', price: 130 },
      { name: 'Assorted (Box of 6)', price: 350 },
    ],
  },
  {
    id: 5,
    name: 'Osmania Biscuits',
    slug: 'osmania-biscuits',
    category_id: 3,
    description: 'Traditional Hyderabadi sweet-and-salty melt-in-the-mouth tea biscuits. Handcrafted following authentic heritage recipe.',
    is_best_seller: 0,
    in_stock: 1,
    is_eggless: 1,
    shelf_life: 'Best before 20 days. Store in airtight container.',
    net_weight: '250g / 500g',
    variants: [
      { name: '250 g', price: 149 },
      { name: '500 g', price: 280 },
    ],
  },
  {
    id: 6,
    name: 'Luxury Gift Box',
    slug: 'luxury-gift-box',
    category_id: 5,
    description: 'Handcrafted premium gift box containing assorted artisan chocolates, gourmet brownies, flavored tea tin, and festive greeting card.',
    is_best_seller: 1,
    in_stock: 1,
    is_eggless: 1,
    shelf_life: 'Assorted items. Store cool.',
    net_weight: 'Approx 1 kg',
    variants: [
      { name: 'Standard Box', price: 999 },
      { name: 'Premium Box', price: 1499 },
    ],
  },
  {
    id: 7,
    name: 'Chamomile Herbal Tea',
    slug: 'chamomile-herbal-tea',
    category_id: 6,
    description: 'Calming, aromatic whole chamomile flowers dried to perfection. Caffeine-free soothing herbal infusion.',
    is_best_seller: 0,
    in_stock: 1,
    is_eggless: 1,
    shelf_life: 'Best before 6 months',
    net_weight: '50g / 100g',
    variants: [
      { name: '50 g Tin', price: 249 },
      { name: '100 g Tin', price: 449 },
    ],
  },
]

const insertProd = db.prepare(`
  INSERT INTO products (id, name, slug, category_id, description, is_best_seller, in_stock, is_eggless, shelf_life, net_weight, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    slug = excluded.slug,
    category_id = excluded.category_id,
    description = excluded.description,
    is_best_seller = excluded.is_best_seller,
    in_stock = excluded.in_stock,
    is_eggless = excluded.is_eggless,
    shelf_life = excluded.shelf_life,
    net_weight = excluded.net_weight,
    updated_at = excluded.updated_at
`)

const deleteVariants = db.prepare('DELETE FROM products_variants WHERE _parent_id = ?')
const insertVariant = db.prepare(`
  INSERT INTO products_variants (_order, _parent_id, id, name, price)
  VALUES (?, ?, ?, ?, ?)
`)

for (const p of products) {
  insertProd.run(p.id, p.name, p.slug, p.category_id, p.description, p.is_best_seller, p.in_stock, p.is_eggless, p.shelf_life, p.net_weight, now, now)
  deleteVariants.run(p.id)
  
  p.variants.forEach((v, idx) => {
    const vId = crypto.randomBytes(12).toString('hex')
    insertVariant.run(idx + 1, p.id, vId, v.name, v.price)
  })

  console.log(`✓ Product: ${p.name} (Slug: ${p.slug}, Variants: ${p.variants.map(v => v.name + ': ₹' + v.price).join(', ')})`)
}

console.log('🎉 Database successfully seeded with 100% authentic Flavourite catalog!')
