(function()
{

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = 160;
const height = 44;

canvas.width = 1400;
canvas.height = 1400;

const distance_from_camera = 100;
const CUBE_WIDTH = 20;
const backgroundASCIICode = '.';
const horizontalOffset = 40;
const K1 = 40;
const incrementSpeed = 0.5;

let A = 0;
let B = 0;
let C = 0;

let zBuffer = new Array(width * height).fill(0.0);
let buffer = new Array(width * height).fill('.');

function calculateX(i, j, k) {
    return j * Math.sin(A) * Math.sin(B) * Math.cos(C) -
        k * Math.cos(A) * Math.sin(B) * Math.cos(C) +
        j * Math.cos(A) * Math.sin(C) +
        k * Math.sin(A) * Math.sin(C) +
        i * Math.cos(B) * Math.cos(C);
}

function calculateY(i, j, k) {
    return j * Math.cos(A) * Math.cos(C) +
        k * Math.sin(A) * Math.cos(C) -
        j * Math.sin(A) * Math.sin(B) * Math.sin(C) +
        k * Math.cos(A) * Math.sin(B) * Math.sin(C) -
        i * Math.cos(B) * Math.sin(C);
}

function calculateZ(i, j, k) {
    return k * Math.cos(A) * Math.cos(B) -
        j * Math.sin(A) * Math.cos(B) +
        i * Math.sin(B);
}

function calculate_surface(cubeX, cubeY, cubeZ, ch) {
    let x = calculateX(cubeX, cubeY, cubeZ);
    let y = calculateY(cubeX, cubeY, cubeZ);
    let z = calculateZ(cubeX, cubeY, cubeZ) + distance_from_camera;

    let ooz = 1 / z;

    let xp = Math.floor(width / 2 + horizontalOffset + K1 * ooz * x * 2);
    let yp = Math.floor(height / 2 + K1 * ooz * y);

    let idx = xp + yp * width;

    if (idx >= 0 && idx < width * height) {
        if (ooz > zBuffer[idx]) {
            zBuffer[idx] = ooz;
            buffer[idx] = ch;
        }
    }
}

function animate2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    buffer.fill(backgroundASCIICode);
    zBuffer.fill(0.0);

    for (let cubeX = -CUBE_WIDTH; cubeX < CUBE_WIDTH; cubeX += incrementSpeed) {
        for (let cubeY = -CUBE_WIDTH; cubeY < CUBE_WIDTH; cubeY += incrementSpeed) {
            calculate_surface(cubeX, cubeY, -CUBE_WIDTH, '@');
            calculate_surface(CUBE_WIDTH, cubeY, cubeX, '$');
            calculate_surface(-CUBE_WIDTH, cubeY, -cubeX, '~');
            calculate_surface(-cubeX, cubeY, CUBE_WIDTH, '#');
            calculate_surface(cubeX, -CUBE_WIDTH, -cubeY, ';');
            calculate_surface(cubeX, CUBE_WIDTH, cubeY, '+');
        }
    }

    ctx.fillStyle = "white";
    let output = buffer.join("");
    ctx.font = "16px monospace";
    let rows = output.match(/.{1,80}/g);
    rows.forEach((row, index) => {
        ctx.fillText(row, 10, 20 + index * 16);
    });

    A += 0.01;
    B += 0.01;
    C += 0;

    requestAnimationFrame(animate2);
}

animate2();
})();