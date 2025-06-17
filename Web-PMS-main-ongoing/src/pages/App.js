import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../utils/AuthProvider";
import logo from "./HSkyOps.png";

function App() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const disableBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    disableBack();
    window.addEventListener("popstate", disableBack);

    return () => {
      window.removeEventListener("popstate", disableBack);
    };
  }, []);

  const handleValidation = () => {
    let formIsValid = true;
    return formIsValid;
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    if (!handleValidation()) return;

    try {
      const response = await fetch("http://103.163.184.111:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoginError(errorData.message || "Invalid email or password");
        return;
      }

      const data = await response.json();
      // Decode token untuk dapatkan email
      const decoded = JSON.parse(atob(data.token.split(".")[1]));
      console.log("Decoded token:", decoded); // Debugging

      // Simpan email ke localStorage
      localStorage.setItem("email", decoded.email);
      console.log("email: ", decoded.email);

      login(data.token);
      localStorage.setItem("token", data.token);

      // Remove specified items from localStorage
      localStorage.removeItem("city");
      localStorage.removeItem("projectCode");
      localStorage.removeItem("projectObjective");
      localStorage.removeItem("selectedOption");
      localStorage.removeItem("selectedCity");
      localStorage.removeItem("projectTableData");
      localStorage.removeItem("personnelList");
      localStorage.removeItem("equipmentList");
      localStorage.removeItem("permissionList");
      localStorage.removeItem("uploadedFileName");

      navigate(data.redirect || "/Homepage");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="containerlogin">
      <div className="d-flex">
        <div className="login-card">
          <div className="card-body">
            <div className="logo-container text-center">
              <img
                src={logo}
                alt="logo"
                className="logo img-fluid d-block mx-auto"
              />
            </div>
            <form id="loginform" onSubmit={loginSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control mt-0"
                  placeholder="Enter email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  aria-describedby="email-error"
                />
                {emailError && (
                  <small id="email-error" className="form-text text-danger">
                    {emailError}
                  </small>
                )}
              </div>
              <div className="form-group mt-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control mt-0"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="position-absolute"
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {loginError && (
                <div className="text-danger mt-2">{loginError}</div>
              )}

              <div className="d-flex justify-content-left">
                <a href="/ForgotPassword" className="forgot-button mt-1">
                  Forgot Password?
                </a>
              </div>

              <div className="form-group d-flex justify-content-center">
                <button
                  type="submit"
                  className="submit-button btn btn-primary mt-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;