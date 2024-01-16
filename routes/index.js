const app = require('express');
const router = app.Router();

/* Import Models */
const Content = require('../models/Content');
const Event = require('../models/Event');
const Work = require('../models/Work');
const Arrangement = require('../models/Arrangement');
const Media = require('../models/Media');
const Image = require('../models/Image');
const Link = require('../models/Link');
const FeaturedWork = require('../models/FeaturedWork');
const FeaturedRecording = require('../models/FeaturedRecording');

/* GET home page. */
router.get('/', async (req, res) => {
  try {
      const lang = new URLSearchParams(req.query).get('lang') || 'en';
      
      // Retrieve the featured work
      const featuredWork = await FeaturedWork.findOne();
      let work = null;

      const featuredRecording = await FeaturedRecording.findOne();
      let recording = null;
      
      // If a featured work exists, find the corresponding work details
      if (featuredWork) {
          work = await Work.findOne({ _id: featuredWork.work });
      }

      // If a featured recording exists, find the corresponding work details
      if (featuredRecording) {
          recording = await Work.findOne({ _id: featuredRecording.work });
      }

      // Fetch other necessary data
      const media = await Media.findOne();
      const intro = await Content.findOne({ name: 'intro' });

      // Render the page with the fetched data
      res.render('client/index', { lang, media, intro, work, recording });
  } catch (error) {
      console.error('Error fetching data for home page:', error);
      res.status(500).send('Error fetching data for home page');
  }
});

/* GET about page. */
router.get('/bio', async (req, res) => {
  const data = await Content.findOne({ name: 'bio' });
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  res.render('client/bio', { data, lang });
});

/* GET contact page. */
router.get('/contact', async (req, res) => {
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  res.render('client/contact', { lang });
});

/* GET events page. */
router.get('/events', async (req, res) => {
  const events = await Event.find();
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  res.render('client/events', { events, lang });
});

/* GET event page. */
router.get('/events/:slug', async (req, res) => {
  const events = await Event.find();
  const event = events.find(
    (event) => JSON.parse(event.body).slug === req.params.slug
  );
  const lang = new URLSearchParams(req.query).get('lang') || 'en';

  if (event == undefined) res.redirect('/events');
  else {
    res.render('client/event', { event, lang });
  }
});

/* GET works page. */
router.get('/works', async (req, res) => {
  const data = await Work.find();
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  res.render('client/works', { data, lang });
});

/* GET work page. */
router.get('/works/:slug', async (req, res) => {
  const works = await Work.find();
  const work = works.find(
    (work) => JSON.parse(work.body).slug === req.params.slug
  );
  const lang = new URLSearchParams(req.query).get('lang') || 'en';

  if (work == undefined) res.redirect('/works');
  else {
    res.render('client/work', { work, lang });
  }
});

/* GET arranger page. */
router.get('/arrangements', async (req, res) => {
  const doc = await Content.findOne({ name: 'arranger' });
  const data = await Arrangement.find();
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  res.render('client/arranger', { data, doc, lang });
});

/* GET arrangement page. */
router.get('/arrangements/:slug', async (req, res) => {
  const data = await Arrangement.find();
  const doc = data.find((doc) => JSON.parse(doc.body).slug === req.params.slug);
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  if (doc == undefined) res.redirect('/arranger');
  else {
    res.render('client/arrangement', { doc, lang });
  }
});

/* GET media page. */
router.get('/media', async (req, res) => {
  const data = await Media.find();
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  res.render('client/media', { data, lang });
});

/* GET single media page. */
router.get('/media/:slug', async (req, res) => {
  const data = await Media.find();
  const doc = data.find((doc) => JSON.parse(doc.body).slug === req.params.slug);
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  if (doc == undefined) res.redirect('/media');
  else {
    res.render('client/media_page', { doc, lang });
  }
});

/* GET images page. */
router.get('/gallery', async (req, res) => {
  const images = await Image.find();
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  res.render('client/gallery', { images, lang });
});

/* GET links page. */
router.get('/links', async (req, res) => {
  const links = await Link.find();
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  res.render('client/links', { links, lang });
});

module.exports = router;
