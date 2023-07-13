const CANVAS_CONTAINER_ID = 'canvas-container';
let username;

const app = {

    init() {
        document.querySelector('form').addEventListener('input', app.dataHandler);
        socket = io();
        socket.on("autodraw", (data) => {
            app.generateDraw(data)
        })
    },

    dataHandler() {
        const thicknessInput = document.querySelector('[name=thickness]');
        const previewElem = document.querySelector('.thickness-preview');
        const color = document.querySelector('[name=color]').value;
        previewElem.style.width = `${thicknessInput.value}px`;
        previewElem.style.height = `${thicknessInput.value}px`;
        previewElem.style["background-color"] = color;
        username = document.querySelector('[name=username]').value;
    },

    generateDraw(data) {
        stroke(data.color);
        strokeWeight(data.thickness);
        line(data.mouseX, data.mouseY, data.pmouseX, data.pmouseY);
        app.arrowHandle(data);
    },

    arrowHandle(data) {
        let arrow = document.getElementById(data.uuid);
        const canvasContainer = document.getElementById(CANVAS_CONTAINER_ID);
        if (!arrow) {
            arrow = document.createElement('div');
            arrow.id = data.uuid;
            arrow.classList.add('arrow');
            const randomDeg = app.randomInt(-360, 360);
            arrow.style.filter = `hue-rotate(${randomDeg}deg)`;
            canvasContainer.appendChild(arrow);
        }

        const [uuidShort] = data.uuid.split('-');
        arrow.textContent = data.username ?? uuidShort;

        let arrowX;
        let arrowY;
        if (
            data.mouseX < canvasContainer.offsetWidth
            && data.mouseX > 0
        ) {
            arrowX = data.mouseX;
        } else if (data.mouseX < 0) {
            arrowX = 0;
        } else if (data.mouseX > canvasContainer.offsetWidth) {
            arrowX = canvasContainer.offsetWidth - arrow.offestWidth;
        }

        if (
            data.mouseY < canvasContainer.offsetHeight
            && data.mouseY > 0
        ) {
            arrowY = data.mouseY;
        } else if (data.mouseY < 0) {
            arrowY = 0;
        } else if (data.mouseY > canvasContainer.offsetHeight) {
            arrowX = canvasContainer.offsetHeight - arrow.offsetHeight;
        }

        arrow.style.left = `${arrowX}px`;
        arrow.style.top = `${arrowY}px`;
    },

    randomInt(min, max) {
        const newMin = Math.ceil(min);
        const newMax = Math.floor(max);
        return Math.floor(Math.random() * (newMax - newMin + 1)) + newMin;
    },

};


// eslint-disable-next-line no-unused-vars
function setup() {
    const aside = document.querySelector('aside');
    const main = document.querySelector('main');
    const width = main.offsetWidth - aside.offsetWidth;
    const height = window.innerHeight - 100;
    const p5 = createCanvas(width, height);
    p5.parent(CANVAS_CONTAINER_ID);
    canvas = p5.canvas;
}

// eslint-disable-next-line no-unused-vars
function draw() {
    if (mouseIsPressed) {
        const color = document.querySelector('[name=color]').value;
        stroke(color);
        const thickness = document.querySelector('[name=thickness]').value;
        strokeWeight(thickness);
        line(mouseX, mouseY, pmouseX, pmouseY);

        const data = {
            mouseX,
            mouseY,
            pmouseX,
            pmouseY,
            color,
            thickness,
            username,
        }


        socket.emit("draw", data)
    }
}
// eslint-disable-next-line no-unused-vars
function mouseMoved() {

}

document.addEventListener('DOMContentLoaded', app.init);