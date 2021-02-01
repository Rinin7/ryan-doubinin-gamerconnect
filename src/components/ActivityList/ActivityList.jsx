import React, { useEffect } from "react";
import "./ActivityList.scss";
import lol from "../../assets/images/games/lol.jpg";

export default function ActivityList({ activityList, games, user, username }) {
  let { id, selectedGame, host, skill, timestamp, description } = activityList;

  function renderSelectedGame() {
    if (games && games.length !== 0 && selectedGame !== "") {
      const current = games.find((game) => game.title === selectedGame);
      return <img className="activitylist__image" src={current.imageUrl} />;
      // console.log(current, selectedGame);
    }
  }

  useEffect(() => {
    renderSelectedGame();
  }, []);

  return (
    <div className={host !== username ? "activitylist" : "activitylist-two"} key={id}>
      <div className="activitylist__info-container">
        <div className="activitylist__user-date">
          <h3 className="activitylist__host">{host}</h3>
          <div className="activitylist__info-secondary">
            <h4 className="activitylist__skill">{skill}</h4>
            <h4 className="activitylist__bullet">•</h4>
            <h4 className="activitylist__info">{timestamp}</h4>
          </div>
        </div>
        <div className="activitylist__description-container">
          <h4 className="activitylist__description">{description}</h4>
        </div>
      </div>
      <div className="activitylist__game-container">
        {renderSelectedGame()}
        {/* <h3 className="activitylist__game-title">{selectedGame}</h3> */}
      </div>
    </div>
  );
}
