document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbarContainer .navBtn');
    const homeTextDiv = document.querySelector('.homeText');
  
    navLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault(); // Verhindert das Standardverhalten des Links
  
        const zielUrl = this.getAttribute('href');
  
        fetch(zielUrl)
          .then(response => response.text())
          .then(html => {
            homeTextDiv.innerHTML = html;
          })
          .catch(error => {
            homeTextDiv.innerHTML = 'Ein Fehler ist aufgetreten.';
            console.error(error);
          });
      });
    });
  });