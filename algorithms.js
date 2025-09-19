function dijkstra(graph, sourceId, targetId) {
    const dist = new Map(),
        prev = new Map();
    for (const k of graph.nodes.keys()) { dist.set(k, Infinity);
        prev.set(k, null); }
    dist.set(sourceId, 0);
    const pq = new MinHeap();
    pq.push(sourceId, 0);

    while (!pq.isEmpty()) {
        const { item: u, priority: du } = pq.pop();
        if (du !== dist.get(u)) continue;
        if (u === targetId) break;
        for (const e of graph.adj.get(u) || []) {
            const alt = dist.get(u) + e.weight;
            if (alt < dist.get(e.to)) { dist.set(e.to, alt);
                prev.set(e.to, u);
                pq.push(e.to, alt); }
        }
    }

    if (dist.get(targetId) === Infinity) return null;
    const path = [];
    let cur = targetId;
    while (cur !== null) { path.push(cur);
        cur = prev.get(cur); }
    path.reverse();
    return { path, distance: dist.get(targetId) };
}

function astar(graph, sourceId, targetId) {
    const start = graph.nodes.get(sourceId),
        goal = graph.nodes.get(targetId);
    const heuristic = (id) => haversine([graph.nodes.get(id).lat, graph.nodes.get(id).lon], [goal.lat, goal.lon]);
    const g = new Map(),
        f = new Map(),
        prev = new Map();
    for (const k of graph.nodes.keys()) { g.set(k, Infinity);
        f.set(k, Infinity);
        prev.set(k, null); }
    g.set(sourceId, 0);
    f.set(sourceId, heuristic(sourceId));
    const open = new MinHeap();
    open.push(sourceId, f.get(sourceId));

    while (!open.isEmpty()) {
        const { item: u } = open.pop();
        if (u === targetId) break;
        for (const e of graph.adj.get(u) || []) {
            const tentative_g = g.get(u) + e.weight;
            if (tentative_g < g.get(e.to)) {
                prev.set(e.to, u);
                g.set(e.to, tentative_g);
                f.set(e.to, tentative_g + heuristic(e.to));
                open.push(e.to, f.get(e.to));
            }
        }
    }

    if (g.get(targetId) === Infinity) return null;
    const path = [];
    let cur = targetId;
    while (cur !== null) { path.push(cur);
        cur = prev.get(cur); }
    path.reverse();
    return { path, distance: g.get(targetId) };
}

function bellmanFord(graph, sourceId, targetId) {
    const dist = new Map(),
        prev = new Map();
    for (const k of graph.nodes.keys()) { dist.set(k, Infinity);
        prev.set(k, null); }
    dist.set(sourceId, 0);
    const nodes = Array.from(graph.nodes.keys());
    for (let i = 0; i < nodes.length - 1; i++) {
        let updated = false;
        for (const u of nodes) {
            for (const e of graph.adj.get(u) || []) {
                if (dist.get(u) + e.weight < dist.get(e.to)) { dist.set(e.to, dist.get(u) + e.weight);
                    prev.set(e.to, u);
                    updated = true; }
            }
        }
        if (!updated) break;
    }
    if (dist.get(targetId) === Infinity) return null;
    const path = [];
    let cur = targetId;
    while (cur !== null) { path.push(cur);
        cur = prev.get(cur); }
    path.reverse();
    return { path, distance: dist.get(targetId) };
}