import { API_URL } from "../config";



const updateCanvas = async (canvasId, elements) => {
  try{
    const token=localStorage.getItem('token');
    if(!token){
        throw new Error('Unauthorized');
    }
    const response=await fetch(`${API_URL}/api/canvas/${canvasId}`,{
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
    `${API_URL}/api/canvas/${canvasId}`,
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
    `${API_URL}/api/canvas/share/${canvasId}`,
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