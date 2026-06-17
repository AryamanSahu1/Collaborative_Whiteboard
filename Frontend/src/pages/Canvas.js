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
    const loadCanvas = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await fetch(
          `http://localhost:3030/api/canvas/load/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }
        data.elements = data.elements.map((element) => {
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

        console.log("Loaded canvas:", data);
        console.log("Loaded elements:", data.elements);
        setCanvas(data);
      } catch (error) {
        console.error(error);
        navigate("/profile");
      }
    };

    loadCanvas();
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