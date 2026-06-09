document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Mobile Navigation Menu
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }



  // ==========================================================================
  // 3. Contact Form Interactive Feedback
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const toastMessage = document.getElementById('toast-message');

  if (contactForm && toastMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      // Visual feedback: loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending <i class="fas fa-spinner fa-spin"></i>';
      
      // Simulate API submission
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show toast
        toastMessage.classList.add('show');
        
        // Reset form inputs
        contactForm.reset();
        
        // Hide toast after 4 seconds
        setTimeout(() => {
          toastMessage.classList.remove('show');
        }, 4000);
      }, 1500);
    });
  }

  // ==========================================================================
  // 4. Subtle Interactivity: Dynamic Mini Charts and Scroll Highlight
  // ==========================================================================
  
  // Randomize the mini chart animation for visual premium look
  const blogCards = document.querySelectorAll('.blog-card');
  blogCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const bars = card.querySelectorAll('.bar-chart-bar');
      bars.forEach(bar => {
        const height = Math.floor(Math.random() * 60) + 35; // Random height between 35% and 95%
        bar.style.height = `${height}%`;
      });
    });
  });

  // Active Link Highlighting on Scroll
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 200; // Offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === current) {
        link.classList.add('active');
        link.style.color = 'var(--color-primary)';
      } else {
        link.style.color = '';
      }
    });
  });

  // ==========================================================================
  // 5. Matrix Digital Rain Animation
  // ==========================================================================
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    // Alphanumeric + Japanese Katakana characters
    const katakana = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
    const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" + katakana;
    const characters = alphabet.split("");
    
    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    
    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -100; // start offscreen with random delay
    }
    
    const draw = () => {
      // Disable shadow blur for drawing the trailing overlay
      ctx.shadowBlur = 0;
      
      // Semi-transparent overlay to create trailing effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);
      
      ctx.font = fontSize + "px monospace";
      
      for (let i = 0; i < rainDrops.length; i++) {
        // Random character
        const text = characters[Math.floor(Math.random() * characters.length)];
        const xCoord = i * fontSize;
        const yCoord = rainDrops[i] * fontSize;
        
        // Only draw on screen to optimize
        if (yCoord > 0 && yCoord < height + fontSize) {
          // Enable glowing green shadow blur for characters
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#00ff41";

          // Render character shadow / trail color (classic matrix green)
          ctx.fillStyle = "#00ff41";
          ctx.fillText(text, xCoord, yCoord - fontSize);
          
          // Render the glowing head character in bright white (glows green)
          ctx.fillStyle = "#ffffff";
          ctx.fillText(text, xCoord, yCoord);
        }
        
        // Reset drop to top with randomized delay once it goes offscreen
        if (yCoord > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        
        rainDrops[i]++;
      }
    };
    
    // Limit frame rate to ~30 FPS to save CPU and reduce visual clutter
    let lastTime = 0;
    const fps = 30;
    const nextFrame = 1000 / fps;
    let timer = 0;
    
    function animate(timestamp) {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      if (timer > nextFrame) {
        draw();
        timer = 0;
      } else {
        timer += deltaTime;
      }
      
      requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
    
    // Handle Window Resizing
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      
      // Pad or trim drop positions
      const currentLen = rainDrops.length;
      if (columns > currentLen) {
        for (let x = currentLen; x < columns; x++) {
          rainDrops[x] = Math.random() * -100;
        }
      } else if (columns < currentLen) {
        rainDrops.length = columns;
      }
    });
  }
});
