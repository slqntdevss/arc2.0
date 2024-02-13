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

    shader.style.width = newSize.width + 'px';
    shader.style.height = newSize.height + 'px';
}

function animate() {
    animateSize();
    setTimeout(animateForever, 3000); // Adjust the timeout as needed
}
window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = href
    }, 500)
}

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
})
animate();