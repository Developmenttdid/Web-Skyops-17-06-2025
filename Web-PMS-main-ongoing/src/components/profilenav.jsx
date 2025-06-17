import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ProfileNav = () => {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("/profile1.png");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const name = localStorage.getItem("name");
    setUsername(name);

    const fetchProfileImage = async () => {
      try {
        const response = await fetch(
          `http://103.163.184.111:3000/profile-image?email=${encodeURIComponent(email)}&t=${Date.now()}`
        );
        const data = await response.json();
        
        if (data.exists && data.imageUrl) {
          setProfileImage(`http://103.163.184.111:3000${data.imageUrl}?t=${Date.now()}`);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, [email]);

  return (
    <div
      className="nav-container d-flex flex-column flex-shrink-0 p-3 text-white"
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)"
      }}
    >
      <div className="text-center mb-3">
        <img
          src={profileImage}
          alt="Profile"
          className="rounded-circle"
          width="150"
          height="150"
          onError={(e) => {
            e.target.src = "/profile1.png";
          }}
        />
        <h5
          className="mt-4"
          style={{ color: "#0F0F56", fontWeight: "bold", fontSize: "1.5rem" }}
        >
          {username}
        </h5>
      </div>
      <hr className="w-100" />
      <ul className="nav nav-pills flex-column w-100">
        <li className="nav-item">
          <a
            href="/Profile/AccountDetails"
            className={`nav-link ${
              location.pathname === "/Profile/AccountDetails" ? "active" : ""
            }`}
          >
            Account Details
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/Profile/ChangePassword"
            className={`nav-link ${
              location.pathname === "/Profile/ChangePassword" ? "active" : ""
            }`}
          >
            Change Password
          </a>
        </li>
        <li className="nav-item">
          <a 
            href="/" 
            className="nav-link" 
            style={{ color: "#dc3545" }}
            onClick={(e) => {
              e.preventDefault();
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ProfileNav;
