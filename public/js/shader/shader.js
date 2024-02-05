const shader = document.getElementById('shader');

const maxScale = 1.2;

function animateSize() {
    const randomScale = Math.random() * (maxScale - 1) + 1; // Random scale between 1 and maxScale
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const newSize = {
        width: screenWidth / 2 * randomScale,
        height: screenHeight / 2 * randomScale
    };

    // Center the element
    const newPosition = {
        x: (screenWidth - newSize.width) / 2,
        y: (screenHeight - newSize.height) / 2
    };

    shader.style.width = newSize.width + 'px';
    shader.style.height = newSize.height + 'px';
    shader.style.left = newPosition.x + 'px';
    shader.style.top = newPosition.y + 'px';
}

function animate() {
    animateSize();
    setTimeout(animateForever, 3000); // Adjust the timeout as needed
}

animate();