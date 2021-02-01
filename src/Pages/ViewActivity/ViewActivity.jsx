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
  const [games, setGames] = useState([]);
  const history = useHistory();

  // GET FUNCTION TO PULL THE FIELDS OF THE REQUESTED ACTIVITY
  const getActivity = () => {
    console.log(activity);
    console.log(user);
    return db.doc(`activities/${id}`).onSnapshot((document) => {
      if (document.exists) {
        setActivity({ ...document.data(), timestamp: timeSince(document.data().timestamp.seconds * 1000) });

        setActivityJoined(!!document.data()[user.uid]);
        console.log(activity);
      }
    });

    // .catch((error) => {
    //   console.log(`Error getting documents: ${error}`);
    // });
  };

  // FUNCTION TO CHANGE TIMESTAMP
  const timeSince = (date) => {
    let currentTime = Date.now();
    let difference = currentTime - date;
    let num = 0;

    const minute = 60000;
    const hour = 3600000;
    const day = 86400000;
    const week = 604800000;
    const month = 2592000000;
    const year = 31556952000;

    const timeBeforeNow = "moments ago";

    if (difference < minute) {
      return timeBeforeNow;
    } else if (difference < hour) {
      num = Math.floor(difference / minute);
      return num === 1 ? `${num} min ago` : `${num} mins ago`;
    } else if (difference < day) {
      num = Math.floor(difference / hour);
      return num === 1 ? `${num} hour ago` : `${num} hours ago`;
    } else if (difference < week) {
      num = Math.floor(difference / day);
      return num === 1 ? `${num} day ago` : `${num} days ago`;
    } else if (difference < month) {
      num = Math.floor(difference / week);
      return num === 1 ? `${num} week ago` : `${num} weeks ago`;
    } else if (difference < year) {
      num = Math.floor(difference / month);
      return num === 1 ? `${num} month ago` : `${num} months ago`;
    } else if (difference > year) {
      num = Math.floor(difference / year);
      return num === 1 ? `${num} year ago` : `${num} years ago`;
    }
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
    getGames();
  }, []);

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
        <button className="view__button-join" onClick={() => joinLobbyHandler(activity)} disabled={joining}>
          Join Lobby
        </button>
      ) : (
        <button className="view__button-leave" onClick={() => leaveLobbyHandler(activity)} disabled={joining}>
          Leave Lobby
        </button>
      );
    }
  }

  function renderSelectedGame() {
    if (games && games.length !== 0 && activity.length !== 0 && activity.selectedGame !== "") {
      console.log(messages, username);
      const current = games.find((game) => game.title === activity.selectedGame);
      console.log(current, activity);

      return <img className="activitylist__image" src={current.imageUrl} />;
    }
  }

  useEffect(() => {
    renderSelectedGame();
  }, []);

  if (!user) {
    return <div></div>;
  }

  return (
    <>
      <div className="view">
        <div className="view__header-container">
          <h1 className="view__header">View Activity</h1>
        </div>
        <div className="view__activitylist" key={id}>
          <div className="view__info-container">
            <div className="view__user-date">
              <h3 className="view__host">{activity.host}</h3>
              <div className="view__info-secondary">
                <h5 className="view__skill">{activity.skill}</h5>
                <h4 className="view__bullet">•</h4>
                <h5 className="view__info">{activity.timestamp}</h5>
              </div>
            </div>
            <div className="view__description-container">
              <h4 className="view__description">{activity.description}</h4>
            </div>
          </div>
          <div className="view__game-container">
            {/* <img className="activitylist__image" src={activity.imageUrl} /> */}
            {renderSelectedGame()}
            {/* <h3 className="activitylist__game-title">{selectedGame}</h3> */}
          </div>
        </div>

        {joined()}
      </div>
      <div className="view__button-container">
        {activity.hostId === user.uid ? (
          <Link to={`/activities/${id}/edit`}>
            <button className="view__button-edit">EDIT</button>
          </Link>
        ) : (
          ""
        )}
        {activity.hostId === user.uid ? (
          <button className="view__button-delete" onClick={() => deleteActivity(activity)}>
            DELETE
          </button>
        ) : (
          ""
        )}
        {lobbyButton()}
      </div>
      {/* {activity[user.uid] !== true ? (
          <button onClick={() => joinLobbyHandler(activity)} disabled={joining}>
            Join Lobby
          </button>
        ) : (
          <button onClick={() => leaveLobbyHandler(activity)} disabled={joining}>
            Leave Lobby
          </button>
        )} */}

      {activity.hostId === user.uid || activity[user.uid] ? (
        <>
          <div className="view__header-container">
            <h2 className="view__header view__header-conversation">Conversation</h2>
          </div>
          <div className="view__chat">
            <ul className="view__chat-boxes">
              {messages.map((message) => (
                <li className={message.username === username ? "view__sent" : "view__received"} key={message.id}>
                  {message.username}: {message.text}
                </li>
              ))}
            </ul>
            <form className="view__form" onSubmit={handleOnSubmit}>
              <input className="view__form-input" type="text" value={newMessage} onChange={handleOnChange} placeholder="Chat with the lobby here..." />

              <button className="view__form-send" type="submit" disabled={!newMessage}>
                Send
              </button>
            </form>
          </div>
        </>
      ) : (
        ""
      )}
      {/* </div> */}
    </>
  );
}
