import React, { useState, useEffect } from "react";
import fire from "../config/Fire";
import Home from "../Pages/Home/Home";
import CreateActivity from "../Pages/CreateActivity/CreateActivity";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "../Pages/Login/Login";
import ViewActivity from "../Pages/ViewActivity/ViewActivity";
import EditActivity from "../Pages/EditActivity/EditActivity";
import MyActivities from "../Pages/MyActivities/MyActivities";
import Signup from "../Pages/Signup/Signup";
import Header from "../components/Header/Header";

function App() {
  const [user, setUser] = useState(undefined);
  const [authListenerAdded, setAuthListenerAdded] = useState(false);
  const [username, setUsername] = useState("");
  const db = fire.firestore();
  // const [newUsername, setNewUsername] = useState(undefined);
  // const [signUpSuccess, setSignUpSuccess] = useState(false);

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        localStorage.setItem("isAuthenticated", "true");
        // console.log("localStorage", localStorage.getItem("isAuthenticated"));
        // console.log({ user });
        // console.log(newUsername);
      } else {
        setUser(null);
        localStorage.removeItem("isAuthenticated");
        setUsername("");
      }
    });

    setAuthListenerAdded(true);
  };

  useEffect(() => {
    if (!authListenerAdded) {
      authListener();
    }

    if (user && username === "") {
      db.doc(`users/${user.uid}`)
        .get()
        .then((documentSnapshot) => {
          const data = documentSnapshot.data();
          if (data && data.username) {
            setUsername(documentSnapshot.data().username);
          }
        });
    }

    // fire.auth().currentUser
  }, [user]);

  const handleLogin = (user) => {
    setUser(user);
  };

  // const newUserHandler = (username) => {
  //   setNewUsername(username);
  //   console.log("from newUserHandler", username);
  // };

  // const newUserSuccessHandler = () => {
  //   setSignUpSuccess(true);
  // };

  function PrivateRoute({ component: Component, ...rest }) {
    return <Route {...rest} render={(props) => (localStorage.isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)} />;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Header username={username} />
        <Switch>
          <Route path="/login" exact component={(routerProps) => <Login {...routerProps} user={user} handler={handleLogin} />} />
          <Route path="/signup" exact component={(routerProps) => <Signup {...routerProps} user={user} handler={handleLogin} />} />
          <PrivateRoute path="/" exact component={(routerProps) => <Home {...routerProps} user={user} />} />
          <PrivateRoute path="/myactivities" exact component={(routerProps) => <MyActivities {...routerProps} user={user} username={username} />} />
          <PrivateRoute path="/create" exact component={(routerProps) => <CreateActivity {...routerProps} user={user} username={username} />} />
          <PrivateRoute path="/activities/:id" exact component={(routerProps) => <ViewActivity {...routerProps} user={user} username={username} />} />
          <PrivateRoute path="/activities/:id/edit" exact component={(routerProps) => <EditActivity {...routerProps} user={user} username={username} />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
