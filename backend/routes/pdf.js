import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const PDFDocument = require('pdfkit');
import pool from '../db.js';

const router = express.Router();

// Generate PDF for itinerary
router.get('/generate/:tripId', async (req, res) => {
    try {
        const { tripId } = req.params;
        console.log('PDF generation request for trip:', tripId);

        // Get user from token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.error('No authorization token provided');
            return res.status(401).json({ error: 'Authentication required' });
        }

        console.log('Token received:', token.substring(0, 20) + '...');

        // Decode token to get user ID (simple implementation)
        let userId;
        try {
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            userId = payload.userId || payload.id;

            if (!userId) {
                console.error('No userId found in token payload:', payload);
                return res.status(401).json({ error: 'Invalid token - no user ID' });
            }

            console.log('PDF generation for user:', userId, 'trip:', tripId);
        } catch (error) {
            console.error('Token decode error:', error.message);
            return res.status(401).json({ error: 'Invalid token format' });
        }

        // Get trip details
        const tripResult = await pool.query(
            'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
            [tripId, userId]
        );

        if (tripResult.rows.length === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        const trip = tripResult.rows[0];

        // Calculate days for itinerary lookup
        let days = 3; // default
        if (trip.start_date && trip.end_date) {
            const start = new Date(trip.start_date);
            const end = new Date(trip.end_date);
            const diff = end.getTime() - start.getTime();
            days = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
        }

        // Get itinerary details
        const itineraryResponse = await fetch(
            `http://localhost:5000/api/itineraries/${encodeURIComponent(trip.destination)}?days=${days}&budget=${trip.budget_inr}`
        );

        let itinerary = null;
        if (itineraryResponse.ok) {
            itinerary = await itineraryResponse.json();
        }

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="NAVISTRA_${trip.destination.replace(/\s+/g, '_')}_Itinerary.pdf"`);

        // Pipe PDF to response
        doc.pipe(res);

        // Add NAVISTRA branding header
        addHeaderToPDF(doc, trip, itinerary);

        // Add trip details
        addTripDetailsToPDF(doc, trip);

        // Add itinerary content
        if (itinerary) {
            addItineraryToPDF(doc, itinerary);
        } else {
            doc.moveDown(2);
            doc.fontSize(16).fillColor('#e74c3c').text('Itinerary details could not be retrieved at this time.', 50, doc.y);
        }

        // Add footer
        addFooterToPDF(doc);

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

function addHeaderToPDF(doc, trip, itinerary) {
    // NAVISTRA Header with gradient-like effect
    doc.rect(0, 0, doc.page.width, 120).fill('#1e40af');

    // Logo area (using text for now)
    doc.fontSize(32)
        .fillColor('white')
        .font('Helvetica-Bold')
        .text('NAVISTRA', 50, 30);

    // Tagline
    doc.fontSize(14)
        .fillColor('#93c5fd')
        .font('Helvetica')
        .text('Your Journey, Our Compass', 50, 70);

    // Trip title
    doc.fontSize(18)
        .fillColor('white')
        .font('Helvetica-Bold')
        .text(`${trip.destination} Travel Itinerary`, 300, 45);

    // Date generated
    doc.fontSize(10)
        .fillColor('#93c5fd')
        .font('Helvetica')
        .text(`Generated on: ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`, 300, 80);

    // Reset position after header
    doc.y = 140;
}

function addTripDetailsToPDF(doc, trip) {
    // Trip Details Section
    doc.fontSize(20)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('Trip Details', 50, doc.y);

    doc.moveDown(1);

    // Create a details box
    const startY = doc.y;
    doc.rect(50, startY, doc.page.width - 100, 120).stroke('#e5e7eb');

    doc.fontSize(12)
        .fillColor('#374151')
        .font('Helvetica-Bold');

    // Left column
    let detailY = startY + 15;
    doc.text('Destination:', 70, detailY);
    doc.font('Helvetica').text(trip.destination, 170, detailY);

    detailY += 20;
    doc.font('Helvetica-Bold').text('Travel Dates:', 70, detailY);
    const startDate = trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'Not specified';
    const endDate = trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'Not specified';
    doc.font('Helvetica').text(`${startDate} to ${endDate}`, 170, detailY);

    detailY += 20;
    doc.font('Helvetica-Bold').text('Budget:', 70, detailY);
    doc.font('Helvetica').text(`₹${Number(trip.budget_inr).toLocaleString()} INR`, 170, detailY);

    detailY += 20;
    doc.font('Helvetica-Bold').text('Travel Style:', 70, detailY);
    doc.font('Helvetica').text(trip.travel_style || 'Not specified', 170, detailY);

    detailY += 20;
    doc.font('Helvetica-Bold').text('Travelers:', 70, detailY);
    doc.font('Helvetica').text(trip.travelers || 'Not specified', 170, detailY);

    doc.y = startY + 130;
}

function addItineraryToPDF(doc, itinerary) {
    doc.moveDown(1);

    // Itinerary Section
    doc.fontSize(20)
        .fillColor('#1e40af')
        .font('Helvetica-Bold')
        .text('Your Personalized Itinerary', 50, doc.y);

    doc.moveDown(1);

    // Summary
    if (itinerary.summary) {
        doc.fontSize(14)
            .fillColor('#374151')
            .font('Helvetica-Bold')
            .text('Overview:', 50, doc.y);

        doc.fontSize(12)
            .font('Helvetica')
            .fillColor('#6b7280')
            .text(itinerary.summary, 50, doc.y + 5, {
                width: doc.page.width - 100,
                align: 'justify'
            });

        doc.moveDown(1.5);
    }

    // Highlights
    if (itinerary.details?.highlights && itinerary.details.highlights.length > 0) {
        doc.fontSize(16)
            .fillColor('#1e40af')
            .font('Helvetica-Bold')
            .text('Trip Highlights', 50, doc.y);

        doc.moveDown(0.5);

        itinerary.details.highlights.forEach((highlight, index) => {
            doc.fontSize(12)
                .fillColor('#374151')
                .font('Helvetica')
                .text(`• ${highlight}`, 70, doc.y, {
                    width: doc.page.width - 120,
                    indent: 10
                });
            doc.moveDown(0.3);
        });

        doc.moveDown(1);
    }

    // Day-wise activities
    if (itinerary.daywise && itinerary.daywise.length > 0) {
        doc.fontSize(16)
            .fillColor('#1e40af')
            .font('Helvetica-Bold')
            .text('Day-wise Itinerary', 50, doc.y);

        doc.moveDown(1);

        itinerary.daywise.forEach((day, dayIndex) => {
            // Check if we need a new page
            if (doc.y > doc.page.height - 150) {
                doc.addPage();
                doc.y = 50;
            }

            // Day header
            doc.fontSize(14)
                .fillColor('#1e40af')
                .font('Helvetica-Bold')
                .text(`Day ${day.day}`, 50, doc.y);

            doc.moveDown(0.5);

            // Activities
            if (day.activities && day.activities.length > 0) {
                day.activities.forEach((activity, actIndex) => {
                    doc.fontSize(11)
                        .fillColor('#374151')
                        .font('Helvetica')
                        .text(`${actIndex + 1}. ${activity}`, 70, doc.y, {
                            width: doc.page.width - 120
                        });
                    doc.moveDown(0.4);
                });
            }

            doc.moveDown(0.8);
        });
    }

    // Cost information
    if (itinerary.estimated_cost_inr) {
        doc.moveDown(1);

        const costBoxY = doc.y;
        doc.rect(50, costBoxY, doc.page.width - 100, 60)
            .fill('#f0f9ff')
            .stroke('#0ea5e9');

        doc.fontSize(14)
            .fillColor('#0c4a6e')
            .font('Helvetica-Bold')
            .text('Estimated Cost', 70, costBoxY + 15);

        doc.fontSize(18)
            .fillColor('#0ea5e9')
            .font('Helvetica-Bold')
            .text(`₹${itinerary.estimated_cost_inr.toLocaleString()} INR`, 70, costBoxY + 35);

        if (itinerary.over_budget) {
            doc.fontSize(12)
                .fillColor('#dc2626')
                .font('Helvetica')
                .text('Note: This exceeds your specified budget', 250, costBoxY + 25);
        }

        doc.y = costBoxY + 70;
    }
}

function addFooterToPDF(doc) {
    // Add footer on last page
    const footerY = doc.page.height - 80;

    doc.rect(0, footerY - 10, doc.page.width, 90).fill('#1e40af');

    doc.fontSize(12)
        .fillColor('white')
        .font('Helvetica-Bold')
        .text('NAVISTRA - Your Journey, Our Compass', 50, footerY + 10);

    doc.fontSize(10)
        .fillColor('#93c5fd')
        .font('Helvetica')
        .text('Thank you for choosing NAVISTRA for your travel planning needs.', 50, footerY + 30);

    doc.text('Have a safe and wonderful journey!', 50, footerY + 45);

    // Add website/contact info
    doc.text('Visit us at: www.navistra.com | Email: support@navistra.com', 50, footerY + 60);
}

export default router;
