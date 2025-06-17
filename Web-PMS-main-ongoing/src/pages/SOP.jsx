import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, {useState} from "react";

function SOP() {
    const [selectedTable, setSelectedTable] = useState("General");

  return (
    <div>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center">SOP</h2>
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
              <option value="General">General</option>
              <option value="Inspection Dept">Inspection Dept</option>
              <option value="Survey Dept">Survey Dept</option>
            </select>
            </div>
        </div>
      </div>

      <div className="container-fluid mt-5">
        <div className="row">
              <div className="col-12">
                 {/* Menampilkan tabel berdasarkan pilihan */}
            {selectedTable === "General" && <GeneralTable />}
            {selectedTable === "Inspection Dept" && <InspectionTable />}
            {selectedTable === "Survey Dept" && <SurveyTable />}
              </div>
        </div>
      </div>

    </div>
  );
}

function GeneralTable(){
  const generalData = [
    {
      id: '1',
      title: '',
      lastEdited: '',
      action: '',
    },
    {
      id: '2',
      title: '',
      lastEdited: '',
      action: '',
    },
    {
      id: '3',
      title: '',
      lastEdited: '',
      action: '',
    },
  ]
  return(
    <table className="table table-hover text-center">
    <thead style={{ width: "100%"}} >
      <tr>
        <th scope="col" style={{ width: "5%", backgroundColor: '#143893', color: '#CCE6FF' }}>
          id
        </th>
        <th scope="col" style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>
          Title
        </th>
        <th scope="col" style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>
          Last Edited
        </th>
        <th scope="col" style={{ width: "15%", backgroundColor: '#143893', color: '#CCE6FF'}}>
          Document
        </th>
      </tr>
    </thead>
    <tbody>
      {generalData.map((data) => (
        <tr>
          <th scope="row">{data.id}</th>
          <td>{data.title}</td>
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

function InspectionTable(){
  const inspectionData = [
    {
      id: 1,
      title: '',
      lastEdited: '',
      action: '',
    },
    {
      id: 2,
      title: '',
      lastEdited: '',
      action: '',
    },
    {
      id: 3,
      title: '',
      lastEdited: '',
      action: '',
    },
    {
      id: 4,
      title: '',
      lastEdited: '',
      action: '',
    }
  ]

  return(
    <table className="table table-hover text-center">
    <thead style={{ width: "100%"}} >
      <tr>
        <th scope="col" style={{ width: "5%", backgroundColor: '#143893', color: '#CCE6FF' }}>
          id
        </th>
        <th scope="col" style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>
          Title
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
      {inspectionData.map((data) => (
        <tr>
          <th scope="row">{data.id}</th>
          <td>{data.title}</td>
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

function SurveyTable(){
  const surveyData = [
    {
      id: 1,
      title: '',
      lastEdited: '',
      action: '',
    },
    {
      id: 2,
      title: '',
      lastEdited: '',
      action: '',
    },
    {
      id: 3,
      title: '',
      lastEdited: '',
      action: '',
    },
    {
      id: 4,
      title: '',
      lastEdited: '',
      action: '',
    },
    {
      id: 5,
      title: '',
      lastEdited: '',
      action: '',
    },
  ]

  return(
    <table className="table table-hover text-center">
    <thead style={{ width: "100%"}} >
      <tr>
        <th scope="col" style={{ width: "5%", backgroundColor: '#143893', color: '#CCE6FF' }}>
          id
        </th>
        <th scope="col" style={{ width: "40%", backgroundColor: '#143893', color: '#CCE6FF' }}>
          Title
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
      {surveyData.map((data) => (
        <tr>
          <th scope="row">{data.id}</th>
          <td>{data.title}</td>
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

export default SOP;
