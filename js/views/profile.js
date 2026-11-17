// ==========================================================================
// ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ И ЦИФРОВОЙ READY ID
// Соответствие разметке Android: fragment_badges.xml + Ready ID Digital Pass
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
    <div style="max-width: 820px; margin: 0 auto;">
      <!-- 1. ЦИФРОВОЙ ПРОПУСК READY ID -->
      <div class="ready-id-card" style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; position: relative; z-index: 2;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-size: 0.72rem; letter-spacing: 1.8px; text-transform: uppercase; color: #C7D2FE; font-weight: 800;">
                READY ID DIGITAL PASS · v5.1.0
              </span>
              <span class="badge" style="background: rgba(52, 211, 153, 0.2); color: #34D399; font-size: 0.68rem; padding: 2px 8px;">
                ✓ ВЕРИФИЦИРОВАН
              </span>
            </div>
            <div style="font-size: 1.35rem; font-weight: 900; color: #FFFFFF; font-family: var(--font-mono);">
              ${user.login.toUpperCase()}-2026
            </div>
          </div>

          <!-- Медальон аватара Cookie -->
          <div class="m3-cookie-box" style="width: 58px; height: 58px;">
            <svg class="m3-cookie-svg" viewBox="0 0 48 48">
              <use href="#cookie-10" fill="#3B2D6E" />
            </svg>
            <div class="m3-cookie-inner" style="font-size: 1.6rem;">
              ${user.avatar || '🛡️'}
            </div>
          </div>
        </div>

        <div style="margin-bottom: 22px; position: relative; z-index: 2;">
          <h2 style="font-size: 1.75rem; font-weight: 900; color: #FFFFFF; margin: 0 0 6px 0; letter-spacing: -0.4px;">
            ${user.display_name}
          </h2>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <span class="badge ${user.role === 'developer' ? 'badge-dev' : 'badge-student'}">
              ${user.prefix || 'Ученик'}
            </span>
            <span style="color: #E0E7FF; font-size: 0.88rem; font-weight: 700;">
              ${user.school_name || 'МБОУ СОШ № 29 г. Мытищи'} · ${user.homeroom || '9 «Б»'} класс
            </span>
          </div>
        </div>

        <!-- Полоса прогресса уровня внутри пропуска -->
        <div style="background: rgba(0, 0, 0, 0.32); padding: 16px 20px; border-radius: 18px; backdrop-filter: blur(12px); position: relative; z-index: 2; border: 1px solid rgba(255,255,255,0.08);">
          <div style="display: flex; justify-content: space-between; font-size: 0.92rem; font-weight: 800; color: #E0E7FF; margin-bottom: 8px;">
            <span>⭐ Уровень ${level} · <strong style="color: #A5B4FC;">${title}</strong></span>
            <span>${user.score} / ${nextScore} XP</span>
          </div>
          <div class="m3-progress-track" style="height: 10px; background: rgba(255,255,255,0.18);">
            <div class="m3-progress-fill" style="width: ${progressPercent}%; background: linear-gradient(90deg, #38BDF8, #F43F5E);"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.76rem; color: #C7D2FE; margin-top: 6px;">
            <span>До следующего ранга: ${Math.max(nextScore - user.score, 0)} XP</span>
            <span>Штрих-код: RDY-2026-MYT-001</span>
          </div>
        </div>
      </div>

      <!-- 2. ДОСТИЖЕНИЯ И НАГРАДЫ -->
      <div class="card" style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 1.25rem; font-weight: 900; margin: 0; color: var(--text-main);">
            🎖️ Награды и трофеи ReadySquad
          </h3>
          <span style="font-size: 0.84rem; color: var(--text-secondary); font-weight: 700;">
            Открыто: 3 из ${BADGES.length}
          </span>
        </div>

        <div class="grid-4">
          ${BADGES.map(b => {
            const unlocked = b.id === 'first_quest' || b.id === 'streak_3' || (b.id === 'kvest_veteran' && level >= 1000);
            return `
              <div style="
                background: ${unlocked ? 'var(--surface2)' : 'var(--surface-container-low)'};
                padding: 16px 12px;
                border-radius: var(--radius-lg);
                text-align: center;
                opacity: ${unlocked ? '1' : '0.45'};
                border: 1px solid ${unlocked ? 'rgba(129, 140, 248, 0.4)' : 'transparent'};
                transition: transform 0.2s ease;
              ">
                <div style="font-size: 2.2rem; margin-bottom: 8px;">${b.icon}</div>
                <div style="font-weight: 800; font-size: 0.88rem; margin-bottom: 4px; color: var(--text-main);">${b.name}</div>
                <div style="font-size: 0.74rem; color: var(--text-secondary); line-height: 1.35;">${b.desc}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 3. БЫСТРОЕ ПЕРЕКЛЮЧЕНИЕ ПРОФИЛЕЙ (ДЛЯ ТЕСТИРОВАНИЯ РОЛЕЙ) -->
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 10px; color: var(--text-main);">
          👥 Переключение аккаунтов (для тестов ролей)
        </h3>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 16px;">
          Переключайтесь между учеником, учителем и разработчиком для проверки интерфейса:
        </p>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" onclick="window.switchTestAccount('yaroslav')">
            🛡️ Ярослав (Разработчик)
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.switchTestAccount('teacher')">
            📚 Учитель (Математика 10Б)
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.switchTestAccount('student_alex')">
            🎓 Ученик (Алексей, СОШ № 29)
          </button>
        </div>
      </div>
    </div>
  `;

  window.switchTestAccount = (login) => {
    sound.click();
    store.loginAs(login);
    renderProfile(container);
    if (window.app && window.app.updateHeader) {
      window.app.updateHeader('profile');
    }
  };
}
