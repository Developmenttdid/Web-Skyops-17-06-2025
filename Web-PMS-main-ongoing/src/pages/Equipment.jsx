import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect, useState } from "react";

function Equipment() {
  const [selectedTable, setSelectedTable] = useState(() => {
    return localStorage.getItem("selectedTable") || "UAV";
  });

  useEffect(() => {
    localStorage.setItem("selectedTable", selectedTable);
  }, [selectedTable]);

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            <label className="my-2">Select Table:</label>
            <select
              className="form-select"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
            >
              <option value="UAV">UAV</option>
              <option value="Payload">Payload</option>
              <option value="Geodetic GPS">GPS</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-12">
            {selectedTable === "UAV" && <UAVTable />}
            {selectedTable === "Payload" && <PayloadTable />}
            {selectedTable === "Geodetic GPS" && <GeodeticGPSTable />}
          </div>
        </div>
      </div>
    </div>
  );
}

const loadStoredData = (key, defaultData) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultData;
  } catch (error) {
    console.error("Error loading data from localStorage", error);
    return defaultData;
  }
};

function UAVTable() {
  const defaultData = [
    { id: 1, UAVtype: "", UAVid: "", status: "available" },
    { id: 2, UAVtype: "", UAVid: "", status: "not available" },
  ];

  const [UAVData, setUAVData] = useState(() => loadStoredData("UAVData", defaultData));

  useEffect(() => {
    localStorage.setItem("UAVData", JSON.stringify(UAVData));
  }, [UAVData]);

  const handleAddRow = () => {
    const newRow = { id: Date.now(), UAVtype: "", UAVid: "", status: "available" };
    setUAVData((prev) => [...prev, newRow]);
  };

  const handleInputChange = (id, field, value) => {
    setUAVData((prev) =>
      prev.map((data) => (data.id === id ? { ...data, [field]: value } : data))
    );
  };

  return (
    <div>
      <button type="button" className="btn btn-primary mb-3" onClick={handleAddRow}>
        Add UAV
      </button>
      <table className="table table-hover text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>UAV Type</th>
            <th>UAV id</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {UAVData.map((data) => (
            <tr key={data.id}>
              <th scope="row">{data.id}</th>
              <td>
                <input
                  type="text"
                  value={data.UAVtype}
                  onChange={(e) => handleInputChange(data.id, "UAVtype", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={data.UAVid}
                  onChange={(e) => handleInputChange(data.id, "UAVid", e.target.value)}
                />
              </td>
              <td>
                {data.status === "available" ? (
                  <button type="button" className="btn btn-success">
                    <i className="bi bi-check2"></i>
                  </button>
                ) : (
                  <button type="button" className="btn btn-danger">
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PayloadTable() {
  const defaultData = [
    { id: 1, payloadType: "", payloadID: "", status: "available" },
    { id: 2, payloadType: "", payloadID: "", status: "not available" },
  ];

  const [PayloadData, setPayloadData] = useState(() => loadStoredData("PayloadData", defaultData));

  useEffect(() => {
    localStorage.setItem("PayloadData", JSON.stringify(PayloadData));
  }, [PayloadData]);

  const handleAddRow = () => {
    const newRow = { id: Date.now(), payloadType: "", payloadID: "", status: "available" };
    setPayloadData((prev) => [...prev, newRow]);
  };

  const handleInputChange = (id, field, value) => {
    setPayloadData((prev) =>
      prev.map((data) => (data.id === id ? { ...data, [field]: value } : data))
    );
  };

  return (
    <div>
      <button type="button" className="btn btn-primary mb-3" onClick={handleAddRow}>
        Add Payload
      </button>
      <table className="table table-hover text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Payload Type</th>
            <th>Payload ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {PayloadData.map((data) => (
            <tr key={data.id}>
              <th scope="row">{data.id}</th>
              <td>
                <input
                  type="text"
                  value={data.payloadType}
                  onChange={(e) => handleInputChange(data.id, "payloadType", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={data.payloadID}
                  onChange={(e) => handleInputChange(data.id, "payloadID", e.target.value)}
                />
              </td>
              <td>
                {data.status === "available" ? (
                  <button type="button" className="btn btn-success">
                    <i className="bi bi-check2"></i>
                  </button>
                ) : (
                  <button type="button" className="btn btn-danger">
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Equipment;