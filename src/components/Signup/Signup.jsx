import React from "react";
import fire from "../../config/Fire";
import "./Signup.scss";

class Signup extends React.Component {
  state = {
    email: "",
    password: "",
    // confirmPassword: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  signup = (event) => {
    event.preventDefault();
    fire
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((u) => {
        console.log(u);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <section className="signup">
        <form className="signup__form" onSubmit={this.signup}>
          <h1 className="signup__header">Sign Up</h1>
          <label className="signup__form-title">Email</label>
          <input className="signup__form-input" type="email" value={this.state.email} onChange={this.handleChange} id="email" name="email" placeholder="Email Address here" />
          <label className="signup__form-title">Password</label>
          <input className="signup__form-input" type="password" value={this.state.password} onChange={this.handleChange} id="password" name="password" placeholder="Enter a password" />
          {/* <label className="signup__form-title">Password Confirmation</label>
          <input className="signup__form-input" type="password" value={this.state.confirmPassword} onChange={this.handleChange} id="confirm" name="confirm" placeholder="Confirm Password here" /> */}
          <button className="signup__form-submit" type="submit">
            Sign Up
          </button>
        </form>
        <div className="signup__redirect">
          <p>
            Already have an account? <a href="localhost:3000">Log In Here.</a>
          </p>
        </div>
      </section>
    );
  }
}

export default Signup;
