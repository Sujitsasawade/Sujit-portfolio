// Navigation active link tracking on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');
const menuToggle = document.getElementById('mobile-menu');
const navContainer = document.querySelector('header nav');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });
};

// Toggle navbar for mobile view
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navContainer.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if(navContainer.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navContainer.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-times', 'fa-bars');
    });
});