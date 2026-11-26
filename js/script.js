var canvas = document.querySelector("#gameCanvas");
var startButton = document.querySelector(".start");
var gameObjects = document.querySelector(".gameObjects");
var mainMenu = document.querySelector(".mainMenu");
var gameSection = document.querySelector(".gameSection");

var deathOverlay = document.querySelector(".deathOverlay");
var pauseOverlay = document.querySelector(".pauseOverlay");

var moneySpan = document.querySelector(".money");
var waveSpan = document.querySelector(".wave");
var ammoSpan = document.querySelector(".ammo");
var healthFill = document.querySelector(".healthFill");
var healthText = document.querySelector(".healthText");

var upgradeMoney = document.querySelector(".upgradeMoney");

var gameInterval = null;
var spawnInterval = null;

canvas.width = 1000;
canvas.height = 800;

var player = null;
var gameRunning = false;
var gamePaused = false;
var gameOver = false;

var keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

var bullets = [];
var enemies = [];
var fireballs = [];
var slashes = [];

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

var regenTimer = 0;

var wave = 0;
var money = 0;
var enemiesLeftToSpawn = 0;

var minReward = 3;
var maxReward = 8;

var nextWaveCooldown = 5000;
var waveCooldownTimer = 0;

var upgradeLevels = {
    health: 0,
    damage: 0,
    speed: 0,
    fireRate: 0,
    armor: 0,
    hpRegen: 0
};

var maxUpgradeLevel = 5;

canvas.addEventListener("mousemove", function (event) {
    var rect = canvas.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
    mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);
});

canvas.addEventListener("mousedown", function (event) {
    if (event.button == 0 && gameRunning && !gamePaused && !gameOver) {
        mouseDown = true;
    }
});

window.addEventListener("mouseup", function (event) {
    if (event.button == 0) {
        mouseDown = false;
    }
});

window.addEventListener("keydown", function (event) {
    if (event.key == "Escape") {
        event.preventDefault();
        if (gameRunning && !gameOver) {
            if (gamePaused) {
                resumeGame();
            }
            else {
                pauseGame();
            }
        }
        return;
    }

    if (!gameRunning || gamePaused || gameOver) {
        return;
    }

    if (event.key == "w" || event.key == "W") {
        keys.w = true;
    }
    if (event.key == "a" || event.key == "A") {
        keys.a = true;
    }
    if (event.key == "s" || event.key == "S") {
        keys.s = true;
    }
    if (event.key == "d" || event.key == "D") {
        keys.d = true;
    }
});

window.addEventListener("keyup", function (event) {
    if (event.key == "w" || event.key == "W") {
        keys.w = false;
    }
    if (event.key == "a" || event.key == "A") {
        keys.a = false;
    }
    if (event.key == "s" || event.key == "S") {
        keys.s = false;
    }
    if (event.key == "d" || event.key == "D") {
        keys.d = false;
    }
});

function updateGameUI() {
    moneySpan.innerHTML = money;
    waveSpan.innerHTML = wave;
    ammoSpan.innerHTML = ammo + " / " + magazineSize;

    if (reloading) {
        ammoSpan.innerHTML = "RELOADING";
    }

    if (player != null) {
        updateHealthUI();
    }

    upgradeMoney.innerHTML = money;
}

function updateHealthUI() {
    if (player == null) {
        return;
    }

    var hp = player.getHP();
    var maxHP = player.getMaxHP();
    var percentage = hp / maxHP * 100;

    healthFill.style.width = percentage + "%";
    healthText.innerHTML = hp + " / " + maxHP + " HP";

    if (percentage > 60) {
        healthFill.style.backgroundColor = "#20c020";
    }
    else if (percentage > 30) {
        healthFill.style.backgroundColor = "#e6b800";
    }
    else {
        healthFill.style.backgroundColor = "#e00000";
    }
}

function updateUpgradeUI() {
    document.querySelector(".healthLevel").innerHTML = upgradeLevels.health;
    document.querySelector(".damageLevel").innerHTML = upgradeLevels.damage;
    document.querySelector(".speedLevel").innerHTML = upgradeLevels.speed;
    document.querySelector(".fireRateLevel").innerHTML = upgradeLevels.fireRate;
    document.querySelector(".armorLevel").innerHTML = upgradeLevels.armor;
    document.querySelector(".hpRegenLevel").innerHTML = upgradeLevels.hpRegen;

    document.querySelector(".healthCost").innerHTML = getUpgradeCost("health");
    document.querySelector(".damageCost").innerHTML = getUpgradeCost("damage");
    document.querySelector(".speedCost").innerHTML = getUpgradeCost("speed");
    document.querySelector(".fireRateCost").innerHTML = getUpgradeCost("fireRate");
    document.querySelector(".armorCost").innerHTML = getUpgradeCost("armor");
    document.querySelector(".hpRegenCost").innerHTML = getUpgradeCost("hpRegen");

    updateUpgradeButton("health", ".healthUpgrade");
    updateUpgradeButton("damage", ".damageUpgrade");
    updateUpgradeButton("speed", ".speedUpgrade");
    updateUpgradeButton("fireRate", ".fireRateUpgrade");
    updateUpgradeButton("armor", ".armorUpgrade");
    updateUpgradeButton("hpRegen", ".hpRegenUpgrade");

    upgradeMoney.innerHTML = money;
}

function getUpgradeCost(type) {
    return 10 * (upgradeLevels[type] + 1);
}

function updateUpgradeButton(type, selector) {
    var button = document.querySelector(selector);

    if (upgradeLevels[type] >= maxUpgradeLevel) {
        button.innerHTML = "MAX LEVEL";
        button.disabled = true;
    }
    else {
        button.innerHTML = "UPGRADE";
        button.disabled = false;
    }

    if (money < getUpgradeCost(type)) {
        button.disabled = true;
    }
}

function buyUpgrade(type) {
    if (!gamePaused || gameOver || player == null) {
        return;
    }

    if (upgradeLevels[type] >= maxUpgradeLevel) {
        return;
    }

    var cost = getUpgradeCost(type);

    if (money < cost) {
        return;
    }

    money -= cost;
    upgradeLevels[type]++;

    if (type == "health") {
        player.increaseMaxHP(20);
    }
    else if (type == "damage") {
        player.setDamage(player.getDamage() + 5);
    }
    else if (type == "speed") {
        player.setSpeed(player.getSpeed() + 0.5);
    }
    else if (type == "fireRate") {
        shootRate -= 15;
    }
    else if (type == "armor") {
        player.setArmor(player.getArmor() + 1);
    }
    else if (type == "hpRegen") {
        player.setHpRegen(player.getHpRegen() + 1);
    }

    updateGameUI();
    updateUpgradeUI();
}

document.querySelector(".healthUpgrade").addEventListener("click", function () {
    buyUpgrade("health");
});

document.querySelector(".damageUpgrade").addEventListener("click", function () {
    buyUpgrade("damage");
});

document.querySelector(".speedUpgrade").addEventListener("click", function () {
    buyUpgrade("speed");
});

document.querySelector(".fireRateUpgrade").addEventListener("click", function () {
    buyUpgrade("fireRate");
});

document.querySelector(".armorUpgrade").addEventListener("click", function () {
    buyUpgrade("armor");
});

document.querySelector(".hpRegenUpgrade").addEventListener("click", function () {
    buyUpgrade("hpRegen");
});

function playerMove() {
    if (player == null) {
        return;
    }

    var x = player.getX();
    var y = player.getY();
    var speed = player.getSpeed();

    if (keys.w) {
        y -= speed;
    }
    if (keys.s) {
        y += speed;
    }
    if (keys.a) {
        x -= speed;
        player.setFacing(-1);
    }
    if (keys.d) {
        x += speed;
        player.setFacing(1);
    }

    if (x < 0) {
        x = 0;
    }
    if (y < 0) {
        y = 0;
    }
    if (x > canvas.width - 60) {
        x = canvas.width - 60;
    }
    if (y > canvas.height - 60) {
        y = canvas.height - 60;
    }

    player.setX(x);
    player.setY(y);
    player.updatePosition();
}

function playerShoot() {
    if (player == null || !mouseDown || reloading || shootCooldown > 0) {
        return;
    }

    if (ammo <= 0) {
        startReload();
        return;
    }

    if (player instanceof Samurai) {
        slashes.push(new SamuraiSlash(
            gameObjects,
            player.getX() + 30,
            player.getY() + 30,
            mouseX,
            mouseY,
            player.getBulletSprite()
        ));
    }
    else {
        var bullet = new Bullet(
            gameObjects,
            player.getX() + 30,
            player.getY() + 30,
            mouseX,
            mouseY,
            player.getBulletSprite()
        );

        bullets.push(bullet);
    }

    player.shoot();
    ammo--;
    shootCooldown = shootRate;

    if (ammo <= 0) {
        startReload();
    }

    updateGameUI();
}

function startReload() {
    if (reloading) {
        return;
    }

    reloading = true;
    reloadTimer = reloadTime;
    mouseDown = false;
    updateGameUI();
}

function reloadUpdate() {
    if (!reloading) {
        return;
    }

    reloadTimer -= 20;

    if (reloadTimer <= 0) {
        ammo = magazineSize;
        reloading = false;
        reloadTimer = 0;
        updateGameUI();
    }
}

function regenUpdate() {
    if (player == null || player.getHpRegen() <= 0 || player.getHP() <= 0) {
        return;
    }

    regenTimer += 20;

    if (regenTimer >= 5000) {
        regenTimer = 0;
        player.heal(player.getHpRegen());
        updateHealthUI();
    }
}

function bulletMove() {
    for (var i = bullets.length - 1; i >= 0; i--) {
        bullets[i].move();

        if (
            bullets[i].getX() < 0 ||
            bullets[i].getX() > canvas.width ||
            bullets[i].getY() < 0 ||
            bullets[i].getY() > canvas.height
        ) {
            bullets[i].destroy();
            bullets.splice(i, 1);
        }
    }
}

function slashUpdate() {
    for (var i = slashes.length - 1; i >= 0; i--) {
        slashes[i].update();

        if (slashes[i].isExpired()) {
            slashes[i].destroy();
            slashes.splice(i, 1);
        }
    }
}

function spawnEnemy() {
    if (enemiesLeftToSpawn <= 0) {
        return;
    }

    var x;
    var y;
    var side = Math.floor(Math.random() * 4);

    if (side == 0) {
        x = Math.random() * canvas.width;
        y = -100;
    }
    else if (side == 1) {
        x = canvas.width + 100;
        y = Math.random() * canvas.height;
    }
    else if (side == 2) {
        x = Math.random() * canvas.width;
        y = canvas.height + 100;
    }
    else {
        x = -100;
        y = Math.random() * canvas.height;
    }

    var type;

    if (Math.random() < 0.5) {
        type = "rocket";
    }
    else {
        type = "demon";
    }

    var reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward;
    var enemy = new Enemy(gameObjects, x, y, type, reward);

    enemies.push(enemy);
    enemiesLeftToSpawn--;
}

function startWave() {
    wave++;
    enemiesLeftToSpawn = wave;

    minReward++;
    maxReward += 2;

    waveCooldownTimer = 0;

    spawnInterval = setInterval(function () {
        spawnEnemy();

        if (enemiesLeftToSpawn <= 0) {
            clearInterval(spawnInterval);
            spawnInterval = null;
        }
    }, 1000);

    updateGameUI();
}

function enemyMove() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].move(player);

        if (player.getX() + 30 > enemies[i].getX() + enemies[i].getWidth() / 2) {
            enemies[i].setFacing(1);
        }
        else {
            enemies[i].setFacing(-1);
        }
    }
}

function enemyShoot() {
    if (player == null) {
        return;
    }

    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].getType() == "demon") {
            enemies[i].updateCooldown();

            if (enemies[i].canShoot()) {
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

function fireballMove() {
    for (var i = fireballs.length - 1; i >= 0; i--) {
        fireballs[i].move();

        if (
            fireballs[i].getX() < -50 ||
            fireballs[i].getX() > canvas.width + 50 ||
            fireballs[i].getY() < -50 ||
            fireballs[i].getY() > canvas.height + 50
        ) {
            fireballs[i].destroy();
            fireballs.splice(i, 1);
        }
    }
}

function checkBulletCollision(){
    for(var i = bullets.length - 1; i >= 0; i--){
        for(var j = enemies.length - 1; j >= 0; j--){
            if(
                bullets[i].getX() + 10 >= enemies[j].getX() &&
                bullets[i].getX() - 10 <= enemies[j].getX() + enemies[j].getWidth() &&
                bullets[i].getY() + 5 >= enemies[j].getY() &&
                bullets[i].getY() - 5 <= enemies[j].getY() + enemies[j].getHeight()
            ){
                enemies[j].damage(player.getDamage());

                bullets[i].destroy();
                bullets.splice(i, 1);

                if(enemies[j].getDied()){
                    money += enemies[j].getReward();
                    enemies[j].destroy();
                    enemies.splice(j, 1);
                    updateGameUI();
                    updateUpgradeUI();
                }

                break;
            }
        }
    }
}

function checkSlashCollision() {
    for (var i = 0; i < slashes.length; i++) {
        var half = slashes[i].getSize() / 2;

        for (var j = enemies.length - 1; j >= 0; j--) {
            if (slashes[i].hasHit(enemies[j])) {
                continue;
            }

            if (
                slashes[i].getX() + half >= enemies[j].getX() &&
                slashes[i].getX() - half <= enemies[j].getX() + enemies[j].getWidth() &&
                slashes[i].getY() + half >= enemies[j].getY() &&
                slashes[i].getY() - half <= enemies[j].getY() + enemies[j].getHeight()
            ) {
                slashes[i].addHit(enemies[j]);
                enemies[j].damage(player.getDamage());

                if (enemies[j].getDied()) {
                    money += enemies[j].getReward();
                    enemies[j].destroy();
                    enemies.splice(j, 1);
                    updateGameUI();
                    updateUpgradeUI();
                }
            }
        }
    }
}

function checkEnemyCollision() {
    if (player == null) {
        return;
    }

    for (var i = enemies.length - 1; i >= 0; i--) {
        if (
            player.getX() < enemies[i].getX() + enemies[i].getWidth() &&
            player.getX() + 60 > enemies[i].getX() &&
            player.getY() < enemies[i].getY() + enemies[i].getHeight() &&
            player.getY() + 60 > enemies[i].getY()
        ) {
            if (enemies[i].getType() == "rocket") {
                player.takeDamage(20);
                enemies[i].destroy();
                enemies.splice(i, 1);
                updateHealthUI();
            }
        }
    }
}

function checkFireballCollision() {
    if (player == null) {
        return;
    }

    for (var i = fireballs.length - 1; i >= 0; i--) {
        if (
            fireballs[i].getX() < player.getX() + 60 &&
            fireballs[i].getX() + 15 > player.getX() &&
            fireballs[i].getY() < player.getY() + 60 &&
            fireballs[i].getY() + 15 > player.getY()
        ) {
            player.takeDamage(10);
            fireballs[i].destroy();
            fireballs.splice(i, 1);
            updateHealthUI();
        }
    }
}

function checkPlayerDeath() {
    if (player != null && player.getHP() <= 0) {
        endGame();
    }
}

function checkNextWave() {
    if (enemies.length == 0 && enemiesLeftToSpawn == 0 && spawnInterval == null) {
        waveCooldownTimer += 20;

        if (waveCooldownTimer >= nextWaveCooldown) {
            startWave();
        }
    }
    else {
        waveCooldownTimer = 0;
    }
}

function gameUpdate() {
    if (!gameRunning || gamePaused || gameOver) {
        return;
    }

    playerMove();

    if (shootCooldown > 0) {
        shootCooldown -= 20;
    }

    playerShoot();
    reloadUpdate();
    regenUpdate();
    bulletMove();
    slashUpdate();
    enemyMove();
    enemyShoot();
    fireballMove();
    checkBulletCollision();
    checkSlashCollision();
    checkEnemyCollision();
    checkFireballCollision();
    checkPlayerDeath();

    if (!gameOver) {
        checkNextWave();
    }
}

function pauseGame() {
    if (!gameRunning || gamePaused || gameOver) {
        return;
    }

    gamePaused = true;
    mouseDown = false;

    keys.w = false;
    keys.a = false;
    keys.s = false;
    keys.d = false;

    if (gameInterval != null) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    if (spawnInterval != null) {
        clearInterval(spawnInterval);
        spawnInterval = null;
    }

    pauseOverlay.style.display = "flex";
    updateUpgradeUI();
}

function resumeGame() {
    if (!gamePaused || gameOver) {
        return;
    }

    gamePaused = false;
    pauseOverlay.style.display = "none";

    if (enemiesLeftToSpawn > 0) {
        spawnInterval = setInterval(function () {
            spawnEnemy();

            if (enemiesLeftToSpawn <= 0) {
                clearInterval(spawnInterval);
                spawnInterval = null;
            }
        }, 1000);
    }

    gameInterval = setInterval(gameUpdate, 20);
}

function endGame() {
    if (gameOver) {
        return;
    }

    gameOver = true;
    gameRunning = false;
    gamePaused = false;
    mouseDown = false;

    keys.w = false;
    keys.a = false;
    keys.s = false;
    keys.d = false;

    if (gameInterval != null) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    if (spawnInterval != null) {
        clearInterval(spawnInterval);
        spawnInterval = null;
    }

    pauseOverlay.style.display = "none";
    deathOverlay.style.display = "flex";
}

function resetUpgrades() {
    upgradeLevels.health = 0;
    upgradeLevels.damage = 0;
    upgradeLevels.speed = 0;
    upgradeLevels.fireRate = 0;
    upgradeLevels.armor = 0;
    upgradeLevels.hpRegen = 0;

    shootRate = 100;
}

function resetGame() {
    if (gameInterval != null) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    if (spawnInterval != null) {
        clearInterval(spawnInterval);
        spawnInterval = null;
    }

    bullets = [];
    enemies = [];
    fireballs = [];
    slashes = [];

    gameObjects.innerHTML = "";

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
    regenTimer = 0;

    ammo = magazineSize;
    mouseDown = false;

    keys.w = false;
    keys.a = false;
    keys.s = false;
    keys.d = false;

    resetUpgrades();

    gameRunning = false;
    gamePaused = false;
    gameOver = false;

    canvas.width = 1000;
    canvas.height = 800;

    deathOverlay.style.display = "none";
    pauseOverlay.style.display = "none";

    updateGameUI();
    updateUpgradeUI();
}

function startGame() {
    resetGame();

    var selectedCharacter = document.querySelector("input[name='character']:checked").value;

    if (selectedCharacter == "cowboy") {
        player = new Cowboy(gameObjects, 470, 370);
    }
    else if (selectedCharacter == "samurai") {
        player = new Samurai(gameObjects, 470, 370);
    }
    else {
        player = new Soldier(gameObjects, 470, 370);
    }

    shootRate = player.getFireRate();
    reloadTime = player.getReloadSpeed();
    magazineSize = player.getMagSize();
    ammo = magazineSize;

    canvas.style.backgroundImage = "url('kepek/" + selectedCharacter + "/" + selectedCharacter + "_map.png')";

    mainMenu.style.display = "none";
    gameSection.style.display = "block";

    gameRunning = true;

    updateGameUI();
    updateUpgradeUI();

    startWave();

    gameInterval = setInterval(gameUpdate, 20);
}

function returnToMenu() {
    resetGame();

    gameSection.style.display = "none";
    mainMenu.style.display = "block";

    canvas.style.backgroundImage = "";
}

startButton.addEventListener("click", function () {
    startGame();
});

document.querySelector(".resumeButton").addEventListener("click", function () {
    resumeGame();
});

var restartButtons = document.querySelectorAll(".restartButton");

for (var i = 0; i < restartButtons.length; i++) {
    restartButtons[i].addEventListener("click", function () {
        startGame();
    });
}

var menuButtons = document.querySelectorAll(".menuButton");

for (var i = 0; i < menuButtons.length; i++) {
    menuButtons[i].addEventListener("click", function () {
        returnToMenu();
    });
}

updateGameUI();
updateUpgradeUI();
