import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Helper forces both lat/lng to be numbers, defaulting to Indore
function safePosition(lat?: number, lng?: number): [number, number] {
  // Indore: [22.7196, 75.8577]
  const safeLat = typeof lat === "number" && Number.isFinite(lat) ? lat : 22.7196;
  const safeLng = typeof lng === "number" && Number.isFinite(lng) ? lng : 75.8577;
  return [safeLat, safeLng];
}

type MapPickerProps = {
  lat?: number;
  lng?: number;
  onChange: (pos: { lat?: number; lng?: number }) => void;
};

export default function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const position = safePosition(lat, lng);

  function SetMarkerOnMapClick() {
    useMapEvents({
      click(e) {
        onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    });
    return null;
  }

  // Only show marker if both lat and lng are finite numbers
  const showMarker = Number.isFinite(lat) && Number.isFinite(lng);

  return (
    <div style={{
      border: "1px solid #32B8C6",
      borderRadius: 10,
      background: "#F8F9FA",
      padding: 16,
      margin: "20px 0"
    }}>
      <div style={{ height: 210, borderRadius: 10, overflow: "hidden" }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "210px", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SetMarkerOnMapClick />
          {showMarker && <Marker position={[lat as number, lng as number]} />}
        </MapContainer>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <label style={{ color: "#21808D", fontWeight: 700 }}>
          Latitude:
          <input
            type="number"
            value={lat ?? ""}
            onChange={e => {
              // Pass undefined if input is empty
              const value = e.target.value === "" ? undefined : parseFloat(e.target.value);
              onChange({ lat: value, lng });
            }}
            style={{
              marginLeft: 7,
              borderRadius: 6,
              border: "1px solid #32B8C6",
              padding: "6px 12px",
              fontWeight: 700,
              width: 120
            }}
            step="any"
          />
        </label>
        <label style={{ color: "#21808D", fontWeight: 700 }}>
          Longitude:
          <input
            type="number"
            value={lng ?? ""}
            onChange={e => {
              const value = e.target.value === "" ? undefined : parseFloat(e.target.value);
              onChange({ lat, lng: value });
            }}
            style={{
              marginLeft: 7,
              borderRadius: 6,
              border: "1px solid #32B8C6",
              padding: "6px 12px",
              fontWeight: 700,
              width: 120
            }}
            step="any"
          />
        </label>
      </div>
      <div style={{ fontSize: 12, color: "#626C71", marginTop: 9 }}>
        Click the map to set branch location.
      </div>
    </div>
  );
}
