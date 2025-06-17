import React from "react";

const logbookData = [
  { id: 1, date: "2025-01-02", code: "PRJ-CONTOH-01", location: "Bandung" },
  { id: 2, date: "2025-01-03", code: "PRJ-CONTOH-02", location: "Bandung" },
];

function UAVLogbook() {
  return (
    <div className="container-fluid">
      <h3 className="mt-3 ms-2">UAV Logbook</h3>
      <table className="table text-center table-bordered" style={{ borderColor: '#143893' }}>
        <thead>
          <tr>
            <th scope="col" style={{ width: "5%", backgroundColor: '#143893', color: '#CCE6FF' }}>
              #
            </th>
            <th scope="col" style={{ width: "25%", backgroundColor: '#143893', color: '#CCE6FF' }}>
              Date
            </th>
            <th scope="col" style={{ width: "30%", backgroundColor: '#143893', color: '#CCE6FF' }}>
              Project Code
            </th>
            <th scope="col" style={{ width: "25%", backgroundColor: '#143893', color: '#CCE6FF' }}>
              Location
            </th>
            <th scope="col" style={{ width: "15%", backgroundColor: '#143893', color: '#CCE6FF' }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {logbookData.map((logbook) => (
            <tr key={logbook.id}>
              <th scope="row">{logbook.id}</th>
              <td>{logbook.date}</td>
              <td>{logbook.code}</td>
              <td>{logbook.location}</td>
              <td>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-warning btn-outline-light me-3"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-outline-light"
                  >
                    <i className="bi bi-download"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UAVLogbook;

