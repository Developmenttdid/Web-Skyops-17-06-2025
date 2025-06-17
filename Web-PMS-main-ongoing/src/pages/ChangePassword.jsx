import React, { useState } from "react";
import "./ChangePassword.css";

function ChangePassword() {
  const [email, setEmail] = useState(""); 
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      const response = await fetch("http://103.163.184.111:3000/change-password", {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email, 
          old_password: oldPassword, 
          new_password: newPassword, 
          confirm_new_password: confirmPassword, 
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Password changed successfully");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="change-password ms-0 p-2">
      <h2 className="profile-container mb-4">Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="col mb-3 ms-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col mb-3 ms-3">
          <label className="form-label">Old Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Input old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="col mb-3 ms-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Input new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="col mb-3 ms-3">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="justify-content-center d-flex">
          <button type="submit" className="button-add btn btn-primary mb-3 me-1 mt-3">
            Save Change
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
