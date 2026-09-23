require('dotenv').config({ path: './.env' });
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

// ─── Category definitions ───────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Vegetable Seeds',      description: 'Hybrid and open-pollinated vegetable seeds' },
  { name: 'Flower Seeds',         description: 'Ornamental flower seeds for gardens and farms' },
  { name: 'Crop Protection',      description: 'Pesticides, fungicides, herbicides and crop protection products' },
  { name: 'Crop Nutrition',       description: 'Fertilizers, micronutrients and bio stimulants' },
  { name: 'Insecticides',         description: 'Systemic and contact insecticides' },
  { name: 'Fungicides',           description: 'Preventive and curative fungicides' },
  { name: 'Herbicides',           description: 'Pre and post-emergent herbicides and weedkillers' },
  { name: 'Bio Insecticides',     description: 'Organic and bio-based insect control products' },
  { name: 'Farming Tools',        description: 'Sprayers, hand tools and power equipment' },
  { name: 'Plants',               description: 'Fruit plants, herb plants and ornamental plants' },
];

// ─── All products from the website ─────────────────────────────────────────
const PRODUCTS_DATA = [
  // BEST DEALS
  { name: 'Syngenta Amistar Top Fungicide', categoryName: 'Fungicides', price: 780, discount: 18, stock: 50, brand: 'Syngenta', manufacturer: 'Syngenta India Ltd', description: 'Amistar Top is a broad-spectrum systemic fungicide with protective and curative action.', activeIngredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', packSizes: ['100 ml', '250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'Mahyco Bhindi F1 Hybrid Seeds', categoryName: 'Vegetable Seeds', price: 320, discount: 20, stock: 80, brand: 'Mahyco', manufacturer: 'Maharashtra Hybrid Seeds Company', description: 'High-yielding F1 hybrid bhindi seeds suitable for all seasons.', suitableCrops: ['Bhindi', 'Okra'], packSizes: ['10 grams', '25 grams', '50 grams', '100 grams'], available: true },
  { name: 'IFFCO NPK 19:19:19 Fertilizer', categoryName: 'Crop Nutrition', price: 560, discount: 18, stock: 120, brand: 'IFFCO', manufacturer: 'IFFCO', description: 'Fully water-soluble NPK fertilizer for fertigation and foliar application.', composition: 'NPK 19:19:19', packSizes: ['500 grams', '1 kg', '5 kg', '25 kg', '50 kg'], available: true },
  { name: 'Bayer Confidor Insecticide', categoryName: 'Insecticides', price: 445, discount: 16, stock: 60, brand: 'Bayer', manufacturer: 'Bayer CropScience India', description: 'Systemic insecticide for sucking pest control in a wide range of crops.', activeIngredient: 'Imidacloprid 200 SL', packSizes: ['100 ml', '250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'UPL Saaf Carbendazim Fungicide', categoryName: 'Fungicides', price: 210, discount: 22, stock: 100, brand: 'UPL', manufacturer: 'UPL Limited', description: 'Broad-spectrum fungicide combining Carbendazim and Mancozeb.', activeIngredient: 'Carbendazim 12% + Mancozeb 63% WP', packSizes: ['100 grams', '250 grams', '500 grams', '1 kg'], available: true },
  { name: 'Seminis Tomato F1 Hybrid Seeds', categoryName: 'Vegetable Seeds', price: 890, discount: 19, stock: 40, brand: 'Seminis', manufacturer: 'Seminis Vegetable Seeds India', description: 'High-yield F1 hybrid tomato seeds with excellent fruit quality.', suitableCrops: ['Tomato'], packSizes: ['5 grams', '10 grams', '25 grams', '50 grams', '100 grams'], available: true },

  // VEGETABLE SEEDS
  { name: 'Seminis Tomato Abhilash F1 Seeds', categoryName: 'Vegetable Seeds', price: 390, discount: 22, stock: 55, brand: 'Seminis', manufacturer: 'Seminis Vegetable Seeds India', description: 'Abhilash F1 is a high-yielding determinate tomato variety.', suitableCrops: ['Tomato'], packSizes: ['5 grams', '10 grams', '25 grams', '50 grams', '100 grams'], available: true },
  { name: 'VNR Bhindi (Okra) Hybrid Seeds', categoryName: 'Vegetable Seeds', price: 175, discount: 27, stock: 90, brand: 'VNR', manufacturer: 'VNR Seeds Pvt Ltd', description: 'High-yielding bhindi hybrid seeds with dark green, tender pods.', suitableCrops: ['Bhindi', 'Okra'], packSizes: ['50 grams', '100 grams', '250 grams', '500 grams'], available: true },
  { name: 'Sakata Chilli F1 Hybrid Seeds', categoryName: 'Vegetable Seeds', price: 510, discount: 22, stock: 45, brand: 'Sakata', manufacturer: 'Sakata Seed India Pvt Ltd', description: 'F1 hybrid chilli seeds with high pungency and long shelf life.', suitableCrops: ['Chilli'], packSizes: ['5 grams', '10 grams', '25 grams', '50 grams'], available: true },
  { name: 'Clause Cauliflower Snowball Seeds', categoryName: 'Vegetable Seeds', price: 280, discount: 22, stock: 70, brand: 'Clause', manufacturer: 'Clause Seeds India', description: 'Snowball cauliflower seeds producing compact, white curds.', suitableCrops: ['Cauliflower'], packSizes: ['10 grams', '25 grams', '50 grams', '100 grams'], available: true },
  { name: 'Mahyco Bitter Gourd Hybrid Seeds', categoryName: 'Vegetable Seeds', price: 220, discount: 24, stock: 60, brand: 'Mahyco', manufacturer: 'Maharashtra Hybrid Seeds Company', description: 'High-yielding bitter gourd hybrid suitable for Kharif season.', suitableCrops: ['Bitter Gourd', 'Karela'], packSizes: ['10 grams', '25 grams', '50 grams', '100 grams'], available: true },
  { name: 'Advanta Bottle Gourd F1 Seeds', categoryName: 'Vegetable Seeds', price: 195, discount: 25, stock: 75, brand: 'Advanta', manufacturer: 'Advanta Seeds India', description: 'F1 hybrid bottle gourd seeds with early maturity and long fruit.', suitableCrops: ['Bottle Gourd', 'Lauki'], packSizes: ['10 grams', '25 grams', '50 grams', '100 grams'], available: true },

  // CROP PROTECTION
  { name: 'Bayer Confidor Imidacloprid Insecticide', categoryName: 'Crop Protection', price: 445, discount: 22, stock: 55, brand: 'Bayer', manufacturer: 'Bayer CropScience India', description: 'Systemic insecticide for sucking pest management.', activeIngredient: 'Imidacloprid 200 SL', packSizes: ['100 ml', '250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'UPL Saaf Carbendazim + Mancozeb', categoryName: 'Crop Protection', price: 210, discount: 25, stock: 100, brand: 'UPL', manufacturer: 'UPL Limited', description: 'Combination fungicide for broad-spectrum disease management.', activeIngredient: 'Carbendazim 12% + Mancozeb 63% WP', packSizes: ['100 grams', '250 grams', '500 grams', '1 kg'], available: true },
  { name: 'Dhanuka Targa Super Herbicide', categoryName: 'Crop Protection', price: 360, discount: 20, stock: 65, brand: 'Dhanuka', manufacturer: 'Dhanuka Agritech Ltd', description: 'Selective post-emergent herbicide for grassy weed control.', activeIngredient: 'Quizalofop Ethyl 5% EC', packSizes: ['250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'BASF Cabrio Top Fungicide', categoryName: 'Crop Protection', price: 890, discount: 19, stock: 35, brand: 'BASF', manufacturer: 'BASF India Ltd', description: 'Preventive and curative fungicide for downy and powdery mildew.', activeIngredient: 'Pyraclostrobin 5% + Metiram 55% WG', packSizes: ['100 grams', '250 grams', '500 grams'], available: true },
  { name: 'Adama Bio Insecticide Neem Oil', categoryName: 'Crop Protection', price: 320, discount: 20, stock: 80, brand: 'Adama', manufacturer: 'Adama India Pvt Ltd', description: 'Botanical neem oil-based insecticide for eco-friendly pest management.', activeIngredient: 'Azadirachtin 300 ppm', packSizes: ['250 ml', '500 ml', '1 Litre', '5 Litre'], available: true },

  // FLOWER SEEDS
  { name: 'Seminis Marigold African Giant Seeds', categoryName: 'Flower Seeds', price: 150, discount: 25, stock: 120, brand: 'Seminis', manufacturer: 'Seminis Vegetable Seeds India', description: 'Large blooming African marigold seeds, ideal for garlands and borders.', packSizes: ['5 grams', '10 grams', '25 grams', '50 grams', '100 grams'], available: true },
  { name: 'VNR Zinnia Double Mixed Colour', categoryName: 'Flower Seeds', price: 120, discount: 25, stock: 100, brand: 'VNR', manufacturer: 'VNR Seeds Pvt Ltd', description: 'Double-flowered zinnia seeds in a vibrant mix of colours.', packSizes: ['5 grams', '10 grams', '25 grams', '50 grams'], available: true },
  { name: 'Clause Petunia F1 Multiflora', categoryName: 'Flower Seeds', price: 480, discount: 23, stock: 40, brand: 'Clause', manufacturer: 'Clause Seeds India', description: 'F1 multiflora petunia for bedding, containers and hanging baskets.', packSizes: ['100 seeds', '250 seeds', '500 seeds'], available: true },
  { name: 'Sakata Sunflower Hybrid Seeds', categoryName: 'Flower Seeds', price: 190, discount: 24, stock: 90, brand: 'Sakata', manufacturer: 'Sakata Seed India Pvt Ltd', description: 'Ornamental and commercial sunflower hybrid seeds.', packSizes: ['10 grams', '25 grams', '50 grams', '100 grams', '250 grams'], available: true },
  { name: 'Advanta Dahlia Mixed Colour Seeds', categoryName: 'Flower Seeds', price: 210, discount: 25, stock: 60, brand: 'Advanta', manufacturer: 'Advanta Seeds India', description: 'Mixed colour dahlia seeds producing full double blooms.', packSizes: ['5 grams', '10 grams', '25 grams'], available: true },
  { name: 'Mahyco Cosmos Sensation Mixed Seeds', categoryName: 'Flower Seeds', price: 95, discount: 27, stock: 130, brand: 'Mahyco', manufacturer: 'Maharashtra Hybrid Seeds Company', description: 'Cosmos sensation mixed seeds for borders and cut flowers.', packSizes: ['5 grams', '10 grams', '25 grams', '50 grams'], available: true },

  // CROP NUTRITION
  { name: 'IFFCO NPK 19:19:19 Water Soluble Fertilizer', categoryName: 'Crop Nutrition', price: 560, discount: 22, stock: 150, brand: 'IFFCO', manufacturer: 'IFFCO', description: 'Fully water-soluble NPK for drip irrigation and foliar spray.', composition: 'N:P:K = 19:19:19', packSizes: ['500 grams', '1 kg', '5 kg', '25 kg', '50 kg'], available: true },
  { name: 'Coromandel Multi-K Potassium Nitrate', categoryName: 'Crop Nutrition', price: 420, discount: 24, stock: 90, brand: 'Coromandel', manufacturer: 'Coromandel International Ltd', description: 'Chloride-free potassium nitrate for quality enhancement in fruits and vegetables.', composition: 'K2O 46%, N 13%', packSizes: ['500 grams', '1 kg', '5 kg', '25 kg'], available: true },
  { name: 'Godrej Agrovet Humesol Humic Acid', categoryName: 'Crop Nutrition', price: 310, discount: 23, stock: 70, brand: 'Godrej Agrovet', manufacturer: 'Godrej Agrovet Ltd', description: 'Humic acid-based bio stimulant to improve soil health and nutrient uptake.', composition: 'Humic Acid 12%, Fulvic Acid 2%', packSizes: ['250 ml', '500 ml', '1 Litre', '5 Litre'], available: true },
  { name: 'Bayer Fertimax Zinc Sulphate', categoryName: 'Crop Nutrition', price: 185, discount: 23, stock: 110, brand: 'Bayer', manufacturer: 'Bayer CropScience India', description: 'Zinc sulphate micronutrient for correcting zinc deficiency in crops.', composition: 'Zinc Sulphate 33%', packSizes: ['500 grams', '1 kg', '5 kg', '25 kg'], available: true },
  { name: 'Mahindra Agri Boron 20% Fertilizer', categoryName: 'Crop Nutrition', price: 260, discount: 24, stock: 80, brand: 'Mahindra Agri', manufacturer: 'Mahindra Agri Solutions', description: 'Boron micronutrient for improving fruit set and seed development.', composition: 'Boron 20%', packSizes: ['250 grams', '500 grams', '1 kg', '5 kg'], available: true },
  { name: 'Syngenta Calbit C Calcium Boron', categoryName: 'Crop Nutrition', price: 490, discount: 22, stock: 60, brand: 'Syngenta', manufacturer: 'Syngenta India Ltd', description: 'Calcium and boron liquid fertilizer for fruit quality and cell wall strength.', composition: 'Calcium 15%, Boron 0.2%', packSizes: ['250 ml', '500 ml', '1 Litre', '5 Litre'], available: true },

  // INSECTICIDES
  { name: 'Bayer Confidor 200 SL Imidacloprid', categoryName: 'Insecticides', price: 620, discount: 21, stock: 60, brand: 'Bayer', manufacturer: 'Bayer CropScience India', description: 'Systemic insecticide for whiteflies, aphids and thrips control.', activeIngredient: 'Imidacloprid 200 SL', packSizes: ['100 ml', '250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'Syngenta Actara 25 WG Thiamethoxam', categoryName: 'Insecticides', price: 480, discount: 23, stock: 50, brand: 'Syngenta', manufacturer: 'Syngenta India Ltd', description: 'Neonicotinoid insecticide for sucking pest control via soil and foliar application.', activeIngredient: 'Thiamethoxam 25% WG', packSizes: ['100 grams', '250 grams', '500 grams', '1 kg'], available: true },
  { name: 'UPL Lancer Gold Acephate 50%', categoryName: 'Insecticides', price: 350, discount: 22, stock: 70, brand: 'UPL', manufacturer: 'UPL Limited', description: 'Broad-spectrum organophosphate insecticide for foliar application.', activeIngredient: 'Acephate 50% SP', packSizes: ['100 grams', '250 grams', '500 grams', '1 kg'], available: true },
  { name: 'Dhanuka Tafgor Dimethoate 30%', categoryName: 'Insecticides', price: 270, discount: 23, stock: 90, brand: 'Dhanuka', manufacturer: 'Dhanuka Agritech Ltd', description: 'Systemic and contact organophosphate insecticide.', activeIngredient: 'Dimethoate 30% EC', packSizes: ['250 ml', '500 ml', '1 Litre', '5 Litre'], available: true },
  { name: 'BASF Regent 50 SC Fipronil', categoryName: 'Insecticides', price: 890, discount: 19, stock: 35, brand: 'BASF', manufacturer: 'BASF India Ltd', description: 'Phenylpyrazole insecticide for soil and foliar pest control.', activeIngredient: 'Fipronil 50 SC', packSizes: ['100 ml', '250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'Adama Neostar Neo-Nicotinoid Spray', categoryName: 'Insecticides', price: 310, discount: 23, stock: 65, brand: 'Adama', manufacturer: 'Adama India Pvt Ltd', description: 'Bio-based neo-nicotinoid spray for eco-friendly pest management.', activeIngredient: 'Acetamiprid 20% SP', packSizes: ['250 ml', '500 ml', '1 Litre', '5 Litre'], available: true },

  // FUNGICIDES
  { name: 'Syngenta Amistar Top Azoxystrobin', categoryName: 'Fungicides', price: 780, discount: 20, stock: 50, brand: 'Syngenta', manufacturer: 'Syngenta India Ltd', description: 'Broad-spectrum systemic fungicide with azoxystrobin and difenoconazole.', activeIngredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC', packSizes: ['100 ml', '250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'UPL Saaf Carbendazim 12% + Mancozeb 63%', categoryName: 'Fungicides', price: 210, discount: 25, stock: 100, brand: 'UPL', manufacturer: 'UPL Limited', description: 'Combination fungicide for powdery mildew, leaf spot and blight.', activeIngredient: 'Carbendazim 12% + Mancozeb 63% WP', packSizes: ['100 grams', '250 grams', '500 grams', '1 kg'], available: true },
  { name: 'BASF Cabrio Top Pyraclostrobin', categoryName: 'Fungicides', price: 920, discount: 20, stock: 30, brand: 'BASF', manufacturer: 'BASF India Ltd', description: 'Strobilurin fungicide offering curative and preventive disease control.', activeIngredient: 'Pyraclostrobin 5% + Metiram 55% WG', packSizes: ['100 grams', '250 grams', '500 grams'], available: true },
  { name: 'Bayer Nativo Tebuconazole + Trifloxystrobin', categoryName: 'Fungicides', price: 650, discount: 21, stock: 45, brand: 'Bayer', manufacturer: 'Bayer CropScience India', description: 'Combination fungicide for control of multiple foliar diseases.', activeIngredient: 'Tebuconazole 50% + Trifloxystrobin 25% WG', packSizes: ['100 grams', '250 grams', '500 grams', '1 kg'], available: true },
  { name: 'Dhanuka Dhanucop Copper Oxychloride 50%', categoryName: 'Fungicides', price: 180, discount: 25, stock: 100, brand: 'Dhanuka', manufacturer: 'Dhanuka Agritech Ltd', description: 'Contact fungicide and bactericide for broad-spectrum disease control.', activeIngredient: 'Copper Oxychloride 50% WP', packSizes: ['250 grams', '500 grams', '1 kg', '5 kg'], available: true },
  { name: 'Adama Hexadhan Hexaconazole 5% SC', categoryName: 'Fungicides', price: 340, discount: 23, stock: 60, brand: 'Adama', manufacturer: 'Adama India Pvt Ltd', description: 'Systemic triazole fungicide for powdery mildew and sheath blight.', activeIngredient: 'Hexaconazole 5% SC', packSizes: ['100 ml', '250 ml', '500 ml', '1 Litre'], available: true },

  // HERBICIDES
  { name: 'Syngenta Gramoxone Paraquat 24% SL', categoryName: 'Herbicides', price: 480, discount: 23, stock: 50, brand: 'Syngenta', manufacturer: 'Syngenta India Ltd', description: 'Non-selective contact herbicide for quick knockdown of weeds.', activeIngredient: 'Paraquat Dichloride 24% SL', packSizes: ['250 ml', '500 ml', '1 Litre', '5 Litre'], available: true },
  { name: 'Bayer Nominee Gold Bispyribac Sodium', categoryName: 'Herbicides', price: 720, discount: 20, stock: 40, brand: 'Bayer', manufacturer: 'Bayer CropScience India', description: 'Selective post-emergent herbicide for rice weed management.', activeIngredient: 'Bispyribac Sodium 10% SC', packSizes: ['100 ml', '250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'UPL Roundup Glyphosate 41% SL', categoryName: 'Herbicides', price: 310, discount: 23, stock: 80, brand: 'UPL', manufacturer: 'UPL Limited', description: 'Post-emergent systemic herbicide for broad-spectrum weed control.', activeIngredient: 'Glyphosate 41% SL', packSizes: ['500 ml', '1 Litre', '5 Litre'], available: true },
  { name: 'Dhanuka Targa Super Quizalofop', categoryName: 'Herbicides', price: 360, discount: 22, stock: 65, brand: 'Dhanuka', manufacturer: 'Dhanuka Agritech Ltd', description: 'Selective graminicide for narrow-leaved weed control in broad-leaf crops.', activeIngredient: 'Quizalofop Ethyl 5% EC', packSizes: ['250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'BASF Stomp Aqua Pendimethalin', categoryName: 'Herbicides', price: 540, discount: 22, stock: 55, brand: 'BASF', manufacturer: 'BASF India Ltd', description: 'Pre-emergent herbicide for control of annual grasses and broad-leaved weeds.', activeIngredient: 'Pendimethalin 38.7% CS', packSizes: ['250 ml', '500 ml', '1 Litre', '5 Litre'], available: true },
  { name: 'Adama Weedmar Super 2,4-D Amine', categoryName: 'Herbicides', price: 195, discount: 25, stock: 90, brand: 'Adama', manufacturer: 'Adama India Pvt Ltd', description: 'Selective post-emergent herbicide for broad-leaved weed control in cereals.', activeIngredient: '2,4-D Amine Salt 58% SL', packSizes: ['500 ml', '1 Litre', '5 Litre'], available: true },

  // BIO INSECTICIDES
  { name: 'Bioneem Plus Azadirachtin 1500 ppm', categoryName: 'Bio Insecticides', price: 280, discount: 24, stock: 90, brand: 'Bioneem', manufacturer: 'Excel Industries Ltd', description: 'High-concentration neem-based biopesticide for insect repellent and antifeedant action.', activeIngredient: 'Azadirachtin 1500 ppm EC', packSizes: ['250 ml', '500 ml', '1 Litre', '5 Litre'], available: true },
  { name: 'Multiplex Metarhizium Bio Insecticide', categoryName: 'Bio Insecticides', price: 340, discount: 23, stock: 60, brand: 'Multiplex', manufacturer: 'Multiplex Bio-Tech Pvt Ltd', description: 'Entomopathogenic fungus for soil-borne and foliar insect pest control.', activeIngredient: 'Metarhizium anisopliae 1x10^8 cfu/g', packSizes: ['250 grams', '500 grams', '1 kg', '5 kg'], available: true },
  { name: 'Godrej Beauveria Bassiana Spray', categoryName: 'Bio Insecticides', price: 390, discount: 24, stock: 50, brand: 'Godrej Agrovet', manufacturer: 'Godrej Agrovet Ltd', description: 'Fungal bio-insecticide for whitefly, thrips and aphid management.', activeIngredient: 'Beauveria bassiana 1.15% WP', packSizes: ['250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'PI Industries Spinosad 45% SC', categoryName: 'Bio Insecticides', price: 720, discount: 22, stock: 35, brand: 'PI Industries', manufacturer: 'PI Industries Ltd', description: 'Microbial-derived insecticide for lepidopteran and thrips control.', activeIngredient: 'Spinosad 45% SC', packSizes: ['100 ml', '250 ml', '500 ml', '1 Litre'], available: true },
  { name: 'Biostadt Verticillium Lecanii Powder', categoryName: 'Bio Insecticides', price: 260, discount: 24, stock: 55, brand: 'Biostadt', manufacturer: 'Biostadt India Ltd', description: 'Biological fungal agent for whitefly and aphid biocontrol.', activeIngredient: 'Verticillium lecanii 1x10^8 cfu/g WP', packSizes: ['250 grams', '500 grams', '1 kg'], available: true },
  { name: 'Koppert BV Trichoderma Harzianum', categoryName: 'Bio Insecticides', price: 310, discount: 23, stock: 65, brand: 'Koppert', manufacturer: 'Koppert Biological Systems', description: 'Soil bio-agent for root disease prevention and plant growth promotion.', activeIngredient: 'Trichoderma harzianum 1x10^6 cfu/g WP', packSizes: ['250 grams', '500 grams', '1 kg', '5 kg'], available: true },

  // FARMING TOOLS
  { name: 'Knapsack Battery Operated Sprayer 16L', categoryName: 'Farming Tools', price: 2800, discount: 22, stock: 25, brand: 'Generic', manufacturer: 'Various', description: '16-litre battery-operated knapsack sprayer for field and orchard use.', packSizes: ['1 Piece'], available: true },
  { name: 'Wolf Garten Stainless Steel Trowel Set', categoryName: 'Farming Tools', price: 1150, discount: 23, stock: 40, brand: 'Wolf Garten', manufacturer: 'Wolf Garten GmbH', description: 'Stainless steel garden trowel set for planting and transplanting.', packSizes: ['1 Piece', '2 Piece Set', '5 Piece Set'], available: true },
  { name: 'Honda Power Weeder FJ500', categoryName: 'Farming Tools', price: 38500, discount: 20, stock: 8, brand: 'Honda', manufacturer: 'Honda India Power Products', description: 'Petrol-powered rotary tiller and cultivator for inter-row cultivation.', packSizes: ['1 Unit'], available: true },
  { name: 'Plastic Garden Cultivator Weeder', categoryName: 'Farming Tools', price: 320, discount: 24, stock: 80, brand: 'Generic', manufacturer: 'Various', description: 'Lightweight plastic cultivator for loosening soil between rows.', packSizes: ['1 Piece', '3 Piece Set'], available: true },
  { name: 'Stihl FS 38 Petrol Brush Cutter', categoryName: 'Farming Tools', price: 14500, discount: 19, stock: 12, brand: 'Stihl', manufacturer: 'Stihl India', description: 'Lightweight petrol brush cutter for grass and weed clearing.', packSizes: ['1 Unit'], available: true },
  { name: 'Safety Nitrile Hand Gloves Pack', categoryName: 'Farming Tools', price: 180, discount: 28, stock: 150, brand: 'Generic', manufacturer: 'Various', description: 'Chemical-resistant nitrile gloves for pesticide application and farm work.', packSizes: ['Small', 'Medium', 'Large', 'XL'], available: true },

  // PLANTS
  { name: 'Grafted Mango Alphonso Sapling', categoryName: 'Plants', price: 350, discount: 22, stock: 30, brand: 'Local Nursery', manufacturer: 'Various Nurseries', description: 'Grafted Alphonso mango sapling for early and heavy bearing.', suitableCrops: ['Mango'], packSizes: ['1 Plant', '2 Plants', '5 Plants', '10 Plants'], available: true },
  { name: 'Curry Leaf Plant (Kadipatta)', categoryName: 'Plants', price: 80, discount: 33, stock: 80, brand: 'Local Nursery', manufacturer: 'Various Nurseries', description: 'Healthy curry leaf plant for home gardens and farms.', packSizes: ['1 Plant', '3 Plants', '5 Plants'], available: true },
  { name: 'Grafted Guava L-49 Sapling', categoryName: 'Plants', price: 180, discount: 25, stock: 45, brand: 'Local Nursery', manufacturer: 'Various Nurseries', description: 'Grafted L-49 guava variety known for large, sweet fruits.', suitableCrops: ['Guava'], packSizes: ['1 Plant', '2 Plants', '5 Plants', '10 Plants'], available: true },
  { name: 'Aloe Vera Medicinal Plant', categoryName: 'Plants', price: 60, discount: 33, stock: 100, brand: 'Local Nursery', manufacturer: 'Various Nurseries', description: 'Aloe vera plant for medicinal, cosmetic and agricultural use.', packSizes: ['1 Plant', '5 Plants', '10 Plants', '25 Plants'], available: true },
  { name: 'Lemon (Nimbu) Grafted Plant', categoryName: 'Plants', price: 120, discount: 25, stock: 55, brand: 'Local Nursery', manufacturer: 'Various Nurseries', description: 'Grafted lemon plant with early bearing and round, juicy fruits.', suitableCrops: ['Lemon', 'Nimbu'], packSizes: ['1 Plant', '2 Plants', '5 Plants'], available: true },
  { name: 'Rose Ornamental Grafted Plant', categoryName: 'Plants', price: 150, discount: 25, stock: 60, brand: 'Local Nursery', manufacturer: 'Various Nurseries', description: 'Grafted rose plant available in multiple colour varieties.', packSizes: ['1 Plant', '3 Plants', '5 Plants'], available: true },
];

// ─── Seed function ──────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 30000 });
    console.log('MongoDB connected');

    // 1. Upsert categories
    console.log('\nCreating categories...');
    const categoryMap = {};
    for (const cat of CATEGORIES) {
      const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const doc = await Category.findOneAndUpdate(
        { name: cat.name },
        { ...cat, slug },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      categoryMap[cat.name] = doc._id;
      console.log('  Category: ' + cat.name);
    }

    // 2. Seed products (skip duplicates by name)
    console.log('\nSeeding products...');
    let added = 0, skipped = 0;
    for (const p of PRODUCTS_DATA) {
      const catId = categoryMap[p.categoryName];
      if (!catId) {
        console.warn('  WARNING: Category not found for: ' + p.name + ' (' + p.categoryName + ')');
        skipped++;
        continue;
      }
      const exists = await Product.findOne({ name: p.name });
      if (exists) {
        console.log('  Skipped (exists): ' + p.name);
        skipped++;
        continue;
      }
      const { categoryName, ...productData } = p;
      await Product.create({ ...productData, category: catId });
      console.log('  Added: ' + p.name);
      added++;
    }

    console.log('\nDone! Added: ' + added + ', Skipped: ' + skipped);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seed();
