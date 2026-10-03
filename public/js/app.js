// Mobile menu toggle
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.mobile-toggle');

if (toggle && header) {
  toggle.addEventListener('click', () => {
    header.classList.toggle('menu-open');
  });

  // Close menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('menu-open');
    });
  });
}

// Animated counter for stats
function animateCounter(element, target, duration = 1500) {
  if (element.dataset.animated) return;
  element.dataset.animated = 'true';

  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Observe elements for counter animation
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.classList.contains('value')) {
      const target = parseInt(entry.target.textContent) || 0;
      animateCounter(entry.target, target);
    }
  });
}, observerOptions);

document.querySelectorAll('.value').forEach(el => observer.observe(el));

// Form handling
const forms = document.querySelectorAll('[data-form]');
forms.forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const messageBox = form.querySelector('.notice');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Add loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processando...';
    submitBtn.style.opacity = '0.6';

    try {
      const action = form.dataset.action || '/auth/login';
      const response = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams(payload).toString()
      });

      const result = await response.json();
      
      if (!response.ok) {
        messageBox.className = 'notice error';
        messageBox.textContent = result.error || 'Não foi possível concluir.';
        messageBox.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
        return;
      }

      messageBox.className = 'notice success';
      messageBox.textContent = result.message || 'Operação concluída.';
      messageBox.style.display = 'block';

      setTimeout(() => {
        if (action === '/auth/register' || action === '/auth/login') {
          window.location.href = '/cliente';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
      }, 800);
    } catch (error) {
      messageBox.className = 'notice error';
      messageBox.textContent = 'Ocorreu um erro ao processar o pedido.';
      messageBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = '1';
    }
  });
});

// Tracking form
const trackForm = document.querySelector('[data-track-form]');
if (trackForm) {
  trackForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const code = new FormData(trackForm).get('trackingCode');
    const output = document.querySelector('[data-track-result]');
    const notice = document.querySelector('[data-track-notice]');
    const submitBtn = trackForm.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Consultando...';
    output.style.opacity = '0.6';

    try {
      const response = await fetch(`/api/track?code=${encodeURIComponent(code || '')}`);
      const result = await response.json();

      if (!response.ok) {
        notice.className = 'notice error';
        notice.textContent = result.error || 'Código inválido.';
        notice.style.display = 'block';
        output.textContent = 'Sem resultados.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Consultar';
        output.style.opacity = '1';
        return;
      }

      notice.className = 'notice success';
      notice.textContent = 'Consulta concluída com sucesso!';
      notice.style.display = 'block';

      setTimeout(() => {
        output.innerHTML = `
          <div style="animation: slideInUp 0.5s ease-out;">
            <strong style="font-size: 1.2rem; color: var(--accent);">${result.code}</strong><br><br>
            <span style="font-weight: 600; color: #d9ebff;">Estado:</span> ${result.status}<br>
            <span style="font-weight: 600; color: #d9ebff;">Rota:</span> ${result.route}<br>
            <span style="font-weight: 600; color: #d9ebff;">Mercadoria:</span> ${result.goods}<br>
            <span style="font-weight: 600; color: #d9ebff;">Valor:</span> ${Number(result.amount || 0).toFixed(2)} €
          </div>
        `;
        output.style.opacity = '1';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Consultar';
      }, 400);
    } catch (error) {
      notice.className = 'notice error';
      notice.textContent = 'Não foi possível consultar o rastreio.';
      notice.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Consultar';
      output.style.opacity = '1';
    }
  });
}

// Contact form
const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());
    const notice = document.querySelector('[data-contact-notice]');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams(payload).toString()
      });
      const result = await response.json();
      notice.className = 'notice ' + (response.ok ? 'success' : 'error');
      notice.textContent = result.message || result.error || 'Pedido processado.';
      notice.style.display = 'block';
      
      if (response.ok) {
        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar';
        }, 800);
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar';
      }
    } catch (error) {
      notice.className = 'notice error';
      notice.textContent = 'Não foi possível enviar a mensagem.';
      notice.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar';
    }
  });
}

// Ripple effect on buttons
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');

  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', createRipple);
});

// Smooth scroll spy for navigation
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section, main > div').forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

// Parallax effect on scroll
const parallaxElements = document.querySelectorAll('[data-parallax]');
if (window.innerWidth > 920) {
  window.addEventListener('scroll', () => {
    parallaxElements.forEach(element => {
      const scrollPosition = window.pageYOffset;
      const yPos = scrollPosition * 0.5;
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// Page visibility optimization
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.querySelectorAll('*').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    document.querySelectorAll('*').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }
});
