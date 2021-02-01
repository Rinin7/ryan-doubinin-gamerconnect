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

  function renderSelectedGame() {
    if (selectedGame !== "" && games.length !== 0) {
      const current = games.find((game) => game.title === selectedGame);
      return <img className="create__form-image" src={current.imageUrl} />;
    }
  }

  return (
    <>
      <div className="edit" key={activity.id}>
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
                    .map((game) => (
                      <option value={game.title} key={game.id}>
                        {game.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
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
          <div className="edit__button-container">
            <button className="edit__button-submit" type="submit">
              Submit
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
