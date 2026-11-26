class Enemy{
    #x;
    #y;
    #speed;
    #hp;
    #element;
    #container;
    #width;
    #height;
    #type;
    #died
    #reward;
    #fireCooldown;
    constructor(container, x, y, type, reward){
        this.#container = container;
        this.#x = x;
        this.#y = y;
        this.#type = type;
        this.#died = false;
        this.#reward = reward;
        this.#fireCooldown = 0;
        if(type == "rocket"){
            this.#width = 74;
            this.#height = 49;
            this.#speed = 1;
            this.#hp = 30;
        }
        else if(type == "demon"){
            this.#width = 100;
            this.#height = 100;
            this.#speed = 2;
            this.#hp = 60;
        }
        this.#element = document.createElement("div");
        this.#element.classList.add("enemy");
        this.#element.style.width = this.#width + "px";
        this.#element.style.height = this.#height + "px";
        if(type == "rocket"){
            this.#element.style.backgroundImage = "url('kepek/enemies/rocket_enemy.png')";
        }
        else if(type == "demon"){
            this.#element.style.backgroundImage = "url('kepek/enemies/demon_enemy.png')";
        }
        this.#container.appendChild(this.#element);
        this.updatePosition();
    }
    updatePosition(){
        this.#element.style.left = this.#x + "px";
        this.#element.style.top = this.#y + "px";
    }
    move(player){
        if(player == null){
            return;
        }
        var dx = player.getX() + 30 - (this.#x + this.#width / 2);
        var dy = player.getY() + 30 - (this.#y + this.#height / 2);
        var distance = Math.sqrt(dx * dx + dy * dy);
        if(distance != 0){
            this.#x += dx / distance * this.#speed;
            this.#y += dy / distance * this.#speed;
        }
        this.updatePosition();
    }
    getX(){
        return this.#x;
    }
    getY(){
        return this.#y;
    }
    getWidth(){
        return this.#width;
    }
    getHeight(){
        return this.#height;
    }
    getHP(){
        return this.#hp;
    }
    getType(){
        return this.#type;
    }
    getDied(){
        return this.#died;
    }
    getReward(){
        return this.#reward;
    }
    getElement(){
        return this.#element;
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
    setFacing(direction){
        if(direction == 1){
            this.#element.style.transform = "scaleX(-1)";
        }
        else{
            this.#element.style.transform = "scaleX(1)";
        }
    }
    damage(amount){
        this.#hp -= amount;
        if(this.#hp <= 0){
            this.#hp = 0;
            this.#died = true;
        }
    }
    updateCooldown(){
        if(this.#fireCooldown > 0){
            this.#fireCooldown -= 20;
        }
    }
    canShoot(){
        return this.#fireCooldown <= 0;
    }
    shoot(){
        this.#fireCooldown = 2000;
    }
    destroy(){
        this.#element.remove();
    }
}

class Fireball{
    #x;
    #y;
    #speed;
    #directionX;
    #directionY;
    #element;
    #container;
    constructor(container, x, y, targetX, targetY){
        this.#container = container;
        this.#x = x;
        this.#y = y;
        this.#speed = 3;
        var dx = targetX - x;
        var dy = targetY - y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if(distance == 0){
            distance = 1;
        }
        this.#directionX = dx / distance;
        this.#directionY = dy / distance;
        this.#element = document.createElement("div");
        this.#element.classList.add("fireball");
        this.#element.style.backgroundImage = "url('kepek/enemies/fireball.png')";
        this.#container.appendChild(this.#element);
        this.updatePosition();
    }
    move(){
        this.#x += this.#directionX * this.#speed;
        this.#y += this.#directionY * this.#speed;
        this.updatePosition();
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
    destroy(){
        this.#element.remove();
    }
}