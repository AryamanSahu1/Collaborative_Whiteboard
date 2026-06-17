import axios from "axios";

const API_BASE_URL = "http://localhost:3030/api/canvas"; 

const token = localStorage.getItem('token')
const canvasId = localStorage.getItem('canvas_id')

const updateCanvas = async (canvasId, elements) => {
  try{
    const token=localStorage.getItem('token');
    if(!token){
        throw new Error('Unauthorized');
    }
    const response=await fetch(`${API_BASE_URL}/${canvasId}`,{
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({elements}),
    });

    const data=await response.json();

    if(!response.ok){
        throw new Error(data.message || 'Failed to update canvas');
    }

    return data;
  }catch(error){
    throw new Error(error.message || 'Failed to update canvas');
  }

};

const deleteCanvas = async (canvasId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:3030/api/canvas/${canvasId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

//share canvas with user using email
const shareCanvas = async (canvasId, sharedWithEmail) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:3030/api/canvas/share/${canvasId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sharedwithEmail: sharedWithEmail,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export {updateCanvas,deleteCanvas,shareCanvas};