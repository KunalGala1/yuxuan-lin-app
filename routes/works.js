/* Import Required Modules */
const express = require('express');
const router = express.Router();
const passport = require('passport');

/* Import Models */
const Work = require('../models/Work');

/* Import Auth Configs */
const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');

/* Works */
router.get('/', ensureAuthenticated, async (req, res) => {
  const works = await Work.find();
  res.render('admin/works', {
    works,
  });
});

/* New Work Page */
router.get('/new', ensureAuthenticated, async (req, res) => {
  res.render('admin/works/new_work');
});

/* New work */
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const newWork = await Work.create({
      body: JSON.stringify(req.body),
    });
    res.json({
      success: true,
      newWork,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

/* Edit Work Page */
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  const work = await Work.findById(req.params.id);
  res.render('admin/works/edit_work', {
    work,
  });
});

/* Get One work */
router.get('/:id', ensureAuthenticated, async (req, res) => {
  const work = await Work.findById(req.params.id);
  res.json({ success: true, work });
});

/* Edit work */
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const updatedWork = await Work.findByIdAndUpdate(req.params.id, { body: JSON.stringify(req.body) }, { new: true });
    res.json({ success: true, updatedWork });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

/* Delete Work */
router.delete('/:id/delete', ensureAuthenticated, async (req, res) => {
  try {
    const deletedWork = await Work.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      deletedWork,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

module.exports = router;
