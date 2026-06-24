export interface Category {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  image: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'vegetables',
    name: 'Vegetables',
    nameKey: 'categories.vegetables',
    description: 'Fresh greens, tomatoes, cabbage & more',
    image: '/produce-vegetables.jpg',
    icon: 'Leaf',
  },
  {
    id: 'fruits',
    name: 'Fruits',
    nameKey: 'categories.fruits',
    description: 'Bananas, mangoes, pineapples & passion fruit',
    image: '/produce-fruits.jpg',
    icon: 'Apple',
  },
  {
    id: 'grains',
    name: 'Grains',
    nameKey: 'categories.grains',
    description: 'Maize, beans, rice, millet & sorghum',
    image: '/produce-grains.jpg',
    icon: 'Wheat',
  },
  {
    id: 'livestock',
    name: 'Livestock',
    nameKey: 'categories.livestock',
    description: 'Free-range chicken, eggs & more',
    image: '/produce-livestock.jpg',
    icon: 'Beef',
  },
  {
    id: 'dairy',
    name: 'Dairy',
    nameKey: 'categories.dairy',
    description: 'Fresh milk, ghee & dairy products',
    image: '/produce-dairy.jpg',
    icon: 'Milk',
  },
  {
    id: 'spices',
    name: 'Spices',
    nameKey: 'categories.spices',
    description: 'Ginger, turmeric, hot peppers & curry',
    image: '/produce-spices.jpg',
    icon: 'Flame',
  },
  {
    id: 'nuts',
    name: 'Nuts & Seeds',
    nameKey: 'categories.nuts',
    description: 'Groundnuts, sesame, cashews & more',
    image: '/produce-nuts.jpg',
    icon: 'Nut',
  },
  {
    id: 'roots',
    name: 'Root Crops',
    nameKey: 'categories.roots',
    description: 'Sweet potatoes, cassava, yams & carrots',
    image: '/produce-roots.jpg',
    icon: 'Carrot',
  },
];
