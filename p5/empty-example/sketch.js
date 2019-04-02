var slider;
var sliderValue;
var grid;
var zoom;
var jsScreen;
var zoomParagraph;

var debug;

function setup() {
 // frameRate(10);

  jsScreen = createCanvas(800,500);

  background(255); 
  slider = createSlider(1,300,100);
  sliderValue = createP(slider.value());

  sliderValue.parent('#zoom');
  slider.parent('#zoom');
  //sliderValue.style("","");
  framerateText = createP(frameRate());

  grid = new Grid(100);
  graph = new Grafo();
  graph.createGraph();
  
  jsScreen.parent('canvas');

  graph.addVertex(0,100,100);
  graph.addVertex(1,-100,150);
  graph.addVertex(2,0,.100);
  
  graph.addLink(0,1);
  graph.addLink(2,0);
}

function draw() {
 // console.log("its working!");
  zoom = slider.value()/100;
  background(200);
  translate(400,250);
 
  applyMatrix(1 / zoom, 0, 0, 1 / zoom, 0, 0);
  grid.show();

  graph.showLink(0,1);
  graph.showLink(2,0);
  
  graph.showVertex(0);
  graph.showVertex(1);
  graph.showVertex(2);
  /*while(graph.qtdVertex>i){
    i = i + 1;
    graph.showVertex(i-1);
    
  }*/

 

  /*
  ellipse(250,250,100,100);
  ellipse(100,100,100,100);
  ellipse(400,400,100,100);
  ellipse(-250,-250,100,100);
  sliderValue.html(slider.value());
 */
framerateText.html("fps: "+frameRate());
sliderValue.html("Zoom :"+slider.value()+"%");

}

function Grid(scale){
  this.scale = scale;
 
 
  this.show = function(){
    this.zoomScale = 1/zoom;
    for(var x = -width*(1/this.zoomScale); x <= width*(1/this.zoomScale) ; x += this.scale){
      for(var y = -height*(1/this.zoomScale); y <= height*(1/this.zoomScale) ; y += this.scale){
        stroke(100,100,100,10);
        strokeWeight(1);
        line(x, 0, x, height*(1/this.zoomScale));
        line(0, y, width*(1/this.zoomScale), y);
        line(x, 0, x, -height*(1/this.zoomScale));
        line(0, y, -width*(1/this.zoomScale), y);       
      }
    }
  }

}


function Grafo(){

 // this.links = new Array();
  var qtdVertex = 0;
  var listaAdj;

  function Vertex(positionX, positionY){    
    //Posições no eixo X e Y para representar o grafo graficamente
    this.posX = positionX;
    this.posY = positionY;

    //Representar o grafo por vetor de listas de adjacencia
    this.links = new LinkedList();

    
  }

  this.createGraph = function(){
    this.listaAdj = new Array();
  }

  this.addVertex = function(index, positionX, positionY){
    //Adiciona o vertice depois de fazer todas as verificaçoes
    let vertex = new Vertex(positionX, positionY);
    this.listaAdj.push(vertex);
    this.qtdVertex = this.qtdVertex + 1;
  }

  this.showVertex = function(index){
    var radius = 30;    
    posX = this.listaAdj[index].posX;
    posY = this.listaAdj[index].posY;
    strokeWeight(3);
    stroke(100);
    ellipse(posX,posY,radius,radius);
  }

  this.addLink = function(index, linkedVertex){
    var aux = this.listaAdj[index].links.first;
    
    while(aux!=null){
      if(aux.link == linkedVertex){
        //Verificar se a aresta ja existe
        return "Os vertices selecionados já possuem essa aresta";
      }
      aux = aux.next;     
    }
    this.listaAdj[index].links.add(linkedVertex); 
  }

  this.showLink = function(index, linkedVertex){
    var x1 = this.listaAdj[index].posX;
    var x2 = this.listaAdj[linkedVertex].posX;
    var y1 = this.listaAdj[index].posY;
    var y2 = this.listaAdj[linkedVertex].posY;
    strokeWeight(3);
    stroke(100);
    line(x1,y1,x2,y2);
  }

}


function LinkedList(index){
  //this.vertex = index;

    function Element(linkedVertex){
      this.link = linkedVertex; //Vertice que possui a aresta com o vertice do indice da lista
      this.next = null;    
    }

  this.first = new Element();
  
  this.add = function(linkedVertex){    
    //Checa se o primeiro elemento é nulo (se a lista é vazia)
    if(this.first != null){
      var pointer = this.first;
      do{
          /*
           * verifica se o proximo é nulo
           * se for, esse é o ultimo elemento 
           * entao é possivel criar um elemento nesse proximo
          */
         if(pointer.next == null){
          pointer.next = new Element(linkedVertex);  
          return "Vertice "+  this.index +"conectado com o vertice "+linkedVertex;      
        }else{
          pointer = pointer.next;
        }
      }while(pointer != null);
    }else{
      this.first = new Element(linkedVertex);
      return "Vertice "+  this.index +" conectado com o vertice "+linkedVertex + " OBS: PRIMEIRA ARESTA DO VERTICE!!";   
    }
  };

  this.searchElement = function(pointer, prevPointer){
    this.element = pointer;
    this.prevElement = prevPointer;

  }

  this.search = function(linkedVertex){
    var pointer = this.first;
    var prevPointer = null;

    do{ //faz enquanto o ponteiro nao aponta para nulo;

        /*
         * se a aresta do ponteiro nao for a procurada 
         * ele muda o ponteiro para o proximo
         * caso seja, ele sai do loop
        */
      if(pointer.link != linkedVertex){
        prevPointer = pointer;
        pointer = pointer.next;
      }else{
        break;
      }
    }while(pointer!=null);
    var busca = new searchElement(pointer, prevPointer);

    //retorna um objeto busca com o ponteiro em que parou e seu anterior
    return busca;
  };

    //Funçao para deletar arestas
  this.remove = function(linkedVertex){
    var busca = this.busca(linkedVertex);
    /*
    * Verifica se o elemento encontrado é nulo
    * ou seja, se a função percorreu toda a lista e não encontrou
    */
   if(busca.element == null){
    return "ERRO: Essa aresta não existe!";    
   }else if(busca.element == this.first){ //verifica se o valor encontrado é o primeiro
    /*
    * verifica proximo elemento é diferente de nulo 
    * se fosse nulo, o elemento analizado seria o primeiro e o ultimo 
    * entao remove-lo seria tornar a lista vazia
    */
    if(busca.element.next != null){
      var proximo = busca.element.next;
      busca.element.link = proximo.link;
      busca.element.next = proximo.next;
      proximo = null;
      return "Aresta removida com sucesso!"
    }else{
      this.first = null;
      return "Aresta removida com sucesso! OBS: O vertice agora não possui mais arestas."
    }
   }else if(busca.element.next == null){
    //Verifica se o proximo elemento é nulo, se for nulo então o elemento analizado é o ultimo
    busca.prevElement.next = null;
    busca.element = null;
    return "Aresta removida com sucesso!";    
   }else{
     busca.prevElement.next = busca.element.next;
     busca.element = null;
     return "Aresta removida com sucesso!";
   } 
  };
};
  
