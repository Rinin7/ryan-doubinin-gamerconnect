import React from "react";
import "./GameList.scss";

export default function GameList({ gameList }) {
  let { uid, imageUrl, title } = gameList;
  return (
    <div className="games" key={uid}>
      <div className="games__card">
        <img className="games__image" src={imageUrl} />
        <h2 className="games__title">{title}</h2>
      </div>
    </div>
  );
}
