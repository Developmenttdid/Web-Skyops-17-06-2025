// confignav_db awal, yg update projectstatus ud bs, yg equipment on progress
import { useLocation, useNavigate } from "react-router-dom";

const ConfigNav_db = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmitProject = async (event) => {
    event.preventDefault();

    // Get all data from localStorage
  const projectCode = localStorage.getItem("projectCode");
  const selectedOption = JSON.parse(localStorage.getItem("selectedOption"));
  const selectedCity = JSON.parse(localStorage.getItem("selectedCity"));
  const originalProjectCode = localStorage.getItem("originalProjectCode");
  const email = localStorage.getItem("email");
  const equipmentList = JSON.parse(localStorage.getItem("equipmentList")) || [];

   // Personnel data with project-specific key
    const personnelKey = `personnelList_${localStorage.getItem("projectCode")}`;
    const personnelList = JSON.parse(localStorage.getItem(personnelKey)) || [];
    const existingPersonnel = JSON.parse(localStorage.getItem("existingPersonnel")) || [];



  // Debug logs
  console.log("Project data:", {
    projectCode,
    selectedOption: selectedOption?.label,
    selectedCity: selectedCity?.label,
    originalProjectCode,
    email 
  });
  console.log("Equipment list:", equipmentList);

  // Validate required data
  if (!projectCode || !originalProjectCode) {
    alert("No project data to save!");
    return;
  }

  try {
    // 1. First update project status
    const projectStatusResponse = await fetch(`http://103.163.184.111:3000/projectstatus`);
    if (!projectStatusResponse.ok) throw new Error("Failed to fetch projects");
    
    const allProjects = await projectStatusResponse.json();
    const projectToUpdate = allProjects.find(p => p.project_code === originalProjectCode);
    
    if (!projectToUpdate) throw new Error(`Project ${originalProjectCode} not found`);
    
    const updateProjectResponse = await fetch(
      `http://103.163.184.111:3000/projectstatus/${projectToUpdate.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_code: projectCode,
          project_type: selectedOption?.label || "",
          city: selectedCity?.label || "",
          email: email
        })
      }
    );

    if (!updateProjectResponse.ok) {
      const error = await updateProjectResponse.json();
      throw new Error(error.message || "Failed to update project status");
    }

    console.log("Project status updated successfully");

    // 2. Then update equipment
    // Fetch all equipment, filter by originalProjectCode, update project_code if needed
    const equipmentFetchResponse = await fetch("http://103.163.184.111:3000/project_equipment");
    if (!equipmentFetchResponse.ok) throw new Error("Failed to fetch equipment");

    const allEquipment = await equipmentFetchResponse.json();
    const equipmentToUpdate = allEquipment.filter(eq => eq.project_code === originalProjectCode);

    // Update project_code for all equipment with originalProjectCode
    await Promise.all(
      equipmentToUpdate.map(eq =>
        fetch(`http://103.163.184.111:3000/project_equipment/${eq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...eq, project_code: projectCode })
        })
      )
    );

    const equipmentEndpoint = "http://103.163.184.111:3000/project_equipment";
    
    for (const item of equipmentList) {
      const payload = {
        project_code: projectCode,
        equipment_name: item.equipment?.label || "",
        equipment_type: item.type?.value || "",
        equipment_id: item.equipmentID?.value || "",
        email: email
      };

      if (item.realId) {
        // Update existing equipment
        const response = await fetch(`${equipmentEndpoint}/${item.realId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error(`Failed to update equipment ${item.realId}:`, error);
        }
      } else {
        // Add new equipment
        const response = await fetch(equipmentEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project_equipment: [payload] })
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error("Failed to add equipment:", error);
        }
      }
    }

// 3. Update Personnel - Hybrid Approach
// try {
//   // 1. Fetch semua personnel dari database
//   const personnelResponse = await fetch(`http://103.163.184.111:3000/personnel`);
//   if (!personnelResponse.ok) throw new Error("Gagal fetch personnel");
  
//   const allPersonnel = await personnelResponse.json();
  
//   // 2. Filter personnel berdasarkan originalProjectCode (untuk migrasi project_code)
//   const personnelToMigrate = allPersonnel.filter(p => p.project_code === originalProjectCode);
  
//   // 3. Logika update lama (untuk edit data)
//   // const personnelKey = `personnelList_${projectCode}`;
//   // const personnelList = JSON.parse(localStorage.getItem(personnelKey)) || [];
//   // Selalu ambil dari original projectCode, karena itu yang tersimpan di localStorage sebelum disubmit
// const personnelKeyOriginal = `personnelList_${originalProjectCode}`;
// const personnelList = JSON.parse(localStorage.getItem(personnelKeyOriginal)) || [];

//   const existingPersonnel = JSON.parse(localStorage.getItem("existingPersonnel")) || [];

//   const personnelUpdates = {
//     toCreate: [],
//     toUpdate: [],
//     toDelete: []
//   };

//   // Identifikasi personnel yang dihapus
//   // existingPersonnel.forEach(ep => {
//   //   if (!personnelList.some(p => p.realId === ep.id)) {
//   //     personnelUpdates.toDelete.push(ep.id);
//   //   }
//   // });
//   if (originalProjectCode === projectCode) {
//   // Hanya jalankan logika delete jika project_code tidak berubah
//   existingPersonnel.forEach(ep => {
//     if (!personnelList.some(p => p.realId === ep.id)) {
//       personnelUpdates.toDelete.push(ep.id);
//     }
//   });
// }


//   // Siapkan data untuk create/update
//   personnelList.forEach(person => {
//     const personnelData = {
//       personnel_name: person.name?.label || person.name || "",
//       personnel_role: person.role?.label || person.role || "",
//       email: email,
//       project_code: projectCode // Gunakan projectCode baru
//     };

//     if (person.realId) {
//       // Update existing personnel
//       personnelUpdates.toUpdate.push({
//         ...personnelData,
//         id: person.realId
//       });
//     } else if ((person.name || person.name?.label) && (person.role || person.role?.label)) {
//       // Create new personnel
//       personnelUpdates.toCreate.push(personnelData);
//     }
//   });

//   // 4. Gabungkan dengan data yang perlu dimigrasi (update project_code saja)
//   personnelToMigrate.forEach(person => {
//     if (!personnelUpdates.toUpdate.some(p => p.id === person.id)) {
//       personnelUpdates.toUpdate.push({
//         ...person,
//         project_code: projectCode // Hanya update project_code
//       });
//     }
//   });

//   // 5. Eksekusi operasi database
//   // Delete
//   await Promise.all(personnelUpdates.toDelete.map(id => 
//     fetch(`http://103.163.184.111:3000/personnel/${id}`, { method: "DELETE" })
//   ));

//   // Update (termasuk migrasi project_code)
//   await Promise.all(personnelUpdates.toUpdate.map(person =>
//     fetch(`http://103.163.184.111:3000/personnel/${person.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(person)
//     })
//   ));

//   // Create
//   if (personnelUpdates.toCreate.length > 0) {
//     await fetch("http://103.163.184.111:3000/personnel", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ personnel: personnelUpdates.toCreate })
//     });
//   }

//   console.log("Personnel updated successfully!");
// } catch (error) {
//   console.error("Error updating personnel:", error);
//   throw error;
// }

// // 3. Update Personnel - Hybrid Approach
// try {
//   // 1. Fetch all personnel dari DB
//   const personnelResponse = await fetch(`http://103.163.184.111:3000/personnel`);
//   if (!personnelResponse.ok) throw new Error("Gagal fetch personnel");
//   const allPersonnel = await personnelResponse.json();

//   // 2. Filter personnel dari DB yang punya originalProjectCode
//   const personnelFromDB = allPersonnel.filter(p => p.project_code === originalProjectCode);

//   // 3. Ambil personnelList dari localStorage dengan KEY LAMA (originalProjectCode)
//   const personnelKeyOld = `personnelList_${originalProjectCode}`;
//   const personnelList = JSON.parse(localStorage.getItem(personnelKeyOld)) || [];

//   // 4. Ambil existing personnel dari localStorage (bisa dipakai untuk logika delete)
//   const existingPersonnel = JSON.parse(localStorage.getItem("existingPersonnel")) || [];

//   const personnelUpdates = {
//     toCreate: [],
//     toUpdate: [],
//     toDelete: []
//   };

//   // 5. Tentukan apakah projectCode berubah
//   const isProjectCodeChanged = projectCode !== originalProjectCode;

//   // 6. Logika DELETE → hanya dijalankan jika projectCode tidak berubah
//   if (!isProjectCodeChanged) {
//     existingPersonnel.forEach(ep => {
//       if (!personnelList.some(p => p.realId === ep.id)) {
//         personnelUpdates.toDelete.push(ep.id);
//       }
//     });
//   }

//   // 7. Logika INSERT / UPDATE dari localStorage (personnelList)
// personnelList.forEach(person => {
//   const personnelData = {
//     personnel_name: person.name?.label || person.name || "",
//     personnel_role: person.role?.label || person.role || "",
//     email: email,
//     project_code: projectCode // Gunakan projectCode baru
//   };

//   if (person.realId) {
//     // Cek apakah ID ini memang valid (masih ada di DB)
//     const matchInDB = allPersonnel.find(p => p.id === person.realId);
//     if (matchInDB) {
//       // ID valid, update datanya dan update project_code
//       personnelUpdates.toUpdate.push({
//         ...personnelData,
//         id: person.realId
//       });
//     } else {
//       // ID tidak valid, treat as new data
//       personnelUpdates.toCreate.push(personnelData);
//     }
//   } else if (personnelData.personnel_name && personnelData.personnel_role) {
//     // Create new personnel
//     personnelUpdates.toCreate.push(personnelData);
//   }
// });

// // 8. Migrasi personnel project lama ke project baru (jika belum tercover di atas)
// if (isProjectCodeChanged) {
//   personnelFromDB.forEach(person => {
//     const alreadyHandled = personnelUpdates.toUpdate.some(p => p.id === person.id)
//       || personnelUpdates.toCreate.some(p =>
//           p.personnel_name === person.personnel_name &&
//           p.personnel_role === person.personnel_role
//       );

//     if (!alreadyHandled) {
//       personnelUpdates.toUpdate.push({
//         ...person,
//         project_code: projectCode
//       });
//     }
//   });
// }


//   // 9. Eksekusi DELETE (jika ada)
//   await Promise.all(personnelUpdates.toDelete.map(id =>
//     fetch(`http://103.163.184.111:3000/personnel/${id}`, { method: "DELETE" })
//   ));

//   // 10. Eksekusi UPDATE
//   await Promise.all(personnelUpdates.toUpdate.map(person =>
//     fetch(`http://103.163.184.111:3000/personnel/${person.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(person)
//     })
//   ));

//   // 11. Eksekusi CREATE (jika ada)
//   if (personnelUpdates.toCreate.length > 0) {
//     await fetch("http://103.163.184.111:3000/personnel", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ personnel: personnelUpdates.toCreate })
//     });
//   }

//   console.log("Personnel updated successfully!");
// } catch (error) {
//   console.error("Error updating personnel:", error);
//   throw error;
// }

// 3. Update Personnel - Stable Logic for Rename + Modify
try {
  const personnelResponse = await fetch(`http://103.163.184.111:3000/personnel`);
  if (!personnelResponse.ok) throw new Error("Gagal fetch personnel");
  const allPersonnel = await personnelResponse.json();

  const personnelFromDB = allPersonnel.filter(p => p.project_code === originalProjectCode);
  const personnelList = JSON.parse(localStorage.getItem(`personnelList_${originalProjectCode}`)) || [];
  const existingPersonnel = JSON.parse(localStorage.getItem("existingPersonnel")) || [];

  const toUpdate = [];
  const toCreate = [];
  const toDelete = [];

  const isProjectCodeChanged = projectCode !== originalProjectCode;

  // Buat mapping id → DB record
  const dbMap = {};
  personnelFromDB.forEach(p => {
    dbMap[p.id] = p;
  });

  // Tangani update/create dari form (localStorage)
  for (const person of personnelList) {
    const name = person.name?.label || person.name || "";
    const role = person.role?.label || person.role || "";

    const payload = {
      personnel_name: name,
      personnel_role: role,
      email: email,
      project_code: projectCode
    };


    //const realId = person.realId || person.id; // ← fallback ke person.id
    const realId = person.realId || (!String(person.id).startsWith("temp-") ? person.id : null);

     console.log("Person:", person);
console.log("realId:", realId);

    if (realId) {
      // Update data lama
      toUpdate.push({ ...payload, id: realId });
    } else if (name && role) {
      // Tambah data baru
      toCreate.push(payload);
    }
  }

  // Jika project code berubah, pastikan sisa personnel lama juga ikut dipindah project_code-nya
  // if (isProjectCodeChanged) {
  //   for (const dbPerson of personnelFromDB) {
  //     const alreadyHandled = toUpdate.some(p => p.id === dbPerson.id);
  //     if (!alreadyHandled) {
  //       toUpdate.push({
  //         ...dbPerson,
  //         project_code: projectCode
  //       });
  //     }
  //   }
  if (isProjectCodeChanged) {
  const handledIds = toUpdate.map(p => p.id);
  for (const dbPerson of personnelFromDB) {
    if (!handledIds.includes(dbPerson.id)) {
      toUpdate.push({
        ...dbPerson,
        project_code: projectCode
      });
    }
  }
  } else {
    // Jika projectCode tidak berubah, boleh hapus yang tidak ada lagi di form
    // for (const ep of existingPersonnel) {
    //   if (!personnelList.some(p => p.realId === ep.id)) {
    //     toDelete.push(ep.id);
    //   }
    // }
    for (const ep of existingPersonnel) {
  if (!personnelList.some(p => {
    const realId = p.realId || (!String(p.id).startsWith("temp-") ? p.id : null);
    return realId === ep.id;
  })) {
    toDelete.push(ep.id);
  }
}

  }

  // DELETE
  await Promise.all(toDelete.map(id =>
    fetch(`http://103.163.184.111:3000/personnel/${id}`, { method: "DELETE" })
  ));

  // UPDATE
  await Promise.all(toUpdate.map(p =>
    fetch(`http://103.163.184.111:3000/personnel/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p)
    })
  ));

  // CREATE
  if (toCreate.length > 0) {
    await fetch("http://103.163.184.111:3000/personnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personnel: toCreate })
    });
  }

  console.log("Personnel updated successfully!");
} catch (error) {
  console.error("Error updating personnel:", error);
  throw error;
}


    console.log("All equipment processed successfully");

    // 3. Clean up and show success
    localStorage.removeItem("projectCode");
    localStorage.removeItem("selectedOption");
    localStorage.removeItem("selectedCity");
    localStorage.removeItem("originalProjectCode");
    localStorage.removeItem("equipmentList");
    localStorage.removeItem("sessionActive");
          localStorage.removeItem(personnelKey);
      localStorage.removeItem("existingPersonnel");
      localStorage.removeItem(`personnelList_${projectCode}`);
localStorage.removeItem(`personnelList_${originalProjectCode}`);


    alert("Project data saved successfully!");
    //window.location.reload();
    navigate("../Project"); 

  } catch (error) {
    console.error("Error saving project:", error);
    alert(`Failed to save project: ${error.message}`);
  }


  };

  return (
    <div
      className="nav-container d-flex flex-column flex-shrink-0 p-3 text-white position-fixed"
      style={{
        width: "250px",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      }}
    >
      <h4
        className="mt-0"
        style={{ color: "#0F0F56", fontWeight: "bold", fontSize: "1.5rem" }}
      >
        Manage Project
      </h4>
      <hr className="w-100" />
      <ul className="nav nav-pills flex-column w-100">
        <li className="nav-item">
          <a
            href="/Project/ProjectStatus_db"
            className={`nav-link ${
              location.pathname === "/Project/ProjectStatus_db" ? "active" : ""
            }`}
          >
            Project Status
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/Project/ProjectTimeline_db"
            className={`nav-link ${
              location.pathname === "/Project/ProjectTimeline_db"
                ? "active"
                : ""
            }`}
          >
            Project Timeline
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/Project/Personnel_db"
            className={`nav-link ${
              location.pathname === "/Project/Personnel_db" ? "active" : ""
            }`}
          >
            Personnel
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/Project/Equipment_db"
            className={`nav-link ${
              location.pathname === "/Project/Equipment_db" ? "active" : ""
            }`}
          >
            Equipment
          </a>
        </li>
        <li className="nav-item">
          <a
            href="/Project/LegalDocument_db"
            className={` text-danger nav-link ${
              location.pathname === "/Project/LegalDocument_db" ? "active" : ""
            }`}
          >
            Legal Document
          </a>
        </li>
        <li className="nav-item p-2 bg-success border border-success rounded-2 mt-5">
          <button
            className="text-white text-decoration-none fw-bold align-items-center d-flex justify-content-center w-100 bg-transparent border-0"
            onClick={handleSubmitProject}
          >
            Save Changes
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ConfigNav_db;
