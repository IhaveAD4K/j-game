class Samurai {
    #x;
    #y;
    #speed;
    #element;
    #container;
    #hp;
    #maxHP;
    #hpRegen;
    #armor;
    #damage;
    #fireRate;
    #reloadSpeed;
    #magSize;
    #altFireDamage;
    #altFireCooldown;
    #isinbox;
    #facing;
    #shootTimer;
    constructor(container, x, y) {
        this.#container = container;
        this.#x = x;
        this.#y = y;
        this.#speed = 5;
        this.#hp = 90;
        this.#maxHP = 90;
        this.#hpRegen = 0;
        this.#armor = 0;
        this.#damage = 30;
        this.#fireRate = 250;
        this.#reloadSpeed = 1200;
        this.#magSize = 12;
        this.#altFireDamage = 0;
        this.#altFireCooldown = 0;
        this.#isinbox = false;
        this.#element = document.createElement("div");
        this.#element.classList.add("soldier");
        this.#element.style.backgroundImage = "url('kepek/samurai/samurai_idle.png')";
        new Image().src = "kepek/samurai/samurai_shoot.png";
        this.#shootTimer = null;
        this.#container.appendChild(this.#element);
        this.updatePosition();
        this.#facing = 1;
    }
    updatePosition() {
        this.#element.style.left = this.#x + "px";
        this.#element.style.top = this.#y + "px";
    }
    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    getSpeed() {
        return this.#speed;
    }
    getHP() {
        return this.#hp;
    }
    getMaxHP() {
        return this.#maxHP;
    }
    getHpRegen(){
        return this.#hpRegen;
    }
    getArmor(){
        return this.#armor;
    }
    getDamage() {
        return this.#damage;
    }
    getFireRate() {
        return this.#fireRate;
    }
    getReloadSpeed() {
        return this.#reloadSpeed;
    }
    getMagSize() {
        return this.#magSize;
    }
    shoot() {
        if (this.#shootTimer != null) {
            clearTimeout(this.#shootTimer);
        }
        this.#element.style.backgroundImage = "url('kepek/samurai/samurai_shoot.png')";
        this.#shootTimer = setTimeout(() => {
            this.#element.style.backgroundImage = "url('kepek/samurai/samurai_idle.png')";
            this.#shootTimer = null;
        }, 100);
    }
    getBulletSprite() {
        return "kepek/samurai/katana_slash.png";
    }
    setX(x) {
        this.#x = x;
    }
    setY(y) {
        this.#y = y;
    }
    setSpeed(speed) {
        this.#speed = speed;
    }
    setDamage(damage) {
        this.#damage = damage;
    }
    setHpRegen(hpRegen){
        this.#hpRegen = hpRegen;
    }
    setArmor(armor){
        this.#armor = armor;
    }
    increaseMaxHP(amount) {
        this.#maxHP += amount;
        this.#hp += amount;
    }
    setFacing(direction) {
        this.#facing = direction;
        if (direction == -1) {
            this.#element.style.transform = "scaleX(-1)";
        }
        else {
            this.#element.style.transform = "scaleX(1)";
        }
    }
    getFacing() {
        return this.#facing;
    }
    takeDamage(amount) {
        this.#hp -= Math.max(1, amount - this.#armor);
        if (this.#hp <= 0) {
            this.#hp = 0;
        }
    }
    heal(amount) {
        this.#hp += amount;
        if (this.#hp > this.#maxHP) {
            this.#hp = this.#maxHP;
        }
    }
}

class SamuraiSlash {
    #x;
    #y;
    #size;
    #life;
    #element;
    #container;
    #hitEnemies;
    constructor(container, x, y, targetX, targetY, sprite) {
        this.#container = container;
        var dx = targetX - x;
        var dy = targetY - y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance == 0) {
            distance = 1;
        }
        this.#size = 120;
        this.#life = 150;
        this.#hitEnemies = [];
        this.#x = x + dx / distance * 60;
        this.#y = y + dy / distance * 60;
        this.#element = document.createElement("div");
        this.#element.style.position = "absolute";
        this.#element.style.width = this.#size + "px";
        this.#element.style.height = this.#size + "px";
        this.#element.style.backgroundSize = "contain";
        this.#element.style.backgroundPosition = "center";
        this.#element.style.backgroundRepeat = "no-repeat";
        this.#element.style.pointerEvents = "none";
        this.#element.style.backgroundImage = "url('" + sprite + "')";
        var angle = Math.atan2(dy, dx) * (180 / Math.PI);
        this.#element.style.transform = "translate(-50%, -50%) rotate(" + angle + "deg)";
        this.#element.style.left = this.#x + "px";
        this.#element.style.top = this.#y + "px";
        this.#container.appendChild(this.#element);
    }
    update() {
        this.#life -= 20;
    }
    isExpired() {
        return this.#life <= 0;
    }
    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    getSize() {
        return this.#size;
    }
    hasHit(enemy) {
        return this.#hitEnemies.includes(enemy);
    }
    addHit(enemy) {
        this.#hitEnemies.push(enemy);
    }
    destroy() {
        this.#element.remove();
    }
}