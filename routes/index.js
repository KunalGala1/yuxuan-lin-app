const app = require('express');
const router = app.Router();

/* Import Models */
const Content = require('../models/Content');
const Event = require('../models/Event');
const Work = require('../models/Work');

router.get('/', async (req, res) => {
  res.render('client/index');
});

router.get('/bio', async (req, res) => {
  const data = await Content.findOne({ name: 'bio' });
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  res.render('client/bio', { data, lang });
});

router.get('/works', async (req, res) => {
  const works = await Work.find();
  res.render('client/works', { works });
});

router.get('/work/:slug', async (req, res) => {
  const works = await Work.find();
  const work = works.find(work => JSON.parse(work.body).slug === req.params.slug);
  if (work == undefined) res.redirect('/works');
  else {
    res.render('client/work', { work });
  }
});

router.get('/contact', async (req, res) => {
  res.render('client/contact');
});

router.get('/events', async (req, res) => {
  const events = await Event.find();
  res.render('client/events', { events });
});

router.get('/event/:slug', async (req, res) => {
  const events = await Event.find();
  const event = events.find(event => JSON.parse(event.body).slug === req.params.slug);
  if (event == undefined) res.redirect('/events');
  else {
    res.render('client/event', { event });
  }
});

router.get('/arranger', async (req, res) => {
  res.render('client/arranger');
});

module.exports = router;
