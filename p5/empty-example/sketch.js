var slider;
var sliderValue;
var grid;
var zoom;
var jsScreen;
var zoomParagraph;
var graph;
var i = 0;

var debug;

class Buttons {
  constructor(grapho) {
    this.graphico = grapho;

    this.addVertex = createButton("Adicionar Vértice");
    this.inputX = createInput("Posição X");
    this.inputY = createInput("Posição Y");
    this.addVertex.parent("#addVertice");
    this.inputX.parent("addVertice");
    this.inputY.parent("addVertice");

    this.addEdge = createButton("Adicionar Aresta");
    this.selectVertex1_add = createSelect();
    this.selectVertex2_add = createSelect();
    this.selectVertex1_add.option("Selecione");
    this.selectVertex2_add.option("Selecione");
    this.addEdge.parent("addAresta");
    this.selectVertex1_add.parent("addAresta");
    this.selectVertex2_add.parent("addAresta");

    this.removeVertex = createButton("Remover Vértice");
    this.delInput = createInput("Index");
    this.removeVertex.parent("#removeVertice");
    this.delInput.parent("removeVertice");

    this.removeEdge = createButton("Remover Aresta");
    this.selectVertex_remove = createSelect();
    this.selectVertex_remove.option("Selecione");
    this.removeEdge.parent("removeEdge");
    this.selectVertex_remove.parent("removeEdge");
  };

  renew_add_edge_list() {
    for (let vertex of buttons.graphico.adjList.keys()) {
      buttons.selectVertex1_add.option(vertex);
      buttons.selectVertex2_add.option(vertex);
    }
  }

  renew_remove_edge_list() {
    var pairs = new Set();
    for (var vertex of buttons.graphico.adjList.keys()) {
      for (var link of buttons.graphico.adjList.get(vertex).links) {
        var arr = new Array();
        arr.push(vertex)
        arr.push(link);
        arr.sort()
        if (pairs.has(JSON.stringify(arr)) == false) {
          pairs.add(JSON.stringify(arr));
        }
      }
    }
    for (let pair of pairs) {
      buttons.selectVertex_remove.option(pair);
    }
  }

  add_vertex() {
    buttons.addVertex.mousePressed(function (graphico) {
      buttons.graphico.addVertex(parseInt(buttons.inputX.value()),
        parseInt(buttons.inputY.value()));
      buttons.renew_add_edge_list();
    });
  }

  add_edge() {
    buttons.addEdge.mousePressed(function () {
      buttons.graphico.addLink(parseInt(buttons.selectVertex1_add.value()),
        parseInt(buttons.selectVertex2_add.value()));
      buttons.renew_remove_edge_list();
    });
  }

  remove_vertex() {
    buttons.removeVertex.mousePressed(function () {
      buttons.graphico.deleteVertex(parseInt(buttons.delInput.value()));
    });
  }

  remove_edge() {
    buttons.removeEdge.mousePressed(function () {
      let arr = JSON.parse(buttons.selectVertex_remove.value());
      buttons.graphico.deleteEdge(arr[0], arr[1]);
    });
  }
}

function setup() {
  jsScreen = createCanvas(800, 500);

  background(255);
  slider = createSlider(1, 300, 100);
  sliderValue = createP(slider.value());

  sliderValue.parent("#zoom");
  slider.parent("#zoom");
  //sliderValue.style("","");

  grid = new Grid(100);
  graph = new Graph();
  graph.createGraph();

  buttons = new Buttons(graph);
  buttons.add_edge();
  buttons.add_vertex();
  buttons.remove_edge();
  buttons.remove_vertex();

  jsScreen.parent("canvas");
  framerateText = createP(frameRate());
}

function draw() {
  zoom = slider.value() / 100;
  background(200);
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
      text(vertex, vertexPosX, vertexPosY);
    }
  };

  this.addLink = (vertex, linkedVertex) => {
    vertex = parseInt(vertex);
    linkedVertex = parseInt(linkedVertex);
    this.adjList.get(vertex).links.push(linkedVertex);
    this.adjList.get(linkedVertex).links.push(vertex);
  };
}
