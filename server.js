require("dotenv").config();
const PORT = process.env.PORT || 5000;

const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

// db
const connectDB = require("./config/db");
connectDB();

const app = express();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: "us-east-2",
});

// Multer

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "yuxuan-lin", // Replace with your S3 bucket name
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, "uploads/" + Date.now().toString() + "-" + file.originalname);
    },
  }),
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.json({ success: true, file: req.file });
});

// Passport config
require("./config/passport")(passport);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: ["http://localhost:5000"],
    credentials: true,
  })
);

// express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));
app.use("/", require("./routes/mail"));
app.use("/dashboard", require("./routes/dashboard"));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
