// Comprehensive Plant Database for Karnataka Region
// World-class encyclopedia with rich information
//hi
export interface PlantData {
  id: string;
  name: string;
  scientificName: string;
  category: 'vegetable' | 'fruit' | 'flower' | 'herb' | 'tree' | 'grain';
  image: string;
  description: string;
  funFact: string;
  growingSeasons: string[];
  sunlight: string;
  watering: string;
  soilType: string;
  temperature: string;
  harvestTime: string;
  spacing: string;
  companionPlants: string[];
  avoidPlanting: string[];
  pests: string[];
  diseases: string[];
  benefits: string[];
  karnatakaRegions: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  spaceRequired: string;
  lifespan: string;
  propagation: string[];
  fertilizer: string;
  commonUses: string[];
  nutritionalValue?: string;
  medicinalUses?: string;
  culturalSignificance?: string;
  emojis: string;
}

export const PLANTS_DATABASE: PlantData[] = [
  // VEGETABLES
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'vegetable',
    image: '🍅',
    emojis: '🍅🌱☀️',
    description: 'Juicy red fruit-vegetable loved worldwide! Perfect for Karnataka\'s climate.',
    funFact: 'Tomatoes were once thought to be poisonous! Now we eat 170 million tons yearly!',
    growingSeasons: ['October-February', 'June-August'],
    sunlight: '6-8 hours full sun daily',
    watering: 'Regular, 1-2 inches per week. Deep watering preferred.',
    soilType: 'Well-draining, slightly acidic (pH 6.0-6.8), rich in organic matter',
    temperature: '21-29°C ideal. Sensitive to frost.',
    harvestTime: '60-80 days after transplanting',
    spacing: '60cm between plants, 90cm between rows',
    companionPlants: ['Basil', 'Marigold', 'Carrots', 'Onions', 'Garlic'],
    avoidPlanting: ['Potatoes', 'Fennel', 'Cabbage', 'Corn'],
    pests: ['Aphids', 'Whiteflies', 'Tomato Hornworm', 'Fruit Borer'],
    diseases: ['Early Blight', 'Late Blight', 'Fusarium Wilt', 'Leaf Curl Virus'],
    benefits: ['Rich in Lycopene (antioxidant)', 'Vitamin C', 'Potassium', 'Heart health'],
    karnatakaRegions: ['Kolar', 'Belgaum', 'Bangalore Rural', 'Hassan', 'Mandya'],
    difficulty: 'Medium',
    spaceRequired: '1-2 sq ft per plant',
    lifespan: '6-8 months (annual)',
    propagation: ['Seeds', 'Transplants'],
    fertilizer: '5-10-10 NPK. Side-dress with compost monthly.',
    commonUses: ['Salads', 'Cooking', 'Sauces', 'Juices', 'Chutneys'],
    nutritionalValue: 'Vitamin C, Lycopene, Potassium, Folate',
    culturalSignificance: 'Essential in Indian curries, rasam, and sambhar!'
  },
  {
    id: 'brinjal',
    name: 'Brinjal (Eggplant)',
    scientificName: 'Solanum melongena',
    category: 'vegetable',
    image: '🍆',
    emojis: '🍆🌿💜',
    description: 'Purple beauty of Indian gardens! Known as "King of Vegetables".',
    funFact: 'India is the world\'s largest brinjal producer - we grow over 12 million tons!',
    growingSeasons: ['June-July', 'October-November'],
    sunlight: '6-8 hours daily. Loves heat!',
    watering: 'Moderate. Water when top 2 inches of soil is dry.',
    soilType: 'Well-drained loamy soil, pH 5.5-6.5',
    temperature: '24-30°C optimal',
    harvestTime: '80-90 days from sowing',
    spacing: '60cm apart in rows 75cm apart',
    companionPlants: ['Beans', 'Peas', 'Spinach', 'Thyme'],
    avoidPlanting: ['Tomatoes', 'Peppers', 'Potatoes'],
    pests: ['Shoot and Fruit Borer', 'Aphids', 'Jassids', 'Spider Mites'],
    diseases: ['Bacterial Wilt', 'Phomopsis Blight', 'Little Leaf Disease'],
    benefits: ['Low calorie', 'Fiber-rich', 'Antioxidants', 'Brain health'],
    karnatakaRegions: ['Mysore', 'Belgaum', 'Dharwad', 'Tumkur', 'Raichur'],
    difficulty: 'Easy',
    spaceRequired: '2 sq ft per plant',
    lifespan: '5-6 months',
    propagation: ['Seeds'],
    fertilizer: 'Balanced NPK 10-10-10. Organic compost preferred.',
    commonUses: ['Baingan Bharta', 'Curries', 'Pickles', 'Frying', 'Stuffed recipes'],
    nutritionalValue: 'Nasunin (antioxidant), Fiber, Vitamins B1, B6',
    culturalSignificance: 'Star ingredient in Karnataka\'s Badane Kayi Palya!'
  },
  {
    id: 'chili',
    name: 'Chili Pepper',
    scientificName: 'Capsicum annuum',
    category: 'vegetable',
    image: '🌶️',
    emojis: '🌶️🔥🌱',
    description: 'The fire in Indian cuisine! From mild to "call the fire brigade" hot!',
    funFact: 'The "heat" in chili comes from capsaicin - it can even dissolve in alcohol, not water!',
    growingSeasons: ['June-August', 'October-November'],
    sunlight: '6-8 hours. Thrives in warmth.',
    watering: 'Regular but moderate. Avoid waterlogging.',
    soilType: 'Well-drained sandy loam, pH 6.0-7.0',
    temperature: '20-30°C',
    harvestTime: '90-120 days',
    spacing: '45cm between plants',
    companionPlants: ['Basil', 'Onions', 'Carrots', 'Tomatoes'],
    avoidPlanting: ['Beans', 'Cabbage', 'Fennel'],
    pests: ['Aphids', 'Thrips', 'Mites', 'Fruit Borer'],
    diseases: ['Anthracnose', 'Powdery Mildew', 'Leaf Curl', 'Bacterial Wilt'],
    benefits: ['Boosts metabolism', 'Pain relief', 'Vitamin C', 'Anti-inflammatory'],
    karnatakaRegions: ['Byadagi', 'Haveri', 'Shimoga', 'Bellary', 'Gulbarga'],
    difficulty: 'Easy',
    spaceRequired: '1.5 sq ft',
    lifespan: '4-5 months (can perennialize)',
    propagation: ['Seeds', 'Cuttings'],
    fertilizer: 'High potassium for fruit development. Fish emulsion works great.',
    commonUses: ['Spice', 'Pickles', 'Powder', 'Chutneys', 'Tempering'],
    nutritionalValue: 'Vitamin A, C, Capsaicin, Antioxidants',
    medicinalUses: 'Pain relief, metabolism boost, digestive aid',
    culturalSignificance: 'Byadagi chili is world-famous for its color and mild heat!'
  },

  // FRUITS
  {
    id: 'mango',
    name: 'Mango',
    scientificName: 'Mangifera indica',
    category: 'fruit',
    image: '🥭',
    emojis: '🥭👑🌳',
    description: 'King of Fruits! India\'s national fruit and the world\'s favorite summer treat.',
    funFact: 'Mango leaves are used in Hindu rituals! And there are over 1000 mango varieties!',
    growingSeasons: ['June-July (planting)', 'March-June (fruiting)'],
    sunlight: 'Full sun, 8+ hours',
    watering: 'Deep watering weekly. Reduce during flowering.',
    soilType: 'Well-drained, deep loamy soil, pH 5.5-7.5',
    temperature: '24-30°C. Needs warm climate.',
    harvestTime: '3-5 years to first fruit, then annually',
    spacing: '10-12 meters between trees',
    companionPlants: ['Banana', 'Papaya', 'Coconut', 'Legumes'],
    avoidPlanting: ['Nothing specific - mangoes are friendly!'],
    pests: ['Mango Hopper', 'Fruit Fly', 'Mealybugs', 'Stem Borer'],
    diseases: ['Anthracnose', 'Powdery Mildew', 'Bacterial Canker', 'Malformation'],
    benefits: ['Vitamin A powerhouse', 'Digestive enzymes', 'Immunity boost', 'Skin health'],
    karnatakaRegions: ['Ratnagiri-Devgad', 'Bangalore', 'Mysore', 'Shimoga', 'Dharwad'],
    difficulty: 'Medium',
    spaceRequired: '100+ sq ft (large tree)',
    lifespan: '100+ years!',
    propagation: ['Grafting', 'Budding', 'Seeds (not true to type)'],
    fertilizer: 'Balanced NPK during growth, high potassium during fruiting.',
    commonUses: ['Fresh eating', 'Juice', 'Pickles', 'Aamras', 'Ice cream', 'Chutneys'],
    nutritionalValue: 'Vitamin A, C, E, Fiber, Folate, Potassium',
    culturalSignificance: 'Symbol of love and prosperity! Leaves used in Hindu weddings.',
    medicinalUses: 'Digestive aid, immune booster, eye health'
  },
  {
    id: 'banana',
    name: 'Banana',
    scientificName: 'Musa spp.',
    category: 'fruit',
    image: '🍌',
    emojis: '🍌🌴💛',
    description: 'The perfect portable snack! Grows fast and feeds millions.',
    funFact: 'Bananas are berries, but strawberries aren\'t! Also, they\'re slightly radioactive!',
    growingSeasons: ['Year-round in Karnataka!'],
    sunlight: '12+ hours for best growth',
    watering: 'Abundant water needed. 4-6 inches per week.',
    soilType: 'Rich, well-drained loamy soil, pH 5.5-7.0',
    temperature: '26-30°C ideal',
    harvestTime: '9-12 months from planting',
    spacing: '2-3 meters apart',
    companionPlants: ['Papaya', 'Coconut', 'Turmeric', 'Ginger'],
    avoidPlanting: ['Nothing specific'],
    pests: ['Banana Weevil', 'Aphids', 'Thrips', 'Nematodes'],
    diseases: ['Panama Disease', 'Sigatoka Leaf Spot', 'Bunchy Top Virus'],
    benefits: ['Instant energy', 'Potassium rich', 'Heart health', 'Mood booster'],
    karnatakaRegions: ['Shivamogga', 'Chamarajanagar', 'Tumkur', 'Chitradurga', 'Hassan'],
    difficulty: 'Easy',
    spaceRequired: '9 sq ft per plant',
    lifespan: '25 years (clump), individual plant 9-12 months',
    propagation: ['Suckers', 'Tissue culture'],
    fertilizer: 'Heavy feeder! Balanced NPK + micronutrients monthly.',
    commonUses: ['Fresh fruit', 'Chips', 'Desserts', 'Baby food', 'Flour'],
    nutritionalValue: 'Potassium, Vitamin B6, C, Magnesium, Fiber',
    culturalSignificance: 'Banana leaves used as eco-friendly plates! Essential in South Indian meals.',
    medicinalUses: 'Energy boost, digestive health, blood pressure regulation'
  },

  // FLOWERS
  {
    id: 'marigold',
    name: 'Marigold',
    scientificName: 'Tagetes erecta',
    category: 'flower',
    image: '🌼',
    emojis: '🌼🧡✨',
    description: 'Golden sunshine in your garden! Natural pest repellent and festival favorite.',
    funFact: 'Marigolds were used by Aztecs for medicine and ceremonies! Also edible!',
    growingSeasons: ['September-October', 'February-March'],
    sunlight: '6 hours minimum',
    watering: 'Moderate. Allow soil to dry between watering.',
    soilType: 'Any well-drained soil. Very adaptable!',
    temperature: '15-25°C',
    harvestTime: '50-60 days from sowing',
    spacing: '20-30cm apart',
    companionPlants: ['Tomatoes', 'Beans', 'Roses', 'ALL VEGETABLES!'],
    avoidPlanting: ['None - marigolds protect other plants!'],
    pests: ['Aphids (minor)', 'Spider Mites', 'Slugs'],
    diseases: ['Powdery Mildew', 'Root Rot (if overwatered)'],
    benefits: ['Pest repellent', 'Attracts pollinators', 'Medicinal', 'Colorful display'],
    karnatakaRegions: ['Bangalore', 'Mysore', 'Mandya', 'Kolar', 'Tumkur'],
    difficulty: 'Easy',
    spaceRequired: '0.5 sq ft per plant',
    lifespan: '3-4 months',
    propagation: ['Seeds'],
    fertilizer: 'Light feeding. Too much nitrogen reduces flowers.',
    commonUses: ['Worship', 'Garlands', 'Decoration', 'Pest control', 'Dye'],
    medicinalUses: 'Anti-inflammatory, wound healing, skin care',
    culturalSignificance: 'Essential in Hindu pujas and weddings! Symbol of prosperity.'
  },
  {
    id: 'rose',
    name: 'Rose',
    scientificName: 'Rosa spp.',
    category: 'flower',
    image: '🌹',
    emojis: '🌹❤️🌿',
    description: 'Queen of Flowers! Symbol of love, beauty, and elegance worldwide.',
    funFact: 'Rose oil is more expensive than gold! It takes 60,000 roses to make 1 ounce!',
    growingSeasons: ['October-November (best planting)', 'December-March (flowering)'],
    sunlight: '6+ hours daily',
    watering: 'Deep watering 2-3 times per week',
    soilType: 'Rich, well-drained, slightly acidic pH 6.0-6.5',
    temperature: '15-25°C ideal',
    harvestTime: 'Year-round with proper care',
    spacing: '60-90cm apart',
    companionPlants: ['Garlic', 'Marigold', 'Lavender', 'Sage'],
    avoidPlanting: ['Large trees (compete for nutrients)'],
    pests: ['Aphids', 'Thrips', 'Beetles', 'Caterpillars'],
    diseases: ['Black Spot', 'Powdery Mildew', 'Rust', 'Botrytis Blight'],
    benefits: ['Aromatherapy', 'Skincare', 'Edible petals', 'Antioxidants'],
    karnatakaRegions: ['Bangalore', 'Mysore', 'Ooty borders', 'Kodagu', 'Hassan'],
    difficulty: 'Medium',
    spaceRequired: '2-3 sq ft per bush',
    lifespan: '5-15 years with care',
    propagation: ['Cuttings', 'Grafting', 'Budding'],
    fertilizer: 'Balanced NPK + Epsom salt monthly. Compost in winter.',
    commonUses: ['Decoration', 'Perfume', 'Rose water', 'Gulkand', 'Essential oils'],
    nutritionalValue: 'Vitamin C, Antioxidants (in hips)',
    medicinalUses: 'Skin care, digestive aid, anxiety relief',
    culturalSignificance: 'Symbol of love and offered to deities across all religions'
  },

  // HERBS
  {
    id: 'tulsi',
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum sanctum',
    category: 'herb',
    image: '🌿',
    emojis: '🌿🕉️💚',
    description: 'Sacred herb of India! Powerful medicine and spiritual significance.',
    funFact: 'Tulsi is worshipped as a goddess in Hindu tradition! NASA studied it for air purification!',
    growingSeasons: ['Year-round, best in February-March'],
    sunlight: '6-8 hours daily',
    watering: 'Regular, keep soil moist but not soggy',
    soilType: 'Well-drained, fertile soil, pH 6.0-7.5',
    temperature: '20-35°C',
    harvestTime: 'Continuous harvest after 60 days',
    spacing: '30cm apart',
    companionPlants: ['Tomatoes', 'Peppers', 'Chamomile', 'Oregano'],
    avoidPlanting: ['Rue', 'Sage'],
    pests: ['Aphids', 'Beetles', 'Whiteflies'],
    diseases: ['Root Rot', 'Leaf Spot', 'Damping Off'],
    benefits: ['Immunity booster', 'Stress relief', 'Respiratory health', 'Antibacterial'],
    karnatakaRegions: ['Every home in Karnataka!', 'Bangalore', 'Mysore', 'Dharwad'],
    difficulty: 'Easy',
    spaceRequired: '1 sq ft',
    lifespan: '2-3 years (perennial)',
    propagation: ['Seeds', 'Cuttings'],
    fertilizer: 'Light compost tea. Avoid over-fertilizing.',
    commonUses: ['Worship', 'Tea', 'Medicine', 'Cooking', 'Ayurveda'],
    nutritionalValue: 'Vitamin K, A, C, Calcium, Iron',
    medicinalUses: 'Cold/flu remedy, immunity, stress relief, respiratory health',
    culturalSignificance: 'Considered sacred! Every Hindu home has a Tulsi plant. Worshipped daily.'
  },
  {
    id: 'coriander',
    name: 'Coriander (Cilantro)',
    scientificName: 'Coriandrum sativum',
    category: 'herb',
    image: '🌱',
    emojis: '🌱🍃💚',
    description: 'Aromatic herb used in every Indian kitchen! Leaves and seeds both prized.',
    funFact: 'Coriander seeds were found in Tutankhamun\'s tomb! Used for 8000+ years!',
    growingSeasons: ['October-February (winter crop)', 'June-July (monsoon)'],
    sunlight: '4-6 hours (tolerates partial shade)',
    watering: 'Regular, keep soil evenly moist',
    soilType: 'Well-drained loamy soil, pH 6.2-6.8',
    temperature: '17-27°C ideal',
    harvestTime: '40-50 days for leaves, 90-100 for seeds',
    spacing: '15-20cm apart',
    companionPlants: ['Tomatoes', 'Beans', 'Carrots', 'Cabbage'],
    avoidPlanting: ['Fennel'],
    pests: ['Aphids', 'Mites', 'Caterpillars'],
    diseases: ['Powdery Mildew', 'Wilt', 'Blight'],
    benefits: ['Digestive aid', 'Detoxification', 'Rich in antioxidants', 'Anti-diabetic'],
    karnatakaRegions: ['Tumkur', 'Raichur', 'Belgaum', 'Gulbarga', 'Bijapur'],
    difficulty: 'Easy',
    spaceRequired: '0.5 sq ft per plant',
    lifespan: '3-4 months (annual)',
    propagation: ['Seeds'],
    fertilizer: 'Minimal. Balanced 10-10-10 once during growth.',
    commonUses: ['Garnish', 'Chutneys', 'Spice', 'Tempering', 'Salads'],
    nutritionalValue: 'Vitamin A, K, C, Folate, Potassium',
    medicinalUses: 'Digestion, blood sugar control, heavy metal detox',
    culturalSignificance: 'Essential garnish in all Indian cuisines!'
  },

  // TREES
  {
    id: 'neem',
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    category: 'tree',
    image: '🌳',
    emojis: '🌳💊🛡️',
    description: 'Village pharmacy! Every part is medicine. Natural pesticide powerhouse.',
    funFact: 'Neem can purify air and soil! Called "Divine Tree" and "Nature\'s Drugstore".',
    growingSeasons: ['June-July (monsoon planting best)'],
    sunlight: 'Full sun, loves heat',
    watering: 'Minimal once established. Drought-tolerant.',
    soilType: 'Adapts to all soils, even poor sandy soil',
    temperature: '21-32°C',
    harvestTime: '3-5 years to maturity, 100+ years lifespan',
    spacing: '8-10 meters (large tree)',
    companionPlants: ['Everything! Neem protects nearby plants'],
    avoidPlanting: ['None'],
    pests: ['Virtually pest-free!'],
    diseases: ['Rare. Very resistant.'],
    benefits: ['Medicine', 'Pesticide', 'Air purification', 'Soil improvement', 'Shade'],
    karnatakaRegions: ['Entire Karnataka', 'Bidar', 'Belgaum', 'Dharwad', 'Raichur'],
    difficulty: 'Easy',
    spaceRequired: '100+ sq ft (massive tree)',
    lifespan: '150-200 years!',
    propagation: ['Seeds', 'Cuttings'],
    fertilizer: 'Almost none needed. Very hardy.',
    commonUses: ['Medicine', 'Natural pesticide', 'Toothbrush', 'Soap', 'Timber'],
    nutritionalValue: 'Not for eating (leaves used medicinally)',
    medicinalUses: 'Antibacterial, antifungal, anti-diabetic, skin care, dental health',
    culturalSignificance: 'Sacred in Indian culture. Planted near temples and homes for protection.'
  },

  // GRAINS
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    scientificName: 'Oryza sativa',
    category: 'grain',
    image: '🌾',
    emojis: '🌾🍚🌊',
    description: 'Staple food for billions! Karnataka grows aromatic and nutritious varieties.',
    funFact: 'Rice feeds more than half of humanity! Over 40,000 varieties exist worldwide!',
    growingSeasons: ['June-July (Kharif)', 'November-December (Rabi)'],
    sunlight: 'Full sun 6-8 hours',
    watering: 'Flooded field for most of growth period',
    soilType: 'Clay or loam, pH 5.5-6.5. Can grow in waterlogged soil.',
    temperature: '20-35°C',
    harvestTime: '120-150 days',
    spacing: '20x20 cm for transplanting',
    companionPlants: ['Fish (in paddy fields!)', 'Azolla (nitrogen fixing)'],
    avoidPlanting: ['Dry land crops'],
    pests: ['Stem Borer', 'Leaf Folder', 'Gall Midge', 'Brown Plant Hopper'],
    diseases: ['Blast', 'Bacterial Blight', 'Sheath Blight'],
    benefits: ['Energy source', 'Gluten-free', 'Easy to digest', 'Versatile'],
    karnatakaRegions: ['Mandya', 'Shimoga', 'Mysore', 'Raichur', 'Bellary'],
    difficulty: 'Medium',
    spaceRequired: 'Requires paddy field with water management',
    lifespan: '4-5 months (annual)',
    propagation: ['Seeds', 'Transplanting seedlings'],
    fertilizer: 'Balanced NPK, split application. Urea for nitrogen.',
    commonUses: ['Staple food', 'Rice flour', 'Flakes', 'Beverages', 'Starch'],
    nutritionalValue: 'Carbohydrates, Protein, Vitamins B1, B3',
    culturalSignificance: 'Offered in temples, used in weddings. Symbol of prosperity!'
  },
];

// Helper functions
export const getPlantsByCategory = (category: string): PlantData[] => {
  return PLANTS_DATABASE.filter(plant => plant.category === category);
};

export const searchPlants = (query: string): PlantData[] => {
  const lowerQuery = query.toLowerCase();
  return PLANTS_DATABASE.filter(plant => 
    plant.name.toLowerCase().includes(lowerQuery) ||
    plant.scientificName.toLowerCase().includes(lowerQuery) ||
    plant.description.toLowerCase().includes(lowerQuery) ||
    plant.commonUses.some(use => use.toLowerCase().includes(lowerQuery))
  );
};

export const getPlantById = (id: string): PlantData | undefined => {
  return PLANTS_DATABASE.find(plant => plant.id === id);
};

export const getRandomPlant = (): PlantData => {
  return PLANTS_DATABASE[Math.floor(Math.random() * PLANTS_DATABASE.length)];
};

export const getSeasonalPlants = (): PlantData[] => {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const monsoon = [6, 7, 8, 9]; // June-Sept
  const winter = [10, 11, 12, 1, 2]; // Oct-Feb
  const summer = [3, 4, 5]; // Mar-May
  
  if (monsoon.includes(currentMonth)) {
    return PLANTS_DATABASE.filter(p => 
      p.growingSeasons.some(s => s.includes('June') || s.includes('July'))
    );
  } else if (winter.includes(currentMonth)) {
    return PLANTS_DATABASE.filter(p => 
      p.growingSeasons.some(s => s.includes('October') || s.includes('November') || s.includes('February'))
    );
  }
  return PLANTS_DATABASE;
};
