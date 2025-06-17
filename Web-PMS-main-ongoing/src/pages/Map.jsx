import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import L, { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import "./Map.css";
import "esri-leaflet";
import "esri-leaflet-geocoder";
import "leaflet-search";
import "leaflet-search/dist/leaflet-search.src.css";
import Papa from "papaparse";
import axios from "axios";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";


function Map() {
  const mapRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil email user dari localStorage
        const userEmail = localStorage.getItem("email");
        if (!userEmail) {
          console.warn("Email user tidak ditemukan di localStorage");
          return;
        }
  
        // Fetch projectstatus dari server
        const projectResponse = await axios.get("http://103.163.184.111:3000/projectstatus");
        let projectData = projectResponse.data;
  
        // Filter hanya proyek yang sesuai dengan email user
        projectData = projectData.filter(project => project.email === userEmail);
  
        // Fetch regencies.csv dan parse
        const regenciesResponse = await fetch("/regencies.csv");
        const regenciesText = await regenciesResponse.text();
        const regencies = Papa.parse(regenciesText, { header: true }).data;
  
        // Map projectstatus data dengan koordinat dari regencies.csv
        const mappedData = projectData.map((project) => {
          const matchedCity = regencies.find((reg) => reg.city.toLowerCase() === project.city.toLowerCase());
          if (matchedCity) {
            return {
              loc: [parseFloat(matchedCity.latitude), parseFloat(matchedCity.longitude)],
              title: project.project_code,
            };
          }
          return null;
        }).filter(Boolean);
  
        setData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  useEffect(() => {
    if (!mapRef.current || data.length === 0) return;
  
    // Inisialisasi peta
    const map = L.map(mapRef.current, {
      center: data[0].loc,
      zoom: 9,
    });
  
    // Custom Icon
    const customIcon = new Icon({
      iconUrl: process.env.PUBLIC_URL + "/location.png",
      iconSize: [38, 38],
    });
  
    // Tambahkan Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  
    // Tambahkan Marker Cluster
    const markersLayer = L.markerClusterGroup();
    map.addLayer(markersLayer);
  
    // Search Control
    const controlSearch = new L.Control.Search({
      position: "topright",
      layer: markersLayer,
      initial: false,
      zoom: 12,
      marker: false,
    });
  
    controlSearch.on("search:locationfound", (e) => {
      e.layer.openPopup();
    });
  
    map.addControl(controlSearch);
  
    // Offset untuk menghindari marker yang bertumpuk
    const offsetAmount = 0.0005;
    const cityOffsetMap = {};
  
    data.forEach(({ loc, title }) => {
      const [lat, lon] = loc;
  
      // Tambahkan sedikit offset jika kota sudah ada sebelumnya
      if (cityOffsetMap[title]) {
        cityOffsetMap[title] += offsetAmount;
      } else {
        cityOffsetMap[title] = 0;
      }
  
      const newLat = lat + cityOffsetMap[title];
      const newLon = lon + cityOffsetMap[title];
  
      // Tambahkan Marker ke Cluster Group
      const marker = L.marker([newLat, newLon], { icon: customIcon, title })
        .bindPopup(`Project: ${title}`);
  
      markersLayer.addLayer(marker);
    });
  
    return () => {
      map.remove();
    };
  }, [data]);
  

  return (
    <div className="container-map">
      <div ref={mapRef} className="map"></div>
    </div>
  );
}

export default Map;

