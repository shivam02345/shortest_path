const map = L.map('map').setView([28.6139, 77.2090], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

let graph = null,
    graphLayer = L.layerGroup().addTo(map),
    routeLayer = L.layerGroup().addTo(map);
let nodeMarkers = new Map(),
    startMarker = null,
    endMarker = null,
    placing = null;

function getBBoxFromCenter(lat, lon, radKm) {
    const R = 6371;
    const d = radKm;
    const latR = lat * Math.PI / 180;
    const minLat = lat - (d / R) * (180 / Math.PI),
        maxLat = lat + (d / R) * (180 / Math.PI);
    const minLon = lon - (d / R) * (180 / Math.PI) / Math.cos(latR),
        maxLon = lon + (d / R) * (180 / Math.PI) / Math.cos(latR);
    return { south: minLat, west: minLon, north: maxLat, east: maxLon };
}

function findNearestNodeId(graph, [lat, lon]) {
    let best = null,
        bestDist = Infinity;
    for (const [id, coord] of graph.nodes.entries()) {
        const d = haversine([lat, lon], [coord.lat, coord.lon]);
        if (d < bestDist) { bestDist = d;
            best = id; }
    }
    return best;
}