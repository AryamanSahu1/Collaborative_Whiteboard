import socket from "../socket";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Board from "../components/Board";
import Toolbar from "../components/Toolbar";
import Toolbox from "../components/Toolbox";

import BoardProvider from "../store/BoardProvider";
import ToolboxProvider from "../store/ToolboxProvider";

import getStroke from "perfect-freehand";
import { getSvgPathFromStroke } from "../utils/element";

export default function Canvas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  socket.connect();

  socket.off("loadCanvas");
  socket.off("canvasError");

  socket.on("loadCanvas", (data) => {
    data.elements = (data.elements || []).map((element) => {
      if (element.type === "BRUSH" && element.points?.length) {
        return {
          ...element,
          path: new Path2D(
            getSvgPathFromStroke(
              getStroke(element.points)
            )
          ),
        };
      }

      return element;
    });
    socket.on("canvasError", (error) => {
      alert(error.message);
      navigate("/profile");
    });

    setCanvas(data);
  });

  socket.emit("joinCanvas", {
    canvasId: id,
    token,
  });

  return () => {
    socket.emit("leaveCanvas", id);
    socket.off("loadCanvas");
    socket.off("canvasError");
    socket.disconnect();
  };
}, [id, navigate]);

  if (!canvas) {
    return <h2>Loading Canvas...</h2>;
  }

  return (
    <BoardProvider canvas={canvas}>
      <ToolboxProvider>
        <div
          style={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1000,
            background: "white",
            padding: "10px 15px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <strong>{canvas.name}</strong>
        </div>

        <Toolbar />
        <Board />
        <Toolbox />
      </ToolboxProvider>
    </BoardProvider>
  );
}