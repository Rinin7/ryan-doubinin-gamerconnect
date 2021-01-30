import React from "react";
import "./ActivityList.scss";

export default function ActivityList({ activityList, timeSince }) {
  let { id, selectedGame, host, skill, timestamp, description } = activityList;

  return (
    <div className="activity" key={id}>
      <p className="activity__host">{host}</p>
      <div className="activity__info-container">
        <p className="activity__info">{selectedGame}</p>
        <p className="activity__info">{timestamp}</p>
      </div>
      <p className="activity__skill">{skill}</p>
      <p className="activity__description">{description}</p>
    </div>
  );
}
