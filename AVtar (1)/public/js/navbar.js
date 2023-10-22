function createNavbar() {
    const navbarHTML = `
        <nav class="navbar">
            <div class="container">
                <a href="#" class="logo">My Website</a>
                <ul class="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
        </nav>
    `;

    const navDiv = document.querySelector(".nav");
    navDiv.innerHTML = navbarHTML;
}

// Call the createNavbar function when the page is loaded
window.addEventListener("DOMContentLoaded", createNavbar);