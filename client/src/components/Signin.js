import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      //sendTokenToServer();
    }
  }, []);

  let sendTokenToServer = async () => {
    let dataToSend = new FormData();
    dataToSend.append("token", localStorage.getItem("token"));

    let reqOptions = {
      method: "POST",
      body: dataToSend,
    };

    let JSONData = await fetch("/validateToken", reqOptions);

    let JSOData = await JSONData.json();

    if (JSOData.status == "failure") {
      alert(JSOData.msg);
    } else {
      dispatch({ type: "login", data: JSOData.data });
      navigate("/home");
    }
    console.log(JSOData);
  };

  let onSignin = async () => {
    let dataToSend = new FormData();

    dataToSend.append("email", emailInputRef.current.value);

    dataToSend.append("password", passwordInputRef.current.value);

    let reqOptions = {
      method: "POST",
      body: dataToSend,
    };

    let JSONData = await fetch("/signin", reqOptions);

    let JSOData = await JSONData.json();

    if (JSOData.status == "failure") {
      alert(JSOData.msg);
    } else {
      localStorage.setItem("token", JSOData.data.token);
      dispatch({ type: "login", data: JSOData.data });
      navigate("/home");
    }
    console.log(JSOData);
  };

  let signin2 = () => {
    return async () => {
      let dataToSend = new FormData();

      dataToSend.append("email", emailInputRef.current.value);

      dataToSend.append("password", passwordInputRef.current.value);

      let reqOptions = {
        method: "POST",
        body: dataToSend,
      };

      let JSONData = await fetch("/signin", reqOptions);

      let JSOData = await JSONData.json();

      if (JSOData.status == "failure") {
        alert(JSOData.msg);
      } else {
        localStorage.setItem("token", JSOData.data.token);
        dispatch({ type: "login", data: JSOData.data });
        navigate("/home");
      }
      console.log(JSOData);
    };
  };

  return (
    <div className="App">
      <form>
        <h2>Sign In</h2>

        <div>
          <label>Email</label>
          <input ref={emailInputRef}></input>
        </div>
        <div>
          <label>Password</label>
          <input ref={passwordInputRef}></input>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              dispatch(signin2());
            }}
          >
            Sign In
          </button>
        </div>
      </form>
      <br></br>
      <br></br>
      <Link to="/signup">Signup</Link>
    </div>
  );
}

export default SignIn;
