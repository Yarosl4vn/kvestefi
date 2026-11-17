// ==========================================================================
// ЭКРАН ВХОДА И АВТОРИЗАЦИИ (READY ID AUTH)
// 1:1 Соответствие: AuthActivity.kt + Accounts.kt + Schools.kt
// ==========================================================================

import { store, PRESET_ACCOUNTS } from '../store.js';
import { sound } from '../audio.js';
import { SCHOOLS, SUBJECTS } from '../data.js';

export function renderAuth(container) {
  let mode = 'login'; // 'guest' | 'login' | 'register'

  function render() {
    container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; padding-top: 10px;">
        <!-- Фирменная шапка Auth (1:1 AuthActivity.kt) -->
        <div class="hero-cta-card" style="margin-bottom: 20px; cursor: default;">
          <svg class="hero-bg-cookie" viewBox="0 0 48 48">
            <use href="#cookie-8" fill="#FFFFFF" />
          </svg>

          <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 2;">
            <div class="m3-cookie-box" style="width: 58px; height: 58px;">
              <svg class="m3-cookie-svg" viewBox="0 0 48 48">
                <use href="#cookie-10" fill="#FFFFFF" />
              </svg>
              <div class="m3-cookie-inner" style="font-size: 1.6rem; color: #4F46E5;">
                🚀
              </div>
            </div>

            <div>
              <h2 style="font-size: 1.6rem; font-weight: 900; letter-spacing: -0.4px; margin: 0; color: #FFFFFF;">
                Квестефи
              </h2>
              <div style="font-size: 0.88rem; color: #E0E7FF; margin-top: 2px;">
                Тренажёр ОГЭ и ЕГЭ · школа и класс · Ready ID
              </div>
            </div>
          </div>
        </div>

        <!-- Сегментированный переключатель режимов (MaterialButtonToggleGroup) -->
        <div style="display: flex; gap: 6px; background: var(--surface2); padding: 5px; border-radius: var(--radius-full); margin-bottom: 22px; border: 1px solid var(--border);">
          <button class="btn btn-sm ${mode === 'guest' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; border: none;" onclick="window.setAuthMode('guest')">
            Гость
          </button>
          <button class="btn btn-sm ${mode === 'login' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; border: none;" onclick="window.setAuthMode('login')">
            Вход
          </button>
          <button class="btn btn-sm ${mode === 'register' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; border: none;" onclick="window.setAuthMode('register')">
            Регистрация
          </button>
        </div>

        <!-- Контейнер формы -->
        <div class="card" style="padding: 26px; margin-bottom: 20px;">
          ${renderModeContent()}
        </div>

        <!-- Ссылка на онбординг -->
        <div style="text-align: center; margin-top: 16px;">
          <a href="#onboarding" style="color: var(--primary); font-size: 0.90rem; font-weight: 700; text-decoration: none;">
            ✨ Пройти начальную настройку профиля (Онбординг) →
          </a>
        </div>
      </div>

      <!-- Модальное окно Ready ID SSO (1:1 AuthActivity.kt showReadyIdLoginDialog) -->
      <div id="readyid-modal" class="modal-overlay" style="display: none;">
        <div class="modal-box" style="max-width: 540px;">
          <div class="modal-header">
            <h3 class="modal-title">👑 Единый вход Ready ID</h3>
            <button class="modal-close" onclick="window.closeModals()">✕</button>
          </div>
          <div class="modal-body">
            <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 16px;">
              Ready ID — единый безопасный цифровой пропуск экосистемы ReadySquad:
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 12px 16px;" onclick="window.signInByReadyId('RDY-DEV-001')">
                👑 <strong>Ярослав Акинфиев</strong> (RDY-DEV-001)
              </button>
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 12px 16px;" onclick="window.signInByReadyId('RDY-DEV-002')">
                ⚡ <strong>Хайдароли Довлатов</strong> (RDY-DEV-002)
              </button>
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 12px 16px;" onclick="window.signInByReadyId('RDY-DEV-777')">
                🏫 <strong>Администратор платформы</strong> (RDY-DEV-777)
              </button>
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 12px 16px;" onclick="window.promptManualReadyId()">
                🔑 Ввести свой Ready ID вручную
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="window.closeModals()">Закрыть</button>
          </div>
        </div>
      </div>

      <!-- Модальное окно Google Sign-In (1:1 AuthActivity.kt openGoogleLogin) -->
      <div id="google-modal" class="modal-overlay" style="display: none;">
        <div class="modal-box" style="max-width: 540px;">
          <div class="modal-header">
            <h3 class="modal-title">🌐 Вход через Google</h3>
            <button class="modal-close" onclick="window.closeModals()">✕</button>
          </div>
          <div class="modal-body">
            <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 16px;">
              Выберите Google аккаунт для быстрой авторизации в Квестефи:
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 12px 16px;" onclick="window.handleGoogleAccountSelected('akinfeev.ready@gmail.com')">
                👤 <strong>Ярослав Акинфиев</strong> (akinfeev.ready@gmail.com)
              </button>
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 12px 16px;" onclick="window.handleGoogleAccountSelected('dovlatov.ready@gmail.com')">
                👤 <strong>Хайдароли Довлатов</strong> (dovlatov.ready@gmail.com)
              </button>
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 12px 16px;" onclick="window.handleGoogleAccountSelected('admin.mytishchi@readysquad.ru')">
                🏫 <strong>Администратор Мытищи</strong> (admin.mytishchi@readysquad.ru)
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="window.closeModals()">Закрыть</button>
          </div>
        </div>
      </div>

      <!-- Модальное окно Забыл пароль -->
      <div id="forgot-modal" class="modal-overlay" style="display: none;">
        <div class="modal-box" style="max-width: 500px;">
          <div class="modal-header">
            <h3 class="modal-title">Восстановление доступа</h3>
            <button class="modal-close" onclick="window.closeModals()">✕</button>
          </div>
          <div class="modal-body">
            <p style="color: var(--text-main); line-height: 1.6; font-size: 0.95rem;">
              Если забыл пароль, обратись к классному руководителю или куратору олимпиад в своей школе, либо войди через Google или создай новый учебный профиль во вкладке «Регистрация».
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" onclick="window.closeModals()">Понятно</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderModeContent() {
    if (mode === 'guest') {
      return `
        <div>
          <h3 style="font-size: 1.35rem; font-weight: 900; margin-bottom: 6px; color: var(--text-main);">
            Быстрый старт
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 20px;">
            Можно заниматься без регистрации: квесты, шпаргалки и статистика работают сразу, а к школе легко подключиться позже.
          </p>

          <div class="form-group">
            <label class="form-label">Как к тебе обращаться?</label>
            <input type="text" id="guest-name" class="input" value="Гость" placeholder="Введите имя...">
          </div>

          <div class="form-group">
            <label class="form-label">К какому экзамену готовимся?</label>
            <div style="display: flex; gap: 10px;">
              <button type="button" id="btn-exam-oge" class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.setGuestExam('ОГЭ')">
                ОГЭ (9 класс)
              </button>
              <button type="button" id="btn-exam-ege" class="btn btn-secondary btn-sm" style="flex: 1;" onclick="window.setGuestExam('ЕГЭ')">
                ЕГЭ (10–11 класс)
              </button>
            </div>
          </div>

          <button class="btn btn-primary btn-lg btn-block" style="margin-top: 14px;" onclick="window.submitGuestAuth()">
            Продолжить как гость →
          </button>
        </div>
      `;
    }

    if (mode === 'login') {
      return `
        <div>
          <h3 style="font-size: 1.35rem; font-weight: 900; margin-bottom: 6px; color: var(--text-main);">
            Вход в аккаунт
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 20px;">
            Используй логин и пароль, созданные при регистрации или выданные в школе.
          </p>

          <form onsubmit="event.preventDefault(); window.submitLogin();">
            <div class="form-group">
              <label class="form-label">Логин или Ready ID:</label>
              <input type="text" id="login-username" class="input" value="yaroslav" placeholder="yaroslav / teacher / student">
            </div>

            <div class="form-group">
              <label class="form-label">Пароль:</label>
              <input type="password" id="login-password" class="input" value="••••••••" placeholder="Введите пароль">
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block" style="margin-top: 16px;">
              Войти
            </button>

            <!-- Кнопки входа через Google и Ready ID (1:1 AuthActivity.kt) -->
            <div style="display: flex; gap: 10px; margin-top: 12px;">
              <button type="button" class="btn btn-secondary btn-block" onclick="window.showGoogleModal()" style="font-size: 0.86rem; padding: 10px 12px;">
                🌐 Войти через Google
              </button>
              <button type="button" class="btn btn-secondary btn-block" onclick="window.showReadyIdModal()" style="font-size: 0.86rem; padding: 10px 12px;">
                👑 Войти через Ready ID
              </button>
            </div>

            <div style="text-align: center; margin-top: 12px;">
              <button type="button" class="btn btn-secondary btn-sm" style="border: none; color: var(--text-dim);" onclick="window.showForgotPassModal()">
                Забыл пароль?
              </button>
            </div>
          </form>

          <!-- Быстрый вход для тестирования ролей -->
          <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border);">
            <div style="font-weight: 800; font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
              Быстрый вход под готовыми ролями (1 клик):
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 10px 14px;" onclick="window.quickLogin('yaroslav')">
                🛡️ <strong>Ярослав Акинфиев</strong> — Главный разработчик ReadySquad
              </button>
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 10px 14px;" onclick="window.quickLogin('teacher')">
                📚 <strong>Семёнов Роман Олегович</strong> — Учитель математики (СОШ № 29)
              </button>
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 10px 14px;" onclick="window.quickLogin('student_alex')">
                🎓 <strong>Алексей Смирнов</strong> — Ученик 9 «Б» (СОШ № 29)
              </button>
              <button class="btn btn-secondary btn-sm" style="text-align: left; justify-content: flex-start; padding: 10px 14px;" onclick="window.quickLogin('school29_admin')">
                🏛️ <strong>Администрация Школы № 29</strong> — Куратор олимпиад
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (mode === 'register') {
      return `
        <div>
          <h3 style="font-size: 1.35rem; font-weight: 900; margin-bottom: 6px; color: var(--text-main);">
            Профиль и роль
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 20px;">
            Создайте профиль ученика или учителя для участия в олимпиадах г. Мытищи.
          </p>

          <form onsubmit="event.preventDefault(); window.submitRegister();">
            <div class="form-group">
              <label class="form-label">Роль в системе:</label>
              <select id="reg-role" class="input" onchange="window.toggleRoleFields(this.value)">
                <option value="student">🎓 Ученик</option>
                <option value="teacher">📚 Учитель-предметник / Классный руководитель</option>
                <option value="school_admin">🏛️ Администрация школы / Куратор</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">ФИО (или имя и фамилия):</label>
              <input type="text" id="reg-name" class="input" placeholder="2–3 слова (например, Иван Иванов)" required>
            </div>

            <div class="form-group">
              <label class="form-label">Логин для входа:</label>
              <input type="text" id="reg-login" class="input" placeholder="ivan_2026" required>
            </div>

            <div class="form-group">
              <label class="form-label">Пароль:</label>
              <input type="password" id="reg-pass" class="input" placeholder="Придумайте пароль" required>
            </div>

            <div class="form-group">
              <label class="form-label">Школа (городской округ Мытищи, 39 школ):</label>
              <select id="reg-school" class="input">
                ${SCHOOLS.map(s => `<option value="${s.code}">${s.name}</option>`).join('')}
              </select>
            </div>

            <div style="display: flex; gap: 12px;" id="reg-grade-row">
              <div class="form-group" style="flex: 1;">
                <label class="form-label">Класс:</label>
                <select id="reg-grade" class="input">
                  <option value="5">5 класс</option>
                  <option value="6">6 класс</option>
                  <option value="7">7 класс</option>
                  <option value="8">8 класс</option>
                  <option value="9" selected>9 класс (ОГЭ)</option>
                  <option value="10">10 класс</option>
                  <option value="11">11 класс (ЕГЭ)</option>
                </select>
              </div>

              <div class="form-group" style="flex: 1;">
                <label class="form-label">Параллель:</label>
                <select id="reg-letter" class="input">
                  <option value="А">А</option>
                  <option value="Б" selected>Б</option>
                  <option value="В">В</option>
                  <option value="Г">Г</option>
                  <option value="Д">Д</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Профильный предмет:</label>
              <select id="reg-subject" class="input">
                ${SUBJECTS.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('')}
              </select>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block" style="margin-top: 14px;">
              Создать аккаунт
            </button>
          </form>
        </div>
      `;
    }
  }

  // Методы действий
  window.setAuthMode = (m) => {
    sound.click();
    mode = m;
    render();
  };

  window.setGuestExam = (ex) => {
    sound.click();
    const btnOge = document.getElementById('btn-exam-oge');
    const btnEge = document.getElementById('btn-exam-ege');
    if (ex === 'ОГЭ') {
      btnOge.className = 'btn btn-primary btn-sm';
      btnEge.className = 'btn btn-secondary btn-sm';
    } else {
      btnOge.className = 'btn btn-secondary btn-sm';
      btnEge.className = 'btn btn-primary btn-sm';
    }
  };

  window.quickLogin = (key) => {
    sound.click();
    store.loginAs(key);
    sound.fanfare();
    window.location.hash = '#home';
  };

  window.showGoogleModal = () => {
    sound.click();
    const m = document.getElementById('google-modal');
    if (m) m.style.display = 'flex';
  };

  window.showReadyIdModal = () => {
    sound.click();
    const m = document.getElementById('readyid-modal');
    if (m) m.style.display = 'flex';
  };

  window.showForgotPassModal = () => {
    sound.click();
    const m = document.getElementById('forgot-modal');
    if (m) m.style.display = 'flex';
  };

  window.closeModals = () => {
    ['readyid-modal', 'google-modal', 'forgot-modal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  };

  window.signInByReadyId = (readyId) => {
    sound.click();
    window.closeModals();
    if (readyId === 'RDY-DEV-001') store.loginAs('yaroslav');
    else if (readyId === 'RDY-DEV-002') store.loginAs('khaidaroli');
    else store.loginAs('school29_admin');
    sound.fanfare();
    window.location.hash = '#home';
  };

  window.handleGoogleAccountSelected = (email) => {
    sound.click();
    window.closeModals();
    if (email.includes('akinfeev')) store.loginAs('yaroslav');
    else if (email.includes('dovlatov')) store.loginAs('khaidaroli');
    else store.loginAs('school29_admin');
    sound.fanfare();
    window.location.hash = '#home';
  };

  window.promptManualReadyId = () => {
    const rid = prompt('Введите ваш номер Ready ID (например, RDY-DEV-001):');
    if (rid) {
      window.signInByReadyId(rid.trim().toUpperCase());
    }
  };

  window.submitGuestAuth = () => {
    sound.click();
    const nameEl = document.getElementById('guest-name');
    const name = nameEl ? nameEl.value.trim() : 'Гость';
    store.register({
      display_name: name || 'Гость',
      login: 'guest_' + Date.now(),
      role: 'guest',
      avatar: '🛡️',
      school_name: 'МБОУ «СОШ № 29» г. Мытищи'
    });
    sound.fanfare();
    window.location.hash = '#home';
  };

  window.submitLogin = () => {
    sound.click();
    const loginEl = document.getElementById('login-username');
    const passEl = document.getElementById('login-password');
    const loginVal = loginEl ? loginEl.value.trim() : '';

    if (!loginVal) {
      alert('Пожалуйста, введите логин.');
      return;
    }

    store.login(loginVal, passEl ? passEl.value : '');
    sound.fanfare();
    window.location.hash = '#home';
  };

  window.submitRegister = () => {
    sound.click();
    const name = document.getElementById('reg-name')?.value.trim();
    const login = document.getElementById('reg-login')?.value.trim();
    const role = document.getElementById('reg-role')?.value;
    const schoolSelect = document.getElementById('reg-school');
    const schoolName = schoolSelect ? schoolSelect.options[schoolSelect.selectedIndex].text : 'МБОУ «СОШ № 29» г. Мытищи';
    const schoolCode = schoolSelect ? schoolSelect.value : '201026';
    const grade = document.getElementById('reg-grade')?.value;
    const letter = document.getElementById('reg-letter')?.value;
    const subject = document.getElementById('reg-subject')?.value;

    if (!name || !login) {
      alert('Заполните все обязательные поля.');
      return;
    }

    store.register({
      display_name: name,
      login: login,
      role: role,
      school_code: schoolCode,
      school_name: schoolName,
      grade: grade,
      letter: letter,
      subject: subject,
      avatar: role === 'teacher' ? '📚' : (role === 'school_admin' ? '🏛️' : '🎓')
    });

    sound.fanfare();
    window.location.hash = '#home';
  };

  window.toggleRoleFields = (r) => {
    const row = document.getElementById('reg-grade-row');
    if (row) {
      row.style.display = (r === 'school_admin') ? 'none' : 'flex';
    }
  };

  render();
}
