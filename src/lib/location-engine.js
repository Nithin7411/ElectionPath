"use client";

// Simple bounding box mapping for Indian States
// This is a naive approximation for demonstration.
const STATE_BOUNDS = [
  { state: "Andhra Pradesh", minLat: 12.6, maxLat: 19.9, minLng: 76.7, maxLng: 84.8 },
  { state: "Maharashtra", minLat: 15.6, maxLat: 22.0, minLng: 72.6, maxLng: 80.9 },
  { state: "Delhi", minLat: 28.4, maxLat: 28.9, minLng: 76.8, maxLng: 77.3 },
  { state: "Bihar", minLat: 24.2, maxLat: 27.5, minLng: 83.3, maxLng: 88.2 },
  { state: "Tamil Nadu", minLat: 8.0, maxLat: 13.5, minLng: 76.2, maxLng: 80.3 },
  { state: "Kerala", minLat: 8.2, maxLat: 12.8, minLng: 74.8, maxLng: 77.5 },
  { state: "West Bengal", minLat: 21.6, maxLat: 27.2, minLng: 85.8, maxLng: 89.8 },
  { state: "Assam", minLat: 24.1, maxLat: 27.9, minLng: 89.6, maxLng: 96.0 },
  // Default bounds covering roughly the rest
];

export function coordinatesToState(lat, lng) {
  for (const bounds of STATE_BOUNDS) {
    if (lat >= bounds.minLat && lat <= bounds.maxLat && 
        lng >= bounds.minLng && lng <= bounds.maxLng) {
      return bounds.state;
    }
  }
  return "Unknown Region";
}

export function detectLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const state = coordinatesToState(position.coords.latitude, position.coords.longitude);
        resolve({ state, lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export const ALL_INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir"
];
