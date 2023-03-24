const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
  artist: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  streams: {
    type: Number,
    required: true,
  },
  payoutComplete: {
    type: Boolean,
    default: false,
  },
});

const Artist = mongoose.model("Artist", artistSchema);

module.exports = Artist;
