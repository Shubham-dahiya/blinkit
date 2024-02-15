// import React, { useEffect, useState } from 'react'
// import "../styles/Dashboard.css";
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const Dashboard = () => {
//   const [ token, setToken ] = useState(JSON.parse(localStorage.getItem("auth")) || "");
//   const [ data, setData ] = useState({});
//   const navigate = useNavigate();

//   const fetchLuckyNumber = async () => {

//     let axiosConfig = {
//       headers: {
//         'Authorization': `Bearer ${token}`
//     }
//     };

//     try {
//       const response = await axios.get("http://localhost:3000/api/v1/dashboard", axiosConfig);
//       setData({ msg: response.data.msg, luckyNumber: response.data.secret });
//     } catch (error) {
//       toast.error(error.message);
//     }
//   }


  
//   useEffect(() => {
//     fetchLuckyNumber();
//     if(token === ""){
//       navigate("/login");
//       toast.warn("Please login first to access dashboard");
//     }
//   }, [token]);

//   return (
//     <div className='dashboard-main'>
//       <h1>Dashboard</h1>
//       <p>Hi { data.msg }! { data.luckyNumber }</p>
//       <Link to="/logout" className="logout-button">Logout</Link>
//     </div>
//   )
// }

// export default Dashboard
import React, { useEffect, useState } from 'react';
import "../styles/Dashboard.css";
import Card from './Card';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [data, setData] = useState({});
  const [image, setImage] = useState("");
  const [images, setImages] = useState([""]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/images`); // Using BACKEND_URL constant
        console.log(response);
        setImages(response.data.images); // Assuming response.data is an array of image URLs
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [image]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/images`); // Using BACKEND_URL constant
        console.log(response);
        setImages(response.data.images); // Assuming response.data is an array of image URLs
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [image]);
  const fetchUserData = async () => {
    let axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.post(`http://localhost:3000/api/v1/dashboard`, axiosConfig); // Using BACKEND_URL constant
      setData({ msg: response.data.msg, luckyNumber: response.data.secret });
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleImageUpload = async () => {
    if (!image) {
      return toast.error("Please select an image to upload");
    }

    let formData = new FormData();
    formData.append('image', image);

    let axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      await axios.post(`http://localhost:3000/api/v1/dashboard`, formData, axiosConfig); // Using BACKEND_URL constant
      toast.success("Image uploaded successfully");
      fetchUserData(); // Fetch user data after image upload
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  }

  useEffect(() => {
    fetchUserData();
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  return (
    <div className='dashboard-main'>
      <h1>Dashboard</h1>
      <p>Hi {data.msg}! {data.luckyNumber}</p>
      <div style = {{backgroundColor:'red'}}>
      <input type="file" onChange={handleImageChange} />
      </div>
      <button onClick={handleImageUpload}>Upload Image</button>
      <Link to="/logout" className="logout-button">Logout</Link>
      <h1>Image Gallery</h1>
      <div className="image-container">
        {images.map((imageUrl, index) => (
          <Card key={index} imageUrl={imageUrl} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard;
