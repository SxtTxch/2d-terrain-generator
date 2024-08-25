const canvas = document.getElementById('noiseCanvas');
const ctx = canvas.getContext('2d');

function executeAsync(func) {
    setTimeout(func, 0);
}

const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min;
}

function drawTree(x, y, treeSize) {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(x + treeSize / 2, y + treeSize / 2, treeSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawStone(x, y, stoneSize) {
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.ellipse(x + stoneSize / 2, y + stoneSize / 2, stoneSize / 2, stoneSize / 4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
}

function generateTerrain() {
    const canvasWidth = parseInt(document.getElementById('canvasWidth').value);
    const canvasHeight = parseInt(document.getElementById('canvasHeight').value);
    const voxelSize = parseInt(document.getElementById('voxelSize').value);
    const resolution = parseFloat(document.getElementById('resolution').value);
    const frequency = parseFloat(document.getElementById('frequency').value);
    const treeSpawnrate = parseFloat(document.getElementById('treeSpawnrate').value);
    const stoneSpawnrate = parseFloat(document.getElementById('stoneSpawnrate').value);
    const treeSize = parseFloat(document.getElementById('treeSize').value);
    const stoneSize = parseFloat(document.getElementById('stoneSize').value);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    noise.seed(Math.random());

    function drawFrame() {
        for (let x = 0; x < canvas.width; x += voxelSize) {
            for (let y = 0; y < canvas.height; y += voxelSize) {
                const value = Math.round(noise.simplex2(x / resolution * frequency, y / resolution * frequency) * 100) / 100;
                
                let colorValue;
                if (value < -0.5) {
                    let blue = Math.floor(20 + 60 * (value + 1) / 0.5);
                    colorValue = `hsl(221, 100%, ${blue}%)`;
                } else if (value >= -0.5 && value < -0.25) {
                    let blue = Math.floor(50 + 10 * (value + 0.5) / 0.25);
                    colorValue = `hsl(200, 80%, ${blue}%)`;
                } else if (value >= -0.25 && value < 0) {
                    let lightness = Math.floor(70 - 20 * (value + 0.25) / 0.25);
                    colorValue = `hsl(45, 70%, ${lightness}%)`;
                } else if (value >= 0 && value < 0.5) {
                    let green = Math.floor(40 + 20 * value / 0.5);
                    colorValue = `hsl(100, 60%, ${green}%)`;
                } else if (value >= 0.5 && value < 0.7) {
                    let lightness = Math.floor(30 - 10 * (value - 0.5) / 0.2);
                    colorValue = `hsl(30, 40%, ${lightness}%)`;
                } else if (value >= 0.7 && value < 0.9) {
                    let gray = Math.floor(80 - 30 * (value - 0.7) / 0.2);
                    colorValue = `hsl(0, 0%, ${gray}%)`;
                } else {
                    let whiteness = Math.floor(100 - 50 * (value - 0.9) / 0.1);
                    colorValue = `hsl(0, 0%, ${whiteness}%)`;
                }

                ctx.fillStyle = colorValue;
                ctx.fillRect(x, y, voxelSize, voxelSize);

                //FILL WITH ASSETS

                if (Math.random() < treeSpawnrate && value >= 0 && value < 0.5) {
                    drawTree(x, y, treeSize);       
                }

                if (Math.random() < stoneSpawnrate && value >= 0.7 && value < 0.9) {
                    drawStone(x, y, stoneSize)
                }
            }
        }
    }

    drawFrame();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate').addEventListener('click', generateTerrain);
});
