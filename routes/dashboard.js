/* Import Required Modules */
const express = require("express");
const router = express.Router();
const passport = require("passport");
const fs = require("fs");
const path = require("path");

/* Import Models */
const Content = require("../models/Content");
const Event = require("../models/Event");
const Work = require("../models/Work");
const Arrangement = require("../models/Arrangement");
const Media = require("../models/Media");
const Image = require("../models/Image");
const Link = require("../models/Link");
const FeaturedWork = require("../models/FeaturedWork");
const FeaturedRecording = require("../models/FeaturedRecording");
const Post = require("../models/Post");

const map = {
  Content,
  Event,
  Arrangement,
  Work,
  Media,
  Image,
  Link,
  FeaturedWork,
  FeaturedRecording,
  Post,
};

/* Fetch and Prepare Form Data */
const fetchFormData = (key, method = "", doc) => {
  /* Parse specfic key json */
  const formData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/formData.json"), "utf8")
  )[key];

  /* Prepare formData based on method */
  switch (method.toLowerCase()) {
    case "post":
      formData.metadata.method = "POST";
      break;
    case "put":
      if (!doc) {
        console.error("error: doc is not defined");
        break;
      }
      formData.metadata.method = "PUT";
      formData.metadata.action += "/" + doc._id;
      /* Prepare formData based on model constructor */
      formData.metadata.saveAndAddNew = ["Content"].includes(
        doc.constructor.modelName
      )
        ? false
        : true;

      const body = JSON.parse(doc.body);

      formData.fields.forEach((field) => {
        switch (field.type) {
          case "hidden":
            // Do nothing
            break;
          case "file":
            field.file = body.file;
            break;
          default:
            field.value = body[field.name];
        }
      });
      break;
    default:
      break;
  }

  // Check on display name
  formData.metadata.display =
    formData.metadata.display ?? formData.metadata.name;

  return formData;
};

/* Import Auth Configs */
const { forwardAuthenticated } = require("../config/auth");
const { ensureAuthenticated } = require("../config/auth");

/* Simple Get Routes */
router.get("/", ensureAuthenticated, async (req, res) => {
  let options = {};
  const doc = await Content.findOne({ name: "intro" });
  const formData = fetchFormData("intro", "put", doc);
  options.formData = formData;
  options.doc = doc;
  res.render("admin/dashboard", options);
});

router.get("/bio", ensureAuthenticated, async (req, res) => {
  let options = {};
  const doc = await Content.findOne({ name: "bio" });
  const formData = fetchFormData("bio", "put", doc);
  options.formData = formData;
  options.doc = doc;
  res.render("admin/bio", options);
});

/* Content Model Put Routes */
const docs = [{ name: "bio" }, { name: "arranger" }, { name: "intro" }];

docs.forEach((doc) => {
  router.put("/" + doc.name + "/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updatedDoc = await Content.findByIdAndUpdate(
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
        updatedDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });

  router.get("/" + doc.name + "/:id", ensureAuthenticated, async (req, res) => {
    const doc = await Content.findById(req.params.id);
    res.json({
      success: true,
      doc,
    });
  });
});

/* List Model Routes */
// Options:
// name: String (required) -- name of the route
// model: String (optional) -- name of the model
// content: Array (optional) -- additional content to be displayed on the page
const lists = [
  { name: "events" },
  { name: "works", select: "FeaturedWork" },
  {
    name: "arrangements",
    content: ["arranger"],
  },
  { name: "media", model: "Media" },
  { name: "images" },
  { name: "links" },
  { name: "posts" },
];

const Model_Nomenclature = (string) => {
  return (
    string.slice(0, -1).charAt(0).toUpperCase() + string.slice(0, -1).slice(1)
  );
};

lists.forEach((list) => {
  /* Define Variables */
  const { name, model, content, select } = list;
  const Model = map[model || Model_Nomenclature(name)];

  /* Get Table of Complete Data Page*/
  router.get("/" + name, ensureAuthenticated, async (req, res) => {
    // Initialize variables
    let docs = [],
      options = {},
      formData = [];

    if (content) {
      for (let i = 0; i < content.length; i++) {
        const doc = await Content.findOne({ name: content[i] });
        const formDataItem = fetchFormData(content[i], "put", doc);
        formData.push(formDataItem);
        docs.push(doc);
      }
      options.docs = docs;
      options.formData = formData;
    }

    if (select) {
      const Model = map[select];
      const Model2 = map["FeaturedRecording"];
      const data = await Model.findOne();
      const data2 = await Model2.findOne();
      options.select = data.work;
      options.select2 = data2.work;
    }

    const data = await Model.find({});
    options.data = data;

    res.render("admin/" + name, options);
  });

  /* Get Add New Document Page */
  router.get("/" + name + "/new", ensureAuthenticated, (req, res) => {
    // Initialize variables
    let options = {};
    const formData = fetchFormData(name, "post");
    options.formData = formData;

    res.render("admin/operations/new", options);
  });

  /* Post New Document */
  router.post("/" + name, ensureAuthenticated, async (req, res) => {
    try {
      const newDoc = await Model.create({
        body: JSON.stringify(req.body),
      });
      res.json({
        success: true,
        newDoc,
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
      // Initialize variables
      let options = {};

      const doc = await Model.findById(req.params.id);
      // console.log(doc);
      const formData = fetchFormData(name, "put", doc);
      options.doc = doc;
      options.formData = formData;
      console.log(
        "------------------------",
        options.formData,
        options.formData.fields
      );
      res.render("admin/operations/edit", options);
    }
  );

  /* Get Document */
  router.get("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    const doc = await Model.findById(req.params.id);
    res.json({
      success: true,
      doc,
    });
  });

  /* Put Document */
  router.put("/" + name + "/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updatedDoc = await Model.findByIdAndUpdate(
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
        updatedDoc,
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
      const deletedDoc = await Model.findByIdAndDelete(req.params.id);
      res.json({
        success: true,
        deletedDoc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Something went wrong",
      });
    }
  });
});

// Featured Work
router.put("/featuredwork", ensureAuthenticated, async (req, res) => {
  try {
    const { featuredWork } = req.body;

    // Check if a featured work already exists
    const existingFeaturedWork = await FeaturedWork.findOne();

    if (existingFeaturedWork) {
      // Update the existing featured work
      existingFeaturedWork.work = featuredWork;
      await existingFeaturedWork.save();
    } else {
      // Create a new featured work if it doesn't exist
      const newFeaturedWork = new FeaturedWork({ work: featuredWork });
      await newFeaturedWork.save();
    }

    // Respond with a success message
    res.json({ message: "Featured work updated successfully" });
  } catch (error) {
    console.error("Error updating featured work:", error);
    res.status(500).json({ message: "Error updating featured work" });
  }
});

// Featured Recording
router.put("/featuredrecording", ensureAuthenticated, async (req, res) => {
  try {
    const { featuredRecording } = req.body;

    // Check if a featured recording already exists
    const existingFeaturedRecording = await FeaturedRecording.findOne();

    if (existingFeaturedRecording) {
      // Update the existing featured recording
      existingFeaturedRecording.work = featuredRecording;
      await existingFeaturedRecording.save();
    } else {
      // Create a new featured recording if it doesn't exist
      const newFeaturedRecording = new FeaturedRecording({
        work: featuredRecording,
      });
      await newFeaturedRecording.save();
    }

    // Respond with a success message
    res.json({ message: "Featured recording updated successfully" });
  } catch (error) {
    console.error("Error updating featured recording:", error);
    res.status(500).json({ message: "Error updating featured recording" });
  }
});

module.exports = router;
