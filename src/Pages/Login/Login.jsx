import React, { useRef, useState } from "react";
import "./Login.scss";
import fire from "../../config/Fire";
import { useHistory } from "react-router-dom";

function Login() {
  const [error, setError] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const history = useHistory();

  // FUNCTION TO LOG IN
  async function login(event) {
    event.preventDefault();
    try {
      setError("");
      await fire.auth().signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Failed to log in");
    }
  }

  return (
    <section className="login">
      <form className="login__form">
        <h1 className="login__header">Log In</h1>
        <label className="login__form-title" htmlFor="email">
          Email
        </label>
        <input className="login__form-input" type="email" id="email" name="email" placeholder="Enter your email" ref={emailRef} />
        <label className="login__form-title" htmlFor="password">
          Password
        </label>
        <input className="login__form-input" type="password" id="password" name="password" placeholder="Enter your password" ref={passwordRef} />
        <button className="login__form-submit" type="submit" onClick={login}>
          Log In
        </button>
      </form>
      <div className="login__redirect">
        <p>
          Don't have an account?{" "}
          <a className="login__signup-link" href="/signup">
            Sign Up Here.
          </a>
        </p>
      </div>
    </section>
  );
}

export default Login;
