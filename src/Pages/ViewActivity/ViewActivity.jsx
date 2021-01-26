import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import fire from "../../config/Fire";
import firebase from "firebase";
import Header from "../../components/Header/Header";

export default function ViewActivity() {
  const { id } = useParams();
  const db = fire.firestore();
  const [activity, setActivity] = useState({});
  console.log({ id });

  function getActivity() {
    db.collection("activities")
      .get()
      .then((querySnapshot) => {
        const requestedActivity = querySnapshot.docs.filter((doc) => doc.id === id);
        setActivity(requestedActivity);
        console.log({ activity });
      });
  }

  useEffect(() => {
    getActivity();
  }, []);

  return (
    <>
      <Header />
      <div>
        <h1>View Comment</h1>
        <Link to="/">
          <button>Home</button>
        </Link>
        <p>Description: {activity.description}</p>
      </div>
    </>
  );
}
