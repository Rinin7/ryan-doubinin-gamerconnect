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

  let gameSearch = (e) => {
    setSearchTerm(e);
  };

  function getActivities() {
    return db
      .collection("activities")
      .orderBy("timestamp", "desc")
      .onSnapshot((querySnapshot) => {
        let posts = [];

        querySnapshot.forEach((doc) => {
          posts.push({
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate().toString(),
            id: doc.id,
          });
        });

        // const posts = querySnapshot.docs.map((doc) => ({ ...doc.data(), timestamp: doc.data().timestamp.toDate().toString(), id: doc.id }));
        setActivities(posts);
        // console.log({ posts });
      });
  }

  function getGames() {
    db.collection("games")
      .get()
      .then((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setGames(items);
        console.log({ games });
      });
  }

  useEffect(() => {
    getGames();
    console.log("from useEffect");
    return getActivities();
  }, []);

  // if (loading) {
  //   return <h1>Loading...</h1>;
  // }

  return (
    <div className="home">
      {/* <Header searchHandler={gameSearch} /> */}
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
            <GameList key={game.id} gameList={game} />
          ))}

        {/* {searchResults.map((result) => (
        <GameList key={result.id} gameList={result}
      ))} */}
      </div>
      <h1>Feed</h1>
      <Link to="/create">
        <button>Create</button>
      </Link>
      <div className="home__feed">
        {activities.map((activity) => (
          <Link to={`/activities/${activity.id}`}>
            <ActivityList key={activity.id} activityList={activity} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
