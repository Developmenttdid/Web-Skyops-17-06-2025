import React, { useState, useEffect } from "react";
import "./Profile.css";

function Profile() {
  const email = localStorage.getItem("email");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://103.163.184.111:3000/users`)
      .then((res) => res.json())
      .then((data) => {
        const foundUser = data.find((u) => u.email === email) || null;
        setUser(foundUser);
        if (foundUser) {
          localStorage.setItem("name", foundUser.name);
          localStorage.setItem("department", foundUser.department);
        }
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, [email]);

  if (!user) return <p>Loading user data...</p>;

  return (
    <div className="profile-details ms-0 p-2">
      <h2 className="profile-container mb-4">Account Details</h2>
      <div className="col mb-3 ms-3">
        <label className="form-label">Name</label>
        <input type="text" className="form-control" value={user.name} readOnly />
      </div>
      <div className="col mb-3 ms-3">
        <label className="form-label">Email Address</label>
        <input type="text" className="form-control" value={email} readOnly />
      </div>
      <div className="col mb-3 ms-3">
        <label className="form-label">Department</label>
        <input type="text" className="form-control" value={user.role} readOnly />
      </div>
      <div className="col mb-3 ms-3">
        <label className="form-label">Position</label>
        <input type="text" className="form-control" value={user.department}  readOnly />
      </div>
      <div className="col mb-3 ms-3">
        <label className="form-label">User Type</label>
        <input type="text" className="form-control" value={user.position} readOnly />
      </div>
    </div>
  );
}

export default Profile;