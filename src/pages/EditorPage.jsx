import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import {
  useNavigate,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const handleErrors = (e) => {
      console.log("socket error", e);
      toast.error("Socket connection failed, try again later.");
      reactNavigator("/");
    };

    const init = async () => {
      try {
        socketRef.current = await initSocket();
        socketRef.current.on("connect_error", handleErrors);
        socketRef.current.on("connect_failed", handleErrors);

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          userName: location.state?.userName,
        });

        // Listening for joined event
        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, userName, socketId }) => {
            if (userName !== location.state?.userName) {
              toast.success(`${userName} joined the room.`);
            }
            setClients(clients);
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
          }
        );

        // Listening for disconnected event
        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
          toast.success(`${userName} left the room.`);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        });
      } catch (error) {
        console.error("Error initializing socket:", error);
        toast.error("An error occurred while initializing the socket.");
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off("connect_error", handleErrors);
        socketRef.current.off("connect_failed", handleErrors);
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, []);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  };

  const leaveRoom = () => {
    reactNavigator("/");
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <>
    <Toaster
          position="top-right"
          toastOptions={{ success: { theme: { primary: "#4aed88" } } }}
        ></Toaster>
      <div className="mainWrap">
        <div className="aside">
          <div className="asideInner">
            <div className="logo">
              <img className="logoImage" src="/logo.png" alt="logo" />
            </div>
            <h3>Connected</h3>
            <div className="clientsList">
              {clients.map((client) => (
                <Client key={client.socketId} userName={client.userName} />
              ))}
            </div>
          </div>
          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy ROOM ID
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            Leave
          </button>
        </div>
        <div className="editorWrap">
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default EditorPage;
