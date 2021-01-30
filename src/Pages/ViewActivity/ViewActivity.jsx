import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import fire from "../../config/Fire";
import firebase from "firebase";
import "./ViewActivity.scss";

export default function ViewActivity({ user, username }) {
  const { id } = useParams();
  const db = fire.firestore();
  const [activity, setActivity] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activityJoined, setActivityJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const history = useHistory();

  // GET FUNCTION TO PULL THE FIELDS OF THE REQUESTED ACTIVITY
  const getActivity = () => {
    console.log(activity);
    console.log(user);
    return db.doc(`activities/${id}`).onSnapshot((document) => {
      if (document.exists) {
        setActivity({ ...document.data(), timestamp: document.data().timestamp.toDate() });

        setActivityJoined(!!document.data()[user.uid]);
      }
    });

    // .catch((error) => {
    //   console.log(`Error getting documents: ${error}`);
    // });
  };

  const getMessages = () => {
    return db
      .doc(`activities/${id}`)
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
  };
  useEffect(() => {
    console.log("useEffect called");
    if (user) {
      const messages = getMessages();
      const activity = getActivity();

      const unsubscribe = () => {
        messages();
        activity();
      };
      return unsubscribe;
    }
  }, []);

  const handleOnChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    // if (db) {
    db.doc(`activities/${id}`).collection("messages").add({
      text: newMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      username,
    });
    // }

    setNewMessage("");
  };

  // DELETE FUNCTION
  function deleteActivity(activity) {
    db.collection("activities")
      .doc(id)
      .delete()
      .then((res) => {
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // JOIN LOBBY FUNCTION
  function joinLobbyHandler() {
    setJoining(true);
    db.collection("activities")
      .doc(id)
      .update({ [user.uid]: true })
      .then((res) => {
        setJoining(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // LEAVE LOBBY FUNCTION
  function leaveLobbyHandler() {
    setJoining(true);
    db.collection("activities")
      .doc(id)
      .update({ [user.uid]: false })
      .then((res) => {
        setJoining(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // FUNCTION THAT INFORMS NON-HOST USER THEY ARE IN THE LOBBY
  function joined() {
    if (user.uid === activity.hostId) {
      return;
    } else {
      return activityJoined ? <div>{username} has joined the lobby.</div> : "";
    }
  }

  // FUNCTION THAT WILL DISPLAY JOIN/LEAVE LOBBY BUTTON FOR NON-HOST
  function lobbyButton() {
    if (user.uid === activity.hostId) {
      return;
    } else {
      return activity[user.uid] !== true ? (
        <button onClick={() => joinLobbyHandler(activity)} disabled={joining}>
          Join Lobby
        </button>
      ) : (
        <button onClick={() => leaveLobbyHandler(activity)} disabled={joining}>
          Leave Lobby
        </button>
      );
    }
  }

  if (!user) {
    return <div></div>;
  }

  return (
    <>
      <div className="view">
        <h1 className="view__header">View Activity</h1>
        <div className="view__content-container">
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
          {/* {activityJoined ? <div>{username} has joined the lobby.</div> : ""} */}
          {joined()}
        </div>
        {activity.hostId === user.uid ? (
          <Link to={`/activities/${id}/edit`}>
            <button>Edit</button>
          </Link>
        ) : (
          ""
        )}
        {activity.hostId === user.uid ? <button onClick={() => deleteActivity(activity)}>X</button> : ""}
        {/* {activity[user.uid] !== true ? (
          <button onClick={() => joinLobbyHandler(activity)} disabled={joining}>
            Join Lobby
          </button>
        ) : (
          <button onClick={() => leaveLobbyHandler(activity)} disabled={joining}>
            Leave Lobby
          </button>
        )} */}
        {lobbyButton()}
        {activity.hostId === user.uid || activity[user.uid] ? (
          <>
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
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
