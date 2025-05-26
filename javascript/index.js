
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".project-card");
  const wrappers = document.querySelectorAll(".card-wrapper");
  const slajders = document.querySelectorAll(".image-slider");

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
  slajders.forEach((slajder) => {
    observer.observe(slajder);
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

});

 document.querySelectorAll(".toggle-arrow").forEach(arrow => {
  arrow.addEventListener("click", function () {
    const targetId = this.dataset.target;
    const target = document.getElementById(targetId);

    this.classList.toggle("rotate");

    if (target.classList.contains("show")) {
      target.classList.remove("show");
      target.style.maxHeight = "0";
      target.style.opacity = "0";
    } else {
      target.classList.add("show");
      target.style.maxHeight = target.scrollHeight + "px";
      target.style.opacity = "1";
    }
  });
});

 document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
      duration: 1500,  // Trajanje animacije
      easing: 'ease',  // Easing funkcija
      once: true,      // Da se animacija pokreće samo jednom
    });
  });


  let ticking = false;

    document.addEventListener("scroll", function() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgressBar();
                ticking = false;
            });
            ticking = true;
        }
    });

    function updateProgressBar() {
        const scrollProgressBar = document.getElementById("scrollProgressBar");
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        scrollProgressBar.style.width = scrollPercent + "%";

        if (scrollPercent > 0) {
            scrollProgressBar.classList.remove("hidden");
            scrollProgressBar.classList.add("visible");
        } else {
            scrollProgressBar.classList.remove("visible");
            scrollProgressBar.classList.add("hidden");
        }
    }

     function closeSidebar() {
      var sidenavInstance = M.Sidenav.getInstance(document.querySelector('.sidenav'));
      sidenavInstance.close();
    }

     document.addEventListener('DOMContentLoaded', () => {
      AOS.init({ duration: 1000, easing: 'ease-in-out', once: false, mirror: true });
      // Apply incremental delays
      document.querySelectorAll('.icons-container').forEach(container => {
        container.querySelectorAll('img').forEach((img, i) => {
          img.setAttribute('data-aos-delay', i * 100);
        });
      });
    });
  document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('#navigation li a');
    const sections = document.querySelectorAll('#about-me, #my-projects, #contact-me');
 // Funkcija koja menja active na osnovu scroll pozicije
  function onScroll() {
    let scrollPos = window.scrollY || window.pageYOffset;
    let windowHeight = window.innerHeight;
    let docHeight = document.documentElement.scrollHeight;
    if(scrollPos < 50) {
      navLinks.forEach(link => link.classList.remove('active'));
      const homeLink = document.querySelector('#navigation li a[href="#"]');
      if(homeLink) homeLink.classList.add('active');
      return;
    }
       // Ako smo na dnu stranice (ili blizu nje), aktiviraj contact-me
    if(scrollPos + windowHeight >= docHeight - 5) { 
      navLinks.forEach(link => link.classList.remove('active'));
      const contactLink = document.querySelector('#navigation li a[href="#contact-me"]');
      if(contactLink) contactLink.classList.add('active');
      return;
    }

    sections.forEach(section => {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;

      if(scrollPos >= top && scrollPos < bottom) {
        const id = section.getAttribute('id');
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`#navigation li a[href="#${id}"]`);
        if(activeLink) activeLink.classList.add('active');
      }
    });
  }

  // Dodaj event listener za scroll
  window.addEventListener('scroll', onScroll);

  // Dodaj event listener za klik na linkove
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // On klik ukloni active sa svih i dodeli na kliknuti
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Pokreni jednom da inicijalno postavi active
  onScroll();
});
        const images_goombas = [
      "https://i.ibb.co/bgcmn4Q8/Screenshot-14.png",
      "https://i.ibb.co/zWYfCd4D/Screenshot-13.png" ,
    "https://i.ibb.co/p67tbz9B/Screenshot-15.png"
  ];
 

     const images_cats = [
    "https://i.ibb.co/Z65M1RTL/Screenshot-9.png",
    "https://i.ibb.co/5WkTwnFB/Screenshot-10.png",
    "https://i.ibb.co/RVjGT4s/Screenshot-12.png"
  ];

  let currentIndex = 0;
  let rotating = false;

  const cube     = document.getElementById("cube");
  const frontImg = document.getElementById("front-image");
  const backImg  = document.getElementById("back-image");
  const nextBtn  = document.getElementById("next-button");
  const prevBtn  = document.getElementById("prev-button");

  function prepareBack(newIndex) {
    backImg.src = images_cats[newIndex];
  }

  function flipTo(newIndex, dir) {
    if (rotating) return;
    rotating = true;

    prepareBack(newIndex);

    // biramo ugao u zavisnosti od smera
    const angle = dir === 'next' ? -180 : 180;
    cube.style.transform = `rotateY(${angle}deg)`;

    cube.addEventListener("transitionend", function handler() {
      frontImg.src = images_cats[newIndex];
      currentIndex = newIndex;

      cube.style.transition = "none";
      cube.style.transform  = "rotateY(0deg)";
      cube.offsetHeight;
      cube.style.transition = "transform 0.8s ease-in-out";

      rotating = false;
      cube.removeEventListener("transitionend", handler);
    }, { once: true });
  }
window.addEventListener('load', function () {
  setTimeout(() => {
    const firstText = "Full Snack Dev";
    const finalText = "Full Stack Developer";
    const textContent = document.getElementById("text-content");
    const cursor = document.getElementById("cursor");

    let index = 0;


    function typeFirstText() {
        if (index < firstText.length) {
            textContent.textContent += firstText.charAt(index);
            index++;
            setTimeout(typeFirstText, 120);
        } else {
            setTimeout(startDeleting, 1000); // pause before deleting
        }
    }

    function startDeleting() {
        const targetLength = 6; // length of "Full S"
        let currentText = textContent.textContent;
        if (currentText.length > targetLength) {
            textContent.textContent = currentText.slice(0, -1);
            setTimeout(startDeleting, 50);
        } else {
            index = targetLength; // resume from "Full S"
            setTimeout(typeFinalText, 300);
        }
    }

    function typeFinalText() {
        if (index < finalText.length) {
            textContent.textContent += finalText.charAt(index);
            index++;
            setTimeout(typeFinalText, 100);
        } else {
            cursor.classList.add('stop-blink');
        }
    }

    typeFirstText();
      }, 1700); // 500ms = 0.5 sekunde

});
    function delayedRedirect() {
    setTimeout(() => {
      window.location.href = 'projects-ai.html';
    }, 200); // 500 milisekundi = 0.5 sekundi
  }
 

  let currentIndex2 = 0;
  let rotating2 = false;

  const cube2     = document.getElementById("cube2");
  const frontImg2 = document.getElementById("front-image2");
  const backImg2  = document.getElementById("back-image2");
  const nextBtn2  = document.getElementById("next-button2");
  const prevBtn2  = document.getElementById("prev-button2");

  function prepareBack2(newIndex2) {
    backImg2.src = images_goombas[newIndex2];
  }

  function flipTo2(newIndex2, dir) {
    if (rotating2) return;
    rotating2 = true;

    prepareBack2(newIndex2);

    // biramo ugao u zavisnosti od smera
    const angle = dir === 'next' ? -180 : 180;
    cube2.style.transform = `rotateY(${angle}deg)`;

    cube2.addEventListener("transitionend", function handler() {
      frontImg2.src = images_goombas[newIndex2];
      currentIndex2 = newIndex2;

      cube2.style.transition = "none";
      cube2.style.transform  = "rotateY(0deg)";
      cube2.offsetHeight;
      cube2.style.transition = "transform 0.8s ease-in-out";

      rotating2 = false;
      cube2.removeEventListener("transitionend", handler);
    }, { once: true });
  }



















































/*OVO MORA NA KRAJ NE PITAJ ZASTO*/
/*OVO MORA NA KRAJ NE PITAJ ZASTO*/
/*OVO MORA NA KRAJ NE PITAJ ZASTO*/
/*OVO MORA NA KRAJ NE PITAJ ZASTO*/
/*OVO MORA NA KRAJ NE PITAJ ZASTO*/
/*OVO MORA NA KRAJ NE PITAJ ZASTO*/
  nextBtn2.addEventListener("click", () => {
    const ni = (currentIndex2 + 1) % images_goombas.length;
    flipTo2(ni, 'prev');
  });
  
  prevBtn2.addEventListener("click", () => {
    const ni = (currentIndex2 - 1 + images_goombas.length) % images_goombas.length;
    flipTo2(ni, 'next');
  });

  nextBtn.addEventListener("click", () => {
    const ni = (currentIndex + 1) % images_cats.length;
    flipTo(ni, 'prev');
  });
  
  prevBtn.addEventListener("click", () => {
    const ni = (currentIndex - 1 + images_cats.length) % images_cats.length;
    flipTo(ni, 'next');
  });