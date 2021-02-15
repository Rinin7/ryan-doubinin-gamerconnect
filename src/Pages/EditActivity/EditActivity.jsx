import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import fire from "../../config/Fire";
import firebase from "firebase";
import "./EditActivity.scss";
import axios from "axios";

export default function EditActivity() {
  const { id } = useParams();
  const db = fire.firestore();
  const [activity, setActivity] = useState(undefined);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [skill, setSkill] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");
  const [mmr, setMmr] = useState("");
  const [avatar, setAvatar] = useState("");
  const [persona, setPersona] = useState("");
  const [steam, setSteam] = useState("");
  const [steamError, setSteamError] = useState("");
  const [apiError, setApiError] = useState(false);
  const ref = firebase.firestore().collection("activities");
  const history = useHistory();

  // FUNCTION TO DISPLAY STEAM PROFILE INFO
  function steamProfile() {
    if (steam && selectedGame === "Dota 2") {
      return (
        <div className="edit__form-steam">
          <img edit__form-steam-avatar src={avatar} />
          <div className="edit__form-steam-info">
            <p className="edit__form-steam-username">Steam Username: {persona}</p>
            <p className="edit__form-steam-mmr">Dota MMR: {mmr}</p>
          </div>
        </div>
      );
    }
  }

  // GET FUNCTION TO PULL THE FIELDS OF THE REQUESTED ACTIVITY
  function getActivity() {
    db.doc(`activities/${id}`)
      .get()
      .then((document) => {
        setActivity({ ...document.data(), timestamp: document.data().timestamp.toDate() });
        setDescription(document.data().description);
        setSkill(document.data().skill);
        setSelectedGame(document.data().selectedGame);
        setMmr(document.data().mmr);
        setSteam(document.data().steam);
      })
      .catch((error) => {
        console.log(`Error getting documents: ${error}`);
      });
  }

  useEffect(() => {
    // Axios call to OpenDOTA API
    if (steam && steam.length === 8) {
      axios
        .get(`https://api.opendota.com/api/players/${steam}/`)
        .then((res) => {
          setMmr(res.data.solo_competitive_rank);
          setAvatar(res.data.profile.avatarmedium);
          setPersona(res.data.profile.personaname);
          setApiError(false);
        })
        .catch((err) => {
          setSteamError("Unable to find Steam profile. Invalid Steam ID.");
          setApiError(true);
        });
    } else {
      setMmr("");
      setAvatar("");
      setPersona("");
    }

    if (!activity) {
      getActivity();
    }
  }, [steam]);

  // GET FUNCTION TO PULL THE FIELDS OF THE REQUESTED ACTIVITY
  function getGames() {
    db.collection("games")
      .get()
      .then((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setGames(items);
      });
  }

  useEffect(() => {
    if (games.length === 0) {
      getGames();
    }
  }, []);

  // EDIT FUNCTION
  function editActivity(event) {
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

    if (steam.length >= 1 && steam.length !== 8) {
      setApiError(false);
      return setValidationError("Steam ID requires 8 digits");
    }

    if (apiError === true) {
      return setValidationError("Unable to find Steam profile. Invalid Steam ID.");
    }

    ref
      .doc(`${id}`)
      .update({
        skill,
        description,
        selectedGame,
        steam,
        mmr,
        persona,
        avatar,
      })
      .then((res) => {
        history.push(`/activities/${id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // FORM CHANGE HANDLERS
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSkillChange = (event) => {
    setSkill(event.target.value);
  };

  const handleGameChange = (event) => {
    setSelectedGame(event.target.value);
  };

  const handleSteamChange = (event) => {
    setSteam(event.target.value);
    if (!event.target.value) {
      setApiError(false);
    }
  };

  // FUNCTION TO RENDER A GAME PICTURE BASED ON GAME SELECTED IN DROP DOWN MENU
  function renderSelectedGame() {
    if (selectedGame !== "" && games.length !== 0) {
      const current = games.find((game) => game.title === selectedGame);
      return <img className="create__form-image" src={current.imageUrl} />;
    }
  }

  return (
    <>
      <div className="edit">
        <div className="edit__header-container">
          <h1 className="edit__header">Edit Activity</h1>
        </div>
        <form className="edit__form" onSubmit={editActivity}>
          <div className="edit__form-container">
            <div className="activity__form-game">
              <label className="edit__form-label" htmlFor="game">
                Game:
              </label>
              <div className="edit__form-game-line">
                {renderSelectedGame()}
                <select className="edit__form-select" value={selectedGame} onChange={handleGameChange} name="game" id="game">
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
                      <option value={game.title} key={game.id}>
                        {game.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {selectedGame === "Dota 2" || steam ? (
              <div className="edit__form-dota">
                <label className="edit__form-label" htmlFor="steam">
                  Steam ID
                </label>
                <input
                  className="edit__form-dota-input"
                  type="text"
                  id="steam"
                  name="steam"
                  value={steam}
                  onChange={handleSteamChange}
                  placeholder="Enter your Steam ID to display your MMR (not required)"
                />
              </div>
            ) : (
              <div></div>
            )}
            {steamProfile()}
            <label className="edit__form-label" htmlFor="skill">
              Skill:
            </label>
            <select className="edit__form-select" onChange={handleSkillChange} id="skill" name="skill">
              <option value="Learning">Learning</option>
              <option value="Advanced">Advanced</option>
              <option value="Pro">Pro</option>
            </select>

            <label className="edit__form-label" htmlFor="description">
              Description:
            </label>
            <textarea className="edit__form-input" type="text" id="description" name="description" value={description} onChange={handleDescriptionChange} />
          </div>
          <div className="edit__form-error-container">
            <p className="edit__form-error">{validationError}</p>
          </div>
          <div className="edit__button-container">
            <button className="edit__button-submit" type="submit">
              SUBMIT
            </button>
            <a href="/" className="edit__button-cancel">
              CANCEL
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
