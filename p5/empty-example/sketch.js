var slider;
var sliderValue;
var grid;
var zoom;
var jsScreen;
var zoomParagraph;
var addButton;
var graph;
var inputX;
var inputY;
var selectVertex1;
var selectVertex2;
var addAresta;

var i = 0;

var debug;

function setup() {
  // frameRate(10);

  jsScreen = createCanvas(800, 500);

  background(255);
  slider = createSlider(1, 300, 100);
  sliderValue = createP(slider.value());

  sliderValue.parent('#zoom');
  slider.parent('#zoom');
  //sliderValue.style("","");


  grid = new Grid(100);
  graph = new Graph();
  graph.createGraph();

  addButton = createButton('Adicionar Vértice');
  inputX = createInput('Posição X');
  inputY = createInput('Posição Y');
  addButton.parent('#addVertice');
  inputX.parent('addVertice');
  inputY.parent('addVertice');

  addButton.mousePressed(function(){
    graph.addVertex((graph.qtdVertex+1),inputX.value(),inputY.value());
    while(i<graph.qtdVertex){
      selectVertex1.option(i);
      selectVertex2.option(i);
      i++;
    }
  });

  selectVertex1 = createSelect();
  selectVertex2 = createSelect();
  addAresta = createButton("Adicionar Aresta");
  selectVertex1.option("Selecione");
  selectVertex2.option("Selecione");
  addAresta.parent('addAresta');
  selectVertex1.parent('addAresta');
  selectVertex2.parent('addAresta');

  addAresta.mousePressed(function(){
    graph.addLink(selectVertex1.value(), selectVertex2.value());
  });

  

  graph.addVertex(0, 100, 100);
  graph.addVertex(1, -100, 150);
  graph.addVertex(2, 0, .100);

  graph.addLink(0, 1);
  graph.addLink(2, 0);

  jsScreen.parent('canvas');
  framerateText = createP(frameRate());
}

function draw() {
  zoom = slider.value() / 100;
  background(200);
  translate(400, 250);

  applyMatrix(1 / zoom, 0, 0, 1 / zoom, 0, 0);
  grid.show();
  graph.show();

  for(vertex in graph.adjList){
    let vertexPosX = graph.adjList[vertex].posX;
    let vertexPosY = graph.adjList[vertex].posY;
    textAlign(CENTER,CENTER);
    text(vertex,vertexPosX,vertexPosY);
  }

  framerateText.html("fps: " + frameRate());
  sliderValue.html("Zoom :" + slider.value() + "%");

}

function Grid(scale) {
  this.scale = scale;

  this.show = () => {
    this.zoomScale = 1 / zoom;
    for (var x = -width * (1 / this.zoomScale); x <= width * (1 / this.zoomScale); x += this.scale) {
      for (var y = -height * (1 / this.zoomScale); y <= height * (1 / this.zoomScale); y += this.scale) {
        stroke(100, 100, 100, 10);
        strokeWeight(1);
        line(x, 0, x, height * (1 / this.zoomScale));
        line(0, y, width * (1 / this.zoomScale), y);
        line(x, 0, x, -height * (1 / this.zoomScale));
        line(0, y, -width * (1 / this.zoomScale), y);
      }
    }
  }

}


function Graph() {

  this.qtdVertex = 0;

  function Vertex(positionX, positionY) {
    //Posições no eixo X e Y para representar o grafo graficamente
    this.posX = positionX;
    this.posY = positionY;

    //Representar o grafo por vetor de listas de adjacencia
    this.links = new Array();
  }

  this.createGraph = () => {
    this.adjList = new Array();
  }

  this.addVertex = (index, positionX, positionY) => {
    //Adiciona o vertice depois de fazer todas as verificaçoes
    let vertex = new Vertex(positionX, positionY);    
    this.adjList.push(vertex);
    this.qtdVertex = this.qtdVertex + 1;
  }

  this.show = () => {
    var radius = 30;
    for (vertex in this.adjList) {
     // console.log('ue' + this.adjList[vertex].posX);
      vertexPosX = this.adjList[vertex].posX;
      vertexPosY = this.adjList[vertex].posY;
      

      for (link in this.adjList[vertex].links) {
    //    console.log('ma rapa'+JSON.stringify(this.adjList[vertex].links));
    //    console.log('oxi'+link);
        var linkedVPosX = this.adjList[link].posX;
        var linkedVPosY = this.adjList[link].posY;
        strokeWeight(3);
        stroke(100);
        line(vertexPosX, vertexPosY, linkedVPosX, linkedVPosY);
      }

      strokeWeight(3);
      stroke(100);
      ellipse(vertexPosX, vertexPosY, radius, radius);
      noStroke();
     

      
      
    }
  }

  this.addLink = (vertex, linkedVertex) => {
    this.adjList[vertex].links.push(linkedVertex);
    this.adjList[linkedVertex].links.push(vertex);
  }
}
