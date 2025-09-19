Shortest Path Visualiser
A web-based tool for visualising shortest path algorithms on real-world road network data from OpenStreetMap (OSM). This project uses vanilla JavaScript and the Leaflet.js library for an interactive map interface.

🌟 Features
OSM Data Integration: Fetches real road network data ('highways') using the Overpass API based on the current map view and a specified radius.

Graph Representation: Converts the raw OSM data into a standard graph data structure (nodes and adjacency lists) for algorithm processing.

Multiple Algorithms: Includes implementations of three classic shortest path algorithms:

Dijkstra's Algorithm: Guarantees the shortest path on a graph with non-negative edge weights.

A Search*: An informed search algorithm that uses a Euclidean distance heuristic to find the shortest path more efficiently than Dijkstra's in most cases.

Bellman-Ford Algorithm: Handles graphs with negative edge weights, though it's typically slower than Dijkstra's and A* for non-negative weights.

Interactive Interface:

Click the map to set start and end points. The tool automatically finds the nearest road network node to your selected points.

Visualises the calculated path on the map.

Displays performance metrics like execution time and path distance in a log.

Clear and Simple Code: The entire application is contained within a single HTML file, making it easy to understand and modify. No complex build tools or frameworks are required.

🚀 How to Use
Clone the Repository:

Bash

git clone https://github.com/shivam02345/shortest_path.git
cd shortest_path
Open in Browser: Simply open the index.html file in your preferred web browser (e.g., Chrome, Firefox).

Find a Path:

Navigate the Map: Pan and zoom to an area of interest.

Load the Graph: Click the "Load graph around map center" button. You can adjust the radius (in kilometers) to fetch more or less data. The application will log its progress.

Set Start and End Points: Click the "Set Start" button, then click on the map to place a marker. Do the same for the "Set End" button.

Find the Path: Select an algorithm from the dropdown and click "Find Path". The calculated route will be drawn on the map, and a summary of the result will appear in the log.

🛠️ Implementation Details
Graph Model: The Graph class stores nodes (unique OSM IDs with latitude/longitude) and an adjacency list.

Edge Weights: Edge weights are calculated using the haversine formula to determine the real-world distance (in meters) between two geographical points.

Priority Queue: A simple MinHeap class is implemented from scratch to provide an efficient priority queue for the Dijkstra and A* algorithms.

Overpass API: The tool sends a POST request to the Overpass API, which queries for all 'way' elements with a 'highway' tag within the specified bounding box.

UI/Map: The interface is built with basic HTML and CSS, and the mapping functionality is handled entirely by the Leaflet.js library.

📜 Algorithms in Detail
Dijkstra: A classic single-source shortest path algorithm that explores nodes in increasing order of distance from the source. It is guaranteed to find the shortest path on a graph with non-negative edge weights.

*A (A-Star)**: An extension of Dijkstra's that uses a heuristic function (in this case, Euclidean distance) to guide its search towards the target. This typically makes it faster by exploring fewer nodes.

Bellman-Ford: This algorithm can handle graphs with negative edge weights, which Dijkstra's cannot. However, for a road network (where edge weights are distances and are always positive), it is significantly less efficient. It is included for demonstration purposes.
