import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import "leaflet/dist/leaflet.css";
import React from "react";
import { Line, Pie } from "react-chartjs-2";
import { MapContainer, TileLayer } from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import "./Homepage.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const heatmapPoints = [
  [51.505, -0.09, 0.5],
  [51.51, -0.1, 0.8],
  [51.52, -0.12, 0.6],
  [51.515, -0.095, 0.7],
  [51.50, -0.085, 0.9],
];

const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Project",
      data: [30, 50, 40, 60, 70, 90],
      borderColor: "black",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      tension: 0.4,
    },
  ],
};

const logs = [
  { id: 1, user: "John Doe", action: "Logged In", time: "10:30 AM" },
  { id: 2, user: "Jane Smith", action: "Uploaded File", time: "11:00 AM" },
  { id: 3, user: "Alice Brown", action: "Edited Profile", time: "11:30 AM" },
  { id: 4, user: "Bob Martin", action: "Logged Out", time: "12:00 PM" },
];

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "right",
    },
  },
  scales: {
    x: {
      ticks: { color: "black" },
    },
    y: {
      ticks: { color: "black" },
    },
  },
};

const pieData = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
  datasets: [
    {
      label: "Distribution",
      data: [12, 19, 3, 5, 2],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"],
      hoverOffset: 4,
    },
  ],
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "black" },
    },
  },
};

document.body.style.overflowY = "auto";
document.body.style.overflowX = "hidden";

function Homepage() {
  return (
    <div className="Homepage">
      <div className="container-fluid">
        <div
          className="row d-flex justify-content-center py-1"
          style={{ height: "100%" }}
        >
          <div className="col-md-5 col-11 card text-bg-light mb-3 mx-lg-3 mx-1 px-0">
            <div className="card-header">Heatmap</div>
            <div className="card-body">
              <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "300px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <HeatmapLayer
                  fitBoundsOnLoad
                  fitBoundsOnUpdate
                  points={heatmapPoints}
                  longitudeExtractor={(m) => m[1]}
                  latitudeExtractor={(m) => m[0]}
                  intensityExtractor={(m) => m[2]}
                />
              </MapContainer>
            </div>
          </div>

          <div className="col-md-6 col-11  card-seven card text-bg-light mb-3 mx-lg-3 mx-1 px-0">
            <div className="card-header">Log Activity</div>
            <div className="card-body">
              <table
                className="table table-bordered table-hover text-center"
                style={{ width: "100%", height: "100%" }}
              >
                <thead className="table-dark">
                  <tr>
                    <th style={{ width: "10%", backgroundColor: '#143893', color: '#CCE6FF' }}>#</th>
                    <th style={{ width: "30%", backgroundColor: '#143893', color: '#CCE6FF' }}>User</th>
                    <th style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>Action</th>
                    <th style={{ width: "20%", backgroundColor: '#143893', color: '#CCE6FF' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.user}</td>
                      <td>{log.action}</td>
                      <td>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-3">
        <div className="row d-flex justify-content-center">
          <div className="col-xl-5 col-11 card-five card text-bg-light mb-3 px-0">
            <div className="card-header">Graph Chart</div>
            <div
              className="card-body"
              style={{
                position: "relative",
                minWidth: "200px",
                minHeight: "300px",
                overflowX: "auto",
              }}
            >
              <Line
                data={lineData}
                options={{
                  ...lineOptions,
                  responsive: true, // Pastikan chart bisa menyesuaikan ukuran parent-nya
                  maintainAspectRatio: false, // Izinkan chart mengatur tinggi sendiri
                  aspectRatio: 2, // Memperlebar grafik agar lebih proporsional
                  plugins: {
                    legend: {
                      position: "bottom", // Pindahkan legend ke bawah agar tidak ketutupan
                      labels: {
                        boxWidth: 20, // Ukuran kotak warna legend
                        font: {
                          size: 14, // Ukuran font legend
                        },
                      },
                    },
                  },
                  layout: {
                    padding: {
                      // Tambah padding agar legend tidak ketutupan
                    },
                  },
                }}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-sm-5 col-11 card-six card text-bg-light mx-lg-2 mx-md-2  mb-3 d-flex justify-content-center px-0">
            <div className="card-header">Pie Chart</div>
            <div
              className="card-body d-flex justify-content-center align-items-center w-100 h-100"
              style={{ width: "400px", height: "400px" }}
            >
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          <div className="col-xl-3 col-sm-5 col-11 mx-lg-2">
            <div className="row">
              <div className="col-lg-12 col-12 card-two card text-bg-light mb-3 mx-1 px-0">
                <div className="card-header">Total Coverage</div>
                <div className="card-body">
                  <p className="card-text">2000 ha</p>
                </div>
              </div>
              <div className="col-lg-12 col-12 card-three card text-bg-light mx-1 px-0">
                <div className="card-header">Total Flight Time</div>
                <div className="card-body">
                  <p className="card-text">20.000 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
