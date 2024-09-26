import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("Created New Room");
  };

  const joinRoom = () => {
    if (!roomId || !userName) {
      toast.error("ROOM ID & username is required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{ success: { theme: { primary: "#4aed88" } } }}
        ></Toaster>
      </div>
      <div className="homePageWrapper">
        <div className="formWrapper">
          <img
            className="homePageLogo"
            src="/logo.png"
            alt="code-sync-logo"
          />
          <h4 className="mainLabel">Paste Invitation ROOM ID</h4>
          <div className="inputGroup">
            <input
              type="text"
              placeholder="ROOM ID"
              className="inputBox"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyUp={handleInputEnter}
            />
            <input
              type="text"
              placeholder="USER NAME"
              className="inputBox"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyUp={handleInputEnter}
            />
            <button className="btn joinBtn" onClick={joinRoom}>
              Join
            </button>
            <span className="createInfo">
              If you don&apos;t have an invite create &nbsp;
              <a
                onClick={createNewRoom}
                href="/code-sync.png"
                className="createNewBtn"
              >
                new room
              </a>
            </span>
          </div>
        </div>
        <footer>
          <h4>
            Built with 💛 by {"  "}{" "}
            <a href="https://github.com/DeekshaDewangan">Deeksha Dewangan</a>
          </h4>
        </footer>
      </div>
    </>
  );
};

export default Home;
