import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Project.css";
import Pagination from "react-bootstrap/Pagination";

function Project() {
  const [projectData, setProjectData] = useState([]);
  const [position, setPosition] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const email = localStorage.getItem("email");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  document.body.style.overflowY = "auto";
  document.body.style.overflowX = "hidden";

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const clearLocalStorage = () => {
    const itemsToRemove = [
      'equipmentList',
      'EquipmentName',
      'personnelKey',
      'personnelList',
      'projectCode',
      'selectedOption',
      'selectedCity'
    ];
    
    itemsToRemove.forEach(item => {
      localStorage.removeItem(item);
    });
  };

  // Handle search
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(projectData);
      setCurrentPage(1);
    } else {
      const filtered = projectData.filter(
        (project) =>
          (project.code && project.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (project.location && project.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (project.date && project.date.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredData(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, projectData]);

  useEffect(() => {
    const fetchUserPosition = async () => {
      try {
        const response = await fetch("http://103.163.184.111:3000/users");
        const users = await response.json();
        const loggedInUser = users.find((user) => user.email === email);
        if (loggedInUser) {
          setPosition(loggedInUser.position);
        }
      } catch (error) {
        console.error("Error fetching user position:", error);
      }
    };
    fetchUserPosition();
  }, [email]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(
          "http://103.163.184.111:3000/projectstatus"
        );
        const data = await response.json();
        const filteredData = data
          .filter((project) => project.email === email)
          .map((project) => ({
            id: project.id,
            code: project.project_code,
            location: project.city,
            date: new Date(project.created_at).toISOString().split("T")[0],
            progress: 50,
          }));
        setProjectData(filteredData);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    fetchProjectData();
  }, [email]);

  // Pagination logic (pakai filteredData!)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const totalItems = filteredData.length;

  // Calculate showing range
  const showingFrom = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const showingTo = Math.min(indexOfLastItem, totalItems);

  const handleDelete = async (projectCode) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus proyek ${projectCode}?`)) {
      return;
    }

    try {
      const response = await fetch("http://103.163.184.111:3000/projectstatus");
      const projects = await response.json();
      const projectToDelete = projects.find((p) => p.project_code === projectCode);

      if (!projectToDelete) {
        alert("Proyek tidak ditemukan di database.");
        return;
      }

      const projectId = projectToDelete.id;
      const deleteResponse = await fetch(
        `http://103.163.184.111:3000/projectstatus/${projectId}`,
        { method: "DELETE" }
      );

      if (!deleteResponse.ok) throw new Error("Gagal menghapus proyek dari database.");

      setProjectData((prevData) => prevData.filter((p) => p.id !== projectId));
      alert("Proyek berhasil dihapus!");
    } catch (error) {
      console.error("Error saat menghapus proyek:", error);
      alert("Terjadi kesalahan saat menghapus proyek.");
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid">
   

      {/* <div className="row d-flex justify-content-center align-items-center mb-2 mt-2 text-center">
        <div className="col ms-3">
          <h2>Project List</h2>
        </div>
      </div> */}

      <div className="row d-flex justify-content-center align-items-center mb-2 ms-2 mt-2">
  <div className="col">
    <h2 className="fw-bold" style={{color: '#34495e', position: 'relative', display: 'inline-block'}}>
      Project List
      {/* <span style={{
        position: 'absolute',
        bottom: '-10px',
        left: '0',
        width: '100%',
        height: '4px',
        background: 'linear-gradient(90deg, #3498db, #9b59b6)',
        borderRadius: '2px'
      }}></span> */}
    </h2>
  </div>
</div>

      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group ms-3">
            <span className="input-group-text bg-primary text-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Project Code, Location, or Date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <Link to="/Project/ProjectStatus">
            <button
              type="button"
              className="button-add btn btn-success mb-3 me-3"
              disabled={position !== "Project Manager" && position !== "Admin"}
              onClick={clearLocalStorage}
            >
              <i className="bi bi-plus"></i> Add Project
            </button>
          </Link>
        </div>
      </div>

      <div className="container-fluid">
        <table className="table text-center table-bordered">
          <thead>
            <tr>
              <th style={{ width: "5%", backgroundColor: "#143893", color: "#CCE6FF" }}>#</th>
              <th style={{ backgroundColor: "#143893", color: "#CCE6FF" }}>Project Code</th>
              <th style={{ backgroundColor: "#143893", color: "#CCE6FF" }}>Location</th>
              <th style={{ backgroundColor: "#143893", color: "#CCE6FF" }}>Date Created</th>
              <th style={{ backgroundColor: "#143893", color: "#CCE6FF" }}>Last Update</th>
              <th style={{ backgroundColor: "#143893", color: "#CCE6FF" }}>Progress</th>
              <th style={{ backgroundColor: "#143893", color: "#CCE6FF" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((project, index) => (
                <tr key={project.id}>
                  <th>{indexOfFirstItem + index + 1}</th>
                  <td>{project.code}</td>
                  <td>{project.location}</td>
                  <td>{project.date}</td>
                  <td>{project.date}</td>
                  <td>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    {project.progress}%
                  </td>
                  <td>
                    <div className="d-flex justify-content-evenly">
                      <button
                        type="button"
                        className="btn btn-danger btn-outline-light"
                        disabled={position !== "Project Manager" && position !== "Admin"}
                        style={{
                          opacity: position !== "Project Manager" && position !== "Admin" ? 0.5 : 1,
                          cursor: position !== "Project Manager" && position !== "Admin" ? "not-allowed" : "pointer",
                        }}
                        onClick={() => handleDelete(project.code)}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                      <Link to={`/Project/projectstatus_db?project_code=${encodeURIComponent(project.code)}`}>
                        <button
                          type="button"
                          className="btn btn-warning btn-outline-light"
                          disabled={position !== "Project Manager" && position !== "Admin"}
                          style={{
                            opacity: position !== "Project Manager" && position !== "Admin" ? 0.5 : 1,
                            cursor: position !== "Project Manager" && position !== "Admin" ? "not-allowed" : "pointer",
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            Showing {showingFrom} to {showingTo} of {totalItems} entries
          </div>
          <Pagination>
            <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => paginate(number)}
              >
                {number}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default Project;