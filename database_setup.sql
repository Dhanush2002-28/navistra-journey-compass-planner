-- NAVISTRA Travel Planner Database Setup
-- Complete SQL script to create all tables and seed initial data
-- Run this script in your SQLite database tool or via command line
-- ================================================================================
-- CREATE TABLES
-- ================================================================================
-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Trips table for user trip plans
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    destination TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    budget_inr TEXT,
    travel_style TEXT CHECK(travel_style IN ('budget', 'normal', 'luxury')),
    travelers TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Itineraries table for destination-based travel plans
CREATE TABLE IF NOT EXISTS itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    destination TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    details TEXT NOT NULL,
    daywise TEXT NOT NULL,
    estimated_cost_inr INTEGER NOT NULL,
    over_budget BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- ================================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ================================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON trips(destination);
CREATE INDEX IF NOT EXISTS idx_itineraries_destination ON itineraries(destination);
-- ================================================================================
-- SEED INITIAL ITINERARY DATA
-- ================================================================================
-- Insert comprehensive itinerary data for popular destinations
INSERT
    OR REPLACE INTO itineraries (
        destination,
        summary,
        details,
        daywise,
        estimated_cost_inr,
        over_budget
    )
VALUES -- DOMESTIC DESTINATIONS
    (
        'Goa',
        'Tropical paradise with stunning beaches, Portuguese heritage, vibrant nightlife, and delicious seafood. Perfect for relaxation and cultural exploration.',
        '{"highlights": ["Beautiful beaches (Baga, Calangute, Anjuna)", "Portuguese colonial architecture", "Spice plantations tours", "Water sports and beach activities", "Vibrant nightlife and beach shacks", "Historic churches and temples"], "days": 4}',
        '[
    {"day": 1, "activities": ["Arrive in Goa", "Check into beach resort", "Relax at Baga Beach", "Sunset at Calangute Beach", "Dinner at beach shack"]},
    {"day": 2, "activities": ["Visit Basilica of Bom Jesus", "Explore Old Goa churches", "Spice plantation tour with lunch", "Evening at Anjuna Beach", "Night market shopping"]},
    {"day": 3, "activities": ["Water sports at Baga Beach", "Visit Fort Aguada", "Lunch at local restaurant", "Explore Mapusa Market", "Beach party at Tito''s Lane"]},
    {"day": 4, "activities": ["Morning at Palolem Beach", "Visit Dudhsagar Falls", "Farewell lunch", "Departure"]}
]',
        25000,
        0
    ),
    (
        'Manali',
        'Himalayan hill station offering snow-capped peaks, adventure sports, ancient temples, and serene valleys. Ideal for nature lovers and adventure seekers.',
        '{"highlights": ["Rohtang Pass and snow activities", "Solang Valley adventure sports", "Hadimba Temple and local culture", "Old Manali cafes and shopping", "Beas River and scenic valleys", "Traditional Himachali cuisine"], "days": 5}',
        '[
    {"day": 1, "activities": ["Arrive in Manali", "Check into hotel", "Explore Mall Road", "Visit Hadimba Temple", "Evening at Old Manali"]},
    {"day": 2, "activities": ["Early morning trip to Rohtang Pass", "Snow activities and photography", "Lunch at local dhaba", "Return to Manali", "Rest and local shopping"]},
    {"day": 3, "activities": ["Solang Valley adventure sports", "Paragliding or skiing", "Cable car ride", "Lunch with valley views", "Evening at Vashisht hot springs"]},
    {"day": 4, "activities": ["Visit Naggar Castle", "Explore Naggar village", "Trek to nearby waterfall", "Traditional Himachali lunch", "Evening cultural show"]},
    {"day": 5, "activities": ["Morning at Beas River", "Last-minute shopping", "Farewell lunch", "Departure"]}
]',
        35000,
        0
    ),
    (
        'Kerala Backwaters',
        'Tranquil network of canals, lagoons, and lakes offering houseboat experiences, traditional villages, and lush tropical scenery.',
        '{"highlights": ["Houseboat cruise experience", "Traditional Kerala villages", "Coconut groves and paddy fields", "Ayurvedic treatments", "Local Kerala cuisine", "Bird watching and nature"], "days": 4}',
        '[
    {"day": 1, "activities": ["Arrive in Alleppey", "Check into houseboat", "Cruise through backwaters", "Lunch on houseboat", "Sunset viewing", "Traditional Kerala dinner"]},
    {"day": 2, "activities": ["Village tour and local interactions", "Coconut grove walk", "Traditional coir making demo", "Ayurvedic massage session", "Peaceful evening on water"]},
    {"day": 3, "activities": ["Bird watching cruise", "Visit local market", "Cooking class on houseboat", "Fishing experience", "Cultural performance evening"]},
    {"day": 4, "activities": ["Final cruise", "Check out from houseboat", "Visit Alleppey beach", "Farewell lunch", "Departure"]}
]',
        30000,
        0
    ),
    (
        'Rajasthan (Jaipur-Udaipur)',
        'Royal heritage tour featuring magnificent palaces, colorful markets, desert landscapes, and rich Rajasthani culture.',
        '{"highlights": ["Amber Palace and City Palace", "Udaipur Lake Palace", "Desert safari experience", "Traditional Rajasthani cuisine", "Colorful bazaars and handicrafts", "Cultural folk performances"], "days": 6}',
        '[
    {"day": 1, "activities": ["Arrive in Jaipur", "Check into heritage hotel", "Visit City Palace", "Explore Jantar Mantar", "Shopping at Johari Bazaar"]},
    {"day": 2, "activities": ["Morning at Amber Palace", "Elephant ride experience", "Visit Hawa Mahal", "Lunch at traditional restaurant", "Evening at Nahargarh Fort"]},
    {"day": 3, "activities": ["Travel to Udaipur", "Check into lake-view hotel", "Evening boat ride on Lake Pichola", "Sunset at Lake Palace", "Traditional dinner"]},
    {"day": 4, "activities": ["Visit City Palace Udaipur", "Explore Saheliyon ki Bari", "Jagdish Temple visit", "Local market shopping", "Cultural folk show"]},
    {"day": 5, "activities": ["Day trip to Chittorgarh Fort", "Historical tour and lunch", "Return to Udaipur", "Farewell dinner at rooftop restaurant"]},
    {"day": 6, "activities": ["Morning at leisure", "Last-minute shopping", "Farewell lunch", "Departure"]}
]',
        50000,
        0
    ),
    -- INTERNATIONAL DESTINATIONS
    (
        'Thailand (Bangkok-Pattaya)',
        'Exotic Southeast Asian adventure with bustling cities, pristine beaches, golden temples, vibrant street food, and rich cultural heritage.',
        '{"highlights": ["Grand Palace and Wat Pho temples", "Floating markets experience", "Pattaya beaches and water sports", "Thai massage and spa treatments", "Street food tours", "Cultural shows and nightlife"], "days": 6}',
        '[
    {"day": 1, "activities": ["Arrive in Bangkok", "Check into hotel", "Visit Wat Pho temple", "Explore Khao San Road", "Traditional Thai dinner"]},
    {"day": 2, "activities": ["Grand Palace tour", "Wat Arun temple visit", "Chao Phraya river cruise", "Chatuchak market shopping", "Thai cooking class"]},
    {"day": 3, "activities": ["Floating market tour", "Travel to Pattaya", "Check into beach resort", "Pattaya beach relaxation", "Seafood dinner"]},
    {"day": 4, "activities": ["Coral Island day trip", "Snorkeling and water sports", "Beach lunch", "Return to Pattaya", "Walking Street nightlife"]},
    {"day": 5, "activities": ["Thai massage and spa day", "Nong Nooch Tropical Garden", "Cultural show", "Shopping at Central Festival", "Farewell dinner"]},
    {"day": 6, "activities": ["Morning at leisure", "Return to Bangkok", "Last-minute shopping", "Departure"]}
]',
        65000,
        0
    ),
    (
        'Dubai',
        'Futuristic desert metropolis featuring iconic skyscrapers, luxury shopping, desert safaris, pristine beaches, and world-class dining.',
        '{"highlights": ["Burj Khalifa and Dubai Mall", "Desert safari with BBQ dinner", "Dubai Marina and JBR beach", "Gold and spice souks", "Luxury shopping experience", "Traditional dhow cruise"], "days": 5}',
        '[
    {"day": 1, "activities": ["Arrive in Dubai", "Check into hotel", "Visit Dubai Mall", "Burj Khalifa observation deck", "Dubai Fountain show", "Dinner at mall"]},
    {"day": 2, "activities": ["Desert safari adventure", "Camel riding", "Sandboarding", "Traditional BBQ dinner", "Belly dance show", "Henna painting"]},
    {"day": 3, "activities": ["Dubai Marina walk", "JBR beach relaxation", "Atlantis Aquaventure", "Lunch at beachside restaurant", "Evening dhow cruise"]},
    {"day": 4, "activities": ["Gold Souk shopping", "Spice Souk exploration", "Dubai Museum visit", "Traditional lunch", "Mall of Emirates skiing"]},
    {"day": 5, "activities": ["Morning at Global Village", "Last-minute shopping", "Farewell lunch", "Departure"]}
]',
        85000,
        0
    ),
    (
        'Singapore',
        'Modern city-state blending cultures, offering futuristic gardens, diverse cuisine, family attractions, and efficient urban planning.',
        '{"highlights": ["Gardens by the Bay", "Marina Bay Sands SkyPark", "Universal Studios", "Chinatown and Little India", "Hawker centers food tour", "Singapore Zoo and Night Safari"], "days": 4}',
        '[
    {"day": 1, "activities": ["Arrive in Singapore", "Check into hotel", "Marina Bay Sands area", "Merlion Park photos", "Gardens by the Bay", "Light show evening"]},
    {"day": 2, "activities": ["Universal Studios full day", "Thrilling rides and shows", "Lunch in theme park", "Sentosa beach evening", "Cable car ride"]},
    {"day": 3, "activities": ["Chinatown exploration", "Little India cultural tour", "Hawker center food tour", "Singapore Zoo visit", "Night Safari experience"]},
    {"day": 4, "activities": ["Orchard Road shopping", "Singapore Botanic Gardens", "Last-minute souvenirs", "Farewell lunch", "Departure"]}
]',
        70000,
        0
    ),
    (
        'Bali, Indonesia',
        'Tropical island paradise with ancient temples, terraced rice fields, pristine beaches, vibrant culture, and spiritual experiences.',
        '{"highlights": ["Uluwatu Temple sunset", "Tegallalang Rice Terraces", "Ubud Monkey Forest", "Traditional Balinese cuisine", "Beach clubs and water sports", "Cultural dance performances"], "days": 5}',
        '[
    {"day": 1, "activities": ["Arrive in Bali", "Check into resort", "Seminyak beach relaxation", "Sunset at beach club", "Seafood dinner"]},
    {"day": 2, "activities": ["Uluwatu Temple tour", "Kecak fire dance show", "Traditional lunch", "Jimbaran bay seafood", "Beach evening"]},
    {"day": 3, "activities": ["Ubud day trip", "Monkey Forest visit", "Tegallalang Rice Terraces", "Traditional lunch", "Art market shopping"]},
    {"day": 4, "activities": ["Water sports day", "Nusa Dua beach", "Spa and wellness", "Cultural village tour", "Farewell dinner"]},
    {"day": 5, "activities": ["Temple hopping", "Last-minute shopping", "Beach relaxation", "Departure"]}
]',
        55000,
        0
    ),
    (
        'Maldives',
        'Luxury tropical escape with overwater bungalows, crystal-clear waters, pristine coral reefs, and ultimate relaxation.',
        '{"highlights": ["Overwater villa experience", "World-class diving and snorkeling", "Pristine white sand beaches", "Luxury spa treatments", "Sunset dolphin cruises", "Fine dining experiences"], "days": 4}',
        '[
    {"day": 1, "activities": ["Arrive in Maldives", "Seaplane to resort", "Check into overwater villa", "Resort orientation", "Sunset viewing", "Welcome dinner"]},
    {"day": 2, "activities": ["Snorkeling excursion", "Coral reef exploration", "Beach picnic lunch", "Spa treatment", "Romantic dinner"]},
    {"day": 3, "activities": ["Dolphin watching cruise", "Water sports activities", "Island hopping", "Local island visit", "Cultural experience"]},
    {"day": 4, "activities": ["Final relaxation", "Resort activities", "Farewell lunch", "Seaplane to airport", "Departure"]}
]',
        120000,
        1
    ),
    -- BUDGET-FRIENDLY OPTIONS
    (
        'Rishikesh',
        'Yoga capital of the world offering spiritual experiences, adventure sports, Ganges river activities, and Himalayan foothills.',
        '{"highlights": ["Yoga and meditation sessions", "River rafting on Ganges", "Beatles Ashram visit", "Spiritual temples and ghats", "Adventure sports", "Organic food and cafes"], "days": 4}',
        '[
    {"day": 1, "activities": ["Arrive in Rishikesh", "Check into ashram/hotel", "Evening Ganga Aarti", "Laxman Jhula walk", "Riverside dinner"]},
    {"day": 2, "activities": ["Morning yoga session", "River rafting adventure", "Beatles Ashram visit", "Organic lunch", "Meditation session"]},
    {"day": 3, "activities": ["Temple hopping", "Neelkanth Mahadev visit", "Jungle trek", "Ayurvedic massage", "Satsang evening"]},
    {"day": 4, "activities": ["Final yoga class", "Spiritual shopping", "Farewell lunch", "Departure"]}
]',
        15000,
        0
    ),
    (
        'Hampi',
        'UNESCO World Heritage site featuring ancient ruins, boulder landscapes, rich history, and budget-friendly exploration.',
        '{"highlights": ["Vijayanagara Empire ruins", "Unique boulder landscapes", "Ancient temples and palaces", "Tungabhadra river", "Budget backpacker scene", "Historical significance"], "days": 3}',
        '[
    {"day": 1, "activities": ["Arrive in Hampi", "Check into guesthouse", "Virupaksha Temple visit", "Hampi Bazaar exploration", "Sunset at Hemakuta Hill"]},
    {"day": 2, "activities": ["Vittala Temple complex", "Stone Chariot photography", "Royal enclosure tour", "Tungabhadra river coracle ride", "Hippie Island visit"]},
    {"day": 3, "activities": ["Monkey Temple trek", "Archaeological museum", "Local market shopping", "Farewell lunch", "Departure"]}
]',
        12000,
        0
    ),
    -- MOUNTAIN DESTINATIONS
    (
        'Leh-Ladakh',
        'High-altitude desert offering dramatic landscapes, Buddhist monasteries, adventure roads, and unique cultural experiences.',
        '{"highlights": ["Pangong Tso lake", "Magnetic Hill phenomenon", "Ancient Buddhist monasteries", "Khardung La high pass", "Local Ladakhi culture", "Adventure biking routes"], "days": 7}',
        '[
    {"day": 1, "activities": ["Arrive in Leh", "Acclimatization rest", "Local market walk", "Shanti Stupa evening", "Light dinner"]},
    {"day": 2, "activities": ["Hemis Monastery", "Thiksey Monastery", "Shey Palace", "Traditional lunch", "Rest and acclimatization"]},
    {"day": 3, "activities": ["Day trip to Pangong Tso", "Lake photography", "Camping/accommodation", "Stargazing night"]},
    {"day": 4, "activities": ["Return from Pangong", "Magnetic Hill visit", "Gurudwara Pathar Sahib", "Hall of Fame museum"]},
    {"day": 5, "activities": ["Khardung La pass expedition", "World''s highest motorable road", "Nubra Valley exploration", "Camel safari"]},
    {"day": 6, "activities": ["Return to Leh", "Diskit Monastery", "Local shopping", "Cultural evening"]},
    {"day": 7, "activities": ["Final sightseeing", "Souvenir shopping", "Farewell lunch", "Departure"]}
]',
        45000,
        0
    ),
    (
        'Darjeeling',
        'Queen of Hills offering tea gardens, toy train rides, Himalayan views, colonial charm, and pleasant weather.',
        '{"highlights": ["Tiger Hill sunrise over Kanchenjunga", "Darjeeling Himalayan Railway", "Tea garden tours", "Buddhist monasteries", "Colonial architecture", "Local Tibetan culture"], "days": 4}',
        '[
    {"day": 1, "activities": ["Arrive in Darjeeling", "Check into hotel", "Mall Road exploration", "Chowrasta walk", "Evening tea tasting"]},
    {"day": 2, "activities": ["Early morning Tiger Hill", "Sunrise over Kanchenjunga", "Ghum Monastery", "Toy train ride", "Tea garden visit"]},
    {"day": 3, "activities": ["Himalayan Mountaineering Institute", "Zoo and Snow Leopard center", "Tibetan Refugee Center", "Peace Pagoda", "Local market"]},
    {"day": 4, "activities": ["Morning leisure", "Last tea shopping", "Farewell lunch", "Departure"]}
]',
        20000,
        0
    );
-- ================================================================================
-- CREATE SAMPLE USER (for testing purposes)
-- ================================================================================
-- Sample user for testing (password is 'password123' hashed with bcrypt)
INSERT
    OR IGNORE INTO users (name, email, password_hash)
VALUES (
        'Test User',
        'test@navistra.com',
        '$2a$10$rOFJMj9GHlDUxZL5ZCvPFe8ZkMHq3cI9XQZF.qV6LkEwCK8PpA5xy'
    );
-- ================================================================================
-- VERIFICATION QUERIES
-- ================================================================================
-- Uncomment these to verify your data after running the script:
-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_itineraries FROM itineraries;
-- SELECT destination, estimated_cost_inr FROM itineraries ORDER BY estimated_cost_inr;
-- SELECT name, email FROM users;
-- ================================================================================
-- MAINTENANCE QUERIES
-- ================================================================================
-- Clean up test data (uncomment if needed):
-- DELETE FROM trips WHERE user_id = (SELECT id FROM users WHERE email = 'test@navistra.com');
-- DELETE FROM users WHERE email = 'test@navistra.com';
-- Reset auto-increment (uncomment if needed):
-- DELETE FROM sqlite_sequence WHERE name IN ('users', 'itineraries');
-- Drop all tables (uncomment if you want to start fresh):
-- DROP TABLE IF EXISTS trips;
-- DROP TABLE IF EXISTS itineraries;
-- DROP TABLE IF EXISTS users;
-- ================================================================================
-- END OF SCRIPT
-- ================================================================================