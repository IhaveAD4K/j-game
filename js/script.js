var canvas = document.querySelector("#gameCanvas");
var startButton = document.querySelector(".start");
var gameObjects = document.querySelector(".gameObjects");

var player = null;
var gameInterval = null;

var keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

var palyak = {
    soldier: "kepek/soldier/soldier_map.png",
    samurai: "kepek/samurai_map.png",
    cowboy: "kepek/cowboy_map.png"
};

function playerMove(){
    if(keys.w){
        player.setY(player.getY() - player.getSpeed());
    }
    if(keys.s){
        player.setY(player.getY() + player.getSpeed());
    }
    if(keys.a){
        player.setX(player.getX() - player.getSpeed());
    }
    if(keys.d){
        player.setX(player.getX() + player.getSpeed());
    }
    if(player.getX() < 0){
        player.setX(0);
    }
    if(player.getY() < 0){
        player.setY(0);
    }
    if(player.getX() > 970){
        player.setX(970);
    }
    if(player.getY() > 730){
        player.setY(730);
    }
    player.updatePosition();
}

document.addEventListener("keydown", function(event){
    var key = event.key.toLowerCase();
    if(key == "w" || key == "a" || key == "s" || key == "d"){
        keys[key] = true;
    }
});

document.addEventListener("keyup", function(event){
    var key = event.key.toLowerCase();
    if(key == "w" || key == "a" || key == "s" || key == "d"){
        keys[key] = false;
    }
});

startButton.addEventListener("click", function(){
    var karakter = document.querySelector('input[name="character"]:checked').value;
    if(gameInterval != null){
        clearInterval(gameInterval);
    }
    gameObjects.innerHTML = "";
    if(karakter == "soldier"){
        player = new Soldier(gameObjects, 485, 365);
    }
    canvas.style.backgroundImage = "url('" + palyak[karakter] + "')";
    keys.w = false;
    keys.a = false;
    keys.s = false;
    keys.d = false;
    gameInterval = setInterval(function(){
        if(player != null){
            playerMove();
        }
    }, 20);
});