/**
 * ShambaNi Complete Product Catalog
 * Categories with sub-product options for web, mobile, and USSD
 * Covers all East African agricultural produce
 * 
 * File: src/data/productCategories.ts
 * GitHub: ReaganLutwa/Shambani-marketplace
 */

export interface ProductSubcategory {
  id: string;
  name: string;
  nameLg?: string;    // Luganda
  nameSw?: string;    // Swahili
  unit: string;       // kg, bunch, litre, tray, dozen, etc.
  avgPriceRange?: {   // UGX price guidance
    min: number;
    max: number;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  nameLg?: string;
  nameSw?: string;
  icon: string;
  subcategories: ProductSubcategory[];
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'vegetables',
    name: 'Vegetables',
    nameLg: 'Ebyobulimi',
    nameSw: 'Mboga',
    icon: '🥬',
    subcategories: [
      { id: 'tomatoes', name: 'Tomatoes', nameLg: 'Ennyaanya', nameSw: 'Nyanya', unit: 'kg', avgPriceRange: { min: 2000, max: 5000 } },
      { id: 'onions', name: 'Onions', nameLg: 'Ebikopo', nameSw: 'Vitunguu', unit: 'kg', avgPriceRange: { min: 3000, max: 8000 } },
      { id: 'cabbage', name: 'Cabbage', nameLg: 'Kabbeji', nameSw: 'Kabichi', unit: 'head', avgPriceRange: { min: 1500, max: 4000 } },
      { id: 'carrots', name: 'Carrots', nameLg: 'Kkarooti', nameSw: 'Karoti', unit: 'kg', avgPriceRange: { min: 2000, max: 5000 } },
      { id: 'eggplant', name: 'Eggplant (Biringanya)', nameLg: 'Biringanya', nameSw: 'Bilinganya', unit: 'kg', avgPriceRange: { min: 2000, max: 4000 } },
      { id: 'green_peppers', name: 'Green Peppers', nameLg: 'Pipa ya Bululu', nameSw: 'Pilipili Hoho', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'spinach', name: 'Spinach', nameLg: 'Spinachi', nameSw: 'Mchicha', unit: 'bunch', avgPriceRange: { min: 1000, max: 3000 } },
      { id: 'amaranthus', name: 'Amaranthus (Dodo)', nameLg: 'Doodo', nameSw: 'Mchicha', unit: 'bunch', avgPriceRange: { min: 1000, max: 2500 } },
      { id: 'pumpkin_leaves', name: 'Pumpkin Leaves', nameLg: 'Luwombo', nameSw: 'Majani ya Maboga', unit: 'bunch', avgPriceRange: { min: 1000, max: 2000 } },
      { id: 'bitter_leaf', name: 'Bitter Leaf (Olugya)', nameLg: 'Olugya', nameSw: 'Mchicha wa Kibichi', unit: 'bunch', avgPriceRange: { min: 1000, max: 2000 } },
      { id: 'okra', name: 'Okra', nameLg: 'Bamiya', nameSw: 'Bamia', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'cauliflower', name: 'Cauliflower', nameLg: 'Kkalifulaaya', nameSw: 'Kauliflower', unit: 'head', avgPriceRange: { min: 3000, max: 7000 } },
      { id: 'broccoli', name: 'Broccoli', nameLg: 'Brokkoli', nameSw: 'Brokoli', unit: 'kg', avgPriceRange: { min: 5000, max: 12000 } },
      { id: 'lettuce', name: 'Lettuce', nameLg: 'Lettuce', nameSw: 'Lettuce', unit: 'head', avgPriceRange: { min: 1500, max: 4000 } },
      { id: 'spring_onions', name: 'Spring Onions', nameLg: 'Spring Onions', nameSw: 'Vitunguu vya Majani', unit: 'bunch', avgPriceRange: { min: 1500, max: 3000 } },
      { id: 'beetroot', name: 'Beetroot', nameLg: 'Beetroot', nameSw: 'Beetroot', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'cucumber', name: 'Cucumber', nameLg: 'Kukyamba', nameSw: 'Tango', unit: 'kg', avgPriceRange: { min: 2000, max: 4000 } },
      { id: 'green_beans', name: 'Green Beans', nameLg: 'Bbinza', nameSw: 'Maharage ya Kijani', unit: 'kg', avgPriceRange: { min: 4000, max: 8000 } },
    ]
  },
  {
    id: 'fruits',
    name: 'Fruits',
    nameLg: 'Ebibala',
    nameSw: 'Matunda',
    icon: '🍌',
    subcategories: [
      { id: 'bananas', name: 'Bananas (Matooke)', nameLg: 'Matooke', nameSw: 'Ndizi', unit: 'bunch', avgPriceRange: { min: 10000, max: 25000 } },
      { id: 'plantain', name: 'Plantain (Gonja)', nameLg: 'Gonja', nameSw: 'Ndizi za Kukaanga', unit: 'bunch', avgPriceRange: { min: 8000, max: 20000 } },
      { id: 'mangoes', name: 'Mangoes', nameLg: 'Mangoo', nameSw: 'Embe', unit: 'kg', avgPriceRange: { min: 3000, max: 8000 } },
      { id: 'pineapples', name: 'Pineapples', nameLg: 'Enaanansi', nameSw: 'Nanasi', unit: 'piece', avgPriceRange: { min: 3000, max: 7000 } },
      { id: 'watermelon', name: 'Watermelon', nameLg: 'Watermelon', nameSw: 'Tikiti Maji', unit: 'piece', avgPriceRange: { min: 5000, max: 15000 } },
      { id: 'papaya', name: 'Papaya (Pawpaw)', nameLg: 'Pawpaw', nameSw: 'Papai', unit: 'piece', avgPriceRange: { min: 2000, max: 5000 } },
      { id: 'avocado', name: 'Avocado', nameLg: 'Avocado', nameSw: 'Parachichi', unit: 'piece', avgPriceRange: { min: 1000, max: 3000 } },
      { id: 'passion_fruit', name: 'Passion Fruit', nameLg: 'Passion Fruit', nameSw: 'Tunda la Matunda', unit: 'kg', avgPriceRange: { min: 5000, max: 12000 } },
      { id: 'oranges', name: 'Oranges', nameLg: 'Enkomaawo', nameSw: 'Machungwa', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'lemons', name: 'Lemons', nameLg: 'Lemons', nameSw: 'Ndimu', unit: 'kg', avgPriceRange: { min: 4000, max: 8000 } },
      { id: 'jackfruit', name: 'Jackfruit', nameLg: 'Fene', nameSw: 'Fenesi', unit: 'kg', avgPriceRange: { min: 2000, max: 5000 } },
      { id: 'guava', name: 'Guava', nameLg: 'Mupeera', nameSw: 'Mapera', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'tangerines', name: 'Tangerines', nameLg: 'Tangerines', nameSw: 'Chenza', unit: 'kg', avgPriceRange: { min: 4000, max: 8000 } },
      { id: 'apples', name: 'Apples', nameLg: 'Apples', nameSw: 'Tufaa', unit: 'kg', avgPriceRange: { min: 6000, max: 15000 } },
      { id: 'grapes', name: 'Grapes', nameLg: 'Grapes', nameSw: 'Zabibu', unit: 'kg', avgPriceRange: { min: 10000, max: 25000 } },
    ]
  },
  {
    id: 'grains',
    name: 'Grains',
    nameLg: 'Ebyobulimi',
    nameSw: 'Nafaka',
    icon: '🌽',
    subcategories: [
      { id: 'maize', name: 'Maize (Corn)', nameLg: 'Kasoli', nameSw: 'Mahindi', unit: 'kg', avgPriceRange: { min: 1500, max: 3000 } },
      { id: 'maize_flour', name: 'Maize Flour (Posho)', nameLg: 'Kawunga', nameSw: 'Unga wa Mahindi', unit: 'kg', avgPriceRange: { min: 2000, max: 4000 } },
      { id: 'rice', name: 'Rice', nameLg: 'Muceere', nameSw: 'Mchele', unit: 'kg', avgPriceRange: { min: 4000, max: 8000 } },
      { id: 'millet', name: 'Millet', nameLg: 'Kalo', nameSw: 'Mtama', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'millet_flour', name: 'Millet Flour (Kalo)', nameLg: 'Kalo', nameSw: 'Unga wa Mtama', unit: 'kg', avgPriceRange: { min: 4000, max: 7000 } },
      { id: 'sorghum', name: 'Sorghum', nameLg: 'Sorghum', nameSw: 'Mtama Mweupe', unit: 'kg', avgPriceRange: { min: 2500, max: 5000 } },
      { id: 'simsim', name: 'SIM SIM (Sesame)', nameLg: 'SIM SIM', nameSw: 'Ufuta', unit: 'kg', avgPriceRange: { min: 8000, max: 15000 } },
      { id: 'wheat', name: 'Wheat', nameLg: 'Wheat', nameSw: 'Ngano', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'wheat_flour', name: 'Wheat Flour', nameLg: 'Wheat Flour', nameSw: 'Unga wa Ngano', unit: 'kg', avgPriceRange: { min: 4000, max: 7000 } },
      { id: 'groundnuts', name: 'Groundnuts (Peas)', nameLg: 'Ebinyebwa', nameSw: 'Karanga', unit: 'kg', avgPriceRange: { min: 6000, max: 12000 } },
      { id: 'soybeans', name: 'Soybeans', nameLg: 'Soya', nameSw: 'Soya', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'cowpeas', name: 'Cowpeas (Ebirowoozo)', nameLg: 'Ebirowoozo', nameSw: 'Kunde', unit: 'kg', avgPriceRange: { min: 4000, max: 8000 } },
      { id: 'beans', name: 'Beans', nameLg: 'Bbiringanya', nameSw: 'Maharage', unit: 'kg', avgPriceRange: { min: 4000, max: 8000 } },
      { id: 'green_grams', name: 'Green Grams (Choroko)', nameLg: 'Choroko', nameSw: 'Choroko', unit: 'kg', avgPriceRange: { min: 6000, max: 12000 } },
      { id: 'pigeon_peas', name: 'Pigeon Peas', nameLg: 'Pigeon Peas', nameSw: 'Mbaazi', unit: 'kg', avgPriceRange: { min: 5000, max: 10000 } },
      { id: 'sunflower_seeds', name: 'Sunflower Seeds', nameLg: 'Sunflower', nameSw: 'Alizeti', unit: 'kg', avgPriceRange: { min: 4000, max: 8000 } },
      { id: 'barley', name: 'Barley', nameLg: 'Barley', nameSw: 'Shayiri', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'oats', name: 'Oats', nameLg: 'Oats', nameSw: 'Oti', unit: 'kg', avgPriceRange: { min: 5000, max: 10000 } },
      { id: 'quinoa', name: 'Quinoa', nameLg: 'Quinoa', nameSw: 'Quinoa', unit: 'kg', avgPriceRange: { min: 15000, max: 30000 } },
      { id: 'amaranth_grain', name: 'Amaranth Grain', nameLg: 'Amaranth', nameSw: 'Amaranti', unit: 'kg', avgPriceRange: { min: 8000, max: 15000 } },
    ]
  },
  {
    id: 'livestock',
    name: 'Livestock',
    nameLg: 'Ente',
    nameSw: 'Mifugo',
    icon: '🐄',
    subcategories: [
      { id: 'cattle', name: 'Cattle (Cows)', nameLg: 'Ente', nameSw: 'Ng\'ombe', unit: 'head' },
      { id: 'goats', name: 'Goats', nameLg: 'Mbuzi', nameSw: 'Mbuzi', unit: 'head' },
      { id: 'sheep', name: 'Sheep', nameLg: 'Endiga', nameSw: 'Kondoo', unit: 'head' },
      { id: 'pigs', name: 'Pigs', nameLg: 'Embizzi', nameSw: 'Nguruwe', unit: 'head' },
      { id: 'rabbits', name: 'Rabbits', nameLg: 'Enkende', nameSw: 'Sungura', unit: 'head' },
      { id: 'chicken_broilers', name: 'Chicken (Broilers)', nameLg: 'Broilers', nameSw: 'Kuku wa Nyama', unit: 'bird' },
      { id: 'chicken_layers', name: 'Chicken (Layers)', nameLg: 'Layers', nameSw: 'Kuku wa Mayai', unit: 'bird' },
      { id: 'local_chicken', name: 'Local Chicken (Kienyeji)', nameLg: 'Kienyeji', nameSw: 'Kuku wa Kienyeji', unit: 'bird' },
      { id: 'ducks', name: 'Ducks', nameLg: 'Ducks', nameSw: 'Bata', unit: 'bird' },
      { id: 'turkeys', name: 'Turkeys', nameLg: 'Turkeys', nameSw: 'Bata Mzinga', unit: 'bird' },
      { id: 'guinea_fowl', name: 'Guinea Fowl', nameLg: 'Guinea Fowl', nameSw: 'Kanga', unit: 'bird' },
      { id: 'quails', name: 'Quails', nameLg: 'Quails', nameSw: 'Kware', unit: 'bird' },
    ]
  },
  {
    id: 'dairy',
    name: 'Dairy',
    nameLg: 'Ebyamatafaali',
    nameSw: 'Maziwa',
    icon: '🥛',
    subcategories: [
      { id: 'fresh_milk', name: 'Fresh Milk', nameLg: 'Amata', nameSw: 'Maziwa', unit: 'litre', avgPriceRange: { min: 1500, max: 2500 } },
      { id: 'fermented_milk', name: 'Fermented Milk (Yoghurt/Bongo)', nameLg: 'Bongo', nameSw: 'Maziwa Mgando', unit: 'litre', avgPriceRange: { min: 2000, max: 4000 } },
      { id: 'ghee', name: 'Ghee (Cow Butter)', nameLg: 'Ghee', nameSw: 'Sami', unit: 'kg', avgPriceRange: { min: 15000, max: 30000 } },
      { id: 'cheese', name: 'Cheese', nameLg: 'Cheese', nameSw: 'Chizi', unit: 'kg', avgPriceRange: { min: 15000, max: 35000 } },
      { id: 'eggs', name: 'Eggs', nameLg: 'Magi', nameSw: 'Mayai', unit: 'tray', avgPriceRange: { min: 10000, max: 18000 } },
      { id: 'honey', name: 'Honey', nameLg: 'Honey', nameSw: 'Asali', unit: 'kg', avgPriceRange: { min: 10000, max: 20000 } },
    ]
  },
  {
    id: 'spices',
    name: 'Spices',
    nameLg: 'Spices',
    nameSw: 'Viungo',
    icon: '🌶️',
    subcategories: [
      { id: 'ginger', name: 'Ginger', nameLg: 'Ginger', nameSw: 'Tangawizi', unit: 'kg', avgPriceRange: { min: 5000, max: 10000 } },
      { id: 'garlic', name: 'Garlic', nameLg: 'Garlic', nameSw: 'Kitunguu Saumu', unit: 'kg', avgPriceRange: { min: 8000, max: 15000 } },
      { id: 'chili_peppers', name: 'Chili Peppers', nameLg: 'Pilipili', nameSw: 'Pilipili Kali', unit: 'kg', avgPriceRange: { min: 5000, max: 10000 } },
      { id: 'black_pepper', name: 'Black Pepper', nameLg: 'Black Pepper', nameSw: 'Pilipili Nyeusi', unit: 'kg', avgPriceRange: { min: 20000, max: 40000 } },
      { id: 'turmeric', name: 'Turmeric', nameLg: 'Turmeric', nameSw: 'Manjano', unit: 'kg', avgPriceRange: { min: 10000, max: 20000 } },
      { id: 'cinnamon', name: 'Cinnamon', nameLg: 'Cinnamon', nameSw: 'Mdalasini', unit: 'kg', avgPriceRange: { min: 15000, max: 30000 } },
      { id: 'cardamom', name: 'Cardamom', nameLg: 'Cardamom', nameSw: 'Ileki', unit: 'kg', avgPriceRange: { min: 30000, max: 60000 } },
      { id: 'cloves', name: 'Cloves', nameLg: 'Cloves', nameSw: 'Karakafu', unit: 'kg', avgPriceRange: { min: 25000, max: 50000 } },
      { id: 'coriander', name: 'Coriander (Dania)', nameLg: 'Dania', nameSw: 'Dania', unit: 'kg', avgPriceRange: { min: 5000, max: 10000 } },
      { id: 'cumin', name: 'Cumin', nameLg: 'Cumin', nameSw: 'Kitunguu Changu', unit: 'kg', avgPriceRange: { min: 15000, max: 30000 } },
      { id: 'curry_powder', name: 'Curry Powder', nameLg: 'Curry', nameSw: 'Mchuzi Mix', unit: 'kg', avgPriceRange: { min: 10000, max: 20000 } },
      { id: 'vanilla', name: 'Vanilla', nameLg: 'Vanilla', nameSw: 'Vanila', unit: 'kg', avgPriceRange: { min: 50000, max: 100000 } },
    ]
  },
  {
    id: 'nuts_seeds',
    name: 'Nuts & Seeds',
    nameLg: 'Nuts & Seeds',
    nameSw: 'Korosho na Mbegu',
    icon: '🥜',
    subcategories: [
      { id: 'groundnuts_peeled', name: 'Groundnuts (Peeled)', nameLg: 'Ebinyebwa', nameSw: 'Karanga Zilizopondwa', unit: 'kg', avgPriceRange: { min: 8000, max: 15000 } },
      { id: 'groundnuts_unpeeled', name: 'Groundnuts (Unpeeled)', nameLg: 'Ebinyebwa', nameSw: 'Karanga za Kuchomwa', unit: 'kg', avgPriceRange: { min: 5000, max: 10000 } },
      { id: 'cashew_nuts', name: 'Cashew Nuts', nameLg: 'Cashew', nameSw: 'Korosho', unit: 'kg', avgPriceRange: { min: 15000, max: 30000 } },
      { id: 'macadamia', name: 'Macadamia Nuts', nameLg: 'Macadamia', nameSw: 'Macadamia', unit: 'kg', avgPriceRange: { min: 20000, max: 40000 } },
      { id: 'sunflower_seeds', name: 'Sunflower Seeds', nameLg: 'Sunflower', nameSw: 'Alizeti', unit: 'kg', avgPriceRange: { min: 4000, max: 8000 } },
      { id: 'pumpkin_seeds', name: 'Pumpkin Seeds', nameLg: 'Pumpkin Seeds', nameSw: 'Mbegu za Maboga', unit: 'kg', avgPriceRange: { min: 8000, max: 15000 } },
      { id: 'watermelon_seeds', name: 'Watermelon Seeds', nameLg: 'Watermelon Seeds', nameSw: 'Mbegu za Tikiti', unit: 'kg', avgPriceRange: { min: 10000, max: 20000 } },
      { id: 'chia_seeds', name: 'Chia Seeds', nameLg: 'Chia', nameSw: 'Chia', unit: 'kg', avgPriceRange: { min: 20000, max: 40000 } },
      { id: 'flax_seeds', name: 'Flax Seeds', nameLg: 'Flax', nameSw: 'Ufuta Ulaya', unit: 'kg', avgPriceRange: { min: 15000, max: 30000 } },
    ]
  },
  {
    id: 'root_crops',
    name: 'Root Crops',
    nameLg: 'Root Crops',
    nameSw: 'Mizizi',
    icon: '🍠',
    subcategories: [
      { id: 'cassava', name: 'Cassava (Muhogo)', nameLg: 'Muwogo', nameSw: 'Muhogo', unit: 'kg', avgPriceRange: { min: 1500, max: 3000 } },
      { id: 'cassava_flour', name: 'Cassava Flour', nameLg: 'Kawunga ka Muwogo', nameSw: 'Unga wa Muhogo', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'sweet_potatoes', name: 'Sweet Potatoes', nameLg: 'Lumonde', nameSw: 'Viazi Vitamu', unit: 'kg', avgPriceRange: { min: 1500, max: 3000 } },
      { id: 'irish_potatoes', name: 'Irish Potatoes', nameLg: 'Irish Potatoes', nameSw: 'Viazi Ulaya', unit: 'kg', avgPriceRange: { min: 2000, max: 4000 } },
      { id: 'yams', name: 'Yams', nameLg: 'Yams', nameSw: 'Viazi vya Mapawa', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'ginger_root', name: 'Ginger (Root)', nameLg: 'Ginger', nameSw: 'Tangawizi', unit: 'kg', avgPriceRange: { min: 5000, max: 10000 } },
      { id: 'carrots_root', name: 'Carrots', nameLg: 'Kkarooti', nameSw: 'Karoti', unit: 'kg', avgPriceRange: { min: 2000, max: 4000 } },
      { id: 'beetroot_crop', name: 'Beetroot', nameLg: 'Beetroot', nameSw: 'Beetroot', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'arrowroots', name: 'Arrowroots (Nduma)', nameLg: 'Nduma', nameSw: 'Nduma', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
      { id: 'taro', name: 'Taro (Eddo)', nameLg: 'Eddo', nameSw: 'Magimbi', unit: 'kg', avgPriceRange: { min: 3000, max: 6000 } },
    ]
  },
];

// ===== USSD MENU GENERATOR =====
// Generates text menus for *220# service

export function generateUSSDCategoryMenu(): string {
  let menu = "ShambaNi\nSelect Category:\n";
  PRODUCT_CATEGORIES.forEach((cat, i) => {
    menu += `${i + 1}. ${cat.name}\n`;
  });
  menu += "0. Back\n";
  return menu;
}

export function generateUSSDSubcategoryMenu(categoryId: string): string {
  const cat = PRODUCT_CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return "Invalid category\n0. Back";
  
  let menu = `${cat.name}:\nSelect Product:\n`;
  cat.subcategories.forEach((sub, i) => {
    menu += `${i + 1}. ${sub.name}\n`;
  });
  menu += "0. Back\n";
  return menu;
}

// ===== HELPERS =====

export function getSubcategories(categoryId: string): ProductSubcategory[] {
  return PRODUCT_CATEGORIES.find(c => c.id === categoryId)?.subcategories || [];
}

export function getAllSubcategories(): ProductSubcategory[] {
  return PRODUCT_CATEGORIES.flatMap(c => 
    c.subcategories.map(s => ({ ...s, categoryId: c.id, categoryName: c.name }))
  );
}

export function getCategoryById(id: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find(c => c.id === id);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): ProductSubcategory | undefined {
  return getCategoryById(categoryId)?.subcategories.find(s => s.id === subcategoryId);
}

export function searchProducts(query: string): (ProductSubcategory & { categoryId: string; categoryName: string })[] {
  const q = query.toLowerCase();
  return getAllSubcategories().filter(s => 
    s.name.toLowerCase().includes(q) ||
    s.nameLg?.toLowerCase().includes(q) ||
    s.nameSw?.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q)
  );
}

// ===== CATEGORY SUMMARY =====
export function getCategorySummary() {
  return PRODUCT_CATEGORIES.map(c => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    subcategoryCount: c.subcategories.length
  }));
}

// Total count
export const TOTAL_SUBCATEGORIES = PRODUCT_CATEGORIES.reduce((sum, c) => sum + c.subcategories.length, 0);

export default PRODUCT_CATEGORIES;
