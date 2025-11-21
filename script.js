// script.js – paste this exactly into a new file named script.js
document.addEventListener("DOMContentLoaded", function () {
  // Simple smooth scrolling for any anchor links (if you add #sections later)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Optional: tiny hover sound or confetti can be added later if you want
  console.log("BernieV Links page loaded – looking fire 🔥");
});