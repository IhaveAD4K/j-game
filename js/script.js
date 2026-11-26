        var canvas = document.querySelector("#gameCanvas");
var startButton = document.querySelector(".start");
var gameObjects = document.querySelector(".gameObjects");
canvas.width = 1000;
canvas.height = 800;
var player = null;
var gameInterval = null;
var spawnInterval = null;
var keys = {
    w: false,
    a: false,
    s: false,
    d: false
};
var bullets = [];
var enemies = [];
var fireballs = [];
var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var shootCooldown = 0;
var reloadTimer = 0;
var reloading = false;
var magazineSize = 25;
var ammo = magazineSize;
var shootRate = 100;
var reloadTime = 1500;
var wave = 0;
var money = 0;
var enemiesLeftToSpawn = 0;
var minReward = 3;
var maxReward = 8;
var nextWaveCooldown = 5000;
var waveCooldownTimer = 0;
var gameRunning = false;
var moneySpan = document.querySelector(".money");
var waveSpan = document.querySelector(".wave");
var ammoSpan = document.querySelector(".ammo");
canvas.addEventListener("mousemove", function(event){
    var rect = canvas.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
    mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);
});
canvas.addEventListener("mousedown", function(event){
    if(event.button == 0){
        mouseDown = true;
    }
});
window.addEventListener("mouseup", function(event){
    if(event.button == 0){
        mouseDown = false;
    }
});
window.addEventListener("keydown", function(event){
    if(event.key == "w" || event.key == "W"){
        keys.w = true;
    }
    if(event.key == "a" || event.key == "A"){
        keys.a = true;
    }
    if(event.key == "s" || event.key == "S"){
        keys.s = true;
    }
    if(event.key == "d" || event.key == "D"){
        keys.d = true;
    }
});
window.addEventListener("keyup", function(event){
    if(event.key == "w" || event.key == "W"){
        keys.w = false;
    }
    if(event.key == "a" || event.key == "A"){
        keys.a = false;
    }
    if(event.key == "s" || event.key == "S"){
        keys.s = false;
    }
    if(event.key == "d" || event.key == "D"){
        keys.d = false;
    }
});
function updateGameUI(){
    if(moneySpan != null){
        moneySpan.innerHTML = money;
    }
    if(waveSpan != null){
        waveSpan.innerHTML = wave;
    }
    if(ammoSpan != null){
        if(reloading){
            ammoSpan.innerHTML = "RELOADING";
        }
        else{
            ammoSpan.innerHTML = ammo + " / " + magazineSize;
        }
    }
}
function playerMove(){
    if(player == null){
        return;
    }
    var x = player.getX();
    var y = player.getY();
    var speed = player.getSpeed();
    if(keys.w){
        y -= speed;
    }
    if(keys.s){
        y += speed;
    }
    if(keys.a){
        x -= speed;
        player.setFacing(-1);
    }
    if(keys.d){
        x += speed;
        player.setFacing(1);
    }
    if(x < 0){
        x = 0;
    }
    if(y < 0){
        y = 0;
    }
    if(x > canvas.width - 60){
        x = canvas.width - 60;
    }
    if(y > canvas.height - 60){
        y = canvas.height - 60;
    }
   player.setX(x);
    player.setY(y);
    player.updatePosition();
}
function playerShoot(){
    if(player == null){
        return;
    }
    if(!mouseDown){
        return;
    }
    if(reloading){
        return;
    }
    if(shootCooldown > 0){
        return;
    }
    if(ammo <= 0){
        startReload();
        return;
    }
    var bullet = new Bullet(
        gameObjects,
        player.getX() + 30,
        player.getY() + 30,
        mouseX,
        mouseY
    );
    bullets.push(bullet);
    ammo--;
    shootCooldown = shootRate;
    if(ammo <= 0){
        startReload();
    }
    updateGameUI();
}
function startReload(){
    if(reloading){
        return;
    }
    reloading = true;
    reloadTimer = reloadTime;
    mouseDown = false;
    updateGameUI();
}
function reloadUpdate(){
    if(!reloading){
        return;
    }
    reloadTimer -= 20;
    if(reloadTimer <= 0){
        ammo = magazineSize;
        reloading = false;
        reloadTimer = 0;
        updateGameUI();
    }
}
function bulletMove(){
    for(var i = bullets.length - 1; i >= 0; i--){
        bullets[i].move();
        if(
            bullets[i].getX() < 0 ||
            bullets[i].getX() > canvas.width ||
            bullets[i].getY() < 0 ||
            bullets[i].getY() > canvas.height
        ){
            bullets[i].destroy();
            bullets.splice(i, 1);
        }
    }
}
function spawnEnemy(){
    if(enemiesLeftToSpawn <= 0){
        return;
    }
    var x;
    var y;
    var side = Math.floor(Math.random() * 4);
    if(side == 0){
        x = Math.random() * canvas.width;
        y = -100;
    }
    else if(side == 1){
        x = canvas.width + 100;
        y = Math.random() * canvas.height;
    }
    else if(side == 2){
        x = Math.random() * canvas.width;
        y = canvas.height + 100;
    }
    else{
        x = -100;
        y = Math.random() * canvas.height;
    }
    var type;
    if(Math.random() < 0.5){
        type = "rocket";
    }
    else{
        type = "demon";
    }
    var reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;
    var enemy = new Enemy(gameObjects, x, y, type, reward);
    enemies.push(enemy);
    enemiesLeftToSpawn--;
}
function startWave(){
    wave++;
    enemiesLeftToSpawn = wave;
    minReward++;
    maxReward += 2;
    waveCooldownTimer = 0;
    spawnInterval = setInterval(function(){
        spawnEnemy();
        if(enemiesLeftToSpawn <= 0){
            clearInterval(spawnInterval);
            spawnInterval = null;
        }
    }, 1000);
    updateGameUI();
}
function enemyMove(){
    for(var i = 0; i < enemies.length; i++){
        enemies[i].move(player);
        if(player.getX() + 30 > enemies[i].getX() + enemies[i].getWidth() / 2){
            enemies[i].setFacing(1);
        }
        else{
            enemies[i].setFacing(-1);
        }
    }
}
function enemyShoot(){
    if(player == null){
        return;
    }
    for(var i = 0; i < enemies.length; i++){
        if(enemies[i].getType() == "demon"){
            enemies[i].updateCooldown();
            if(enemies[i].canShoot()){
                var fireball = new Fireball(
                    gameObjects,
                    enemies[i].getX() + enemies[i].getWidth() / 2,
                    enemies[i].getY() + enemies[i].getHeight() / 2,
                    player.getX() + 30,
                    player.getY() + 30
                );
               fireballs.push(fireball);
                enemies[i].shoot();
            }
        }
    }
}
function fireballMove(){
    for(var i = fireballs.length - 1; i >= 0; i--){
        fireballs[i].move();
        if(
            fireballs[i].getX() < -50 ||
            fireballs[i].getX() > canvas.width + 50 ||
            fireballs[i].getY() < -50 ||
            fireballs[i].getY() > canvas.height + 50
        ){
            fireballs[i].destroy();
            fireballs.splice(i, 1);
        }
    }
}
function checkBulletCollision(){
    for(var i = bullets.length - 1; i >= 0; i--){
        for(var j = enemies.length - 1; j >= 0; j--){
            if(
                bullets[i].getX() >= enemies[j].getX() &&
                bullets[i].getX() <= enemies[j].getX() + enemies[j].getWidth() &&
                bullets[i].getY() >= enemies[j].getY() &&
                bullets[i].getY() <= enemies[j].getY() + enemies[j].getHeight()
            ){
                enemies[j].damage(20);
                bullets[i].destroy();
                bullets.splice(i, 1);
                if(enemies[j].getDead()){
                    money += enemies[j].getReward();
                    enemies[j].destroy();
                    enemies.splice(j, 1);
                    updateGameUI();
                }
                break;
            }
        }
    }
}
function checkEnemyCollision(){
    if(player == null){
        return;
    }
    for(var i = enemies.length - 1; i >= 0; i--){
        if(
            player.getX() < enemies[i].getX() + enemies[i].getWidth() &&
            player.getX() + 60 > enemies[i].getX() &&
            player.getY() < enemies[i].getY() + enemies[i].getHeight() &&
            player.getY() + 60 > enemies[i].getY()
        ){
            if(enemies[i].getType() == "rocket"){
                player.takeDamage(20);
                enemies[i].destroy();
                enemies.splice(i, 1);
            }
        }
    }
}
function checkFireballCollision(){
    if(player == null){
        return;
    }
    for(var i = fireballs.length - 1; i >= 0; i--){
        if(
            fireballs[i].getX() < player.getX() + 60 &&
            fireballs[i].getX() + 15 > player.getX() &&
            fireballs[i].getY() < player.getY() + 60 &&
            fireballs[i].getY() + 15 > player.getY()
        ){
            player.takeDamage(10);
            fireballs[i].destroy();
            fireballs.splice(i, 1);
        }
    }
}
function checkNextWave(){
    if(enemies.length == 0 && enemiesLeftToSpawn == 0 && spawnInterval == null){
        waveCooldownTimer += 20;
        if(waveCooldownTimer >= nextWaveCooldown){
            startWave();
        }
    }
    else{
        waveCooldownTimer = 0;
    }
}
function resetGame(){
    if(gameInterval != null){
        clearInterval(gameInterval);
        gameInterval = null;
    }
    if(spawnInterval != null){
        clearInterval(spawnInterval);
        spawnInterval = null;
    }
    for(var i = 0; i < bullets.length; i++){
        bullets[i].destroy();
    }
    for(var i = 0; i < enemies.length; i++){
        enemies[i].destroy();
    }
    for(var i = 0; i < fireballs.length; i++){
        fireballs[i].destroy();
    }
    bullets = [];
    enemies = [];
    fireballs = [];
    player = null;
    wave = 0;
    money = 0;
    enemiesLeftToSpawn = 0;
    minReward = 3;
    maxReward = 8;
    waveCooldownTimer = 0;
    shootCooldown = 0;
    reloadTimer = 0;
    reloading = false;
    ammo = magazineSize;
    mouseDown = false;
    keys.w = false;
    keys.a = false;
    keys.s = false;
    keys.d = false;
    canvas.width = 1000;
    canvas.height = 800;
    gameRunning = false;
    updateGameUI();
}
startButton.addEventListener("click", function(){
    resetGame();
    var selectedCharacter = document.querySelector("input[name='character']:checked");
    if(selectedCharacter != null && selectedCharacter.value == "soldier"){
        player = new Soldier(gameObjects, 470, 370);
    }
    else if(selectedCharacter != null && selectedCharacter.value == "cowboy"){
        player = new Cowboy(gameObjects, 470, 370);
    }
    else if(selectedCharacter != null && selectedCharacter.value == "samurai"){
        player = new Samurai(gameObjects, 470, 370);
    }
    else{
        player = new Soldier(gameObjects, 470, 370);
    }
    canvas.style.backgroundImage = "url('kepek/soldier/soldier_map.png')";
    gameRunning = true;
    startWave();
    gameInterval = setInterval(function(){
        playerMove();
        if(shootCooldown > 0){
            shootCooldown -= 20;
        }
        playerShoot();
        reloadUpdate();
        bulletMove();
        enemyMove();
        enemyShoot();
        fireballMove();
        checkBulletCollision();
        checkEnemyCollision();
        checkFireballCollision();
        checkNextWave();
    }, 20);
});