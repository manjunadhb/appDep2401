import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function TopNavigation() {
  let navigate = useNavigate();

  let storeObj = useSelector((store) => {
    return store;
  });

  useEffect(() => {
    if (
      storeObj &&
      storeObj.loginReducer.loginDetails &&
      storeObj.loginReducer.loginDetails.email
    ) {
    } else {
      navigate("/");
    }
  }, []);

  return (
    <nav>
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/tasks">Tasks</NavLink>
      <NavLink to="/editProfile">Edit Profile</NavLink>
      <NavLink to="/leaves">Leaves</NavLink>
      <NavLink
        to="/"
        onClick={() => {
          localStorage.clear();
        }}
      >
        Signout
      </NavLink>
    </nav>
  );
}

export default TopNavigation;
