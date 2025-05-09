const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB URI and Client
const mongoURI = process.env.MONGO_URI
let db;

// Connect to MongoDB without deprecated options
MongoClient.connect(mongoURI)
  .then(client => {
    console.log('MongoDB connected');

    // Use the 'eventhub' database
    // const db = client.db('eventhub');
    db = client.db('eventhub');
    app.locals.db = db;
    // Import route with db passed
    // const eventRoutes = require('./routes/eventRoutes')(db);
    const userRoutes = require('./routes/userRoutes');
    const eventRoutes = require('./routes/eventRoutes');
    const fundraiserRoutes = require('./routes/fundraiserRoutes');
    const chatRoutes = require('./routes/chatRoutes');
    const liveStreamRoutes = require('./routes/liveStreamRoutes');
    const analyticsRoutes = require('./routes/analyticsRoutes');
    const ticketRoutes = require('./routes/ticketRoutes');
    const checkInRoutes = require('./routes/checkInRoutes');
    const registrationRoutes = require('./routes/registrationRoutes');

    
    // Use routes
    app.use('/api/users',userRoutes)
    app.use('/api/events', eventRoutes); 
    app.use('/api/fundraisers', fundraiserRoutes);
    app.use('/api/chats', chatRoutes);
    app.use('/api/live-streams', liveStreamRoutes); 
    app.use('/api/analytics', analyticsRoutes);
    app.use('/api/tickets', ticketRoutes);
    app.use('/api/check-ins', checkInRoutes); 
    app.use('/api/registrations', registrationRoutes);


    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
  });