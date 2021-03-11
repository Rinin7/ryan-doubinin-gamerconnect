const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(cors());
app.use(express.json());

app.get("/api/players/:steamId", (req, res) => {
  axios
    .get(`https://api.opendota.com/api/players/${req.params.steamId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((profile) => {
      const profileData = profile.data;

      if (profileData.solo_competitive_rank === null) {
        res.status(404).send("Unable to find Steam profile. Invalid Steam ID.");
      }

      res.status(200).send({
        mmr: profileData.solo_competitive_rank,
        username: profileData.profile.personaname,
        avatar: profileData.profile.avatarmedium,
      });
    })
    .catch((err) => console.log(err));
});

app.listen(8084, () => {
  console.log("The server is running on port 8084");
});
