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

/* GET home page. */
router.get('/', async (req, res) => {
  const lang = new URLSearchParams(req.query).get('lang') || 'en';
  const work = await Work.findOne({ _id: '656960785d8f89ecfc445c7d' });
  const media = await Media.findOne();
  const intro = await Content.findOne({ name: 'intro' });
  res.render('client/index', { lang, media, intro, work });
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
