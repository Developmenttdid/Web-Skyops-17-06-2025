import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import "./ProjectTimeline.css";

function ProjectTimeline() {
  document.body.style.overflowY = "auto";
  document.body.style.overflowX = "hidden";

  const loadStoredData = () => {
    const storedData = localStorage.getItem("projectTableData");
    return storedData ? JSON.parse(storedData) : [
      {
        taskList: 'Studi Literatur',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pembuatan Rencana Kerja',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Kick off Meeting (KOM)',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pre-mob',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengurusan Safety Assessment Airnav Pusat',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengurusan Safety Assessment Airnav Lokal',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengurusan Izin Operasi - DNP',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengurusan Security Clearance',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengurusan Izin Terbang - Lanud Lokal',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengurusan NOTAM - Airnav Lokal',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Perizinan Setempat',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Survei Pendahuluan',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pemasangan Primark',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengamatan GPS',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Manajemen Data Survei Darat',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengolahan Data Survei Darat',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Akuisisi Data Survei Udara',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Manajemen Data Survei Udara',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengolahan PPK',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengolahan Data Survei Udara',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pembuatan BAPL',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Manajemen Data Hasil Pekerjaan',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Quality Control',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Serah Terima Data',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Manajemen Data Survei Darat & Udara',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Quality Control',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengolahan Data Survei Darat (hi res)',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Pengolahan Data Survei Udara (hi res)',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Uji Akurasi',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
      {
        taskList: 'Revisi Pekerjaan',
        startDate: '',
        endDate: '',
        percentComplete: 0,
        action: ''
      },
    ];
  };

  const [tableData, setTableData] = useState(loadStoredData());

  // Save tableData to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("projectTableData", JSON.stringify(tableData));
  }, [tableData]);

  const [ganttData, setGanttData] = useState([
    [
      { type: "string", label: "Task ID" },
      { type: "string", label: "Task Name" },
      { type: "string", label: "Resource" },
      { type: "date", label: "Start Date" },
      { type: "date", label: "End Date" },
      { type: "number", label: "Duration" },
      { type: "number", label: "Percent Complete" },
      { type: "string", label: "Dependencies" },
    ],
  ]);

  useEffect(() => {
    const defaultStartDate = new Date();
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 1);

    const updatedGanttData = [
      [
        { type: "string", label: "Task ID" },
        { type: "string", label: "Task Name" },
        { type: "string", label: "Resource" },
        { type: "date", label: "Start Date" },
        { type: "date", label: "End Date" },
        { type: "number", label: "Duration" },
        { type: "number", label: "Percent Complete" },
        { type: "string", label: "Dependencies" },
      ],
      ...tableData.map((data, index) => [
        `Task${index + 1}`,
        data.taskList,
        "Resource",
        data.startDate ? new Date(data.startDate) : defaultStartDate,
        data.endDate ? new Date(data.endDate) : defaultEndDate,
        null,
        data.percentComplete,
        null,
      ]),
    ];
    setGanttData(updatedGanttData);
  }, [tableData]);

  const handleDeleteRow = (index) => {
    setTableData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleDateChange = (index, field, value) => {
    setTableData((prevData) =>
      prevData.map((data, i) =>
        i === index ? { ...data, [field]: value } : data
      )
    );
  };

  const handlePercentCompleteChange = (index, value) => {
    setTableData((prevData) =>
      prevData.map((data, i) =>
        i === index ? { ...data, percentComplete: value } : data
      )
    );
  };

  const chartOptions = {
    legend: {
      textStyle: {
        color: 'black',
      },
    },
  };

  return (
    <div className="project-timeline" style={{ marginLeft: "250px"}}>
      <h2 className="mb-4" style={{fontFamily: "Roboto, sans-serif", color: "#0F0F56"}}>Project Timeline</h2>
      <h5>Project Chart</h5>
      
      <Chart
        chartType="Gantt"
        width="100%"
        height="1350px"
        data={ganttData}
        options={chartOptions}
      />
      
      <h5 className="mt-0">Project Table</h5>
      <table className="table table-bordered table-hover text-center mt-0" style={{ borderColor: "#143893" }}>
        <thead>
          <tr>
            <th scope="col" style={{ width: "5%", backgroundColor: "#143893", color: "#CCE6FF" }}>No</th>
            <th scope="col" style={{ width: "30%", backgroundColor: "#143893", color: "#CCE6FF" }}>Task List</th>
            <th scope="col" style={{ width: "25%", backgroundColor: "#143893", color: "#CCE6FF" }}>Start Date</th>
            <th scope="col" style={{ width: "25%", backgroundColor: "#143893", color: "#CCE6FF" }}>End Date</th>
            <th scope="col" style={{ width: "15%", backgroundColor: "#143893", color: "#CCE6FF" }}>Progress</th>
            <th scope="col" style={{ width: "15%", backgroundColor: "#143893", color: "#CCE6FF" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{data.taskList}</td>
              <td>
                <input
                  type="date"
                  value={data.startDate}
                  onChange={(e) => handleDateChange(index, "startDate", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={data.endDate}
                  onChange={(e) => handleDateChange(index, "endDate", e.target.value)}
                />
              </td>
              <td>
                <select
                  value={data.percentComplete}
                  onChange={(e) => handlePercentCompleteChange(index, parseInt(e.target.value))}
                >
                  <option value={0}>0%</option>
                  <option value={10}>10%</option>
                  <option value={20}>20%</option>
                  <option value={30}>30%</option>
                  <option value={40}>40%</option>
                  <option value={50}>50%</option>
                  <option value={60}>60%</option>
                  <option value={70}>70%</option>
                  <option value={80}>80%</option>
                  <option value={90}>90%</option>
                  <option value={100}>100%</option>
                </select>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger btn-outline-light"
                  onClick={() => handleDeleteRow(index)}
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectTimeline;