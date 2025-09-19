// --- Utilities ---
function log(...args) {
    const el = document.getElementById('log');
    el.innerText = args.join(' ') + '\n' + el.innerText;
}

function haversine([lat1, lon1], [lat2, lon2]) {
    const R = 6371e3; // meters
    const toRad = Math.PI / 180;
    const phi1 = lat1 * toRad,
        phi2 = lat2 * toRad;
    const dphi = (lat2 - lat1) * toRad,
        dlambda = (lon2 - lon1) * toRad;
    const a = Math.sin(dphi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Simple min-heap for Dijkstra / A*
class MinHeap {
    constructor() { this.heap = []; }
    push(item, priority) { this.heap.push({ item, priority });
        this._siftUp(this.heap.length - 1); }
    pop() {
        if (!this.heap.length) return null;
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length) { this.heap[0] = last;
            this._siftDown(0); }
        return top;
    }
    _siftUp(i) { while (i > 0) { const p = Math.floor((i - 1) / 2); if (this.heap[p].priority <= this.heap[i].priority) break;
            [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
            i = p; } }
    _siftDown(i) {
        const n = this.heap.length;
        while (true) {
            let l = 2 * i + 1,
                r = 2 * i + 2,
                smallest = i;
            if (l < n && this.heap[l].priority < this.heap[smallest].priority) smallest = l;
            if (r < n && this.heap[r].priority < this.heap[smallest].priority) smallest = r;
            if (smallest === i) break;
            [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
            i = smallest;
        }
    }
    isEmpty() { return this.heap.length === 0; }
}