
// ── Chargement des miniatures YouTube ──
document.querySelectorAll('.v-card[data-youtube-id]').forEach(card => {
    const id = card.dataset.youtubeId;
    if (!id || id.startsWith('VOTRE')) return;

    const thumb = card.querySelector('.v-thumb');
    const img   = new Image();
    img.onload = () => {
        if (img.naturalWidth === 120 && img.naturalHeight === 90) {
            thumb.style.backgroundImage = `url('https://img.youtube.com/vi/${id}/hqdefault.jpg')`;
        } else {
            thumb.style.backgroundImage = `url('https://img.youtube.com/vi/${id}/maxresdefault.jpg')`;
        }
    };
    img.onerror = () => { thumb.style.backgroundImage = `url('https://img.youtube.com/vi/${id}/hqdefault.jpg')`; };
    img.src = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
});

// ── Chargement des miniatures Dailymotion ──
document.querySelectorAll('.v-card[data-dailymotion-id]').forEach(card => {
    const id = card.dataset.dailymotionId;
    if (!id || id.startsWith('DM_')) return;

    const thumb = card.querySelector('.v-thumb');
    thumb.style.backgroundImage = `url('https://www.dailymotion.com/thumbnail/video/${id}')`;
});

// ── Lightbox ──
const modal        = document.getElementById('modal');
const vimeoIframe  = document.getElementById('vimeoIframe');
const modalTitle   = document.getElementById('modalTitle');
const modalClient  = document.getElementById('modalClient');
const modalCat     = document.getElementById('modalCat');
const modalDur     = document.getElementById('modalDur');

function openModal(card) {
    const ytId = card.dataset.youtubeId;
    const dmId = card.dataset.dailymotionId;

    if (ytId && !ytId.startsWith('VOTRE')) {
        vimeoIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
    } else if (dmId && !dmId.startsWith('DM_')) {
        vimeoIframe.src = `https://www.dailymotion.com/embed/video/${dmId}?autoplay=1`;
    } else {
        return;
    }

    modalTitle.textContent  = card.dataset.title  || '';
    modalClient.textContent = card.dataset.client || '';
    modalCat.textContent    = card.dataset.cat    || '';
    modalDur.textContent    = card.dataset.dur    || '';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    vimeoIframe.src = '';           // arrête la lecture
    document.body.style.overflow = '';
}

document.querySelectorAll('.v-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
});
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
});

// ── Nav opaque au scroll ──
const navEl = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    const s = window.scrollY > 20;
    navEl.style.background     = '#242424';
    navEl.style.backdropFilter = 'none';
    navEl.style.borderBottom   = s ? '1px solid rgba(255,31,138,0.15)' : 'none';
});

// ── Filtres ──
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.v-card');
const selTitle   = document.getElementById('selectionTitle');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        // filtre sur data-cat qui contient l'année de chaque vidéo
        cards.forEach(c => {
            if (f === 'all' || c.dataset.cat === f) c.removeAttribute('data-hidden');
            else c.setAttribute('data-hidden', '');
        });
        selTitle.textContent = btn.dataset.label;
    });
});

// ── Scroll-reveal ──
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }
    });
}, { threshold: 0.06 });

document.querySelectorAll('.v-card, .ed-card, .dir-row').forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(16px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
});
