import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import fire from "../../config/Fire";
import firebase from "firebase";
import "./ViewActivity.scss";

export default function ViewActivity({ user, username }) {
  const { id } = useParams();
  const db = fire.firestore();
  const [activity, setActivity] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  console.log(user);
  // const [selectedGame, setSelectedGame] = useState("");
  // const [skill, setSkill] = useState("");
  // const [description, setDescription] = useState("");
  const ref = firebase.firestore().collection("activities");
  // const uid = user.uid;

  // GET FUNCTION TO PULL THE FIELDS OF THE REQUESTED ACTIVITY
  function getActivity() {
    db.doc(`activities/${id}`)
      .get()
      .then((document) => {
        setActivity({ ...document.data(), timestamp: document.data().timestamp.toDate() });
        console.log(document.data());
      })
      .catch((error) => {
        console.log(`Error getting documents: ${error}`);
      });
  }

  useEffect(() => {
    getActivity();
    console.log(activity);
  }, []);

  useEffect(() => {
    db.doc(`activities/${id}`)
      .collection("messages")
      .orderBy("createdAt")
      .limit(100)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(data);
        setMessages(data);
      });
  }, []);

  const handleOnChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (db) {
      db.doc(`activities/${id}`).collection("messages").add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        username,
      });
    }

    setNewMessage("");
  };

  // // DELETE FUNCTION
  // function deleteActivity(activity) {
  //   ref
  //     .doc(id)
  //     .delete()
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // // EDIT FUNCTION
  // function editActivity(updatedActivity) {
  //   ref
  //     .doc(id)
  //     .update(updatedActivity)
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  return (
    <>
      <div className="view" key={activity.id}>
        <h1 className="view__header">View Activity</h1>
        <div className="view__content-container" key={id}>
          <label className="view__subheader" htmlFor="host">
            Host:
          </label>
          <input className="view__input" type="text" id="host" name="host" value={activity.host} />
          <div className="activity__info-container">
            <label className="view__subheader" htmlFor="game">
              Game:
            </label>
            <input className="view__input" type="text" id="game" name="game" value={activity.selectedGame} />
            <label className="view__subheader" htmlFor="timestamp">
              Posted:
            </label>
            <input className="view__input" type="text" id="timestamp" name="timestamp" value={activity.timestamp} />
          </div>
          <label className="view__subheader" htmlFor="skill">
            Skill:
          </label>
          <input className="view__input" type="text" id="skill" name="skill" value={activity.skill} />
          <label className="view__subheader" htmlFor="description">
            Description:
          </label>
          <input className="view__input" type="text" id="description" name="description" value={activity.description} />
        </div>
        {/* <Link to={`/activities/${id}/edit`}>
          <button onClick={() => editActivity({ selectedGame: activity.selectedGame, skill: activity.skill, description, id })}>Edit</button>
        </Link> */}
        <h2>Conversation</h2>
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              {message.username}: {message.text}
            </li>
          ))}
        </ul>
        <form onSubmit={handleOnSubmit}>
          <input type="text" value={newMessage} onChange={handleOnChange} placeholder="Chat with the lobby here..." />
          <button type="submit" disabled={!newMessage}>
            Send
          </button>
        </form>
      </div>
    </>
  );
}
