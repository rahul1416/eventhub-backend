const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const getLiveStreamsCollection = (db) => db.collection('livestreams');

router.post('/', async (req, res) => {
  try {
    const newStream = req.body;
    const db = req.app.locals.db;
    const result = await getLiveStreamsCollection(db).insertOne(newStream);
    res.status(201).json(result.ops[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const streams = await getLiveStreamsCollection(db).find().toArray();
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;