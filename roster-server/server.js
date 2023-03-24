const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Artist = require("./models/Artist");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/artists", async (req, res) => {
  const artists = await Artist.find();
  res.json(artists);
});

app.post("/artists", async (req, res) => {
  const artist = new Artist({
    artist: req.body.artist,
    rate: req.body.rate,
    streams: req.body.streams,
  });
  await artist.save();
  res.json(artist);
});

app.put("/artists/:id", async (req, res) => {
  const { id } = req.params;
  const artist = await Artist.findByIdAndUpdate(id, req.body, { new: true });
  res.json(artist);
});

app.delete("/artists/:id", async (req, res) => {
  const { id } = req.params;
  await Artist.findByIdAndDelete(id);
  res.json({ message: "Artist deleted successfully" });
});

// start the server
app.listen(8080, () => {
  console.log(`Server started on port 8080`);
});

module.exports = app;
