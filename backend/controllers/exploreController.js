const storage = require('../services/storage');

const EXPLORE_CATALOG = [
  // Tokyo
  {
    id: 'exp_tokyo_shibuya',
    city: 'Tokyo',
    country: 'Japan',
    name: 'Shibuya Crossing & Sky',
    category: 'Sightseeing',
    tag: 'Energy',
    image: '/images/shibuya.jpg',
    rating: 4.9,
    reviews: 14200,
    price: '$18',
    description: 'The iconic scramble intersection and panoramic glass sky-deck observatory with views of Fuji.',
    features: ['Observation Deck', 'Iconic Photo', 'Nightlife Hub']
  },
  {
    id: 'exp_tokyo_asakusa',
    city: 'Tokyo',
    country: 'Japan',
    name: 'Senso-ji Ancient Temple',
    category: 'Culture',
    tag: 'Tradition',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 8900,
    price: 'Free',
    description: 'Tokyo\'s oldest temple with thunder gate lantern, incense rituals, and historic street market.',
    features: ['Historic', 'Cultural Heritage', 'Street Food']
  },
  {
    id: 'exp_tokyo_shinjuku',
    city: 'Tokyo',
    country: 'Japan',
    name: 'Shinjuku & Golden Gai',
    category: 'Nightlife',
    tag: 'Energy',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 6400,
    price: '$30',
    description: 'Neon canyon of skyscrapers, labyrinthine izakaya alleys, and rooftop cocktail lounges.',
    features: ['Bars & Izakayas', 'Neon Lights', 'Vibrant Scene']
  },
  {
    id: 'exp_tokyo_akihabara',
    city: 'Tokyo',
    country: 'Japan',
    name: 'Akihabara Electric Town',
    category: 'Shopping',
    tag: 'Tech & Anime',
    image: 'https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 9100,
    price: '$25',
    description: 'Multi-story tech emporiums, retro gaming arcades, collectible figurines, and maid cafes.',
    features: ['Retro Gaming', 'Electronics', 'Anime Culture']
  },
  {
    id: 'exp_tokyo_teamlab',
    city: 'Tokyo',
    country: 'Japan',
    name: 'teamLab Borderless Azabudai',
    category: 'Art & Tech',
    tag: 'Immersive',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 5800,
    price: '$28',
    description: 'A museum without a map where artworks move out of rooms and interact with visitors.',
    features: ['Digital Art', 'Sensory Journey', 'Instagram Spot']
  },
  {
    id: 'exp_tokyo_tsukiji',
    city: 'Tokyo',
    country: 'Japan',
    name: 'Tsukiji Outer Market Food Tour',
    category: 'Food',
    tag: 'Culinary',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 7300,
    price: '$35',
    description: 'Hundreds of lively stalls serving fresh sea urchin, king crab legs, wagyu beef, and tamagoyaki.',
    features: ['Fresh Seafood', 'Local Stalls', 'Tasting Tour']
  },

  // Kyoto
  {
    id: 'exp_kyoto_fushimi',
    city: 'Kyoto',
    country: 'Japan',
    name: 'Fushimi Inari-taisha Gates',
    category: 'Culture',
    tag: 'Spiritual',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 18400,
    price: 'Free',
    description: 'Thousands of vermilion torii gates winding up sacred Mount Inari through peaceful cedar forests.',
    features: ['Sacred Shrine', 'Mountain Trail', '10,000 Gates']
  },
  {
    id: 'exp_kyoto_arashiyama',
    city: 'Kyoto',
    country: 'Japan',
    name: 'Arashiyama Bamboo Grove',
    category: 'Nature',
    tag: 'Serene',
    image: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 12200,
    price: 'Free',
    description: 'Towering green bamboo stalks rustling in the breeze, historic Tenryu-ji temple garden adjacent.',
    features: ['Bamboo Walk', 'UNESCO Temple', 'Monkey Park']
  },

  // Paris
  {
    id: 'exp_paris_louvre',
    city: 'Paris',
    country: 'France',
    name: 'Musée du Louvre & Tuileries',
    category: 'Art & Tech',
    tag: 'Masterpiece',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 21000,
    price: '$22',
    description: 'The world\'s greatest art museum housed in the historic palace with the Mona Lisa and Venus de Milo.',
    features: ['World Famous Art', 'Glass Pyramid', 'Royal Garden']
  },
  {
    id: 'exp_paris_montmartre',
    city: 'Paris',
    country: 'France',
    name: 'Montmartre & Sacré-Cœur',
    category: 'Culture',
    tag: 'Bohemian',
    image: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 15300,
    price: 'Free',
    description: 'Charming hilltop village with street artists, vintage bistros, and grand white basilique vista.',
    features: ['Panoramic Vista', 'Artists Square', 'Cafes']
  }
];

exports.getExploreCatalog = (req, res) => {
  try {
    const { search, city, category } = req.query;
    let results = EXPLORE_CATALOG;

    if (city) {
      results = results.filter(p => p.city.toLowerCase() === city.toLowerCase());
    }

    if (category && category !== 'All') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.city.toLowerCase().includes(q) || 
        p.tag.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    const neighborhoods = storage.getNeighborhoods();

    res.json({
      catalog: results,
      neighborhoods,
      cities: ['All Cities', 'Tokyo', 'Kyoto', 'Paris'],
      categories: ['All', 'Sightseeing', 'Culture', 'Nightlife', 'Food', 'Art & Tech', 'Shopping', 'Nature']
    });
  } catch (error) {
    console.error('Explore catalog error:', error);
    res.status(500).json({ message: 'Error retrieving catalog' });
  }
};
