import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { updateCanvas,deleteCanvas,shareCanvas } from "../utils/api";
export default function Profile() {
  const [user, setUser] = useState(null);
  const [canvases, setCanvases] = useState([]);
  const [newCanvasName, setNewCanvasName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        // Fetch user profile
        const profileResponse = await fetch(
          "http://localhost:3030/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profileData.message);
        }

        setUser(profileData.user);

        // Fetch canvases
        const canvasResponse = await fetch(
          "http://localhost:3030/api/canvas",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const canvasData = await canvasResponse.json();

        if (!canvasResponse.ok) {
          throw new Error(canvasData.message);
        }

        setCanvases(canvasData);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  const createCanvas = async () => {
    try {
      if (!newCanvasName.trim()) {
        alert("Please enter a canvas name");
        return;
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3030/api/canvas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newCanvasName,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCanvases((prev) => [...prev, data]);
      setNewCanvasName("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteCanvas = async (canvasId) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this canvas?"
      );

      if (!confirmed) return;

      await deleteCanvas(canvasId);

      setCanvases((prev) =>
        prev.filter((canvas) => canvas._id !== canvasId)
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleShareCanvas = async (canvasId) => {
    try {
      const email = window.prompt(
        "Enter email of user to share with:"
      );

      if (!email) return;

      await shareCanvas(canvasId, email);

      alert("Canvas shared successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Profile Card */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            marginBottom: "30px",
          }}
        >
          <h1>Hello {user.name}</h1>
          <p>{user.email}</p>
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Your Canvases</h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Canvas Name"
              value={newCanvasName}
              onChange={(e) => setNewCanvasName(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                minWidth: "220px",
              }}
            />

            <button
              onClick={createCanvas}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                background: "#22c55e",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              + Create Canvas
            </button>
          </div>
        </div>

        {/* Canvas Grid */}
        {canvases.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            No canvases found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {canvases.map((canvas) => (
              <div
                key={canvas._id}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "16px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
              >
                <h3>{canvas.name}</h3>

                <p
                  style={{
                    color: "#666",
                    marginTop: "10px",
                  }}
                >
                  Elements: {canvas.elements.length}
                </p>

                <p
                  style={{
                    color: "#666",
                  }}
                >
                  Shared With: {canvas.shared_with.length}
                </p>

                <p
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    marginTop: "15px",
                  }}
                >
                  Created:{" "}
                  {new Date(
                    canvas.createdAt
                  ).toLocaleDateString()}
                </p>
                <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  }}
>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/canvas/${canvas._id}`);
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Open Canvas
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareCanvas(canvas._id);
                  }}
                  style={{
                    width: "90px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#f59e0b",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Share
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCanvas(canvas._id);
                  }}
                  style={{
                    width: "90px",
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#dc2626",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Delete
                </button>
              </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}