const screenW = window.innerWidth;
const screenH = window.innerHeight;

function getStarLayout() {
    return document.getElementsByClassName("stars")[0];
}

function addToStarLayout(element) {
    getStarLayout().append(element);
}

function randomNumber(min, max) {
    if (min > max) {
        let temp = min;
        min = max;
        max = temp;
    }
    else if (min >= max) return min;
    return (max - min) * Math.random() + min
}

function randomNumberBiasedLow(min, max, chance = 0.5) {
    if (chance > 1) chance = 1;
    let randomNum = randomNumber(min, max) - randomNumber(max * chance, max);
    if (randomNum < min) return min;
    return randomNum;
}

function gotLucky(chance) {
    if (randomNumber(0, 1) <= chance) return true;
    return false;
}

class ElementClass {
    constructor(element = document.createElement("div")) {
        this.element = element;
    }

    getElement() {
        return this.element;
    }

    setPosition(left, top) {
        this.getElement().style.left = left + "px";
        this.getElement().style.top = top + "px";
    }

    isOutside(x, y) {
        const bounds = this.getElement().getBoundingClientRect();
        if (bounds.x > x || bounds.y > y) return true;
        return false;
    }
}

class MovingObject extends ElementClass {
    constructor(velocityX, velocityY, moveSpeed) {
        super();
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.moveSpeed = moveSpeed;
    }
    getVelocityX() {
        return this.velocityX;
    }

    getVelocityY() {
        return this.velocityY;
    }

    move() {
        const bounds = this.getElement().getBoundingClientRect();
        this.getElement().style.left = bounds.x + this.getVelocityX() * this.moveSpeed + "px";
        this.getElement().style.top = bounds.y + this.getVelocityY() * this.moveSpeed + "px";
    }
}

class FadeStar extends ElementClass {
    constructor(starElement, duration) {
        super(starElement);
        this.duration = duration;
    }

    onAnimationEnd() {
        removeEventListener("animationend", this.handler);
        this.getElement().remove();
    }

    startFade() {
        addToStarLayout(this.getElement());
        this.getElement().style.animationName = "fadeStarAnimation";
        this.getElement().style.animationDuration = this.duration + "s";
        this.handler = this.getElement().addEventListener("animationend", () => { this.onAnimationEnd() });
    }
}

class Star extends ElementClass {
    constructor(width, height, x, y, color, fadeDuration = 2) {
        super();
        this.getElement().className = "star";
        this.getElement().style.width = width + "px";
        this.getElement().style.height = height + "px";
        this.getElement().style.top = y + "px";
        this.getElement().style.left = x + "px";
        this.getElement().style.background = color;
        this.fadeDuration = fadeDuration;
    }

    doFade(star) {
        const bounds = star.getBoundingClientRect();
        let copiedStar = star.cloneNode(true);
        let fadeStar = new FadeStar(copiedStar, 2);
        fadeStar.setPosition(bounds.x, bounds.y);
        fadeStar.startFade();
    }

    addFadeEffect(interval) {
        setInterval(() => {
            this.doFade(this.getElement())
        }, interval);
    }
}

class MovingStarGroup extends MovingObject {
    constructor(size, x, y, velocityX, velocityY, moveSpeed) {
        super(velocityX, velocityY, moveSpeed);
        this.size = size;
        this.getElement().style.width = size + "px";
        this.getElement().style.height = size + "px";
        this.setPosition(x, y)

        this.stars = [];

        // Equation stuff
        this.k = velocityY / velocityX;
        this.b = y - this.k * x // b = y - kx, y = kx + b
    }

    moveOutside(minX, minY) {
        // When b is positive, it crosses over x axis first, when negative, it crosses over y axis first
        let y = this.k * minX + this.b // y = kx + b, mitä y on kun x on minX
        let x = minY / this.k - this.b // x = y / k - b, mitä x on kun y on minY
        this.setPosition(x, y);
    }

    getSize() {
        return this.size;
    }

    addStar(starObject) {
        this.stars.push(starObject);
        this.getElement().append(starObject.getElement());
    }

    getStars() {
        return this.stars;
    }
}

function getRandomizedStarGroup(size, velx, vely) {
    let x = randomNumber(size * -1, screenW - (size / 2));
    let y = randomNumber(size * -1, screenH - (size / 2));

    let moveSpeed = randomNumberBiasedLow(0.1, 1, 0.2);

    return new MovingStarGroup(size, x, y, velx, vely, moveSpeed);
}

function getRandomizedStar(groupSize) {

    const colors = ["yellow", "orange", "blue", "purle", "green", "lime"]

    const width = randomNumber(1, 4);
    const height = randomNumber(1, 4);
    const x = randomNumber(0, groupSize);
    const y = randomNumber(0, groupSize);
    let color;

    if (gotLucky(0.01)) color = colors[Math.round(randomNumber(0, colors.length - 1))];
    else color = "white";

    const star = new Star(width, height, x, y, color);
    if (randomNumber(0, 10) <= 0.05) {
        star.addFadeEffect(1000 / 30);
        star.getElement().style.background = (randomNumber(0,1) <= 0.5) ? "orange" : "pink";
    }

    const elementStar = star.getElement();
    elementStar.style.opacity = randomNumberBiasedLow(0.1, 1.5, 0.2);
    if(width > 3 && height > 3) elementStar.style.borderRadius = Math.round(randomNumberBiasedLow(50, 100, 0.1)); + "% " + Math.round(randomNumberBiasedLow(50, 100, 0.1)); + "%";
    return star;
}

function moveGroups() {
    groups.forEach(group => {
        group.move();
        if (group.isOutside(screenW, screenH)) {
            const bounds = group.getElement().getBoundingClientRect();
            group.moveOutside(0 - group.getSize(), 0 - group.getSize());
        }
    })
}

function initializeStars() {
    const frame = getStarLayout();

    for (let i = 0; i < groupCount; i++) {
        const group = getRandomizedStarGroup(groupSize, velX, velY);
        for (let x = 0; x < starsPerGroup; x++) {
            const star = getRandomizedStar(groupSize);
            group.addStar(star);
        }
        groups.push(group);
        frame.append(group.getElement());
    }

    setInterval(moveGroups, 1000 / fps)
}

const fps = 30;
const fpsRatio = 30 / fps;

const groups = [];
const groupCount = 25;
const starsPerGroup = 15;
const groupSize = 700;
const velX = 2;
const velY = 1;

initializeStars();