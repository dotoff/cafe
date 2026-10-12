import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    // 1. Categories to seed
    const categoriesData = [
      { title: 'Chocolates', slug: 'chocolates', emoji: '🍫', colorTheme: '#5D4037' },
      { title: 'Brownies & Cakes', slug: 'brownies', emoji: '🥮', colorTheme: '#5D4037' },
      { title: 'Cookies & Biscuits', slug: 'cookies', emoji: '🍪', colorTheme: '#FBC02D' },
      { title: 'Fruit Cupcakes', slug: 'cupcakes', emoji: '🧁', colorTheme: '#E91E63' },
      { title: 'Gift Hampers', slug: 'hampers', emoji: '🎁', colorTheme: '#8E24AA' },
      { title: 'Herbal Tea', slug: 'tea', emoji: '🍵', colorTheme: '#1e3f20' },
    ]

    const categoryMap: Record<string, any> = {}

    for (const cat of categoriesData) {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        categoryMap[cat.slug] = existing.docs[0].id
      } else {
        const created = await payload.create({
          collection: 'categories',
          data: cat,
        })
        categoryMap[cat.slug] = created.id
      }
    }

    // 2. Products to seed
    const productsData = [
      {
        name: 'Kunafa Chocolate',
        slug: 'kunafa-chocolate',
        categorySlug: 'chocolates',
        description: 'Crispy toasted kunafa pastry blended with creamy pistachio butter and encased in rich handcrafted Belgian milk chocolate.',
        isBestSeller: true,
        inStock: true,
        isEggless: true,
        shelfLife: 'Best before 30 days. Store in a cool place.',
        netWeight: '100g / 250g',
        variants: [
          { name: '100 g', price: 199 },
          { name: '250 g', price: 449 },
        ],
      },
      {
        name: 'Coffee Bites',
        slug: 'coffee-bites',
        categorySlug: 'chocolates',
        description: 'Dark chocolate cubes infused with freshly roasted artisanal Arabica coffee beans. Rich, bold, and velvety smooth.',
        isBestSeller: true,
        inStock: true,
        isEggless: true,
        shelfLife: 'Best before 30 days',
        netWeight: '100g / 250g',
        variants: [
          { name: '100 g', price: 199 },
          { name: '250 g', price: 399 },
        ],
      },
      {
        name: 'Chocolate Brownie',
        slug: 'chocolate-brownie',
        categorySlug: 'brownies',
        description: 'Fudgy, gooey Belgian chocolate brownies with a crackly top. 100% eggless, baked fresh daily with pure butter.',
        isBestSeller: true,
        inStock: true,
        isEggless: true,
        shelfLife: 'Best consumed within 4 days. Keep refrigerated.',
        netWeight: 'Box of 4 / Box of 8',
        variants: [
          { name: '4 pcs', price: 199 },
          { name: '8 pcs', price: 349 },
        ],
      },
      {
        name: 'Fruit Cupcakes',
        slug: 'fruit-cupcakes',
        categorySlug: 'cupcakes',
        description: 'Moist and fluffy sponge cupcakes infused with real tropical fruit extracts and topped with light whipped frosting.',
        isBestSeller: true,
        inStock: true,
        isEggless: true,
        shelfLife: 'Best consumed within 2 days. Keep refrigerated.',
        netWeight: 'Pack of 2 / Pack of 6',
        variants: [
          { name: 'Orange (2 pcs)', price: 120 },
          { name: 'Pineapple (2 pcs)', price: 130 },
          { name: 'Assorted (Box of 6)', price: 350 },
        ],
      },
      {
        name: 'Osmania Biscuits',
        slug: 'osmania-biscuits',
        categorySlug: 'cookies',
        description: 'Traditional Hyderabadi sweet-and-salty melt-in-the-mouth tea biscuits. Handcrafted following authentic heritage recipe.',
        isBestSeller: false,
        inStock: true,
        isEggless: true,
        shelfLife: 'Best before 20 days. Store in airtight container.',
        netWeight: '250g / 500g',
        variants: [
          { name: '250 g', price: 149 },
          { name: '500 g', price: 280 },
        ],
      },
      {
        name: 'Luxury Gift Box',
        slug: 'luxury-gift-box',
        categorySlug: 'hampers',
        description: 'Handcrafted premium gift box containing assorted artisan chocolates, gourmet brownies, flavored tea tin, and festive greeting card.',
        isBestSeller: true,
        inStock: true,
        isEggless: true,
        shelfLife: 'Assorted items. Store cool.',
        netWeight: 'Approx 1 kg',
        variants: [
          { name: 'Standard Box', price: 999 },
          { name: 'Premium Box', price: 1499 },
        ],
      },
      {
        name: 'Chamomile Herbal Tea',
        slug: 'chamomile-herbal-tea',
        categorySlug: 'tea',
        description: 'Calming, aromatic whole chamomile flowers dried to perfection. Caffeine-free soothing herbal infusion.',
        isBestSeller: false,
        inStock: true,
        isEggless: true,
        shelfLife: 'Best before 6 months',
        netWeight: '50g / 100g',
        variants: [
          { name: '50 g Tin', price: 249 },
          { name: '100 g Tin', price: 449 },
        ],
      },
    ]

    const seededProducts = []

    for (const prod of productsData) {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: prod.slug } },
        limit: 1,
      })

      const categoryId = categoryMap[prod.categorySlug] || 1

      if (existing.docs.length > 0) {
        // Update product to ensure correct variants and details
        const updated = await payload.update({
          collection: 'products',
          id: existing.docs[0].id,
          data: {
            name: prod.name,
            slug: prod.slug,
            category: categoryId,
            description: prod.description,
            isBestSeller: prod.isBestSeller,
            inStock: prod.inStock,
            isEggless: prod.isEggless,
            shelfLife: prod.shelfLife,
            netWeight: prod.netWeight,
            variants: prod.variants,
          },
        })
        seededProducts.push({ name: prod.name, status: 'updated', id: updated.id })
      } else {
        const created = await payload.create({
          collection: 'products',
          data: {
            name: prod.name,
            slug: prod.slug,
            category: categoryId,
            description: prod.description,
            isBestSeller: prod.isBestSeller,
            inStock: prod.inStock,
            isEggless: prod.isEggless,
            shelfLife: prod.shelfLife,
            netWeight: prod.netWeight,
            variants: prod.variants,
          },
        })
        seededProducts.push({ name: prod.name, status: 'created', id: created.id })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with authentic Flavourite Cafe products and categories.',
      categories: Object.keys(categoryMap),
      products: seededProducts,
    })
  } catch (error: any) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: error?.message || 'Failed to seed database' }, { status: 500 })
  }
}
