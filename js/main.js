// Add simple interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Add click handler for recipe cards
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('button')) {
                const link = card.querySelector('a').href;
                window.location.href = link;
            }
        });
    });
}); 