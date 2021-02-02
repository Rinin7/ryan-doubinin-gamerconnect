import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import fire from "../../config/Fire";
import ActivityList from "../../components/ActivityList/ActivityList";
import "./MyActivities.scss";

function MyActivities({ user, username }) {
  const [games, setGames] = useState([]);
  const db = fire.firestore();
  const [activities, setActivities] = useState([]);

  // GET FUNCTION TO PULL THE FIELDS OF THE REQUESTED ACTIVITY
  function getActivities() {
    Promise.all([
      db
        .collection("activities")
        .where("hostId", "==", user.uid)
        .orderBy("timestamp", "desc")
        .get()
        .then((activities) => {
          return activities.docs.map((doc) => ({ ...doc.data(), timestamp: timeSince(doc.data().timestamp.seconds * 1000), id: doc.id }));
        }),
      db
        .collection("activities")
        .where(user.uid, "==", true)
        .get()
        .then((activities) => {
          return activities.docs.map((doc) => ({ ...doc.data(), timestamp: timeSince(doc.data().timestamp.seconds * 1000), id: doc.id }));
        }),
    ]).then((responses) => {
      setActivities([...responses[0], ...responses[1]]);
    });
  }

  // FUNCTION TO GET GAMES COLLECTION DATA
  function getGames() {
    db.collection("games")
      .get()
      .then((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setGames(items);
      });
  }

  useEffect(() => {
    if (user) {
      getActivities();
      getGames();
    }
  }, []);

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

  return (
    <div className="personal">
      <div className="personal__header-container">
        <h1 className="personal__header">My Activities</h1>
      </div>
      <div className="personal__feed">
        {activities.map((activity) => (
          <Link className="personal__activitylist-link" to={`/activities/${activity.id}`}>
            <ActivityList user={user} key={activity.id} activityList={activity} games={games} timeSince={timeSince} username={username} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyActivities;
