import React, { useEffect, useState } from "react";
import Select from "react-select";

function Personnel() {
  document.body.style.overflowY = "auto";
  document.body.style.overflowX = "hidden";

  // Function to load stored data from localStorage
  const loadStoredData = (key) => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : [];
  };

  const [personnelList, setPersonnelList] = useState(loadStoredData("personnelList"));
  const [personnelNames, setPersonnelNames] = useState(loadStoredData("personnelNames"));
  const [personnelRoles, setPersonnelRoles] = useState(loadStoredData("personnelRoles"));
  const [optionsName, setOptionsName] = useState([]);

  // Save personnelList, personnelNames, and personnelRoles to localStorage whenever they update
  useEffect(() => {
    localStorage.setItem("personnelList", JSON.stringify(personnelList));
    localStorage.setItem("personnelNames", JSON.stringify(personnelNames));
    localStorage.setItem("personnelRoles", JSON.stringify(personnelRoles));
  }, [personnelList, personnelNames, personnelRoles]);

  // Fetch personnel names from the provided URL
  useEffect(() => {
    fetch("http://103.163.184.111:3000/users")
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((user) => ({
          value: user.id,
          label: user.name,
        }));
        setOptionsName(formattedOptions);
      })
      .catch((error) => console.error("Error fetching personnel names:", error));
  }, []);

  const options = [
    { value: "1", label: "Pilot" },
    { value: "2", label: "Co-Pilot" },
    { value: "3", label: "Observer" },
     { value: "Trainer", label: "Trainer" },
  ];

  // Add new row
  const handleAddRow = () => {
    const newId = Date.now();
    setPersonnelList([...personnelList, { id: newId, name: null, role: null }]);
    setPersonnelNames([...personnelNames, { id: newId, name: null }]);
    setPersonnelRoles([...personnelRoles, { id: newId, role: null }]);
  };

  // Delete row
  const handleDeleteRow = (id) => {
    setPersonnelList(personnelList.filter((person) => person.id !== id));
    setPersonnelNames(personnelNames.filter((person) => person.id !== id));
    setPersonnelRoles(personnelRoles.filter((person) => person.id !== id));
  };

  // Update state when dropdown changes
  const handleSelectChange = (id, type, selectedOption) => {
    setPersonnelList(
      personnelList.map((person) =>
        person.id === id ? { ...person, [type]: selectedOption } : person
      )
    );

    if (type === "name") {
      setPersonnelNames(
        personnelNames.map((person) =>
          person.id === id ? { ...person, name: selectedOption } : person
        )
      );
    } else if (type === "role") {
      setPersonnelRoles(
        personnelRoles.map((person) =>
          person.id === id ? { ...person, role: selectedOption } : person
        )
      );
    }
  };

  return (
    <div className="personnel-container" style={{ marginLeft: "250px" }}>
      <h2> Personnel</h2>
      <div className="col mb-1 mt-3">
        <button
          type="button"
          onClick={handleAddRow}
          className="button-add btn btn-primary mb-3 me-1"
        >
          <i className="bi bi-plus"></i>
        </button>
      </div>
      <div className="form-group row d-flex align-items-center column-gap-1">
        <table
          className="table text-center table-bordered ms-2"
          style={{ borderColor: "#143893" }}
        >
          <thead>
            <tr>
              <th
                scope="col"
                style={{
                  width: "5%",
                  backgroundColor: "#143893",
                  color: "#CCE6FF",
                }}
              >
                #
              </th>
              <th
                scope="col"
                style={{
                  width: "35%",
                  backgroundColor: "#143893",
                  color: "#CCE6FF",
                }}
              >
                Personnel Name
              </th>
              <th
                scope="col"
                style={{
                  width: "35%",
                  backgroundColor: "#143893",
                  color: "#CCE6FF",
                }}
              >
                Personnel Role
              </th>
              <th
                scope="col"
                style={{
                  width: "25%",
                  backgroundColor: "#143893",
                  color: "#CCE6FF",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {personnelList.map((person, index) => (
              <tr key={person.id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <Select
                    options={optionsName}
                    value={person.name}
                    onChange={(selectedOption) =>
                      handleSelectChange(person.id, "name", selectedOption)
                    }
                    placeholder="Select personnel name"
                    isSearchable={true}
                    className="w-100"
                  />
                </td>
                <td>
                  <Select
                    options={options}
                    value={person.role}
                    onChange={(selectedOption) =>
                      handleSelectChange(person.id, "role", selectedOption)
                    }
                    placeholder="Select personnel role"
                    isSearchable={true}
                    className="w-100"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(person.id)}
                    className="btn btn-danger"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Personnel;