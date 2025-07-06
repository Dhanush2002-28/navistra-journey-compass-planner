import pool from './db.js';

async function testDestinations() {
    try {
        console.log('🔍 Testing database connection and destinations...');

        // Test database connection
        const result = await pool.query('SELECT COUNT(*) as count FROM itineraries');
        console.log('📊 Total itineraries in database:', result.rows[0].count);

        // Get specific destinations we want to test
        const testDestinations = ['Bangalore', 'bangalore', 'BANGALORE', 'Mumbai', 'Delhi'];

        for (const dest of testDestinations) {
            const query = await pool.query('SELECT destination FROM itineraries WHERE LOWER(destination) = LOWER($1)', [dest]);
            console.log(`🎯 Query for "${dest}":`, query.rows.length > 0 ? `Found: ${query.rows[0].destination}` : 'Not found');
        }

        // List first 10 destinations for reference
        const allDests = await pool.query('SELECT destination FROM itineraries ORDER BY destination LIMIT 10');
        console.log('📍 First 10 destinations in database:');
        allDests.rows.forEach(row => console.log(`  - ${row.destination}`));

    } catch (error) {
        console.error('❌ Error testing destinations:', error);
    } finally {
        process.exit();
    }
}

testDestinations();
