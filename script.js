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
  // 2. Market Efficiency & Policy Simulator (Mankiw's Principles)
  // ==========================================================================
  const scenarioSelect = document.getElementById('sandbox-scenario');
  
  // Policy Sliders and Groups
  const groupTax = document.getElementById('group-tax');
  const groupControl = document.getElementById('group-control');
  const groupExternality = document.getElementById('group-externality');
  
  const inputTax = document.getElementById('input-tax');
  const inputPriceControl = document.getElementById('input-price-control');
  const inputExternality = document.getElementById('input-externality');
  const inputExtTax = document.getElementById('input-ext-tax');
  
  const valTax = document.getElementById('val-tax');
  const valPriceControl = document.getElementById('val-price-control');
  const valExternality = document.getElementById('val-externality');
  const valExtTax = document.getElementById('val-ext-tax');
  
  const typeCeiling = document.getElementById('type-ceiling');
  const typeFloor = document.getElementById('type-floor');

  // SVG and Labels
  const lineSupply = document.getElementById('line-supply');
  const lineSocialSupply = document.getElementById('line-social-supply');
  const linePriceControl = document.getElementById('line-price-control');
  const pointEq = document.getElementById('point-eq');
  const pointSocial = document.getElementById('point-social');
  const eqSocialSupply = document.getElementById('eq-social-supply');
  
  const polyCs = document.getElementById('poly-cs');
  const polyPs = document.getElementById('poly-ps');
  const polyGov = document.getElementById('poly-gov');
  const polyDwl = document.getElementById('poly-dwl');
  const polyDamage = document.getElementById('poly-damage');

  // Stats Readouts
  const statCs = document.getElementById('stat-cs');
  const statPs = document.getElementById('stat-ps');
  const statOptLabel = document.getElementById('stat-opt-label');
  const statOptValue = document.getElementById('stat-opt-value');
  const statWelfare = document.getElementById('stat-welfare');
  const statDwl = document.getElementById('stat-dwl');
  const marketNarrative = document.getElementById('market-narrative');

  // SVG Coordinates Mapping: Q on X (0-16 -> 40-260), P on Y (0-16 -> 260-40)
  const mapQtoX = (q) => 40 + (q / 16) * 220;
  const mapPtoY = (p) => 260 - (p / 16) * 220;

  function updateMarketSimulation() {
    if (!scenarioSelect) return;

    const scenario = scenarioSelect.value;
    
    // Core parameters to compute
    let tax = 0;
    let externality = 0;
    let priceControl = null;
    let isCeiling = true;

    // Toggle slider controls visibility based on Scenario
    if (scenario === 'tax') {
      groupTax.style.display = 'block';
      groupControl.style.display = 'none';
      groupExternality.style.display = 'none';
      
      tax = parseFloat(inputTax.value);
      valTax.textContent = `$${tax.toFixed(2)}`;
      
      lineSocialSupply.style.display = 'none';
      linePriceControl.style.display = 'none';
      pointSocial.style.display = 'none';
      eqSocialSupply.textContent = 'Social Cost (Supply + Externality): P = Q';
      statOptLabel.textContent = 'TAX REVENUE';
    } 
    else if (scenario === 'control') {
      groupTax.style.display = 'none';
      groupControl.style.display = 'block';
      groupExternality.style.display = 'none';
      
      priceControl = parseFloat(inputPriceControl.value);
      valPriceControl.textContent = `$${priceControl.toFixed(2)}`;
      isCeiling = typeCeiling.checked;
      
      lineSocialSupply.style.display = 'none';
      linePriceControl.style.display = 'block';
      pointSocial.style.display = 'none';
      eqSocialSupply.textContent = 'Social Cost (Supply + Externality): P = Q';
      statOptLabel.textContent = 'GOV. REVENUE';
      
      // Draw Price Control Line
      linePriceControl.setAttribute('y1', mapPtoY(priceControl));
      linePriceControl.setAttribute('y2', mapPtoY(priceControl));
    } 
    else if (scenario === 'externality') {
      groupTax.style.display = 'none';
      groupControl.style.display = 'none';
      groupExternality.style.display = 'block';
      
      externality = parseFloat(inputExternality.value);
      tax = parseFloat(inputExtTax.value);
      
      valExternality.textContent = `$${externality.toFixed(2)}`;
      valExtTax.textContent = `$${tax.toFixed(2)}`;
      
      lineSocialSupply.style.display = 'block';
      linePriceControl.style.display = 'none';
      pointSocial.style.display = 'block';
      eqSocialSupply.textContent = `Social Cost (Supply + Externality): P = Q + ${externality.toFixed(1)}`;
      statOptLabel.textContent = 'EXTERNAL DAMAGE';
      
      // Draw Social Supply Line (Shifted Up by Externality Cost)
      lineSocialSupply.setAttribute('x1', mapQtoX(0));
      lineSocialSupply.setAttribute('y1', mapPtoY(externality));
      lineSocialSupply.setAttribute('x2', mapQtoX(16 - externality));
      lineSocialSupply.setAttribute('y2', mapPtoY(16));
    }

    // ==========================================
    // Economic Math Calculations
    // Market Equations: Demand: P = 16 - Q | Supply: Private P = Q
    // ==========================================
    let q = 8;
    let pBuyer = 8;
    let pSeller = 8;
    let cs = 32;
    let ps = 32;
    let govRev = 0;
    let extDamage = 0;
    let welfare = 64;
    let dwl = 0;

    // Shift Private Supply curve visually if Tax is applied
    if (tax > 0 && scenario !== 'control') {
      lineSupply.setAttribute('x1', mapQtoX(0));
      lineSupply.setAttribute('y1', mapPtoY(tax));
      lineSupply.setAttribute('x2', mapQtoX(16 - tax));
      lineSupply.setAttribute('y2', mapPtoY(16));
    } else {
      lineSupply.setAttribute('x1', mapQtoX(0));
      lineSupply.setAttribute('y1', mapPtoY(0));
      lineSupply.setAttribute('x2', mapQtoX(16));
      lineSupply.setAttribute('y2', mapPtoY(16));
    }

    if (scenario === 'tax') {
      // With tax T: Q = 8 - 0.5T | P_Buyer = 8 + 0.5T | P_Seller = 8 - 0.5T
      q = 8 - 0.5 * tax;
      pBuyer = 8 + 0.5 * tax;
      pSeller = 8 - 0.5 * tax;
      
      cs = 0.5 * (8 - 0.5 * tax) * (8 - 0.5 * tax);
      ps = cs;
      govRev = tax * q;
      welfare = cs + ps + govRev;
      dwl = 64 - welfare;
      
      // Update SVG Polygons
      polyCs.setAttribute('points', `${mapQtoX(0)},${mapPtoY(16)} ${mapQtoX(0)},${mapPtoY(pBuyer)} ${mapQtoX(q)},${mapPtoY(pBuyer)}`);
      polyPs.setAttribute('points', `${mapQtoX(0)},${mapPtoY(0)} ${mapQtoX(0)},${mapPtoY(pSeller)} ${mapQtoX(q)},${mapPtoY(pSeller)}`);
      polyGov.setAttribute('points', `${mapQtoX(0)},${mapPtoY(pSeller)} ${mapQtoX(0)},${mapPtoY(pBuyer)} ${mapQtoX(q)},${mapPtoY(pBuyer)} ${mapQtoX(q)},${mapPtoY(pSeller)}`);
      polyDwl.setAttribute('points', `${mapQtoX(q)},${mapPtoY(pSeller)} ${mapQtoX(q)},${mapPtoY(pBuyer)} ${mapQtoX(8)},${mapPtoY(8)}`);
      polyDamage.setAttribute('points', '');
      
      // Set points
      pointEq.setAttribute('cx', mapQtoX(q));
      pointEq.setAttribute('cy', mapPtoY(pBuyer));
      
      // Stats
      statCs.textContent = `$${cs.toFixed(2)}`;
      statPs.textContent = `$${ps.toFixed(2)}`;
      statOptValue.textContent = `$${govRev.toFixed(2)}`;
      statWelfare.textContent = `$${welfare.toFixed(2)}`;
      statDwl.textContent = `$${dwl.toFixed(2)}`;
      
      // Narrative
      let narrative = `Imposing a unit tax of <strong>$${tax.toFixed(2)}</strong> drives a wedge between the price buyers pay ($${pBuyer.toFixed(2)}) and the price sellers receive ($${pSeller.toFixed(2)}). `;
      if (tax > 0) {
        narrative += `This shrinks transacted output to <strong>${q.toFixed(1)}</strong> units, destroying mutually beneficial trades. The resulting inefficiency creates a <strong>Deadweight Loss (DWL) of $${dwl.toFixed(2)}</strong>. This demonstrates <strong>Principle 4</strong>: people respond to tax incentives, altering their behaviors.`;
      } else {
        narrative += `With no taxes, the market operates at maximum efficiency. Total welfare is maximized at $64.00, confirming <strong>Principle 6</strong>: markets are usually a good way to organize economic activity.`;
      }
      marketNarrative.innerHTML = narrative;
    } 
    else if (scenario === 'control') {
      let isBinding = false;
      
      if (isCeiling) {
        // Ceiling is binding if it is BELOW free market equilibrium ($8.00)
        isBinding = priceControl < 8.0;
        if (isBinding) {
          q = priceControl; // Quantity transacted is limited by sellers
          pBuyer = 16 - q;  // Price consumers are willing to pay for this quantity
          pSeller = priceControl;
          
          cs = q * (16 - 1.5 * q);
          ps = 0.5 * q * q;
          welfare = q * (16 - q);
          dwl = 64 - welfare;
        }
      } else {
        // Floor is binding if it is ABOVE free market equilibrium ($8.00)
        isBinding = priceControl > 8.0;
        if (isBinding) {
          q = 16 - priceControl; // Quantity transacted is limited by buyers
          pBuyer = priceControl;
          pSeller = q; // Lowest price sellers are willing to accept for this Q
          
          cs = 0.5 * q * q;
          ps = q * (1.5 * priceControl - 8);
          welfare = q * (16 - q);
          dwl = 64 - welfare;
        }
      }

      if (!isBinding) {
        q = 8;
        pBuyer = 8;
        pSeller = 8;
        cs = 32;
        ps = 32;
        welfare = 64;
        dwl = 0;
        
        polyCs.setAttribute('points', `${mapQtoX(0)},${mapPtoY(16)} ${mapQtoX(0)},${mapPtoY(8)} ${mapQtoX(8)},${mapPtoY(8)}`);
        polyPs.setAttribute('points', `${mapQtoX(0)},${mapPtoY(0)} ${mapQtoX(0)},${mapPtoY(8)} ${mapQtoX(8)},${mapPtoY(8)}`);
        polyGov.setAttribute('points', '');
        polyDwl.setAttribute('points', '');
        polyDamage.setAttribute('points', '');
        pointEq.setAttribute('cx', mapQtoX(8));
        pointEq.setAttribute('cy', mapPtoY(8));
      } else {
        if (isCeiling) {
          // Binding Ceiling Polygons
          polyCs.setAttribute('points', `${mapQtoX(0)},${mapPtoY(16)} ${mapQtoX(0)},${mapPtoY(priceControl)} ${mapQtoX(q)},${mapPtoY(priceControl)} ${mapQtoX(q)},${mapPtoY(pBuyer)}`);
          polyPs.setAttribute('points', `${mapQtoX(0)},${mapPtoY(0)} ${mapQtoX(0)},${mapPtoY(priceControl)} ${mapQtoX(q)},${mapPtoY(priceControl)}`);
        } else {
          // Binding Floor Polygons
          polyCs.setAttribute('points', `${mapQtoX(0)},${mapPtoY(16)} ${mapQtoX(0)},${mapPtoY(priceControl)} ${mapQtoX(q)},${mapPtoY(priceControl)}`);
          polyPs.setAttribute('points', `${mapQtoX(0)},${mapPtoY(0)} ${mapQtoX(0)},${mapPtoY(priceControl)} ${mapQtoX(q)},${mapPtoY(priceControl)} ${mapQtoX(q)},${mapPtoY(pSeller)}`);
        }
        polyGov.setAttribute('points', '');
        polyDwl.setAttribute('points', `${mapQtoX(q)},${mapPtoY(pSeller)} ${mapQtoX(q)},${mapPtoY(pBuyer)} ${mapQtoX(8)},${mapPtoY(8)}`);
        polyDamage.setAttribute('points', '');
        pointEq.setAttribute('cx', mapQtoX(q));
        pointEq.setAttribute('cy', mapPtoY(priceControl));
      }

      statCs.textContent = `$${cs.toFixed(2)}`;
      statPs.textContent = `$${ps.toFixed(2)}`;
      statOptValue.textContent = `$0.00`;
      statWelfare.textContent = `$${welfare.toFixed(2)}`;
      statDwl.textContent = `$${dwl.toFixed(2)}`;

      let narrative = `Imposing a price ${isCeiling ? 'ceiling' : 'floor'} of <strong>$${priceControl.toFixed(2)}</strong> is `;
      if (isBinding) {
        const discrepancy = isCeiling ? (16 - 2 * priceControl) : (2 * priceControl - 16);
        narrative += `<strong>binding</strong>. It restricts transaction volume to <strong>${q.toFixed(1)}</strong> units, creating a <strong>Deadweight Loss of $${dwl.toFixed(2)}</strong>. `;
        narrative += isCeiling 
          ? `Because demand exceeds supply, a chronic <strong>shortage of ${discrepancy.toFixed(1)} units</strong> occurs.` 
          : `Because supply exceeds demand, a market <strong>surplus of ${discrepancy.toFixed(1)} units</strong> accumulates.`;
        narrative += ` This demonstrates how price controls disrupt Adam Smith's invisible hand, resulting in structural market inefficiency (<strong>Principle 6</strong>).`;
      } else {
        narrative += `<strong>non-binding</strong> because it lies ${isCeiling ? 'above' : 'below'} the equilibrium price of $8.00. The market resolves at equilibrium with zero deadweight loss.`;
      }
      marketNarrative.innerHTML = narrative;
    } 
    else if (scenario === 'externality') {
      // Social Optimum Q_opt = 8 - 0.5*E
      const qOpt = 8 - 0.5 * externality;
      const pOpt = 8 + 0.5 * externality;

      // Actual market transactions with corrective tax T
      q = 8 - 0.5 * tax;
      pBuyer = 8 + 0.5 * tax;
      pSeller = 8 - 0.5 * tax;

      cs = 0.5 * q * q;
      ps = 0.5 * q * q;
      govRev = tax * q;
      extDamage = externality * q;
      
      // Social Welfare = CS + PS + Gov - Externality Damage
      welfare = cs + ps + govRev - extDamage;
      
      // DWL = (Q - Q_opt)^2
      dwl = (q - qOpt) * (q - qOpt);

      // Polygons
      polyCs.setAttribute('points', `${mapQtoX(0)},${mapPtoY(16)} ${mapQtoX(0)},${mapPtoY(pBuyer)} ${mapQtoX(q)},${mapPtoY(pBuyer)}`);
      polyPs.setAttribute('points', `${mapQtoX(0)},${mapPtoY(0)} ${mapQtoX(0)},${mapPtoY(pSeller)} ${mapQtoX(q)},${mapPtoY(pSeller)}`);
      polyGov.setAttribute('points', `${mapQtoX(0)},${mapPtoY(pSeller)} ${mapQtoX(0)},${mapPtoY(pBuyer)} ${mapQtoX(q)},${mapPtoY(pBuyer)} ${mapQtoX(q)},${mapPtoY(pSeller)}`);
      
      // Damage polygon is the parallelogram between Private Supply and Social Supply up to Q
      polyDamage.setAttribute('points', `${mapQtoX(0)},${mapPtoY(0)} ${mapQtoX(0)},${mapPtoY(externality)} ${mapQtoX(q)},${mapPtoY(q + externality)} ${mapQtoX(q)},${mapPtoY(q)}`);
      
      // DWL polygon
      if (q > qOpt) {
        // Overproduction triangle: from (Q_opt, P_opt) along Social Cost to (Q, Q+E) and along Demand to (Q, 16-Q)
        polyDwl.setAttribute('points', `${mapQtoX(qOpt)},${mapPtoY(qOpt + externality)} ${mapQtoX(q)},${mapPtoY(q + externality)} ${mapQtoX(q)},${mapPtoY(16 - q)}`);
      } else if (q < qOpt) {
        // Underproduction triangle due to over-taxation
        polyDwl.setAttribute('points', `${mapQtoX(q)},${mapPtoY(q + externality)} ${mapQtoX(q)},${mapPtoY(16 - q)} ${mapQtoX(qOpt)},${mapPtoY(qOpt + externality)}`);
      } else {
        polyDwl.setAttribute('points', '');
      }

      // Points
      pointEq.setAttribute('cx', mapQtoX(q));
      pointEq.setAttribute('cy', mapPtoY(pBuyer));
      
      pointSocial.setAttribute('cx', mapQtoX(qOpt));
      pointSocial.setAttribute('cy', mapPtoY(pOpt));

      // Stats
      statCs.textContent = `$${cs.toFixed(2)}`;
      statPs.textContent = `$${ps.toFixed(2)}`;
      statOptValue.textContent = `$${extDamage.toFixed(2)}`; // display pollution damage here
      statWelfare.textContent = `$${welfare.toFixed(2)}`;
      statDwl.textContent = `$${dwl.toFixed(2)}`;

      let narrative = `Production generates a negative externality (e.g. pollution) costing <strong>$${externality.toFixed(2)}/unit</strong>. `;
      if (tax === 0) {
        narrative += `In the unregulated market, agents ignore the social cost, overproducing at <strong>8.0 units</strong> (optimum is <strong>${qOpt.toFixed(1)}</strong>). This market failure yields a <strong>DWL of $${dwl.toFixed(2)}</strong>. `;
      } else if (Math.abs(tax - externality) < 0.01) {
        narrative += `You applied a corrective **Pigouvian Tax of $${tax.toFixed(2)}**, equal to the environmental damage. This perfectly internalizes the externality, shifting market output to the social optimum of <strong>${q.toFixed(1)} units</strong> and **eliminating Deadweight Loss** ($0.00). `;
      } else {
        narrative += `You set a tax of $${tax.toFixed(2)}. Output is at ${q.toFixed(1)} units. `;
        if (tax < externality) {
          narrative += `The tax is too low; the market is still overproducing, leaving a remaining DWL of $${dwl.toFixed(2)}. `;
        } else {
          narrative += `The tax is too high, leading to over-correction and underproduction, creating a DWL of $${dwl.toFixed(2)}. `;
        }
      }
      narrative += `This illustrates <strong>Principle 7</strong>: governments can sometimes improve market outcomes.`;
      marketNarrative.innerHTML = narrative;
    }
  }

  // Bind Scenarios and Sliders
  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', updateMarketSimulation);
    
    // Sliders
    inputTax.addEventListener('input', updateMarketSimulation);
    inputPriceControl.addEventListener('input', updateMarketSimulation);
    inputExternality.addEventListener('input', updateMarketSimulation);
    inputExtTax.addEventListener('input', updateMarketSimulation);
    
    // Radio Buttons
    typeCeiling.addEventListener('change', updateMarketSimulation);
    typeFloor.addEventListener('change', updateMarketSimulation);
    
    // Initial run
    updateMarketSimulation();
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
      ctx.fillStyle = "rgba(10, 12, 16, 0.08)";
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
