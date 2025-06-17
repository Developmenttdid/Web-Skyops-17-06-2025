import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../utils/AuthProvider";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = () => {
    console.log("User signed out");
    logout();
    navigate("/");
  };

  const getLinkClass = (path) =>
    location.pathname === path ? "fw-bold text-primary" : "text-white";

  const isFlightDatabaseActive = location.pathname.startsWith("/FlightDatabase");
  const isCompanyActive = location.pathname.startsWith("/Company");

  const [profileImage, setProfileImage] = useState(process.env.PUBLIC_URL + "/profile1.png");
  const email = localStorage.getItem("email");

  useEffect(() => {
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
    <header
      className="p-1 border-bottom"
      style={{
        backgroundColor: "#0F0F56",
        top: 0,
        left: "0",
        zIndex: 1000,
        width: "100vw",
        position: "sticky",
      }}
    >
      <div className="container-fluid">
        <div className="row d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <div className="col-lg-3 text-lg-start text-center">
            <Link to="/Homepage">
              <img
                src={process.env.PUBLIC_URL + "/HSkyOps-white.png"}
                className="img-fluid me-5 logo-image"
                height={100}
                width={100}
              />
            </Link>
          </div>

          <div className="col-lg-6">
            <nav className="navbar navbar-expand-lg">
              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <Link to="/Homepage" className={`nav-link px-3 ${getLinkClass("/Homepage")}`} style={{ fontSize: '0.9rem' }}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/Map" className={`nav-link px-3 ${getLinkClass("/Map")}`} style={{ fontSize: '0.9rem' }}>
                    Map
                  </Link>
                </li>
                <li>
                  <Link to="/Project" className={`nav-link px-3 ${getLinkClass("/Project")}`} style={{ fontSize: '0.9rem' }}>
                    Projects
                  </Link>
                </li>
                <li>
                  <div className="container-fluid">
                    <div id="navbarNavDarkDropdown">
                      <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                          <button
                            className={`btn dropdown-toggle ${isCompanyActive ? "fw-bold text-primary" : "text-white"}`}
                            style={{ marginTop: "2px", fontSize: "0.9rem" }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Company
                          </button>
                          <ul className="dropdown-menu dropdown-menu-dark">
                            <li>
                              <Link to="/Company/Equipment" className={`dropdown-item ${getLinkClass("/Company/Equipment")}`}>
                                Equipment
                              </Link>
                            </li>
                            <li>
                              <Link to="/Company/Personnel" className={`dropdown-item ${getLinkClass("/Company/Personnel")}`}>
                                Personnel
                              </Link>
                            </li>
                            <li>
                              <Link to="/Company/ProjectStatus" className={`dropdown-item ${getLinkClass("/Company/ProjectStatus")}`}>
                                Project Status
                              </Link>
                            </li>
                            <li>
                              <Link to="/Company/OperationManual" className={`dropdown-item ${getLinkClass("/Company/OperationManual")}`}>
                                Operation Manual
                              </Link>
                            </li>
                            <li>
                              <Link to="/Company/SOP" className={`dropdown-item ${getLinkClass("/Company/SOP")}`}>
                                SOP
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="container-fluid">
                    <div id="navbarNavDarkDropdown">
                      <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                          <button
                            className={`btn dropdown-toggle ${isFlightDatabaseActive ? "fw-bold text-primary" : "text-white"}`}
                            style={{ marginTop: "2px", fontSize: '0.9rem' }}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Flight Database
                          </button>
                          <ul className="dropdown-menu dropdown-menu-dark">
                            <li>
                              <Link to="/FlightDatabase" className={`dropdown-item ${getLinkClass("/FlightDatabase")}`}>
                                Checklist Database
                              </Link>
                            </li>
                            <li>
                              <Link to="/FlightDatabase/ProjectLogbook" className={`dropdown-item ${getLinkClass("/FlightDatabase/ProjectLogbook")}`}>
                                Project Logbook
                              </Link>
                            </li>
                            <li>
                              <Link to="/FlightDatabase/UAVLogbook" className={`dropdown-item ${getLinkClass("/FlightDatabase/UAVLogbook")}`}>
                                UAV Logbook
                              </Link>
                            </li>
                            <li>
                              <Link to="/FlightDatabase/FlightRecord" className={`dropdown-item ${getLinkClass("/FlightDatabase/FlightRecord")}`}>
                                Flight Record
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          <div className="col-lg-3 d-flex justify-content-lg-end justify-content-center">
            <div className="dropdown text-end text-white me-4">
              <a
                href="#"
                className="d-block link-body-emphasis text-decoration-none dropdown-toggle text-white"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  width="32"
                  height="32"
                  className="rounded-circle border border-2 border-white"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = process.env.PUBLIC_URL + "/profile1.png";
                  }}
                />
              </a>
              <ul className="dropdown-menu text-small">
                <li>
                  <Link to="/Profile/AccountDetails" className="dropdown-item"> 
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/Profile/Notification" className="dropdown-item">
                    Notification
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link to="/" className="dropdown-item" onClick={handleSignOut}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
