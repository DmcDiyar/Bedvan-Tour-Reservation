const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIResponse = require('./../utils/apiResponse');

// Get all tours with search, filter, and sort capabilities
exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json(
    APIResponse.success(
      {
        results: tours.length,
        data: tours,
      },
      'Tours retrieved successfully',
      200,
    ),
  );
});

// Enhanced AI Assistant query handler with conversational capabilities
exports.aiQuery = catchAsync(async (req, res, next) => {
  const { query } = req.body;

  if (!query) {
    return next(new AppError('Query is required', 400));
  }

  // Parse the query to determine what information the user is looking for
  const lowerQuery = query.toLowerCase();

  let response = '';

  // Handle tour-specific queries with richer information
  if (
    lowerQuery.includes('the sea explorer') ||
    lowerQuery.includes('sea explorer')
  ) {
    response = `The Sea Explorer is one of our most popular tours, offering an incredible 7-day journey through the beautiful waters of Miami, USA. Priced at $497, this medium-difficulty adventure is perfect for travelers who love ocean experiences and marine life.

Tour Highlights:
• Daily boat trips to explore hidden coves and pristine beaches
• Snorkeling sessions in crystal-clear waters with vibrant coral reefs
• Island exploration with opportunities to see native wildlife
• Professional guides who are experts in marine biology
• All equipment provided, including snorkels, masks, and fins

What makes this tour special:
With an outstanding 4.8/5 rating from 23 reviews, travelers consistently praise the sunset sailing sessions and the knowledgeable guides who share fascinating insights about local marine ecosystems. The small group size (maximum 15 people) ensures personalized attention.

My personal take:
This tour strikes a perfect balance between relaxation and adventure. It's ideal for couples, friends, or solo travelers seeking a memorable ocean experience without the intensity of more challenging adventures. The marine life encounters are genuinely magical!

For more details, check out the tour page here: /tour/the-sea-explorer

Would you like to know about any specific aspect of this tour?`;
  } else if (
    lowerQuery.includes('the forest hiker') ||
    lowerQuery.includes('forest hiker')
  ) {
    response = `The Forest Hiker is a wonderful 5-day easy-difficulty tour set in the breathtaking Banff National Park, Canada. At $397, it's perfect for nature lovers and beginners seeking a peaceful outdoor experience.

Tour Highlights:
• Guided nature walks through ancient forests and alpine meadows
• Scenic viewpoints with panoramic mountain vistas
• Educational sessions about local flora and fauna
• Comfortable accommodation in eco-friendly lodges
• All meals included with locally sourced ingredients

What makes this tour special:
With a perfect 5/5 rating from 9 reviews, guests consistently highlight the knowledgeable guides and the tranquil atmosphere. The tour is designed to minimize environmental impact while maximizing your connection with nature.

My personal take:
This tour is ideal for those seeking a gentle introduction to hiking or for travelers who want to unwind in nature's embrace. The forest walks are meditative, and the guides truly enhance the experience with their insights about the local ecosystem.

For more details, check out the tour page here: /tour/the-forest-hiker

Would you like recommendations for similar nature-based tours?`;
  } else if (
    lowerQuery.includes('the snow adventurer') ||
    lowerQuery.includes('snow adventurer')
  ) {
    response = `The Snow Adventurer is our most challenging tour, a 4-day extreme adventure in the legendary slopes of Aspen, USA. Priced at $997, this difficult-level tour is designed for experienced winter sports enthusiasts.

Tour Highlights:
• Expert-guided snowboarding on backcountry terrain
• Ski touring with access to untouched powder snow
• Ice climbing excursions with professional instruction
• Luxury mountain lodge accommodation with spa facilities
• All technical equipment provided, including avalanche safety gear

What makes this tour special:
With an impressive 4.9/5 rating from 15 reviews, thrill-seekers praise the challenging terrain and the expertise of our professional guides. The small group size (maximum 10 people) ensures safety while maintaining the adventure spirit.

My personal take:
This is not for the faint-hearted! It's perfect for experienced skiers and snowboarders looking to push their limits. The ice climbing component adds a unique dimension that you won't find in typical ski resort experiences.

For more details, check out the tour page here: /tour/the-snow-adventurer

Are you an experienced winter sports enthusiast looking for this kind of challenge?`;
  }
  // Handle tour comparisons with detailed analysis
  else if (
    (lowerQuery.includes('compare') ||
      lowerQuery.includes('fark') ||
      lowerQuery.includes('difference')) &&
    (lowerQuery.includes('forest hiker') ||
      lowerQuery.includes('snow adventurer'))
  ) {
    response = `Here's a detailed comparison between The Forest Hiker and The Snow Adventurer:

**Difficulty & Experience Level:**
• The Forest Hiker: Easy - Perfect for beginners and those seeking relaxation
• The Snow Adventurer: Difficult - For experienced adventurers seeking thrills

**Duration & Intensity:**
• The Forest Hiker: 5 days of gentle, meditative hiking
• The Snow Adventurer: 4 intense days of high-adrenaline activities

**Price & Value:**
• The Forest Hiker: $397 - Exceptional value for a peaceful nature experience
• The Snow Adventurer: $997 - Premium pricing for extreme adventure and specialized equipment

**Locations & Scenery:**
• The Forest Hiker: Banff, Canada - Ancient forests, alpine meadows, and serene lakes
• The Snow Adventurer: Aspen, USA - Majestic mountains, powder snow, and dramatic winter landscapes

**Group Experience:**
• The Forest Hiker: Maximum 25 people - More social, less intensive guidance
• The Snow Adventurer: Maximum 10 people - Intensive personal attention for safety

My analysis:
The Forest Hiker offers a restorative escape into nature's tranquility, ideal for unwinding and gentle exercise. The Snow Adventurer delivers an intense, adrenaline-fueled experience for those who crave extreme challenges. Your choice should depend on your fitness level, adventure appetite, and what kind of memories you want to create.

Would you like specific details about either tour's accommodation or activity schedule?`;
  }
  // Handle recommendations with personalized suggestions
  else if (
    lowerQuery.includes('recommend') ||
    lowerQuery.includes('öner') ||
    lowerQuery.includes('suggest') ||
    lowerQuery.includes('öne sürmek') ||
    lowerQuery.includes('easy') ||
    lowerQuery.includes('kolay') ||
    lowerQuery.includes('under $500') ||
    lowerQuery.includes('500 altı') ||
    lowerQuery.includes('budget') ||
    lowerQuery.includes('bütçe')
  ) {
    response = `Based on your interest, here are my personalized recommendations:

**For Budget-Conscious Travelers (Under $500):**
1. The Forest Hiker (Banff, Canada)
   - 5-day easy tour at $397
   - Perfect for beginners seeking peaceful nature experiences
   - 5/5 rating from 9 reviews
   - Includes all meals and eco-friendly accommodation

2. The Sea Explorer (Miami, USA)
   - 7-day medium difficulty tour at $497
   - Great for ocean lovers and marine life enthusiasts
   - 4.8/5 rating from 23 reviews
   - Includes all water sports equipment

**For Adventure Seekers:**
1. The Snow Adventurer (Aspen, USA)
   - 4-day difficult tour at $997
   - For experienced winter sports enthusiasts
   - 4.9/5 rating from 15 reviews
   - Includes luxury accommodation and all technical equipment

My personal recommendation:
If you're new to adventure tours, start with The Forest Hiker to build confidence and appreciation for nature. Then progress to The Sea Explorer for a moderate ocean adventure. Only attempt The Snow Adventurer if you have prior winter sports experience.

Would you like to know more about any of these tours or have different criteria for recommendations?`;
  }
  // Handle site information queries with detailed introduction
  else if (
    lowerQuery.includes('what is bedvan') ||
    lowerQuery.includes('bedvan nedir') ||
    lowerQuery.includes('what is this site') ||
    lowerQuery.includes('bu site nedir') ||
    lowerQuery.includes('tell me about') ||
    lowerQuery.includes('hakkında bilgi') ||
    lowerQuery.includes('introduce') ||
    lowerQuery.includes('tanıtmak')
  ) {
    response = `Welcome to Bedvan Tours - Your Gateway to Extraordinary Adventures!

We're more than just a tour booking platform. Bedvan Tours is a carefully curated adventure ecosystem designed for travelers who seek authentic, meaningful experiences in nature's most stunning locations.

Our Philosophy:
• Sustainable Tourism: We partner with local communities to ensure our tours benefit the places we explore
• Expert Curation: Every tour in our collection is personally vetted for quality and uniqueness
• Adventure for All: From gentle nature walks to extreme sports, we have something for every fitness level
• Local Expertise: Our guides are passionate locals who share their deep knowledge and love for their regions

What Sets Us Apart:
✓ Handpicked tours in breathtaking natural locations worldwide
✓ Detailed information including difficulty levels, duration, and pricing transparency
✓ Verified customer reviews and ratings to help you choose confidently
✓ Secure booking process with instant confirmation and 24/7 customer support
✓ Flexible cancellation policies on most tours

Our Featured Destinations:
• Canadian Rockies (Banff): Pristine forests and alpine landscapes
• Miami Coastline: Vibrant marine ecosystems and tropical islands
• Aspen Mountains: World-class ski terrain and winter wonderlands

Ready to begin your adventure? I can help you find the perfect tour based on your interests, budget, or experience level. What kind of adventure are you seeking?`;
  }
  // Handle booking process queries with step-by-step guidance
  else if (
    lowerQuery.includes('how to book') ||
    lowerQuery.includes('nasıl rezervasyon') ||
    lowerQuery.includes('how to reserve') ||
    lowerQuery.includes('nasıl kayıt') ||
    lowerQuery.includes('booking process') ||
    lowerQuery.includes('rezervasyon süreci') ||
    lowerQuery.includes('steps to book') ||
    lowerQuery.includes('adımlar')
  ) {
    response = `Booking your perfect adventure with Bedvan Tours is simple and secure. Here's our step-by-step process:

**Step 1: Discover Your Adventure**
• Browse our tour collection using the search bar or category filters
• Use our difficulty, price, and location filters to narrow down options
• Read detailed descriptions, reviews, and view photo galleries

**Step 2: Select & Customize**
• Click on any tour to view comprehensive details
• Choose your preferred start date from available options
• Specify the number of participants and any special requests
• Review the complete itinerary and what's included

**Step 3: Secure Booking**
• Proceed to our encrypted payment gateway
• Enter your payment details (we accept all major cards)
• Review your booking summary and terms

**Step 4: Confirmation & Preparation**
• Receive instant email confirmation with booking details
• Access your booking through your account dashboard
• Get pre-tour information including what to pack and meeting points
• Download our mobile app for on-the-go access to your itinerary

**Our Guarantees:**
✓ 24/7 customer support before, during, and after your tour
✓ Flexible cancellation policies on most tours (check individual terms)
✓ Price matching guarantee - we'll match any lower legitimate price
✓ Satisfaction guarantee or your money back

Need help with any specific step in the booking process?`;
  }
  // Handle general travel advice with personalized tips
  else if (
    lowerQuery.includes('best time') ||
    lowerQuery.includes('en iyi zaman') ||
    lowerQuery.includes('when to visit') ||
    lowerQuery.includes('ne zaman gitmeli') ||
    lowerQuery.includes('season') ||
    lowerQuery.includes('sezon') ||
    lowerQuery.includes('weather') ||
    lowerQuery.includes('hava durumu')
  ) {
    response = `Based on our extensive tour data and traveler feedback, here's my expert advice on the best times to visit our featured destinations:

**For Miami (The Sea Explorer):**
Optimal Period: March to May and November to December
Why: These shoulder seasons offer pleasant temperatures (70-80°F), lower humidity, and fewer crowds. The water is still warm for snorkeling, and you'll experience fewer afternoon thunderstorms than in summer.

**For Banff (The Forest Hiker):**
Summer (June to August): Perfect for hiking with all trails accessible and wildflowers in bloom
Winter (December to March): Ideal for snowshoeing and winter photography, with dramatic snow-covered landscapes

**For Aspen (The Snow Adventurer):**
Peak Season: December to March for optimal snow conditions
Best Value: January and February for excellent snow quality with fewer crowds than December and March

Pro Tips:
• Book 2-3 months in advance for peak seasons
• Consider visiting just before or after peak times for better deals
• Weather can be unpredictable, so pack layers regardless of season
• Check our tour pages for seasonal activity variations

Would you like specific packing advice for any of these destinations?`;
  }
  // Handle questions about reviews and ratings
  else if (
    lowerQuery.includes('review') ||
    lowerQuery.includes('yorum') ||
    lowerQuery.includes('rating') ||
    lowerQuery.includes('derecelendirme') ||
    lowerQuery.includes('feedback') ||
    lowerQuery.includes('geri bildirim')
  ) {
    response = `Reviews and ratings are at the heart of what makes Bedvan Tours trustworthy. Here's how we ensure authentic and helpful feedback:

**Our Review System:**
• Only verified customers who completed a tour can leave reviews
• Reviews are moderated to ensure they're genuine and helpful
• We encourage detailed feedback about guides, accommodation, activities, and overall experience
• Both positive and constructive feedback are welcome

**What Our Travelers Say:**
The Sea Explorer: "The snorkeling spots the guide took us to were incredible! We saw more marine life in one day than we expected in the whole trip." - Sarah M.

The Forest Hiker: "Our guide's knowledge of local plants and animals made every walk fascinating. This wasn't just hiking, it was education in nature." - David T.

The Snow Adventurer: "Challenging terrain with excellent safety protocols. The guides pushed us to improve while keeping us secure." - Maria K.

**Rating Criteria:**
We calculate ratings based on:
1. Guide expertise and friendliness
2. Tour organization and punctuality
3. Quality of accommodation and meals
4. Value for money
5. Overall experience satisfaction

**My Take:**
I always recommend reading both high and moderate ratings to get a balanced view. Pay attention to recent reviews and comments that match your priorities (e.g., if you're concerned about fitness levels or specific activities).

Would you like to see reviews for a specific tour?`;
  }
  // Default response with search functionality
  else {
    response = `I understand you're looking for information about "${query}". While I don't have the exact details for that specific request, I can help you find what you're looking for.

Our most popular tours include:
1. The Sea Explorer (Miami, USA) - Ocean adventures
2. The Forest Hiker (Banff, Canada) - Nature walks
3. The Snow Adventurer (Aspen, USA) - Winter sports

I can provide detailed information about any of these tours, help you compare options, suggest personalized recommendations, or answer questions about our booking process and destinations.

Some example questions you might ask:
• "Tell me about The Forest Hiker tour"
• "Compare The Sea Explorer and The Snow Adventurer"
• "Recommend budget-friendly tours"
• "Best time to visit Miami for The Sea Explorer"
• "How does the booking process work?"

What would you like to know more about?`;
  }

  res.status(200).json({
    status: 'success',
    data: {
      response,
    },
  });
});

// Search tours by name, location, or description
exports.searchTours = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new AppError('Search query is required', 400));
  }

  const tours = await Tour.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { 'startLocation.description': { $regex: query, $options: 'i' } },
      { 'locations.description': { $regex: query, $options: 'i' } },
    ],
  });

  res.status(200).json(
    APIResponse.success(
      {
        results: tours.length,
        data: tours,
      },
      'Search results retrieved successfully',
      200,
    ),
  );
});

// Get tours by difficulty
exports.getToursByDifficulty = catchAsync(async (req, res, next) => {
  const { difficulty } = req.params;

  const tours = await Tour.find({ difficulty });

  res.status(200).json(
    APIResponse.success(
      {
        results: tours.length,
        data: tours,
      },
      `Tours with ${difficulty} difficulty retrieved successfully`,
      200,
    ),
  );
});

// Get tours within a radius
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json(
    APIResponse.success(
      {
        results: tours.length,
        data: tours,
      },
      'Tours within radius retrieved successfully',
      200,
    ),
  );
});

// Get distances to all tours from a point
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json(
    APIResponse.success(
      {
        results: distances.length,
        data: distances,
      },
      'Distances calculated successfully',
      200,
    ),
  );
});

// Filter tours with advanced options (for frontend use)
exports.filterTours = catchAsync(async (req, res, next) => {
  // Use APIFeatures for consistent filtering, sorting, and pagination
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json(
    APIResponse.success(
      {
        results: tours.length,
        data: tours,
      },
      'Filtered tours retrieved successfully',
      200,
    ),
  );
});
