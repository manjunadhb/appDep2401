import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TopNavigation from "./TopNavigation";
import { useNavigate } from "react-router-dom";

function Home() {
  let navigate = useNavigate();

  let dispatch = useDispatch();

  let storeObj = useSelector((store) => {
    console.log(store);
    return store;
  });

  let deleteProfileFromServer = async () => {
    let dataToSend = new FormData();
    dataToSend.append("email", storeObj.loginReducer.loginDetails.email);

    let reqOptions = {
      method: "DELETE",
      body: dataToSend,
    };

    let JSONData = await fetch(
      "/deleteProfile",
      reqOptions
    );

    let JSOData = await JSONData.json();

    alert(JSOData.msg);

    if (JSOData.status == "success") {
      navigate("/");
    }

    console.log(JSOData);
  };

  return (
    <div>
      <TopNavigation />
      <h1>Home</h1>
      <h2>
        Welcome {storeObj.loginReducer.loginDetails.firstName}{" "}
        {storeObj.loginReducer.loginDetails.lastName}
      </h2>
      <img
        src={`/${storeObj.loginReducer.loginDetails.profilePic}`}
      ></img>
      <div>
        <button
          onClick={() => {
            deleteProfileFromServer();
          }}
        >
          Delete Profile
        </button>
        <button
          onClick={() => {
            dispatch({ type: "applyLeave", data: "some vacation" });
          }}
        >
          Apply Leave
        </button>
      </div>
    </div>
  );
}

export default Home;
