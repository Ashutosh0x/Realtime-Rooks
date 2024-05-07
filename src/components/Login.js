import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { addUser } from "../api/action";
import { url } from "../helpers/apiHelpers";
import AlertComponent from "./AlertComponent";

export default function Login(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = () => setOpen(false);

  const login = async () => {
    if (!username || !password) {
      setMessage("Please fill all details");
      setOpen(true);
      return;
    }

    try {
      const response = await axios.post(`${url}/login`, { username, password });
      const data = response.data;

      if (data.status === 200) {
        localStorage.setItem("_id", data.user._id);
        dispatch(addUser(data.user));
        navigate("/home");
      } else {
        setMessage(data.message);
        setOpen(true);
      }
    } catch (e) {
      setMessage("Error while logging in: " + e.message);
      setOpen(true);
    }
  };

  return (
    <div style={rootDiv}>
      <motion.div 
        style={loginDiv}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Realtime Chess</h2>
        <input
          style={inputStyle}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button style={loginButtonStyle} onClick={login}>Login</button>
        <h5 onClick={() => props.setIsLogin(!props.isLogin)} style={createNewAccountStyle}>
          Create new account
        </h5>
      </motion.div>
      <AlertComponent open={open} handleClose={handleClose} message={message} />
    </div>
  );
}

const rootDiv = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#e0e5ec",
};

const loginDiv = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: '320px',
  padding: '2rem',
  borderRadius: '15px',
  boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
  backgroundColor: "#e0e5ec",
};

const inputStyle = {
  width: "100%",
  padding: "10px 15px",
  marginBottom: "20px",
  borderRadius: "15px",
  border: "none",
  boxShadow: 'inset 6px 6px 6px #bebebe, inset -6px -6px 6px #ffffff',
  outline: "none",
};

const loginButtonStyle = {
  width: "100%",
  padding: "10px 15px",
  borderRadius: "15px",
  border: "none",
  color: "white",
  cursor: "pointer",
  backgroundColor: "#4CAF50",
  boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
};

const createNewAccountStyle = {
  marginTop: '1rem',
  fontWeight: 'bold',
  color: "#555555",
  cursor: "pointer",
};
