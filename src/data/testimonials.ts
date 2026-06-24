export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
  type: 'farmer' | 'buyer';
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Nakamya Josephine',
    role: 'testimonials.role1',
    quote: 'testimonials.quote1',
    avatar: '/farmer-portrait-1.jpg',
    rating: 5,
    type: 'farmer',
  },
  {
    id: '2',
    name: 'Mr. Ssekatawa',
    role: 'testimonials.role2',
    quote: 'testimonials.quote2',
    avatar: '/buyer-portrait-1.jpg',
    rating: 5,
    type: 'buyer',
  },
  {
    id: '3',
    name: 'Acen Mary',
    role: 'testimonials.role3',
    quote: 'testimonials.quote3',
    avatar: '/farmer-portrait-2.jpg',
    rating: 5,
    type: 'farmer',
  },
];
