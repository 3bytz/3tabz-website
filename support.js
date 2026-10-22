function toggleFaq(btn) {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    }
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => nav.style.background = window.scrollY > 40 ? 'rgba(244,242,237,0.95)' : 'rgba(244,242,237,0.88)');
