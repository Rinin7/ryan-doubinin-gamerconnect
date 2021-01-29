import React from "react";
import "./GameList.scss";

export default function GameList({ gameList, clickGamesHandler }) {
  const { id, imageUrl, title } = gameList;

  return (
    // <div className="games" >
    <button className="games__card" key={id} value={title} onClick={clickGamesHandler}>
      <img className="games__image" src={imageUrl} />
      <h2 className="games__title">{title}</h2>
    </button>
    // </div>
  );
}
