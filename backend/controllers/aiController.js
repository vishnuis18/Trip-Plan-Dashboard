const storage = require('../services/storage');

// Curated destination knowledge base for the AI Co-Planner Engine
const DESTINATION_PROFILES = {
  tokyo: {
    name: 'Tokyo, Japan',
    airport: 'Haneda Airport (HND)',
    currency: 'JPY',
    coverImage: '/images/mount_fuji.jpg',
    coords: { lat: 35.6762, lng: 139.6503 },
    pool: [
      { title: 'Morning Matcha & Yanaka Ginza Stroll', category: 'Culture', location: 'Yanaka, Taito', durationMin: 120, costEstimate: 15, time: '09:00 AM', desc: 'Wander old Tokyo residential alleys with historic kissaten coffee and fresh dango.' },
      { title: 'Senso-ji Temple & Asakusa Street Food', category: 'Culture', location: 'Asakusa, Taito', durationMin: 150, costEstimate: 25, time: '11:30 AM', desc: 'Tokyo’s oldest temple with towering thunder gates and Nakamise-dori melonpan snacks.' },
      { title: 'teamLab Planets Immersive Digital Art', category: 'Attractions', location: 'Toyosu, Koto', durationMin: 120, costEstimate: 38, time: '02:30 PM', desc: 'Walk barefoot through mesmerizing mirrored water rooms and digital infinite crystal universes.' },
      { title: 'Shibuya Crossing & Hachiko Statue', category: 'Sightseeing', location: 'Shibuya, Tokyo', durationMin: 60, costEstimate: 0, time: '05:00 PM', desc: 'Experience the world-famous pedestrian scramble and neon billboard atmosphere.' },
      { title: 'Shibuya Sky Sunset Observation Deck', category: 'Sightseeing', location: 'Shibuya Scramble Square', durationMin: 90, costEstimate: 22, time: '06:00 PM', desc: '360-degree open-air glass rooftop panoramic views over Tokyo Tower and Mount Fuji.' },
      { title: 'Authentic Omakase Sushi Dinner', category: 'Food & Dining', location: 'Ginza / Tsukiji', durationMin: 120, costEstimate: 85, time: '07:30 PM', desc: 'Masterfully prepared seasonal Edomae nigiri sushi with fresh catch from Toyosu.' },
      { title: 'Shinjuku Omoide Yokocho Yakitori Alleys', category: 'Food & Dining', location: 'Shinjuku, Tokyo', durationMin: 90, costEstimate: 30, time: '09:30 PM', desc: 'Smoky, lantern-lit昭和 nostalgic alleyways serving grilled skewers and cold draft beer.' },
      { title: 'Meiji Jingu Shrine & Yoyogi Forest Walk', category: 'Nature', location: 'Harajuku, Shibuya', durationMin: 100, costEstimate: 0, time: '09:00 AM', desc: 'Peaceful forested Shinto shrine surrounded by 100,000 evergreen trees in the heart of Tokyo.' },
      { title: 'Takeshita Street & Vintage Thrift Shopping', category: 'Shopping', location: 'Harajuku / Omotesando', durationMin: 120, costEstimate: 40, time: '11:00 AM', desc: 'Harajuku youth fashion hub followed by sleek architectural boutiques along zelkova-lined Omotesando.' },
      { title: 'Akihabara Electric Town & Retro Arcades', category: 'Entertainment', location: 'Akihabara, Chiyoda', durationMin: 150, costEstimate: 35, time: '02:30 PM', desc: 'Multi-floor retro video game shrines, anime hobby superstores, and glowing claw arcades.' }
    ]
  },
  kyoto: {
    name: 'Kyoto, Japan',
    airport: 'Kansai International Airport (KIX)',
    currency: 'JPY',
    coverImage: '/images/arashiyama.jpg',
    coords: { lat: 34.9858, lng: 135.7588 },
    pool: [
      { title: 'Arashiyama Bamboo Grove at Dawn', category: 'Nature', location: 'Arashiyama, Ukyo', durationMin: 90, costEstimate: 0, time: '07:30 AM', desc: 'Serene towering green bamboo stalks before crowds arrive with gentle wind rustling.' },
      { title: 'Tenryu-ji Temple & Zen Sogenchi Garden', category: 'Culture', location: 'Arashiyama, Kyoto', durationMin: 90, costEstimate: 10, time: '09:30 AM', desc: '14th-century UNESCO World Heritage pond garden reflecting the forested Arashiyama mountains.' },
      { title: 'Fushimi Inari-Taisha 10,000 Torii Hike', category: 'Culture', location: 'Fushimi, Kyoto', durationMin: 150, costEstimate: 0, time: '01:30 PM', desc: 'Hike through endless vermilion orange shrine gates up sacred Mount Inari.' },
      { title: 'Nishiki Market Culinary Tasting Tour', category: 'Food & Dining', location: 'Nakagyo, Kyoto', durationMin: 100, costEstimate: 35, time: '11:30 AM', desc: 'Kyoto’s 400-year-old pantry alley: grilled octopus, dashi tamagoyaki, and matcha soft serve.' },
      { title: 'Kinkaku-ji (The Golden Pavilion)', category: 'Sightseeing', location: 'Kita, Kyoto', durationMin: 75, costEstimate: 8, time: '03:30 PM', desc: 'Iconic Zen temple completely covered in pure gold leaf shimmering over Mirror Pond.' },
      { title: 'Gion Historic District & Shirakawa Canal Walk', category: 'Culture', location: 'Gion, Higashiyama', durationMin: 120, costEstimate: 0, time: '06:00 PM', desc: 'Traditional machiya wooden teahouses, willows, and potential geiko/maiko sightings at dusk.' },
      { title: 'Traditional Kaiseki Multi-Course Dinner', category: 'Food & Dining', location: 'Pontocho Alley, Kyoto', durationMin: 120, costEstimate: 95, time: '07:30 PM', desc: 'Artisanal multi-course Kyoto cuisine on kamogawa river-facing wooden summer platforms.' }
    ]
  },
  paris: {
    name: 'Paris, France',
    airport: 'Charles de Gaulle Airport (CDG)',
    currency: 'EUR',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
    coords: { lat: 48.8566, lng: 2.3522 },
    pool: [
      { title: 'Fresh Croissants & Café de Flore', category: 'Food & Dining', location: 'Saint-Germain-des-Prés', durationMin: 75, costEstimate: 18, time: '08:30 AM', desc: 'Classic Parisian terrace breakfast with flaky butter croissants and rich double espresso.' },
      { title: 'Musée du Louvre Masterpieces Guided Route', category: 'Culture', location: '1st Arrondissement, Paris', durationMin: 180, costEstimate: 22, time: '10:00 AM', desc: 'Mona Lisa, Winged Victory, and Venus de Milo in the historic palace galleries.' },
      { title: 'Jardin des Tuileries & Seine Promenade', category: 'Nature', location: 'Tuileries, Paris', durationMin: 60, costEstimate: 0, time: '01:30 PM', desc: 'Relaxing stroll past palace statues, fountains, and bookseller bouquinistes along the Seine.' },
      { title: 'Eiffel Tower Summit & Trocadéro Sunset', category: 'Sightseeing', location: 'Champ de Mars, 7th Arr.', durationMin: 120, costEstimate: 32, time: '05:30 PM', desc: 'Ascend the Iron Lady for twilight panorama followed by hourly sparkling light show.' },
      { title: 'Montmartre Cobblestones & Sacré-Cœur Basilica', category: 'Culture', location: 'Montmartre, 18th Arr.', durationMin: 120, costEstimate: 0, time: '02:00 PM', desc: 'Bohemian artists square Place du Tertre and panoramic city overlook from the white dome.' },
      { title: 'Bistro Dinner: Confit de Canard & Bordeaux Wine', category: 'Food & Dining', location: 'Le Marais, 4th Arr.', durationMin: 120, costEstimate: 55, time: '08:00 PM', desc: 'Authentic candlelit bistro dining with duck confit, gratin dauphinois, and crème brûlée.' }
    ]
  },
  bali: {
    name: 'Bali, Indonesia',
    airport: 'Ngurah Rai International Airport (DPS)',
    currency: 'USD',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80',
    coords: { lat: -8.4095, lng: 115.1889 },
    pool: [
      { title: 'Tegalalang Rice Terraces Jungle Walk', category: 'Nature', location: 'Ubud, Gianyar', durationMin: 120, costEstimate: 10, time: '08:00 AM', desc: 'UNESCO subak irrigation rice paddies glowing in morning mist with giant jungle swings.' },
      { title: 'Sacred Monkey Forest Sanctuary', category: 'Nature', location: 'Padangtegal, Ubud', durationMin: 90, costEstimate: 8, time: '10:30 AM', desc: 'Ancient moss-covered Hindu temples home to over 1,000 playful Balinese macaques.' },
      { title: 'Balinese Herbal Spa & Flower Bath', category: 'Wellness', location: 'Ubud Jungle Valley', durationMin: 120, costEstimate: 45, time: '02:00 PM', desc: 'Traditional boreh body scrub and relaxing warm flower petal soak overlooking river ravines.' },
      { title: 'Uluwatu Cliff Temple & Sunset Kecak Fire Dance', category: 'Culture', location: 'Uluwatu, South Kuta', durationMin: 150, costEstimate: 20, time: '05:00 PM', desc: 'Dramatic 70-meter sea cliff temple with rhythmic vocal chorus trance dance against sunset.' },
      { title: 'Jimbaran Bay Candlelit Seafood BBQ', category: 'Food & Dining', location: 'Jimbaran Beach', durationMin: 120, costEstimate: 35, time: '07:30 PM', desc: 'Tables directly on the sand serving freshly grilled snapper, prawns, and coconut sambal.' }
    ]
  }
};

// Generic fallback template for any other destination requested
const generateCustomDestinationPool = (dest) => {
  return [
    { title: `Historic Old Town & Architectural Landmarks in ${dest}`, category: 'Culture', location: `${dest} Center`, durationMin: 120, costEstimate: 15, time: '09:30 AM', desc: `Explore the vibrant heart and most iconic historic monuments of ${dest}.` },
    { title: `Local Food Market & Tasting Tour`, category: 'Food & Dining', location: `${dest} Central Market`, durationMin: 90, costEstimate: 30, time: '12:00 PM', desc: `Taste signature street dishes, regional delicacies, and artisan desserts.` },
    { title: `Scenic Overlook & City Panoramic Viewpoint`, category: 'Sightseeing', location: `${dest} Heights`, durationMin: 90, costEstimate: 20, time: '03:00 PM', desc: `Breathtaking 360-degree views and photography vantage point.` },
    { title: `Sunset Harbor / River Promenade Stroll`, category: 'Nature', location: `${dest} Waterfront`, durationMin: 75, costEstimate: 0, time: '05:30 PM', desc: `Relaxing sunset walk along scenic water edges as city lights begin to glow.` },
    { title: `Chef-Crafted Regional Dinner Experience`, category: 'Food & Dining', location: `${dest} Historic District`, durationMin: 120, costEstimate: 60, time: '07:30 PM', desc: `Authentic regional dinner celebrating local heritage and farm-to-table cuisine.` }
  ];
};

exports.generateItinerary = async (req, res) => {
  try {
    const userId = req.user?.id || '660000000000000000000001';
    const {
      destination = 'Tokyo, Japan',
      days = 5,
      startDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      pace = 'moderate', // relaxed, moderate, fast
      budgetLevel = 'comfortable', // budget, comfortable, luxury
      interests = ['Food & Dining', 'Culture', 'Sightseeing'],
      prompt = '',
      saveImmediately = false
    } = req.body;

    const numDays = Math.max(1, Math.min(14, Number(days) || 5));
    const destKey = destination.toLowerCase().split(',')[0].trim();
    
    // Pick destination profile or fallback
    let profile = DESTINATION_PROFILES[destKey];
    if (!profile) {
      for (const [key, val] of Object.entries(DESTINATION_PROFILES)) {
        if (destKey.includes(key)) {
          profile = val;
          break;
        }
      }
    }

    if (!profile) {
      profile = {
        name: destination,
        airport: 'Nearest International Airport',
        currency: 'USD',
        coverImage: '/images/mount_fuji.jpg',
        coords: { lat: 35.6762, lng: 139.6503 },
        pool: generateCustomDestinationPool(destination)
      };
    }

    // Number of stops per day based on pace
    const stopsPerDay = pace === 'relaxed' ? 3 : pace === 'fast' ? 5 : 4;

    // Budget multipliers
    const dailySpend = budgetLevel === 'budget' ? 90 : budgetLevel === 'luxury' ? 450 : 220;
    const totalEstimatedBudget = dailySpend * numDays + 1200; // Base flight/stay estimate

    // Synthesize day by day plan
    const generatedDays = [];
    const pool = [...profile.pool];
    let poolIndex = 0;

    for (let d = 1; d <= numDays; d++) {
      const dayActivities = [];
      const dayTheme = d === 1 ? 'Arrival & Neighborhood Immersion' : d === numDays ? 'Farewell Highlights & Souvenir Hunt' : `Exploration & Culture Day ${d}`;

      for (let s = 0; s < stopsPerDay; s++) {
        const item = pool[poolIndex % pool.length];
        poolIndex++;

        // Shift timing progressively
        const hour = 9 + s * 3;
        const formattedTime = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;

        dayActivities.push({
          day: d,
          time: formattedTime,
          title: item.title,
          category: item.category,
          location: item.location,
          durationMin: item.durationMin,
          costEstimate: item.costEstimate,
          description: item.desc,
          source: 'ai',
          status: 'planned',
          votes: { up: 1, down: 0 }
        });
      }

      generatedDays.push({
        day: d,
        label: `Day ${d}`,
        theme: dayTheme,
        activities: dayActivities
      });
    }

    // Category budget breakdown
    const budgetBreakdown = [
      { category: 'Flights', amount: Math.round(totalEstimatedBudget * 0.35) },
      { category: 'Hotels', amount: Math.round(totalEstimatedBudget * 0.30) },
      { category: 'Food', amount: Math.round(totalEstimatedBudget * 0.18) },
      { category: 'Activities', amount: Math.round(totalEstimatedBudget * 0.10) },
      { category: 'Transport', amount: Math.round(totalEstimatedBudget * 0.07) }
    ];

    // Smart pre-trip checklist tailored to destination
    const smartChecklist = [
      `Passport valid for at least 6 months with 2 blank pages`,
      `Download offline maps and translation apps for ${profile.name}`,
      `Currency exchange or notify bank of international travel`,
      `Local transport card or transit pass reservation`,
      `Universal travel adapter plug & high-capacity power bank`,
      `Comfortable broken-in walking shoes (avg 12,000 steps/day planned)`
    ];

    const result = {
      destination: profile.name,
      title: `${profile.name} ${numDays}-Day ${pace === 'relaxed' ? 'Relaxed' : 'Curated'} Journey`,
      daysCount: numDays,
      nightsCount: numDays - 1,
      currency: profile.currency,
      airport: profile.airport,
      coverImage: profile.coverImage,
      totalBudget: totalEstimatedBudget,
      pace,
      budgetLevel,
      generatedDays,
      budgetBreakdown,
      smartChecklist,
      aiModel: 'TripPlan AI Synthesizer v2.5'
    };

    // If user requested to save directly
    if (saveImmediately) {
      const end = new Date(new Date(startDate).getTime() + (numDays - 1) * 86400000);
      const startObj = new Date(startDate);
      const startFormatted = startObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endFormatted = end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' });

      const newTrip = await storage.createTrip({
        userId,
        title: result.title,
        destination: profile.name,
        startDate,
        endDate: end.toISOString().split('T')[0],
        datesFormatted: `${startFormatted} – ${endFormatted}`,
        travelers: 2,
        travelersText: '2 People',
        nights: numDays - 1,
        totalBudget: totalEstimatedBudget,
        currency: profile.currency,
        airport: profile.airport,
        coverImage: profile.coverImage,
        isActive: true,
        dayTabs: generatedDays.map(g => ({ day: g.day, label: `Day ${g.day}`, sublabel: g.theme }))
      });

      // Insert all activities
      const allActivities = [];
      for (const gDay of generatedDays) {
        for (const act of gDay.activities) {
          const createdAct = await storage.createActivity({
            tripId: newTrip._id,
            day: act.day,
            time: act.time,
            title: act.title,
            category: act.category,
            location: act.location,
            durationMin: act.durationMin,
            costEstimate: act.costEstimate,
            description: act.description,
            source: 'ai',
            completed: false
          });
          allActivities.push(createdAct);
        }
      }

      // Insert baseline expenses matching budget breakdown
      for (const b of budgetBreakdown) {
        await storage.createExpense({
          tripId: newTrip._id,
          title: `${b.category} Baseline Allocation`,
          amount: Math.round(b.amount * 0.4), // 40% initial commitment
          category: b.category,
          date: startDate,
          paidBy: 'Shihab'
        });
      }

      return res.status(201).json({
        success: true,
        savedTrip: newTrip,
        activitiesCount: allActivities.length,
        result
      });
    }

    return res.json({ success: true, result });
  } catch (error) {
    console.error('AI itinerary generation error:', error);
    res.status(500).json({ message: 'Error generating AI itinerary', error: error.message });
  }
};

exports.swapActivity = async (req, res) => {
  try {
    const { activityTitle, category = 'Sightseeing', destination = 'Tokyo, Japan', vibe = 'culture' } = req.body;

    const alternatives = [
      {
        title: `Scenic Traditional Tea Garden & Sweets in ${destination}`,
        category: category || 'Culture',
        location: `${destination} Waterfront District`,
        durationMin: 75,
        costEstimate: 20,
        description: 'Quiet contemplation pavilion with warm matcha, seasonal sweets, and koi ponds.',
        whyRecommended: 'More relaxing atmosphere with fewer crowds than original stop.'
      },
      {
        title: `Local Artisan Craft & Modern Gallery Walk`,
        category: 'Art & Design',
        location: `${destination} Creative Quarter`,
        durationMin: 90,
        costEstimate: 15,
        description: 'Contemporary exhibits featuring local ceramicists, textile artists, and indie printmakers.',
        whyRecommended: 'Great indoor alternative with high creative inspiration.'
      },
      {
        title: `Hidden Rooftop Café & Panoramic Skyline View`,
        category: 'Food & Dining',
        location: `${destination} City Center`,
        durationMin: 60,
        costEstimate: 18,
        description: 'Elevated terrace overlooking historic rooftops and distant mountain peaks.',
        whyRecommended: 'Unbeatable sunset photography angle with artisanal refreshments.'
      }
    ];

    res.json({
      success: true,
      original: activityTitle,
      alternatives
    });
  } catch (error) {
    console.error('AI activity swap error:', error);
    res.status(500).json({ message: 'Error swapping activity', error: error.message });
  }
};

exports.getAIChecklist = async (req, res) => {
  try {
    const { destination = 'Tokyo, Japan', days = 5 } = req.body;

    const checklist = [
      { category: 'Essentials', items: ['Passport valid for 6+ months', 'Debit/Credit cards with no foreign fees', 'Travel insurance documentation', 'eSIM QR code'] },
      { category: 'Tech', items: ['Power bank (10,000mAh+)', 'Universal travel adapter', 'Noise-canceling headphones', 'Multi-cable USB charger'] },
      { category: 'Weather & Comfort', items: ['Compact windproof umbrella', 'Slip-on comfortable walking shoes', 'Breathable layers', 'Hydration electrolyte tablets'] },
      { category: 'Transit', items: ['Metro transit pass voucher', 'Offline Google Maps download', 'Airport express rail ticket'] }
    ];

    res.json({ success: true, destination, checklist });
  } catch (error) {
    console.error('AI checklist error:', error);
    res.status(500).json({ message: 'Error generating checklist', error: error.message });
  }
};
