import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import fire from "../../config/Fire";
import "./Header.scss";

export default function Header({ searchHandler, username }) {
  const history = useHistory();

  function logout() {
    fire.auth().signOut();
    history.push("/login");
  }

  return (
    <header className="header">
      <div className="header__logo-container">
        <Link to="/">
          <h2 className="header__logo">GamerConnect</h2>
        </Link>
      </div>
      <div className="header__nav">
        <Link to="/">
          <h4 className="header__nav-feed">Feed</h4>
        </Link>
        <Link to="/myactivities">
          <h4 className="header__nav-personal">My Activities</h4>
        </Link>
      </div>
      {/* <div className="header__searchbar-container">
        <input
          className="header__searchbar"
          type="text"
          placeholder="Search for a game..."
          onChange={(e) => {
            searchHandler(e.target.value);
          }}
        />
      </div> */}
      <div className="header__user-container">
        <h4 className="header__user">{username ? username : "Not Logged In"}</h4>
        <button className="header__logout" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
