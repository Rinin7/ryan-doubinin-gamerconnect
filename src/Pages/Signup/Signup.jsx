import React, { useRef, useState } from "react";
import "./Signup.scss";
import fire from "../../config/Fire";
import { useHistory } from "react-router-dom";

function Signup({ user }) {
  const db = fire.firestore();
  const emailRef = useRef();
  const passwordRef = useRef();
  const history = useHistory();
  const [username, setUsername] = useState("");

  // FUNCTION FOR SIGN UP
  function signupActions(event) {
    event.preventDefault();
    fire
      .auth()
      .createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
      .then((res) => {
        console.log(res, user, username);
        db.collection("users")
          .doc(res.user.uid)
          .set({ username: username })
          .then(() => {
            history.push("/");
          });
      });
  }

  // CHANGE HANDLER FOR USERNAME
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <section className="login">
      <form className="login__form">
        <h1 className="login__header">Sign Up</h1>
        <label className="login__form-title" htmlFor="email">
          Email
        </label>
        <input className="login__form-input" type="email" id="email" name="email" placeholder="Enter your email here" ref={emailRef} />
        <label className="login__form-title" htmlFor="username">
          Username
        </label>
        <input className="login__form-input" type="text" id="username" name="username" placeholder="Choose a username" value={username} onChange={handleUsernameChange} />
        <label className="login__form-title" htmlFor="password">
          Password
        </label>
        <input className="login__form-input" type="password" id="password" name="password" placeholder="Choose a password" ref={passwordRef} />
        <button className="login__form-signup" type="submit" onClick={signupActions}>
          Sign Up
        </button>
      </form>
      <div className="login__redirect">
        <p>
          Already have an account?{" "}
          <a className="signup__login-link" href="/">
            Log In Here.
          </a>
        </p>
      </div>
    </section>
  );
}

export default Signup;
