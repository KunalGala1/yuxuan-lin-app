/* Import Required Modules */
const express = require('express');
const router = express.Router();
const passport = require('passport');

/* Import Models */
const Event = require('../models/Event');

/* Import Auth Configs */
const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

/* Events */
router.get('/', ensureAuthenticated, async (req, res) => {
  const events = await Event.find();
  res.render('admin/events', {
    events,
  });
});

/* New Event Page */
router.get('/new', ensureAuthenticated, async (req, res) => {
  res.render('admin/events/new_event');
});

/* New Event */
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const newEvent = await Event.create({
      body: JSON.stringify(req.body),
    });
    res.json({
      success: true,
      newEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

/* Edit Event Page */
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render('admin/events/edit_event', {
    event,
  });
});

/* Get One Event */
router.get('/:id', ensureAuthenticated, async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.json({ success: true, event });
});

/* Edit Event */
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { body: JSON.stringify(req.body) }, { new: true });
    res.json({ success: true, updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

/* Delete Event */
router.delete('/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      deletedEvent,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

module.exports = router;
