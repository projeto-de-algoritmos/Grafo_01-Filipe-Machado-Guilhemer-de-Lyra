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

    this.checkBipart = createButton("Checar se é Bipartido");
    this.checkBipart.parent("checkBipart")
  };

  renew_add_edge_list() {
    this.selectVertex1_add.remove();
    this.selectVertex2_add.remove();

    this.selectVertex1_add = createSelect();
    this.selectVertex2_add = createSelect();

    this.selectVertex1_add.option("Selecione");
    this.selectVertex2_add.option("Selecione");
    this.selectVertex1_add.parent("addAresta");
    this.selectVertex2_add.parent("addAresta");

    for (let vertex of buttons.graphico.adjList.keys()) {
      buttons.selectVertex1_add.option(vertex);
      buttons.selectVertex2_add.option(vertex);
    }
  }

  renew_remove_edge_list() {
    this.selectVertex_remove.remove();
    this.selectVertex_remove = createSelect();
    this.selectVertex_remove.option("Selecione");
    this.selectVertex_remove.parent("removeEdge");

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
    buttons.addVertex.mousePressed(function () {
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
      buttons.renew_add_edge_list();
    });
  }

  remove_edge() {
    buttons.removeEdge.mousePressed(function () {
      let arr = JSON.parse(buttons.selectVertex_remove.value());
      buttons.graphico.deleteEdge(arr[0], arr[1]);
      buttons.renew_remove_edge_list();
    });
  }

  check_bipart() {
    buttons.checkBipart.mousePressed(function () {
      if (buttons.graphico.isBipartite() === true) {
        alert("É Bipartido!");
      } else {
        alert("Não é Bipartido!")
      }
    });
  }
}

function sample_data(graph) {
  graph.addVertex(0, 0);
  graph.addVertex(100, 100);
  graph.addVertex(100, -100);
  graph.addVertex(-100, 100);
  graph.addVertex(-100, -100);
  graph.addVertex(-60, 20);
  graph.addLink(0, 1);
  graph.addLink(0, 2);
  graph.addLink(0, 3);
  graph.addLink(0, 4);
  graph.addLink(5, 4);
  graph.addLink(5, 3);
  graph.addLink(5, 1);
  graph.addLink(4, 3);
  graph.addLink(1, 3);
}

function setup() {
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

  //sample_data(graph);

  buttons = new Buttons(graph);
  buttons.add_edge();
  buttons.add_vertex();
  buttons.remove_edge();
  buttons.remove_vertex();
  buttons.renew_add_edge_list();
  buttons.renew_remove_edge_list();
  buttons.check_bipart();


  jsScreen.parent("canvas");
  framerateText = createP(frameRate());
}

function draw() {
  zoom = slider.value() / 100;
  background(200);
  // applyMatrix(1, 1,1,1, 1, 1);

  sidebar.show(graph);
  translate(dragX, dragY);

  applyMatrix(1 / zoom, 0, 0, 1 / zoom, 0, 0);
  grid.show();
  graph.show();

  framerateText.html("fps: " + frameRate());
  sliderValue.html("Zoom :" + slider.value() + "%");
}

var dragX = 400;
var dragY = 250;
var mousex1;
var mousey1;
var mousex2;
var mousey2;
function mousePressed(){
  mousex1 = mouseX;
  mousey1 = mouseY;
  }
function mouseReleased(){
  mousex2 = mouseX;
  mousey2 = mouseY;
  dragX = dragX + (mousex1-mousex2);
  dragY = dragY + (mousey1-mousey2);
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

function Sidebar() {
  var xpos = 800;
  var ypos = height;
  var xpos2 = width - 800;
  var ypos2 = -windowHeight;
  var xPad = 65;
  var yPad = 30;
  var base_x = xpos + xPad;
  var base_y = yPad * 2;

  this.show = function (graph) {
    textAlign(CENTER, CENTER);
    fill(16, 23, 44);
    textSize(15);
    rect(xpos, ypos, xpos2, ypos2);
    stroke(255);
    strokeWeight(1);
    fill(255);
    text("Grafo ", base_x, base_y);

    current_x = base_x+50;
    current_y = base_y;

    for (var vertex of graph.adjList.keys()) {
      current_y += yPad;

      if (current_y > 440) {
        current_x += xPad+200;
        current_y = yPad * 3;
      }

      text("Vertice " + vertex, current_x, current_y);
      if (current_y != yPad*3) {
        line(current_x - 60, current_y, current_x - 60, current_y - 130); //Linha vertical
      } else {
        line(current_x - 60, current_y, current_x - 60, current_y - 20); //Linha vertical
      }
      line(current_x - 60, current_y, current_x - 35, current_y);  //Linha horizontal

      for (var link of graph.adjList.get(vertex).links) {
        current_y += 20;
        text("Aresta (" + link + ");", current_x + xPad+10, current_y);
        line(current_x, current_y, current_x, current_y - 20); //Linha vertical
        line(current_x+30, current_y, current_x, current_y); //Linha horizontal

      }

      this.posFinaly = current_y;
    }
    // line((current_x) - 60, yPad * 2, (current_x) - 60, this.posFinaly);
  }

}

function Graph() {
  this.qtdVertex = 0;

  function Vertex(positionX, positionY) {
    //Posições no eixo X e Y para representar o grafo graficamente
    this.posX = positionX;
    this.posY = positionY;
    this.color = 0;
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
    this.qtdVertex++;
  };

  this.deleteVertex = key => {
    key = parseInt(key);
    this.adjList.delete(key);
    for (var vertex of this.adjList.keys()) {
      var idx = this.adjList.get(vertex).links.indexOf(key);
      this.adjList.get(vertex).links.splice(idx, 1);
    }
    this.qtdVertex--;
  };

  this.deleteEdge = (key1, key2) => {
    key1 = parseInt(key1);
    key2 = parseInt(key2);

    var idx1 = this.adjList.get(key1).links.indexOf(key2);
    var idx2 = this.adjList.get(key2).links.indexOf(key1);

    this.adjList.get(key1).links.splice(idx1, 1);
    this.adjList.get(key2).links.splice(idx2, 1);
  };

  this.bfs = (color, node) => {
    var queue = [];
    queue.push(node);
    color[node] = 1;
    while (queue.length > 0) {
      var u = queue.shift();
      for (var v of this.adjList.get(u).links) {
        if(color[v] == 0) {
          color[v] = 3 - color[u];
          this.adjList.get(v).color = color[v];
          queue.push(v);
        } else if (color[v] == color[u]) {
          return false;
        }
      }
    }
    return true;
  }

  this.isBipartite = () => {
    color = new Array(this.qtdVertex).fill(0);
    for (let u = 1; u <= this.qtdVertex; ++u)
      if (color[u] == 0 && !this.bfs(color, u))
        return false;
    
    return true;
  }

  this.show = () => {
    var radius = 30;
    fill(255);
    var pairs = new Set();

    for (var vertex of this.adjList.keys()) {
      vertexPosX = this.adjList.get(vertex).posX;
      vertexPosY = this.adjList.get(vertex).posY;

      strokeWeight(3);
      stroke(100);

      for (var link of this.adjList.get(vertex).links) {
        var arr = new Array();
        arr.push(vertex)
        arr.push(link);
        arr.sort()
        if (pairs.has(JSON.stringify(arr)) == false) {
          pairs.add(JSON.stringify(arr));
          var linkedVPosX = this.adjList.get(link).posX;
          var linkedVPosY = this.adjList.get(link).posY;
          line(vertexPosX, vertexPosY, linkedVPosX, linkedVPosY);
          push()
          var angle = atan2(vertexPosY - linkedVPosY, vertexPosX - linkedVPosX);
          translate(linkedVPosX, linkedVPosY);
          rotate(angle-HALF_PI);
          triangle(-20*0.5, 20, 20*0.5, 20, 0, -20/2);
          pop();
        }
      }

      if (this.adjList.get(vertex).color === 1) {
        fill(12,79,166);
      } else if (this.adjList.get(vertex).color === 2) {
        fill(166,12,12);
      } else {
        fill(255);
      }

      ellipse(vertexPosX, vertexPosY, radius, radius);
      textAlign(CENTER, CENTER);
      stroke(1);
      fill(220);
      strokeWeight(3); 
      text(vertex, vertexPosX, vertexPosY);
    }
  };

  this.addLink = (vertex, linkedVertex) => {
    vertex = parseInt(vertex);
    linkedVertex = parseInt(linkedVertex);
    this.adjList.get(vertex).links.push(linkedVertex);
    //this.adjList.get(linkedVertex).links.push(vertex); 
  };
}
