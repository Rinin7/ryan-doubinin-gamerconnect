import React, { useState, useEffect } from "react";
import fire from "../config/Fire";
import Home from "../Pages/Home/Home";
import CreateActivity from "../Pages/CreateActivity/CreateActivity";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "../Pages/Login/Login";
import ViewActivity from "../Pages/ViewActivity/ViewActivity";

function App() {
  const [user, setUser] = useState(undefined);
  const [authListenerAdded, setAuthListenerAdded] = useState(false);

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        localStorage.setItem("isAuthenticated", "true");
        // console.log("localStorage", localStorage.getItem("isAuthenticated"));
        console.log({ user });
      } else {
        setUser(null);
        localStorage.removeItem("isAuthenticated");
      }
    });

    setAuthListenerAdded(true);
  };

  useEffect(() => {
    if (!authListenerAdded) {
      authListener();
    }

    // fire.auth().currentUser
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  function PrivateRoute({ component: Component, ...rest }) {
    return <Route {...rest} render={(props) => (localStorage.isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)} />;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path="/login" exact component={(routerProps) => <Login {...routerProps} user={user} handler={handleLogin} />} />
          <PrivateRoute path="/" exact component={(routerProps) => <Home {...routerProps} user={user} />} />
          <PrivateRoute path="/create" exact component={(routerProps) => <CreateActivity {...routerProps} user={user} />} />
          <PrivateRoute path="/activities/:id" exact component={(routerProps) => <ViewActivity {...routerProps} user={user} />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
