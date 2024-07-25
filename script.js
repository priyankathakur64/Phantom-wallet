const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const segments = 12;
const colors = ['#000000', '#ff0000', '#000000', '#ff0000', '#000000', '#ff0000', '#000000', '#ff0000', '#000000', '#ff0000', '#000000', '#ff0000'];
const segmentAngle = 360 / segments;
const radius = canvas.width / 2 - 50;
let currentAngle = 0;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;
const winSound = document.getElementById('winSound'); 
const modal = document.getElementById('resultModal');
const span = document.getElementsByClassName('close')[0];

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFrame(); 
    for (let i = 0; i < segments; i++) {
        drawSegment(i);
    }
    drawBulbs(); 
    drawCenterMarker(); 
}

function drawFrame() {
    const frameThickness = 30; 
    const outerRadius = radius + frameThickness; 

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, outerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700'; 
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#DAA520'; 
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#000'; 
    ctx.fill();
}

function drawSegment(index) {
    const angle = segmentAngle * Math.PI / 180;
    const startAngle = (index * angle) + currentAngle;
    const endAngle = startAngle + angle;

    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, radius);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1, colors[index]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, startAngle, endAngle);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(startAngle + angle / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    
    const texts = ['10 💰', '1 💸', '3 🎰', '40 💰', '2 💴', '5 💸', '20 💰', '5 🎰', '2 💸', '15 💰', '2 💵', '1 🎰'];
    ctx.fillText(texts[index], radius / 2, 10);
    ctx.restore();
}

function drawBulbs() {
    const bulbCount = 36;
    const bulbRadius = 10;
    const bulbSpacing = (2 * Math.PI) / bulbCount;
    const bulbDistance = radius + 40; 

    for (let i = 0; i < bulbCount; i++) {
        const angle = i * bulbSpacing;
        const x = canvas.width / 2 + bulbDistance * Math.cos(angle);
        const y = canvas.height / 2 + bulbDistance * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, bulbRadius, 0, 2 * Math.PI);

        if (spinTime > 0) {
            ctx.fillStyle = 'yellow';
            ctx.shadowColor = 'yellow';
            ctx.shadowBlur = 20;
        } else {
            ctx.fillStyle = 'white';
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 10;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function drawCenterMarker() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.beginPath();
    ctx.moveTo(-40, 20);
    ctx.lineTo(40, 20);
    ctx.lineTo(0, -60);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(-40, -60, 40, 20);
    gradient.addColorStop(0, '#000');
    gradient.addColorStop(1, '#333');

    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function rotateWheel() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 4 + 6 * 1000;
    rotate();
}

function rotate() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    currentAngle += (spinAngle * Math.PI / 180);
    drawWheel();
    requestAnimationFrame(rotate);
}

function showModal() {
    console.log("Showing modal..."); // Debugging line
    modal.style.display = "block";
}

function stopRotateWheel() {
    const index = Math.floor(((currentAngle % (2 * Math.PI)) / (2 * Math.PI)) * segments);
    document.getElementById('modalResult').innerText = `Result: ${index === 0 ? '0' : index}`;
    console.log(`Result: ${index === 0 ? '0' : index}`); // Debugging line
    winSound.play();
    spinTime = 0;
    highlightWinningSegment(index);
    drawWheel();
    showModal(); // Ensure this is called
}


function highlightWinningSegment(index) {
    const angle = segmentAngle * Math.PI / 180;
    const startAngle = (index * angle) + currentAngle;
    const endAngle = startAngle + angle;

    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, startAngle, endAngle);
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();
    ctx.restore();
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

function showModal() {
    modal.style.display = "block";
}

// Close the modal when the user clicks on <span> (x)
span.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

document.getElementById('spinButton').addEventListener('click', rotateWheel);

drawWheel();
