const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const router = express.Router();

  // Helper function to get the 'events' collection
  const getEventsCollection = () => db.collection('events');

  // Create a new event
  router.post('/', async (req, res) => {
    try {
      const event = req.body;
      const result = await getEventsCollection().insertOne(event); 
      res.status(201).json(result.ops[0]); 
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  
  router.get('/', async (req, res) => {
    try {
      const events = await getEventsCollection().find().toArray(); // Retrieve all events
      res.json(events);
    } catch (err) {
      console.log("Error retrieving events:", err);
      res.status(500).json({ error: err.message });
    }
  });

  
  router.get('/:id', async (req, res) => {
    try {
      const event = await getEventsCollection().findOne({ _id: ObjectId(req.params.id) }); // Find event by ID
      if (!event) return res.status(404).json({ error: 'Event not found' });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  
  router.put('/:id', async (req, res) => {
    try {
      const updated = await getEventsCollection().findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: req.body },
        { returnOriginal: false }
      );
      res.json(updated.value); // Return updated event
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  
  router.delete('/:id', async (req, res) => {
    try {
      const result = await getEventsCollection().deleteOne({ _id: ObjectId(req.params.id) }); // Delete event by ID
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json({ message: 'Event deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};