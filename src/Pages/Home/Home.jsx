import React, { useEffect, useState } from "react";
import "./Home.scss";
import fire from "../../config/Fire";
import { Link, useHistory } from "react-router-dom";
import ActivityList from "../../components/ActivityList/ActivityList";
import GameList from "../../components/GameList/GameList";
import Header from "../../components/Header/Header";

function Home() {
  const [games, setGames] = useState([]);
  const [activities, setActivities] = useState([]);
  // const [loading, setLoading] = useState(false);
  const db = fire.firestore();
  // const history = useHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [clickedGames, setClickedGames] = useState("All");

  let gameSearch = (e) => {
    setSearchTerm(e);
  };

  function allGamesFunction() {
    let allGames = games.map((game) => game.title);
    return allGames;
  }

  function getActivities() {
    console.log(clickedGames);
    // const where = clickedGames === "All" ? "" : ["selectedGame", "==", clickedGames];
    if (clickedGames === "All") {
      return db
        .collection("activities")
        .orderBy("timestamp", "desc")
        .onSnapshot((querySnapshot) => {
          let posts = [];

          querySnapshot.forEach((doc) => {
            posts.push({
              ...doc.data(),
              // timestamp: doc.data().timestamp.toDate().toString(),
              timestamp: timeSince(doc.data().timestamp.seconds * 1000),
              id: doc.id,
            });
          });

          // const posts = querySnapshot.docs.map((doc) => ({ ...doc.data(), timestamp: doc.data().timestamp.toDate().toString(), id: doc.id }));
          setActivities(posts);
          console.log(posts);
          // console.log({ posts });
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
              // timestamp: doc.data().timestamp.toDate().toString(),
              timestamp: timeSince(doc.data().timestamp.seconds * 1000),
              id: doc.id,
            });
            console.log(doc.data().timestamp.seconds);
          });

          // const posts = querySnapshot.docs.map((doc) => ({ ...doc.data(), timestamp: doc.data().timestamp.toDate().toString(), id: doc.id }));
          setActivities(posts);
          console.log(posts);
          // console.log({ posts });
        });
    }
  }

  function getGames() {
    db.collection("games")
      .orderBy("title")
      .get()
      .then((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setGames(items);
        // console.log({ games });
      });
  }

  useEffect(() => {
    getGames();
    // console.log("from useEffect");
    return getActivities();
  }, [clickedGames]);

  const clickGamesHandler = (id) => {
    console.log(id);
    // event.stopPropagation();
    setClickedGames(id);
  };

  // if (loading) {
  //   return <h1>Loading...</h1>;
  // }

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
    <div className="home">
      <input
        type="text"
        placeholder="Search..."
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
      />
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

        {/* {searchResults.map((result) => (
        <GameList key={result.id} gameList={result}
      ))} */}
      </div>
      <h1>
        Displaying {activities.length} posts for {clickedGames}
      </h1>
      <Link to="/create">
        <button>Create</button>
      </Link>
      <div className="home__feed">
        {activities
          // .filter((activity) => activity.selectedGame === clickedGames)
          .map((activity) => (
            <Link to={`/activities/${activity.id}`}>
              <ActivityList key={activity.id} activityList={activity} timeSince={timeSince} />
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Home;
