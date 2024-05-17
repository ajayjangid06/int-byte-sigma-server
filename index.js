const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

const app = express();
const corsOptions = {
  origin: ["http://localhost:3000"], //included origin as true
  // origin: true,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to database
mongoose.connect(
  "mongodb+srv://ajayjangid001:ajayjangid001@test.n0iwgaf.mongodb.net/",
  {
    // depricated
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("connected to mongodb");
});
mongoose.connection.on("error", (err) => {
  console.log("error connecting to mongodb", err);
});

// models
require("./models/images");

//routes
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// image upload and get images route
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Image = mongoose.model("Image");

app.post("/upload", upload.single("file"), async (req, res) => {
  const { originalname, buffer, size, mimetype } = req.file;
  const { filter } = req.body;
  const image = new Image({
    fileName: originalname,
    data: Buffer.from(buffer, "binary"),
    size: size,
    mimetype: mimetype,
    filter: filter,
  });
  await image.save().then(() => res.json({ message: "uploaded" }));
});

app.get("/getImages", async (req, res) => {
  await Image.find()
    .sort({ createdAt: -1 })
    .then((resp) => {
      let dataa = resp.map((ress) => {
        const { data, mimetype } = ress;
        // buffer > base64 string
        const base64 = data.toString("base64");
        const dataUrl = `data:${mimetype};base64,${base64}`;
        return { ...ress, dataUrl };
      });
      res.send(dataa);
    });
});

app.listen(4000, () => {
  console.log("Server Listening on PORT:", 4000);
});
