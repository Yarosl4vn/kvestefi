// ==========================================================================
// ГЛАВНЫЙ РОУТЕР И ЯДРО ПРИЛОЖЕНИЯ КВЕСТЕФИ (PWA & DESKTOP)
// ПОЛНОЕ СООТВЕТСТВИЕ ВСЕМ 12 ЭКРАНАМ И МОДУЛЯМ АНДРОИД-ПРИЛОЖЕНИЯ
// ==========================================================================

import { store } from './store.js';
import { sound } from './audio.js';
import { renderHome } from './views/home.js';
import { renderSubjects } from './views/subjects.js';
import { renderLearn } from './views/learn.js';
import { renderResults } from './views/results.js';
import { renderQuiz } from './views/quiz.js';
import { renderCompetitions } from './views/competitions.js';
import { renderDuels } from './views/duels.js';
import { renderChat } from './views/chat.js';
import { renderSupport } from './views/support.js';
import { renderProfile } from './views/profile.js';
import { renderDeveloper } from './views/developer.js';
import { renderSettings } from './views/settings.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderAuth } from './views/auth.js';

class Application {
  constructor() {
    this.currentRoute = 'home';
  }

  async init() {
    console.log('[Kvestefi] Initializing Web & PWA platform...');

    // Применить сохраненную тему
    const settings = store.getSettings();
    if (settings.theme === 'light') {
      document.body.className = 'theme-light';
    }
    sound.enabled = settings.sound;

    // Инициализировать хранилище и банк заданий
    await store.init();

    // Регистрация Service Worker для PWA
    this.registerServiceWorker();

    // Слушатель PWA установки
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window._deferredPwaPrompt = e;
      const btn = document.getElementById('pwa-install-btn');
      if (btn) btn.style.display = 'inline-flex';
    });

    // Маршрутизация по хэшу
    window.addEventListener('hashchange', () => this.handleRouting());

    // Первый запуск или пользователь не авторизован (как в Android MainActivity: if (!prefs.onboarded))
    if (!store.currentUser && (!window.location.hash || window.location.hash === '#home')) {
      window.location.hash = '#auth';
    } else if (!store.isOnboarded() && (!window.location.hash || window.location.hash === '#home')) {
      window.location.hash = '#onboarding';
    } else {
      this.handleRouting();
    }

    // Разблокировка Web Audio по первому взаимодействию
    document.addEventListener('click', () => sound.init(), { once: true });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('[PWA] Service Worker registered:', reg.scope))
        .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
    }
  }

  parseHash() {
    const hash = window.location.hash.slice(1) || 'home';
    const [route, queryString] = hash.split('?');
    const params = {};
    if (queryString) {
      new URLSearchParams(queryString).forEach((val, key) => {
        params[key] = val;
      });
    }
    return { route, params };
  }

  handleRouting() {
    const { route, params } = this.parseHash();
    this.currentRoute = route;

    // Защита роутов: если пользователь не вошел, разрешены только #auth и #onboarding
    if (!store.currentUser && route !== 'auth' && route !== 'onboarding') {
      window.location.hash = '#auth';
      return;
    }

    // Полноэкранный режим начального экрана и экрана авторизации (1:1 Android Activity)
    if (route === 'auth' || route === 'onboarding') {
      document.body.classList.add('auth-layout');
    } else {
      document.body.classList.remove('auth-layout');
    }

    const container = document.getElementById('view-content');
    if (!container) return;

    // Сброс скролла наверх
    container.scrollTop = 0;

    // Обновление активных кнопок в навигации
    this.updateNavState(route);

    // Роутинг экранов
    switch (route) {
      case 'onboarding':
        document.title = 'Квестефи — Начальный экран и настройка';
        renderOnboarding(container);
        break;
      case 'auth':
        document.title = 'Квестефи — Вход и Авторизация';
        renderAuth(container);
        break;
      case 'home':
        document.title = 'Квестефи — Главная';
        renderHome(container);
        break;
      case 'subjects':
        document.title = 'Квестефи — Предметы';
        renderSubjects(container);
        break;
      case 'learn':
        document.title = 'Квестефи — Учебник и шпаргалки';
        renderLearn(container);
        break;
      case 'results':
        document.title = 'Квестефи — Результаты и аналитика';
        renderResults(container);
        break;
      case 'quiz':
        document.title = 'Квестефи — Квест';
        renderQuiz(container, params);
        break;
      case 'competitions':
        document.title = 'Квестефи — Соревнования г. Мытищи';
        renderCompetitions(container);
        break;
      case 'duels':
        document.title = 'Квестефи — Дружеские забеги';
        renderDuels(container);
        break;
      case 'chat':
        document.title = 'Квестефи — Сообщения';
        renderChat(container);
        break;
      case 'support':
        document.title = 'Квестефи — Поддержка';
        renderSupport(container);
        break;
      case 'profile':
        document.title = 'Квестефи — Профиль и Достижения';
        renderProfile(container);
        break;
      case 'developer':
        document.title = 'Квестефи — Панель разработчика';
        renderDeveloper(container);
        break;
      case 'settings':
        document.title = 'Квестефи — Настройки и PWA';
        renderSettings(container);
        break;
      default:
        document.title = 'Квестефи';
        renderHome(container);
    }

    // Обновление шапки
    this.updateHeader(route);
  }

  updateNavState(route) {
    // Десктопный сайдбар
    document.querySelectorAll('.app-sidebar .nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.replace('#', '') === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Мобильный бар (iPhone)
    document.querySelectorAll('.mobile-bottom-nav .bottom-tab').forEach(tab => {
      const href = tab.getAttribute('href') || '';
      if (href.replace('#', '') === route) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  updateHeader(route) {
    const titleEl = document.getElementById('header-page-title');
    if (titleEl) {
      const titles = {
        onboarding: 'Начальная настройка',
        auth: 'Вход в систему',
        home: 'Квестефи',
        subjects: 'Школьные дисциплины',
        learn: 'Учебник и шпаргалки',
        results: 'Результаты и аналитика',
        quiz: 'Интеллектуальный квест',
        competitions: 'Межшкольные турниры',
        duels: 'Дружеские забеги',
        chat: 'Сообщения',
        support: 'Служба поддержки',
        profile: 'Цифровой Ready ID',
        developer: 'Панель разработчика',
        settings: 'Настройки'
      };
      titleEl.innerText = titles[route] || 'Квестефи';
    }

    // Обновить данные пользователя в шапке
    const user = store.currentUser;
    const userBadgeEl = document.querySelector('.user-badge-header');
    const authBtnEl = document.getElementById('header-auth-btn');

    if (user) {
      const streakEl = document.getElementById('header-streak-val');
      if (streakEl) streakEl.innerText = user.streak || 1;

      const nameEl = document.getElementById('header-user-name');
      if (nameEl) nameEl.innerText = user.display_name;

      const avatarEl = document.getElementById('header-user-avatar');
      if (avatarEl) avatarEl.innerText = user.avatar || '🛡️';

      if (userBadgeEl) userBadgeEl.style.display = 'inline-flex';
      if (authBtnEl) {
        authBtnEl.innerText = '🔄 Сменить';
        authBtnEl.title = 'Сменить аккаунт / Выйти';
      }
    } else {
      if (userBadgeEl) userBadgeEl.style.display = 'none';
      if (authBtnEl) {
        authBtnEl.innerText = '🔑 Вход';
        authBtnEl.title = 'Войти в аккаунт';
      }
    }
  }
}

export const app = new Application();
window.app = app;

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
