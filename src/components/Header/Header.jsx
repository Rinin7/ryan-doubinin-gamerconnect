import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import fire from "../../config/Fire";
import "./Header.scss";
import gear from "../../assets/icons/gear3.png";
import logo from "../../assets/logos/GamerConnect.png";

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
          {/* <img src={logo} /> */}
        </Link>
        {/* <div className="header__dropdown"> */}
        {/* <h4 className="header__user">{username ? username : "Not Logged In"}</h4>
          <button className="header__logout" onClick={logout}>
            Logout
          </button> */}
        {/* <h3 className="header__username">{username}</h3>
          <img className="header__gear" src={gear} />
          <div className="header__gear-content">
            <h3 className="header__gear-username">{username}</h3>
            <a href="/" className="header__gear-list">
              Feed
            </a>
            <a href="/myactivities" className="header__gear-list">
              My Activities
            </a>
            <a href="/create" className="header__gear-list">
              Create
            </a>
            <a href="#" className="header__gear-list" onClick={logout}>
              Logout
            </a>
          </div>
        </div>
      </div> */}
        {/* <div className="header__nav">
        <Link to="/" className="header__nav-feed">
          <h4 className="header__nav-link">Feed</h4>
        </Link>
        <Link to="/myactivities" className="header__nav-personal">
          <h4 className="header__nav-link">My Activities</h4>
        </Link>*/}
        <h3 className="header__username">{username}</h3>
      </div>
      <div className="header__hamburger">
        <nav role="navigation" className="navigation">
          <div id="menuToggle">
            <input type="checkbox" />
            <span></span>
            <span></span>
            <span></span>
            <ul id="menu">
              <Link to="/">
                <li className="navigation__list-item">Feed</li>
              </Link>
              <Link to="/myactivities">
                <li className="navigation__list-item">My Activities</li>
              </Link>
              <Link to={`/create`}>
                <li className="navigation__list-item">Create</li>
              </Link>
              <li onClick={logout} className="navigation__list-item">
                Logout
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
