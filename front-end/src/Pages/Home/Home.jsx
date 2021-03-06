import React, { useEffect, useState } from "react";
import "./Home.scss";
import fire from "../../config/Fire";
import { Link } from "react-router-dom";
import ActivityList from "../../components/ActivityList/ActivityList";
import GameList from "../../components/GameList/GameList";

function Home() {
  const [games, setGames] = useState([]);
  const [activities, setActivities] = useState([]);
  const db = fire.firestore();
  const [searchTerm, setSearchTerm] = useState("");
  const [clickedGames, setClickedGames] = useState("All");

  // function allGamesFunction() {
  //   let allGames = games.map((game) => game.title);
  //   return allGames;
  // }

  // FUNCTION TO GET ALL ACTIVITIES AND USE SELECTED GAMES TO FILTER ACTIVITIES DISPLAYED
  function getActivities() {
    if (clickedGames === "All") {
      return db
        .collection("activities")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
          let posts = [];

          querySnapshot.forEach((doc) => {
            posts.push({
              ...doc.data(),
              timestamp: timeSince(doc.data().timestamp.seconds * 1000),
              id: doc.id,
            });
          });
          setActivities(posts);
        });
    } else {
      return db
        .collection("activities")
        .orderBy("timestamp", "desc")
        .where("selectedGame", "==", clickedGames)
        .onSnapshot((querySnapshot) => {
          let posts = [];

          querySnapshot.forEach((doc) => {
            posts.push({
              ...doc.data(),
              timestamp: timeSince(doc.data().timestamp.seconds * 1000),
              id: doc.id,
            });
          });
          setActivities(posts);
        });
    }
  }

  // FUNCTION TO GET GAME COLLECTION DATA
  function getGames() {
    db.collection("games")
      .orderBy("title")
      .get()
      .then((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setGames(items);
      });
  }

  useEffect(() => {
    getGames();
    return getActivities();
  }, [clickedGames]);

  // FUNCTION THAT HANDLES ONCLICK ON GAMES
  const clickGamesHandler = (id) => {
    setClickedGames(id);
  };

  // FUNCTION TO CHANGE TIMESTAMP TO "TIME SINCE" POSTED
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
    <div className="home">
      <div className="home__utility">
        <input
          className="home__search"
          type="text"
          placeholder="Search..."
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        <Link to="/create">
          <button className="home__create-button">+</button>
        </Link>
      </div>
      <div className="home__gamelist">
        {games
          .filter((val) => {
            if (searchTerm === "") {
              return val;
            } else if (val.title.toLowerCase().includes(searchTerm.toLowerCase())) {
              return val;
            }
          })
          .map((game) => (
            <GameList key={game.id} gameList={game} clickGamesHandler={clickGamesHandler} />
          ))}
      </div>
      <h1 className="home__posts-header">
        {clickedGames} - {activities.length} posts
      </h1>
      <div className="home__feed">
        {activities.map((activity) => (
          <Link className="home__activitylist-link" to={`/activities/${activity.id}`}>
            <ActivityList key={activity.id} activityList={activity} timeSince={timeSince} games={games} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
