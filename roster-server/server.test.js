const request = require("supertest");
const app = require("./server");
const mongoose = require("mongoose");
const Artist = require("./models/Artist");
require("dotenv").config();

const MONGODB_CONNECTION_TEST = process.env.MONGODB_CONNECTION_TEST;

describe("GET /artists", () => {
  beforeAll(async () => {
    await mongoose.connection.close();
    await mongoose.connect(MONGODB_CONNECTION_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await Artist.deleteMany();
    await mongoose.connection.close();
  });

  it("should return an empty array if there are no artists", async () => {
    const response = await request(app).get("/artists");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return an array of artists if there are any", async () => {
    const artist = new Artist({
      artist: "Pearl Jam",
      rate: 0.004,
      streams: 10284436,
    });
    await artist.save();
    const response = await request(app).get("/artists");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].artist).toBe("Pearl Jam");
  });
});

describe("POST /artists", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGODB_CONNECTION_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await Artist.deleteMany();
    await mongoose.connection.close();
  });

  it("should create a new artist", async () => {
    const response = await request(app)
      .post("/artists")
      .send({ artist: "Pearl Jam", rate: 0.004, streams: 10284436 });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      artist: "Pearl Jam",
      rate: 0.004,
      streams: 10284436,
    });
    const artists = await Artist.find();
    expect(artists.length).toBe(1);
    expect(artists[0]).toMatchObject({
      artist: "Pearl Jam",
      rate: 0.004,
      streams: 10284436,
    });
  });
});

describe("PUT /artists/:id", () => {
  let artist;

  beforeAll(async () => {
    await mongoose.connect(MONGODB_CONNECTION_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    artist = new Artist({
      artist: "Pearl Jam",
      rate: 0.004,
      streams: 10284436,
    });
    await artist.save();
  });

  afterAll(async () => {
    await Artist.deleteMany();
    await mongoose.connection.close();
  });

  it("should update an existing artist", async () => {
    const response = await request(app)
      .put(`/artists/${artist._id}`)
      .send({ rate: 0.4, streams: 20000 });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      artist: "Pearl Jam",
      rate: 0.4,
      streams: 20000,
    });
    const updatedArtist = await Artist.findById(artist._id);
    expect(updatedArtist).toMatchObject({
      artist: "Pearl Jam",
      rate: 0.4,
      streams: 20000,
    });
  });
});
