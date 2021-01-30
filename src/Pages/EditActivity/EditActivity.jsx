import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import fire from "../../config/Fire";
import firebase from "firebase";
import "./EditActivity.scss";

export default function EditActivity({ username }) {
  const { id } = useParams();
  const db = fire.firestore();
  const [activity, setActivity] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [skill, setSkill] = useState("");
  const [description, setDescription] = useState("");
  const ref = firebase.firestore().collection("activities");
  const history = useHistory();
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();

  // GET FUNCTION TO PULL THE FIELDS OF THE REQUESTED ACTIVITY
  function getActivity() {
    console.log(id);
    db.doc(`activities/${id}`)
      .get()
      .then((document) => {
        setActivity({ ...document.data(), timestamp: document.data().timestamp.toDate() });
        setDescription(document.data().description);
        setSkill(document.data().skill);
        setSelectedGame(document.data().selectedGame);
      })
      .catch((error) => {
        console.log(`Error getting documents: ${error}`);
      });
  }

  useEffect(() => {
    getActivity();
    console.log(activity);
  }, []);

  // GET FUNCTION TO PULL THE FIELDS OF THE REQUESTED ACTIVITY
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

  // EDIT FUNCTION
  function editActivity(event) {
    event.preventDefault();

    ref
      .doc(`${id}`)
      .update({
        skill,
        description,
        selectedGame,
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
    console.log(event.target.value);
  };

  const handleSkillChange = (event) => {
    setSkill(event.target.value);
    console.log(event.target.value);
  };

  const handleGameChange = (event) => {
    setSelectedGame(event.target.value);
    console.log(event.target.value);
  };

  return (
    <>
      <div className="view" key={activity.id}>
        <h1 className="view__header">Edit Activity</h1>
        <form className="create__form" onSubmit={editActivity}>
          <div className="view__content-container" key={id}>
            {/* <label className="view__subheader" htmlFor="host">
              Host:
            </label>
            <input className="view__input" type="text" id="host" name="host" value={activity.host} /> */}
            <div className="activity__info-container">
              <label className="view__subheader" htmlFor="game">
                Game:
              </label>
              <select className="view__input" value={selectedGame} onChange={handleGameChange} name="game" id="game">
                {games
                  .filter((game) => (game.title.includes("All") ? "" : game.title))
                  .map((game) => (
                    <option value={game.title} key={game.id}>
                      {game.title}
                    </option>
                  ))}
              </select>
              {/* <input className="view__input" type="text" id="game" name="game" value={selectedGame} onChange={handleGameChange} /> */}
              {/* <label className="view__subheader" htmlFor="timestamp">
                Posted:
              </label>
              <input className="view__input" type="text" id="timestamp" name="timestamp" value={activity.timestamp} /> */}
            </div>
            <label className="view__subheader" htmlFor="skill">
              Skill:
            </label>
            <select className="view__input" onChange={handleSkillChange} id="skill" name="skill">
              <option value="Learning">Learning</option>
              <option value="Advanced">Advanced</option>
              <option value="Pro">Pro</option>
            </select>
            {/* <input className="view__input" type="text" id="skill" name="skill" value={skill} onChange={handleSkillChange} /> */}
            <label className="view__subheader" htmlFor="description">
              Description:
            </label>
            <textarea className="view__input" type="text" id="description" name="description" value={description} onChange={handleDescriptionChange} />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
