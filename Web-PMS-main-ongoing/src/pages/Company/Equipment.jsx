import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useState, useEffect } from "react";
import axios from "axios";

function EquipmentCompany() {
  document.body.style.overflowY = "auto";
  document.body.style.overflowX = "hidden";
  const [selectedTable, setSelectedTable] = useState("UAV");
  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    fetchEquipmentData();
  }, [selectedTable]);

  const fetchEquipmentData = async () => {
    try {
      const response = await axios.get("http://103.163.184.111:3000/equipment_database");
      setEquipmentData(response.data);
    } catch (error) {
      console.error("Error fetching equipment data:", error);
    }
  };

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
              <option value="Laptop">Laptop</option>
              <option value="Battery">Battery</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-12">
            {selectedTable === "UAV" && <EquipmentTable data={equipmentData} type="drone" />}
            {selectedTable === "Payload" && <EquipmentTable data={equipmentData} type="payload" />}
            {selectedTable === "Geodetic GPS" && <EquipmentTable data={equipmentData} type="gps" />}
            {selectedTable === "Laptop" && <EquipmentTable data={equipmentData} type="laptop" />}
            {selectedTable === "Battery" && <EquipmentTable data={equipmentData} type="battery" />}
            {selectedTable === "Other" && <EquipmentTable data={equipmentData} type="other" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function EquipmentTable({ data, type }) {
  const typeMap = {
    drone: { typeField: "drone_type", idField: "drone_id" },
    payload: { typeField: "payload_type", idField: "payload_id" },
    gps: { typeField: "gps_type", idField: "gps_id" },
    laptop: { typeField: "laptop_type", idField: "laptop_id" },
    battery: { typeField: "battery_type", idField: "battery_id" },
    other: { typeField: "other_type", idField: "other_id" }
  };

  const filteredData = data.filter(item => item[typeMap[type].typeField] && item[typeMap[type].idField]);

  return (
    <table className="table table-hover text-center table-bordered" style={{ borderColor: '#143893' }}>
      <thead>
        <tr>
          <th style={{ width: "5%", backgroundColor: '#143893', color: '#CCE6FF' }}>#</th>
          <th style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>{type.toUpperCase()} Type</th>
          <th style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>{type.toUpperCase()} ID</th>
          <th style={{ width: "15%", backgroundColor: '#143893', color: '#CCE6FF' }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item, index) => (
          <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>{item[typeMap[type].typeField]}</td>
            <td>{item[typeMap[type].idField]}</td>
            <td>
              <button type="button" className="btn btn-primary">
                <i className="bi bi-pencil-square"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EquipmentCompany;
