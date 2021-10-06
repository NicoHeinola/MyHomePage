function getStarLayout() {
    return document.getElementsByClassName("stars")[0];
}

function randomNumber(min, max) {
    return Math.random() * (max - min + 1) + min
}

function createStar() {
    let star = document.createElement("div");
    star.className = "star";
    /*let starImage = document.createElement("img");
    starImage.src = "./images/sky/stars/star1.png";
    star.append(starImage);*/

    star.style.background = "white";

    let width = randomNumber(1, 5);
    let height = randomNumber(1, 5);
    let x = randomNumber(0, window.outerWidth);
    let y = randomNumber(0, window.outerHeight);
    let blur = randomNumber(0, 1);
    star.style.left = x + "px";
    star.style.top = y + "px";
    star.style.width = width + "px";
    star.style.height = height + "px";
    star.style.filter = "blur(" + blur + "px)";
    star.style.borderRadius = "100% 20%";

    let animationLength = randomNumber(1, 5) + "s";
    let animationDelay = randomNumber(0, 2) + "s";
    star.style.animationDelay = animationDelay;
    star.style.animationDuration = animationLength;
    return star;
}

function replaceStar(star) {
    star.remove();
    let newStar = createStar();
    addStar(newStar);
}
var i = 0

function addStar(star) {
    getStarLayout().append(star);
    starReplaceListener(star);
    console.log(i++)
}

function starReplaceListener(star) {
    let handler = () => {
        replaceStar(star);
        star.removeEventListener("click", handler)
    }
    star.addEventListener("animationend", handler)
}

function initializeStars() {
    let starCount = 100;
    for (let i = 0; i < starCount; i++) {
        addStar(createStar());
    }
}

initializeStars();