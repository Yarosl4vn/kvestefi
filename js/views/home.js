// ==========================================================================
// ГЛАВНЫЙ ЭКРАН (DASHBOARD)
// Соответствие разметке Android: fragment_home.xml + Material 3 Expressive
// ==========================================================================

import { store } from '../store.js';
import { LEVELING, SUBJECTS, COMPETITIONS } from '../data.js';

export function renderHome(container) {
  const user = store.currentUser;
  if (!user) {
    window.location.hash = '#auth';
    return;
  }
  const level = LEVELING.level(user.score);
  const title = LEVELING.title(level);
  const curScore = LEVELING.startScore(level);
  const nextScore = LEVELING.nextScore(level);
  const progressPercent = Math.min(Math.round(((user.score - curScore) / Math.max(nextScore - curScore, 1)) * 100), 100);

  // Дни недели для трекера темпа
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const todayIdx = (new Date().getDay() + 6) % 7; // 0 = Пн, 6 = Вс

  container.innerHTML = `
    <!-- 1. EDITORIAL TOP BAR (Scalloped Avatar Halo + Quick Actions) -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div class="m3-cookie-box" style="width: 56px; height: 56px;">
          <svg class="m3-cookie-svg" viewBox="0 0 48 48">
            <use href="#cookie-10" fill="#2D326B" />
          </svg>
          <div class="m3-cookie-inner" style="width: 44px; height: 44px; border-radius: var(--radius-full); background: var(--surface); font-size: 1.45rem; box-shadow: var(--elevation-1);">
            ${user.avatar || '🛡️'}
          </div>
        </div>

        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h2 style="font-size: 1.45rem; font-weight: 900; letter-spacing: -0.4px; margin: 0; color: var(--text-main);">
              Привет, ${user.display_name}!
            </h2>
            <span class="badge ${user.role === 'developer' ? 'badge-dev' : 'badge-student'}">
              ${user.prefix || 'Ученик'}
            </span>
          </div>
          <div style="font-size: 0.86rem; color: var(--text-secondary); margin-top: 3px;">
            ${user.school_name || 'МБОУ СОШ № 29 г. Мытищи'} · Готов начать первый квест?
          </div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 10px;">
        <button class="btn btn-secondary btn-sm" onclick="window.location.hash='#settings'" title="Настройки" style="width: 42px; height: 42px; padding: 0; border-radius: 14px;">
          ⚙️
        </button>
      </div>
    </div>

    <!-- 2. HERO GRADIENT CTA CARD (bg_hero_expressive) -->
    <div class="hero-cta-card" onclick="window.location.hash='#quiz?subject=math&count=5'" style="margin-bottom: 16px;">
      <!-- Фоновый декоративный медальон -->
      <svg class="hero-bg-cookie" viewBox="0 0 48 48">
        <use href="#cookie-8" fill="#FFFFFF" />
      </svg>

      <div style="display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2;">
        <div style="max-width: 80%;">
          <div class="m3-chip-dark" style="margin-bottom: 10px;">
            ТРЕНИРОВКА СЕЙЧАС
          </div>
          <h3 style="font-size: 1.55rem; font-weight: 900; letter-spacing: -0.4px; margin: 0 0 4px 0; color: #FFFFFF;">
            Начать первый квест
          </h3>
          <p style="font-size: 0.90rem; color: #E0E7FF; margin: 0;">
            Математика · 5 задач ОГЭ/ЕГЭ, ~4 минуты
          </p>
        </div>

        <button class="btn-fab" title="Начать" aria-label="Начать">
          ➔
        </button>
      </div>
    </div>

    <!-- 3. 3-COLUMN COLOR-BLOCKED BENTO METRICS (bg_bento_indigo, mint, amber) -->
    <div class="grid-3" style="margin-bottom: 16px;">
      <div class="bento-stat-card bento-indigo">
        <div class="bento-stat-num">${user.solvedCount || 0}</div>
        <div class="bento-stat-label">квестов</div>
      </div>

      <div class="bento-stat-card bento-mint">
        <div class="bento-stat-num">${user.accuracy || 100}%</div>
        <div class="bento-stat-label">точность</div>
      </div>

      <div class="bento-stat-card bento-amber">
        <div class="bento-stat-num">${user.streak || 1} дн</div>
        <div class="bento-stat-label">дней темпа</div>
      </div>
    </div>

    <!-- 4. ASYMMETRIC BENTO SPLIT: LEVEL + DAILY GOAL -->
    <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 14px; margin-bottom: 16px;" class="level-goal-split">
      <!-- Карточка Уровня -->
      <div class="card card-clickable" onclick="window.location.hash='#profile'" style="padding: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 1.05rem; font-weight: 900; color: var(--text-main);">
            Уровень ${level} · <span style="color: var(--primary);">${title}</span>
          </span>
          <span class="badge" style="background: var(--secondary-container); color: var(--on-secondary-container);">
            ${user.score} XP
          </span>
        </div>

        <div class="m3-progress-track" style="margin: 12px 0 8px 0;">
          <div class="m3-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-secondary); font-weight: 600;">
          <span>До ур. ${level + 1} — ${Math.max(nextScore - user.score, 0)} очков</span>
          <span>${progressPercent}%</span>
        </div>
      </div>

      <!-- Карточка Цели дня -->
      <div class="card" style="padding: 18px;">
        <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary);">
          Цель дня
        </div>
        <div style="font-size: 1.45rem; font-weight: 900; color: var(--success); margin: 4px 0 8px 0;">
          ${Math.min(user.solvedCount || 0, 30)} из 30
        </div>
        <div class="m3-progress-track">
          <div class="m3-progress-fill m3-progress-mint" style="width: ${Math.min(Math.round(((user.solvedCount || 0) / 30) * 100), 100)}%;"></div>
        </div>
      </div>
    </div>

    <!-- 5. 7-DAY STREAK CARD WITH COOKIE HALO -->
    <div class="card" style="padding: 20px; margin-bottom: 22px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div class="m3-cookie-box" style="width: 48px; height: 48px;">
            <svg class="m3-cookie-svg" viewBox="0 0 48 48">
              <use href="#cookie-9" fill="#3B2416" />
            </svg>
            <div class="m3-cookie-inner" style="font-size: 1.4rem;">
              🔥
            </div>
          </div>

          <div>
            <div style="font-size: 1.12rem; font-weight: 900; color: var(--text-main);">
              Серия: ${user.streak || 1} дней подряд
            </div>
            <div style="font-size: 0.84rem; color: var(--text-secondary);">
              Решите любой квест сегодня, чтобы закрепить ударный темп
            </div>
          </div>
        </div>

        <span class="badge" style="background: var(--bento-amber-bg); color: var(--bento-amber-text); border: 1px solid rgba(251, 191, 36, 0.3);">
          рекорд ${user.bestStreak || user.streak || 1}
        </span>
      </div>

      <!-- 7-дневный трекер недели -->
      <div style="display: flex; justify-content: space-between; gap: 8px;">
        ${daysOfWeek.map((day, idx) => {
          const isPassed = idx <= todayIdx;
          const isToday = idx === todayIdx;
          return `
            <div style="
              flex: 1;
              padding: 10px 4px;
              text-align: center;
              border-radius: 14px;
              background: ${isToday ? 'var(--bento-amber-bg)' : isPassed ? 'var(--surface2)' : 'var(--surface-container-low)'};
              border: 1px solid ${isToday ? 'rgba(251, 191, 36, 0.4)' : 'transparent'};
            ">
              <div style="font-size: 0.72rem; font-weight: 800; color: ${isToday ? 'var(--bento-amber-text)' : 'var(--text-dim)'}; margin-bottom: 4px;">
                ${day}
              </div>
              <div style="font-size: 1.1rem;">
                ${isPassed ? '🔥' : '⚪'}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- 6. РАЗДЕЛ: ШКОЛЬНЫЕ ПРЕДМЕТЫ (item_subject.xml) -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
      <h3 style="font-size: 1.25rem; font-weight: 900; letter-spacing: -0.3px; margin: 0; color: var(--text-main);">
        📚 Школьные дисциплины
      </h3>
      <a href="#subjects" style="color: var(--primary); font-size: 0.88rem; font-weight: 800; text-decoration: none;">
        Все 11 предметов →
      </a>
    </div>

    <div class="grid-3" style="margin-bottom: 24px;">
      ${SUBJECTS.slice(0, 6).map(sub => `
        <div class="card card-clickable" style="padding: 18px; background: #1D234A; border-color: #2D366E;" onclick="window.location.hash='#quiz?subject=${sub.id}&count=10'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div class="m3-cookie-box" style="width: 44px; height: 44px;">
              <svg class="m3-cookie-svg" viewBox="0 0 48 48">
                <use href="#cookie-10" fill="#2D366E" />
              </svg>
              <div class="m3-cookie-inner" style="font-size: 1.25rem;">
                ${sub.icon}
              </div>
            </div>

            <button class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size: 0.76rem; background: rgba(255,255,255,0.12); color: #FFFFFF;" onclick="event.stopPropagation(); window.location.hash='#quiz?subject=${sub.id}&count=5'">
              Трен.
            </button>
          </div>

          <div style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF; margin-bottom: 3px;">
            ${sub.name}
          </div>
          <div style="font-size: 0.78rem; color: #A5B4FC; margin-bottom: 10px;">
            1 050 заданий · ОГЭ / ЕГЭ
          </div>

          <div class="m3-progress-track" style="height: 6px; background: rgba(255,255,255,0.15);">
            <div class="m3-progress-fill" style="width: 25%; background: #818CF8;"></div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- 7. РАЗДЕЛ: МЕЖШКОЛЬНЫЕ СОРЕВНОВАНИЯ Г. МЫТИЩИ -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
      <h3 style="font-size: 1.25rem; font-weight: 900; letter-spacing: -0.3px; margin: 0; color: var(--text-main);">
        🏛️ Межшкольные соревнования г. Мытищи
      </h3>
      <a href="#competitions" style="color: var(--primary); font-size: 0.88rem; font-weight: 800; text-decoration: none;">
        Смотреть все (10) →
      </a>
    </div>

    <div class="grid-2" style="margin-bottom: 24px;">
      ${COMPETITIONS.slice(0, 2).map(comp => `
        <div class="card card-clickable" onclick="window.location.hash='#competitions?id=${comp.id}'" style="padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <span style="font-size: 2.2rem;">${comp.badge}</span>
            <span class="badge badge-dev">Тур 1 и 2 открыты</span>
          </div>

          <h4 class="card-title">${comp.title}</h4>
          <p class="card-subtitle" style="margin-bottom: 14px;">${comp.desc}</p>

          <div style="font-size: 0.84rem; color: var(--warning); font-weight: 800; margin-bottom: 14px;">
            🎁 Главный приз: ${comp.prizeGold}
          </div>

          <button class="btn btn-secondary btn-sm btn-block">
            Участвовать в турнире
          </button>
        </div>
      `).join('')}
    </div>
  `;
}
