class Bullet{
    #x;
    #y;
    #speed;
    #directionX;
    #directionY;
    #element;
    #container;
    constructor(container, x, y, targetX, targetY, sprite){
        this.#container = container;
        this.#x = x;
        this.#y = y;
        this.#speed = 10;
        var dx = targetX - x;
        var dy = targetY - y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if(distance == 0){
            distance = 1;
        }
        this.#directionX = dx / distance;
        this.#directionY = dy / distance;
        this.#element = document.createElement("div");
        this.#element.classList.add("bullet");
        if(sprite == undefined){
            sprite = "kepek/soldier/bullet.png";
        }
        this.#element.style.backgroundImage = "url('" + sprite + "')";
        var angle = Math.atan2(dy, dx) * (180 / Math.PI);
        this.#element.style.transform = "translate(-50%, -50%) rotate(" + angle + "deg)";
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