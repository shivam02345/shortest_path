🚦 Shortest Path Visualiser

A web-based tool to visualise shortest path algorithms on real-world road networks using OpenStreetMap (OSM) data.
Built with vanilla JavaScript and Leaflet.js for an interactive map interface.

✨ Features

🌍 OSM Data Integration

Fetches live road network data (highways) from Overpass API based on current map view and radius.

🔗 Graph Representation

Converts raw OSM data into a graph structure (nodes + adjacency lists).

🧮 Multiple Algorithms

Dijkstra’s Algorithm → Finds guaranteed shortest path (non-negative edges).

A* → Faster than Dijkstra’s, guided by Euclidean distance heuristic.

Bellman-Ford → Handles negative edges (slower, mainly for demonstration).

🖱️ Interactive Map Interface

Click on the map to set Start and End points.

Automatically snaps to the nearest road node.

Visualises the calculated path with distance and time metrics.

💻 Simple Codebase

Entire app in one HTML file – easy to read, modify, and extend.

No complex build tools or frameworks required.

🚀 How to Use

Clone the Repository

git clone https://github.com/shivam02345/shortest_path.git
cd shortest_path


Open in Browser

Just open index.html in Chrome, Firefox, or your browser of choice.

Find a Path

🗺️ Pan & zoom to your area of interest.

📥 Click "Load graph around map center" → fetches roads from OSM.

📍 Set Start and End points by clicking on the map.

⚡ Choose an algorithm from the dropdown and click "Find Path".

✅ Path will be drawn on the map with a summary in the log panel.

🛠️ Implementation Details

Graph Model → Nodes = OSM IDs with coordinates; stored in adjacency lists.

Edge Weights → Real-world distances (meters), calculated using the Haversine formula.

Priority Queue → Custom MinHeap for Dijkstra’s & A*.

Overpass API → Queries all highway elements within the bounding box.

UI & Map → Built with HTML + CSS + Leaflet.js for map rendering.

📜 Algorithms in Detail

🔹 Dijkstra → Expands nodes in increasing distance order. Always finds the shortest path.

🔹 A* → Optimised Dijkstra with heuristic (Euclidean distance). Faster in practice.

🔹 Bellman-Ford → Supports negative edges but slower; included for completeness.
