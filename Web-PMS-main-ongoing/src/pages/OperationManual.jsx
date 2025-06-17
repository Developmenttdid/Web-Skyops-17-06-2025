import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useState } from "react";

function OperationManual() {
  const [selectedTable, setSelectedTable] = useState("UAV");

  return (
    <div>
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center">Operation Manual</h2>
                </div>
            </div>
        </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            <label className="my-2">Select Table:</label>
            <select
              className="form-select"
              value={selectedTable}
              onChange={(e) => {
                setSelectedTable(e.target.value);
              }}
            >
              <option value="UAV">UAV</option>
              <option value="Payload">Payload</option>
              <option value="Geodetic GPS">Geodetic GPS</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-12">
            {/* Menampilkan tabel berdasarkan pilihan */}
            {selectedTable === "UAV" && <UAVTable />}
            {selectedTable === "Payload" && <PayloadTable />}
            {selectedTable === "Geodetic GPS" && <GeodeticGPSTable />}
          </div>
        </div>
      </div>
    </div>
  );
}

function UAVTable() {
  const UAVData = [
    {
      id: 1,
      equipment: "DJI PHANTOM 4 PRO",
      lastEdited: "03-03-2025",
    },
    {
      id: 2,
      equipment: "DJI PHANTOM 4 RTK",
      lastEdited: "03-03-2025",
    },
    {
      id: 3,
      equipment: "DJI INSPIRE 2",
      lastEdited: "03-03-2025",
    },
    {
      id: 1,
      equipment: "DJI M600",
      lastEdited: "03-03-2025",
    },
  ];
  return (
    <table className="table table-hover text-center">
      <thead style={{ width: "100%"}} >
        <tr>
          <th scope="col" style={{ width: "5%", backgroundColor: '#143893', color: '#CCE6FF' }}>
            #
          </th>
          <th scope="col" style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>
            Equipment
          </th>
          <th scope="col" style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>
            Last Edited
          </th>
          <th scope="col" style={{ width: "15%", backgroundColor: '#143893', color: '#CCE6FF'}}>
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {UAVData.map((data) => (
          <tr>
            <th scope="row">{data.id}</th>
            <td>{data.equipment}</td>
            <td>{data.lastEdited}</td>
            <td>
              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <button
                      type="button"
                      className="btn btn-warning btn-outline-light"
                    >
                    <i class="bi bi-eye"></i>
                    </button>
                  </div>
                 
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PayloadTable() {
    const PayloadData = [
        {
          id: 1,
          equipment: "DJI PHANTOM 4 PRO",
          lastEdited: "04-04-2026",
        },
        {
          id: 2,
          equipment: "DJI PHANTOM 4 RTK",
          lastEdited: "04-04-2026",
        },
        {
          id: 3,
          equipment: "DJI INSPIRE 2",
          lastEdited: "04-04-2026",
        },
        {
          id: 1,
          equipment: "DJI M600",
          lastEdited: "04-04-2026",
        },
      ];
      return (
        <table className="table table-hover text-center">
          <thead style={{ width: "100%"}} >
            <tr>
              <th scope="col" style={{ width: "5%", backgroundColor: '#143893', color: '#CCE6FF'}}>
                #
              </th>
              <th scope="col" style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>
                Equipment
              </th>
              <th scope="col" style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>
                Last Edited
              </th>
              <th scope="col" style={{ width: "15%", backgroundColor: '#143893', color: '#CCE6FF'}}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {PayloadData.map((data) => (
              <tr>
                <th scope="row">{data.id}</th>
                <td>{data.equipment}</td>
                <td>{data.lastEdited}</td>
                <td>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col">
                        <button
                          type="button"
                          className="btn btn-warning btn-outline-light"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                      </div>
                   
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
}

function GeodeticGPSTable() {
    const GeodeticGPSData = [
        {
          id: 1,
          equipment: "DJI PHANTOM 4 PRO",
          lastEdited: "02-02-2025",
        },
        {
          id: 2,
          equipment: "DJI PHANTOM 4 RTK",
          lastEdited: "02-02-2025",
        },
        {
          id: 3,
          equipment: "DJI INSPIRE 2",
          lastEdited: "02-02-2025",
        },
        {
          id: 1,
          equipment: "DJI M600",
          lastEdited: "02-02-2025",
        },
      ];
      return (
        <table className="table table-hover text-center">
          <thead style={{ width: "100%"}} >
            <tr>
              <th scope="col" style={{ width: "5%", backgroundColor: '#143893', color: '#CCE6FF'}}>
                #
              </th>
              <th scope="col" style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>
                Equipment
              </th>
              <th scope="col" style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>
                Last Edited
              </th>
              <th scope="col" style={{ width: "15%", backgroundColor: '#143893', color: '#CCE6FF'}}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {GeodeticGPSData.map((data) => (
              <tr>
                <th scope="row">{data.id}</th>
                <td>{data.equipment}</td>
                <td>{data.lastEdited}</td>
                <td>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col">
                        <button
                          type="button"
                          className="btn btn-warning btn-outline-light"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                      </div>
                      
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
}

export default OperationManual;
