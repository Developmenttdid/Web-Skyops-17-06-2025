import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./projectstatus.css";
import Select from "react-select";
import * as toGeoJSON from "togeojson";
import "leaflet-geometryutil";
import { csv } from "d3-fetch";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

function ProjectStatus() {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [projectCodeError, setProjectCodeError] = useState("");
  const [existingProjectCodes, setExistingProjectCodes] = useState([]);
  const [isCheckingUniqueness, setIsCheckingUniqueness] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [kmlLayer, setKmlLayer] = useState(null);
  const [isKmlChecked, setIsKmlChecked] = useState(false);
  const [isKmlAccepted, setIsKmlAccepted] = useState(false);
  const [projectCode, setProjectCode] = useState(
    localStorage.getItem("projectCode") || ""
  );
  

  useEffect(() => {
    localStorage.setItem("projectCode", projectCode);
  }, [projectCode]);

  useEffect(() => {
    initializeMap();
  }, []);


  const initializeMap = () => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([0, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      const customIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      markerRef.current = L.marker([0, 0], {
        draggable: true,
        icon: customIcon,
      }).addTo(mapRef.current);

      markerRef.current.on("dragend", function (event) {
        const { lat, lng } = event.target.getLatLng();
        updateLocation(lat, lng);
      });

      mapRef.current.on("click", function (event) {
        const { lat, lng } = event.latlng;
        updateLocation(lat, lng);
      });
    }
  };

  const updateLocation = async (lat, lng) => {
    setLocation(`${lat}, ${lng}`);
    markerRef.current.setLatLng([lat, lng]);
    mapRef.current.setView([lat, lng], 13);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      let cityName = data.address?.city || data.address?.town || data.address?.village || "Unknown";
      if (cityName.startsWith("City of ")) {
        cityName = cityName.replace("City of ", "");
      }
      setCity(cityName);
    } catch (error) {
      console.error("Error fetching city name:", error);
      setCity("Unknown");
    }
  };

  const validateAndLoadKml = (kml) => {
    try {
      const geojson = toGeoJSON.kml(kml);

      if (!geojson.features.length || !geojson.features[0].geometry?.coordinates?.[0]) {
        throw new Error("Invalid KML structure");
      }

      const coordinates = geojson.features[0].geometry.coordinates;
      const latLngs = [];

      if (geojson.features[0].geometry.type === "Polygon") {
        coordinates[0].forEach(coord => latLngs.push([coord[1], coord[0]]));
      } else if (geojson.features[0].geometry.type === "MultiPolygon") {
        coordinates.forEach(polygon => {
          polygon[0].forEach(coord => latLngs.push([coord[1], coord[0]]));
        });
      } else {
        console.error("Invalid geometry type:", geojson.features[0].geometry.type);
        return;
      }

      if (kmlLayer) {
        mapRef.current.removeLayer(kmlLayer);
      }

      const newKmlLayer = L.polygon(latLngs).addTo(mapRef.current);
      setKmlLayer(newKmlLayer);
      const center = newKmlLayer.getBounds().getCenter();
      updateLocation(center.lat, center.lng);

      // **Check if L.GeometryUtil exists and calculate area**
      if (L.GeometryUtil?.geodesicArea) {
        const latLngsArray = newKmlLayer.getLatLngs();
        console.log("LatLngs Array:", latLngsArray);

        if (latLngsArray.length > 0) {
          const calculatedArea = (L.GeometryUtil.geodesicArea(latLngsArray[0]) / 10000).toFixed(2);
          console.log("Calculated Area:", calculatedArea);
          setArea(calculatedArea);
        } else {
          console.warn("No valid coordinates found for area calculation.");
          setArea("N/A");
        }
      } else {
        console.warn("L.GeometryUtil.geodesicArea is not available");
        setArea("N/A");
      }
    } catch (error) {
      handleDeleteKmlLayer();
      alert("KML File not supported. Please input the coordinates manually.");
    }
  };

  // Fetch existing projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);
      try {
        const response = await fetch("http://103.163.184.111:3000/projectstatus");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setExistingProjectCodes(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjectCodeError("Failed to verify project code uniqueness");
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Validate project code whenever it changes
  useEffect(() => {
    validateProjectCode(projectCode);
  }, [projectCode, existingProjectCodes]);

  const validateProjectCode = async (code) => {
    // Reset error
    setProjectCodeError("");

    // Rule 1: No spaces allowed
    // if (/\s/.test(code)) {
    //   setProjectCodeError("Spaces are not allowed in project code");
    //   return false;
    // }

    // Rule 2: Only allow certain symbols (_, -, +)
    // if (/[^a-zA-Z0-9_\-+]/.test(code)) {
    //   setProjectCodeError("Only letters, numbers, and _ - + symbols are allowed");
    //   return false;
    // }

    // Rule 3: Must be uppercase
    // if (code !== code.toUpperCase()) {
    //   setProjectCodeError("Project code must be in uppercase letters");
    //   return false;
    // }

    // Rule 3: Check uniqueness against fetched projects
    const isDuplicate = existingProjectCodes.some(
      project => project.project_code?.toUpperCase() === code.toUpperCase()
    );
    
    if (isDuplicate) {
      setProjectCodeError("Project code already exists");
      return false;
    }

    // If all validations pass
    return true;
  };

  const handleProjectCodeChange = (e) => {
    const value = e.target.value;
    setProjectCode(value);
  };

  const handleDeleteKmlLayer = () => {
    if (kmlLayer) {
      mapRef.current.removeLayer(kmlLayer);
      setKmlLayer(null);
    }
    setLocation("");
    setArea("");
    setCity("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    markerRef.current.setLatLng([0, 0]);
    mapRef.current.setView([0, 0], 2);
    initializeMap();
    setIsKmlChecked(false);
    setIsKmlAccepted(false);
  };

  const handleCheckKmlLayer = () => {
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const kml = new DOMParser().parseFromString(e.target.result, "application/xml");
          const geojson = toGeoJSON.kml(kml);

          console.log("Parsed GeoJSON:", geojson); // Debugging: See actual structure

          if (!geojson.features || !Array.isArray(geojson.features) || geojson.features.length === 0) {
            throw new Error("Invalid KML file: No features found.");
          }

          let centerPoint = null;

          for (const feature of geojson.features) {
            if (!feature.geometry || !feature.geometry.type || !feature.geometry.coordinates) {
              continue;
            }

            if (feature.geometry.type === "Polygon" || feature.geometry.type === "LineString") {
              if (
                Array.isArray(feature.geometry.coordinates) &&
                feature.geometry.coordinates.length > 0 &&
                Array.isArray(feature.geometry.coordinates[0]) &&
                feature.geometry.coordinates[0].length > 2
              ) {
                const coordinates = feature.geometry.coordinates[0];
                const midIndex = Math.floor(coordinates.length / 2);
                centerPoint = coordinates[midIndex]
                  ? [coordinates[midIndex][1], coordinates[midIndex][0]]
                  : null;
              }
            } else if (feature.geometry.type === "Point") {
              if (
                Array.isArray(feature.geometry.coordinates) &&
                feature.geometry.coordinates.length === 2
              ) {
                centerPoint = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
              }
            }

            if (centerPoint) break; // Stop checking once we find a valid center point
          }

          // STRICT VALIDATION: Reject if centerPoint is still null, undefined, or invalid
          if (!centerPoint || centerPoint.includes(undefined) || centerPoint.includes(null)) {
            throw new Error("Cannot determine center point. Invalid or incomplete KML data.");
          }

          alert(`KML file is accepted. Center point: ${centerPoint[0]}, ${centerPoint[1]}`);
          setIsKmlChecked(true);
          setIsKmlAccepted(true);
        } catch (error) {
          console.error("Error parsing KML:", error);
          alert("KML file is unsupported or contains invalid data. Please check the file.");
          setIsKmlChecked(true);
          setIsKmlAccepted(false);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleAddKmlLayer = () => {
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const kml = new DOMParser().parseFromString(e.target.result, "application/xml");
          validateAndLoadKml(kml);
        } catch (error) {
          alert("Error processing KML file. Please ensure it is a valid KML file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleManualCoordinates = async (e) => {
    const value = e.target.value;
    setLocation(value);

    try {
      const [lat, lng] = value.split(",").map(Number);
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates format");
      }

      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.setView([lat, lng], 13);

      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      let cityName = data.address?.city || data.address?.town || data.address?.village || "Unknown";
      if (cityName.startsWith("City of ")) {
        cityName = cityName.replace("City of ", "");
      }
      setCity(cityName);
    } catch (error) {
      console.error("Error processing manual coordinates:", error);
      alert("Error processing manual coordinates. Please ensure they are in the correct format.");
    }
  };

  const [selectedOption, setSelectedOption] = useState(() => {
    try {
      const storedOption = localStorage.getItem("selectedOption");
      return storedOption ? JSON.parse(storedOption) : null;
    } catch (error) {
      console.error("Error parsing storedOption:", error);
      return null;
    }
  });

  useEffect(() => {
    if (selectedOption) {
      localStorage.setItem("selectedOption", JSON.stringify(selectedOption)); 
    } else {
      localStorage.removeItem("selectedOption"); 
    }
  }, [selectedOption]);

  const [selectedOption2, setSelectedOption2] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedOption3, setSelectedOption3] = useState(() => {
    try {
      const storedCity = localStorage.getItem("selectedCity");
      return storedCity ? JSON.parse(storedCity) : null;
    } catch (error) {
      console.error("Error parsing selectedCity:", error);
      return null;
    }
  });

  document.body.style.overflowY = "auto";
  document.body.style.overflowX = "hidden";

  const Projectoptions = [
    { value: "1", label: "Inspection" },
    { value: "2", label: "Survey" },
    { value: "3", label: "Training" },
    { value: "4", label: "Hardware Selling" },
    { value: "5", label: "Other" },
  ];

  const Deliverableoptions = [
    { value: "1", label: "Report" },
    { value: "2", label: "Data Analysis" },
    { value: "3", label: "Presentation" },
  ];

  useEffect(() => {
    csv("/regencies.csv")
      .then((data) => {
        console.log("Parsed CSV Data:", data);

        // Get the correct key name (first row's keys)
        const keys = Object.keys(data[0]);
        console.log("CSV Column Keys:", keys);

        if (keys.length < 3) {
          console.error("CSV file does not have the expected number of columns.");
          return;
        }

        const cityColumn = keys[2]; // Third column (City names)

        const cities = data
          .map((row) => row[cityColumn])
          .filter((city) => city)
          .map((city) => ({ label: city.trim(), value: city.trim() }));

        console.log("Formatted Cities:", cities);
        setCityOptions(cities);
      })
      .catch((error) => console.error("Error loading CSV:", error));
  }, []);

  useEffect(() => {
    if (selectedOption3) {
      localStorage.setItem("selectedCity", JSON.stringify(selectedOption3));
    } else {
      localStorage.removeItem("selectedCity");
    }
  }, [selectedOption3]);
  

  return (
    <div className="add-project" style={{ marginLeft: "250px" }}>
      <h2 className="project-title">Project Status</h2>
      <div className="form-group row d-flex align-items-center column-gap-1">
         <div className="col mb-3 ms-3">
          <label className="form-label">Project Code</label>
          <input
            type="text"
            className={`form-control ${projectCodeError ? "is-invalid" : ""}`}
            placeholder="Project Code"
            value={projectCode}
            onChange={handleProjectCodeChange}
            style={{
              borderColor: projectCodeError ? "red" : "",
              //textTransform: "uppercase"
            }}
          />
          {projectCodeError && (
            <div className="invalid-feedback" style={{ color: "red", fontSize: "0.8rem" }}>
              {projectCodeError}
            </div>
          )}
        </div>
        <div className="col mb-3 ms-3">
          <label className="form-label">Project Type</label>
          <Select
            options={Projectoptions}
            value={selectedOption}
            onChange={setSelectedOption} 
            placeholder="Select project type"
            isSearchable={true}
            className="w-100"
          />
        </div>
        <div className="col mb-3 ms-3">
          <label className="form-label">City</label>
          <Select
            options={cityOptions}
            value={selectedOption3}
            onChange={setSelectedOption3}
            placeholder="Select a City"
            isSearchable={true}
            className="w-100"
          />
        </div>
      </div>
      <div className="form-group row d-flex align-items-center column-gap-1">
        <div className="col ms-3">
          <label className="form-label text-danger">Upload AOI</label>
          <div className="d-flex align-items-center">
            <input className="form-control" type="file" ref={fileInputRef} />
            <button type="button" className="btn btn-warning ms-2" onClick={handleCheckKmlLayer}>
              <i className="bi bi-eye"></i>
            </button>
            <button type="button" className="btn btn-primary ms-2" onClick={handleAddKmlLayer} disabled={!isKmlChecked || !isKmlAccepted}>
              <i className="bi bi-plus"></i>
            </button>
            <button type="button" className="btn btn-danger ms-2" onClick={handleDeleteKmlLayer} disabled={!isKmlChecked || !isKmlAccepted}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <div className="col ms-3">
          <label className="form-label text-danger">Area Calculation</label>
          <div className="input-group">
            <input className="form-control" type="text" value={area} readOnly />
            <span className="input-group-text">ha</span>
          </div>
        </div>
        <label className="form-label ms-3 text-danger">Insert Location Coordinates</label>
        <input
          className="form-control ms-4"
          type="text"
          value={location}
          onChange={handleManualCoordinates}
          style={{ width: "98%" }}
        />
        <label className="form-label ms-3 text-danger">City Information</label>
        <input className="form-control mb-3 ms-4"  style={{ width: "98%" }} id="cityinfo" type="text" value={city} readOnly />
        <div id="map" className="ms-3" style={{ height: "300px", width: "100%" }}></div>
      </div>
      <div className="d-flex align-items-start column-gap-3 mt-3">
        <div className="flex-grow-1">
          <label className="form-label text-danger">Objective</label>
          <div className="form-floating">
            <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2"></textarea>
            <label htmlFor="floatingTextarea2">Project description</label>
          </div>
        </div>
        <div className="flex-grow-1">
          <label className="form-label text-danger">Deliverables</label>
          <div className="d-flex align-items-center">
            <Select
              options={Deliverableoptions}
              value={selectedOption2}
              onChange={setSelectedOption2}
              placeholder="Select Deliverables"
              isSearchable={true}
              className="w-100"
            />
            <button type="button" className="btn btn-primary ms-2">
              <i className="bi bi-plus"></i>
            </button>
          </div>
          <table className="table text-center table-bordered mt-3" style={{ borderColor: '#143893' }}>
            <thead>
              <tr>
                <th scope="col" style={{ width: '10%', backgroundColor: '#143893', color: '#CCE6FF' }}>#</th>
                <th scope="col" style={{ width: '80%', backgroundColor: '#143893', color: '#CCE6FF' }}>Deliverable list</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProjectStatus;