class Cowboy {
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
        this.#speed = 4;
        this.#hp = 100;
        this.#maxHP = 100;
        this.#hpRegen = 0;
        this.#armor = 0;
        this.#damage = 50;
        this.#fireRate = 400;
        this.#reloadSpeed = 2000;
        this.#magSize = 6;
        this.#altFireDamage = 0;
        this.#altFireCooldown = 0;
        this.#isinbox = false;
        this.#element = document.createElement("div");
        this.#element.classList.add("soldier");
        this.#element.style.backgroundImage = "url('kepek/cowboy/cowboy_idle.png')";
        new Image().src = "kepek/cowboy/cowboy_shoot.png";
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
        this.#element.style.backgroundImage = "url('kepek/cowboy/cowboy_shoot.png')";
        this.#shootTimer = setTimeout(() => {
            this.#element.style.backgroundImage = "url('kepek/cowboy/cowboy_idle.png')";
            this.#shootTimer = null;
        }, 70);
    }
    getBulletSprite() {
        return "kepek/cowboy/bullet.png";
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