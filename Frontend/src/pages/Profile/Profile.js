import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

import { updateCanvas,deleteCanvas,shareCanvas } from "../../utils/api";
export default function Profile() {
  const [user, setUser] = useState(null);
  const [canvases, setCanvases] = useState([]);
  const [newCanvasName, setNewCanvasName] = useState("");
  const [createError, setCreateError] = useState("");

  const [shareCanvasId, setShareCanvasId] = useState(null);

  const [shareEmail, setShareEmail] = useState("");

  const [shareSuccess, setShareSuccess] = useState("");

  const [shareError, setShareError] = useState("");

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
        setCreateError("Please enter a canvas name");
        return;
      }
      setCreateError("");

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
      if (!shareEmail.trim()) {
        setShareError("Please enter an email");
        return;
      }

      await shareCanvas(canvasId, shareEmail);

      setShareEmail("");
      setShareError("");

      setShareSuccess("Shared Successfully");

      setTimeout(() => {
        setShareSuccess("");
        setShareCanvasId(null);
      }, 1500);

    } catch (error) {
      setShareError(error.message);
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="profile-page">
      <div className="background-blur blur-1"></div>
      <div className="background-blur blur-2"></div>
      <div className="profile-container">
        <div className="profile-hero">
          <h1 className="profile-title">
            Hello {user.name}
          </h1>

          <div className="profile-divider"></div>

          <p className="profile-subtitle">
            Ready to bring your ideas to life?
          </p>
        </div>
        {/* Header */}
        <div className="profile-header">
          <h2 className="section-title">
            Your Canvases
          </h2>

          <div>
          <div className="create-section">
              <input
                type="text"
                placeholder="Canvas Name"
                value={newCanvasName}
                onChange={(e) => setNewCanvasName(e.target.value)}
                className="canvas-input"
              />

              <button
                onClick={createCanvas}
                className="create-btn"
              >
                + Create Canvas
              </button>
            </div>

            {createError && (
              <p className="error-message">
                {createError}
              </p>
            )}
          </div>
        </div>

        {/* Canvas Grid */}
        {canvases.length === 0 ? (
          <div className="empty-state">
            No canvases found.
          </div>
        ) : (
          <div className="canvas-grid">
            {canvases.map((canvas) => (
              <div
                key={canvas._id}
                className="canvas-card"
              >
                <h3 className="canvas-title">
                  {canvas.name}
                </h3>

                <p className="canvas-info">
                  Elements: {canvas.elements.length}
                </p>

                <p className="canvas-info">
                  Shared With: {canvas.shared_with.length}
                </p>

                <div className="canvas-dates">
                  <p className="canvas-date">
                    Created:
                    {" "}
                    {new Date(
                      canvas.createdAt
                    ).toLocaleString()}
                  </p>

                  <p className="canvas-date">
                    Updated:
                    {" "}
                    {new Date(
                      canvas.updatedAt
                    ).toLocaleString()}
                  </p>
                </div>
                <>
                  <div className="canvas-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/canvas/${canvas._id}`);
                  }}
                  className="open-btn"
                >
                  Open Canvas
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    if (shareCanvasId === canvas._id) {
                      setShareCanvasId(null);
                    } else {
                      setShareCanvasId(canvas._id);
                      setShareEmail("");
                      setShareError("");
                    }
                  }}
                  className="share-btn"
                >
                  Share
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCanvas(canvas._id);
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
                  </div>

                  {shareCanvasId === canvas._id && (
                    <div className="share-panel">

                      <input
                        type="email"
                        placeholder="Enter email"
                        value={shareEmail}
                        onChange={(e) =>
                          setShareEmail(e.target.value)
                        }
                        className="share-input"
                      />

                      <button
                        className="share-confirm-btn"
                        onClick={() =>
                          handleShareCanvas(canvas._id)
                        }
                      >
                        Send
                      </button>

                      {shareError && (
                        <p className="error-message">
                          {shareError}
                        </p>
                      )}

                      {shareSuccess && (
                        <p className="success-message">
                          {shareSuccess}
                        </p>
                      )}

                    </div>
                  )}
                </>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}