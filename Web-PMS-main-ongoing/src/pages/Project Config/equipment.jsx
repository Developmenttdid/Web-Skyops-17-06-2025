import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";

function Equipment() {
  document.body.style.overflowY = "auto";
  document.body.style.overflowX = "hidden";

  const loadStoredData = (key, defaultData) => {
    try {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : defaultData;
    } catch (error) {
      console.error("Error loading data from localStorage", error);
      return defaultData;
    }
  };

  const [selectedOption3, setSelectedOption3] = useState(() =>
    loadStoredData("EquipmentName", null)
  );
  const [equipmentList, setEquipmentList] = useState(() =>
    loadStoredData("equipmentList", [])
  );
  const [optionsType, setOptionsType] = useState({});
  const [optionsID, setOptionsID] = useState({});
  const [filteredIDOptions, setFilteredIDOptions] = useState({});

  useEffect(() => {
    localStorage.setItem("EquipmentName", JSON.stringify(selectedOption3));
  }, [selectedOption3]);

  useEffect(() => {
    localStorage.setItem("equipmentList", JSON.stringify(equipmentList));
  }, [equipmentList]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.get(
        "http://103.163.184.111:3000/equipment_database"
      );
      console.log("API Response:", response.data);

      const optionsMap = {
        1: { type: "drone_type", id: "drone_id" },
        2: { type: "gps_type", id: "gps_id" },
        3: { type: "payload_type", id: "payload_id" },
        4: { type: "laptop_type", id: "laptop_id" },
        5: { type: "battery_type", id: "battery_id" },
        6: { type: "other_type", id: "other_id" },
        7: { type: "ppe_type", id: "ppe_id" },
      };

      const typeOptionsTemp = {};
      const idOptionsTemp = {};

      response.data.forEach((item) => {
        Object.entries(optionsMap).forEach(([key, { type, id }]) => {
          // Jika field type ada (tidak null/undefined), masukkan ke set tipe.
          if (item[type]) {
            if (!typeOptionsTemp[key]) typeOptionsTemp[key] = new Set();
            typeOptionsTemp[key].add(item[type]);
          }
          // Jika field id ada, masukkan ke id options
          if (item[id]) {
            if (!idOptionsTemp[key]) idOptionsTemp[key] = [];
            // Kita simpan pasangan { type, id } untuk keperluan filter nanti
            idOptionsTemp[key].push({ type: item[type], id: item[id] });
          }
        });
      });

      // Konversi set ke array opsi untuk dropdown Equipment Type
      const uniqueTypeOptions = {};
      const uniqueIDOptions = {};

      Object.entries(typeOptionsTemp).forEach(([key, setObj]) => {
        uniqueTypeOptions[key] = Array.from(setObj).map((val) => ({
          value: val,
          label: val,
        }));
      });

      // Untuk Equipment ID, kita langsung ambil array yang sudah ada (tidak unik secara pasangan, namun seharusnya tidak ada duplikasi dari database)
      Object.entries(idOptionsTemp).forEach(([key, list]) => {
        uniqueIDOptions[key] = list.map((opt) => ({
          value: opt.id,
          label: opt.id,
          // Simpan juga tipe-nya supaya bisa dipakai filter di handleSelectChange
          type: opt.type,
        }));
      });

      setOptionsType(uniqueTypeOptions);
      setOptionsID(uniqueIDOptions);
    } catch (error) {
      console.error("Error fetching data from API", error);
    }
  };

  const handleAddRow = () => {
    if (selectedOption3) {
      const newRow = {
        id: Date.now(),
        equipment: selectedOption3,
        type: null,
        equipmentID: null,
      };
      setEquipmentList([...equipmentList, newRow]);
      setSelectedOption3(null);
    }
  };

  // const handleSelectChange = (id, field, selectedOption) => {
  //   const updatedList = equipmentList.map((item) =>
  //     item.id === id ? { ...item, [field]: selectedOption } : item
  //   );
  //   setEquipmentList(updatedList);

  //   if (field === "type") {
  //     // Cari equipment (misalnya PPE) yang dipilih di dropdown Equipment,
  //     // gunakan key equipment.value (misalnya "7" untuk PPE)
  //     const equipment = equipmentList.find((item) => item.id === id).equipment;
  //     const key = equipment.value;
  //     // Filter dari optionsID, cari item dengan property type yang sesuai dengan selectedOption.value
  //     const filteredOptions = optionsID[key].filter(
  //       (option) => option.type === selectedOption.value
  //     );
  //     setFilteredIDOptions((prev) => ({
  //       ...prev,
  //       [id]: filteredOptions.map((option) => ({
  //         value: option.value,
  //         label: option.label,
  //       })),
  //     }));
  //   }
  // };

  const handleSelectChange = (id, field, selectedOption) => {
  const updatedList = equipmentList.map((item) =>
    item.id === id ? { ...item, [field]: selectedOption } : item
  );
  setEquipmentList(updatedList);

  if (field === "type") {
    const equipment = equipmentList.find((item) => item.id === id).equipment;
    const key = equipment.value;
    
    // Check if optionsID[key] exists before filtering
    if (optionsID[key]) {
      const filteredOptions = optionsID[key].filter(
        (option) => option.type === selectedOption.value
      );
      setFilteredIDOptions((prev) => ({
        ...prev,
        [id]: filteredOptions.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      }));
    } else {
      // For PPE or other items without IDs, set empty array
      setFilteredIDOptions((prev) => ({
        ...prev,
        [id]: [],
      }));
    }
  }
};

  const handleDeleteRow = (id) => {
    setEquipmentList(equipmentList.filter((item) => item.id !== id));
  };

  return (
    <div className="equipment-container" style={{ marginLeft: "250px" }}>
      <div className="d-flex align-items-center">
        <h2>Equipment</h2>
      </div>
      <div className="col mb-3 ms-3">
        <label className="form-label">Add Equipment</label>
        <div className="d-flex align-items-center">
          <Select
            options={[
              { value: "1", label: "UAV" },
              { value: "2", label: "GPS" },
              { value: "3", label: "Payload" },
              { value: "4", label: "Laptop" },
              { value: "5", label: "Battery" },
              { value: "6", label: "Other" },
              { value: "7", label: "PPE" },
            ]}
            value={selectedOption3}
            onChange={setSelectedOption3}
            placeholder="Select equipment"
            isSearchable={true}
            className="w-100"
          />
          <button
            type="button"
            onClick={handleAddRow}
            className="btn btn-primary ms-2"
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>
      <table className="table text-center table-bordered ms-2">
        <thead>
          <tr>
            <th
              scope="col"
              style={{ width: "5%", backgroundColor: "#143893", color: "#CCE6FF" }}
            >
              #
            </th>
            <th
              scope="col"
              style={{ width: "25%", backgroundColor: "#143893", color: "#CCE6FF" }}
            >
              Equipment
            </th>
            <th
              scope="col"
              style={{ width: "25%", backgroundColor: "#143893", color: "#CCE6FF" }}
            >
              Equipment Type
            </th>
            <th
              scope="col"
              style={{ width: "25%", backgroundColor: "#143893", color: "#CCE6FF" }}
            >
              Equipment ID
            </th>
            <th
              scope="col"
              style={{ width: "25%", backgroundColor: "#143893", color: "#CCE6FF" }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {equipmentList.map((item, index) => (
            <tr key={item.id}>
              <th>{index + 1}</th>
              <td>
                <input
                  className="form-control"
                  type="text"
                  value={item.equipment?.label || ""}
                  readOnly
                />
              </td>
              <td>
                <Select
                  options={optionsType[item.equipment?.value] || []}
                  value={item.type}
                  onChange={(selectedOption) =>
                    handleSelectChange(item.id, "type", selectedOption)
                  }
                  placeholder="Select equipment type"
                  isSearchable={true}
                  className="w-100"
                />
              </td>
              <td>
                <Select
                  options={filteredIDOptions[item.id] || []}
                  value={item.equipmentID}
                  onChange={(selectedOption) =>
                    handleSelectChange(item.id, "equipmentID", selectedOption)
                  }
                  placeholder="Select equipment ID"
                  isSearchable={true}
                  className="w-100"
                
                />
              </td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDeleteRow(item.id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Equipment;
