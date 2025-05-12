import { Activity } from './trip';

export const mockAttractions: Activity[] = [
  {
    id: 'attr-1',
    name: 'Borobudur Temple',
    location: { lat: -7.6079, lng: 110.2038 },
    address: 'Jl. Badrawati, Kw. Candi Borobudur, Magelang, Central Java',
    cost: 350000, // in IDR
    duration: 180, // 3 hours in minutes
    category: 'Culture',
    description: 'The world\'s largest Buddhist temple and one of Indonesia\'s most significant cultural landmarks.',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272',
    isFlexible: false,
  },
  {
    id: 'attr-2',
    name: 'Gili Islands Snorkeling',
    location: { lat: -8.3486, lng: 116.0361 },
    address: 'Gili Islands, Lombok, West Nusa Tenggara',
    cost: 450000,
    duration: 240, // 4 hours in minutes
    category: 'Adventure',
    description: 'Explore vibrant coral reefs and swim with sea turtles in the crystal clear waters around the Gili Islands.',
    imageUrl: 'https://images.unsplash.com/photo-1530541930197-ff16ac917f7f',
    isFlexible: true,
  },
  {
    id: 'attr-3',
    name: 'Ubud Monkey Forest',
    location: { lat: -8.5188, lng: 115.2588 },
    address: 'Jl. Monkey Forest, Ubud, Bali',
    cost: 80000,
    duration: 120, // 2 hours in minutes
    category: 'Adventure',
    description: 'A natural sanctuary and temple complex with more than 700 monkeys and 186 species of plants.',
    imageUrl: 'https://images.unsplash.com/photo-1555454762-22f6fc247a25',
    isFlexible: true,
  },
  {
    id: 'attr-4',
    name: 'Pasar Baru Food Tour',
    location: { lat: -6.1687, lng: 106.8316 },
    address: 'Pasar Baru, Central Jakarta',
    cost: 250000,
    duration: 180, // 3 hours in minutes
    category: 'Food',
    description: 'Sample authentic Indonesian cuisine at one of Jakarta\'s oldest and most vibrant markets.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    isFlexible: true,
  },
  {
    id: 'attr-5',
    name: 'Mount Bromo Sunrise Tour',
    location: { lat: -7.9425, lng: 112.9530 },
    address: 'Bromo Tengger Semeru National Park, East Java',
    cost: 800000,
    duration: 300, // 5 hours in minutes
    category: 'Adventure',
    description: 'Witness a breathtaking sunrise over the volcanic landscape of Mount Bromo.',
    imageUrl: 'https://images.unsplash.com/photo-1518002054494-3a6f94352e9e',
    isFlexible: false,
  },
  {
    id: 'attr-6',
    name: 'Prambanan Temple Complex',
    location: { lat: -7.7520, lng: 110.4914 },
    address: 'Jl. Raya Solo - Yogyakarta No.16, Yogyakarta',
    cost: 320000,
    duration: 150, // 2.5 hours in minutes
    category: 'Culture',
    description: 'A 9th-century Hindu temple compound dedicated to the Trimurti: Brahma, Vishnu, and Shiva.',
    imageUrl: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa',
    isFlexible: false,
  },
  {
    id: 'attr-7',
    name: 'Bali Cooking Class',
    location: { lat: -8.4234, lng: 115.3119 },
    address: 'Ubud, Bali',
    cost: 550000,
    duration: 240, // 4 hours in minutes
    category: 'Food',
    description: 'Learn to prepare authentic Balinese dishes with fresh ingredients from local markets.',
    imageUrl: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf',
    isFlexible: true,
  },
  {
    id: 'attr-8',
    name: 'Komodo National Park Tour',
    location: { lat: -8.5500, lng: 119.4883 },
    address: 'Komodo Island, East Nusa Tenggara',
    cost: 1500000,
    duration: 480, // 8 hours in minutes
    category: 'Adventure',
    description: 'See the famous Komodo dragons in their natural habitat and snorkel in pristine waters.',
    imageUrl: 'https://images.unsplash.com/photo-1582379825148-f6bc6f111dc1',
    isFlexible: false,
  },
  {
    id: 'attr-9',
    name: 'Jakarta Historical Museum',
    location: { lat: -6.1347, lng: 106.8135 },
    address: 'Jl. Taman Fatahillah No.1, West Jakarta',
    cost: 100000,
    duration: 120, // 2 hours in minutes
    category: 'Culture',
    description: 'Housed in the old city hall of Batavia, displays artifacts from Jakarta\'s colonial history.',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3',
    isFlexible: true,
  },
  {
    id: 'attr-10',
    name: 'Tegallalang Rice Terraces',
    location: { lat: -8.4312, lng: 115.2776 },
    address: 'Tegallalang, Gianyar, Bali',
    cost: 50000,
    duration: 120, // 2 hours in minutes
    category: 'Culture',
    description: 'Dramatic terraced rice fields offering a timeless example of the Balinese cooperative irrigation system.',
    imageUrl: 'https://images.unsplash.com/photo-1525596662741-e94ff9f26de1',
    isFlexible: true,
  },
  {
    id: 'attr-11',
    name: 'Jimbaran Bay Seafood Dinner',
    location: { lat: -8.7902, lng: 115.1621 },
    address: 'Jimbaran Beach, Bali',
    cost: 350000,
    duration: 120, // 2 hours in minutes
    category: 'Food',
    description: 'Enjoy freshly caught seafood prepared on open grills right on the beach as the sun sets.',
    imageUrl: 'https://images.unsplash.com/photo-1485963631004-f2f00b1d6606',
    isFlexible: true,
  },
  {
    id: 'attr-12',
    name: 'Tanjung Puting National Park',
    location: { lat: -2.7639, lng: 111.9500 },
    address: 'Central Kalimantan',
    cost: 1200000,
    duration: 480, // 8 hours in minutes
    category: 'Adventure',
    description: 'Take a klotok boat tour to observe orangutans and other wildlife in their natural habitat.',
    imageUrl: 'https://images.unsplash.com/photo-1580917081106-aa1eeda513c1',
    isFlexible: false,
  }
];

// Group attractions by category
export const attractionsByCategory = {
  Adventure: mockAttractions.filter(attr => attr.category === 'Adventure'),
  Food: mockAttractions.filter(attr => attr.category === 'Food'),
  Culture: mockAttractions.filter(attr => attr.category === 'Culture'),
};

// Get attractions by location (simplified version)
export const getAttractionsByLocation = (location: string) => {
  const locationMap: { [key: string]: string[] } = {
    'Bali': ['attr-3', 'attr-7', 'attr-10', 'attr-11'],
    'Jakarta': ['attr-4', 'attr-9'],
    'Yogyakarta': ['attr-1', 'attr-6'],
    'Lombok': ['attr-2'],
    'East Java': ['attr-5'],
    'Komodo': ['attr-8'],
    'Kalimantan': ['attr-12']
  };

  const ids = locationMap[location] || [];
  return mockAttractions.filter(attr => ids.includes(attr.id));
};

// Search attractions by query
export const searchAttractions = (query: string): Activity[] => {
  const lowerQuery = query.toLowerCase();
  return mockAttractions.filter(
    attr => 
      attr.name.toLowerCase().includes(lowerQuery) ||
      attr.description.toLowerCase().includes(lowerQuery) ||
      attr.address.toLowerCase().includes(lowerQuery) ||
      attr.category.toLowerCase().includes(lowerQuery)
  );
};