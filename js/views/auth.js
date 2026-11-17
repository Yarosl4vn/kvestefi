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
      <div style="max-width: 580px; margin: 0 auto; padding-top: 10px;">
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
    `;
  }

  function renderModeContent() {
    if (mode === 'guest') {
      return `
        <div>
          <h3 style="font-size: 1.35rem; font-weight: 900; margin-bottom: 6px; color: var(--text-main);">
            Быстрый гостевой вход
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 20px;">
            Начните решать квесты и олимпиады без пароля. Прогресс сохранится на этом устройстве.
          </p>

          <div class="form-group">
            <label class="form-label">Ваше имя:</label>
            <input type="text" id="guest-name" class="input" value="Гость" placeholder="Как вас зовут?">
          </div>

          <button class="btn btn-primary btn-lg btn-block" style="margin-top: 14px;" onclick="window.submitGuestAuth()">
            🚀 Начать как гость
          </button>
        </div>
      `;
    }

    if (mode === 'login') {
      return `
        <div>
          <h3 style="font-size: 1.35rem; font-weight: 900; margin-bottom: 6px; color: var(--text-main);">
            Вход в единую систему Ready ID
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 20px;">
            Введите логин или номер цифрового пропуска Ready ID для синхронизации прогресса.
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
              🔑 Войти в систему
            </button>
          </form>

          <!-- Быстрый вход для тестирования -->
          <div style="margin-top: 26px; padding-top: 20px; border-top: 1px solid var(--border);">
            <div style="font-weight: 800; font-size: 0.86rem; color: var(--text-secondary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
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
            Регистрация нового участника
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 20px;">
            Создайте профиль ученика или учителя для участия в олимпиадах г. Мытищи.
          </p>

          <form onsubmit="event.preventDefault(); window.submitRegister();">
            <div class="form-group">
              <label class="form-label">Фамилия и Имя:</label>
              <input type="text" id="reg-name" class="input" placeholder="Например, Иван Иванов" required>
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
              <label class="form-label">Роль в системе:</label>
              <select id="reg-role" class="input" onchange="window.toggleRoleFields(this.value)">
                <option value="student">🎓 Ученик</option>
                <option value="teacher">📚 Учитель-предметник / Классный руководитель</option>
                <option value="school_admin">🏛️ Администрация школы / Куратор</option>
              </select>
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
              ✨ Создать аккаунт и войти
            </button>
          </form>
        </div>
      `;
    }
  }

  // Обработчики
  window.setAuthMode = (m) => {
    sound.click();
    mode = m;
    render();
  };

  window.quickLogin = (key) => {
    sound.click();
    store.loginAs(key);
    sound.fanfare();
    window.location.hash = '#home';
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

    const res = store.login(loginVal, passEl ? passEl.value : '');
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
