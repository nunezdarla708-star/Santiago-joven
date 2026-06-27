(() => {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // URL del backend Node.js (index.js en database/apoyo_joven_backend).
  // Si el servidor está corriendo en localhost:3000 los datos se guardan
  // en SQL Server. Si no responde, el sitio sigue funcionando con LocalStorage.
  // ─────────────────────────────────────────────────────────────────────────
  // URL del backend. En red local usa la IP de la PC para que funcione desde celular.
  // En producción (Netlify) cambiar por la URL del backend desplegado.
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : `http://192.168.1.24:3000`;

  /**
   * Intenta enviar datos al backend. Si el servidor no está disponible
   * devuelve null (sin lanzar error) para que el flujo continúe con LocalStorage.
   */
  async function apiPost(path, body) {
    try {
      const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) {
        console.warn(`[API] ${path} error ${response.status}:`, data);
        return null;
      }
      console.info(`[API] ${path} OK →`, data.message || data.status);
      return data;
    } catch (err) {
      // El servidor no está corriendo — el sitio sigue con LocalStorage
      console.warn('[API] Backend no disponible:', err.message, '— usando LocalStorage.');
      return null;
    }
  }

  const STORAGE = {
    users: 'apoyojoven_users_v2',
    activities: 'apoyojoven_activities_v2',
    registrations: 'apoyojoven_registrations_v2',
    gallery: 'apoyojoven_gallery_v2',
    news: 'apoyojoven_news_v2',
    support: 'apoyojoven_support_v2',
    surveys: 'apoyojoven_surveys_v2',
    session: 'apoyojoven_session_v2'
  };

  const categoryLabels = {
    formacion: 'Formación',
    recreacion: 'Recreación',
    voluntariado: 'Voluntariado',
    preuniversitario: 'Preuniversitario',
    educacion: 'Educación',
    cultura: 'Cultura'
  };

  const seedData = {
    users: [
      {
        id: 'usr-admin',
        name: 'Administración',
        lastname: 'Apoyo Joven',
        email: 'admin@apoyojoven.cl',
        phone: '',
        birthdate: '',
        passwordHash: hashText('Admin123!'),
        role: 'admin',
        createdAt: '2026-06-01T12:00:00.000Z'
      },
      {
        id: 'usr-editor',
        name: 'Editor',
        lastname: 'Contenidos',
        email: 'editor@apoyojoven.cl',
        phone: '',
        birthdate: '',
        passwordHash: hashText('Editor123!'),
        role: 'editor',
        createdAt: '2026-06-02T12:00:00.000Z'
      }
    ],
    activities: [
      {
        id: 'act-excel', name: 'Taller Excel Básico', category: 'formacion',
        date: '2026-07-04', time: '10:00', location: 'Laboratorio de Computación, sede central',
        capacity: 40, baseEnrolled: 28, description: 'Aprende fórmulas, formato de tablas, filtros y funciones esenciales para estudiar o trabajar.', active: true
      },
      {
        id: 'act-basket', name: 'Encuentro de Básquetbol Juvenil', category: 'recreacion',
        date: '2026-07-11', time: '16:00', location: 'Gimnasio comunitario',
        capacity: 30, baseEnrolled: 19, description: 'Jornada recreativa con equipos mixtos, ejercicios de técnica y partidos amistosos.', active: true
      },
      {
        id: 'act-limpieza', name: 'Jornada de Limpieza Comunitaria', category: 'voluntariado',
        date: '2026-07-18', time: '09:30', location: 'Parque urbano, acceso norte',
        capacity: 50, baseEnrolled: 37, description: 'Actividad de recuperación de espacios públicos, clasificación de residuos y educación ambiental.', active: true
      },
      {
        id: 'act-lectora', name: 'Preuniversitario Competencia Lectora', category: 'preuniversitario',
        date: '2026-07-06', time: '18:30', location: 'Sala 204, sede Santo Tomás',
        capacity: 35, baseEnrolled: 30, description: 'Reforzamiento semanal de comprensión, vocabulario contextual y análisis de textos.', active: true
      },
      {
        id: 'act-m1', name: 'Preuniversitario Matemática M1', category: 'preuniversitario',
        date: '2026-07-07', time: '18:30', location: 'Sala 205, sede Santo Tomás',
        capacity: 35, baseEnrolled: 22, description: 'Resolución guiada de ejercicios de números, álgebra, geometría y probabilidad.', active: true
      },
      {
        id: 'act-arte', name: 'Taller de Pintura y Expresión', category: 'recreacion',
        date: '2026-07-25', time: '11:00', location: 'Centro cultural juvenil',
        capacity: 24, baseEnrolled: 24, description: 'Espacio creativo para experimentar con color, composición y expresión personal.', active: true
      },
      {
        id: 'act-cv', name: 'Currículum y Entrevista Laboral', category: 'formacion',
        date: '2026-08-01', time: '10:30', location: 'Sala multiuso municipal',
        capacity: 32, baseEnrolled: 13, description: 'Prepara un currículum efectivo y practica respuestas para entrevistas laborales.', active: true
      },
      {
        id: 'act-apoyo', name: 'Voluntariado de Apoyo Escolar', category: 'voluntariado',
        date: '2026-08-08', time: '10:00', location: 'Biblioteca comunitaria',
        capacity: 20, baseEnrolled: 8, description: 'Acompañamiento de lectura y matemáticas para estudiantes de enseñanza básica.', active: true
      }
    ],
    gallery: [
      {
        id: 'gal-vol', title: 'Compromiso con el entorno', category: 'voluntariado',
        src: 'https://images.unsplash.com/photo-1758599667718-684569efe224?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        credit: 'Unsplash · Vitaly Gariev'
      },
      {
        id: 'gal-basket', title: 'Deporte y vida saludable', category: 'recreacion',
        src: 'https://images.unsplash.com/photo-1706841533830-f0bba6c45320?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        credit: 'Unsplash · April Walker'
      },
      {
        id: 'gal-study', title: 'Aprendizaje colaborativo', category: 'educacion',
        src: 'https://images.unsplash.com/photo-1747953273815-28f12a19ef0d?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        credit: 'Unsplash · Paulo Cristovam'
      },
      {
        id: 'gal-art', title: 'Taller creativo', category: 'cultura',
        src: 'https://images.unsplash.com/photo-1757085242652-f8cd4d3de889?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        credit: 'Unsplash · Anya Richter'
      },
      {
        id: 'gal-event', title: 'Encuentro cultural juvenil', category: 'cultura',
        src: 'https://images.unsplash.com/photo-1761066489232-27aadc784d09?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
        credit: 'Unsplash · Ilya Semenov'
      },
      {
        id: 'gal-city', title: 'Identidad y comunidad', category: 'voluntariado',
        src: 'assets/banner.png', credit: 'Archivo del proyecto'
      }
    ],
    news: [
      { id: 'news-1', title: 'Inscripciones abiertas para talleres de invierno', date: '2026-06-20', content: 'Ya puedes revisar los cupos de formación, recreación, voluntariado y preuniversitario desde la sección de actividades.' },
      { id: 'news-2', title: 'Nueva sección de soporte y preguntas frecuentes', date: '2026-06-18', content: 'El sitio incorpora formulario de contacto, recuperación de acceso y ayuda rápida para orientar a los usuarios.' },
      { id: 'news-3', title: 'Galería renovada con categorías', date: '2026-06-15', content: 'Las fotografías ahora se organizan por voluntariado, educación, recreación y cultura, con visualización ampliada.' }
    ]
  };

  const state = {
    activityFilter: 'todas',
    galleryFilter: 'todas',
    currentUser: null,
    previousFocus: null
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    seedStorage();
    restoreSession();
    bindNavigation();
    bindModals();
    bindAuth();
    bindActivities();
    bindGallery();
    bindSupport();
    bindSurvey();
    bindChat();
    bindAdmin();
    bindRevealAnimations();
    document.getElementById('current-year').textContent = new Date().getFullYear();
    renderAll();
  }

  function seedStorage(force = false) {
    if (force || !localStorage.getItem(STORAGE.users)) setData(STORAGE.users, clone(seedData.users));
    if (force || !localStorage.getItem(STORAGE.activities)) setData(STORAGE.activities, clone(seedData.activities));
    if (force || !localStorage.getItem(STORAGE.registrations)) setData(STORAGE.registrations, []);
    if (force || !localStorage.getItem(STORAGE.gallery)) setData(STORAGE.gallery, clone(seedData.gallery));
    if (force || !localStorage.getItem(STORAGE.news)) setData(STORAGE.news, clone(seedData.news));
    if (force || !localStorage.getItem(STORAGE.support)) setData(STORAGE.support, []);
    if (force || !localStorage.getItem(STORAGE.surveys)) setData(STORAGE.surveys, []);
    if (force) localStorage.removeItem(STORAGE.session);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getData(key, fallback = []) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch (error) {
      console.warn(`No fue posible leer ${key}`, error);
      return fallback;
    }
  }

  function setData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`No fue posible guardar ${key}`, error);
      toast('No se pudo guardar. El almacenamiento del navegador puede estar lleno.', 'error');
      return false;
    }
  }

  function hashText(text) {
    let hash = 2166136261;
    const normalized = String(text || '');
    for (let index = 0; index < normalized.length; index += 1) {
      hash ^= normalized.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function uid(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    const date = new Date(`${dateString}T12:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  }

  function formatShortDate(dateString) {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString.includes('T') ? dateString : `${dateString}T12:00:00`);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  }

  function restoreSession() {
    const sessionId = localStorage.getItem(STORAGE.session);
    const users = getData(STORAGE.users);
    state.currentUser = users.find(user => user.id === sessionId) || null;
    if (!state.currentUser && sessionId) localStorage.removeItem(STORAGE.session);
  }

  function isStaff() {
    return Boolean(state.currentUser && ['admin', 'editor'].includes(state.currentUser.role));
  }

  function isAdmin() {
    return Boolean(state.currentUser && state.currentUser.role === 'admin');
  }

  function renderAll() {
    renderSession();
    renderStats();
    renderActivities();
    renderNews();
    renderGallery();
    if (isStaff()) renderAdmin();
  }

  function renderSession() {
    const authButton = document.getElementById('auth-button');
    const footerAuthButton = document.getElementById('footer-auth-button');
    const adminButton = document.getElementById('admin-button');

    if (state.currentUser) {
      authButton.textContent = `${state.currentUser.name} · Salir`;
      authButton.dataset.action = 'logout';
      footerAuthButton.textContent = 'Cerrar sesión';
      footerAuthButton.dataset.action = 'logout';
      adminButton.classList.toggle('hidden', !isStaff());
    } else {
      authButton.textContent = 'Ingresar';
      authButton.dataset.action = 'login';
      footerAuthButton.textContent = 'Ingresar';
      footerAuthButton.dataset.action = 'login';
      adminButton.classList.add('hidden');
    }

    document.querySelectorAll('[data-admin-only]').forEach(element => {
      element.classList.toggle('hidden', !isAdmin());
    });
  }

  function renderStats() {
    const users = getData(STORAGE.users);
    const activities = getData(STORAGE.activities).filter(activity => activity.active);
    const registrations = getData(STORAGE.registrations);
    const totalAvailable = activities.reduce((sum, activity) => sum + Math.max(0, activity.capacity - enrolledCount(activity, registrations)), 0);
    document.getElementById('stats-users').textContent = users.length;
    document.getElementById('hero-activity-count').textContent = activities.length;
    document.getElementById('hero-open-spots').textContent = totalAvailable;
  }

  function enrolledCount(activity, registrations = getData(STORAGE.registrations)) {
    return Number(activity.baseEnrolled || 0) + registrations.filter(item => item.activityId === activity.id).length;
  }

  function bindNavigation() {
    const menuButton = document.getElementById('menu-button');
    const nav = document.getElementById('main-nav');
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.classList.toggle('open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));

    document.querySelectorAll('[data-set-filter]').forEach(link => {
      link.addEventListener('click', () => {
        state.activityFilter = link.dataset.setFilter;
        document.querySelectorAll('[data-filter]').forEach(button => button.classList.toggle('active', button.dataset.filter === state.activityFilter));
        renderActivities();
      });
    });

    const observedSections = [...document.querySelectorAll('main section[id]')];
    const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.01, 0.25, 0.5] });
    observedSections.forEach(section => sectionObserver.observe(section));
  }

  function closeMenu() {
    const menuButton = document.getElementById('menu-button');
    const nav = document.getElementById('main-nav');
    nav.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }

  function bindModals() {
    document.addEventListener('click', event => {
      const closeTarget = event.target.closest('[data-close-modal]');
      if (closeTarget) closeModal(closeTarget.dataset.closeModal);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        const openModalElement = document.querySelector('.modal.open');
        if (openModalElement) closeModal(openModalElement.id);
      }
    });
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    state.previousFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => {
      const focusable = modal.querySelector('input:not([type="hidden"]), button:not([disabled]), select, textarea, a[href]');
      focusable?.focus();
    }, 80);
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    // Mover el foco fuera del modal ANTES de poner aria-hidden=true
    // para evitar la advertencia del navegador sobre foco oculto
    const focused = modal.querySelector(':focus');
    if (focused) focused.blur();
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal.open')) document.body.classList.remove('modal-open');
    if (state.previousFocus && typeof state.previousFocus.focus === 'function') state.previousFocus.focus();
  }

  function bindAuth() {
    const authButton = document.getElementById('auth-button');
    const footerAuthButton = document.getElementById('footer-auth-button');
    const adminButton = document.getElementById('admin-button');
    const authAction = button => {
      if (button.dataset.action === 'logout') logout();
      else {
        setAuthView('login');
        openModal('auth-modal');
      }
    };
    authButton.addEventListener('click', () => authAction(authButton));
    footerAuthButton.addEventListener('click', () => authAction(footerAuthButton));
    adminButton.addEventListener('click', () => {
      if (!isStaff()) return;
      renderAdmin();
      openModal('admin-modal');
    });

    document.querySelectorAll('[data-auth-view]').forEach(button => {
      button.addEventListener('click', () => setAuthView(button.dataset.authView));
    });

    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('recover-form').addEventListener('submit', handleRecovery);
  }

  function setAuthView(view) {
    document.querySelectorAll('[data-auth-view]').forEach(button => button.classList.toggle('active', button.dataset.authView === view));
    document.querySelectorAll('[data-auth-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.authPanel === view));
    clearStatuses(['login-status', 'register-status', 'recover-status']);
  }

  function handleLogin(event) {
    event.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const status = document.getElementById('login-status');
    clearInvalid(event.currentTarget);

    if (!validateForm(event.currentTarget)) {
      setStatus(status, 'Completa correctamente el correo y la contraseña.', 'error');
      return;
    }

    const email = normalizeEmail(emailInput.value);
    const users = getData(STORAGE.users);
    const user = users.find(item => normalizeEmail(item.email) === email && item.passwordHash === hashText(passwordInput.value));
    if (!user) {
      setStatus(status, 'Correo o contraseña incorrectos.', 'error');
      return;
    }

    state.currentUser = user;
    localStorage.setItem(STORAGE.session, user.id);
    event.currentTarget.reset();
    setStatus(status, 'Acceso correcto.', 'success');
    renderAll();
    window.setTimeout(() => closeModal('auth-modal'), 450);
    toast(`Bienvenido, ${user.name}.`, 'success');
  }

  function handleRegister(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('register-status');
    clearInvalid(form);
    if (!validateForm(form)) {
      setStatus(status, 'Completa los campos obligatorios y acepta las condiciones.', 'error');
      return;
    }

    const email = normalizeEmail(document.getElementById('register-email').value);
    const users = getData(STORAGE.users);
    if (users.some(user => normalizeEmail(user.email) === email)) {
      setStatus(status, 'Ya existe una cuenta con ese correo.', 'error');
      return;
    }

    const password = document.getElementById('register-password').value;
    if (!isStrongEnough(password)) {
      markInvalid(document.getElementById('register-password'));
      setStatus(status, 'La contraseña debe tener 8 caracteres e incluir letras y números.', 'error');
      return;
    }

    const user = {
      id: uid('usr'),
      name: cleanText(document.getElementById('register-name').value),
      lastname: cleanText(document.getElementById('register-lastname').value),
      email,
      phone: cleanText(document.getElementById('register-phone').value),
      birthdate: document.getElementById('register-birthdate').value,
      passwordHash: hashText(password),
      role: 'visitor',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    if (!setData(STORAGE.users, users)) return;
    state.currentUser = user;
    localStorage.setItem(STORAGE.session, user.id);
    form.reset();
    setStatus(status, 'Cuenta creada correctamente.', 'success');
    renderAll();
    window.setTimeout(() => closeModal('auth-modal'), 500);
    toast('Tu cuenta fue creada.', 'success');
  }

  function handleRecovery(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('recover-status');
    clearInvalid(form);
    if (!validateForm(form)) {
      setStatus(status, 'Ingresa un correo y una contraseña válida.', 'error');
      return;
    }
    const email = normalizeEmail(document.getElementById('recover-email').value);
    const password = document.getElementById('recover-password').value;
    if (!isStrongEnough(password)) {
      markInvalid(document.getElementById('recover-password'));
      setStatus(status, 'La contraseña debe tener 8 caracteres e incluir letras y números.', 'error');
      return;
    }
    const users = getData(STORAGE.users);
    const index = users.findIndex(user => normalizeEmail(user.email) === email);
    if (index < 0) {
      setStatus(status, 'No encontramos una cuenta con ese correo.', 'error');
      return;
    }
    users[index].passwordHash = hashText(password);
    setData(STORAGE.users, users);
    form.reset();
    setStatus(status, 'Contraseña actualizada. Ya puedes ingresar.', 'success');
  }

  function logout() {
    const name = state.currentUser?.name || '';
    state.currentUser = null;
    localStorage.removeItem(STORAGE.session);
    renderAll();
    closeModal('admin-modal');
    toast(`${name ? `${name}, tu s` : 'S'}esión fue cerrada.`, 'success');
  }

  function isStrongEnough(password) {
    return String(password).length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  }

  function bindActivities() {
    document.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        state.activityFilter = button.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
        renderActivities();
      });
    });

    document.getElementById('activity-grid').addEventListener('click', event => {
      const button = event.target.closest('[data-register-activity]');
      if (!button) return;
      openRegistration(button.dataset.registerActivity);
    });
    document.getElementById('registration-form').addEventListener('submit', handleRegistration);
  }

  function renderActivities() {
    const grid = document.getElementById('activity-grid');
    const empty = document.getElementById('activity-empty');
    const registrations = getData(STORAGE.registrations);
    const activities = getData(STORAGE.activities)
      .filter(activity => activity.active)
      .filter(activity => state.activityFilter === 'todas' || activity.category === state.activityFilter)
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

    empty.classList.toggle('hidden', activities.length > 0);
    grid.innerHTML = activities.map(activity => {
      const enrolled = enrolledCount(activity, registrations);
      const available = Math.max(0, Number(activity.capacity) - enrolled);
      const percentage = Math.min(100, Math.round((enrolled / Number(activity.capacity)) * 100));
      const soldOut = available <= 0;
      return `
        <article class="activity-card" data-category="${escapeHtml(activity.category)}">
          <div class="activity-card-top">
            <span class="activity-category">${escapeHtml(categoryLabels[activity.category] || activity.category)}</span>
            <h3>${escapeHtml(activity.name)}</h3>
          </div>
          <div class="activity-card-body">
            <p>${escapeHtml(activity.description)}</p>
            <div class="activity-meta">
              <span>📅 ${escapeHtml(formatDate(activity.date))} · ${escapeHtml(activity.time)}</span>
              <span>📍 ${escapeHtml(activity.location)}</span>
            </div>
            <div class="capacity-row">
              <div class="capacity-copy"><span>${enrolled} inscritos de ${activity.capacity}</span><strong class="${soldOut ? 'sold-out' : 'available'}">${soldOut ? 'Cupos agotados' : `${available} disponibles`}</strong></div>
              <div class="capacity-bar"><span class="${percentage >= 90 ? 'danger' : ''}" style="width:${percentage}%"></span></div>
            </div>
            <button class="button ${soldOut ? 'button-ghost' : 'button-accent'}" type="button" data-register-activity="${escapeHtml(activity.id)}" ${soldOut ? 'disabled' : ''}>${soldOut ? 'Inscripción cerrada' : 'Inscribirme'}</button>
          </div>
        </article>`;
    }).join('');
  }

  function openRegistration(activityId) {
    const activity = getData(STORAGE.activities).find(item => item.id === activityId && item.active);
    if (!activity) {
      toast('La actividad ya no está disponible.', 'error');
      renderActivities();
      return;
    }
    const available = activity.capacity - enrolledCount(activity);
    if (available <= 0) {
      toast('Los cupos se agotaron.', 'error');
      renderActivities();
      return;
    }
    document.getElementById('registration-title').textContent = activity.name;
    document.getElementById('registration-summary').textContent = `${formatDate(activity.date)} a las ${activity.time}, ${activity.location}. Quedan ${available} cupos.`;
    document.getElementById('registration-activity-id').value = activity.id;
    document.getElementById('registration-status').textContent = '';
    if (state.currentUser) {
      document.getElementById('registration-name').value = `${state.currentUser.name} ${state.currentUser.lastname}`.trim();
      document.getElementById('registration-email').value = state.currentUser.email;
      document.getElementById('registration-phone').value = state.currentUser.phone || '';
    }
    openModal('registration-modal');
  }

  async function handleRegistration(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('registration-status');
    clearInvalid(form);
    if (!validateForm(form)) {
      setStatus(status, 'Completa los datos obligatorios y confirma la información.', 'error');
      return;
    }

    const activityId = document.getElementById('registration-activity-id').value;
    const email = normalizeEmail(document.getElementById('registration-email').value);
    const activities = getData(STORAGE.activities);
    const activity = activities.find(item => item.id === activityId && item.active);
    if (!activity || enrolledCount(activity) >= activity.capacity) {
      setStatus(status, 'La actividad ya no tiene cupos disponibles.', 'error');
      renderActivities();
      return;
    }

    const registrations = getData(STORAGE.registrations);
    if (registrations.some(item => item.activityId === activityId && normalizeEmail(item.email) === email)) {
      setStatus(status, 'Este correo ya está inscrito en la actividad.', 'error');
      return;
    }

    const name  = cleanText(document.getElementById('registration-name').value);
    const phone = cleanText(document.getElementById('registration-phone').value);

    // ── Enviar al backend SQL Server (si está disponible) ──
    const apiResult = await apiPost('/api/registrations', {
      actividad_id: activityId,
      usuario_id:   state.currentUser?.id || null,
      nombre:       name,
      correo:       email,
      telefono:     phone || null
    });

    if (apiResult && apiResult.status !== 'success') {
      // El backend respondió pero con error de negocio (ej: correo duplicado)
      setStatus(status, apiResult.error || 'No se pudo completar la inscripción.', 'error');
      return;
    }

    // ── Guardar también en LocalStorage (funciona sin backend) ──
    registrations.push({
      id: uid('reg'), activityId, userId: state.currentUser?.id || null,
      name, email, phone, createdAt: new Date().toISOString()
    });
    if (!setData(STORAGE.registrations, registrations)) return;

    const msg = apiResult
      ? apiResult.message          // mensaje del servidor
      : 'Inscripción confirmada correctamente.';

    setStatus(status, msg, 'success');
    toast('Tu inscripción fue registrada.', 'success');
    renderStats();
    renderActivities();
    if (isStaff()) renderAdmin();
    window.setTimeout(() => {
      form.reset();
      closeModal('registration-modal');
    }, 750);
  }

  function bindGallery() {
    document.querySelectorAll('[data-gallery-filter]').forEach(button => {
      button.addEventListener('click', () => {
        state.galleryFilter = button.dataset.galleryFilter;
        document.querySelectorAll('[data-gallery-filter]').forEach(item => item.classList.toggle('active', item === button));
        renderGallery();
      });
    });
    document.getElementById('gallery-grid').addEventListener('click', event => {
      const item = event.target.closest('[data-gallery-id]');
      if (!item) return;
      const galleryItem = getData(STORAGE.gallery).find(entry => entry.id === item.dataset.galleryId);
      if (!galleryItem) return;
      const image = document.getElementById('lightbox-image');
      image.src = galleryItem.src;
      image.alt = galleryItem.title;
      document.getElementById('lightbox-title').textContent = galleryItem.title;
      document.getElementById('lightbox-category').textContent = categoryLabels[galleryItem.category] || galleryItem.category;
      openModal('lightbox-modal');
    });
  }

  function renderGallery() {
    const gallery = getData(STORAGE.gallery).filter(item => state.galleryFilter === 'todas' || item.category === state.galleryFilter);
    document.getElementById('gallery-grid').innerHTML = gallery.map(item => `
      <button class="gallery-item" type="button" data-gallery-id="${escapeHtml(item.id)}" aria-label="Ampliar ${escapeHtml(item.title)}">
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.onerror=null;this.src='assets/banner.png';">
        <span class="gallery-overlay"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(categoryLabels[item.category] || item.category)}</span></span>
      </button>`).join('');
  }

  function renderNews() {
    const news = getData(STORAGE.news).sort((a, b) => b.date.localeCompare(a.date));
    const grid = document.getElementById('news-grid');
    if (!news.length) {
      grid.innerHTML = '<div class="empty-state"><h3>No hay noticias publicadas</h3></div>';
      return;
    }
    grid.innerHTML = news.map(item => `
      <article class="news-card">
        <time datetime="${escapeHtml(item.date)}">${escapeHtml(formatDate(item.date))}</time>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.content)}</p>
      </article>`).join('');
  }

  function bindSupport() {
    document.querySelectorAll('.faq-item button').forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const open = item.classList.toggle('open');
        button.setAttribute('aria-expanded', String(open));
      });
    });
    document.getElementById('contact-form').addEventListener('submit', handleContact);
  }

  async function handleContact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('contact-status');
    clearInvalid(form);
    if (!validateForm(form)) {
      setStatus(status, 'Completa todos los campos obligatorios.', 'error');
      return;
    }

    const name    = cleanText(document.getElementById('contact-name').value);
    const email   = normalizeEmail(document.getElementById('contact-email').value);
    const subject = cleanText(document.getElementById('contact-subject').value);
    const message = cleanText(document.getElementById('contact-message').value);

    // ── Enviar al backend SQL Server (si está disponible) ──
    await apiPost('/api/support', {
      usuario_id: state.currentUser?.id || null,
      nombre:     name,
      correo:     email,
      motivo:     subject,
      mensaje:    message
    });

    // ── Guardar en LocalStorage como respaldo ──
    const messages = getData(STORAGE.support);
    messages.push({
      id: uid('msg'), name, email,
      subject, message,
      status: 'pendiente', createdAt: new Date().toISOString()
    });
    if (!setData(STORAGE.support, messages)) return;
    form.reset();
    setStatus(status, 'Consulta enviada. El equipo podrá revisarla desde el panel.', 'success');
    toast('Consulta registrada.', 'success');
    if (isStaff()) renderAdmin();
  }

  function bindSurvey() {
    document.getElementById('survey-form').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const status = document.getElementById('survey-status');
      clearInvalid(form);
      if (!validateForm(form)) {
        setStatus(status, 'Selecciona una calificación.', 'error');
        return;
      }
      const rating  = Number(document.getElementById('survey-rating').value);
      const comment = cleanText(document.getElementById('survey-comment').value);

      // ── Enviar al backend SQL Server — encuesta con id 1 (la inicial del schema) ──
      await apiPost('/api/surveys/1/responses', {
        usuario_id:   state.currentUser?.id || null,
        calificacion: rating,
        comentario:   comment || null
      });

      // ── Guardar en LocalStorage como respaldo ──
      const surveys = getData(STORAGE.surveys);
      surveys.push({
        id: uid('sur'), rating, comment,
        userId: state.currentUser?.id || null, createdAt: new Date().toISOString()
      });
      setData(STORAGE.surveys, surveys);
      form.reset();
      setStatus(status, 'Gracias por tu opinión.', 'success');
      if (isStaff()) renderAdmin();
    });
  }

  function bindChat() {
    const launcher = document.getElementById('chat-launcher');
    const widget = document.getElementById('chat-widget');
    const close = document.getElementById('chat-close');
    const toggle = open => {
      widget.classList.toggle('open', open);
      widget.setAttribute('aria-hidden', String(!open));
      launcher.setAttribute('aria-expanded', String(open));
      if (open) document.getElementById('chat-input').focus();
    };
    launcher.addEventListener('click', () => toggle(!widget.classList.contains('open')));
    close.addEventListener('click', () => toggle(false));
    document.getElementById('chat-form').addEventListener('submit', event => {
      event.preventDefault();
      const input = document.getElementById('chat-input');
      const text = cleanText(input.value);
      if (!text) return;
      addChatMessage(text, 'user');
      input.value = '';
      window.setTimeout(() => addChatMessage(chatResponse(text), 'bot'), 250);
    });
  }

  function addChatMessage(text, type) {
    const messages = document.getElementById('chat-messages');
    const message = document.createElement('div');
    message.className = `chat-message ${type}`;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function chatResponse(input) {
    const text = input.toLowerCase();
    if (/cupo|agotad|disponible/.test(text)) return 'Los cupos se actualizan en cada tarjeta. Cuando llegan a cero, el botón se bloquea automáticamente.';
    if (/inscri|registrar.*actividad/.test(text)) return 'Ve a Actividades, selecciona una opción con cupos y presiona “Inscribirme”. Debes ingresar nombre, correo y confirmar tus datos.';
    if (/contrase|clave|acceso|olvid/.test(text)) return 'Presiona “Ingresar”, abre la pestaña “Recuperar” y define una nueva contraseña para tu correo registrado.';
    if (/lazos|senda|educere|programa/.test(text)) return 'En Programas encontrarás Lazos, SENDA y Educere, con una descripción de sus áreas de apoyo.';
    if (/contact|soporte|ayuda|problema/.test(text)) return 'Completa el formulario de soporte en esta misma página. Tu consulta quedará disponible para el administrador.';
    if (/hola|buen/.test(text)) return 'Hola. Puedo orientarte sobre actividades, cupos, inscripciones, programas y recuperación de acceso.';
    return 'No encontré una respuesta exacta. Revisa las preguntas frecuentes o envía tu consulta mediante el formulario de soporte.';
  }

  function bindAdmin() {
    document.querySelectorAll('[data-admin-view]').forEach(button => {
      button.addEventListener('click', () => setAdminView(button.dataset.adminView));
    });
    document.getElementById('activity-admin-form').addEventListener('submit', saveAdminActivity);
    document.getElementById('activity-form-clear').addEventListener('click', clearActivityForm);
    document.getElementById('news-admin-form').addEventListener('submit', saveAdminNews);
    document.getElementById('news-form-clear').addEventListener('click', clearNewsForm);
    document.getElementById('gallery-admin-form').addEventListener('submit', saveAdminGallery);
    document.getElementById('gallery-form-clear').addEventListener('click', clearGalleryForm);
    document.getElementById('admin-activity-list').addEventListener('click', handleAdminActivityAction);
    document.getElementById('admin-news-list').addEventListener('click', handleAdminNewsAction);
    document.getElementById('admin-gallery-list').addEventListener('click', handleAdminGalleryAction);
    document.getElementById('admin-users-table').addEventListener('click', handleAdminUserAction);
    document.getElementById('admin-support-list').addEventListener('click', handleSupportAction);
    document.getElementById('export-data-button').addEventListener('click', exportData);
    document.getElementById('reset-data-button').addEventListener('click', resetDemoData);
  }

  function setAdminView(view) {
    if (view === 'users' && !isAdmin()) view = 'dashboard';
    document.querySelectorAll('[data-admin-view]').forEach(button => button.classList.toggle('active', button.dataset.adminView === view));
    document.querySelectorAll('[data-admin-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.adminPanel === view));
  }

  function renderAdmin() {
    if (!isStaff()) return;
    renderSession();
    renderAdminKpis();
    renderAdminActivities();
    renderAdminNews();
    renderAdminGallery();
    renderAdminUsers();
    renderAdminSupport();
  }

  function renderAdminKpis() {
    const users = getData(STORAGE.users);
    const activities = getData(STORAGE.activities);
    const registrations = getData(STORAGE.registrations);
    const messages = getData(STORAGE.support);
    const surveys = getData(STORAGE.surveys);
    const values = [
      [users.length, 'Usuarios'],
      [activities.filter(item => item.active).length, 'Actividades activas'],
      [registrations.length, 'Inscripciones nuevas'],
      [messages.filter(item => item.status !== 'resuelto').length, 'Consultas pendientes'],
      [surveys.length ? (surveys.reduce((sum, item) => sum + item.rating, 0) / surveys.length).toFixed(1) : '—', 'Promedio encuesta']
    ];
    document.getElementById('admin-kpis').innerHTML = values.map(([value, label]) => `<article class="admin-kpi"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></article>`).join('');
  }

  function renderAdminActivities() {
    const activities = getData(STORAGE.activities).sort((a, b) => a.date.localeCompare(b.date));
    const registrations = getData(STORAGE.registrations);
    document.getElementById('admin-activity-list').innerHTML = activities.length ? activities.map(item => `
      <article class="admin-list-item">
        <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(formatShortDate(item.date))} · ${escapeHtml(item.location)}</span><small>${enrolledCount(item, registrations)}/${item.capacity} inscritos · ${item.active ? 'Publicada' : 'Oculta'}</small></div>
        <div class="admin-item-actions"><button class="small-button" type="button" data-edit-activity="${escapeHtml(item.id)}">Editar</button><button class="small-button danger" type="button" data-delete-activity="${escapeHtml(item.id)}">Eliminar</button></div>
      </article>`).join('') : '<p>No hay actividades.</p>';
  }

  function saveAdminActivity(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('activity-admin-status');
    clearInvalid(form);
    if (!validateForm(form)) {
      setStatus(status, 'Completa los campos obligatorios.', 'error');
      return;
    }
    const activities = getData(STORAGE.activities);
    const id = document.getElementById('admin-activity-id').value;
    const existing = activities.find(item => item.id === id);
    const activity = {
      id: existing?.id || uid('act'),
      name: cleanText(document.getElementById('admin-activity-name').value),
      category: document.getElementById('admin-activity-category').value,
      capacity: Number(document.getElementById('admin-activity-capacity').value),
      date: document.getElementById('admin-activity-date').value,
      time: document.getElementById('admin-activity-time').value,
      location: cleanText(document.getElementById('admin-activity-location').value),
      description: cleanText(document.getElementById('admin-activity-description').value),
      active: document.getElementById('admin-activity-active').checked,
      baseEnrolled: existing?.baseEnrolled || 0
    };
    const index = activities.findIndex(item => item.id === activity.id);
    if (index >= 0) activities[index] = activity;
    else activities.push(activity);
    if (!setData(STORAGE.activities, activities)) return;
    setStatus(status, existing ? 'Actividad actualizada.' : 'Actividad creada.', 'success');
    clearActivityForm(false);
    renderAll();
    renderAdmin();
  }

  function handleAdminActivityAction(event) {
    const editButton = event.target.closest('[data-edit-activity]');
    const deleteButton = event.target.closest('[data-delete-activity]');
    const activities = getData(STORAGE.activities);
    if (editButton) {
      const item = activities.find(activity => activity.id === editButton.dataset.editActivity);
      if (!item) return;
      document.getElementById('admin-activity-id').value = item.id;
      document.getElementById('admin-activity-name').value = item.name;
      document.getElementById('admin-activity-category').value = item.category;
      document.getElementById('admin-activity-capacity').value = item.capacity;
      document.getElementById('admin-activity-date').value = item.date;
      document.getElementById('admin-activity-time').value = item.time;
      document.getElementById('admin-activity-location').value = item.location;
      document.getElementById('admin-activity-description').value = item.description;
      document.getElementById('admin-activity-active').checked = item.active;
      document.getElementById('activity-admin-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (deleteButton) {
      const id = deleteButton.dataset.deleteActivity;
      const item = activities.find(activity => activity.id === id);
      if (!item || !window.confirm(`¿Eliminar “${item.name}”? También se eliminarán sus inscripciones nuevas.`)) return;
      setData(STORAGE.activities, activities.filter(activity => activity.id !== id));
      setData(STORAGE.registrations, getData(STORAGE.registrations).filter(registration => registration.activityId !== id));
      renderAll();
      renderAdmin();
    }
  }

  function clearActivityForm(clearStatus = true) {
    const form = document.getElementById('activity-admin-form');
    form.reset();
    document.getElementById('admin-activity-id').value = '';
    document.getElementById('admin-activity-active').checked = true;
    if (clearStatus) document.getElementById('activity-admin-status').textContent = '';
  }

  function renderAdminNews() {
    const news = getData(STORAGE.news).sort((a, b) => b.date.localeCompare(a.date));
    document.getElementById('admin-news-list').innerHTML = news.length ? news.map(item => `
      <article class="admin-list-item"><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(formatShortDate(item.date))}</span><small>${escapeHtml(item.content.slice(0, 100))}${item.content.length > 100 ? '…' : ''}</small></div><div class="admin-item-actions"><button class="small-button" type="button" data-edit-news="${escapeHtml(item.id)}">Editar</button><button class="small-button danger" type="button" data-delete-news="${escapeHtml(item.id)}">Eliminar</button></div></article>`).join('') : '<p>No hay noticias.</p>';
  }

  function saveAdminNews(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('news-admin-status');
    clearInvalid(form);
    if (!validateForm(form)) {
      setStatus(status, 'Completa los campos obligatorios.', 'error');
      return;
    }
    const news = getData(STORAGE.news);
    const id = document.getElementById('admin-news-id').value;
    const item = {
      id: id || uid('news'),
      title: cleanText(document.getElementById('admin-news-title').value),
      date: document.getElementById('admin-news-date').value,
      content: cleanText(document.getElementById('admin-news-content').value)
    };
    const index = news.findIndex(entry => entry.id === item.id);
    if (index >= 0) news[index] = item;
    else news.push(item);
    setData(STORAGE.news, news);
    setStatus(status, index >= 0 ? 'Noticia actualizada.' : 'Noticia publicada.', 'success');
    clearNewsForm(false);
    renderNews();
    renderAdminNews();
  }

  function handleAdminNewsAction(event) {
    const edit = event.target.closest('[data-edit-news]');
    const remove = event.target.closest('[data-delete-news]');
    const news = getData(STORAGE.news);
    if (edit) {
      const item = news.find(entry => entry.id === edit.dataset.editNews);
      if (!item) return;
      document.getElementById('admin-news-id').value = item.id;
      document.getElementById('admin-news-title').value = item.title;
      document.getElementById('admin-news-date').value = item.date;
      document.getElementById('admin-news-content').value = item.content;
    }
    if (remove) {
      const item = news.find(entry => entry.id === remove.dataset.deleteNews);
      if (!item || !window.confirm(`¿Eliminar “${item.title}”?`)) return;
      setData(STORAGE.news, news.filter(entry => entry.id !== item.id));
      renderNews();
      renderAdminNews();
    }
  }

  function clearNewsForm(clearStatus = true) {
    document.getElementById('news-admin-form').reset();
    document.getElementById('admin-news-id').value = '';
    if (clearStatus) document.getElementById('news-admin-status').textContent = '';
  }

  function renderAdminGallery() {
    const gallery = getData(STORAGE.gallery);
    document.getElementById('admin-gallery-list').innerHTML = gallery.length ? gallery.map(item => `
      <article class="admin-list-item"><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(categoryLabels[item.category] || item.category)}</span><small>${escapeHtml(item.credit || 'Imagen administrada')}</small></div><div class="admin-item-actions"><button class="small-button" type="button" data-edit-gallery="${escapeHtml(item.id)}">Editar</button><button class="small-button danger" type="button" data-delete-gallery="${escapeHtml(item.id)}">Eliminar</button></div></article>`).join('') : '<p>No hay imágenes.</p>';
  }

  async function saveAdminGallery(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById('gallery-admin-status');
    clearInvalid(form);
    const title = cleanText(document.getElementById('admin-gallery-title').value);
    const category = document.getElementById('admin-gallery-category').value;
    const url = document.getElementById('admin-gallery-url').value.trim();
    const file = document.getElementById('admin-gallery-file').files[0];
    const id = document.getElementById('admin-gallery-id').value;
    const gallery = getData(STORAGE.gallery);
    const existing = gallery.find(item => item.id === id);

    if (!title || !category || (!url && !file && !existing?.src)) {
      setStatus(status, 'Ingresa título, categoría y una URL o archivo.', 'error');
      return;
    }
    if (file && file.size > 1.5 * 1024 * 1024) {
      setStatus(status, 'El archivo supera 1,5 MB. Reduce su tamaño.', 'error');
      return;
    }

    let src = url || existing?.src || '';
    if (file) {
      try {
        src = await fileToDataUrl(file);
      } catch (error) {
        setStatus(status, 'No se pudo leer el archivo.', 'error');
        return;
      }
    }
    const item = { id: id || uid('gal'), title, category, src, credit: file ? 'Carga del administrador' : (existing?.credit || 'Imagen externa') };
    const index = gallery.findIndex(entry => entry.id === item.id);
    if (index >= 0) gallery[index] = item;
    else gallery.push(item);
    if (!setData(STORAGE.gallery, gallery)) return;
    setStatus(status, index >= 0 ? 'Imagen actualizada.' : 'Imagen agregada.', 'success');
    clearGalleryForm(false);
    renderGallery();
    renderAdminGallery();
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function handleAdminGalleryAction(event) {
    const edit = event.target.closest('[data-edit-gallery]');
    const remove = event.target.closest('[data-delete-gallery]');
    const gallery = getData(STORAGE.gallery);
    if (edit) {
      const item = gallery.find(entry => entry.id === edit.dataset.editGallery);
      if (!item) return;
      document.getElementById('admin-gallery-id').value = item.id;
      document.getElementById('admin-gallery-title').value = item.title;
      document.getElementById('admin-gallery-category').value = item.category;
      document.getElementById('admin-gallery-url').value = item.src.startsWith('data:') ? '' : item.src;
    }
    if (remove) {
      const item = gallery.find(entry => entry.id === remove.dataset.deleteGallery);
      if (!item || !window.confirm(`¿Eliminar “${item.title}”?`)) return;
      setData(STORAGE.gallery, gallery.filter(entry => entry.id !== item.id));
      renderGallery();
      renderAdminGallery();
    }
  }

  function clearGalleryForm(clearStatus = true) {
    document.getElementById('gallery-admin-form').reset();
    document.getElementById('admin-gallery-id').value = '';
    if (clearStatus) document.getElementById('gallery-admin-status').textContent = '';
  }

  function renderAdminUsers() {
    if (!isAdmin()) return;
    const users = getData(STORAGE.users).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    document.getElementById('admin-users-table').innerHTML = users.map(user => `
      <tr><td>${escapeHtml(`${user.name} ${user.lastname}`)}</td><td>${escapeHtml(user.email)}</td><td>${escapeHtml(roleLabel(user.role))}</td><td>${escapeHtml(formatShortDate(user.createdAt))}</td><td>${user.id === 'usr-admin' ? '<span>Protegido</span>' : `<button class="small-button" type="button" data-change-role="${escapeHtml(user.id)}">Cambiar rol</button>`}</td></tr>`).join('');
  }

  function handleAdminUserAction(event) {
    const button = event.target.closest('[data-change-role]');
    if (!button || !isAdmin()) return;
    const users = getData(STORAGE.users);
    const user = users.find(item => item.id === button.dataset.changeRole);
    if (!user) return;
    const order = ['visitor', 'editor', 'admin'];
    user.role = order[(order.indexOf(user.role) + 1) % order.length];
    setData(STORAGE.users, users);
    if (state.currentUser?.id === user.id) {
      state.currentUser = user;
      if (!isStaff()) closeModal('admin-modal');
    }
    renderAll();
    renderAdmin();
  }

  function roleLabel(role) {
    return ({ admin: 'Administrador', editor: 'Editor', visitor: 'Visitante' })[role] || role;
  }

  function renderAdminSupport() {
    const messages = getData(STORAGE.support).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const surveys = getData(STORAGE.surveys).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    document.getElementById('admin-support-list').innerHTML = messages.length ? messages.map(item => `
      <article class="admin-list-item"><div><strong>${escapeHtml(item.subject)} · ${escapeHtml(item.name)}</strong><span>${escapeHtml(item.email)} · ${escapeHtml(formatShortDate(item.createdAt))}</span><small>${escapeHtml(item.message)}</small></div><div class="admin-item-actions"><button class="small-button" type="button" data-resolve-support="${escapeHtml(item.id)}">${item.status === 'resuelto' ? 'Reabrir' : 'Resolver'}</button><button class="small-button danger" type="button" data-delete-support="${escapeHtml(item.id)}">Eliminar</button></div></article>`).join('') : '<p>No hay consultas registradas.</p>';
    document.getElementById('admin-survey-list').innerHTML = surveys.length ? surveys.map(item => `
      <article class="admin-list-item"><div><strong>${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</strong><span>${escapeHtml(formatShortDate(item.createdAt))}</span><small>${escapeHtml(item.comment || 'Sin comentario')}</small></div></article>`).join('') : '<p>No hay encuestas registradas.</p>';
  }

  function handleSupportAction(event) {
    const resolve = event.target.closest('[data-resolve-support]');
    const remove = event.target.closest('[data-delete-support]');
    const messages = getData(STORAGE.support);
    if (resolve) {
      const item = messages.find(message => message.id === resolve.dataset.resolveSupport);
      if (!item) return;
      item.status = item.status === 'resuelto' ? 'pendiente' : 'resuelto';
      setData(STORAGE.support, messages);
      renderAdmin();
    }
    if (remove) {
      if (!window.confirm('¿Eliminar esta consulta?')) return;
      setData(STORAGE.support, messages.filter(message => message.id !== remove.dataset.deleteSupport));
      renderAdmin();
    }
  }

  function exportData() {
    const exportObject = {
      exportedAt: new Date().toISOString(),
      users: getData(STORAGE.users).map(({ passwordHash, ...user }) => user),
      activities: getData(STORAGE.activities),
      registrations: getData(STORAGE.registrations),
      gallery: getData(STORAGE.gallery).map(item => ({ ...item, src: item.src.startsWith('data:') ? '[imagen local omitida]' : item.src })),
      news: getData(STORAGE.news),
      support: getData(STORAGE.support),
      surveys: getData(STORAGE.surveys)
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `apoyo-joven-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast('Datos exportados.', 'success');
  }

  function resetDemoData() {
    if (!isAdmin() || !window.confirm('Se eliminarán cuentas, inscripciones, consultas y cambios locales. ¿Continuar?')) return;
    seedStorage(true);
    restoreSession();
    clearActivityForm();
    clearNewsForm();
    clearGalleryForm();
    closeModal('admin-modal');
    renderAll();
    toast('Datos de demostración restablecidos.', 'success');
  }

  function bindRevealAnimations() {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }

  function validateForm(form) {
    let valid = true;
    [...form.elements].forEach(element => {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement)) return;
      if (!element.checkValidity()) {
        markInvalid(element);
        valid = false;
      }
    });
    return valid;
  }

  function markInvalid(element) {
    element.classList.add('invalid');
    element.addEventListener('input', () => element.classList.remove('invalid'), { once: true });
    element.addEventListener('change', () => element.classList.remove('invalid'), { once: true });
  }

  function clearInvalid(form) {
    form.querySelectorAll('.invalid').forEach(element => element.classList.remove('invalid'));
  }

  function setStatus(element, message, type) {
    element.textContent = message;
    element.className = `form-status ${type}`;
  }

  function clearStatuses(ids) {
    ids.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.className = 'form-status';
      if (element) element.textContent = '';
    });
  }

  function toast(message, type = '') {
    const region = document.getElementById('toast-region');
    const element = document.createElement('div');
    element.className = `toast ${type}`.trim();
    element.textContent = message;
    region.appendChild(element);
    window.setTimeout(() => element.remove(), 3600);
  }

  function cleanText(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
  }
})();
