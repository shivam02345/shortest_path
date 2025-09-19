document.getElementById('loadGraph').addEventListener('click', async() => {
    const center = map.getCenter();
    const radiusKm = parseFloat(document.getElementById('radius').value) || 1;
    log('Fetching OSM around', center.lat.toFixed(5), center.lng.toFixed(5), `radius=${radiusKm}km`);
    try {
        const bbox = getBBoxFromCenter(center.lat, center.lng, radiusKm);
        const query = `[out:json][timeout:25];(way["highway"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});>;);out body;`;
        const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query });
        if (!res.ok) throw new Error('Overpass fetch failed: ' + res.status);
        const json = await res.json();
        graph = buildGraphFromOSM(json);
        log('Graph built. Nodes:', graph.nodes.size, 'Adj lists:', graph.adj.size);
        drawGraph(graph);
    } catch (err) { log('Error loading graph:', err.message);
        console.error(err); }
});

function drawGraph(graph) {
    graphLayer.clearLayers();
    nodeMarkers.clear();
    let edgeCount = 0;
    for (const [u, neighbors] of graph.adj.entries()) {
        const a = graph.nodes.get(u);
        for (const e of neighbors) {
            if (u < e.to) {
                const b = graph.nodes.get(e.to);
                L.polyline([
                    [a.lat, a.lon],
                    [b.lat, b.lon]
                ], { weight: 1, opacity: 0.25 }).addTo(graphLayer);
                edgeCount++;
            }
        }
    }
    let i = 0;
    for (const [id, coord] of graph.nodes.entries()) {
        if (i % 20 === 0) {
            const m = L.circleMarker([coord.lat, coord.lon], { radius: 2, opacity: 0.7 }).addTo(graphLayer);
            nodeMarkers.set(id, m);
        }
        i++;
    }
    log('Drawn edges:', edgeCount, 'visible node markers:', nodeMarkers.size);
}

map.on('click', e => {
    if (!placing) return;
    if (placing === 'start') {
        if (startMarker) map.removeLayer(startMarker);
        startMarker = L.marker(e.latlng, { draggable: true }).addTo(map).bindPopup('Start').openPopup();
        placing = null;
        log('Start set at', e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
    } else if (placing === 'end') {
        if (endMarker) map.removeLayer(endMarker);
        endMarker = L.marker(e.latlng, { draggable: true }).addTo(map).bindPopup('End').openPopup();
        placing = null;
        log('End set at', e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
    }
});

document.getElementById('setStart').addEventListener('click', () => { placing = 'start';
    log('Click map to place START'); });
document.getElementById('setEnd').addEventListener('click', () => { placing = 'end';
    log('Click map to place END'); });

document.getElementById('findPath').addEventListener('click', () => {
    routeLayer.clearLayers();
    if (!graph) { log('Graph not loaded.'); return; }
    if (!startMarker || !endMarker) { log('Place both start and end markers first.'); return; }
    const sLatLng = startMarker.getLatLng(),
        eLatLng = endMarker.getLatLng();
    const sourceId = findNearestNodeId(graph, [sLatLng.lat, sLatLng.lng]);
    const targetId = findNearestNodeId(graph, [eLatLng.lat, eLatLng.lng]);
    log('Nearest nodes:', sourceId, 'and', targetId);
    const algo = document.getElementById('algorithm').value;
    let result = null;
    const t0 = performance.now();
    if (algo === 'dijkstra') result = dijkstra(graph, sourceId, targetId);
    else if (algo === 'astar') result = astar(graph, sourceId, targetId);
    else if (algo === 'bellmanford') result = bellmanFord(graph, sourceId, targetId);
    const t1 = performance.now();
    if (!result) { log('No route found.'); return; }
    const latlngs = result.path.map(id => [graph.nodes.get(id).lat, graph.nodes.get(id).lon]);
    L.polyline(latlngs, { weight: 5, opacity: 0.9 }).addTo(routeLayer);
    map.fitBounds(L.polyline(latlngs).getBounds(), { padding: [50, 50] });
    log(`${algo} done — path nodes: ${result.path.length} — distance: ${(result.distance/1000).toFixed(3)} km — took ${Math.round(t1-t0)} ms`);
});

document.getElementById('clear').addEventListener('click', () => {
    graphLayer.clearLayers();
    routeLayer.clearLayers();
    if (startMarker) map.removeLayer(startMarker);
    if (endMarker) map.removeLayer(endMarker);
    graph = null;
    startMarker = endMarker = null;
    log('Cleared.');
});

log('Ready. Click "Load graph" to fetch OSM highways, then set Start/End and Find Path.');