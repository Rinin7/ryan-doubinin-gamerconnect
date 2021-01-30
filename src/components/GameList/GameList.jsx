import React from "react";
import "./GameList.scss";

export default function GameList({ gameList, clickGamesHandler }) {
  const { id, imageUrl, title } = gameList;

  return (
    // <div className="games" >
    <div
      className="games__card"
      id={title}
      onClick={() => {
        clickGamesHandler(title);
      }}
    >
      <img className="games__image" src={imageUrl} />
      <h2 className="games__title">{title}</h2>
    </div>
    // </div>
  );
}
