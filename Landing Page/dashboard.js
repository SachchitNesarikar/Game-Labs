document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('mouseover', () => {
        item.style.boxShadow = "0px 0px 15px rgba(255, 255, 255, 0.2)";
    });
    item.addEventListener('mouseleave', () => {
        item.style.boxShadow = "none";
    });
});
