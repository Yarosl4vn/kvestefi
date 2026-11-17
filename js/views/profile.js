// ==========================================================================
// ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ И ЦИФРОВОЙ READY ID
// ==========================================================================

import { store } from '../store.js';
import { LEVELING, BADGES } from '../data.js';
import { sound } from '../audio.js';

export function renderProfile(container) {
  const user = store.currentUser;
  const level = LEVELING.level(user.score);
  const title = LEVELING.title(level);
  const curScore = LEVELING.startScore(level);
  const nextScore = LEVELING.nextScore(level);
  const progressPercent = Math.min(Math.round(((user.score - curScore) / Math.max(nextScore - curScore, 1)) * 100), 100);

  container.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <!-- Карточка цифрового пропуска Ready ID -->
      <div class="card" style="
        background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%);
        border: 2px solid rgba(165, 180, 252, 0.4);
        padding: 28px;
        box-shadow: 0 12px 36px var(--primary-glow);
        margin-bottom: 24px;
        position: relative;
        overflow: hidden;
      ">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div>
            <div style="font-size: 0.75rem; letter-spacing: 1.5px; text-transform: uppercase; color: #C7D2FE; font-weight: 800;">
              READY ID DIGITAL PASS
            </div>
            <div style="font-size: 1.4rem; font-weight: 900; color: #FFFFFF; font-family: var(--font-mono);">
              ${user.login.toUpperCase()}-2026
            </div>
          </div>
          <span style="font-size: 2.4rem;">${user.avatar || '🛡️'}</span>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #FFFFFF; margin: 0;">${user.display_name}</h2>
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 6px; flex-wrap: wrap;">
            <span class="badge ${user.role === 'developer' ? 'badge-dev' : 'badge-student'}" style="background: rgba(255,255,255,0.2); color: #FFF; border-color: rgba(255,255,255,0.4);">
              ${user.prefix || 'Ученик'}
            </span>
            <span style="color: #E0E7FF; font-size: 0.85rem; font-weight: 600;">
              ${user.school_name} · ${user.homeroom || '11А'} класс
            </span>
          </div>
        </div>

        <div style="background: rgba(0, 0, 0, 0.25); padding: 14px 18px; border-radius: var(--radius-md); backdrop-filter: blur(10px);">
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 700; color: #E0E7FF; margin-bottom: 8px;">
            <span>⭐ Уровень ${level} · <strong>${title}</strong></span>
            <span>${user.score} / ${nextScore} XP</span>
          </div>
          <div class="quiz-progress-bar" style="margin: 0; height: 10px; background: rgba(255,255,255,0.2);">
            <div class="quiz-progress-fill" style="width: ${progressPercent}%; background: linear-gradient(90deg, #38BDF8, #F43F5E);"></div>
          </div>
        </div>
      </div>

      <!-- Достижения и бейджи -->
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 16px;">🎖️ Награды и достижения</h3>
        <div class="grid-4">
          ${BADGES.map(b => {
            const unlocked = b.id === 'first_quest' || b.id === 'streak_3' || (b.id === 'kvest_veteran' && level >= 1000);
            return `
              <div style="
                background: var(--surface-variant);
                padding: 14px;
                border-radius: var(--radius-md);
                text-align: center;
                opacity: ${unlocked ? '1' : '0.4'};
                border: 1px solid ${unlocked ? 'rgba(99, 102, 241, 0.4)' : 'transparent'};
              ">
                <div style="font-size: 2rem; margin-bottom: 6px;">${b.icon}</div>
                <div style="font-weight: 800; font-size: 0.85rem; margin-bottom: 4px;">${b.name}</div>
                <div style="font-size: 0.72rem; color: var(--text-dim);">${b.desc}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Быстрое переключение тестовых аккаунтов -->
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">👥 Переключение аккаунтов (для тестов)</h3>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 16px;">
          Выберите готовый профиль для проверки функционала под разными ролями:
        </p>

        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" onclick="window.switchTestAccount('yaroslav')">
            🛡️ Ярослав (Разработчик)
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.switchTestAccount('teacher')">
            📚 Учитель (Математика 10Б)
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.switchTestAccount('admin')">
            🏛️ Директор школы № 29
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.switchTestAccount('support')">
            🎧 Агент Поддержки
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.switchTestAccount('student')">
            🎓 Ученик 9А класса
          </button>
        </div>
      </div>
    </div>
  `;

  window.switchTestAccount = (type) => {
    sound.click();
    if (type === 'yaroslav') {
      store.currentUser = {
        login: 'yaroslav',
        display_name: 'Ярослав Акинфиев',
        role: 'developer',
        school_code: 'KVDEV',
        school_name: 'МБОУ «СОШ № 29»',
        grade: '11',
        letter: 'А',
        subject: 'Информатика',
        homeroom: '11А',
        avatar: '🛡️',
        score: 35000,
        prefix: '[Разработчик] ReadySquad',
        nick_color: '#6750A4',
        streak: 7,
        solvedCount: 160
      };
    } else if (type === 'teacher') {
      store.currentUser = {
        login: 'sch01_t_math',
        display_name: 'Семёнов Роман Олегович',
        role: 'teacher',
        school_code: 'SCH01',
        school_name: 'МБОУ «Гимназия № 1»',
        grade: '10',
        letter: 'Б',
        subject: 'Математика',
        homeroom: '10Б',
        avatar: '📐',
        score: 12000,
        prefix: '[Учитель] Математика',
        nick_color: '#3B82F6',
        streak: 3,
        solvedCount: 80
      };
    } else if (type === 'admin') {
      store.currentUser = {
        login: 'school29_admin',
        display_name: 'Администратор Школы № 29',
        role: 'school_admin',
        school_code: '201026',
        school_name: 'МБОУ «СОШ № 29»',
        grade: '',
        letter: '',
        subject: '',
        homeroom: '',
        avatar: '🏛️',
        score: 18000,
        prefix: '[Куратор] Школа № 29',
        nick_color: '#1D4ED8',
        streak: 4,
        solvedCount: 45
      };
    } else if (type === 'support') {
      store.currentUser = {
        login: 'support1',
        display_name: 'Агент Поддержки 1',
        role: 'support',
        school_code: 'KVDEV',
        school_name: 'ReadySquad Helpdesk',
        grade: '',
        letter: '',
        subject: '',
        homeroom: '',
        avatar: '🎧',
        score: 8000,
        prefix: 'Агент Поддержки',
        nick_color: '#0F766E',
        streak: 2,
        solvedCount: 30
      };
    } else if (type === 'student') {
      store.currentUser = {
        login: 'sch01_stud01',
        display_name: 'Яковлева Дарья',
        role: 'student',
        school_code: 'SCH01',
        school_name: 'МБОУ «Гимназия № 1»',
        grade: '9',
        letter: 'А',
        subject: '',
        homeroom: '9А',
        avatar: '🦊',
        score: 1450,
        prefix: 'Ученик',
        nick_color: '#10B981',
        streak: 2,
        solvedCount: 28
      };
    }
    store.saveUser();
    alert(`Вы вошли как ${store.currentUser.display_name} (${store.currentUser.role})`);
    window.location.reload();
  };
}
