/* Import Required Modules */
const express = require("express");
const router = express.Router();
const passport = require("passport");

/* Import Models */
const Content = require("../models/Content");
const Event = require("../models/Event");
const Work = require("../models/Work");
const Arrangement = require("../models/Arrangement");
const Media = require("../models/Media");

const map = {
  Content,
  Event,
  Arrangement,
  Work,
  Media,
};

/* Import Auth Configs */
const { forwardAuthenticated } = require("../config/auth");
const { ensureAuthenticated } = require("../config/auth");

/* Simple Get Routes */
router.get("/", ensureAuthenticated, async (req, res) => {
  const intro = await Content.findOne({ name: "intro" });
  res.render("admin/dashboard", {
    intro,
  });
});

router.get("/bio", ensureAuthenticated, async (req, res) => {
  const data = await Content.findOne({ name: "bio" });
  const body = JSON.parse(data.body);
  res.render("admin/bio", {
    id: data._id,
    body,
  });
});

/* Content Model Put Routes */
const documents = [{ name: "bio" }, { name: "arranger" }, { name: "intro" }];

documents.forEach((document) => {
  router.put(
    "/" + document.name + "/:id",
    ensureAuthenticated,
    async (req, res) => {
      try {
        const updatedDocument = await Content.findByIdAndUpdate(
          req.params.id,
          {
            body: JSON.stringify(req.body),
          },
          {
            new: true,
          }
        );
        res.json({
          success: true,
          updatedDocument,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: "Something went wrong",
        });
      }
    }
  );
});

// ====================================================================================================

const lists = [
  { name: "events" },
  { name: "works" },
  {
    name: "arrangements",
    content: ["arranger"],
  },
  { name: "media", model: "Media" },
];

const Model_Nomenclature = (string) => {
  return (
    string.slice(0, -1).charAt(0).toUpperCase() + string.slice(0, -1).slice(1)
  );
};

lists.forEach((list) => {
  /* Define Variables */
  const { name, model, content } = list;
  const Model = map[model || Model_Nomenclature(name)];

  /* Get Table of Complete Data Page*/
  router.get("/" + name, ensureAuthenticated, async (req, res) => {
    // Initialize variables
    let documents = [],
      options = {};

    if (content) {
      for (let i = 0; i < content.length; i++) {
        const data = await Content.findOne({ name: content[i] });
        documents.push(data);
      }
      options.content = documents;
    }

    const data = await Model.find({});
    options.data = data;

    res.render("admin/" + name, options);
  });

  /* Get Add New Document Page */
  router.get("/" + name + "/new", ensureAuthenticated, (req, res) => {
    res.render("admin/" + name + "/new");
  });

  /* Post New Document */
  router.post("/" + name, ensureAuthenticated, async (req, res) => {
    try {
      const newDocument = await Model.create({
        body: JSON.stringify(req.body),
      });
      res.json({
        success: true,
        newDocument,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });

  /* Get Edit Document Page */
  router.get(
    "/" + name + "/:id/edit",
    ensureAuthenticated,
    async (req, res) => {
      const document = await Model.findById(req.params.id);
      res.render("admin/" + name + "/edit", { document });
    }
  );

  /* Get Document */
  router.get("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    const document = await Model.findById(req.params.id);
    res.json({
      success: true,
      document,
    });
  });

  /* Put Document */
  router.put("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updatedDocument = await Model.findByIdAndUpdate(
        req.params.id,
        {
          body: JSON.stringify(req.body),
        },
        {
          new: true,
        }
      );
      res.json({
        success: true,
        updatedDocument,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });

  /* Delete Document */
  router.delete("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deletedDocument = await Model.findByIdAndDelete(req.params.id);
      res.json({
        success: true,
        deletedDocument,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });
});

module.exports = router;
