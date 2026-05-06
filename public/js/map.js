// var map = L.map('map').setView([28.6448, 77.2167], 13);
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);
// L.marker([28.6448, 77.2167])
//   .addTo(map)
//   .bindPopup("This is New Delhi")
//   .openPopup();
// console.log(coordinates);

console.log(coordinates);

// get from DB
const [lng, lat] = coordinates;

// create map ONCE
const map = L.map('map').setView([lat, lng], 13);

// add tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

//add marker
L.marker([lat, lng])
  .addTo(map)
  .bindPopup(`
    <h4>${listing.title}</h4>
    <p>${listing.location}</p>
  `)
  .openPopup();
// L.marker([lat, lng])
//   .addTo(map)
//   .bindPopup("TEST POPUP")
//   .openPopup();