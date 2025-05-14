
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".project-card");
  const wrappers = document.querySelectorAll(".card-wrapper");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("card-wrapper")) {
          // Kašnjenje za wrapper
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, 500); // 0.5 sekunde kašnjenje
        } else {
          entry.target.classList.add("visible");
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5, // Kada se 50% kartice pojavi, pokreće se fade-in
  });

  cards.forEach((card) => {
    observer.observe(card);
  });

  wrappers.forEach((wrapper) => {
    observer.observe(wrapper);
  });
});
window.addEventListener('scroll', function () {
  const toTopBtn = document.getElementById('to-top-btn');
  
  if (window.scrollY > 0) {
    toTopBtn.classList.add('show');
  } else {
    toTopBtn.classList.remove('show');
  }
});

document.getElementById('to-top-btn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/*Inicijalizacija nekih elemenata koji se nalaze na svim/vecini stranica */
document.addEventListener('DOMContentLoaded', function() {
  let elems_sidenav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems_sidenav, {});

  let elems_parallax = document.querySelectorAll('.parallax');
  M.Parallax.init(elems_parallax, {});

  let elems_tooltip = document.querySelectorAll('.tooltipped');
  M.Tooltip.init(elems_tooltip, {});

  let elems_modal = document.querySelectorAll('.modal');
  M.Modal.init(elems_modal, {});

  let elems_collapsible = document.querySelectorAll('.collapsible');
  M.Collapsible.init(elems_collapsible, {});

  checkLogin();
});

  document.getElementById("toggle-arrow").addEventListener("click", function () {
    const aboutText = document.getElementById("about-text");
    this.classList.toggle("rotate");
    
    if (aboutText.classList.contains("show")) {
      aboutText.classList.remove("show");
      aboutText.style.maxHeight = "0";
      aboutText.style.opacity = "0";
    } else {
      aboutText.classList.add("show");
      aboutText.style.maxHeight = aboutText.scrollHeight + "px";
      aboutText.style.opacity = "1";
    }
  });
 document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
      duration: 1500,  // Trajanje animacije
      easing: 'ease',  // Easing funkcija
      once: true,      // Da se animacija pokreće samo jednom
    });
  });