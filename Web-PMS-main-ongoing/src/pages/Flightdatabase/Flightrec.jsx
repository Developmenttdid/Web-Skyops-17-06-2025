import React from "react";
import "./Flightrec.css";

const FlightRecordData = [
  {
    id: 1,
    date: "2025-01-02",
    year: "2025",
    project: "Project Alpha",
    activity: "Survey",
    flightcode: "FL-001",
    pilot: "John Doe",
    copilot1: "Jane Smith",
    copilot2: "Alice Brown",
    uav: "DJI-M300",
    payload: "Camera",
    location: "Bandung",
    weather: "Clear",
    takeoff: "08:00 AM",
    landing: "09:00 AM",
    flighttime: "1 hour",
    distance: "10 km",
    batteryid: "BAT-001",
    batteryvolt: "24V",
    batterypercent: "80%",
    batteryvoltmp: "23.5V",
    batterypercentmp: "75%",
    incident: "None",
    note: "Smooth flight",
    loss: "None"
  },
  {
    id: 2,
    date: "2025-01-03",
    year: "2025",
    project: "Project Beta",
    activity: "Inspection",
    flightcode: "FL-002",
    pilot: "Bob Martin",
    copilot1: "Charlie Davis",
    copilot2: "Eve Johnson",
    uav: "DJI-M300",
    payload: "Lidar",
    location: "Jakarta",
    weather: "Cloudy",
    takeoff: "10:00 AM",
    landing: "11:30 AM",
    flighttime: "1.5 hours",
    distance: "15 km",
    batteryid: "BAT-002",
    batteryvolt: "24V",
    batterypercent: "70%",
    batteryvoltmp: "23V",
    batterypercentmp: "65%",
    incident: "Minor turbulence",
    note: "Successful inspection",
    loss: "None"
  }
];

function FlightRecord() {
  return (
    <div className="container-fluid mt-3" style={{ width: "98%", padding: "0px" }}>
      <h3 className="mb-4">Flight Record</h3>
      
      <div className="container-fluid mx-0" style={{ overflowX: "auto", width: "100%" }}>
        <table className="table table-bordered" style={{ whiteSpace: "nowrap", borderColor: '#143893' }}>
          <thead>
            <tr>
              <th scope="col" style={{width: '5%', backgroundColor: '#143893', color: '#CCE6FF'}}>#</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Date</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Year</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Project</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Activities</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Flight Code</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Pilot</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Co-Pilot 1</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Co-Pilot 2</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>UAV</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Payload</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Location</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Weather</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Take-off Time</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Landing Time</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Total Flight Time</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Total Distance</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Battery ID</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Battery Voltage (Checker)</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Battery Percentage (Checker)</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Battery Voltage (MP)</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Battery Percentage (MP)</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Incident</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Note</th>
              <th scope="col" style={{width: '25%', backgroundColor: '#143893', color: '#CCE6FF'}}>Loss</th>
            </tr>
          </thead>
          <tbody>
            {FlightRecordData.map((record) => (
              <tr key={record.id}>
                <th scope="row">{record.id}</th>
                <td>{record.date}</td>
                <td>{record.year}</td>
                <td>{record.project}</td>
                <td>{record.activity}</td>
                <td>{record.flightcode}</td>
                <td>{record.pilot}</td>
                <td>{record.copilot1}</td>
                <td>{record.copilot2}</td>
                <td>{record.uav}</td>
                <td>{record.payload}</td>
                <td>{record.location}</td>
                <td>{record.weather}</td>
                <td>{record.takeoff}</td>
                <td>{record.landing}</td>
                <td>{record.flighttime}</td>
                <td>{record.distance}</td>
                <td>{record.batteryid}</td>
                <td>{record.batteryvolt}</td>
                <td>{record.batterypercent}</td>
                <td>{record.batteryvoltmp}</td>
                <td>{record.batterypercentmp}</td>
                <td>{record.incident}</td>
                <td>{record.note}</td>
                <td>{record.loss}</td>
              </tr>
            ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default FlightRecord;
