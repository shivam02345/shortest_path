class Graph {
    constructor() {
        this.nodes = new Map(); // id -> {lat,lon}
        this.adj = new Map(); // id -> [{to,weight}]
    }
    addNode(id, lat, lon) { if (!this.nodes.has(id)) { this.nodes.set(id, { lat, lon });
            this.adj.set(id, []); } }
    addEdge(a, b, w) {
        if (!this.adj.has(a) || !this.adj.has(b)) return;
        this.adj.get(a).push({ to: b, weight: w });
        this.adj.get(b).push({ to: a, weight: w });
    }
}

function buildGraphFromOSM(osmJson) {
    const graph = new Graph();
    const nodes = new Map();
    for (const el of osmJson.elements) {
        if (el.type === 'node') {
            nodes.set(el.id, { lat: el.lat, lon: el.lon });
            graph.addNode(el.id, el.lat, el.lon);
        }
    }
    for (const el of osmJson.elements) {
        if (el.type === 'way' && el.tags && el.tags.highway) {
            const nds = el.nodes;
            for (let i = 0; i < nds.length - 1; i++) {
                const a = nds[i],
                    b = nds[i + 1];
                if (nodes.has(a) && nodes.has(b)) {
                    const acoord = [nodes.get(a).lat, nodes.get(a).lon];
                    const bcoord = [nodes.get(b).lat, nodes.get(b).lon];
                    graph.addEdge(a, b, haversine(acoord, bcoord));
                }
            }
        }
    }
    return graph;
}