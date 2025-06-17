import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

function Personnel_db() {
  document.body.style.overflowY = "auto";
  document.body.style.overflowX = "hidden";

  const projectCode = localStorage.getItem("originalProjectCode") || "";
  const personnelKey = `personnelList_${projectCode}`;

  // Initialize state with localStorage data or empty array
  const [personnelList, setPersonnelList] = useState(() => {
    const saved = localStorage.getItem(personnelKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [optionsName, setOptionsName] = useState([]);
  const [existingPersonnel, setExistingPersonnel] = useState([]);

  // Save to localStorage whenever personnelList changes
  useEffect(() => {
    localStorage.setItem(personnelKey, JSON.stringify(personnelList));
    localStorage.setItem("personnelList", JSON.stringify(personnelList));
  }, [personnelList, personnelKey]);

  // Helper function to merge backend data with localStorage data
  const mergePersonnelData = (backendData, localData, nameOptions) => {
    // Create a map of backend personnel by name for quick lookup
    const backendMap = new Map();
    backendData.forEach(person => {
      backendMap.set(person.personnel_name, {
        id: person.id,
        realId: person.id,
        name: { value: person.personnel_name, label: person.personnel_name },
        role: { value: person.personnel_role, label: person.personnel_role }
      });
    });

    // Create a map of local personnel by name
    const localMap = new Map();
    localData.forEach(person => {
      if (person.name) {
        localMap.set(person.name.label, person);
      }
    });

    // Merge the data - prioritize local changes over backend data
    const merged = [];
    backendData.forEach(person => {
      const localPerson = localMap.get(person.personnel_name);
      if (localPerson) {
        merged.push(localPerson);
        localMap.delete(person.personnel_name);
      } else {
        merged.push({
          id: person.id,
          name: nameOptions.find(opt => opt.label === person.personnel_name) ||
            { value: person.personnel_name, label: person.personnel_name },
          role: { value: person.personnel_role, label: person.personnel_role }
        });
      }
    });
    // Add any remaining local personnel that weren't in backend (newly added)
    localMap.forEach(person => {
      merged.push(person);
    });
    return merged;
  };

  // Fetch personnel names, then fetch personnel data
  useEffect(() => {
    const fetchAll = async () => {
      await fetchPersonnelNames();
      if (projectCode) {
        await fetchExistingPersonnel(projectCode);
      }
    };
    fetchAll();
    // eslint-disable-next-line
  }, [projectCode]);

  // Fetch personnel from backend
  const fetchExistingPersonnel = async (projectCode) => {
    try {
      const response = await fetch(`http://103.163.184.111:3000/personnel?project_code=${encodeURIComponent(projectCode)}`);
      if (response.ok) {
        const data = await response.json();
        setExistingPersonnel(data);

        // Merge data from backend with localStorage data
        const mergedPersonnel = mergePersonnelData(data, personnelList, optionsName);

        setPersonnelList(mergedPersonnel);
        localStorage.setItem(personnelKey, JSON.stringify(mergedPersonnel));
        localStorage.setItem("personnelList", JSON.stringify(mergedPersonnel));
        localStorage.setItem("existingPersonnel", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching existing personnel:", error);
    }
  };

  const options = [
    { value: "Pilot", label: "Pilot" },
    { value: "Co-Pilot", label: "Co-Pilot" },
    { value: "Observer", label: "Observer" },
    { value: "Trainer", label: "Trainer" },
  ];

  const fetchPersonnelNames = async () => {
    try {
      const response = await fetch("http://103.163.184.111:3000/users");
      if (response.ok) {
        const data = await response.json();
        const formattedOptions = data.map(user => ({
          value: user.id,
          label: user.name,
        }));
        setOptionsName(formattedOptions);
      }
    } catch (error) {
      console.error("Error fetching personnel names:", error);
    }
  };

  // Tambah row baru dengan id unik sementara
  const handleAddRow = () => {
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const newList = [...personnelList, { id: tempId, name: null, role: null }];
    setPersonnelList(newList);
  };

  // Hapus row
  // const handleDeleteRow = (id) => {
  //   const newList = personnelList.filter(person => person.id !== id);
  //   setPersonnelList(newList);
  // };

//    const handleDeleteRow = async (id) => {
//     if (!window.confirm('Apakah Anda yakin ingin menghapus manusia ini?')) {
//     return;
//   }
//   try {
//     // Cari item yang akan dihapus
//     const itemToDelete = personnelList.find(item => item.id === id);
    
//     // Jika item memiliki realId (sudah ada di database), hapus dari database
//     if (itemToDelete?.realId) {
//       const response = await axios.delete(
//         `http://103.163.184.111:3000/personnel/${itemToDelete.realId}`
//       );
      
//       if (response.status !== 200) {
//         throw new Error('Failed to delete from database');
//       }
//       console.log('Personnel deleted from database:', itemToDelete.realId);
//     }
    
//     // Hapus dari state/localStorage
//     setPersonnelList(personnelList.filter((item) => item.id !== id));
    
//   } catch (error) {
//     console.error('Error deleting personnel:', error);
//     alert(`Gagal menghapus personnel: ${error.message}`);
//   }
// };

const handleDeleteRow = async (id) => {
  if (!window.confirm('Apakah Anda yakin ingin menghapus personnel ini?')) {
    return;
  }
  
  try {
    // Cari item yang akan dihapus
    const itemToDelete = personnelList.find(item => item.id === id);
    
    // Jika item memiliki id yang bukan temporary (sudah ada di database)
    if (itemToDelete && !itemToDelete.id.toString().startsWith('temp-')) {
      const response = await axios.delete(
        `http://103.163.184.111:3000/personnel/${itemToDelete.id}`
      );
      
      if (response.status !== 200) {
        throw new Error('Failed to delete from database');
      }
      console.log('Personnel deleted from database:', response.data);
    }
    
    // Hapus dari state dan localStorage
    const updatedList = personnelList.filter((item) => item.id !== id);
    setPersonnelList(updatedList);
    
    // Update localStorage
    localStorage.setItem(personnelKey, JSON.stringify(updatedList));
    localStorage.setItem("personnelList", JSON.stringify(updatedList));
    
  } catch (error) {
    console.error('Error deleting personnel:', error);
    alert(`Gagal menghapus personnel: ${error.response?.data?.message || error.message}`);
  }
};

  // Edit select
  const handleSelectChange = (id, type, selectedOption) => {
    const newList = personnelList.map(person =>
      person.id === id ? { ...person, [type]: selectedOption } : person
    );
    setPersonnelList(newList);
  };

  return (
    <div className="personnel-container" style={{ marginLeft: "250px" }}>
      <h2>Personnel</h2>
      <div className="mb-3">
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
              <th scope="col" style={{ width: "5%", backgroundColor: "#143893", color: "#CCE6FF" }}>#</th>
              <th scope="col" style={{ width: "35%", backgroundColor: "#143893", color: "#CCE6FF" }}>Personnel Name</th>
              <th scope="col" style={{ width: "35%", backgroundColor: "#143893", color: "#CCE6FF" }}>Personnel Role</th>
              <th scope="col" style={{ width: "25%", backgroundColor: "#143893", color: "#CCE6FF" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {personnelList.map((person, index) => (
              <tr key={person.id ?? `new-${index}`}>
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

export default Personnel_db;