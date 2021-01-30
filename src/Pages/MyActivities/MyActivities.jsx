import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import fire from "../../config/Fire";
import firebase from "firebase";
import ActivityList from "../../components/ActivityList/ActivityList";

function MyActivities({ user, username }) {
  const { id } = useParams();
  const db = fire.firestore();
  const [activities, setActivities] = useState([]);
  const history = useHistory();

  // GET FUNCTION TO PULL THE FIELDS OF THE REQUESTED ACTIVITY
  function getActivities() {
    Promise.all([
      db
        .collection("activities")
        .where("hostId", "==", user.uid)
        .orderBy("timestamp", "desc")
        .get()
        .then((activities) => {
          return activities.docs.map((doc) => ({ ...doc.data(), timestamp: doc.data().timestamp.toDate().toString(), id: doc.id }));
        }),
      db
        .collection("activities")
        .where(user.uid, "==", true)
        .get()
        .then((activities) => {
          return activities.docs.map((doc) => ({ ...doc.data(), timestamp: doc.data().timestamp.toDate().toString(), id: doc.id }));
        }),
    ]).then((responses) => {
      console.log(responses);
      setActivities([...responses[0], ...responses[1]]);
    });
  }

  useEffect(() => {
    if (user) {
      getActivities();
    }
  }, []);

  return (
    <div>
      <h1>My Activities</h1>
      {activities.map((activity) => (
        <Link to={`/activities/${activity.id}`}>
          <ActivityList key={activity.id} activityList={activity} />
        </Link>
      ))}
    </div>
  );
}

export default MyActivities;
