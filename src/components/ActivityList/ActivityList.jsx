import React, { useEffect } from "react";
import "./ActivityList.scss";

export default function ActivityList({ activityList, games, username }) {
  let { id, selectedGame, host, skill, timestamp, description } = activityList;

  // FUNCTION TO RENDER GAMES
  function renderSelectedGame() {
    if (games && games.length !== 0 && selectedGame !== "") {
      const current = games.find((game) => game.title === selectedGame);
      return <img className="activitylist__image" src={current.imageUrl} />;
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
      <div className="activitylist__game-container">{renderSelectedGame()}</div>
    </div>
  );
}
