const app = require("express");
const router = app.Router();

/* Import Models */
const Content = require("../models/Content");
const Event = require("../models/Event");
const Work = require("../models/Work");

router.get("/", async (req, res) => {
  const lang = new URLSearchParams(req.query).get("lang") || "en";
  const work = await Work.findOne();
  const intro = await Content.findOne({ name: "intro" });
  res.render("client/index", { lang, work, intro });
});

router.get("/bio", async (req, res) => {
  const data = await Content.findOne({ name: "bio" });
  const lang = new URLSearchParams(req.query).get("lang") || "en";
  res.render("client/bio", { data, lang });
});

router.get("/works", async (req, res) => {
  const works = await Work.find();
  const lang = new URLSearchParams(req.query).get("lang") || "en";
  res.render("client/works", { works, lang });
});

router.get("/work/:slug", async (req, res) => {
  const works = await Work.find();
  const work = works.find(
    (work) => JSON.parse(work.body).slug === req.params.slug
  );
  const lang = new URLSearchParams(req.query).get("lang") || "en";

  if (work == undefined) res.redirect("/works");
  else {
    res.render("client/work", { work, lang });
  }
});

router.get("/contact", async (req, res) => {
  const lang = new URLSearchParams(req.query).get("lang") || "en";

  res.render("client/contact", { lang });
});

router.get("/events", async (req, res) => {
  const events = await Event.find();
  const lang = new URLSearchParams(req.query).get("lang") || "en";

  res.render("client/events", { events, lang });
});

router.get("/event/:slug", async (req, res) => {
  const events = await Event.find();
  const event = events.find(
    (event) => JSON.parse(event.body).slug === req.params.slug
  );
  const lang = new URLSearchParams(req.query).get("lang") || "en";

  if (event == undefined) res.redirect("/events");
  else {
    res.render("client/event", { event, lang });
  }
});

router.get("/arranger", async (req, res) => {
  const data = await Content.findOne({ name: "arranger" });
  const lang = new URLSearchParams(req.query).get("lang") || "en";
  res.render("client/arranger", { data, lang });
});

module.exports = router;
