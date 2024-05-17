// file name, upload date,
// buffer, originalname, mimetype, size

const { model, Schema } = require("mongoose");
const imageSchema = new Schema(
  {
    fileName: String,
    data: Buffer,
    size: Number,
    mimetype: String,
    filter: String
  },
  { timestamps: true },
  { collection: "images" }
);

model("Image", imageSchema);
