//const Engine = Matter.Engine;
//const World = Matter.World;
//const Bodies = Matter.Bodies;
//const Body = Matter.Body;
var foodS,foodStock,database,happyDog,dog,dogImg;
var feed,addFood;
var fedTime, LastFed;
var foodObj;
var updateFoodStock,getFoodStock,getFedTime,deductFoodStock;
var readStock;
var washRoomImg,gardenImg,bedRoomImg;
var readState;
var currentTime;

function preload()
{
  dogImg = loadImage("images/dog.png")
  happyDog = loadImage("images/happyDog.png")
  gardenImg = loadImage("virtual pet images/Garden.png")
  bedRoomImg = loadImage("virtual pet images/Bed Room.png")
  washRoomImg = loadImage("virtual pet images/Wash Room.png")
  sadDog = loadImage("virtual pet images/deadDog.png")
}

function setup() {
  createCanvas(500, 500);
  database = firebase.database();

  
  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value",readStock)
  reatState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  });
  dog = createSprite(350,350,50,50)
  dog.addImage(dogImg)
  dog.scale = 0.2
  feed=createButton("feed the dog")
  feed.position(650,95)
  feed.mousePressed(feedDog);

  addFood=createButton('Add Food');
  addFood.position(750,95)
  addFood.mousePressed(addFoods)

 

  
}

function draw() {  
  background(46,139,87)

  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    LastFed=data.val();
  });


  fill(255,255,254)
  textSize(15)
  if(LastFed>=12) {
    text("Last Feed :"+LastFed%12 + "PM", 350,30);
  } else if(LastFed==0){
    text("Last Feed : 12 AM", 350,30);
  } else{
    text("Last Feed :"+ LastFed + "AM", 350,30)
  }


  if(gameState!=!"Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog)
  }


  currentTime=hour();
  if(currentTime==(LastFed+1)) {
    update("playing")
    foodObj.garden();
  } else if(currentTime>(LastFed+2)) {
    update("sleeping");
  } else if(currentTime>(LastFed+2) && currentTime<=(LastFed+4)){
    update("bathing")
    foodObj.washroom();
  } else{
    update("Hungry")
    foodObj.display();
  }

  
  
 

  drawSprites();
  



 

}

function readStock(data) {
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}




function addFoods() {
  foodS++;
  dog.addImage(dogImg)
  database.ref('/').update({
    Food:foodS
  })

}

function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour
  })
}


function update(state) {
  database.ref('/').update({
    gameState:state
  });
}


