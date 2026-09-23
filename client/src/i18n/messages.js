const messages = {
  en: {
    nav: {
      home: 'Home', about: 'About', contact: 'Contact', search: 'Search',
      language: 'Language', profile: 'My Profile', orders: 'Orders',
      address: 'Your Address', logout: 'Logout', cart: 'Cart',
      loggedInAs: 'Logged in as',
    },
      back: { toProducts: 'Back to Products' },
      categoryPage: {
        back: 'Back', notFound: 'Category not found', goHome: 'Go Home', noProducts: 'No products found in this category.',
        titles: {
          seeds: 'Seeds', 'crop-protection': 'Crop Protection', 'crop-nutrition': 'Crop Nutrition', 'farming-tools': 'Farming Tools',
          plants: 'Plants', 'flower-seeds': 'Flower Seeds', insecticides: 'Insecticides', fungicides: 'Fungicides',
          herbicides: 'Herbicides', 'organic-farming': 'Organic Farming'
        }
      },
    search: { placeholder: 'Search products...' },
    auth: {
      login: 'Login',
      register: 'Register',
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Account',
      emailRequired: 'Email and password are required.',
      phoneRequired: 'Phone number is required.',
      otpRequired: 'OTP is required.',
      fullNameRequired: 'Full name is required.',
      passwordRequirement: 'Password must be at least 6 characters.',
      accountCreated: 'Account created! Welcome, {name}!',
      welcome: 'Welcome back, {name}! 🎉',
      sendOtp: 'Send OTP',
      verifyLogin: 'Verify & Login',
    },
    product: {
      available: 'Available',
      outOfStock: 'Out of Stock',
      suitable: 'Suitable for:',
        inStock: 'In Stock',
        buyNow: 'Buy Now',
        processing: 'Processing...',
        detailsTitle: 'Product Details',
        selectPackSize: 'Select Pack Size',
      viewDetails: 'View Details',
      addToCart: 'Add to Cart',
      adding: 'Adding...',
      selectWeight: 'Select Weight / Quantity'
    },
    category: { uncategorized: 'Uncategorized' },
    general: { search: 'Search' },
    profile: {
      profile: 'Profile', orders: 'Orders', addresses: 'Addresses',
      logout: 'Logout', title: 'My Profile', personalInfo: 'Personal Information',
      edit: 'Edit', name: 'Name:', email: 'Email:', phone: 'Phone:',
      fullName: 'Full Name', phoneNumber: 'Phone Number', emailAddress: 'Email Address',
      newPassword: 'New Password', passwordPlaceholder: 'Leave blank to keep current password',
      save: 'Save Changes', saving: 'Saving...', cancel: 'Cancel',
      updated: 'Profile updated successfully!', updateFailed: 'Failed to update profile.'
    },
    orders: {
      title: 'My Orders', count: '{count} orders', searchPlaceholder: 'Search order # or product name...',
      range: '{from}-{to} of {total}', noOrders: 'No orders yet',
      emptyMessage: 'Discover top agri-inputs and place your first order.', shopNow: 'Shop Now',
      filters: { all: 'All', pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }
    },
    addresses: {
      title: 'My Address', edit: 'Edit Address', add: 'Add a new address',
      name: 'Name', mobile: '10-digit mobile number', pincode: 'Pincode',
      house: 'Flat, House no., Building, Company, Apartment',
      street: 'Area, Street, Sector, Village', city: 'Town/City', state: 'State', country: 'Country',
      update: 'Update Address', save: 'Save Address', cancel: 'Cancel', addNew: 'Add New Address',
      address: 'Address', editTitle: 'Edit Address', removeTitle: 'Remove Address',
      confirmRemove: 'Are you sure you want to remove this address?',
      saveFailed: 'Failed to save address.', removeFailed: 'Failed to remove address.'
    },
    cart: {
      title: 'Your Cart', empty: 'Your cart is empty', continueShopping: 'Continue Shopping',
      size: 'Size', subtotal: 'Subtotal ({count} items)', clear: 'Clear Cart',
      accept: 'I accept the', terms: 'terms and conditions',
      policyIntro: "By clicking on the place order, I agree to MarutiKrushiSevaKendra's",
      returnPolicy: 'return and refund policies', and: 'and', privacy: 'privacy policy',
      placeOrder: 'Place Order', checkoutNote: 'Shipping, taxes and discounts are calculated at checkout.',
      itemImage: 'Item'
    },
    home: {
      quickCategories: {
        seeds: 'Seeds', cropProtection: 'Crop Protection', cropNutrition: 'Crop Nutrition',
        farmingTools: 'Farming Tools', plants: 'Plants', pots: 'Pots & Planters', animalFeed: 'Animal Feed & Care'
      },
      quickMenu: {
        vegetable_seeds: 'VEGETABLE SEEDS', fruit_seeds: 'FRUIT SEEDS', top_brands: 'TOP BRANDS', flower_seeds: 'FLOWER SEEDS',
        bhindi_okra_seeds: 'Bhindi (Okra) Seeds', chilli_seeds: 'Chilli Seeds', tomato_seeds: 'Tomato Seeds', cauliflower_seeds: 'Cauliflower Seeds',
        bitter_gourd_seeds: 'Bitter Gourd Seeds', bottle_gourd_seeds: 'Bottle Gourd Seeds', broccoli_seeds: 'Broccoli Seeds', brinjal_seeds: 'Brinjal Seeds',
        carrot_seeds: 'Carrot Seeds', muskmelon_seeds: 'Muskmelon Seeds', watermelon_seeds: 'Watermelon Seeds', papaya_seeds: 'Papaya Seeds',
        strawberry: 'Strawberry', seminis_seeds: 'Seminis Seeds', vnr_seeds: 'VNR Seeds', sakata: 'Sakata', clause_seeds: 'Clause Seeds',
        advanta_seeds: 'Advanta Seeds', marigold_seeds: 'Marigold Seeds', zinnia_seeds: 'Zinnia Seeds',
        chemical_pesticides: 'CHEMICAL PESTICIDES', bio_pesticides: 'BIO PESTICIDES', insecticides: 'Insecticides', fungicides: 'Fungicides',
        herbicides: 'Herbicides', bio_insecticide: 'Bio Insecticide', bio_fungicide: 'Bio Fungicide', upl: 'UPL', bayer: 'Bayer',
        adama: 'Adama', basf: 'BASF', dhanuka: 'Dhanuka', crop_nutrition: 'CROP NUTRITION', fertilizers: 'Fertilizers',
        bio_fertilizers: 'Bio Fertilizers', biostimulants: 'Biostimulants', plant_growth_promoter: 'Plant Growth Promoter',
        farming_tools: 'FARMING TOOLS', garden_hand_tools: 'Garden & Hand Tools', sprayers_and_pumps: 'Sprayers and Pumps',
        wolf_garten_tools: 'Wolf Garten Tools', lawn_mower: 'Lawn Mower', power_weeder: 'Power Weeder', earth_auger: 'Earth Auger',
        harvesters: 'Harvesters', safety_hand_gloves: 'Safety Hand Gloves', weeders: 'Weeders', view_all: 'View All →'
      },
      features: {
        original: '100% Original', originalDescription: 'Genuine, premium brand agricultural supplies',
        delivery: 'Free Delivery', deliveryDescription: 'Direct delivery straight to your farm',
        payment: 'Secure Payment', paymentDescription: '100% protected and safe online checkouts',
        expert: 'Expert System', expertDescription: 'Agricultural consultation and advice'
      },
      categories: {
        title: 'Products by Category', subtitle: 'Browse all agricultural products by category',
        seeds: 'Seeds', seedsDescription: 'Vegetable, field & hybrid seeds',
        cropProtection: 'Crop Protection', cropProtectionDescription: 'Pesticides & disease control',
        cropNutrition: 'Crop Nutrition', cropNutritionDescription: 'Fertilizers & micronutrients',
        farmingTools: 'Farming Tools', farmingToolsDescription: 'Hand tools & farm equipment',
        plants: 'Plants', plantsDescription: 'Saplings & ornamental plants',
        pots: 'Pots & Planters', potsDescription: 'Garden pots, planters & trays',
        flowerSeeds: 'Flower Seeds', flowerSeedsDescription: 'Annual, perennial & seasonal blooms',
        insecticides: 'Insecticides', insecticidesDescription: 'Control harmful insects & pests',
        fungicides: 'Fungicides', fungicidesDescription: 'Prevent & treat fungal diseases',
        herbicides: 'Herbicides', herbicidesDescription: 'Weed control & management',
        organicFarming: 'Organic Farming', organicFarmingDescription: 'Bio pesticides & organic inputs',
        animalFeed: 'Animal Feed', animalFeedDescription: 'Feed, supplements & animal care'
      },
      brands: {
        title: 'Brands', subtitle: 'Quality brands trusted by local farmers', previous: 'Previous brands', next: 'Next brands'
      },
      bestDeals: {
        title: 'Best Deals', subtitle: 'Handpicked offers on top agricultural products — save big today!',
        viewAll: 'View All Products', previous: 'Previous deal', next: 'Next deal'
      },
      vegetableSeeds: {
        title: 'Vegetable Seeds', subtitle: 'Premium hybrid & open-pollinated vegetable seeds for higher yields',
        viewAll: 'View All Seeds'
      },
      footer: {
        description: 'MarutiKrushiSevaKendra brings genuine seeds, crop protection, crop nutrition, tools and garden essentials closer to farmers with reliable support and easy ordering.',
        getItOn: 'Get it on', seller: 'Become a Seller', quickLinksTitle: 'Quick Links', categoriesTitle: 'Top Categories', followUs: 'Follow Us',
        quickLinks: [
          ['/about', 'About Us'], ['/privacy', 'Privacy Policy'], ['/returns', 'Return Policy'], ['/shipping', 'Shipping Policy'],
          ['/terms', 'Terms & Conditions'], ['/careers', 'Careers'], ['/blog', 'Blog'], ['/contact', 'Contact Us'], ['/track', 'Track Order']
        ],
        categories: [
          ['/vegetable-seeds', 'Vegetable Seeds'], ['/crop-protection', 'Crop Protection'], ['/crop-nutrition', 'Crop Nutrition'],
          ['/farming-tools', 'Tools & Equipment'], ['/plants', 'Plants'], ['/products?search=pots', 'Pots & Planters']
        ],
        updatedTitle: 'Stay Updated', updatedDescription: 'Get useful offers, seasonal products and farming updates.', emailPlaceholder: 'Enter your email',
        contactTitle: 'Contact Us', email: 'Email', customerCare: 'Customer Care',
        rights: 'All rights reserved.', privacy: 'Privacy', terms: 'Terms', support: 'Support'
      },
      sections: {
        cropProtection: ['Crop Protection', 'Effective pesticides, fungicides & herbicides to safeguard your harvest', 'View All Products'],
        flowerSeeds: ['Flower Seeds', 'Brighten your garden with vibrant annual & perennial flower seeds', 'View All Flower Seeds'],
        cropNutrition: ['Crop Nutrition', 'Fertilizers, micronutrients & biostimulants for healthier, higher-yield crops', 'View All Products'],
        insecticides: ['Insecticides', 'Powerful systemic & contact insecticides to protect your crops from pests', 'View All Insecticides'],
        fungicides: ['Fungicides', 'Systemic & contact fungicides to prevent and cure fungal diseases in crops', 'View All Fungicides'],
        herbicides: ['Herbicides', 'Selective & non-selective herbicides for effective weed management in your fields', 'View All Herbicides'],
        bioInsecticides: ['Bio Insecticides', 'Natural & eco-friendly bio insecticides — safe for soil, crops & the environment', 'View All Bio Insecticides'],
        toolsEquipment: ['Tools & Equipment', 'Professional farming tools, sprayers & equipment for every agricultural need', 'View All Tools'],
        plants: ['Plants', 'Fresh nursery saplings — fruit trees, medicinal herbs & ornamental plants', 'View All Plants']
      },
      whyChooseUs: {
        title: 'Why Choose Us?', subtitle: 'We are committed to your farming success',
        quality: ['Quality Products', 'Genuine, branded agricultural products from trusted manufacturers.'],
        service: ['Trusted Service', 'Years of experience serving local farmers with honesty.'],
        support: ['Local Support', 'We understand local farming conditions and needs.'],
        farmerFriendly: ['Farmer-Friendly', 'Simple guidance to help you choose the right product.']
      },
      seo: {
        title: 'MarutiKrushiSevaKendra – India’s Trusted Online Agriculture Store',
        description: 'Shop original seeds, pesticides, fertilizers, crop nutrition and farming tools from top brands. Explore popular categories like Crop Protection, Crop Nutrition, Tools & Equipment, Vegetable Seeds and Outdoor Plants. We focus on genuine, brand-authorized inventory with fast delivery and GST invoices.',
        faqTitle: 'Frequently Asked Questions',
        questions: [
          ['What categories of products are available on MarutiKrushiSevaKendra?', 'We offer original seeds, pesticides, fertilizers, crop nutrition, and a variety of farming tools from top brands.'],
          ['How fast will I get my delivery?', 'Most orders are processed within 24 hours and delivered within 3-7 business days depending on your location.'],
          ['Can I return or replace a product?', 'Yes, we offer a hassle-free return and replacement policy for eligible products within 7 days of delivery.'],
          ['Do you provide a GST invoice?', 'Yes, we provide valid GST invoices for all purchases so you can easily claim input tax credit.'],
          ['How can I track my order?', 'Once dispatched, you will receive a tracking link via email and SMS to monitor your delivery status in real-time.'],
          ['What payment options are available?', 'We accept Credit/Debit cards, UPI, Net Banking, Wallets, and Cash on Delivery (COD) on eligible orders.'],
          ['Do you deliver all over India?', 'Yes, we deliver to most PIN codes across India, ensuring quality supplies reach farmers everywhere.'],
          ['Do you provide customer support if I have questions about a product?', 'Absolutely! Our expert support team is available via phone and WhatsApp to guide you with any queries.'],
          ['Can I buy products in bulk at wholesale prices?', 'Yes, bulk discounts and wholesale pricing are available for farmers and retailers. Contact our support team for bulk orders.']
        ]
      }
    }
  },
  mr: {
    nav: {
      home: 'मुख्यपृष्ठ', about: 'आमच्या विषयी', contact: 'संपर्क', search: 'शोध',
      language: 'भाषा', profile: 'माझे प्रोफाइल', orders: 'ऑर्डर्स',
      address: 'तुमचा पत्ता', logout: 'लॉगआउट', cart: 'कार्ट',
      loggedInAs: 'लॉगिन केले आहे:',
    },
      back: { toProducts: 'उत्पादनांकडे परत' },
    categoryPage: {
      back: 'मागे', notFound: 'श्रेणी सापडली नाही', goHome: 'मुख्यपृष्ठावर जा', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      titles: {
        seeds: 'बियाणे', 'crop-protection': 'पीक संरक्षण', 'crop-nutrition': 'पीक पोषण', 'farming-tools': 'शेतीची साधने',
        plants: 'रोपे', 'flower-seeds': 'फुलांची बियाणे', insecticides: 'कीटकनाशके', fungicides: 'बुरशीनाशके',
        herbicides: 'तणनाशके', 'organic-farming': 'सेंद्रिय शेती'
      }
    },
    vegetableSeedsPage: {
      back: 'Back', title: 'Vegetable Seeds', noProducts: 'No products found in this category.',
      sections: [
        {
          heading: 'Buy Vegetable Seeds Online in India',
          paragraphs: [
            'Grow fresh, healthy and high-quality vegetables with the right seeds. At MarutiKrushiSevaKendra, you can buy vegetable seeds online for commercial farming, kitchen gardening, terrace gardening and home cultivation. Explore a wide selection of hybrid, improved and open-pollinated vegetable seeds from trusted agricultural brands.',
            'Our vegetable seed collection includes popular crops suitable for different seasons, soil conditions and growing regions across India. Farmers can compare available varieties and select seeds according to crop duration, yield potential, fruit quality, disease tolerance and local climatic conditions.'
          ]
        },
        {
          heading: 'Shop Vegetable Seeds by Crop',
          paragraphs: ['Choose seeds for frequently grown vegetables such as tomato, chilli, brinjal, okra, onion, cabbage, cauliflower, cucumber, bottle gourd, bitter gourd, ridge gourd, sponge gourd, pumpkin, watermelon, muskmelon, carrot, radish, beetroot, coriander, spinach, peas, beans and many more.']
        },
        {
          heading: 'Vegetable Seeds for Every Growing Requirement',
          items: [
            ['Hybrid Vegetable Seeds:', 'Selected for uniform growth, desirable produce quality and high yield potential.'],
            ['Open-Pollinated Seeds:', 'Suitable for farmers and gardeners looking for traditional and naturally pollinated varieties.'],
            ['Commercial Farming Seeds:', 'Varieties suitable for larger cultivation areas and market-oriented vegetable production.'],
            ['Kitchen Garden Seeds:', 'Convenient seed options for growing vegetables at home, on terraces or in small garden spaces.'],
            ['Seasonal Vegetable Seeds:', 'Varieties available for Kharif, Rabi, summer and year-round cultivation, depending on local conditions.']
          ]
        },
        {
          heading: 'Benefits of Choosing Quality Vegetable Seeds',
          items: ['Better germination and healthy crop establishment', 'Uniform plant growth and produce development', 'Improved yield and marketable crop quality', 'Availability of varieties suitable for different regions and seasons', 'Options with desirable colour, shape, size, taste and shelf life', 'Reduced risk associated with poor-quality or unidentified seeds']
        },
        {
          heading: 'How to Select the Right Vegetable Seeds',
          paragraphs: [
            'Before purchasing vegetable seeds, consider the recommended sowing season, climate, soil type, irrigation availability, crop duration and cultivation method. Farmers should also check important varietal characteristics such as germination, plant habit, maturity period, expected yield, produce quality, disease tolerance and suitability for local market demand.',
            'Always read the product description and seed packet label carefully before sowing. Recommended seed rate, spacing and cultivation practices may vary according to the crop, variety, location and growing conditions.'
          ]
        },
        {
          heading: 'Why Buy Vegetable Seeds from MarutiKrushiSevaKendra?',
          items: ['Wide range of vegetable crops and varieties', 'Seeds from trusted and recognised agricultural brands', 'Suitable options for farmers and home gardeners', 'Convenient online ordering from anywhere in India', 'Delivery to villages, towns and cities across serviceable locations', 'Multiple pack sizes and price options where available', 'Cash on Delivery available on eligible orders']
        },
        {
          heading: 'Order Vegetable Seeds Online',
          paragraphs: ['Browse the collection and order vegetable seeds online according to your crop, season and farming requirements. Whether you need tomato seeds for commercial cultivation, chilli seeds for high-quality production, gourd seeds for seasonal farming or mixed vegetable seeds for a kitchen garden, MarutiKrushiSevaKendra helps you find suitable options in one place.']
        }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [
        ['Which vegetable seeds are available online?', 'You can shop for seeds of tomato, chilli, brinjal, okra, onion, cucumber, cabbage, cauliflower, gourds, leafy vegetables, root vegetables, beans, peas, melons and several other vegetable crops.'],
        ['Are these seeds suitable for commercial farming?', 'Many varieties are intended for commercial cultivation, while some are also suitable for kitchen gardens and small growing spaces. Check the individual product details before purchasing.'],
        ['How should I choose a vegetable seed variety?', "Select a variety based on your location, sowing season, crop duration, cultivation method, disease conditions and local market requirements. Follow the manufacturer's recommendations printed on the seed packet."],
        ['Can vegetable seeds be delivered to villages?', 'MarutiKrushiSevaKendra delivers to many serviceable village, town and city PIN codes across India. Delivery availability can be checked using the destination PIN code.'],
        ['Does MarutiKrushiSevaKendra provide Cash on Delivery?', 'Cash on Delivery may be available for eligible products and serviceable PIN codes. Available payment options are displayed during checkout.']
      ],
      disclaimer: 'Disclaimer: Seed germination and crop performance depend on seed quality as well as soil, climate, irrigation, sowing practices, storage conditions and crop management. Always follow the instructions printed on the product label and seek guidance from a local agriculture expert when required.'
    },
    cropProtectionPage: {
      back: 'Back', title: 'Crop Protection', noProducts: 'No products found in this category.',
      sections: [
        { heading: 'Buy Crop Protection Products Online in India', paragraphs: ['Protect your crops from insects, fungal diseases and weeds with reliable crop protection products from trusted agricultural brands. Explore insecticides, fungicides, herbicides and bio-based solutions for farms, gardens and commercial cultivation.', 'Choose products according to your crop, pest or disease, application method and local growing conditions. Always follow the product label and recommended dosage.'] },
        { heading: 'Crop Protection Solutions for Every Need', items: [['Insecticides:', 'Control harmful insects such as aphids, whiteflies, caterpillars and sucking pests.'], ['Fungicides:', 'Prevent and manage fungal diseases affecting leaves, stems, roots and fruits.'], ['Herbicides:', 'Manage unwanted weeds and reduce competition for water and nutrients.'], ['Bio Protection Products:', 'Choose eco-friendly biological and microbial solutions for responsible crop care.']] },
        { heading: 'Benefits of Choosing Quality Crop Protection Products', items: ['Improved protection against insects, diseases and weeds', 'Healthier crop growth and better yield potential', 'Products from trusted and recognised agricultural brands', 'Options for different crops, pests, diseases and application methods', 'Suitable solutions for farmers, gardens and commercial cultivation'] },
        { heading: 'How to Select the Right Crop Protection Product', paragraphs: ['Identify the crop problem correctly before selecting a product. Consider the pest or disease, crop stage, weather, application equipment, recommended dose and waiting period. For best results, read the product label carefully and follow safe handling instructions.', 'Integrated crop management, field monitoring and timely application can help reduce crop losses and support sustainable farming.'] },
        { heading: 'Why Buy Crop Protection Products from MarutiKrushiSevaKendra?', items: ['Wide range of crop protection products', 'Products from trusted agricultural brands', 'Options for field crops, vegetables, fruits and gardens', 'Convenient online ordering from anywhere in India', 'Delivery to serviceable villages, towns and cities', 'Support for selecting suitable agricultural inputs'] }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [['Which crop protection products are available?', 'You can find insecticides, fungicides, herbicides and bio-based crop protection products for a variety of crops and farming needs.'], ['How do I choose the right product?', 'Identify the crop, pest or disease and crop stage, then follow the product label and recommended dosage. Consult a local agriculture expert when needed.'], ['Are crop protection products safe to use?', 'Use products only as directed on the label. Follow the recommended dose, protective measures, waiting period and storage instructions.']],
      disclaimer: 'Disclaimer: Crop protection results depend on the crop, pest or disease, weather, application method and crop management. Always read the product label and seek guidance from a qualified local agriculture expert when required.'
    },
    flowerSeedsPage: {
      back: 'Back', title: 'Flower Seeds', noProducts: 'No products found in this category.',
      sections: [
        { heading: 'Buy Flower Seeds Online in India', paragraphs: ['Grow colourful, healthy and beautiful flowers with quality seeds from trusted agricultural brands. Explore annual, perennial and seasonal flower seeds for gardens, balconies, terraces, nurseries and landscaping.', 'Choose varieties according to your climate, growing space, season, sunlight and preferred flower colour or form.'] },
        { heading: 'Popular Flower Seeds', paragraphs: ['Explore marigold, zinnia, rose, petunia, sunflower, dahlia, lavender, cosmos, dianthus and wildflower varieties for home gardens and commercial flower cultivation.'] },
        { heading: 'Benefits of Quality Flower Seeds', items: ['Better germination and healthy plant establishment', 'Bright and uniform flowering', 'Varieties for different seasons and growing spaces', 'Suitable options for gardens, pots, balconies and landscaping', 'Trusted seeds for home gardeners, nurseries and growers'] },
        { heading: 'How to Select the Right Flower Seeds', paragraphs: ['Consider the recommended sowing season, sunlight, soil, watering needs, plant height, flowering period and available space before selecting a variety. Follow the seed packet instructions for sowing depth, spacing and care.'] },
        { heading: 'Why Buy Flower Seeds from MarutiKrushiSevaKendra?', items: ['Wide selection of colourful flower varieties', 'Seeds from trusted agricultural brands', 'Options for home gardens and commercial growers', 'Convenient online ordering across India', 'Delivery to serviceable villages, towns and cities'] }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [['Which flower seeds are available?', 'You can find marigold, zinnia, rose, petunia, sunflower, dahlia, lavender, cosmos and other seasonal flower seeds.'], ['When should I sow flower seeds?', 'The best sowing time depends on the flower variety, local climate and season. Check the product label for specific guidance.'], ['Can flower seeds be grown in pots?', 'Yes, many flower varieties can be grown in pots, containers, balconies and terrace gardens when provided with suitable sunlight and care.']],
      disclaimer: 'Disclaimer: Germination and flowering depend on seed quality, climate, soil, sunlight, watering and plant care. Always follow the product label instructions.'
    },
    cropNutritionPage: {
      back: 'Back', title: 'Crop Nutrition', noProducts: 'No products found in this category.',
      sections: [
        { heading: 'Buy Crop Nutrition Products Online in India', paragraphs: ['Support healthier crops and better yields with quality fertilizers, micronutrients, bio-fertilizers and biostimulants from trusted agricultural brands.', 'Choose crop nutrition products according to your crop, soil condition, growth stage, irrigation method and nutrient requirements.'] },
        { heading: 'Crop Nutrition Products for Every Need', items: [['Fertilizers:', 'Supply essential nutrients such as nitrogen, phosphorus and potassium for crop growth.'], ['Micronutrients:', 'Provide zinc, boron, iron, calcium and other nutrients required in small quantities.'], ['Bio-Fertilizers:', 'Use beneficial microorganisms to support soil health and nutrient availability.'], ['Biostimulants:', 'Support plant performance, stress tolerance and improved crop development.']] },
        { heading: 'Benefits of Quality Crop Nutrition', items: ['Healthy root and plant development', 'Improved flowering, fruiting and crop quality', 'Better nutrient availability and soil health', 'Suitable options for field crops, vegetables, fruits and gardens', 'Products from trusted agricultural brands'] },
        { heading: 'How to Select the Right Crop Nutrition Product', paragraphs: ['Consider soil test results, crop stage, nutrient deficiency, application method and recommended dosage before selecting a product. Follow the label instructions for mixing, timing and safe application.', 'Balanced nutrition, regular crop observation and suitable irrigation can help improve crop growth and yield potential.'] },
        { heading: 'Why Buy Crop Nutrition Products from MarutiKrushiSevaKendra?', items: ['Wide range of fertilizers and crop nutrition inputs', 'Options for different crops and growing conditions', 'Convenient online ordering across India', 'Delivery to serviceable villages, towns and cities', 'Support for selecting suitable agricultural inputs'] }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [['Which crop nutrition products are available?', 'You can find fertilizers, micronutrients, bio-fertilizers and biostimulants for a variety of crops and growing needs.'], ['How do I choose the right fertilizer?', 'Consider the crop, growth stage, soil condition and nutrient requirement. A soil test and local agriculture expert can help guide the selection.'], ['Can crop nutrition products be used in gardens?', 'Yes, many products are suitable for vegetables, fruits, ornamental plants and home gardens when used according to the label.']],
      disclaimer: 'Disclaimer: Crop response depends on soil, climate, crop variety, dosage, timing, irrigation and farm management. Always follow the product label and seek local expert guidance when required.'
    },
    insecticidesPage: {
      back: 'Back', title: 'Insecticides', noProducts: 'No products found in this category.',
      sections: [
        { heading: 'Buy Insecticides Online in India', paragraphs: ['Protect crops from harmful insects and pests with effective insecticides from trusted agricultural brands. Find solutions for vegetables, fruits, field crops, gardens and commercial cultivation.', 'Select an insecticide according to the target pest, crop stage, application method and recommended waiting period.'] },
        { heading: 'Insecticide Solutions for Common Pests', items: [['Sucking Pest Control:', 'Manage aphids, whiteflies, thrips and other sap-sucking insects.'], ['Caterpillar Control:', 'Protect crops from caterpillars, bollworms and leaf-eating pests.'], ['Soil Insect Control:', 'Help manage termites, grubs and other soil pests.'], ['Bio Insecticides:', 'Choose botanical and microbial solutions for responsible crop protection.']] },
        { heading: 'Benefits of Quality Insecticides', items: ['Effective control of harmful insects', 'Healthier crops and improved yield potential', 'Options for vegetables, fruits, field crops and gardens', 'Products from trusted agricultural brands', 'Suitable solutions for different application methods'] },
        { heading: 'How to Select and Use Insecticides', paragraphs: ['Identify the pest correctly and choose a product recommended for your crop and target insect. Follow the label for dosage, dilution, spray interval, protective equipment and harvest waiting period.', 'Monitor fields regularly and use integrated pest management practices to support effective and responsible insect control.'] },
        { heading: 'Why Buy Insecticides from MarutiKrushiSevaKendra?', items: ['Wide range of insect control products', 'Trusted agricultural brands', 'Options for farmers, gardens and commercial growers', 'Convenient online ordering across India', 'Delivery to serviceable villages, towns and cities'] }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [['Which insects can insecticides control?', 'Products are available for aphids, whiteflies, thrips, caterpillars, bollworms, termites and several other crop pests.'], ['How should I use an insecticide safely?', 'Read the product label, use the recommended dosage and protective equipment, and follow the stated waiting period before harvest.'], ['Can insecticides be used on vegetables?', 'Yes, choose a product approved for the specific vegetable crop and target pest, and follow all label instructions.']],
      disclaimer: 'Disclaimer: Insecticide performance depends on the pest, crop, weather, dosage and application method. Always follow the product label and seek local expert guidance when required.'
    },
    fungicidesPage: {
      back: 'Back', title: 'Fungicides', noProducts: 'No products found in this category.',
      sections: [
        { heading: 'Buy Fungicides Online in India', paragraphs: ['Protect crops from fungal diseases with effective fungicides from trusted agricultural brands. Find solutions for vegetables, fruits, field crops, nurseries and gardens.', 'Choose products according to the crop, disease symptoms, application method and recommended waiting period.'] },
        { heading: 'Fungicide Solutions for Common Diseases', items: [['Systemic Fungicides:', 'Move within plant tissues to help protect against internal disease development.'], ['Contact Fungicides:', 'Form a protective layer on plant surfaces and help prevent infection.'], ['Bio-Fungicides:', 'Use beneficial microorganisms and biological solutions for responsible crop care.'], ['Seed Treatment:', 'Help protect seeds and seedlings from diseases during early growth.']] },
        { heading: 'Benefits of Quality Fungicides', items: ['Effective prevention and management of fungal diseases', 'Healthier plants and improved crop quality', 'Options for vegetables, fruits, field crops and gardens', 'Products from trusted agricultural brands', 'Suitable solutions for different application methods'] },
        { heading: 'How to Select and Use Fungicides', paragraphs: ['Identify the disease correctly and select a product recommended for your crop. Follow the label for dosage, dilution, spray interval, protective equipment and harvest waiting period.', 'Regular crop monitoring and timely application can help manage fungal diseases and reduce crop losses.'] },
        { heading: 'Why Buy Fungicides from MarutiKrushiSevaKendra?', items: ['Wide range of fungal disease control products', 'Trusted agricultural brands', 'Options for farmers, nurseries and gardens', 'Convenient online ordering across India', 'Delivery to serviceable villages, towns and cities'] }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [['Which diseases can fungicides control?', 'Fungicides are available for diseases such as blight, mildew, leaf spots, fruit rots and other fungal infections.'], ['How should I choose a fungicide?', 'Identify the crop and disease, then choose a product recommended for that use and follow the label instructions.'], ['Can fungicides be used on vegetables?', 'Yes, use a fungicide approved for the specific vegetable crop and disease, following the recommended dosage and waiting period.']],
      disclaimer: 'Disclaimer: Fungicide performance depends on the disease, crop, weather, dosage and application method. Always follow the product label and seek local expert guidance when required.'
    },
    herbicidesPage: {
      back: 'Back', title: 'Herbicides', noProducts: 'No products found in this category.',
      sections: [
        { heading: 'Buy Herbicides Online in India', paragraphs: ['Manage unwanted weeds and protect crop growth with effective herbicides from trusted agricultural brands. Find solutions for field crops, vegetables, orchards and gardens.', 'Choose products according to the crop, weed type, growth stage, application method and recommended waiting period.'] },
        { heading: 'Herbicide Solutions for Weed Control', items: [['Pre-Emergent Herbicides:', 'Help prevent weed germination before weeds become established.'], ['Post-Emergent Herbicides:', 'Control weeds that are already growing in the field.'], ['Selective Herbicides:', 'Target weeds while protecting recommended crops when used correctly.'], ['Non-Selective Herbicides:', 'Control a broad range of vegetation in suitable non-crop areas.']] },
        { heading: 'Benefits of Quality Herbicides', items: ['Effective weed control and management', 'Reduced competition for water, nutrients and sunlight', 'Healthier crop growth and improved yield potential', 'Options for different crops and weed types', 'Products from trusted agricultural brands'] },
        { heading: 'How to Select and Use Herbicides', paragraphs: ['Identify the weed and crop correctly before selecting a product. Follow the label for dosage, spray timing, weather conditions, protective equipment and crop safety instructions.', 'Timely application, field monitoring and integrated weed management can help reduce weed pressure and crop losses.'] },
        { heading: 'Why Buy Herbicides from MarutiKrushiSevaKendra?', items: ['Wide range of weed-control products', 'Trusted agricultural brands', 'Options for farmers, gardens and commercial growers', 'Convenient online ordering across India', 'Delivery to serviceable villages, towns and cities'] }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [['Which weeds can herbicides control?', 'Products are available for grassy weeds, broadleaf weeds and other common weeds affecting field crops and gardens.'], ['How should I choose a herbicide?', 'Consider the crop, weed type and growth stage, then select a product recommended for that use and follow the label.'], ['Can herbicides harm crops?', 'Some herbicides are selective and others are non-selective. Use only the product recommended for your crop and follow the dosage carefully.']],
      disclaimer: 'Disclaimer: Herbicide performance depends on the crop, weed, weather, dosage and application method. Always follow the product label and seek local expert guidance when required.'
    },
    bioInsecticidesPage: {
      back: 'Back', title: 'Bio Insecticides', noProducts: 'No products found in this category.',
      sections: [
        { heading: 'Buy Bio Insecticides Online in India', paragraphs: ['Protect crops with natural, biological and eco-friendly insect-control solutions from trusted agricultural brands. Bio insecticides can support responsible pest management in vegetables, fruits, field crops and gardens.', 'Choose a product according to the target pest, crop stage, application method and label recommendations.'] },
        { heading: 'Bio Insecticide Solutions', items: [['Neem-Based Products:', 'Plant-based solutions that help manage a range of common crop pests.'], ['Microbial Insecticides:', 'Beneficial microorganisms that target selected insect pests.'], ['Botanical Extracts:', 'Natural extracts used as part of an integrated crop protection program.'], ['Integrated Pest Management:', 'Combine monitoring, cultural practices and suitable biological products for responsible control.']] },
        { heading: 'Benefits of Bio Insecticides', items: ['Natural and eco-friendly crop protection options', 'Support for integrated pest management', 'Suitable choices for vegetables, fruits, field crops and gardens', 'Products from trusted agricultural brands', 'Options for growers seeking responsible pest control'] },
        { heading: 'How to Select and Use Bio Insecticides', paragraphs: ['Identify the target pest and choose a product recommended for your crop. Follow the label for dosage, mixing, application timing, storage and safety instructions.', 'Regular monitoring and timely application can improve results and help maintain a balanced farm ecosystem.'] },
        { heading: 'Why Buy Bio Insecticides from MarutiKrushiSevaKendra?', items: ['Wide range of biological pest-control products', 'Trusted agricultural brands', 'Options for farmers, gardens and organic growers', 'Convenient online ordering across India', 'Delivery to serviceable villages, towns and cities'] }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [['What are bio insecticides?', 'Bio insecticides are biological or plant-based products used to manage insect pests as part of responsible crop protection.'], ['Are bio insecticides suitable for vegetables?', 'Many products are suitable for vegetables when used according to the product label and recommended application method.'], ['How should bio insecticides be stored?', 'Store them in the original container in a cool, dry place away from direct sunlight and follow the label instructions.']],
      disclaimer: 'Disclaimer: Bio insecticide performance depends on the pest, crop, weather, product quality and application method. Always follow the product label and seek local expert guidance when required.'
    },
    farmingToolsPage: {
      back: 'Back', title: 'Tools & Equipment', noProducts: 'No products found in this category.',
      sections: [
        { heading: 'Buy Farming Tools and Equipment Online in India', paragraphs: ['Find reliable farming tools, sprayers, pumps and equipment from trusted agricultural brands. Choose practical solutions for farms, gardens, nurseries and landscaping work.', 'Select tools according to your crop, task, field size, power source, safety requirements and maintenance needs.'] },
        { heading: 'Farming Tools for Every Need', items: [['Hand Tools:', 'Spades, rakes, hoes, forks and other tools for everyday farm and garden work.'], ['Sprayers and Pumps:', 'Equipment for applying crop protection products, fertilizers and water.'], ['Power Weeders and Harvesters:', 'Machines that help reduce manual effort and improve farm efficiency.'], ['Safety Equipment:', 'Gloves and protective accessories for safer agricultural work.']] },
        { heading: 'Benefits of Quality Farming Tools', items: ['Improved work efficiency and productivity', 'Durable tools for regular farm and garden use', 'Suitable options for small farms, nurseries and commercial growers', 'Trusted equipment from recognised brands', 'Convenient choices for different agricultural tasks'] },
        { heading: 'How to Select the Right Farming Tool', paragraphs: ['Consider the task, field size, crop, soil, power source, tool capacity and ease of maintenance before purchasing. Use equipment according to the manufacturer instructions and follow appropriate safety practices.', 'Cleaning, storage and regular maintenance can improve tool life and performance.'] },
        { heading: 'Why Buy Farming Tools from MarutiKrushiSevaKendra?', items: ['Wide range of farm and garden tools', 'Trusted agricultural brands', 'Options for farmers, gardeners and nurseries', 'Convenient online ordering across India', 'Delivery to serviceable villages, towns and cities'] }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [['Which farming tools are available?', 'You can find hand tools, sprayers, pumps, power weeders, harvesters, gloves and other farm accessories.'], ['How do I choose the right tool?', 'Consider the task, crop, field size, capacity, power source and safety requirements before selecting equipment.'], ['Are these tools suitable for gardens?', 'Many hand tools, sprayers and accessories are suitable for home gardens, nurseries and small farms.']],
      disclaimer: 'Disclaimer: Tool performance depends on correct selection, use, maintenance and operating conditions. Always follow manufacturer instructions and use suitable safety equipment.'
    },
    plantsPage: {
      back: 'Back', title: 'Plants', noProducts: 'No products found in this category.',
      sections: [
        { heading: 'Buy Plants Online in India', paragraphs: ['Bring healthy fruit trees, ornamental plants, indoor greens and medicinal plants to your home, garden or farm. Explore quality saplings and plants from trusted growers.', 'Choose plants according to your climate, sunlight, soil, available space, watering routine and intended use.'] },
        { heading: 'Plants for Every Growing Space', items: [['Fruit Trees:', 'Mango, guava, lemon and other saplings for home gardens and farms.'], ['Ornamental Plants:', 'Decorative plants that add colour and beauty to gardens and landscapes.'], ['Indoor Plants:', 'Low-maintenance greens suitable for homes, offices and indoor spaces.'], ['Medicinal Plants:', 'Useful plants such as aloe vera, tulsi and neem for home gardens.']] },
        { heading: 'Benefits of Quality Plants', items: ['Healthy establishment and vigorous growth', 'Suitable options for gardens, farms, balconies and indoor spaces', 'Fruit, flowering, ornamental and medicinal varieties', 'Plants from trusted growers and nurseries', 'Convenient choices for home gardeners and farmers'] },
        { heading: 'How to Select and Care for Plants', paragraphs: ['Consider sunlight, soil, pot size, drainage, watering and local climate before selecting a plant. Follow suitable planting, fertilizing, pruning and pest-care practices.', 'Regular watering, proper sunlight and timely care can help plants remain healthy and grow well.'] },
        { heading: 'Why Buy Plants from MarutiKrushiSevaKendra?', items: ['Wide range of plants and saplings', 'Options for homes, gardens and farms', 'Plants from trusted growers', 'Convenient online ordering across India', 'Delivery to serviceable villages, towns and cities'] }
      ],
      faqTitle: 'Frequently Asked Questions',
      faq: [['Which plants are available?', 'You can find fruit trees, ornamental plants, indoor plants, medicinal plants and flowering varieties.'], ['How do I choose a plant?', 'Consider your climate, sunlight, soil, available space and watering routine before selecting a plant.'], ['Can plants be grown in pots?', 'Yes, many ornamental, indoor, medicinal and small fruit plants can be grown in suitable pots with proper drainage and care.']],
      disclaimer: 'Disclaimer: Plant growth depends on plant health, climate, soil, sunlight, watering and care. Follow suitable growing guidance and seek local expert advice when required.'
    },
    vegetableSeedsPage: {
      back: 'मागे', title: 'भाजीपाला बियाणे', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      sections: [
        {
          heading: 'भारतात ऑनलाइन भाजीपाला बियाणे खरेदी करा',
          paragraphs: [
            'योग्य बियाण्यांसह ताज्या, निरोगी आणि उच्च दर्जाच्या भाज्या पिकवा. किसानशॉपवर व्यावसायिक शेती, परसबाग, गच्चीवरील बाग आणि घरगुती लागवडीसाठी ऑनलाइन भाजीपाला बियाणे खरेदी करा. विश्वासार्ह कृषी ब्रँडकडून संकरित, सुधारित आणि मुक्त परागीभवन बियाण्यांची विस्तृत निवड पहा.',
            'आमच्या भाजीपाला बियाणे संग्रहात भारतातील विविध हंगाम, मातीची परिस्थिती आणि वाढीच्या प्रदेशांसाठी योग्य लोकप्रिय पिके आहेत. शेतकरी उपलब्ध वाणांची तुलना करून पिकाचा कालावधी, उत्पादन क्षमता, फळांची गुणवत्ता, रोग सहनशीलता आणि स्थानिक हवामानानुसार बियाणे निवडू शकतात.'
          ]
        },
        {
          heading: 'पिकानुसार भाजीपाला बियाणे खरेदी करा',
          paragraphs: ['टोमॅटो, मिरची, वांगी, भेंडी, कांदा, कोबी, फुलकोबी, काकडी, दुधी भोपळा, कारले, दोडका, घोसाळे, भोपळा, कलिंगड, खरबूज, गाजर, मुळा, बीट, कोथिंबीर, पालक, वाटाणा, बीन्स आणि इतर अनेक भाज्यांसाठी बियाणे निवडा.']
        },
        {
          heading: 'प्रत्येक लागवडीच्या गरजेसाठी भाजीपाला बियाणे',
          items: [
            ['संकरित भाजीपाला बियाणे:', 'एकसमान वाढ, चांगल्या दर्जाचे उत्पादन आणि अधिक उत्पादन क्षमतेसाठी निवडलेले.'],
            ['मुक्त परागीभवन बियाणे:', 'पारंपरिक आणि नैसर्गिकरित्या परागीभवन झालेल्या वाणांसाठी योग्य.'],
            ['व्यावसायिक शेतीची बियाणे:', 'मोठ्या लागवड क्षेत्रासाठी आणि बाजाराभिमुख भाजीपाला उत्पादनासाठी योग्य वाण.'],
            ['परसबागेची बियाणे:', 'घरात, गच्चीवर किंवा छोट्या बागेत भाजीपाला पिकवण्यासाठी सोयीस्कर पर्याय.'],
            ['हंगामी भाजीपाला बियाणे:', 'स्थानिक परिस्थितीनुसार खरीप, रब्बी, उन्हाळी आणि वर्षभराच्या लागवडीसाठी उपलब्ध वाण.']
          ]
        },
        {
          heading: 'दर्जेदार भाजीपाला बियाणे निवडण्याचे फायदे',
          items: ['चांगली उगवण आणि निरोगी पिकाची स्थापना', 'एकसमान रोपांची वाढ आणि उत्पादन विकास', 'अधिक उत्पादन आणि बाजारपेठेस योग्य गुणवत्तेचे पीक', 'विविध प्रदेश आणि हंगामांसाठी योग्य वाणांची उपलब्धता', 'इच्छित रंग, आकार, चव आणि टिकवण क्षमतेचे पर्याय', 'निकृष्ट किंवा अनोळखी बियाण्यांशी संबंधित धोका कमी']
        },
        {
          heading: 'योग्य भाजीपाला बियाणे कसे निवडावे',
          paragraphs: [
            'भाजीपाला बियाणे खरेदी करण्यापूर्वी शिफारस केलेला पेरणीचा हंगाम, हवामान, मातीचा प्रकार, सिंचनाची उपलब्धता, पिकाचा कालावधी आणि लागवडीची पद्धत लक्षात घ्या. उगवण, रोपाची ठेवण, परिपक्वता कालावधी, अपेक्षित उत्पादन, उत्पादन गुणवत्ता, रोग सहनशीलता आणि स्थानिक बाजारपेठेची मागणी यांसारखी वाणाची वैशिष्ट्येही तपासा.',
            'पेरणीपूर्वी उत्पादनाचे वर्णन आणि बियाणे पाकिटावरील लेबल काळजीपूर्वक वाचा. पिक, वाण, ठिकाण आणि वाढीच्या परिस्थितीनुसार बियाण्याचे प्रमाण, अंतर आणि लागवड पद्धती बदलू शकतात.'
          ]
        },
        {
          heading: 'किसानशॉपकडून भाजीपाला बियाणे का खरेदी करावे?',
          items: ['विविध भाजीपाला पिके आणि वाणांची विस्तृत श्रेणी', 'विश्वासार्ह आणि मान्यताप्राप्त कृषी ब्रँडकडून बियाणे', 'शेतकरी आणि घरगुती बागकामासाठी योग्य पर्याय', 'भारताच्या कोणत्याही भागातून सोपी ऑनलाइन ऑर्डर', 'सेवाक्षम ठिकाणांमधील गावे, शहरे आणि नगरांमध्ये वितरण', 'उपलब्धतेनुसार विविध पॅक आकार आणि किमतीचे पर्याय', 'पात्र ऑर्डर्सवर कॅश ऑन डिलिव्हरी उपलब्ध']
        },
        {
          heading: 'भाजीपाला बियाणे ऑनलाइन ऑर्डर करा',
          paragraphs: ['तुमचे पीक, हंगाम आणि शेतीच्या गरजेनुसार संग्रह पहा आणि भाजीपाला बियाणे ऑनलाइन ऑर्डर करा. व्यावसायिक लागवडीसाठी टोमॅटो बियाणे, उच्च दर्जाच्या उत्पादनासाठी मिरची बियाणे, हंगामी शेतीसाठी वेलवर्गीय बियाणे किंवा परसबागेसाठी मिश्र भाजीपाला बियाणे हवे असल्यास किसानशॉप तुम्हाला योग्य पर्याय एकाच ठिकाणी शोधण्यात मदत करते.']
        }
      ],
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
      faq: [
        ['ऑनलाइन कोणती भाजीपाला बियाणे उपलब्ध आहेत?', 'टोमॅटो, मिरची, वांगी, भेंडी, कांदा, काकडी, कोबी, फुलकोबी, वेलवर्गीय भाज्या, पालेभाज्या, मुळभाज्या, बीन्स, वाटाणा, खरबूज आणि इतर अनेक पिकांची बियाणे तुम्ही खरेदी करू शकता.'],
        ['ही बियाणे व्यावसायिक शेतीसाठी योग्य आहेत का?', 'अनेक वाण व्यावसायिक लागवडीसाठी आहेत, तर काही परसबागा आणि छोट्या लागवड क्षेत्रासाठीही योग्य आहेत. खरेदीपूर्वी प्रत्येक उत्पादनाचे तपशील तपासा.'],
        ['भाजीपाला बियाण्याचा वाण कसा निवडावा?', 'तुमचे ठिकाण, पेरणीचा हंगाम, पिकाचा कालावधी, लागवड पद्धत, रोगाची परिस्थिती आणि स्थानिक बाजारपेठेच्या गरजेनुसार वाण निवडा. बियाणे पाकिटावर दिलेल्या उत्पादकाच्या सूचनांचे पालन करा.'],
        ['भाजीपाला बियाणे गावांमध्ये वितरित करता येतात का?', 'किसानशॉप भारतातील अनेक सेवाक्षम गाव, शहर आणि नगरांच्या पिन कोडवर वितरण करते. गंतव्य पिन कोड वापरून वितरणाची उपलब्धता तपासता येते.'],
        ['किसानशॉप कॅश ऑन डिलिव्हरी देते का?', 'पात्र उत्पादने आणि सेवाक्षम पिन कोडसाठी कॅश ऑन डिलिव्हरी उपलब्ध असू शकते. उपलब्ध पेमेंट पर्याय चेकआउटवेळी दाखवले जातात.']
      ],
      disclaimer: 'सूचना: बियाण्यांची उगवण आणि पिकाची कामगिरी बियाण्यांच्या गुणवत्तेसोबतच माती, हवामान, सिंचन, पेरणी पद्धती, साठवण परिस्थिती आणि पीक व्यवस्थापनावर अवलंबून असते. उत्पादनाच्या लेबलवर दिलेल्या सूचनांचे नेहमी पालन करा आणि आवश्यक असल्यास स्थानिक कृषी तज्ज्ञांचा सल्ला घ्या.'
    },
    cropProtectionPage: {
      back: 'मागे', title: 'पीक संरक्षण', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      sections: [
        { heading: 'भारतात ऑनलाइन पीक संरक्षण उत्पादने खरेदी करा', paragraphs: ['विश्वासार्ह कृषी ब्रँडकडील पीक संरक्षण उत्पादनांसह तुमच्या पिकांचे कीटक, बुरशीजन्य रोग आणि तणांपासून संरक्षण करा. शेती, बागा आणि व्यावसायिक लागवडीसाठी कीटकनाशके, बुरशीनाशके, तणनाशके आणि जैविक उपाय पहा.', 'तुमचे पीक, कीड किंवा रोग, वापरण्याची पद्धत आणि स्थानिक वाढीच्या परिस्थितीनुसार उत्पादने निवडा. उत्पादनाच्या लेबलवरील सूचना आणि शिफारस केलेले प्रमाण नेहमी पाळा.'] },
        { heading: 'प्रत्येक गरजेसाठी पीक संरक्षण उपाय', items: [['कीटकनाशके:', 'मावा, पांढरी माशी, अळी आणि रसशोषक किडींसारख्या हानिकारक कीटकांचे नियंत्रण.'], ['बुरशीनाशके:', 'पाने, खोड, मुळे आणि फळांवर परिणाम करणाऱ्या बुरशीजन्य रोगांपासून संरक्षण आणि व्यवस्थापन.'], ['तणनाशके:', 'अनावश्यक तणांचे व्यवस्थापन करून पाणी आणि अन्नद्रव्यांसाठीची स्पर्धा कमी करणे.'], ['जैविक संरक्षण उत्पादने:', 'जबाबदार पीक संगोपनासाठी पर्यावरणपूरक जैविक आणि सूक्ष्मजीवांवर आधारित उपाय.']] },
        { heading: 'दर्जेदार पीक संरक्षण उत्पादने निवडण्याचे फायदे', items: ['कीटक, रोग आणि तणांपासून चांगले संरक्षण', 'निरोगी पिकांची वाढ आणि अधिक उत्पादन क्षमता', 'विश्वासार्ह आणि मान्यताप्राप्त कृषी ब्रँडकडील उत्पादने', 'विविध पिके, किडी, रोग आणि वापर पद्धतींसाठी पर्याय', 'शेतकरी, बागा आणि व्यावसायिक लागवडीसाठी योग्य उपाय'] },
        { heading: 'योग्य पीक संरक्षण उत्पादन कसे निवडावे', paragraphs: ['उत्पादन निवडण्यापूर्वी पिकाची समस्या योग्यरीत्या ओळखा. कीड किंवा रोग, पिकाची अवस्था, हवामान, वापराची साधने, शिफारस केलेले प्रमाण आणि प्रतीक्षा कालावधी लक्षात घ्या. उत्तम परिणामांसाठी उत्पादनाचे लेबल काळजीपूर्वक वाचा आणि सुरक्षित वापराच्या सूचनांचे पालन करा.', 'एकात्मिक पीक व्यवस्थापन, शेताचे निरीक्षण आणि योग्य वेळी केलेला वापर पीक नुकसान कमी करून शाश्वत शेतीस मदत करू शकतो.'] },
        { heading: 'किसानशॉपकडून पीक संरक्षण उत्पादने का खरेदी करावी?', items: ['पीक संरक्षण उत्पादनांची विस्तृत श्रेणी', 'विश्वासार्ह कृषी ब्रँडकडील उत्पादने', 'शेतपिके, भाज्या, फळे आणि बागांसाठी पर्याय', 'भारताच्या कोणत्याही भागातून सोपी ऑनलाइन ऑर्डर', 'सेवाक्षम गाव, शहर आणि नगरांमध्ये वितरण', 'योग्य कृषी निविष्ठा निवडण्यासाठी सहाय्य'] }
      ],
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
      faq: [['कोणती पीक संरक्षण उत्पादने उपलब्ध आहेत?', 'विविध पिके आणि शेतीच्या गरजांसाठी कीटकनाशके, बुरशीनाशके, तणनाशके आणि जैविक पीक संरक्षण उत्पादने उपलब्ध आहेत.'], ['योग्य उत्पादन कसे निवडावे?', 'पीक, कीड किंवा रोग आणि पिकाची अवस्था ओळखून उत्पादनाचे लेबल आणि शिफारस केलेले प्रमाण पाळा. आवश्यक असल्यास स्थानिक कृषी तज्ज्ञांचा सल्ला घ्या.'], ['पीक संरक्षण उत्पादने वापरणे सुरक्षित आहे का?', 'उत्पादनाचा वापर फक्त लेबलवरील सूचनांनुसार करा. शिफारस केलेले प्रमाण, सुरक्षा उपाय, प्रतीक्षा कालावधी आणि साठवण सूचनांचे पालन करा.']],
      disclaimer: 'सूचना: पीक संरक्षणाचे परिणाम पीक, कीड किंवा रोग, हवामान, वापराची पद्धत आणि पीक व्यवस्थापनावर अवलंबून असतात. उत्पादनाचे लेबल नेहमी वाचा आणि आवश्यक असल्यास पात्र स्थानिक कृषी तज्ज्ञांचा सल्ला घ्या.'
    },
    flowerSeedsPage: {
      back: 'मागे', title: 'फुलांची बियाणे', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      sections: [
        { heading: 'भारतात ऑनलाइन फुलांची बियाणे खरेदी करा', paragraphs: ['विश्वासार्ह कृषी ब्रँडकडील दर्जेदार बियाण्यांसह रंगीबेरंगी, निरोगी आणि सुंदर फुले पिकवा. बागा, बाल्कनी, गच्ची, रोपवाटिका आणि लँडस्केपिंगसाठी वार्षिक, बारमाही आणि हंगामी फुलांची बियाणे पहा.', 'तुमचे हवामान, लागवडीची जागा, हंगाम, सूर्यप्रकाश आणि पसंतीचा फुलांचा रंग किंवा आकार यानुसार वाण निवडा.'] },
        { heading: 'लोकप्रिय फुलांची बियाणे', paragraphs: ['घरगुती बागा आणि व्यावसायिक फुलशेतीसाठी झेंडू, झिनिया, गुलाब, पेटुनिया, सूर्यफूल, डेलिया, लॅव्हेंडर, कॉसमॉस, डायन्थस आणि रानफुलांच्या वाणांची निवड करा.'] },
        { heading: 'दर्जेदार फुलांच्या बियाण्यांचे फायदे', items: ['चांगली उगवण आणि निरोगी रोपांची वाढ', 'तेजस्वी आणि एकसमान फुलोरा', 'विविध हंगाम आणि लागवडीच्या जागांसाठी वाण', 'बागा, कुंड्या, बाल्कनी आणि लँडस्केपिंगसाठी योग्य पर्याय', 'घरगुती बागकाम, रोपवाटिका आणि उत्पादकांसाठी विश्वासार्ह बियाणे'] },
        { heading: 'योग्य फुलांची बियाणे कशी निवडावी', paragraphs: ['वाण निवडण्यापूर्वी शिफारस केलेला पेरणीचा हंगाम, सूर्यप्रकाश, माती, पाण्याची गरज, रोपाची उंची, फुलण्याचा कालावधी आणि उपलब्ध जागा लक्षात घ्या. पेरणीची खोली, अंतर आणि काळजीसाठी बियाणे पाकिटावरील सूचना पाळा.'] },
        { heading: 'किसानशॉपकडून फुलांची बियाणे का खरेदी करावी?', items: ['रंगीबेरंगी फुलांच्या वाणांची विस्तृत निवड', 'विश्वासार्ह कृषी ब्रँडकडील बियाणे', 'घरगुती बागा आणि व्यावसायिक उत्पादकांसाठी पर्याय', 'संपूर्ण भारतात सोपी ऑनलाइन ऑर्डर', 'सेवाक्षम गाव, शहर आणि नगरांमध्ये वितरण'] }
      ],
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
      faq: [['कोणती फुलांची बियाणे उपलब्ध आहेत?', 'झेंडू, झिनिया, गुलाब, पेटुनिया, सूर्यफूल, डेलिया, लॅव्हेंडर, कॉसमॉस आणि इतर हंगामी फुलांची बियाणे उपलब्ध आहेत.'], ['फुलांची बियाणे कधी पेरावी?', 'पेरणीची योग्य वेळ फुलांच्या वाणावर, स्थानिक हवामानावर आणि हंगामावर अवलंबून असते. विशिष्ट मार्गदर्शनासाठी उत्पादनाचे लेबल तपासा.'], ['फुलांची बियाणे कुंड्यांमध्ये लावता येतात का?', 'होय, योग्य सूर्यप्रकाश आणि काळजी दिल्यास अनेक फुलांची वाणे कुंड्या, कंटेनर, बाल्कनी आणि गच्चीवरील बागेत वाढवता येतात.']],
      disclaimer: 'सूचना: उगवण आणि फुलोरा बियाण्यांची गुणवत्ता, हवामान, माती, सूर्यप्रकाश, पाणी आणि रोपांच्या काळजीवर अवलंबून असतो. उत्पादनाच्या लेबलवरील सूचनांचे नेहमी पालन करा.'
    },
    cropNutritionPage: {
      back: 'मागे', title: 'पीक पोषण', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      sections: [
        { heading: 'भारतात ऑनलाइन पीक पोषण उत्पादने खरेदी करा', paragraphs: ['विश्वासार्ह कृषी ब्रँडकडील दर्जेदार खते, सूक्ष्म अन्नद्रव्ये, जैविक खते आणि जैव उत्तेजकांसह निरोगी पिके आणि अधिक उत्पादनाला मदत करा.', 'तुमचे पीक, मातीची स्थिती, वाढीची अवस्था, सिंचन पद्धत आणि अन्नद्रव्यांच्या गरजेनुसार पीक पोषण उत्पादने निवडा.'] },
        { heading: 'प्रत्येक गरजेसाठी पीक पोषण उत्पादने', items: [['खते:', 'पिकांच्या वाढीसाठी नायट्रोजन, फॉस्फरस आणि पोटॅशियमसारखी आवश्यक अन्नद्रव्ये पुरवतात.'], ['सूक्ष्म अन्नद्रव्ये:', 'जस्त, बोरॉन, लोह, कॅल्शियम आणि कमी प्रमाणात आवश्यक असलेली इतर अन्नद्रव्ये पुरवतात.'], ['जैविक खते:', 'मातीचे आरोग्य आणि अन्नद्रव्यांची उपलब्धता वाढवण्यासाठी उपयुक्त सूक्ष्मजीवांचा वापर करतात.'], ['जैव उत्तेजक:', 'रोपांची कामगिरी, ताण सहनशीलता आणि पिकाच्या विकासाला मदत करतात.']] },
        { heading: 'दर्जेदार पीक पोषणाचे फायदे', items: ['मुळांची आणि रोपांची निरोगी वाढ', 'चांगला फुलोरा, फळधारणा आणि पिकाची गुणवत्ता', 'अन्नद्रव्यांची उपलब्धता आणि मातीचे आरोग्य सुधारते', 'शेतपिके, भाज्या, फळे आणि बागांसाठी योग्य पर्याय', 'विश्वासार्ह कृषी ब्रँडकडील उत्पादने'] },
        { heading: 'योग्य पीक पोषण उत्पादन कसे निवडावे', paragraphs: ['उत्पादन निवडण्यापूर्वी माती परीक्षणाचे निष्कर्ष, पिकाची अवस्था, अन्नद्रव्यांची कमतरता, वापराची पद्धत आणि शिफारस केलेले प्रमाण लक्षात घ्या. मिश्रण, वेळ आणि सुरक्षित वापरासाठी लेबलवरील सूचनांचे पालन करा.', 'संतुलित पोषण, पिकांचे नियमित निरीक्षण आणि योग्य सिंचनामुळे पिकांची वाढ आणि उत्पादन क्षमता सुधारण्यास मदत होते.'] },
        { heading: 'किसानशॉपकडून पीक पोषण उत्पादने का खरेदी करावी?', items: ['खते आणि पीक पोषण निविष्ठांची विस्तृत श्रेणी', 'विविध पिके आणि वाढीच्या परिस्थितीसाठी पर्याय', 'संपूर्ण भारतात सोपी ऑनलाइन ऑर्डर', 'सेवाक्षम गाव, शहर आणि नगरांमध्ये वितरण', 'योग्य कृषी निविष्ठा निवडण्यासाठी सहाय्य'] }
      ],
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
      faq: [['कोणती पीक पोषण उत्पादने उपलब्ध आहेत?', 'विविध पिके आणि वाढीच्या गरजांसाठी खते, सूक्ष्म अन्नद्रव्ये, जैविक खते आणि जैव उत्तेजक उपलब्ध आहेत.'], ['योग्य खत कसे निवडावे?', 'पीक, वाढीची अवस्था, मातीची स्थिती आणि अन्नद्रव्यांची गरज लक्षात घ्या. माती परीक्षण आणि स्थानिक कृषी तज्ज्ञ निवडीत मदत करू शकतात.'], ['पीक पोषण उत्पादने बागांमध्ये वापरता येतात का?', 'होय, लेबलनुसार वापरल्यास अनेक उत्पादने भाज्या, फळे, शोभेची झाडे आणि घरगुती बागांसाठी योग्य आहेत.']],
      disclaimer: 'सूचना: पिकांचा प्रतिसाद माती, हवामान, पिकाचा वाण, प्रमाण, वेळ, सिंचन आणि शेती व्यवस्थापनावर अवलंबून असतो. उत्पादनाच्या लेबलचे नेहमी पालन करा आणि आवश्यक असल्यास स्थानिक तज्ज्ञांचा सल्ला घ्या.'
    },
    insecticidesPage: {
      back: 'मागे', title: 'कीटकनाशके', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      sections: [
        { heading: 'भारतात ऑनलाइन कीटकनाशके खरेदी करा', paragraphs: ['विश्वासार्ह कृषी ब्रँडकडील प्रभावी कीटकनाशकांसह पिकांचे हानिकारक कीटकांपासून संरक्षण करा. भाज्या, फळे, शेतपिके, बागा आणि व्यावसायिक लागवडीसाठी उपाय पहा.', 'लक्ष्य कीड, पिकाची अवस्था, वापरण्याची पद्धत आणि शिफारस केलेला प्रतीक्षा कालावधी यानुसार कीटकनाशक निवडा.'] },
        { heading: 'सामान्य किडींसाठी कीटकनाशक उपाय', items: [['रसशोषक किडींचे नियंत्रण:', 'मावा, पांढरी माशी, तुडतुडे आणि इतर रसशोषक किडींचे व्यवस्थापन.'], ['अळी नियंत्रण:', 'अळी, बोंडअळी आणि पाने खाणाऱ्या किडींपासून पिकांचे संरक्षण.'], ['मातीतील किडींचे नियंत्रण:', 'वाळवी, अळी आणि इतर मातीतील किडींच्या व्यवस्थापनास मदत.'], ['जैविक कीटकनाशके:', 'जबाबदार पीक संरक्षणासाठी वनस्पतीजन्य आणि सूक्ष्मजीवांवर आधारित उपाय.']] },
        { heading: 'दर्जेदार कीटकनाशकांचे फायदे', items: ['हानिकारक किडींचे प्रभावी नियंत्रण', 'निरोगी पिके आणि अधिक उत्पादन क्षमता', 'भाज्या, फळे, शेतपिके आणि बागांसाठी पर्याय', 'विश्वासार्ह कृषी ब्रँडकडील उत्पादने', 'विविध वापर पद्धतींसाठी योग्य उपाय'] },
        { heading: 'कीटकनाशके कशी निवडावी आणि वापरावी', paragraphs: ['कीड योग्यरीत्या ओळखून तुमच्या पिकासाठी आणि लक्ष्य किडीसाठी शिफारस केलेले उत्पादन निवडा. प्रमाण, पाण्यात मिसळण्याचे प्रमाण, फवारणीचे अंतर, सुरक्षा साधने आणि कापणीपूर्व प्रतीक्षा कालावधीसाठी लेबलवरील सूचना पाळा.', 'शेताचे नियमित निरीक्षण करा आणि प्रभावी व जबाबदार कीड नियंत्रणासाठी एकात्मिक कीड व्यवस्थापन पद्धती वापरा.'] },
        { heading: 'किसानशॉपकडून कीटकनाशके का खरेदी करावी?', items: ['कीड नियंत्रण उत्पादनांची विस्तृत श्रेणी', 'विश्वासार्ह कृषी ब्रँड', 'शेतकरी, बागा आणि व्यावसायिक उत्पादकांसाठी पर्याय', 'संपूर्ण भारतात सोपी ऑनलाइन ऑर्डर', 'सेवाक्षम गाव, शहर आणि नगरांमध्ये वितरण'] }
      ],
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
      faq: [['कीटकनाशके कोणत्या किडींवर नियंत्रण ठेवतात?', 'मावा, पांढरी माशी, तुडतुडे, अळी, बोंडअळी, वाळवी आणि इतर अनेक किडींसाठी उत्पादने उपलब्ध आहेत.'], ['कीटकनाशक सुरक्षितपणे कसे वापरावे?', 'उत्पादनाचे लेबल वाचा, शिफारस केलेले प्रमाण आणि सुरक्षा साधने वापरा आणि कापणीपूर्वी दिलेल्या प्रतीक्षा कालावधीचे पालन करा.'], ['कीटकनाशके भाज्यांवर वापरता येतात का?', 'होय, विशिष्ट भाजीपाला पीक आणि लक्ष्य किडीसाठी मान्यताप्राप्त उत्पादन निवडा आणि लेबलवरील सर्व सूचनांचे पालन करा.']],
      disclaimer: 'सूचना: कीटकनाशकाचा परिणाम कीड, पीक, हवामान, प्रमाण आणि वापराच्या पद्धतीवर अवलंबून असतो. उत्पादनाच्या लेबलचे नेहमी पालन करा आणि आवश्यक असल्यास स्थानिक तज्ज्ञांचा सल्ला घ्या.'
    },
    fungicidesPage: {
      back: 'मागे', title: 'बुरशीनाशके', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      sections: [
        { heading: 'भारतात ऑनलाइन बुरशीनाशके खरेदी करा', paragraphs: ['विश्वासार्ह कृषी ब्रँडकडील प्रभावी बुरशीनाशकांसह पिकांचे बुरशीजन्य रोगांपासून संरक्षण करा. भाज्या, फळे, शेतपिके, रोपवाटिका आणि बागांसाठी उपाय पहा.', 'पीक, रोगाची लक्षणे, वापरण्याची पद्धत आणि शिफारस केलेला प्रतीक्षा कालावधी यानुसार उत्पादने निवडा.'] },
        { heading: 'सामान्य रोगांसाठी बुरशीनाशक उपाय', items: [['प्रणालीगत बुरशीनाशके:', 'वनस्पतीच्या ऊतींमध्ये फिरून अंतर्गत रोगांच्या विकासापासून संरक्षण करण्यास मदत करतात.'], ['संपर्क बुरशीनाशके:', 'वनस्पतीच्या पृष्ठभागावर संरक्षणात्मक थर तयार करून संसर्ग रोखण्यास मदत करतात.'], ['जैविक बुरशीनाशके:', 'जबाबदार पीक संगोपनासाठी उपयुक्त सूक्ष्मजीव आणि जैविक उपाय वापरतात.'], ['बियाणे प्रक्रिया:', 'सुरुवातीच्या वाढीदरम्यान बियाणे आणि रोपांचे रोगांपासून संरक्षण करण्यास मदत करते.']] },
        { heading: 'दर्जेदार बुरशीनाशकांचे फायदे', items: ['बुरशीजन्य रोगांचे प्रभावी प्रतिबंध आणि व्यवस्थापन', 'निरोगी रोपे आणि पिकाची सुधारित गुणवत्ता', 'भाज्या, फळे, शेतपिके आणि बागांसाठी पर्याय', 'विश्वासार्ह कृषी ब्रँडकडील उत्पादने', 'विविध वापर पद्धतींसाठी योग्य उपाय'] },
        { heading: 'बुरशीनाशके कशी निवडावी आणि वापरावी', paragraphs: ['रोग योग्यरीत्या ओळखून तुमच्या पिकासाठी शिफारस केलेले उत्पादन निवडा. प्रमाण, पाण्यात मिसळण्याचे प्रमाण, फवारणीचे अंतर, सुरक्षा साधने आणि कापणीपूर्व प्रतीक्षा कालावधीसाठी लेबलवरील सूचना पाळा.', 'पिकांचे नियमित निरीक्षण आणि योग्य वेळी वापर केल्याने बुरशीजन्य रोगांचे व्यवस्थापन करून पीक नुकसान कमी करता येते.'] },
        { heading: 'किसानशॉपकडून बुरशीनाशके का खरेदी करावी?', items: ['बुरशीजन्य रोग नियंत्रण उत्पादनांची विस्तृत श्रेणी', 'विश्वासार्ह कृषी ब्रँड', 'शेतकरी, रोपवाटिका आणि बागांसाठी पर्याय', 'संपूर्ण भारतात सोपी ऑनलाइन ऑर्डर', 'सेवाक्षम गाव, शहर आणि नगरांमध्ये वितरण'] }
      ],
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
      faq: [['बुरशीनाशके कोणत्या रोगांवर नियंत्रण ठेवतात?', 'बुरशीनाशके करपा, भुरी, पानावरील डाग, फळकूज आणि इतर बुरशीजन्य संसर्गांसाठी उपलब्ध आहेत.'], ['बुरशीनाशक कसे निवडावे?', 'पीक आणि रोग ओळखून त्या वापरासाठी शिफारस केलेले उत्पादन निवडा आणि लेबलवरील सूचनांचे पालन करा.'], ['बुरशीनाशके भाज्यांवर वापरता येतात का?', 'होय, विशिष्ट भाजीपाला पीक आणि रोगासाठी मान्यताप्राप्त बुरशीनाशक वापरा आणि शिफारस केलेले प्रमाण व प्रतीक्षा कालावधी पाळा.']],
      disclaimer: 'सूचना: बुरशीनाशकाचा परिणाम रोग, पीक, हवामान, प्रमाण आणि वापराच्या पद्धतीवर अवलंबून असतो. उत्पादनाच्या लेबलचे नेहमी पालन करा आणि आवश्यक असल्यास स्थानिक तज्ज्ञांचा सल्ला घ्या.'
    },
    herbicidesPage: {
      back: 'मागे', title: 'तणनाशके', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      sections: [
        { heading: 'भारतात ऑनलाइन तणनाशके खरेदी करा', paragraphs: ['विश्वासार्ह कृषी ब्रँडकडील प्रभावी तणनाशकांसह अनावश्यक तणांचे व्यवस्थापन करून पिकांच्या वाढीचे संरक्षण करा. शेतपिके, भाज्या, फळबागा आणि बागांसाठी उपाय पहा.', 'पीक, तणाचा प्रकार, वाढीची अवस्था, वापरण्याची पद्धत आणि शिफारस केलेला प्रतीक्षा कालावधी यानुसार उत्पादने निवडा.'] },
        { heading: 'तण नियंत्रणासाठी तणनाशक उपाय', items: [['उगवणीपूर्व तणनाशके:', 'तणांची उगवण होण्यापूर्वी त्यांना स्थिरावण्यापासून रोखण्यास मदत करतात.'], ['उगवणीनंतरची तणनाशके:', 'शेतात आधीच वाढलेल्या तणांवर नियंत्रण ठेवतात.'], ['निवडक तणनाशके:', 'योग्य वापरल्यास शिफारस केलेल्या पिकांचे संरक्षण करून तणांवर परिणाम करतात.'], ['सर्वसमावेशक तणनाशके:', 'योग्य बिगर-पीक क्षेत्रात विविध वनस्पतींवर नियंत्रण ठेवतात.']] },
        { heading: 'दर्जेदार तणनाशकांचे फायदे', items: ['तणांचे प्रभावी नियंत्रण आणि व्यवस्थापन', 'पाणी, अन्नद्रव्ये आणि सूर्यप्रकाशासाठीची स्पर्धा कमी', 'निरोगी पिकांची वाढ आणि अधिक उत्पादन क्षमता', 'विविध पिके आणि तणांच्या प्रकारांसाठी पर्याय', 'विश्वासार्ह कृषी ब्रँडकडील उत्पादने'] },
        { heading: 'तणनाशके कशी निवडावी आणि वापरावी', paragraphs: ['उत्पादन निवडण्यापूर्वी तण आणि पीक योग्यरीत्या ओळखा. प्रमाण, फवारणीची वेळ, हवामान, सुरक्षा साधने आणि पीक संरक्षणाच्या सूचनांसाठी लेबलचे पालन करा.', 'योग्य वेळी वापर, शेताचे निरीक्षण आणि एकात्मिक तण व्यवस्थापनामुळे तणांचा प्रादुर्भाव आणि पीक नुकसान कमी करता येते.'] },
        { heading: 'किसानशॉपकडून तणनाशके का खरेदी करावी?', items: ['तण नियंत्रण उत्पादनांची विस्तृत श्रेणी', 'विश्वासार्ह कृषी ब्रँड', 'शेतकरी, बागा आणि व्यावसायिक उत्पादकांसाठी पर्याय', 'संपूर्ण भारतात सोपी ऑनलाइन ऑर्डर', 'सेवाक्षम गाव, शहर आणि नगरांमध्ये वितरण'] }
      ],
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
      faq: [['तणनाशके कोणत्या तणांवर नियंत्रण ठेवतात?', 'शेतपिके आणि बागांवर परिणाम करणाऱ्या गवतवर्गीय, रुंद पानांच्या आणि इतर सामान्य तणांसाठी उत्पादने उपलब्ध आहेत.'], ['तणनाशक कसे निवडावे?', 'पीक, तणाचा प्रकार आणि वाढीची अवस्था लक्षात घेऊन त्या वापरासाठी शिफारस केलेले उत्पादन निवडा आणि लेबलचे पालन करा.'], ['तणनाशकांमुळे पिकांना नुकसान होऊ शकते का?', 'काही तणनाशके निवडक तर काही सर्वसमावेशक असतात. तुमच्या पिकासाठी शिफारस केलेले उत्पादनच वापरा आणि प्रमाण काळजीपूर्वक पाळा.']],
      disclaimer: 'सूचना: तणनाशकाचा परिणाम पीक, तण, हवामान, प्रमाण आणि वापराच्या पद्धतीवर अवलंबून असतो. उत्पादनाच्या लेबलचे नेहमी पालन करा आणि आवश्यक असल्यास स्थानिक तज्ज्ञांचा सल्ला घ्या.'
    },
    bioInsecticidesPage: {
      back: 'मागे', title: 'जैविक कीटकनाशके', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      sections: [
        { heading: 'भारतात ऑनलाइन जैविक कीटकनाशके खरेदी करा', paragraphs: ['विश्वासार्ह कृषी ब्रँडकडील नैसर्गिक, जैविक आणि पर्यावरणपूरक कीड नियंत्रण उपायांसह पिकांचे संरक्षण करा. जैविक कीटकनाशके भाज्या, फळे, शेतपिके आणि बागांमध्ये जबाबदार कीड व्यवस्थापनास मदत करू शकतात.', 'लक्ष्य कीड, पिकाची अवस्था, वापरण्याची पद्धत आणि लेबलवरील शिफारसीनुसार उत्पादन निवडा.'] },
        { heading: 'जैविक कीटकनाशक उपाय', items: [['कडुनिंबावर आधारित उत्पादने:', 'विविध सामान्य किडींच्या व्यवस्थापनासाठी वनस्पतीजन्य उपाय.'], ['सूक्ष्मजीवांवर आधारित कीटकनाशके:', 'निवडक किडींवर परिणाम करणारे उपयुक्त सूक्ष्मजीव.'], ['वनस्पती अर्क:', 'एकात्मिक पीक संरक्षण कार्यक्रमाचा भाग म्हणून वापरले जाणारे नैसर्गिक अर्क.'], ['एकात्मिक कीड व्यवस्थापन:', 'जबाबदार नियंत्रणासाठी निरीक्षण, शेती पद्धती आणि योग्य जैविक उत्पादने एकत्र वापरा.']] },
        { heading: 'जैविक कीटकनाशकांचे फायदे', items: ['नैसर्गिक आणि पर्यावरणपूरक पीक संरक्षण पर्याय', 'एकात्मिक कीड व्यवस्थापनास मदत', 'भाज्या, फळे, शेतपिके आणि बागांसाठी योग्य पर्याय', 'विश्वासार्ह कृषी ब्रँडकडील उत्पादने', 'जबाबदार कीड नियंत्रणासाठी उत्पादकांना योग्य पर्याय'] },
        { heading: 'जैविक कीटकनाशके कशी निवडावी आणि वापरावी', paragraphs: ['लक्ष्य कीड ओळखून तुमच्या पिकासाठी शिफारस केलेले उत्पादन निवडा. प्रमाण, मिश्रण, वापराची वेळ, साठवण आणि सुरक्षिततेसाठी लेबलवरील सूचनांचे पालन करा.', 'नियमित निरीक्षण आणि योग्य वेळी वापर केल्याने परिणाम सुधारून शेतातील पर्यावरणीय संतुलन राखण्यास मदत होते.'] },
        { heading: 'किसानशॉपकडून जैविक कीटकनाशके का खरेदी करावी?', items: ['जैविक कीड नियंत्रण उत्पादनांची विस्तृत श्रेणी', 'विश्वासार्ह कृषी ब्रँड', 'शेतकरी, बागा आणि सेंद्रिय उत्पादकांसाठी पर्याय', 'संपूर्ण भारतात सोपी ऑनलाइन ऑर्डर', 'सेवाक्षम गाव, शहर आणि नगरांमध्ये वितरण'] }
      ],
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
      faq: [['जैविक कीटकनाशके म्हणजे काय?', 'जैविक कीटकनाशके ही जबाबदार पीक संरक्षणाचा भाग म्हणून किडींच्या व्यवस्थापनासाठी वापरली जाणारी जैविक किंवा वनस्पतीजन्य उत्पादने आहेत.'], ['जैविक कीटकनाशके भाज्यांसाठी योग्य आहेत का?', 'होय, उत्पादनाच्या लेबलनुसार आणि शिफारस केलेल्या वापर पद्धतीनुसार अनेक उत्पादने भाज्यांसाठी योग्य आहेत.'], ['जैविक कीटकनाशके कशी साठवावी?', 'थेट सूर्यप्रकाशापासून दूर, थंड आणि कोरड्या ठिकाणी मूळ डब्यात साठवा आणि लेबलवरील सूचनांचे पालन करा.']],
      disclaimer: 'सूचना: जैविक कीटकनाशकाचा परिणाम कीड, पीक, हवामान, उत्पादनाची गुणवत्ता आणि वापराच्या पद्धतीवर अवलंबून असतो. उत्पादनाच्या लेबलचे नेहमी पालन करा आणि आवश्यक असल्यास स्थानिक तज्ज्ञांचा सल्ला घ्या.'
    },
    farmingToolsPage: {
      back: 'मागे', title: 'शेतीची साधने आणि उपकरणे', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      sections: [
        { heading: 'भारतात ऑनलाइन शेतीची साधने आणि उपकरणे खरेदी करा', paragraphs: ['विश्वासार्ह कृषी ब्रँडकडील शेतीची साधने, फवारणी यंत्रे, पंप आणि उपकरणे पहा. शेत, बागा, रोपवाटिका आणि लँडस्केपिंगसाठी उपयुक्त उपाय निवडा.', 'तुमचे पीक, काम, शेताचा आकार, ऊर्जेचा स्रोत, सुरक्षिततेच्या गरजा आणि देखभालीनुसार साधने निवडा.'] },
        { heading: 'प्रत्येक गरजेसाठी शेतीची साधने', items: [['हाताची साधने:', 'दररोजच्या शेत आणि बागकामासाठी फावडी, रेक, कोयते, कुदळी आणि इतर साधने.'], ['फवारणी यंत्रे आणि पंप:', 'पीक संरक्षण उत्पादने, खते आणि पाणी देण्यासाठी उपकरणे.'], ['पॉवर वीडर आणि कापणी यंत्रे:', 'शारीरिक मेहनत कमी करून शेतीची कार्यक्षमता वाढवणारी यंत्रे.'], ['सुरक्षा उपकरणे:', 'सुरक्षित कृषी कामासाठी हातमोजे आणि संरक्षणात्मक साधने.']] },
        { heading: 'दर्जेदार शेतीच्या साधनांचे फायदे', items: ['कामाची कार्यक्षमता आणि उत्पादकता वाढते', 'शेत आणि बागेच्या नियमित वापरासाठी टिकाऊ साधने', 'लहान शेत, रोपवाटिका आणि व्यावसायिक उत्पादकांसाठी योग्य पर्याय', 'मान्यताप्राप्त ब्रँडकडील विश्वासार्ह उपकरणे', 'विविध कृषी कामांसाठी सोयीस्कर पर्याय'] },
        { heading: 'योग्य शेतीचे साधन कसे निवडावे', paragraphs: ['खरेदीपूर्वी काम, शेताचा आकार, पीक, माती, ऊर्जेचा स्रोत, साधनाची क्षमता आणि देखभालीची सोय लक्षात घ्या. उत्पादकाच्या सूचनांनुसार उपकरणे वापरा आणि योग्य सुरक्षा पद्धती पाळा.', 'स्वच्छता, योग्य साठवण आणि नियमित देखभालीमुळे साधनांचे आयुष्य आणि कार्यक्षमता सुधारते.'] },
        { heading: 'किसानशॉपकडून शेतीची साधने का खरेदी करावी?', items: ['शेती आणि बागकामाच्या साधनांची विस्तृत श्रेणी', 'विश्वासार्ह कृषी ब्रँड', 'शेतकरी, बागकाम करणारे आणि रोपवाटिकांसाठी पर्याय', 'संपूर्ण भारतात सोपी ऑनलाइन ऑर्डर', 'सेवाक्षम गाव, शहर आणि नगरांमध्ये वितरण'] }
      ],
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
      faq: [['कोणती शेतीची साधने उपलब्ध आहेत?', 'हाताची साधने, फवारणी यंत्रे, पंप, पॉवर वीडर, कापणी यंत्रे, हातमोजे आणि इतर शेतीची उपकरणे उपलब्ध आहेत.'], ['योग्य साधन कसे निवडावे?', 'उपकरण निवडण्यापूर्वी काम, पीक, शेताचा आकार, क्षमता, ऊर्जेचा स्रोत आणि सुरक्षिततेच्या गरजा लक्षात घ्या.'], ['ही साधने बागांसाठी योग्य आहेत का?', 'अनेक हाताची साधने, फवारणी यंत्रे आणि उपकरणे घरगुती बागा, रोपवाटिका आणि लहान शेतांसाठी योग्य आहेत.']],
      disclaimer: 'सूचना: साधनांची कार्यक्षमता योग्य निवड, वापर, देखभाल आणि कामाच्या परिस्थितीवर अवलंबून असते. उत्पादकाच्या सूचनांचे नेहमी पालन करा आणि योग्य सुरक्षा साधने वापरा.'
    },
    plantsPage: {
      back: 'मागे', title: 'रोपे', noProducts: 'या श्रेणीमध्ये कोणतीही उत्पादने सापडली नाहीत.',
      sections: [
        { heading: 'भारतात ऑनलाइन रोपे खरेदी करा', paragraphs: ['निरोगी फळझाडे, शोभेची झाडे, घरातील हिरवळ आणि औषधी वनस्पती तुमच्या घरात, बागेत किंवा शेतात आणा. विश्वासार्ह उत्पादकांकडील दर्जेदार रोपे पहा.', 'तुमचे हवामान, सूर्यप्रकाश, माती, उपलब्ध जागा, पाण्याची दिनचर्या आणि वापरानुसार रोपे निवडा.'] },
        { heading: 'प्रत्येक लागवडीच्या जागेसाठी रोपे', items: [['फळझाडे:', 'घरगुती बागा आणि शेतांसाठी आंबा, पेरू, लिंबू आणि इतर रोपे.'], ['शोभेची झाडे:', 'बागा आणि लँडस्केपला रंग व सौंदर्य देणारी सजावटीची झाडे.'], ['घरातील रोपे:', 'घरे, कार्यालये आणि घरातील जागांसाठी कमी देखभालीची हिरवळ.'], ['औषधी वनस्पती:', 'घरगुती बागांसाठी कोरफड, तुळस आणि कडुनिंबासारख्या उपयुक्त वनस्पती.']] },
        { heading: 'दर्जेदार रोपांचे फायदे', items: ['निरोगी स्थापना आणि जोमदार वाढ', 'बागा, शेत, बाल्कनी आणि घरातील जागांसाठी योग्य पर्याय', 'फळझाडे, फुलझाडे, शोभेची आणि औषधी वाणे', 'विश्वासार्ह उत्पादक आणि रोपवाटिकांकडील रोपे', 'घरगुती बागकाम करणारे आणि शेतकऱ्यांसाठी सोयीस्कर पर्याय'] },
        { heading: 'रोपे कशी निवडावी आणि त्यांची काळजी कशी घ्यावी', paragraphs: ['रोप निवडण्यापूर्वी सूर्यप्रकाश, माती, कुंडीचा आकार, पाण्याचा निचरा, पाणी देणे आणि स्थानिक हवामान लक्षात घ्या. योग्य लागवड, खत, छाटणी आणि कीड व्यवस्थापन पद्धती पाळा.', 'नियमित पाणी, योग्य सूर्यप्रकाश आणि वेळेवर काळजी घेतल्यास रोपे निरोगी राहून चांगली वाढतात.'] },
        { heading: 'किसानशॉपकडून रोपे का खरेदी करावी?', items: ['रोपे आणि कलमांची विस्तृत श्रेणी', 'घरे, बागा आणि शेतांसाठी पर्याय', 'विश्वासार्ह उत्पादकांकडील रोपे', 'संपूर्ण भारतात सोपी ऑनलाइन ऑर्डर', 'सेवाक्षम गाव, शहर आणि नगरांमध्ये वितरण'] }
      ],
      faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
      faq: [['कोणती रोपे उपलब्ध आहेत?', 'फळझाडे, शोभेची झाडे, घरातील रोपे, औषधी वनस्पती आणि फुलझाडांची वाणे उपलब्ध आहेत.'], ['रोप कसे निवडावे?', 'रोप निवडण्यापूर्वी तुमचे हवामान, सूर्यप्रकाश, माती, उपलब्ध जागा आणि पाणी देण्याची दिनचर्या लक्षात घ्या.'], ['रोपे कुंड्यांमध्ये वाढवता येतात का?', 'होय, योग्य निचरा आणि काळजी घेतल्यास अनेक शोभेची, घरातील, औषधी आणि लहान फळझाडे योग्य कुंड्यांमध्ये वाढवता येतात.']],
      disclaimer: 'सूचना: रोपांची वाढ रोपांची गुणवत्ता, हवामान, माती, सूर्यप्रकाश, पाणी आणि काळजीवर अवलंबून असते. योग्य वाढीच्या मार्गदर्शनाचे पालन करा आणि आवश्यक असल्यास स्थानिक तज्ज्ञांचा सल्ला घ्या.'
    },
    search: { placeholder: 'उत्पादन शोधा...' },
    auth: {
      login: 'लॉगिन',
      register: 'नोंदणी',
      welcomeBack: 'पुन्हा स्वागत',
      createAccount: 'खाती तयार करा',
      emailRequired: 'ईमेल आणि पासवर्ड आवश्यक आहेत.',
      phoneRequired: 'फोन नंबर आवश्यक आहे.',
      otpRequired: 'OTP आवश्यक आहे.',
      fullNameRequired: 'पूर्ण नाव आवश्यक आहे.',
      passwordRequirement: 'कृपया किमान 6 अक्षरी पासवर्ड वापरा.',
      accountCreated: 'खाते तयार झाले! स्वागत आहे, {name}!',
      welcome: 'परत स्वागत आहे, {name}! 🎉',
      sendOtp: 'OTP पाठवा',
      verifyLogin: 'चेक व लॉगिन'
    },
    product: {
      available: 'उपलब्ध',
      outOfStock: 'स्टॉक संपला',
      suitable: 'योग्य आहे:',
      inStock: 'स्टॉक मध्ये आहे',
      buyNow: 'आता खरेदी करा',
      processing: 'प्रक्रिया सुरू आहे...',
      detailsTitle: 'उत्पादन तपशील',
      selectPackSize: 'पॅक आकार निवडा',
      viewDetails: 'तपशील पहा',
      addToCart: 'कार्टमध्ये जोडा',
      adding: 'जोडत आहे...',
      selectWeight: 'वजन / प्रमाण निवडा'
    },
    category: { uncategorized: 'वर्गीकृत नाही' },
    general: { search: 'शोध' },
    profile: {
      profile: 'प्रोफाइल', orders: 'ऑर्डर्स', addresses: 'पत्ते',
      logout: 'लॉगआउट', title: 'माझे प्रोफाइल', personalInfo: 'वैयक्तिक माहिती',
      edit: 'संपादित करा', name: 'नाव:', email: 'ईमेल:', phone: 'फोन:',
      fullName: 'पूर्ण नाव', phoneNumber: 'फोन नंबर', emailAddress: 'ईमेल पत्ता',
      newPassword: 'नवीन पासवर्ड', passwordPlaceholder: 'सध्याचा पासवर्ड ठेवण्यासाठी रिक्त सोडा',
      save: 'बदल जतन करा', saving: 'जतन करत आहे...', cancel: 'रद्द करा',
      updated: 'प्रोफाइल यशस्वीरित्या अपडेट झाले!', updateFailed: 'प्रोफाइल अपडेट करता आले नाही.'
    },
    orders: {
      title: 'माझ्या ऑर्डर्स', count: '{count} ऑर्डर्स', searchPlaceholder: 'ऑर्डर क्रमांक किंवा उत्पादनाचे नाव शोधा...',
      range: '{from}-{to} पैकी {total}', noOrders: 'अजून कोणत्याही ऑर्डर्स नाहीत',
      emptyMessage: 'उत्तम कृषी उत्पादने पहा आणि तुमची पहिली ऑर्डर द्या.', shopNow: 'आता खरेदी करा',
      filters: { all: 'सर्व', pending: 'प्रलंबित', processing: 'प्रक्रिया सुरू', shipped: 'पाठवलेले', delivered: 'वितरित', cancelled: 'रद्द केलेले' }
    },
    addresses: {
      title: 'माझा पत्ता', edit: 'पत्ता संपादित करा', add: 'नवीन पत्ता जोडा',
      name: 'नाव', mobile: '10 अंकी मोबाइल नंबर', pincode: 'पिनकोड',
      house: 'फ्लॅट, घर क्रमांक, इमारत, कंपनी, अपार्टमेंट',
      street: 'परिसर, रस्ता, सेक्टर, गाव', city: 'शहर', state: 'राज्य', country: 'देश',
      update: 'पत्ता अपडेट करा', save: 'पत्ता जतन करा', cancel: 'रद्द करा', addNew: 'नवीन पत्ता जोडा',
      address: 'पत्ता', editTitle: 'पत्ता संपादित करा', removeTitle: 'पत्ता काढून टाका',
      confirmRemove: 'तुम्हाला हा पत्ता काढून टाकायचा आहे का?',
      saveFailed: 'पत्ता जतन करता आला नाही.', removeFailed: 'पत्ता काढता आला नाही.'
    },
    cart: {
      title: 'तुमची कार्ट', empty: 'तुमची कार्ट रिकामी आहे', continueShopping: 'खरेदी सुरू ठेवा',
      size: 'आकार', subtotal: 'एकूण ({count} वस्तू)', clear: 'कार्ट रिकामी करा',
      accept: 'मी सहमत आहे:', terms: 'अटी आणि शर्ती',
      policyIntro: 'ऑर्डर देऊन मी MarutiKrushiSevaKendra च्या',
      returnPolicy: 'परतावा आणि रिफंड धोरणांशी', and: 'आणि', privacy: 'गोपनीयता धोरणाशी सहमत आहे.',
      placeOrder: 'ऑर्डर द्या', checkoutNote: 'शिपिंग, कर आणि सवलती चेकआउटवेळी मोजल्या जातील.',
      itemImage: 'वस्तू'
    },
    home: {
      quickCategories: {
        seeds: 'बियाणे', cropProtection: 'पीक संरक्षण', cropNutrition: 'पीक पोषण',
        farmingTools: 'शेतीची साधने', plants: 'रोपे', pots: 'कुंड्या आणि प्लांटर्स', animalFeed: 'पशुखाद्य आणि काळजी'
      },
      quickMenu: {
        vegetable_seeds: 'भाजीपाला बियाणे', fruit_seeds: 'फळांची बियाणे', top_brands: 'प्रमुख ब्रँड', flower_seeds: 'फुलांची बियाणे',
        bhindi_okra_seeds: 'भेंडीची बियाणे', chilli_seeds: 'मिरचीची बियाणे', tomato_seeds: 'टोमॅटोची बियाणे', cauliflower_seeds: 'फुलकोबीची बियाणे',
        bitter_gourd_seeds: 'कारल्याची बियाणे', bottle_gourd_seeds: 'दुधी भोपळ्याची बियाणे', broccoli_seeds: 'ब्रोकोलीची बियाणे', brinjal_seeds: 'वांग्याची बियाणे',
        carrot_seeds: 'गाजराची बियाणे', muskmelon_seeds: 'खरबुजाची बियाणे', watermelon_seeds: 'कलिंगडाची बियाणे', papaya_seeds: 'पपईची बियाणे',
        strawberry: 'स्ट्रॉबेरी', seminis_seeds: 'सेमिनिस बियाणे', vnr_seeds: 'व्हीएनआर बियाणे', sakata: 'साकाटा', clause_seeds: 'क्लॉज बियाणे',
        advanta_seeds: 'अॅडव्हांटा बियाणे', marigold_seeds: 'झेंडूची बियाणे', zinnia_seeds: 'झिनियाची बियाणे',
        chemical_pesticides: 'रासायनिक कीटकनाशके', bio_pesticides: 'जैविक कीटकनाशके', insecticides: 'कीटकनाशके', fungicides: 'बुरशीनाशके',
        herbicides: 'तणनाशके', bio_insecticide: 'जैविक कीटकनाशक', bio_fungicide: 'जैविक बुरशीनाशक', upl: 'यूपीएल', bayer: 'बायर',
        adama: 'अडामा', basf: 'बीएएसएफ', dhanuka: 'धनुका', crop_nutrition: 'पीक पोषण', fertilizers: 'खते',
        bio_fertilizers: 'जैविक खते', biostimulants: 'जैव उत्तेजक', plant_growth_promoter: 'वनस्पती वाढ प्रवर्तक',
        farming_tools: 'शेतीची साधने', garden_hand_tools: 'बागकाम आणि हाताची साधने', sprayers_and_pumps: 'फवारणी यंत्रे आणि पंप',
        wolf_garten_tools: 'वुल्फ गार्टन साधने', lawn_mower: 'लॉन मॉवर', power_weeder: 'पॉवर वीडर', earth_auger: 'अर्थ ऑगर',
        harvesters: 'कापणी यंत्रे', safety_hand_gloves: 'सुरक्षा हातमोजे', weeders: 'तण काढण्याची साधने', view_all: 'सर्व पहा →'
      },
      features: {
        original: '१००% अस्सल', originalDescription: 'अस्सल आणि उच्च दर्जाची कृषी उत्पादने',
        delivery: 'मोफत वितरण', deliveryDescription: 'तुमच्या शेतापर्यंत थेट वितरण',
        payment: 'सुरक्षित पेमेंट', paymentDescription: '१००% सुरक्षित ऑनलाइन पेमेंट',
        expert: 'तज्ज्ञ सेवा', expertDescription: 'कृषी सल्ला आणि मार्गदर्शन'
      },
      categories: {
        title: 'श्रेणीनुसार उत्पादने', subtitle: 'श्रेणीनुसार सर्व कृषी उत्पादने पहा',
        seeds: 'बियाणे', seedsDescription: 'भाजीपाला, शेतकी आणि संकरित बियाणे',
        cropProtection: 'पीक संरक्षण', cropProtectionDescription: 'कीटकनाशके आणि रोग नियंत्रण',
        cropNutrition: 'पीक पोषण', cropNutritionDescription: 'खते आणि सूक्ष्म अन्नद्रव्ये',
        farmingTools: 'शेतीची साधने', farmingToolsDescription: 'हाताची साधने आणि शेतीची उपकरणे',
        plants: 'रोपे', plantsDescription: 'रोपे आणि शोभेची झाडे',
        pots: 'कुंड्या आणि प्लांटर्स', potsDescription: 'बागेतील कुंड्या, प्लांटर्स आणि ट्रे',
        flowerSeeds: 'फुलांची बियाणे', flowerSeedsDescription: 'वार्षिक, बारमाही आणि हंगामी फुले',
        insecticides: 'कीटकनाशके', insecticidesDescription: 'हानिकारक कीटक आणि किडींचे नियंत्रण',
        fungicides: 'बुरशीनाशके', fungicidesDescription: 'बुरशीजन्य रोगांपासून संरक्षण आणि उपचार',
        herbicides: 'तणनाशके', herbicidesDescription: 'तण नियंत्रण आणि व्यवस्थापन',
        organicFarming: 'सेंद्रिय शेती', organicFarmingDescription: 'जैविक कीटकनाशके आणि सेंद्रिय निविष्ठा',
        animalFeed: 'पशुखाद्य', animalFeedDescription: 'खाद्य, पूरक आहार आणि पशु संगोपन'
      },
      brands: {
        title: 'ब्रँड', subtitle: 'स्थानिक शेतकऱ्यांचा विश्वास असलेले दर्जेदार ब्रँड', previous: 'मागील ब्रँड', next: 'पुढील ब्रँड'
      },
      bestDeals: {
        title: 'सर्वोत्तम ऑफर्स', subtitle: 'निवडक कृषी उत्पादनांवर खास ऑफर्स, आज मोठी बचत करा!',
        viewAll: 'सर्व उत्पादने पहा', previous: 'मागील ऑफर', next: 'पुढील ऑफर'
      },
      vegetableSeeds: {
        title: 'भाजीपाला बियाणे', subtitle: 'अधिक उत्पादनासाठी उच्च दर्जाची संकरित आणि मुक्त परागीभवन बियाणे',
        viewAll: 'सर्व बियाणे पहा'
      },
      footer: {
        description: 'किसानशॉप विश्वासार्ह सहाय्य आणि सोप्या ऑर्डरसह अस्सल बियाणे, पीक संरक्षण, पीक पोषण, शेतीची साधने आणि बागकामाच्या आवश्यक वस्तू शेतकऱ्यांपर्यंत पोहोचवते.',
        getItOn: 'येथे मिळवा', seller: 'विक्रेता बना', quickLinksTitle: 'जलद दुवे', categoriesTitle: 'प्रमुख श्रेणी', followUs: 'आम्हाला फॉलो करा',
        quickLinks: [
          ['/about', 'आमच्याविषयी'], ['/privacy', 'गोपनीयता धोरण'], ['/returns', 'परतावा धोरण'], ['/shipping', 'शिपिंग धोरण'],
          ['/terms', 'अटी आणि शर्ती'], ['/careers', 'करिअर'], ['/blog', 'ब्लॉग'], ['/contact', 'संपर्क करा'], ['/track', 'ऑर्डर ट्रॅक करा']
        ],
        categories: [
          ['/vegetable-seeds', 'भाजीपाला बियाणे'], ['/crop-protection', 'पीक संरक्षण'], ['/crop-nutrition', 'पीक पोषण'],
          ['/farming-tools', 'शेतीची साधने आणि उपकरणे'], ['/plants', 'रोपे'], ['/products?search=pots', 'कुंड्या आणि प्लांटर्स']
        ],
        updatedTitle: 'नवीन माहितीसाठी जोडलेले रहा', updatedDescription: 'उपयुक्त ऑफर्स, हंगामी उत्पादने आणि शेतीविषयक अपडेट्स मिळवा.', emailPlaceholder: 'तुमचा ईमेल टाका',
        contactTitle: 'संपर्क करा', email: 'ईमेल', customerCare: 'ग्राहक सेवा',
        rights: 'सर्व हक्क राखीव.', privacy: 'गोपनीयता', terms: 'अटी', support: 'सहाय्य'
      },
      sections: {
        cropProtection: ['पीक संरक्षण', 'तुमच्या पिकांच्या संरक्षणासाठी प्रभावी कीटकनाशके, बुरशीनाशके आणि तणनाशके', 'सर्व उत्पादने पहा'],
        flowerSeeds: ['फुलांची बियाणे', 'रंगीबेरंगी वार्षिक आणि बारमाही फुलांच्या बियाण्यांनी तुमची बाग सजवा', 'सर्व फुलांची बियाणे पहा'],
        cropNutrition: ['पीक पोषण', 'निरोगी आणि अधिक उत्पादनासाठी खते, सूक्ष्म अन्नद्रव्ये आणि जैव उत्तेजक', 'सर्व उत्पादने पहा'],
        insecticides: ['कीटकनाशके', 'पिकांना किडींपासून वाचवण्यासाठी प्रभावी कीटकनाशके', 'सर्व कीटकनाशके पहा'],
        fungicides: ['बुरशीनाशके', 'पिकांमधील बुरशीजन्य रोगांवर प्रतिबंध आणि उपचारासाठी बुरशीनाशके', 'सर्व बुरशीनाशके पहा'],
        herbicides: ['तणनाशके', 'शेतातील प्रभावी तण नियंत्रणासाठी निवडक आणि सर्वसमावेशक तणनाशके', 'सर्व तणनाशके पहा'],
        bioInsecticides: ['जैविक कीटकनाशके', 'माती, पिके आणि पर्यावरणासाठी सुरक्षित नैसर्गिक जैविक कीटकनाशके', 'सर्व जैविक कीटकनाशके पहा'],
        toolsEquipment: ['साधने आणि उपकरणे', 'प्रत्येक कृषी गरजेसाठी व्यावसायिक शेतीची साधने, फवारणी यंत्रे आणि उपकरणे', 'सर्व साधने पहा'],
        plants: ['रोपे', 'फळझाडे, औषधी वनस्पती आणि शोभेची झाडे यांची ताजी रोपे', 'सर्व रोपे पहा']
      },
      whyChooseUs: {
        title: 'आम्हाला का निवडावे?', subtitle: 'तुमच्या शेतीच्या यशासाठी आम्ही वचनबद्ध आहोत',
        quality: ['दर्जेदार उत्पादने', 'विश्वसनीय उत्पादकांकडून अस्सल आणि ब्रँडेड कृषी उत्पादने.'],
        service: ['विश्वसनीय सेवा', 'स्थानिक शेतकऱ्यांना प्रामाणिकपणे सेवा देण्याचा अनेक वर्षांचा अनुभव.'],
        support: ['स्थानिक सहकार्य', 'स्थानिक शेतीच्या परिस्थिती आणि गरजा आम्हाला समजतात.'],
        farmerFriendly: ['शेतकरी-अनुकूल', 'योग्य उत्पादन निवडण्यासाठी सोपे मार्गदर्शन.']
      },
      seo: {
        title: 'किसानशॉप – भारतातील विश्वासार्ह ऑनलाइन कृषी स्टोअर',
        description: 'प्रमुख ब्रँडची अस्सल बियाणे, कीटकनाशके, खते, पीक पोषण उत्पादने आणि शेतीची साधने खरेदी करा. पीक संरक्षण, पीक पोषण, साधने आणि उपकरणे, भाजीपाला बियाणे आणि बाहेरील रोपांसारख्या लोकप्रिय श्रेणी पहा. जलद वितरण आणि जीएसटी बिलांसह अस्सल उत्पादनांचा आमचा भर आहे.',
        faqTitle: 'वारंवार विचारले जाणारे प्रश्न',
        questions: [
          ['किसानशॉपवर कोणत्या प्रकारची उत्पादने उपलब्ध आहेत?', 'आम्ही प्रमुख ब्रँडकडून अस्सल बियाणे, कीटकनाशके, खते, पीक पोषण उत्पादने आणि विविध शेतीची साधने देतो.'],
          ['माझी ऑर्डर किती लवकर मिळेल?', 'बहुतेक ऑर्डर्स २४ तासांत प्रक्रिया केल्या जातात आणि तुमच्या स्थानानुसार ३-७ व्यावसायिक दिवसांत वितरित केल्या जातात.'],
          ['मी उत्पादन परत किंवा बदलू शकतो का?', 'होय, पात्र उत्पादनांसाठी वितरणाच्या ७ दिवसांच्या आत सुलभ परतावा आणि बदल धोरण उपलब्ध आहे.'],
          ['तुम्ही जीएसटी बिल देता का?', 'होय, सर्व खरेदीसाठी वैध जीएसटी बिले दिली जातात, ज्यामुळे तुम्ही इनपुट टॅक्स क्रेडिटचा दावा करू शकता.'],
          ['मी माझी ऑर्डर कशी ट्रॅक करू?', 'ऑर्डर पाठवल्यानंतर वितरणाची स्थिती पाहण्यासाठी ईमेल आणि एसएमएसद्वारे ट्रॅकिंग लिंक मिळेल.'],
          ['कोणते पेमेंट पर्याय उपलब्ध आहेत?', 'पात्र ऑर्डर्सवर क्रेडिट/डेबिट कार्ड, यूपीआय, नेट बँकिंग, वॉलेट्स आणि कॅश ऑन डिलिव्हरी स्वीकारले जातात.'],
          ['तुम्ही संपूर्ण भारतात वितरण करता का?', 'होय, आम्ही भारतातील बहुतांश पिन कोडवर वितरण करतो, ज्यामुळे सर्व शेतकऱ्यांपर्यंत दर्जेदार उत्पादने पोहोचतात.'],
          ['उत्पादनाबद्दल प्रश्न असल्यास ग्राहक सहाय्य मिळेल का?', 'नक्कीच! आमची तज्ज्ञ सहाय्य टीम फोन आणि व्हॉट्सअॅपद्वारे तुमच्या प्रश्नांसाठी उपलब्ध आहे.'],
          ['मी घाऊक दरात मोठ्या प्रमाणात उत्पादने खरेदी करू शकतो का?', 'होय, शेतकरी आणि किरकोळ विक्रेत्यांसाठी मोठ्या ऑर्डर्सवर सवलत आणि घाऊक दर उपलब्ध आहेत.']
        ]
      }
    }
  }
};

export default messages;
