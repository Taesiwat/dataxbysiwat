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
  // 2. Taylor Rule Simulator
  // ==========================================================================
  const inputInflation = document.getElementById('input-inflation');
  const inputOutputGap = document.getElementById('input-outputgap');
  const valInflation = document.getElementById('val-inflation');
  const valOutputGap = document.getElementById('val-outputgap');
  
  const targetRateVal = document.getElementById('target-rate-val');
  const policyStance = document.getElementById('policy-stance');
  const gaugeFill = document.getElementById('gauge-fill');
  const simulationNarrative = document.getElementById('simulation-narrative');

  // Constants
  const PI_STAR = 2.0; // Target Inflation
  const R_STAR = 2.0;  // Equilibrium Real Interest Rate

  function updateSimulation() {
    if (!inputInflation || !inputOutputGap) return;

    const pi = parseFloat(inputInflation.value); // Current Inflation
    const y = parseFloat(inputOutputGap.value);  // Output Gap

    // Update slider value displays
    valInflation.textContent = `${pi.toFixed(1)}%`;
    valOutputGap.textContent = `${y.toFixed(1)}%`;

    // Taylor Rule: i = r* + pi + 0.5*(pi - pi*) + 0.5*y
    let targetRate = R_STAR + pi + 0.5 * (pi - PI_STAR) + 0.5 * y;
    
    // Check for Zero Lower Bound (ZLB)
    const isZlb = targetRate <= 0;
    const nominalRate = isZlb ? 0.0 : targetRate;

    // Update gauge text
    targetRateVal.textContent = isZlb 
      ? `0.00%*` 
      : `${nominalRate.toFixed(2)}%`;

    // Categorize Policy Stance
    let stance = '';
    let accentColor = '';
    
    if (isZlb) {
      stance = 'ZLB CONSTRAINED';
      accentColor = 'var(--color-secondary)'; // Muted teal
    } else if (nominalRate < 3.5) {
      stance = 'ACCOMMODATIVE';
      accentColor = 'var(--color-secondary)'; // Teal
    } else if (nominalRate >= 3.5 && nominalRate <= 4.5) {
      stance = 'NEUTRAL';
      accentColor = 'var(--color-primary)'; // Amber Gold
    } else {
      stance = 'RESTRICTIVE';
      accentColor = 'var(--color-danger)'; // Rose Red
    }

    policyStance.textContent = stance;
    policyStance.style.color = accentColor;
    policyStance.style.backgroundColor = `${accentColor}1A`; // 10% opacity hex
    
    // Update Gauge Arc
    // Dasharray of the gauge track path is approx 380
    const maxRate = 12.0;
    const minRate = -2.0;
    let percent = (targetRate - minRate) / (maxRate - minRate);
    percent = Math.max(0, Math.min(1, percent)); // Clamp 0 to 1
    
    const maxOffset = 380;
    const offset = maxOffset - (percent * maxOffset);
    
    gaugeFill.style.strokeDashoffset = offset;
    gaugeFill.style.stroke = accentColor;

    // Generate Narrative Explanation
    let narrative = '';
    
    const inflationDev = pi - PI_STAR;
    const inflationDesc = inflationDev > 0 
      ? `above the ${PI_STAR.toFixed(1)}% target (deviation of +${inflationDev.toFixed(1)}%)`
      : inflationDev < 0 
        ? `below the ${PI_STAR.toFixed(1)}% target (deviation of ${inflationDev.toFixed(1)}%)`
        : `exactly at the ${PI_STAR.toFixed(1)}% target`;

    const gapDesc = y > 0
      ? `indicating an economy operating above potential capacity (overheating gap of +${y.toFixed(1)}%)`
      : y < 0
        ? `reflecting economic slack and resources underutilization (recessionary gap of ${y.toFixed(1)}%)`
        : `indicating an economy in macroeconomic equilibrium`;

    narrative += `Inflation is ${inflationDesc}, while the output gap is ${y.toFixed(1)}%, ${gapDesc}. `;

    if (isZlb) {
      narrative += `The standard Taylor Rule formula recommends a negative nominal rate of <strong>${targetRate.toFixed(2)}%</strong>. However, due to the <strong>Zero Lower Bound (ZLB)</strong>, policy is constrained at 0.00% to maximize monetary expansion and prevent deflationary spirals.`;
    } else if (nominalRate < 3.5) {
      narrative += `Given these conditions, the rule prescribes a stimulative target policy rate of <strong>${nominalRate.toFixed(2)}%</strong>. This expansionary stance aims to close the economic slack and pull inflation back up to the target.`;
    } else if (nominalRate >= 3.5 && nominalRate <= 4.5) {
      narrative += `The rule prescribes a balanced, neutral interest rate of <strong>${nominalRate.toFixed(2)}%</strong>, signaling that economic growth and inflation expectations are sustainable and require no active tightening or easing.`;
    } else {
      narrative += `To cool aggregate demand and stabilize inflation, the rule prescribes a tight, restrictive rate of <strong>${nominalRate.toFixed(2)}%</strong>. Higher borrowing costs are needed to prevent wages and prices from spiraling.`;
    }

    simulationNarrative.innerHTML = narrative;
  }

  // Bind Slider Events
  if (inputInflation && inputOutputGap) {
    inputInflation.addEventListener('input', updateSimulation);
    inputOutputGap.addEventListener('input', updateSimulation);
    
    // Initial run
    updateSimulation();
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
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
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
});
