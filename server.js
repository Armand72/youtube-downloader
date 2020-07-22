const express = require("express");
const cors = require("cors");

const parser = require("body-parser");
const ytdl = require("ytdl-core");
const app = express();
var path = require("path");
const parameterize = require("parameterize");
const router = require("express-promise-router")();

app.use(cors());

app.use(parser.json());
app.use(
  parser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("api/download", async (req, res) => {
  console.log("here");
  try {
    const URL = req.query.URL;

    async function getinfo(URL) {
      try {
        const info = await ytdl.getInfo(URL).catch((err) => {
          throw err;
        });
        const fullLink = info.videoDetails.title
          .replace("|", "")
          .replace(/ /g, "_");
        return parameterize(fullLink);
      } catch (err) {
        throw err;
      }
    }

    const info = await getinfo(URL);
    res.header("Content-Disposition", `attachment; filename=${info}` + ".mp3");
    delete ytdl.headers;
    ytdl(URL, { quality: "highestaudio", filter: "audioonly" }).pipe(res);
  } catch (err) {
    throw err;
  }
});

app.get("api/getInfo", async (req, res) => {
  const URL = req.query.URL;
  console.log(URL);

  async function getData(URL) {
    const info = await ytdl.getInfo(URL).catch((err) => {
      throw err;
    });
    const image = info.player_response.videoDetails.thumbnail.thumbnails.pop()
      .url;
    const author = info.videoDetails.author.name;
    const song = info.videoDetails.media.song;
    const avatar = info.videoDetails.author.avatar;
    const dataURL = { author, song, image, avatar };

    res.json(dataURL);
  }

  getData(URL).catch((err) => {
    throw err;
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 4000;

const server = app.listen(parseInt(port), () => {
  console.log(`server is listening on port ${port}`);
});

module.exports = server;
