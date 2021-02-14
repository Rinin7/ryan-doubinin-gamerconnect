import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import fire from "../../config/Fire";
import firebase from "firebase";
import "./CreateActivity.scss";
import axios from "axios";

export default function CreateActivity({ user, username }) {
  const db = fire.firestore();
  const history = useHistory();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [skill, setSkill] = useState("");
  const [description, setDescription] = useState("");
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  const [validationError, setValidationError] = useState("");
  const [mmr, setMmr] = useState("");
  const [avatar, setAvatar] = useState("");
  const [persona, setPersona] = useState("");
  const [steam, setSteam] = useState("");

  // Axios call to OpenDOTA API
  if (steam.length === 8) {
    axios.get(`https://api.opendota.com/api/players/${steam}/`).then((res) => {
      setMmr(res.data.solo_competitive_rank);
      setAvatar(res.data.profile.avatarmedium);
      setPersona(res.data.profile.personaname);
      console.log(res);
    });
  }

  // FUNCTION TO DISPLAY STEAM PROFILE INFO
  function steamProfile() {
    if (mmr) {
      return (
        <div>
          <img src={avatar} />
          <p>Steam Username: {persona}</p>
          <p>Dota MMR: {mmr}</p>
        </div>
      );
    }
  }

  // FUNCTION TO ADD NEW ACTIVITY
  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedGame === "") {
      return setValidationError("Please select a game");
    }

    if (skill === "") {
      return setValidationError("Please choose a skill level");
    }

    if (description === "") {
      return setValidationError("Please provide a brief description");
    }

    db.collection("activities")
      .add({ skill, description, timestamp, selectedGame, host: username, hostId: user.uid })
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // FUNCTION TO GET GAMES COLLECTION DATA
  function getGames() {
    db.collection("games")
      .get()
      .then((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setGames(items);
      });
  }

  // FUNCTION TO RENDER A GAME PICTURE BASED ON GAME SELECTED IN DROP DOWN MENU
  function renderSelectedGame() {
    if (selectedGame !== "") {
      const current = games.find((game) => game.title === selectedGame);
      return <img className="create__form-image" src={current.imageUrl} />;
    }
  }

  useEffect(() => {
    if (games.length === 0) {
      getGames();
    }
  }, []);

  return (
    <>
      <div className="create">
        <div className="create__header-container">
          <h1 className="create__header">Create Activity</h1>
        </div>
        <form className="create__form" onSubmit={handleSubmit}>
          <div className="create__form-container">
            {/* <div className="create__form-game"> */}
            <label className="create__form-label" htmlFor="game">
              Game
            </label>
            <div className="create__form-game-line">
              {renderSelectedGame()}
              <select className="create__form-select" value={selectedGame} onChange={(event) => setSelectedGame(event.target.value)} name="game" id="game">
                <option value="">Please select...</option>
                {games
                  .filter((game) => (game.title.includes("All") ? "" : game.title))
                  .sort(function (a, b) {
                    var titleA = a.title;
                    var titleB = b.title;
                    if (titleA < titleB) {
                      return -1;
                    }
                    if (titleA > titleB) {
                      return 1;
                    }
                    return 0;
                  })
                  .map((game) => (
                    <>
                      <option value={game.title} key={game.id}>
                        {game.title}
                      </option>
                    </>
                  ))}
              </select>
            </div>
            {selectedGame === "Dota 2" ? (
              <div className="create__form-dota">
                <label className="create__form-label" htmlFor="steam">
                  Steam ID
                </label>
                <input className="create__form-dota-input" type="text" id="steam" name="steam" onChange={(event) => setSteam(event.target.value)} />
              </div>
            ) : (
              <div></div>
            )}
            {steamProfile()}
            {/* </div> */}
            {/* <div className="create__form-info"> */}
            <label className="create__form-label" htmlFor="skill">
              Skill
            </label>
            <select className="create__form-select" onChange={(event) => setSkill(event.target.value)} id="skill" name="skill">
              <option value="">Please select...</option>
              <option value="Learning">Learning</option>
              <option value="Advanced">Advanced</option>
              <option value="Pro">Pro</option>
            </select>

            <label className="create__form-label" htmlFor="description">
              Description
            </label>
            <textarea
              className="create__form-input"
              type="text"
              id="description"
              name="description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter a description here..."
            />
          </div>
          {/* </div> */}
          <div className="create__form-error-container">
            <p className="create__form-error">{validationError}</p>
          </div>
          <div className="create__button-container">
            <button className="create__button-submit" type="submit">
              SUBMIT
            </button>
            <a href="/" className="create__button-cancel">
              CANCEL
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
