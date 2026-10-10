// Creates all demo data — run: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

// ── Curated Unsplash image URLs by category ────────────────────────────────
const IMGS = {
  basketry: [
    'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=700&q=85',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=700&q=85',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&q=85',
    'https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=700&q=85',
  ],
  pottery: [
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&q=85',
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=700&q=85',
    'https://images.unsplash.com/photo-1615486511484-92e172cc4d0b?w=700&q=85',
    'https://images.unsplash.com/photo-1582225167739-7a8d1adbdb55?w=700&q=85',
  ],
  textiles: [
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=700&q=85',
    'https://images.unsplash.com/photo-1585987533090-1e3b67fe08e6?w=700&q=85',
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4467?w=700&q=85',
    'https://images.unsplash.com/photo-1558171813-0c44305c3ab6?w=700&q=85',
  ],
  jewellery: [
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=85',
    'https://images.unsplash.com/photo-1573408301185-9519f94815b2?w=700&q=85',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=85',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=85',
  ],
  woodwork: [
    'https://images.unsplash.com/photo-1558882224-dda166733046?w=700&q=85',
    'https://images.unsplash.com/photo-1547499417-ef3e3d30e1d1?w=700&q=85',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=85',
    'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=700&q=85',
  ],
  paintings: [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&q=85',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700&q=85',
    'https://images.unsplash.com/photo-1532102235608-dc8fc689c9ab?w=700&q=85',
    'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=700&q=85',
  ],
  metal: [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=85',
    'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=700&q=85',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=85',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700&q=85',
  ],
  homedecor: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=85',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=700&q=85',
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=700&q=85',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&q=85',
  ],
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // ── Admin ──────────────────────────────────────────────────────────────────
  if (!(await User.findOne({ email: process.env.ADMIN_EMAIL }))) {
    await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: 'admin' });
    console.log(`✅ Admin: ${process.env.ADMIN_EMAIL}`);
  } else console.log('✓ Admin already exists');

  // ── Artisan 1: Meena Devi — Palm-leaf basketry ────────────────────────────
  let meena = await User.findOne({ email: 'meena@artisan.local' });
  if (!meena) {
    meena = await User.create({
      name: 'Meena Devi', email: 'meena@artisan.local', password: 'Artisan@123',
      role: 'artisan', craft: 'Palm-leaf basketry', location: 'Erode, Tamil Nadu',
      community: 'Vaanam Self-Help Group',
      bio: 'Third-generation weaver of palm-leaf baskets and mats from Erode, Tamil Nadu. Our self-help group of 12 women carries forward a tradition over 200 years old. Every basket is made using sustainably harvested palm leaves, naturally dyed with plants found in our village.',
    });
    await Product.create([
      {
        artisan: meena._id, title: 'Palm-leaf storage basket', price: 450, stock: 12, category: 'Basketry',
        materials: 'palm leaf, natural dye', sold: 34,
        images: [IMGS.basketry[0], IMGS.basketry[1]],
        keywords: ['basket', 'palm', 'storage', 'handmade', 'eco-friendly'],
        descriptions: { en: 'A sturdy hand-woven storage basket made from natural palm leaf, finished with plant-based dye. Lightweight, durable, and eco-friendly — perfect for the kitchen, living room, or as a thoughtful gift.' },
      },
      {
        artisan: meena._id, title: 'Woven dining mat set (4 pcs)', price: 650, stock: 8, category: 'Home Decor',
        materials: 'palm leaf', sold: 21,
        images: [IMGS.basketry[2], IMGS.homedecor[0]],
        keywords: ['mat', 'dining', 'woven', 'set', 'table'],
        descriptions: { en: 'Set of four hand-woven dining mats made from sun-dried palm leaf. Light, heat-resistant, easy to wipe clean. Each mat is slightly unique — a sign of true handcraft.' },
      },
      {
        artisan: meena._id, title: 'Decorative wall hanging', price: 890, stock: 5, category: 'Home Decor',
        materials: 'palm leaf, cotton thread', sold: 8,
        images: [IMGS.homedecor[1], IMGS.basketry[3]],
        keywords: ['wall', 'hanging', 'decor', 'bohemian', 'palm'],
        descriptions: { en: 'A beautiful hand-crafted wall hanging made from palm leaf and cotton thread. Adds an earthy, artisanal touch to any room. Approx. 45 cm × 30 cm.' },
      },
      {
        artisan: meena._id, title: 'Oval fruit basket with lid', price: 780, stock: 7, category: 'Basketry',
        materials: 'palm leaf, cane', sold: 15,
        images: [IMGS.basketry[1], IMGS.basketry[0]],
        keywords: ['fruit', 'basket', 'oval', 'lid', 'kitchen', 'storage'],
        descriptions: { en: 'Oval-shaped hand-woven fruit basket with a removable lid. Made from palm leaf and cane, it keeps fruit fresh while looking beautiful on your kitchen counter.' },
      },
    ]);
    console.log('✅ Meena Devi — 4 products');
  }

  // ── Artisan 2: Rajan Kumar — Terracotta pottery ───────────────────────────
  let rajan = await User.findOne({ email: 'rajan@artisan.local' });
  if (!rajan) {
    rajan = await User.create({
      name: 'Rajan Kumar', email: 'rajan@artisan.local', password: 'Artisan@123',
      role: 'artisan', craft: 'Terracotta pottery', location: 'Kumbakonam, Tamil Nadu',
      community: "Potter's Guild",
      bio: 'Master potter with 25 years of experience in traditional Kumbakonam terracotta work. Every piece is thrown on a hand wheel and kiln-fired using traditional wood-fire methods. I learned this craft from my father, who learned it from his.',
    });
    await Product.create([
      {
        artisan: rajan._id, title: 'Terracotta water pot (Matka)', price: 380, stock: 15, category: 'Pottery',
        materials: 'terracotta clay', sold: 47,
        images: [IMGS.pottery[0], IMGS.pottery[2]],
        keywords: ['matka', 'clay', 'water', 'pot', 'terracotta', 'cooling'],
        descriptions: { en: 'Traditional hand-thrown terracotta matka. Keeps water naturally cool without electricity. Each pot is unique, fired in a wood kiln using centuries-old techniques. Holds approx. 4 litres.' },
      },
      {
        artisan: rajan._id, title: 'Hand-painted flower vase', price: 550, stock: 10, category: 'Pottery',
        materials: 'terracotta clay, natural pigments', sold: 19,
        images: [IMGS.pottery[1], IMGS.pottery[3]],
        keywords: ['vase', 'floral', 'painted', 'terracotta', 'decor'],
        descriptions: { en: 'Elegant hand-thrown and hand-painted terracotta vase. Decorated with traditional floral motifs using natural mineral pigments. Perfect as a standalone piece or with dried flowers.' },
      },
      {
        artisan: rajan._id, title: 'Set of 3 spice bowls (Katori)', price: 420, stock: 20, category: 'Pottery',
        materials: 'terracotta clay, food-safe glaze', sold: 31,
        images: [IMGS.pottery[2], IMGS.pottery[0]],
        keywords: ['katori', 'bowl', 'spice', 'serving', 'terracotta', 'set'],
        descriptions: { en: 'Set of three hand-thrown terracotta bowls glazed with food-safe natural glaze. Perfect for serving chutneys, spices, or sides. Microwave and dishwasher safe.' },
      },
      {
        artisan: rajan._id, title: 'Terracotta planter (large)', price: 620, stock: 9, category: 'Home Decor',
        materials: 'terracotta clay', sold: 12,
        images: [IMGS.pottery[3], IMGS.homedecor[2]],
        keywords: ['planter', 'pot', 'garden', 'terracotta', 'large', 'outdoor'],
        descriptions: { en: 'Large hand-thrown terracotta planter with drainage hole. Naturally porous, allowing roots to breathe. Ideal for indoor and outdoor plants. Height 28 cm, diameter 22 cm.' },
      },
    ]);
    console.log('✅ Rajan Kumar — 4 products');
  }

  // ── Artisan 3: Priya Shanmugam — Handloom weaving ────────────────────────
  let priya = await User.findOne({ email: 'priya@artisan.local' });
  if (!priya) {
    priya = await User.create({
      name: 'Priya Shanmugam', email: 'priya@artisan.local', password: 'Artisan@123',
      role: 'artisan', craft: 'Handloom weaving', location: 'Kanchipuram, Tamil Nadu',
      community: 'Silk Weavers Collective',
      bio: 'Weaver of traditional Kanchipuram silk sarees and fabric. Each piece takes 5–14 days to complete on a handloom passed down through three generations. I use only pure mulberry silk and real zari in every creation.',
    });
    await Product.create([
      {
        artisan: priya._id, title: 'Kanchipuram silk scarf', price: 1800, stock: 6, category: 'Textiles',
        materials: 'pure silk, zari', sold: 12,
        images: [IMGS.textiles[0], IMGS.textiles[2]],
        keywords: ['silk', 'scarf', 'kanchipuram', 'zari', 'handloom'],
        descriptions: { en: 'Handwoven Kanchipuram silk scarf with traditional zari border. Made on a centuries-old pit loom. The silk is hand-dyed using natural mordants before weaving. 200 cm × 60 cm.' },
      },
      {
        artisan: priya._id, title: 'Cotton handloom table runner', price: 720, stock: 14, category: 'Textiles',
        materials: 'organic cotton', sold: 28,
        images: [IMGS.textiles[1], IMGS.textiles[3]],
        keywords: ['cotton', 'handloom', 'table', 'runner', 'organic'],
        descriptions: { en: 'Handwoven organic cotton table runner with geometric patterns. Machine washable, fade-resistant. Brings a touch of traditional Indian weaving to your dining table. 150 cm × 35 cm.' },
      },
      {
        artisan: priya._id, title: 'Pure cotton dhoti (2.5m)', price: 950, stock: 10, category: 'Textiles',
        materials: 'organic cotton', sold: 7,
        images: [IMGS.textiles[2], IMGS.textiles[0]],
        keywords: ['dhoti', 'cotton', 'handloom', 'traditional', 'men'],
        descriptions: { en: 'Traditional handwoven pure cotton dhoti in pristine white with a subtle woven border. 2.5 metres of softness that gets better with every wash. A timeless garment made on a traditional loom.' },
      },
    ]);
    console.log('✅ Priya Shanmugam — 3 products');
  }

  // ── Artisan 4: Kavitha Raj — Brass & metalwork ────────────────────────────
  let kavitha = await User.findOne({ email: 'kavitha@artisan.local' });
  if (!kavitha) {
    kavitha = await User.create({
      name: 'Kavitha Raj', email: 'kavitha@artisan.local', password: 'Artisan@123',
      role: 'artisan', craft: 'Brass & Dhokra metalwork', location: 'Thanjavur, Tamil Nadu',
      community: 'Thanjavur Craft Heritage',
      bio: 'Third-generation brass craftsperson from Thanjavur. I create traditional oil lamps (diyas), idols, and decorative items using lost-wax casting — a technique unchanged for 4,000 years. My studio employs 6 women artisans from our village.',
    });
    await Product.create([
      {
        artisan: kavitha._id, title: 'Brass Kuthu vilakku (lamp)', price: 2200, stock: 8, category: 'Home Decor',
        materials: 'brass', sold: 22,
        images: [IMGS.metal[0], IMGS.metal[1]],
        keywords: ['lamp', 'vilakku', 'brass', 'diya', 'pooja', 'traditional'],
        descriptions: { en: 'Traditional Thanjavur-style Kuthu vilakku (standing oil lamp) hand-cast in solid brass using the lost-wax method. 5-faced lamp, 30 cm tall. Used in homes and temples across South India.' },
      },
      {
        artisan: kavitha._id, title: 'Dhokra brass elephant figurine', price: 1450, stock: 12, category: 'Home Decor',
        materials: 'brass, dhokra casting', sold: 18,
        images: [IMGS.metal[1], IMGS.metal[2]],
        keywords: ['elephant', 'figurine', 'dhokra', 'brass', 'decor', 'lucky'],
        descriptions: { en: 'Hand-cast solid brass elephant using the ancient Dhokra lost-wax technique. Each figurine is unique — small imperfections are proof of hand-craftsmanship. Height 12 cm, weight 450 g.' },
      },
      {
        artisan: kavitha._id, title: 'Copper water bottle (1L)', price: 890, stock: 18, category: 'Home Decor',
        materials: 'pure copper', sold: 35,
        images: [IMGS.metal[2], IMGS.metal[0]],
        keywords: ['copper', 'bottle', 'water', 'ayurvedic', 'health', 'pure'],
        descriptions: { en: 'Hand-hammered pure copper water bottle (1 litre). Storing water in copper overnight is an ancient Ayurvedic practice believed to have multiple health benefits. Leak-proof lid included.' },
      },
      {
        artisan: kavitha._id, title: 'Brass puja thali set', price: 1680, stock: 6, category: 'Home Decor',
        materials: 'brass', sold: 9,
        images: [IMGS.metal[3], IMGS.metal[0]],
        keywords: ['puja', 'thali', 'brass', 'pooja', 'plate', 'set', 'religious'],
        descriptions: { en: 'Complete hand-engraved brass puja thali set: main plate, diya, incense holder, bell, and kumkum box. Every piece is hand-engraved with traditional motifs by master craftswomen.' },
      },
    ]);
    console.log('✅ Kavitha Raj — 4 products');
  }

  // ── Artisan 5: Suresh Patel — Woodcarving ────────────────────────────────
  let suresh = await User.findOne({ email: 'suresh@artisan.local' });
  if (!suresh) {
    suresh = await User.create({
      name: 'Suresh Patel', email: 'suresh@artisan.local', password: 'Artisan@123',
      role: 'artisan', craft: 'Sandalwood & teak carving', location: 'Mysore, Karnataka',
      community: 'Karnataka Shilpi Sangha',
      bio: 'Master woodcarver from Mysore with 30 years of experience. I specialise in sandalwood and teak carvings using chisels passed down from my grandfather. Each piece takes 2–8 weeks of patient carving. Mysore is famous for its woodcarving tradition going back to the royal Wodeyar period.',
    });
    await Product.create([
      {
        artisan: suresh._id, title: 'Carved teak elephants (pair)', price: 3200, stock: 4, category: 'Woodwork',
        materials: 'teak wood, natural oil finish', sold: 11,
        images: [IMGS.woodwork[0], IMGS.woodwork[1]],
        keywords: ['elephant', 'teak', 'carved', 'pair', 'decor', 'mysore'],
        descriptions: { en: 'A matching pair of hand-carved teak wood elephants. Each elephant takes 2 weeks to carve and is finished with natural oils to bring out the grain. Height 18 cm each. A Mysore woodcarving classic.' },
      },
      {
        artisan: suresh._id, title: 'Sandalwood incense box', price: 1850, stock: 9, category: 'Woodwork',
        materials: 'genuine sandalwood', sold: 24,
        images: [IMGS.woodwork[1], IMGS.woodwork[2]],
        keywords: ['sandalwood', 'box', 'incense', 'fragrant', 'carved', 'gift'],
        descriptions: { en: 'Hand-carved genuine Mysore sandalwood incense box with intricate floral carvings. The natural fragrance lasts for decades. Ideal as a premium gift. 20 cm × 10 cm × 6 cm.' },
      },
      {
        artisan: suresh._id, title: 'Rosewood spice rack (6 jars)', price: 2750, stock: 3, category: 'Woodwork',
        materials: 'Indian rosewood, glass', sold: 5,
        images: [IMGS.woodwork[2], IMGS.woodwork[0]],
        keywords: ['spice', 'rack', 'rosewood', 'kitchen', 'glass', 'jars'],
        descriptions: { en: 'Hand-carved Indian rosewood spice rack with 6 glass jars. The rack features traditional carved motifs on the frame. Each jar has a hand-turned wooden lid. A functional piece of art for your kitchen.' },
      },
      {
        artisan: suresh._id, title: 'Carved teak serving tray', price: 1400, stock: 7, category: 'Woodwork',
        materials: 'teak wood, food-safe lacquer', sold: 16,
        images: [IMGS.woodwork[3], IMGS.woodwork[1]],
        keywords: ['tray', 'teak', 'serving', 'carved', 'kitchen', 'dining'],
        descriptions: { en: 'Handcrafted teak serving tray with carved handles and decorative border. Sealed with food-safe lacquer. Sturdy enough for daily use, beautiful enough for guests. 40 cm × 25 cm.' },
      },
    ]);
    console.log('✅ Suresh Patel — 4 products');
  }

  // ── Artisan 6: Anita Sharma — Traditional paintings ──────────────────────
  let anita = await User.findOne({ email: 'anita@artisan.local' });
  if (!anita) {
    anita = await User.create({
      name: 'Anita Sharma', email: 'anita@artisan.local', password: 'Artisan@123',
      role: 'artisan', craft: 'Madhubani & Warli painting', location: 'Mithila, Bihar',
      community: 'Mithila Chitrakari Sangha',
      bio: 'Madhubani painting artist from Mithila, Bihar — the birthplace of this ancient art form. I learned from my mother and grandmother. Each painting uses only natural colours made from flowers, leaves, and minerals. I am a National Award nominee for my work in preserving this heritage art.',
    });
    await Product.create([
      {
        artisan: anita._id, title: 'Madhubani fish painting (framed)', price: 2800, stock: 5, category: 'Paintings',
        materials: 'handmade paper, natural pigments', sold: 13,
        images: [IMGS.paintings[0], IMGS.paintings[1]],
        keywords: ['madhubani', 'fish', 'painting', 'mithila', 'framed', 'bihar'],
        descriptions: { en: 'Original Madhubani fish painting on handmade paper using natural colours. Fish are auspicious symbols in Mithila culture. Each painting is unique and signed by the artist. A5 size, wooden frame included.' },
      },
      {
        artisan: anita._id, title: 'Warli tribal art canvas', price: 1900, stock: 8, category: 'Paintings',
        materials: 'canvas, natural white pigment', sold: 17,
        images: [IMGS.paintings[1], IMGS.paintings[2]],
        keywords: ['warli', 'tribal', 'art', 'canvas', 'geometric', 'village'],
        descriptions: { en: 'Authentic Warli tribal art on canvas. The geometric stick-figure style depicts village life — dancing, farming, hunting. Painted using a rice paste and white pigment mixture. 30 cm × 40 cm, unframed.' },
      },
      {
        artisan: anita._id, title: 'Gond art print (set of 3)', price: 1200, stock: 11, category: 'Paintings',
        materials: 'archival paper, natural ink', sold: 22,
        images: [IMGS.paintings[2], IMGS.paintings[3]],
        keywords: ['gond', 'art', 'print', 'set', 'nature', 'tribal'],
        descriptions: { en: 'Set of 3 Gond art prints featuring the iconic dotted-pattern style from Madhya Pradesh. Animals and nature themes. Printed on archival paper from original artworks. Each 20 cm × 25 cm.' },
      },
      {
        artisan: anita._id, title: 'Madhubani bridal scene painting', price: 4500, stock: 2, category: 'Paintings',
        materials: 'handmade paper, natural pigments, gold leaf', sold: 4,
        images: [IMGS.paintings[3], IMGS.paintings[0]],
        keywords: ['madhubani', 'bridal', 'wedding', 'gold', 'gift', 'painting', 'luxury'],
        descriptions: { en: 'Large original Madhubani bridal scene painting — a traditional wedding gift in Mithila. Made on handmade paper with natural pigments and real gold leaf accents. A2 size, unframed. Certificate of authenticity included.' },
      },
    ]);
    console.log('✅ Anita Sharma — 4 products');
  }

  // ── Artisan 7: Lakshmi Nair — Jewellery ──────────────────────────────────
  let lakshmi = await User.findOne({ email: 'lakshmi@artisan.local' });
  if (!lakshmi) {
    lakshmi = await User.create({
      name: 'Lakshmi Nair', email: 'lakshmi@artisan.local', password: 'Artisan@123',
      role: 'artisan', craft: 'Silver & beadwork jewellery', location: 'Thrissur, Kerala',
      community: "Kerala Artisans' Cooperative",
      bio: "Kerala-trained silversmith and beadwork jewellery maker. I combine traditional Kerala temple jewellery motifs with lightweight contemporary designs. All my silver is 92.5 sterling. I take custom orders for bridal sets.",
    });
    await Product.create([
      {
        artisan: lakshmi._id, title: 'Sterling silver jhumka earrings', price: 1350, stock: 15, category: 'Jewellery',
        materials: '92.5 sterling silver', sold: 41,
        images: [IMGS.jewellery[0], IMGS.jewellery[1]],
        keywords: ['jhumka', 'earrings', 'silver', 'sterling', 'traditional', 'kerala'],
        descriptions: { en: 'Hand-crafted 92.5 sterling silver jhumka earrings with intricate filigree work. Inspired by Kerala temple jewellery motifs. Lightweight, comfortable for all-day wear. Hook closure. Comes in a silk pouch.' },
      },
      {
        artisan: lakshmi._id, title: 'Oxidised silver statement necklace', price: 2100, stock: 7, category: 'Jewellery',
        materials: 'oxidised 92.5 sterling silver', sold: 19,
        images: [IMGS.jewellery[1], IMGS.jewellery[2]],
        keywords: ['necklace', 'silver', 'oxidised', 'statement', 'boho'],
        descriptions: { en: 'Bold oxidised silver statement necklace with traditional lotus motif pendant. 92.5 sterling silver, hand-oxidised for an antique finish. Adjustable length 40–46 cm. Makes a stunning centrepiece for any outfit.' },
      },
      {
        artisan: lakshmi._id, title: 'Temple motif gold-plated bangles (set of 4)', price: 1780, stock: 10, category: 'Jewellery',
        materials: 'brass, 22K gold plating', sold: 26,
        images: [IMGS.jewellery[2], IMGS.jewellery[0]],
        keywords: ['bangles', 'gold', 'temple', 'set', 'brass', 'plated'],
        descriptions: { en: 'Set of 4 hand-cast brass bangles with 22K gold plating and traditional temple motif engravings. Each bangle is polished by hand. Size 2.6 inches diameter (M). Comes in a gift box.' },
      },
      {
        artisan: lakshmi._id, title: 'Rudraksha & silver bracelet', price: 890, stock: 20, category: 'Jewellery',
        materials: '92.5 silver, genuine rudraksha', sold: 53,
        images: [IMGS.jewellery[3], IMGS.jewellery[1]],
        keywords: ['rudraksha', 'bracelet', 'silver', 'spiritual', 'healing', 'men', 'unisex'],
        descriptions: { en: 'Genuine 5-mukhi rudraksha beads strung with 92.5 silver spacers and lobster-claw clasp. Adjustable 17–21 cm. A meaningful piece for daily wear. Each rudraksha is authenticated and energised.' },
      },
    ]);
    console.log('✅ Lakshmi Nair — 4 products');
  }

  const productCount = await Product.countDocuments();
  const artisanCount = await User.countDocuments({ role: 'artisan' });
  console.log(`\n🎉 Seed complete! ${artisanCount} artisans, ${productCount} products in database.`);
  process.exit(0);
})();
