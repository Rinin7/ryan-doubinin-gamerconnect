import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import fire from "../../config/Fire";
import "./Header.scss";
import gear from "../../assets/icons/gear3.png";
import logo from "../../assets/logos/GamerConnect.png";

export default function Header({ user, username }) {
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
        <h3 className="header__username">{username}</h3>
      </div>
      {username ? (
        <>
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
          </div>{" "}
        </>
      ) : (
        ""
      )}
    </header>
  );
}
