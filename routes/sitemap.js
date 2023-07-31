/* Import Required Modules */
const express = require("express");
const router = express.Router();
const xml = require("xml");

/* Import Models */
const Event = require("../models/Event");
const Work = require("../models/Work");
const Media = require("../models/Media");
const Arrangement = require("../models/Arrangement");

// Generate sitemap
const getUrls = async () => {
  const staticUrls = [
    {
      loc: "https://yuxuan-lin.com",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.9,
    },
    {
      loc: "https://yuxuan-lin.com/bio",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://yuxuan-lin.com/events",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://yuxuan-lin.com/works",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://yuxuan-lin.com/media",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://yuxuan-lin.com/arranger",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://yuxuan-lin.com/contact",
      lastmod: new Date(),
      changefreq: "monthly",
      priority: 0.7,
    },
    // Add as many URLs as you need
  ];

  const eventDocuments = await Event.find({});
  const eventUrls = eventDocuments.map((doc) => {
    const sitemap = JSON.parse(doc.body).sitemap;
    return {
      ...sitemap,
      lastmod: new Date(sitemap.lastmod),
    };
  });

  const workDocuments = await Work.find({});
  const workUrls = workDocuments.map((doc) => {
    const sitemap = JSON.parse(doc.body).sitemap;
    return {
      ...sitemap,
      lastmod: new Date(sitemap.lastmod),
    };
  });

  const mediaDocuments = await Media.find({});
  const mediaUrls = mediaDocuments.map((doc) => {
    const sitemap = JSON.parse(doc.body).sitemap;
    return {
      ...sitemap,
      lastmod: new Date(sitemap.lastmod),
    };
  });

  const arrangementDocuments = await Arrangement.find({});
  const arrangementUrls = arrangementDocuments.map((doc) => {
    const sitemap = JSON.parse(doc.body).sitemap;
    return {
      ...sitemap,
      lastmod: new Date(sitemap.lastmod),
    };
  });

  return [
    ...staticUrls,
    ...eventUrls,
    ...workUrls,
    ...mediaUrls,
    ...arrangementUrls,
  ];
};

router.get("/sitemap.xml", async (req, res) => {
  const urls = await getUrls();
  const sitemap = [
    { _attr: { xmlns: "https://www.sitemaps.org/schemas/sitemap/0.9" } },
    ...urls.map((url) => ({
      url: [
        { loc: url.loc },
        { lastmod: url.lastmod.toISOString().split("T")[0] },
        { changefreq: url.changefreq },
        { priority: url.priority },
      ],
    })),
  ];

  res.header("Content-Type", "application/xml");
  res.send(xml({ urlset: sitemap }, { declaration: true }));
});

module.exports = router;
