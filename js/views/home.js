// ==========================================================================
// ГЛАВНЫЙ ЭКРАН (DASHBOARD)
// ==========================================================================

import { store } from '../store.js';
import { LEVELING, SUBJECTS, COMPETITIONS } from '../data.js';

export function renderHome(container) {
  const user = store.currentUser;
  const level = LEVELING.level(user.score);
  const title = LEVELING.title(level);
  const curScore = LEVELING.startScore(level);
  const nextScore = LEVELING.nextScore(level);
  const progressPercent = Math.min(Math.round(((user.score - curScore) / Math.max(nextScore - curScore, 1)) * 100), 100);

  container.innerHTML = `
    <!-- Приветственный баннер -->
    <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(49, 46, 129, 0.7) 0%, rgba(19, 27, 46, 0.95) 100%); border-color: rgba(99, 102, 241, 0.4);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="font-size: 1.8rem;">${user.avatar || '🛡️'}</span>
            <div>
              <h2 style="font-size: 1.4rem; font-weight: 800; margin: 0;">Привет, ${user.display_name}!</h2>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
                <span class="badge ${user.role === 'developer' ? 'badge-dev' : 'badge-student'}">${user.prefix || 'Ученик'}</span>
                <span style="font-size: 0.8rem; color: var(--text-dim);">${user.school_name || 'г. Мытищи'}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-primary" onclick="window.location.hash='#quiz?subject=math&count=10'">
            ⚡ Начать квест дня
          </button>
          <button class="btn btn-secondary" onclick="window.location.hash='#duels'">
            ⚔️ Дружеский забег
          </button>
        </div>
      </div>

      <!-- Прогресс уровня -->
      <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--border);">
        <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 8px;">
          <span>⭐ Уровень ${level} · <span style="color: var(--primary);">${title}</span></span>
          <span style="color: var(--text-secondary);">${user.score} / ${nextScore} очков</span>
        </div>
        <div class="quiz-progress-bar" style="margin: 0; height: 10px;">
          <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>
    </div>

    <!-- Быстрая статистика -->
    <div class="grid-4" style="margin-bottom: 24px;">
      <div class="card" style="padding: 16px; text-align: center;">
        <div style="font-size: 1.5rem; margin-bottom: 4px;">🔥</div>
        <div style="font-size: 1.3rem; font-weight: 800; color: #F59E0B;">${user.streak || 1} дней</div>
        <div style="font-size: 0.75rem; color: var(--text-dim); font-weight: 600;">Ударный темп</div>
      </div>
      <div class="card" style="padding: 16px; text-align: center;">
        <div style="font-size: 1.5rem; margin-bottom: 4px;">🎯</div>
        <div style="font-size: 1.3rem; font-weight: 800; color: #10B981;">${user.solvedCount || 0}</div>
        <div style="font-size: 0.75rem; color: var(--text-dim); font-weight: 600;">Решено заданий</div>
      </div>
      <div class="card" style="padding: 16px; text-align: center;">
        <div style="font-size: 1.5rem; margin-bottom: 4px;">🏆</div>
        <div style="font-size: 1.3rem; font-weight: 800; color: #6366F1;">Топ-3</div>
        <div style="font-size: 0.75rem; color: var(--text-dim); font-weight: 600;">В своей школе</div>
      </div>
      <div class="card" style="padding: 16px; text-align: center;">
        <div style="font-size: 1.5rem; margin-bottom: 4px;">📚</div>
        <div style="font-size: 1.3rem; font-weight: 800; color: #06B6D4;">11 550</div>
        <div style="font-size: 0.75rem; color: var(--text-dim); font-weight: 600;">Банк вопросов</div>
      </div>
    </div>

    <!-- Раздел: Межшкольные соревнования г. Мытищи -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
      <h3 style="font-size: 1.2rem; font-weight: 800;">🏛️ Межшкольные соревнования г. Мытищи</h3>
      <a href="#competitions" style="color: var(--primary); font-size: 0.85rem; font-weight: 700; text-decoration: none;">Смотреть все (10) →</a>
    </div>

    <div class="grid-2" style="margin-bottom: 28px;">
      ${COMPETITIONS.slice(0, 2).map(comp => `
        <div class="card card-clickable" onclick="window.location.hash='#competitions?id=${comp.id}'">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <span style="font-size: 2rem;">${comp.badge}</span>
            <span class="badge badge-dev">Тур 1 и 2 открыты</span>
          </div>
          <h4 class="card-title">${comp.title}</h4>
          <p class="card-subtitle" style="margin-bottom: 14px;">${comp.desc}</p>
          <div style="font-size: 0.82rem; color: #F59E0B; font-weight: 700; margin-bottom: 12px;">
            🎁 Главный приз: ${comp.prizeGold}
          </div>
          <button class="btn btn-secondary btn-sm btn-block">Участвовать в турнире</button>
        </div>
      `).join('')}
    </div>

    <!-- Раздел: Школьные дисциплины -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
      <h3 style="font-size: 1.2rem; font-weight: 800;">📖 Подготовка к ОГЭ и ЕГЭ по предметам</h3>
      <a href="#subjects" style="color: var(--primary); font-size: 0.85rem; font-weight: 700; text-decoration: none;">Все 11 предметов →</a>
    </div>

    <div class="grid-4" style="margin-bottom: 24px;">
      ${SUBJECTS.slice(0, 8).map(sub => `
        <div class="card card-clickable" style="padding: 16px; text-align: center;" onclick="window.location.hash='#quiz?subject=${sub.id}&count=10'">
          <div style="font-size: 2rem; margin-bottom: 8px;">${sub.icon}</div>
          <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 4px;">${sub.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">1 050 заданий</div>
        </div>
      `).join('')}
    </div>
  `;
}
