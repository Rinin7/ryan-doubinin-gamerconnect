import React, { useRef, useState, useEffect } from "react";
import "./Signup.scss";
import fire from "../../config/Fire";
import { Link, useHistory } from "react-router-dom";

function Signup({ user }) {
  const db = fire.firestore();
  const [error, setError] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const history = useHistory();
  // const usernameRef = useRef();
  const [username, setUsername] = useState("");
  // const [userId, setUserId] = useState("");

  async function signupWithEmail(event) {
    // event.preventDefault();
    try {
      setError("");
      await fire
        .auth()
        .createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
        .then((res) => {
          console.log(res, user, username);
          db.collection("users").doc(user.uid).set({ username: username });
        });
      // newUserSuccessHandler();
    } catch {
      setError("Failed to create an account");
    }
    console.log(user);
  }

  const createUsername = async () => {
    // console.log(userId);
    // const username = await usernameRef.current.value;
    // await db.collection("users").doc(userId).set({ username: username });
    // console.log("usernameRef from createUsername", usernameRef.current.value);
    history.push("/");
  };

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

  // useEffect(() => {
  //   // setUserId(user && user.uid);
  //   // if (userId) {
  //   //   createUsername();
  //   // }
  //   newUserHandler(username);
  // }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    // newUserHandler(username);
  };

  // function passwordHandler(event) {
  //   console.log(event.current.value);
  // }

  // this.authListener();
  // console.log(this.props);
  return (
    <section className="login">
      {/* <Link to="/">Home</Link> */}
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
        {/* <label className="login__form-title" htmlFor="confirm">Password Confirmation</label>
          <input className="login__form-input" type="password" value={this.state.confirmPassword} onChange={this.handleChange} id="confirm" name="confirm" placeholder="Confirm Password here" /> */}
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
