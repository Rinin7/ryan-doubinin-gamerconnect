import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import fire from "../../config/Fire";
import firebase from "firebase";
import "./CreateActivity.scss";

export default function CreateActivity({ user, username }) {
  const db = fire.firestore();
  const history = useHistory();
  // const [user, setUser] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [gamePicture, setGamePicture] = useState("");
  // const [title, setTitle] = useState("");
  const [skill, setSkill] = useState("");
  const [description, setDescription] = useState("");
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  // const timestamp = new Date(timeInMilliseconds).toLocaleString();

  const handleSubmit = (event) => {
    event.preventDefault();

    db.collection("activities")
      .add({ skill, description, timestamp, selectedGame, host: username, hostId: user.uid })
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function getGames() {
    db.collection("games")
      .get()
      .then((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setGames(items);
        console.log(items);
      });
  }

  function renderSelectedGame() {
    if (selectedGame !== "") {
      const current = games.find((game) => game.title === selectedGame);
      return <img className="create__form-image" src={current.imageUrl} />;
    }
  }

  useEffect(() => {
    if (games.length === 0) {
      getGames();
      // getGameImage();
    }
    console.log(games);
  }, []);

  return (
    <>
      <div className="create">
        <div className="create__header-container">
          <h1 className="create__header">Create Activity</h1>
        </div>
        <form className="create__form" onSubmit={handleSubmit}>
          <div className="create__form-container">
            <div className="create__form-game">
              <label className="create__form-label" htmlFor="game">
                Game
              </label>
              <div className="create__form-game-line">
                {renderSelectedGame()}
                <select className="create__form-select" value={selectedGame} onChange={(event) => setSelectedGame(event.target.value)} name="game" id="game">
                  <option value="">Please select...</option>
                  {games
                    .filter((game) => (game.title.includes("All") ? "" : game.title))
                    .map((game) => (
                      <>
                        <option value={game.title} key={game.id}>
                          {game.title}
                        </option>
                      </>
                    ))}
                </select>
              </div>
            </div>
            <div className="create__form-info">
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
