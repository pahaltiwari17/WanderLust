console.log("Map script loaded");

if (!listing || !listing.geometry) {
    console.log("No geometry found");
} else {

    const coords = listing.geometry.coordinates;

    console.log("Coordinates:", coords);

    const map = L.map('map').setView([coords[1], coords[0]], 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    L.marker([coords[1], coords[0]])
        .addTo(map)
        .bindPopup("Exact location")
        .openPopup();
}