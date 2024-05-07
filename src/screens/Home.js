import { Avatar, Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../api/action";
import { socket, url } from "../helpers/apiHelpers";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const _id = localStorage.getItem("_id");

  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.post(`${url}/get-user`, {
          _id,
        });

        const data = response.data;

        dispatch(addUser(data.user));

        if (data.user?.isInGame) {
          socket.emit("reconnection", { roomId: data.user.activeGameRoomId });
        }
      } catch (e) {
        console.log("Error while fetching user details", e.message);
      }
    };
    getUserDetails();
  }, [dispatch, _id]);

  const logout = () => {
    localStorage.removeItem("_id");
    navigate("/");
    window.location.reload();
  };

  const joinChessRoom = (min) => {
    socket.emit("join_room", {
      username: user?.username,
      min: min,
    });

    navigate(`/waiting`);
  };

  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true);
    }, 500);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <div style={rootDiv}>
        <div style={headerStyle}>
          <div style={avatarContainer}>
            <Avatar sx={{ bgcolor: "#07C058" }}>
              {user?.username && user?.username[0]}
            </Avatar>
            <Typography variant="h5" style={{ marginLeft: 10, fontFamily: "'Jersey 20', sans-serif", color: "#333" }}>
              {user?.username}
            </Typography>
          </div>
          <img src={"./a23-games-logo.svg"} alt="" style={{ height: 100, width: 300,  }} />

          <Button onClick={logout} variant="contained" style={logoutButtonStyle}>
            Logout
          </Button>
        </div>

        <div style={{ padding: 20 }}>
          <Typography variant="h4" style={{ fontFamily: "'Jersey 20', sans-serif", color: "#333", marginBottom: 10 }}>
            Play
          </Typography>
          <div style={buttonContainer}>
            {showButtons && (
              <>
                <Button onClick={() => joinChessRoom(3)} variant="contained" style={timeButton}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold", color: "#fff" }}>3 min</Typography>
                </Button>
                <Button onClick={() => joinChessRoom(5)} variant="contained" style={timeButton}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold", color: "#fff" }}>5 min</Typography>
                </Button>
                <Button onClick={() => joinChessRoom(10)} variant="contained" style={timeButton}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold", color: "#fff" }}>10 min</Typography>
                </Button>
                <Button onClick={() => joinChessRoom(15)} variant="contained" style={timeButton}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold", color: "#fff" }}>15 min</Typography>
                </Button>
                <Button onClick={() => joinChessRoom(30)} variant="contained" style={timeButton}>
                  <Typography variant="subtitle1" style={{ fontWeight: "bold", color: "#fff" }}>30 min</Typography>
                </Button>
              </>
            )}
          </div>
          <Typography variant="h4" style={{ fontFamily: "'Jersey 20', sans-serif", color: "#333", marginBottom: 10 }}>
            Other
          </Typography>
          <div style={buttonContainer}>
            <Button variant="contained" style={otherButton}>
              <Typography variant="subtitle1" style={{ fontWeight: "bold", color: "#fff" }}>Custom Game</Typography>
            </Button>
            <Button variant="contained" style={otherButton}>
              <Typography variant="subtitle1" style={{ fontWeight: "bold", color: "#fff" }}>Play Friend</Typography>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const rootDiv = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#f5f5f5",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 40px",
  backgroundColor: "#ffffff",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
};

const avatarContainer = {
  display: "flex",
  alignItems: "center",
};



const logoStyle = {
  height: 40,
};

const logoutButtonStyle = {
  fontWeight: "bold",
  backgroundColor: "#f44336",
  color: "#fff",
  borderRadius: "50%", // Set the border radius to make it round
  width: 60, // Set width and height to make it a circle
  height: 60, 
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "none", // Remove border
  cursor: "pointer",
  outline: "none", // Remove outline
  transition: "background-color 0.3s ease", // Add transition for smoother hover effect
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Add subtle shadow for depth
  fontFamily: "'Jersey 20', sans-serif", // Apply custom font
  fontSize: 18, // Adjust font size
};

// Add hover effect
logoutButtonStyle["&:hover"] = {
  backgroundColor: "#d32f2f",
};


const buttonContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const timeButton = {
  backgroundColor: "#007bff",
  color: "#fff",
  fontWeight: "bold",
  minWidth: 120,
  minHeight: 60,
  fontSize: 18,
};

const otherButton = {
  backgroundColor: "#28a745",
  color: "#fff",
  fontWeight: "bold",
  minWidth: 180,
  minHeight: 60,
  fontSize: 18,
};
