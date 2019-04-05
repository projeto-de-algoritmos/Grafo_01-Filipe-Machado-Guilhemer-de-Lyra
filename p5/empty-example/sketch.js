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
var sidebar;

var i = 0;

var debug;

function setup() {
  // frameRate(10);

  jsScreen = createCanvas(windowWidth, 500);

  background(255);
  slider = createSlider(1, 300, 100);
  sliderValue = createP(slider.value());

  sliderValue.parent("#zoom");
  slider.parent("#zoom");
  //sliderValue.style("","");
  sidebar = new Sidebar();
  grid = new Grid(100);
  graph = new Graph();
  graph.createGraph();

  addButton = createButton("Adicionar Vértice");
  inputX = createInput("Posição X");
  inputY = createInput("Posição Y");
  addButton.parent("#addVertice");
  inputX.parent("addVertice");
  inputY.parent("addVertice");

  addButton.mousePressed(function() {
    graph.addVertex(inputX.value(), inputY.value());
    while (i < graph.qtdVertex) {
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
  addAresta.parent("addAresta");
  selectVertex1.parent("addAresta");
  selectVertex2.parent("addAresta");

  addAresta.mousePressed(function() {
    graph.addLink(selectVertex1.value(), selectVertex2.value());
  });

  selectVertex1 = createSelect();
  selectVertex2 = createSelect();
  removeEdge = createButton("Remover Aresta");
  selectVertex1.option("Selecione");
  selectVertex2.option("Selecione");
  removeEdge.parent("removeEdge");
  selectVertex1.parent("removeEdge");
  selectVertex2.parent("removeEdge");

  removeEdge.mousePressed(function() {
    graph.deleteEdge(selectVertex1.value(), selectVertex2.value());
  });

  removeButton = createButton("Remover Vértice");
  delInput = createInput("Index");
  removeButton.parent("#removeVertice");
  delInput.parent("removeVertice");
  removeButton.mousePressed(function() {
    graph.deleteVertex(delInput.value());
  });

  graph.addVertex(100, 100);
  graph.addVertex(-100, 150);
  graph.addVertex(0, 0.1);
  graph.addVertex(333,20);
  graph.addVertex(40,180);

  graph.addLink(0, 1);
  graph.addLink(2, 0);
  graph.addLink(0, 3);
  graph.addLink(0, 4);

  jsScreen.parent("canvas");
  framerateText = createP(frameRate());
}

function draw() {
  zoom = slider.value() / 100;
  background(200);
 // applyMatrix(1, 1,1,1, 1, 1);
 
  sidebar.show(graph);
  translate(400, 250);

  applyMatrix(1 / zoom, 0, 0, 1 / zoom, 0, 0);
  grid.show();
  graph.show();

  framerateText.html("fps: " + frameRate());
  sliderValue.html("Zoom :" + slider.value() + "%");
}

function Grid(scale) {
  this.scale = scale;

  this.show = () => {
    this.zoomScale = 1 / zoom;
    for (
      var x = -width * (1 / this.zoomScale);
      x <= width * (1 / this.zoomScale);
      x += this.scale
    ) {
      for (
        var y = -height * (1 / this.zoomScale);
        y <= height * (1 / this.zoomScale);
        y += this.scale
      ) {
        stroke(100, 100, 100, 10);
        strokeWeight(1);
        line(x, 0, x, height * (1 / this.zoomScale));
        line(0, y, width * (1 / this.zoomScale), y);
        line(x, 0, x, -height * (1 / this.zoomScale));
        line(0, y, -width * (1 / this.zoomScale), y);
      }
    }
  };
}

function Sidebar(){
  var xpos = 800;
  var ypos = height;
  var xpos2 = width-800;
  var ypos2 = -windowHeight;
  var xSpace = 65;
  var ySpace = 30;
  var vertexPosX;
  var vertexPosY;

  this.show = function(graph){
    
    var posFinaly;

    textAlign(CENTER, CENTER);
    fill(16, 23, 44);
    textSize(15);
    rect(xpos,ypos,xpos2,ypos2);
    //stroke(255);
    stroke(255);
    strokeWeight(1);
    fill(255);
    text("Grafo ",xpos + xSpace, ySpace * 2);
    this.vertexPosY = ySpace* 2;
    
   for (var vertex of graph.adjList.keys()) {
      this.vertexPosX = xpos + xSpace*2;
      this.vertexPosY = this.vertexPosY+(ySpace);
      text("Vertice "+vertex, this.vertexPosX, this.vertexPosY);
      line(this.vertexPosX-60,this.vertexPosY,this.vertexPosX-60,this.vertexPosY-20); //Linha vertical
      line(this.vertexPosX-60,this.vertexPosY,this.vertexPosX-35,this.vertexPosY);  //Linha horizontal
      for (var link of graph.adjList.get(vertex).links) {
        this.vertexPosY = this.vertexPosY +20;
      // text("Aresta ("+graph.adjList.get(link)+");", xpos + xSpace * 4, this.vertexPosY );
       text("Aresta ("+link+");", xpos + xSpace * 3, this.vertexPosY );
       line((xpos + xSpace * 3)-60,(this.vertexPosY),(xpos + xSpace * 3)-60,this.vertexPosY-20); //Linha vertical
       line((xpos + xSpace * 3)-60,this.vertexPosY,(xpos + xSpace * 3)-40,this.vertexPosY); //Linha horizontal
        //   pairs.add(arr);
        // }
        
      } 
      this.posFinaly = this.vertexPosY;   
    }
    line((xpos + xSpace*2)-60,ySpace* 2,(xpos + xSpace*2)-60,this.posFinaly);
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
    this.adjList = new Map();
  };

  this.addVertex = (positionX, positionY) => {
    //Adiciona o vertice depois de fazer todas as verificaçoes
    let vertex = new Vertex(positionX, positionY);
    this.adjList.set(this.qtdVertex, vertex);
    this.qtdVertex = this.qtdVertex + 1;
  };

  this.deleteVertex = key => {
    key = parseInt(key);
    this.adjList.delete(key);
    for (var vertex of this.adjList.keys()) {
      var idx = this.adjList.get(vertex).links.indexOf(key);
      this.adjList.get(vertex).links.splice(idx, 1);
    }
  };

  this.deleteEdge = (key1, key2) => {
    key1 = parseInt(key1);
    key2 = parseInt(key2);

    var idx1 = this.adjList.get(key1).links.indexOf(key2);
    var idx2 = this.adjList.get(key2).links.indexOf(key1);

    this.adjList.get(key1).links.splice(idx1, 1);
    this.adjList.get(key2).links.splice(idx2, 1);
  };

  this.show = () => {
    var radius = 30;
    // var pairs = new Set();
    // var cnt = 0;
   fill(255);
    for (var vertex of this.adjList.keys()) {
      vertexPosX = this.adjList.get(vertex).posX;
      vertexPosY = this.adjList.get(vertex).posY;

      strokeWeight(3);
      stroke(100);

      for (var link of this.adjList.get(vertex).links) {
        // var arr = new Array([vertex, link]);
        // arr.sort()
        // console.log('entrou' + arr);
        // if (pairs.has(arr) == false) {
        // cnt++;
        var linkedVPosX = this.adjList.get(link).posX;
        var linkedVPosY = this.adjList.get(link).posY;
        line(vertexPosX, vertexPosY, linkedVPosX, linkedVPosY);
        //   pairs.add(arr);
        // }
      }

      ellipse(vertexPosX, vertexPosY, radius, radius);
      textAlign(CENTER, CENTER);
      noStroke();
      stroke(1);
      text(vertex, vertexPosX, vertexPosY);
    }
  };

  this.addLink = (vertex, linkedVertex) => {
    this.adjList.get(vertex).links.push(linkedVertex);
    this.adjList.get(linkedVertex).links.push(vertex);
  };
}
