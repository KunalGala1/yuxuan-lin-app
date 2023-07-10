/* Import Required Modules */
const express = require('express');
const router = express.Router();
const passport = require('passport');

/* Import Models */
const Content = require('../models/Content');

/* Import Auth Configs */
const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

/* Dashboard */
router.get('/', ensureAuthenticated, async (req, res) => {
  res.render('admin/dashboard', {
    name: req.user.username,
  });
});

/* Bio */
router.get('/bio', ensureAuthenticated, async (req, res) => {
  const data = await Content.findOne({ name: 'bio' });
  const body = JSON.parse(data.body);
  res.render('admin/bio', {
    id: data._id,
    body,
  });
});

/* Edit Bio */
router.put('/bio/:id', ensureAuthenticated, async (req, res) => {
  try {
    const updatedBio = await Content.findByIdAndUpdate(req.params.id, { body: JSON.stringify(req.body) }, { new: true });
    res.json({ success: true, data: updatedBio });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

module.exports = router;
