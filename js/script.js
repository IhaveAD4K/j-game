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
    soldier: "kepek/soldier/soldier_map.png"
};
var bullets = [];
var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var shootCooldown = 0;
var shootInterval = 100;
function playerMove(){
    var moveX = 0;
    var moveY = 0;
    if(keys.w == true){
        moveY = -1;
    }
    if(keys.s == true){
        moveY = 1;
    }
    if(keys.a == true){
        moveX = -1;
    }
    if(keys.d == true){
        moveX = 1;
    }
    if(moveX < 0){
        player.setFacing(-1);
    }
    if(moveX > 0){
        player.setFacing(1);
    }
    if(moveX != 0 && moveY != 0){
        moveX = moveX * 0.7071;
        moveY = moveY * 0.7071;
    }
    var ujX = player.getX() + moveX * player.getSpeed();
    var ujY = player.getY() + moveY * player.getSpeed();
    player.setX(ujX);
    player.setY(ujY);
    if(player.getX() < 0){
        player.setX(0);
    }
    if(player.getY() < 0){
        player.setY(0);
    }
    if(player.getX() > gameObjects.clientWidth - 60){
        player.setX(gameObjects.clientWidth - 60);
    }
    if(player.getY() > gameObjects.clientHeight - 60){
        player.setY(gameObjects.clientHeight - 60);
    }
    player.updatePosition();
}
function playerShoot(){
    if(player == null){
        return;
    }
    if(shootCooldown > 0){
        return;
    }
    var bulletX = player.getX() + 30;
    var bulletY = player.getY() + 30;
    var bullet = new Bullet(gameObjects, bulletX, bulletY, mouseX, mouseY);
    bullets.push(bullet);
    shootCooldown = shootInterval;
}
function bulletMove(){
    for(var i = 0; i < bullets.length; i++){
        bullets[i].move();
        if(bullets[i].getX() < -50 ||
           bullets[i].getX() > gameObjects.clientWidth + 50 ||
           bullets[i].getY() < -50 ||
           bullets[i].getY() > gameObjects.clientHeight + 50){
            bullets[i].destroy();
            bullets.splice(i, 1);
            i--;
        }
    }
}
canvas.addEventListener("mousemove", function(event){
    var rect = canvas.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) * (gameObjects.clientWidth / rect.width);
    mouseY = (event.clientY - rect.top) * (gameObjects.clientHeight / rect.height);
});
canvas.addEventListener("mousedown", function(event){
    if(event.button == 0){
        mouseDown = true;
    }
});
document.addEventListener("mouseup", function(event){
    if(event.button == 0){
        mouseDown = false;
    }
});
document.addEventListener("keydown", function(event){
    var key = event.key.toLowerCase();
    if(key == "w"){
        keys.w = true;
    }
    if(key == "a"){
        keys.a = true;
    }
    if(key == "s"){
        keys.s = true;
    }
    if(key == "d"){
        keys.d = true;
    }
});
document.addEventListener("keyup", function(event){
    var key = event.key.toLowerCase();
    if(key == "w"){
        keys.w = false;
    }
    if(key == "a"){
        keys.a = false;
    }
    if(key == "s"){
        keys.s = false;
    }
    if(key == "d"){
        keys.d = false;
    }
});
startButton.addEventListener("click", function(){
    var karakter = document.querySelector('input[name="character"]:checked');
    if(karakter == null){
        return;
    }
    if(gameInterval != null){
        clearInterval(gameInterval);
    }
    gameObjects.innerHTML = "";
    player = null;
    bullets = [];
    mouseDown = false;
    shootCooldown = 0;
    if(karakter.value == "soldier"){
        player = new Soldier(gameObjects, 485, 365);
    }
    if(player == null){
        return;
    }
    canvas.style.backgroundImage = "url('" + palyak.soldier + "')";
    keys.w = false;
    keys.a = false;
    keys.s = false;
    keys.d = false;
    gameInterval = setInterval(function(){
        if(player != null){
            playerMove();
            if(mouseDown == true){
                playerShoot();
            }
            bulletMove();
            if(shootCooldown > 0){
                shootCooldown -= 20;
            }
        }
    }, 20);
});