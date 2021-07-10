
import { log } from "console";
import { start } from "repl";
import { node } from "webpack";
import AdjacencyList from "./AdjacencyList";
import { GraphDirection } from "./GraphDirection";




export default class Graph {
	private _adjacencyList: AdjacencyList;

	private _direction: GraphDirection;


	constructor(direction: GraphDirection) {
		this._adjacencyList = <AdjacencyList>{};
		this._direction = direction;
	}

	//adiciona um nó no grafo
	public addVertex(vertex: string) {
		if (!this._adjacencyList[vertex])
			this._adjacencyList[vertex] = [];

		return this;
	}

	//Adiciona uma aresta/ligação entre dois nós
	public addEdge(source: string, destination: string, wheight: number) {
		if (!this._adjacencyList[source])
			this.addVertex(source);

		if (!this._adjacencyList[destination])
			this.addVertex(destination);

	
		for (var i = 0; i < this._adjacencyList[source].length; i++){
			if (this._adjacencyList[source][i].destination == destination){
				this._adjacencyList[source].splice(i,1);
				break;
			}
		}
		

		//Adicionar ligação entre dois nós
		this._adjacencyList[source].push({ destination: destination, wheight: wheight });

		//Se o grafo é nao direcionado ele adicionar ao contrario
		if (this.getGraphDirection() == GraphDirection.NotDirectioned)
			this._adjacencyList[destination].push({ destination: source, wheight: wheight });


		return this;
	}

	//remove uma aresta de dois nós
	public removeEdge(source: string, destination: string, edgeWheight: number) {

		this._adjacencyList[source] = this._adjacencyList[source].filter((edge) => edge.destination !== destination && edge.wheight !== edgeWheight);

		if (this.getGraphDirection() == GraphDirection.NotDirectioned)
			this._adjacencyList[destination] = this._adjacencyList[destination].filter((edge) => edge.destination !== destination && edge.wheight !== edgeWheight);

		return this;
	}

	//Remove um no do grafo
	public removeVertex(vertex: string) {
		while (this._adjacencyList[vertex].length > 0) {
			const adjacentVertex = this._adjacencyList[vertex].pop();
			this.removeEdge(vertex, adjacentVertex.destination, adjacentVertex.wheight);
		}
		delete this._adjacencyList[vertex];

		return this;
	}
		


	/* 		Menor caminho para desde A | Ultimo no visitado 
		A | 		0                 |  x
		B |         x				   |  x
		C |         x				   |  x
	*/
	public dijkstra(startVertex: string, destination: string): {total: number, nodeSequence: Array<string>}{

	 	var tempAdjacencyList = this.getAdjacencyList()
		
		var visited: Array<string> = new Array();
		var unvisited: Array<string> = Object.keys(tempAdjacencyList);

		//Tabela de nós passados
		var shortestPathTable: Record<string, { shortestFromStart: number ,previousVertex: string}> = {}
		unvisited.forEach(item => {
			shortestPathTable[item] = {shortestFromStart: Infinity, previousVertex: null };
		})
		shortestPathTable[startVertex].shortestFromStart = 0;

		var currentVertex: string = startVertex;

		while(true){
			if (unvisited.length == 0)
				break;

			//Seleciona na tabela o vértice com menor distancia.
			var lastCheckedWheight = Infinity
			Object.keys(shortestPathTable).forEach(key => {
				if (visited.indexOf(key) == -1 && shortestPathTable[key].shortestFromStart <= lastCheckedWheight){
					lastCheckedWheight = shortestPathTable[key].shortestFromStart
					currentVertex = key;
				}
			})

			//Percorre os vizinhos do vértice atual
			for (var vertexEdge of tempAdjacencyList[currentVertex]){
		
				if (visited.indexOf(vertexEdge.destination) != -1)
					continue;
				
				//@ts-ignore
				var edgeTotalDistance: number = parseInt(shortestPathTable[currentVertex].shortestFromStart) + parseInt(vertexEdge.wheight);

				if (shortestPathTable[vertexEdge.destination].shortestFromStart > edgeTotalDistance){
					shortestPathTable[vertexEdge.destination].previousVertex = currentVertex
					shortestPathTable[vertexEdge.destination].shortestFromStart = edgeTotalDistance;
				}
				
			}

			unvisited.splice(unvisited.indexOf(currentVertex), 1);
			visited.push(currentVertex);

		}


		//Monta o trajeto do caminho mais curto
		var shortestPath = shortestPathTable[destination].shortestFromStart
		var nodeSequence: Array<string> = [];
		var prev = destination;
		while(shortestPath != Infinity){
			
			if(prev == startVertex){
				nodeSequence.push(prev);
				break;
			}

			nodeSequence.push(prev);
			prev = shortestPathTable[prev].previousVertex;
		}

		console.log({total: shortestPath, nodeSequence: nodeSequence });
		
		return {total: shortestPath, nodeSequence: nodeSequence };

	};


	public getGraphDirection(): GraphDirection {
		return this._direction;
	}

	public getAdjacencyList(): AdjacencyList {
		return this._adjacencyList;
	}
}