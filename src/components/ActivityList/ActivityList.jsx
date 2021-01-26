import React from "react";
import "./ActivityList.scss";

export default function ActivityList({ activityList }) {
  let { id, selectedGame, host, skill, description } = activityList;
  let date = new Date(activityList.timestamp);
  return (
    <div className="activity" key={id}>
      <p className="activity__host">{host}</p>
      <div className="activity__info-container">
        <p className="activity__info">{selectedGame}</p>
        <p className="activity__info">{date.toLocaleTimeString("en-US")}</p>
      </div>
      <p className="activity__skill">{skill}</p>
      <p className="activity__description">{description}</p>
    </div>
  );
}
