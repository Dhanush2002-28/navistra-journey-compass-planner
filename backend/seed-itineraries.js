import pool from './db.js';

// Expanded list of 120+ unique destinations (80+ Indian, 40+ foreign)
const destinations = [
    // Indian Destinations (80+)
    'Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Agra', 'Varanasi', 'Kerala', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Udaipur', 'Amritsar', 'Rishikesh', 'Manali', 'Leh', 'Darjeeling', 'Mysore', 'Ooty', 'Pune',
    'Shimla', 'Haridwar', 'Jodhpur', 'Rajasthan', 'Pondicherry', 'Hampi', 'Munnar', 'Alleppey', 'Kodaikanal',
    'Nainital', 'Mussoorie', 'Ranthambore', 'Kaziranga', 'Shillong', 'Tawang', 'Aizawl', 'Imphal', 'Agartala',
    'Bodh Gaya', 'Gaya', 'Rajgir', 'Nalanda', 'Sikkim', 'Ladakh', 'Srinagar', 'Gulmarg', 'Mount Abu', 'Ajmer',
    'Pushkar', 'Jaisalmer', 'Khajuraho', 'Aurangabad', 'Nashik', 'Shirdi', 'Mahabaleshwar', 'Lonavala', 'Khandala',
    'Andaman Islands', 'Lakshadweep', 'Coorg', 'Wayanad', 'Thekkady', 'Kovalam', 'Kochi', 'Madurai', 'Rameswaram',
    'Kanyakumari', 'Tirupati', 'Vijayawada', 'Visakhapatnam', 'Bhubaneswar', 'Puri', 'Konark', 'Gangtok', 'Kalimpong',
    'Mcleodganj', 'Dalhousie', 'Kasauli', 'Chandigarh', 'Dehradun', 'Auli', 'Kedarnath', 'Badrinath', 'Uttarkashi',
    'Rishikesh', 'Haridwar', 'Corbett', 'Nainital', 'Almora', 'Ranikhet', 'Binsar', 'Kausani', 'Lansdowne',
    // Foreign Destinations (40+)
    'Paris', 'London', 'New York', 'Tokyo', 'Dubai', 'Singapore', 'Bangkok', 'Sydney', 'Rome', 'Istanbul',
    'Bali', 'Maldives', 'Zurich', 'Cape Town', 'Barcelona', 'Los Angeles', 'Toronto', 'Hong Kong', 'Florence',
    'Venice', 'Madrid', 'Berlin', 'Vienna', 'Prague', 'Budapest', 'Lisbon', 'Dublin', 'Edinburgh', 'Brussels',
    'Geneva', 'Copenhagen', 'Stockholm', 'Oslo', 'Helsinki', 'Warsaw', 'Athens', 'Santorini', 'Mykonos', 'Seoul',
    'Beijing', 'Shanghai', 'Macau', 'Phuket', 'Kuala Lumpur', 'Hanoi', 'Siem Reap', 'Colombo', 'Kathmandu',
    'Queenstown', 'Auckland', 'Fiji', 'Tahiti', 'Rio de Janeiro', 'Buenos Aires', 'Johannesburg', 'Cairo',
    'Doha', 'Abu Dhabi', 'Muscat', 'San Francisco', 'Vancouver'
];

// Helper to generate dummy itinerary data (for destinations without detailed itineraries)
function generateItinerary(dest) {
    const isIndian = !['Paris', 'London', 'New York', 'Tokyo', 'Dubai', 'Singapore', 'Bangkok', 'Sydney', 'Rome', 'Istanbul',
        'Bali', 'Maldives', 'Zurich', 'Cape Town', 'Barcelona', 'Los Angeles', 'Toronto', 'Hong Kong', 'Florence',
        'Venice', 'Madrid', 'Berlin', 'Vienna', 'Prague', 'Budapest', 'Lisbon', 'Dublin', 'Edinburgh', 'Brussels',
        'Geneva', 'Copenhagen', 'Stockholm', 'Oslo', 'Helsinki', 'Warsaw', 'Athens', 'Santorini', 'Mykonos', 'Seoul',
        'Beijing', 'Shanghai', 'Macau', 'Phuket', 'Kuala Lumpur', 'Hanoi', 'Siem Reap', 'Colombo', 'Kathmandu',
        'Queenstown', 'Auckland', 'Fiji', 'Tahiti', 'Rio de Janeiro', 'Buenos Aires', 'Johannesburg', 'Cairo',
        'Doha', 'Abu Dhabi', 'Muscat', 'San Francisco', 'Vancouver'].includes(dest);

    const days = isIndian ? 3 + Math.floor(Math.random() * 3) : 4 + Math.floor(Math.random() * 3);
    return {
        destination: dest,
        summary: isIndian
            ? `Explore the beauty and culture of ${dest}, a top destination in India.`
            : `Experience the wonders of ${dest}, a must-visit international destination.`,
        details: {
            highlights: [
                `Top sights in ${dest}`,
                `Local cuisine and markets in ${dest}`,
                `Cultural experiences in ${dest}`,
                `Nature and outdoor activities in ${dest}`,
            ],
            days,
        },
        daywise: Array.from({ length: days }, (_, i) => ({
            day: i + 1,
            activities: [
                `Day ${i + 1} sightseeing in ${dest}`,
                `Try local food in ${dest}`,
                `Evening leisure in ${dest}`,
            ],
        })),
        estimated_cost_inr: isIndian
            ? 10000 + Math.floor(Math.random() * 20000)
            : 50000 + Math.floor(Math.random() * 100000),
    };
}

const itineraries = destinations.map(generateItinerary);

// Real detailed itineraries for popular destinations
const realItineraries = [
    // Indian Destinations
    {
        destination: 'Delhi',
        summary: 'India\'s capital city blending ancient history with modern culture, featuring magnificent monuments and vibrant markets.',
        details: {
            highlights: [
                'Red Fort & Jama Masjid',
                'India Gate & Rajpath',
                'Qutub Minar',
                'Lotus Temple',
                'Chandni Chowk',
                'Humayun\'s Tomb',
                'Akshardham Temple'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Delhi', 'Visit Red Fort', 'Explore Chandni Chowk', 'Evening at India Gate'] },
            { day: 2, activities: ['Qutub Minar', 'Humayun\'s Tomb', 'Lotus Temple', 'Akshardham Temple'] },
            { day: 3, activities: ['Raj Ghat', 'National Museum', 'Connaught Place shopping', 'Departure'] },
        ],
        estimated_cost_inr: 15000,
    },
    {
        destination: 'Mumbai',
        summary: 'The financial capital of India, known for Bollywood, colonial architecture, and bustling street life.',
        details: {
            highlights: [
                'Gateway of India',
                'Marine Drive',
                'Elephanta Caves',
                'Crawford Market',
                'Chhatrapati Shivaji Terminus',
                'Dhobi Ghat',
                'Bollywood Studios'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Mumbai', 'Gateway of India', 'Taj Hotel', 'Marine Drive sunset'] },
            { day: 2, activities: ['Elephanta Caves day trip', 'Crawford Market', 'Dhobi Ghat', 'Chowpatty Beach'] },
            { day: 3, activities: ['Bollywood Studios tour', 'Bandra-Worli Sea Link', 'Shopping at Linking Road', 'Departure'] },
        ],
        estimated_cost_inr: 18000,
    },
    {
        destination: 'Goa',
        summary: 'A vibrant beach destination known for its nightlife, beaches, and Portuguese heritage.',
        details: {
            highlights: [
                'Baga & Anjuna Beaches',
                'Old Goa Churches',
                'Fort Aguada',
                'Chapora Fort',
                'Dudhsagar Falls',
                'Nightlife at Tito\'s Lane',
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Goa', 'Relax at Baga Beach', 'Evening at beach shack'] },
            { day: 2, activities: ['Visit Old Goa churches', 'Explore Panaji', 'Mandovi River cruise'] },
            { day: 3, activities: ['Water sports at Calangute', 'Fort Aguada', 'Nightlife at Tito\'s Lane'] },
            { day: 4, activities: ['Dudhsagar Falls day trip', 'Shopping at Anjuna Flea Market', 'Departure'] },
        ],
        estimated_cost_inr: 22000,
    },
    {
        destination: 'Jaipur',
        summary: 'The Pink City, known for its majestic palaces, forts, and vibrant Rajasthani culture.',
        details: {
            highlights: [
                'Amber Fort',
                'City Palace',
                'Hawa Mahal',
                'Jantar Mantar',
                'Nahargarh Fort',
                'Jaigarh Fort',
                'Johari Bazaar'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Jaipur', 'City Palace', 'Hawa Mahal', 'Evening at Chokhi Dhani'] },
            { day: 2, activities: ['Amber Fort (elephant ride)', 'Jaigarh Fort', 'Nahargarh Fort sunset', 'Local dinner'] },
            { day: 3, activities: ['Jantar Mantar', 'Shopping at Johari Bazaar', 'Albert Hall Museum', 'Departure'] },
        ],
        estimated_cost_inr: 16000,
    },
    {
        destination: 'Phuket',
        summary: 'Thailand\'s largest island, known for its stunning beaches and vibrant nightlife.',
        details: {
            highlights: [
                'Patong Beach',
                'Phi Phi Islands',
                'Big Buddha',
                'Bangla Road',
                'James Bond Island',
                'Kata Beach',
                'Thai Cooking Classes'
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Phuket', 'Patong Beach', 'Bangla Road nightlife'] },
            { day: 2, activities: ['Phi Phi Islands day trip', 'Maya Bay', 'Snorkeling', 'Island hopping'] },
            { day: 3, activities: ['James Bond Island tour', 'Canoeing', 'Big Buddha', 'Kata Beach sunset'] },
            { day: 4, activities: ['Thai cooking class', 'Chalong Temple', 'Shopping', 'Departure'] },
        ],
        estimated_cost_inr: 50000,
    },
    {
        destination: 'Kuala Lumpur',
        summary: 'Malaysia\'s capital, known for its iconic Petronas Towers and diverse culture.',
        details: {
            highlights: [
                'Petronas Twin Towers',
                'Batu Caves',
                'KL Tower',
                'Chinatown',
                'Bukit Bintang',
                'Central Market',
                'Genting Highlands'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in KL', 'Petronas Twin Towers', 'KLCC Park', 'Bukit Bintang'] },
            { day: 2, activities: ['Batu Caves', 'KL Tower', 'Chinatown', 'Central Market'] },
            { day: 3, activities: ['Genting Highlands day trip', 'Shopping at Pavilion', 'Departure'] },
        ],
        estimated_cost_inr: 42000,
    },
    {
        destination: 'Hong Kong',
        summary: 'A vibrant city where East meets West, known for its skyline and cuisine.',
        details: {
            highlights: [
                'Victoria Peak',
                'Symphony of Lights',
                'Disneyland Hong Kong',
                'Star Ferry',
                'Temple Street Night Market',
                'Tsim Sha Tsui Promenade',
                'Dim Sum Tour'
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Hong Kong', 'Victoria Peak', 'Star Ferry ride', 'Symphony of Lights'] },
            { day: 2, activities: ['Disneyland Hong Kong', 'Disney character meet & greet'] },
            { day: 3, activities: ['Temple Street Night Market', 'Tsim Sha Tsui', 'Dim Sum tour', 'Shopping'] },
            { day: 4, activities: ['Big Buddha', 'Po Lin Monastery', 'Ngong Ping Cable Car', 'Departure'] },
        ],
        estimated_cost_inr: 70000,
    },
    {
        destination: 'Agra',
        summary: 'Home to the iconic Taj Mahal, one of the Seven Wonders of the World.',
        details: {
            highlights: [
                'Taj Mahal',
                'Agra Fort',
                'Mehtab Bagh',
                'Itimad-ud-Daulah',
                'Fatehpur Sikri',
                'Mughal Gardens'
            ],
            days: 2,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Agra', 'Taj Mahal sunrise', 'Agra Fort', 'Mehtab Bagh sunset'] },
            { day: 2, activities: ['Fatehpur Sikri day trip', 'Itimad-ud-Daulah', 'Local marble shopping', 'Departure'] },
        ],
        estimated_cost_inr: 12000,
    },
    {
        destination: 'Varanasi',
        summary: 'The spiritual capital of India, one of the oldest living cities in the world.',
        details: {
            highlights: [
                'Dashashwamedh Ghat',
                'Ganga Aarti',
                'Kashi Vishwanath Temple',
                'Sarnath',
                'Boat ride on Ganges',
                'Banaras Hindu University'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Varanasi', 'Evening Ganga Aarti', 'Walk through ghats'] },
            { day: 2, activities: ['Early morning boat ride', 'Kashi Vishwanath Temple', 'Sarnath excursion'] },
            { day: 3, activities: ['Banaras Hindu University', 'Silk weaving center', 'Local food tour', 'Departure'] },
        ],
        estimated_cost_inr: 13000,
    },
    {
        destination: 'Kerala',
        summary: 'God\'s Own Country, known for backwaters, hill stations, and spice plantations.',
        details: {
            highlights: [
                'Alleppey Backwaters',
                'Munnar Tea Gardens',
                'Thekkady Wildlife',
                'Kovalam Beach',
                'Kochi Fort',
                'Kathakali Dance'
            ],
            days: 5,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Kochi', 'Fort Kochi', 'Chinese Fishing Nets', 'Kathakali show'] },
            { day: 2, activities: ['Drive to Munnar', 'Tea Museum', 'Tea garden walk', 'Overnight in Munnar'] },
            { day: 3, activities: ['Munnar sightseeing', 'Eravikulam National Park', 'Drive to Thekkady'] },
            { day: 4, activities: ['Periyar Wildlife Sanctuary', 'Spice plantation tour', 'Drive to Alleppey'] },
            { day: 5, activities: ['Houseboat experience', 'Backwater cruise', 'Departure from Kochi'] },
        ],
        estimated_cost_inr: 28000,
    },
    {
        destination: 'Mysore',
        summary: 'A royal city known for its palaces, gardens, and rich heritage.',
        details: {
            highlights: [
                'Mysore Palace',
                'Chamundi Hill & Temple',
                'Brindavan Gardens',
                'Mysore Zoo',
                'St. Philomena\'s Church',
                'Karanji Lake',
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Mysore', 'Visit Mysore Palace', 'Explore Devaraja Market', 'Evening at Brindavan Gardens (musical fountain show)'] },
            { day: 2, activities: ['Morning at Chamundi Hill & Temple', 'St. Philomena\'s Church', 'Relax at Karanji Lake', 'Shopping for silk & sandalwood'] },
            { day: 3, activities: ['Mysore Zoo', 'Rail Museum', 'Local food tour', 'Departure'] },
        ],
        estimated_cost_inr: 14000,
    },
    {
        destination: 'Bangalore',
        summary: 'India\'s Silicon Valley, known for its IT industry, gardens, palaces, and vibrant nightlife.',
        details: {
            highlights: [
                'Lalbagh Botanical Garden',
                'Cubbon Park',
                'Bangalore Palace',
                'ISKCON Temple',
                'UB City Mall',
                'Commercial Street',
                'Vidhana Soudha',
                'Nandi Hills'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Bangalore', 'Visit Lalbagh Botanical Garden', 'Explore Cubbon Park', 'Evening at UB City Mall'] },
            { day: 2, activities: ['Bangalore Palace tour', 'ISKCON Temple', 'Shopping at Commercial Street', 'Brigade Road nightlife'] },
            { day: 3, activities: ['Nandi Hills sunrise trip', 'Vidhana Soudha', 'Local food tour on Church Street', 'Departure'] },
        ],
        estimated_cost_inr: 16000,
    },
    {
        destination: 'Chennai',
        summary: 'The Detroit of India, known for its rich Tamil culture, temples, beaches, and classical music.',
        details: {
            highlights: [
                'Marina Beach',
                'Kapaleeshwarar Temple',
                'Fort St. George',
                'San Thome Cathedral',
                'Mahabalipuram',
                'DakshinaChitra',
                'Express Avenue Mall'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Chennai', 'Marina Beach walk', 'Kapaleeshwarar Temple', 'Evening at Express Avenue'] },
            { day: 2, activities: ['Mahabalipuram day trip', 'Shore Temple', 'Five Rathas', 'Arjuna\'s Penance'] },
            { day: 3, activities: ['Fort St. George', 'San Thome Cathedral', 'DakshinaChitra', 'Local Tamil cuisine tour', 'Departure'] },
        ],
        estimated_cost_inr: 14500,
    },
    {
        destination: 'Hyderabad',
        summary: 'The City of Pearls, known for its rich history, biryani, and modern IT industry.',
        details: {
            highlights: [
                'Charminar',
                'Golconda Fort',
                'Ramoji Film City',
                'Hussain Sagar Lake',
                'Salar Jung Museum',
                'Birla Mandir',
                'Laad Bazaar'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Hyderabad', 'Charminar', 'Laad Bazaar shopping', 'Famous Hyderabadi biryani dinner'] },
            { day: 2, activities: ['Ramoji Film City full day', 'Film sets tour', 'Entertainment shows'] },
            { day: 3, activities: ['Golconda Fort', 'Salar Jung Museum', 'Hussain Sagar Lake', 'Birla Mandir', 'Departure'] },
        ],
        estimated_cost_inr: 15500,
    },
    {
        destination: 'Kolkata',
        summary: 'The City of Joy, known for its rich cultural heritage, literature, art, and delicious sweets.',
        details: {
            highlights: [
                'Victoria Memorial',
                'Howrah Bridge',
                'Dakshineswar Temple',
                'Park Street',
                'Indian Museum',
                'Kalighat Temple',
                'College Street'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Kolkata', 'Victoria Memorial', 'Howrah Bridge', 'Evening at Park Street'] },
            { day: 2, activities: ['Dakshineswar Temple', 'Belur Math', 'Indian Museum', 'College Street book market'] },
            { day: 3, activities: ['Kalighat Temple', 'Mother Teresa House', 'Famous Bengali sweets tour', 'Departure'] },
        ],
        estimated_cost_inr: 13500,
    },
    {
        destination: 'Andaman Islands',
        summary: 'A tropical paradise with pristine beaches, crystal clear waters, and rich marine life.',
        details: {
            highlights: [
                'Radhanagar Beach',
                'Cellular Jail',
                'Scuba Diving at Havelock',
                'Ross Island',
                'Neil Island',
                'Limestone Caves',
                'Mangrove Creeks'
            ],
            days: 5,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Port Blair', 'Cellular Jail visit', 'Light and Sound Show', 'Aberdeen Bazaar'] },
            { day: 2, activities: ['Ferry to Havelock Island', 'Radhanagar Beach', 'Beach relaxation', 'Water sports'] },
            { day: 3, activities: ['Scuba diving at Elephant Beach', 'Snorkeling', 'Beach hopping', 'Sunset viewing'] },
            { day: 4, activities: ['Visit Neil Island', 'Natural Bridge', 'Bharatpur Beach', 'Laxmanpur Beach'] },
            { day: 5, activities: ['Ross Island', 'North Bay Island', 'Coral viewing', 'Departure'] },
        ],
        estimated_cost_inr: 35000,
    },
    {
        destination: 'Ooty',
        summary: 'The Queen of Hill Stations, known for its tea gardens, lakes, and pleasant climate.',
        details: {
            highlights: [
                'Ooty Lake',
                'Botanical Gardens',
                'Nilgiri Mountain Railway',
                'Doddabetta Peak',
                'Rose Garden',
                'Tea Factory',
                'Pykara Falls'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Ooty', 'Ooty Lake boating', 'Botanical Gardens', 'Rose Garden'] },
            { day: 2, activities: ['Nilgiri Mountain Railway', 'Doddabetta Peak', 'Tea Factory visit', 'Tea tasting'] },
            { day: 3, activities: ['Pykara Falls', 'Avalanche Lake', 'Shopping at Charring Cross', 'Departure'] },
        ],
        estimated_cost_inr: 14000,
    },
    {
        destination: 'Pune',
        summary: 'The cultural capital of Maharashtra, known for its educational institutions and pleasant weather.',
        details: {
            highlights: [
                'Shaniwar Wada',
                'Aga Khan Palace',
                'Sinhagad Fort',
                'Osho Ashram',
                'Pune University',
                'Koregaon Park',
                'Parvati Hill'
            ],
            days: 2,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Pune', 'Shaniwar Wada', 'Aga Khan Palace', 'Koregaon Park'] },
            { day: 2, activities: ['Sinhagad Fort trek', 'Osho Ashram', 'Pune University', 'FC Road shopping', 'Departure'] },
        ],
        estimated_cost_inr: 12000,
    },
    {
        destination: 'Amritsar',
        summary: 'The spiritual center of Sikhism, home to the Golden Temple and rich Punjabi culture.',
        details: {
            highlights: [
                'Golden Temple',
                'Jallianwala Bagh',
                'Wagah Border',
                'Durgiana Temple',
                'Partition Museum',
                'Local Punjabi Cuisine',
                'Heritage Walk'
            ],
            days: 2,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Amritsar', 'Golden Temple visit', 'Langar experience', 'Jallianwala Bagh'] },
            { day: 2, activities: ['Wagah Border ceremony', 'Durgiana Temple', 'Partition Museum', 'Local food tour', 'Departure'] },
        ],
        estimated_cost_inr: 11000,
    },
    {
        destination: 'Coorg',
        summary: 'Scotland of India, known for coffee plantations, misty hills, and beautiful landscapes.',
        details: {
            highlights: [
                'Coffee Plantations',
                'Abbey Falls',
                'Raja\'s Seat',
                'Dubare Elephant Camp',
                'Talacauvery',
                'Namdroling Monastery',
                'Madikeri Fort'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Coorg', 'Coffee plantation tour', 'Abbey Falls', 'Raja\'s Seat sunset'] },
            { day: 2, activities: ['Dubare Elephant Camp', 'River rafting', 'Namdroling Monastery', 'Local cuisine'] },
            { day: 3, activities: ['Talacauvery visit', 'Madikeri Fort', 'Omkareshwara Temple', 'Shopping', 'Departure'] },
        ],
        estimated_cost_inr: 16000,
    },
    {
        destination: 'Udaipur',
        summary: 'The City of Lakes, known for its romantic palaces and beautiful lakeside setting.',
        details: {
            highlights: [
                'City Palace',
                'Lake Pichola',
                'Jag Mandir',
                'Saheliyon Ki Bari',
                'Fateh Sagar Lake',
                'Jagdish Temple'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Udaipur', 'City Palace', 'Lake Pichola boat ride', 'Jag Mandir'] },
            { day: 2, activities: ['Saheliyon Ki Bari', 'Fateh Sagar Lake', 'Jagdish Temple', 'Evening at Ambrai Ghat'] },
            { day: 3, activities: ['Eklingji Temple', 'Shilpgram craft village', 'Local shopping', 'Departure'] },
        ],
        estimated_cost_inr: 17000,
    },
    {
        destination: 'Rishikesh',
        summary: 'The Yoga Capital of the World, situated on the banks of the holy Ganges.',
        details: {
            highlights: [
                'Laxman Jhula',
                'Ram Jhula',
                'Parmarth Niketan',
                'Beatles Ashram',
                'River Rafting',
                'Triveni Ghat'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Rishikesh', 'Laxman Jhula', 'Ram Jhula', 'Evening Ganga Aarti'] },
            { day: 2, activities: ['River rafting', 'Beatles Ashram', 'Parmarth Niketan', 'Yoga session'] },
            { day: 3, activities: ['Neelkanth Mahadev Temple', 'Triveni Ghat', 'Adventure sports', 'Departure'] },
        ],
        estimated_cost_inr: 11000,
    },
    {
        destination: 'Manali',
        summary: 'A popular hill station in Himachal Pradesh, known for adventure sports and scenic beauty.',
        details: {
            highlights: [
                'Solang Valley',
                'Rohtang Pass',
                'Hadimba Temple',
                'Old Manali',
                'Vashisht Hot Springs',
                'Mall Road'
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Manali', 'Hadimba Temple', 'Manu Temple', 'Mall Road shopping'] },
            { day: 2, activities: ['Solang Valley', 'Paragliding', 'Zorbing', 'Cable car ride'] },
            { day: 3, activities: ['Rohtang Pass (if open)', 'Snow activities', 'Vashisht Hot Springs'] },
            { day: 4, activities: ['Old Manali', 'Tibetan Monastery', 'Local cafe hopping', 'Departure'] },
        ],
        estimated_cost_inr: 19000,
    },
    {
        destination: 'Leh',
        summary: 'The land of high passes, known for its Buddhist monasteries and stunning landscapes.',
        details: {
            highlights: [
                'Pangong Tso Lake',
                'Nubra Valley',
                'Magnetic Hill',
                'Shanti Stupa',
                'Hemis Monastery',
                'Khardung La Pass'
            ],
            days: 6,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Leh', 'Acclimatization', 'Shanti Stupa', 'Leh Market'] },
            { day: 2, activities: ['Magnetic Hill', 'Gurudwara Pathar Sahib', 'Sangam Point', 'Hall of Fame'] },
            { day: 3, activities: ['Pangong Tso Lake day trip', 'Overnight at Pangong'] },
            { day: 4, activities: ['Return from Pangong', 'Hemis Monastery', 'Thiksey Monastery'] },
            { day: 5, activities: ['Nubra Valley', 'Khardung La Pass', 'Camel safari at Hunder'] },
            { day: 6, activities: ['Return to Leh', 'Shopping', 'Departure'] },
        ],
        estimated_cost_inr: 32000,
    },
    {
        destination: 'Darjeeling',
        summary: 'The Queen of Hills, famous for its tea gardens and stunning views of Kanchenjunga.',
        details: {
            highlights: [
                'Tiger Hill Sunrise',
                'Darjeeling Himalayan Railway',
                'Tea Gardens',
                'Batasia Loop',
                'Peace Pagoda',
                'Himalayan Mountaineering Institute'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Darjeeling', 'Mall Road', 'Chowrasta', 'Observatory Hill'] },
            { day: 2, activities: ['Tiger Hill sunrise', 'Batasia Loop', 'Darjeeling Himalayan Railway', 'Tea garden visit'] },
            { day: 3, activities: ['Peace Pagoda', 'Himalayan Mountaineering Institute', 'Zoo', 'Departure'] },
        ],
        estimated_cost_inr: 13000,
    },
    {
        destination: 'Shimla',
        summary: 'The summer capital of British India, known for its colonial architecture and pleasant climate.',
        details: {
            highlights: [
                'Mall Road',
                'Ridge',
                'Christ Church',
                'Jakhu Temple',
                'Kufri',
                'Shimla-Kalka Toy Train'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Shimla', 'Mall Road', 'Ridge', 'Christ Church'] },
            { day: 2, activities: ['Jakhu Temple', 'Kufri excursion', 'Green Valley', 'Indira Tourist Park'] },
            { day: 3, activities: ['Viceregal Lodge', 'Summer Hill', 'Shopping', 'Departure'] },
        ],
        estimated_cost_inr: 15000,
    },
    {
        destination: 'Jodhpur',
        summary: 'The Blue City, known for its magnificent forts and blue-painted houses.',
        details: {
            highlights: [
                'Mehrangarh Fort',
                'Umaid Bhawan Palace',
                'Jaswant Thada',
                'Clock Tower Market',
                'Mandore Gardens',
                'Blue City Walking Tour'
            ],
            days: 2,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Jodhpur', 'Mehrangarh Fort', 'Jaswant Thada', 'Blue City walk'] },
            { day: 2, activities: ['Umaid Bhawan Palace', 'Mandore Gardens', 'Clock Tower Market', 'Departure'] },
        ],
        estimated_cost_inr: 12000,
    },
    {
        destination: 'Pushkar',
        summary: 'A holy city known for its sacred lake and the only Brahma temple in the world.',
        details: {
            highlights: [
                'Pushkar Lake',
                'Brahma Temple',
                'Savitri Temple',
                'Camel Safari',
                'Pushkar Bazaar',
                'Sunset at Pushkar Lake'
            ],
            days: 2,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Pushkar', 'Pushkar Lake', 'Brahma Temple', 'Local market'] },
            { day: 2, activities: ['Savitri Temple sunrise', 'Camel safari', 'Pushkar Bazaar shopping', 'Departure'] },
        ],
        estimated_cost_inr: 9000,
    },
    {
        destination: 'Hampi',
        summary: 'A UNESCO World Heritage Site, ruins of the ancient Vijayanagara Empire.',
        details: {
            highlights: [
                'Virupaksha Temple',
                'Hampi Bazaar',
                'Lotus Mahal',
                'Elephant Stables',
                'Vittala Temple',
                'Matanga Hill'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Hampi', 'Virupaksha Temple', 'Hampi Bazaar', 'Hemakuta Hill sunset'] },
            { day: 2, activities: ['Vittala Temple', 'Stone Chariot', 'Lotus Mahal', 'Elephant Stables'] },
            { day: 3, activities: ['Matanga Hill sunrise', 'Coracle ride', 'Anjaneya Hill', 'Departure'] },
        ],
        estimated_cost_inr: 11000,
    },
    {
        destination: 'Munnar',
        summary: 'A hill station in Kerala known for its tea plantations and cool climate.',
        details: {
            highlights: [
                'Tea Museum',
                'Eravikulam National Park',
                'Mattupetty Dam',
                'Top Station',
                'Anamudi Peak',
                'Tea Gardens'
            ],
            days: 3,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Munnar', 'Tea Museum', 'Tea plantation walk', 'Local market'] },
            { day: 2, activities: ['Eravikulam National Park', 'Mattupetty Dam', 'Echo Point', 'Kundala Lake'] },
            { day: 3, activities: ['Top Station', 'Anamudi Peak trek', 'Spice shopping', 'Departure'] },
        ],
        estimated_cost_inr: 13000,
    },
    {
        destination: 'Alleppey',
        summary: 'Known as the Venice of the East, famous for its backwaters and houseboats.',
        details: {
            highlights: [
                'Houseboat Stay',
                'Backwater Cruise',
                'Alleppey Beach',
                'Kumarakom Bird Sanctuary',
                'Vembanad Lake',
                'Coir Village'
            ],
            days: 2,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Alleppey', 'Houseboat check-in', 'Backwater cruise', 'Overnight on houseboat'] },
            { day: 2, activities: ['Morning backwater cruise', 'Alleppey Beach', 'Coir village visit', 'Departure'] },
        ],
        estimated_cost_inr: 16000,
    },

    // Foreign Destinations
    {
        destination: 'Paris',
        summary: 'The city of lights, romance, and art. Home to the Eiffel Tower and world-class museums.',
        details: {
            highlights: [
                'Eiffel Tower',
                'Louvre Museum',
                'Notre-Dame Cathedral',
                'Montmartre & Sacré-Cœur',
                'Seine River Cruise',
                'Champs-Élysées',
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Paris', 'Eiffel Tower visit', 'Seine river cruise'] },
            { day: 2, activities: ['Louvre Museum', 'Notre-Dame Cathedral', 'Latin Quarter walk'] },
            { day: 3, activities: ['Montmartre exploration', 'Sacré-Cœur', 'Moulin Rouge show'] },
            { day: 4, activities: ['Shopping at Champs-Élysées', 'Departure'] },
        ],
        estimated_cost_inr: 95000,
    },
    {
        destination: 'London',
        summary: 'The capital of England, rich in history, culture, and royal heritage.',
        details: {
            highlights: [
                'Big Ben & Parliament',
                'Tower of London',
                'British Museum',
                'Buckingham Palace',
                'London Eye',
                'Thames River Cruise'
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in London', 'Big Ben', 'Westminster Abbey', 'Thames cruise'] },
            { day: 2, activities: ['Tower of London', 'Tower Bridge', 'British Museum', 'Covent Garden'] },
            { day: 3, activities: ['Buckingham Palace', 'Hyde Park', 'London Eye', 'West End show'] },
            { day: 4, activities: ['Camden Market', 'Notting Hill', 'Shopping at Oxford Street', 'Departure'] },
        ],
        estimated_cost_inr: 110000,
    },
    {
        destination: 'Dubai',
        summary: 'A modern metropolis known for luxury shopping, ultramodern architecture, and nightlife.',
        details: {
            highlights: [
                'Burj Khalifa',
                'Dubai Mall',
                'Palm Jumeirah',
                'Dubai Marina',
                'Gold Souk',
                'Desert Safari'
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Dubai', 'Burj Khalifa', 'Dubai Mall', 'Dubai Fountain show'] },
            { day: 2, activities: ['Palm Jumeirah', 'Atlantis', 'Dubai Marina', 'Dhow cruise'] },
            { day: 3, activities: ['Desert safari', 'Camel riding', 'Bedouin camp', 'Belly dance show'] },
            { day: 4, activities: ['Gold Souk', 'Spice Souk', 'Dubai Creek', 'Departure'] },
        ],
        estimated_cost_inr: 75000,
    },
    {
        destination: 'Singapore',
        summary: 'A city-state known for its efficient urban planning, diverse culture, and excellent food.',
        details: {
            highlights: [
                'Marina Bay Sands',
                'Gardens by the Bay',
                'Sentosa Island',
                'Universal Studios',
                'Clarke Quay',
                'Chinatown'
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Singapore', 'Marina Bay Sands', 'Gardens by the Bay', 'Light show'] },
            { day: 2, activities: ['Sentosa Island', 'Universal Studios', 'S.E.A. Aquarium', 'Beach time'] },
            { day: 3, activities: ['Singapore Zoo', 'Night Safari', 'Jurong Bird Park'] },
            { day: 4, activities: ['Chinatown', 'Clarke Quay', 'Orchard Road shopping', 'Departure'] },
        ],
        estimated_cost_inr: 85000,
    },
    {
        destination: 'Tokyo',
        summary: 'Japan\'s bustling capital, blending ultra-modern and traditional elements.',
        details: {
            highlights: [
                'Senso-ji Temple',
                'Tokyo Skytree',
                'Shibuya Crossing',
                'Mount Fuji Day Trip',
                'Tsukiji Fish Market',
                'Imperial Palace'
            ],
            days: 5,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Tokyo', 'Senso-ji Temple', 'Asakusa district', 'Tokyo Skytree'] },
            { day: 2, activities: ['Shibuya Crossing', 'Harajuku', 'Meiji Shrine', 'Omotesando shopping'] },
            { day: 3, activities: ['Mount Fuji day trip', 'Hakone', 'Lake Ashi', 'Hot springs'] },
            { day: 4, activities: ['Tsukiji Fish Market', 'Imperial Palace', 'Ginza shopping', 'Robot Restaurant'] },
            { day: 5, activities: ['Ueno Park', 'Tokyo National Museum', 'Last-minute shopping', 'Departure'] },
        ],
        estimated_cost_inr: 120000,
    },
    {
        destination: 'Bangkok',
        summary: 'Thailand\'s vibrant capital known for ornate temples, street food, and bustling markets.',
        details: {
            highlights: [
                'Grand Palace',
                'Wat Pho Temple',
                'Floating Markets',
                'Khao San Road',
                'Chatuchak Market',
                'Chao Phraya River'
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Bangkok', 'Grand Palace', 'Wat Pho Temple', 'Chao Phraya river cruise'] },
            { day: 2, activities: ['Floating markets', 'Wat Arun', 'Jim Thompson House', 'Thai massage'] },
            { day: 3, activities: ['Chatuchak Weekend Market', 'Khao San Road', 'Street food tour', 'Tuk-tuk ride'] },
            { day: 4, activities: ['Shopping at MBK Center', 'Lumpini Park', 'Departure'] },
        ],
        estimated_cost_inr: 45000,
    },
    {
        destination: 'Bali',
        summary: 'Indonesian island paradise known for temples, beaches, and volcanic landscapes.',
        details: {
            highlights: [
                'Uluwatu Temple',
                'Tanah Lot Temple',
                'Ubud Rice Terraces',
                'Mount Batur Sunrise',
                'Seminyak Beach',
                'Monkey Forest Sanctuary'
            ],
            days: 5,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Bali', 'Uluwatu Temple', 'Kecak dance', 'Jimbaran seafood dinner'] },
            { day: 2, activities: ['Ubud', 'Monkey Forest', 'Tegallalang Rice Terraces', 'Art markets'] },
            { day: 3, activities: ['Mount Batur sunrise trek', 'Hot springs', 'Coffee plantation', 'Traditional village'] },
            { day: 4, activities: ['Tanah Lot Temple', 'Seminyak Beach', 'Beach club', 'Sunset dinner'] },
            { day: 5, activities: ['Water sports', 'Spa treatment', 'Last-minute shopping', 'Departure'] },
        ],
        estimated_cost_inr: 55000,
    },
    {
        destination: 'Maldives',
        summary: 'Tropical paradise of coral islands, crystal-clear waters, and luxury resorts.',
        details: {
            highlights: [
                'Overwater Bungalows',
                'Snorkeling & Diving',
                'Dolphin Watching',
                'Sunset Cruise',
                'Spa Treatments',
                'Private Beach Dining'
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Maldives', 'Resort check-in', 'Beach relaxation', 'Sunset viewing'] },
            { day: 2, activities: ['Snorkeling trip', 'Coral reef exploration', 'Water sports', 'Spa treatment'] },
            { day: 3, activities: ['Dolphin watching cruise', 'Island hopping', 'Local island visit', 'Cultural experience'] },
            { day: 4, activities: ['Private beach breakfast', 'Final swim', 'Departure'] },
        ],
        estimated_cost_inr: 150000,
    },
    {
        destination: 'New York',
        summary: 'The Big Apple, known for its skyscrapers, Broadway shows, and cultural diversity.',
        details: {
            highlights: [
                'Statue of Liberty',
                'Times Square',
                'Central Park',
                'Empire State Building',
                'Brooklyn Bridge',
                'Broadway Show'
            ],
            days: 5,
        },
        daywise: [
            { day: 1, activities: ['Arrive in NYC', 'Times Square', 'Empire State Building', 'Broadway show'] },
            { day: 2, activities: ['Statue of Liberty', 'Ellis Island', 'Wall Street', 'Ground Zero Memorial'] },
            { day: 3, activities: ['Central Park', 'Metropolitan Museum', 'Fifth Avenue shopping', 'Top of the Rock'] },
            { day: 4, activities: ['Brooklyn Bridge walk', 'DUMBO', 'High Line', 'Chelsea Market'] },
            { day: 5, activities: ['One World Observatory', 'Chinatown', 'Little Italy', 'Departure'] },
        ],
        estimated_cost_inr: 140000,
    },
    {
        destination: 'Sydney',
        summary: 'Australia\'s harbor city, famous for its Opera House and stunning beaches.',
        details: {
            highlights: [
                'Sydney Opera House',
                'Harbour Bridge',
                'Bondi Beach',
                'Darling Harbour',
                'Blue Mountains',
                'Circular Quay'
            ],
            days: 5,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Sydney', 'Opera House tour', 'Harbour Bridge walk', 'Circular Quay'] },
            { day: 2, activities: ['Bondi Beach', 'Coastal walk', 'Darling Harbour', 'SEA LIFE Aquarium'] },
            { day: 3, activities: ['Blue Mountains day trip', 'Three Sisters', 'Scenic World', 'Leura village'] },
            { day: 4, activities: ['Taronga Zoo', 'Manly Beach', 'Ferry rides', 'The Rocks market'] },
            { day: 5, activities: ['Royal Botanic Gardens', 'Shopping at Queen Victoria Building', 'Departure'] },
        ],
        estimated_cost_inr: 125000,
    },
    {
        destination: 'Rome',
        summary: 'The Eternal City, rich in ancient history, art, and culinary traditions.',
        details: {
            highlights: [
                'Colosseum',
                'Vatican City',
                'Trevi Fountain',
                'Roman Forum',
                'Pantheon',
                'Spanish Steps'
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Rome', 'Colosseum', 'Roman Forum', 'Palatine Hill'] },
            { day: 2, activities: ['Vatican City', 'St. Peter\'s Basilica', 'Sistine Chapel', 'Vatican Museums'] },
            { day: 3, activities: ['Trevi Fountain', 'Pantheon', 'Spanish Steps', 'Piazza Navona'] },
            { day: 4, activities: ['Trastevere district', 'Villa Borghese', 'Shopping', 'Departure'] },
        ],
        estimated_cost_inr: 90000,
    },
    {
        destination: 'Istanbul',
        summary: 'Where Europe meets Asia, known for its rich Byzantine and Ottoman heritage.',
        details: {
            highlights: [
                'Hagia Sophia',
                'Blue Mosque',
                'Grand Bazaar',
                'Bosphorus Cruise',
                'Topkapi Palace',
                'Galata Tower'
            ],
            days: 4,
        },
        daywise: [
            { day: 1, activities: ['Arrive in Istanbul', 'Hagia Sophia', 'Blue Mosque', 'Hippodrome'] },
            { day: 2, activities: ['Topkapi Palace', 'Grand Bazaar', 'Spice Bazaar', 'Turkish bath'] },
            { day: 3, activities: ['Bosphorus cruise', 'Galata Tower', 'Taksim Square', 'Istiklal Street'] },
            { day: 4, activities: ['Basilica Cistern', 'Dolmabahce Palace', 'Final shopping', 'Departure'] },
        ],
        estimated_cost_inr: 65000,
    }
];

// Overwrite generated itineraries for destinations with detailed itineraries
const itineraryMap = Object.fromEntries(itineraries.map(i => [i.destination, i]));
realItineraries.forEach(real => {
    itineraryMap[real.destination] = real;
});
const finalItineraries = Object.values(itineraryMap);

async function seed() {
    console.log(`Starting to seed ${finalItineraries.length} itineraries...`);

    for (const itin of finalItineraries) {
        try {
            await pool.query(
                `INSERT INTO itineraries (destination, summary, details, daywise, estimated_cost_inr)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (destination) DO UPDATE SET 
                 summary = EXCLUDED.summary, 
                 details = EXCLUDED.details, 
                 daywise = EXCLUDED.daywise, 
                 estimated_cost_inr = EXCLUDED.estimated_cost_inr`,
                [
                    itin.destination,
                    itin.summary,
                    JSON.stringify(itin.details),
                    JSON.stringify(itin.daywise),
                    itin.estimated_cost_inr,
                ]
            );
            console.log(`✓ Seeded: ${itin.destination} (${itin.estimated_cost_inr} INR)`);
        } catch (error) {
            console.error(`✗ Failed to seed ${itin.destination}:`, error.message);
        }
    }

    console.log('\n🎉 Itineraries seeding completed!');
    console.log(`📊 Total destinations: ${finalItineraries.length}`);
    console.log(`🇮🇳 Indian destinations: ${finalItineraries.filter(i => i.estimated_cost_inr < 40000).length}`);
    console.log(`🌍 International destinations: ${finalItineraries.filter(i => i.estimated_cost_inr >= 40000).length}`);
    process.exit();
}

seed().catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
