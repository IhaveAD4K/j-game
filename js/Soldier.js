class Soldier{
    #x;
    #y;
    #speed;
    #element;
    #container;
    #hp;
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
    constructor(container, x, y){
        this.#container = container;
        this.#x = x;
        this.#y = y;
        this.#speed = 4;
        this.#hp = 100;
        this.#hpRegen = 0;
        this.#armor = 0;
        this.#damage = 20;
        this.#fireRate = 100;
        this.#reloadSpeed = 1500;
        this.#magSize = 30;
        this.#altFireDamage = 0;
        this.#altFireCooldown = 0;
        this.#isinbox = false;
        this.#element = document.createElement("div");
        this.#element.classList.add("soldier");
        this.#element.style.backgroundImage = "url('kepek/soldier/soldier0.png')";
        this.#container.appendChild(this.#element);
        this.updatePosition();
        this.#facing = 1;
    }
    updatePosition(){
        this.#element.style.left = this.#x + "px";
        this.#element.style.top = this.#y + "px";
    }
    getX(){
        return this.#x;
    }
    getY(){
        return this.#y;
    }
    getSpeed(){
        return this.#speed;
    }
    setX(x){
        this.#x = x;
    }
    setY(y){
        this.#y = y;
    }
    setSpeed(speed){
        this.#speed = speed;
    }
    setFacing(direction){
    this.#facing = direction;
    if(direction == -1){
        this.#element.style.transform = "scaleX(-1)";
    }
    else{
        this.#element.style.transform = "scaleX(1)";
    }
}
getFacing(){
    return this.#facing;
}
takeDamage(amount){
    this.#hp -= amount;

    console.log("HP: " + this.#hp);

    if(this.#hp <= 0){
        this.#hp = 0;
        console.log("Player died!");
    }
}

getHP(){
    return this.#hp;
}
}
