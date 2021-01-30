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

  useEffect(() => {
    if (games.length === 0) {
      getGames();
    }
    console.log(games);
  }, []);

  return (
    <>
      <div className="create">
        <h1 className="create__header">Create an Activity</h1>
        <form className="create__form" onSubmit={handleSubmit}>
          {/* <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" onChange={(event) => setTitle(event.target.value)} /> */}
          <div className="create__form-container">
            <div className="create__form-game">
              <label className="create__form-label" htmlFor="game">
                Game
              </label>
              <select className="create__form-select" value={selectedGame} onChange={(event) => setSelectedGame(event.target.value)} name="game" id="game">
                <option value="">Please select...</option>
                {games
                  .filter((game) => (game.title.includes("All") ? "" : game.title))
                  .map((game) => (
                    <option value={game.title} key={game.id}>
                      {game.title}
                    </option>
                  ))}
              </select>
              {/* <img className="create_form-game-img" src> */}
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
              {/* <textarea className="create__form-input" type="text" id="skill" name="skill" onChange={(event) => setSkill(event.target.value)} /> */}
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
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
