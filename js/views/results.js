// ==========================================================================
// РЕЗУЛЬТАТЫ, АНАЛИТИКА И ИСТОРИЯ КВЕСТОВ
// 1:1 Соответствие: ResultsFragment.kt + fragment_results.xml
// ==========================================================================

import { store } from '../store.js';
import { LEVELING } from '../data.js';

export function renderResults(container) {
  const user = store.currentUser;
  if (!user) {
    window.location.hash = '#auth';
    return;
  }
  const level = LEVELING.level(user.score);

  // Мок-история последних попыток (1:1 HistoryAdapter.kt)
  const attempts = [
    { id: 1, subject: "Математика (ОГЭ)", date: "Сегодня, 10:24", score: 100, max: 100, accuracy: 100, grade: 5, icon: "📐" },
    { id: 2, subject: "Информатика", date: "Вчера, 18:40", score: 90, max: 100, accuracy: 90, grade: 5, icon: "💻" },
    { id: 3, subject: "Русский язык", date: "15 ноября, 14:15", score: 85, max: 100, accuracy: 85, grade: 4, icon: "✍️" },
    { id: 4, subject: "Физика", date: "14 ноября, 17:30", score: 80, max: 100, accuracy: 80, grade: 4, icon: "⚡" },
    { id: 5, subject: "Обществознание", date: "13 ноября, 16:10", score: 95, max: 100, accuracy: 95, grade: 5, icon: "⚖️" }
  ];

  container.innerHTML = `
    <div style="max-width: 860px; margin: 0 auto;">
      <!-- Заголовок страницы -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 1.7rem; font-weight: 900; letter-spacing: -0.4px; margin-bottom: 4px; color: var(--text-main);">
          Результаты и аналитика
        </h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          История квестов, динамика точности и разбор экзаменационных оценок.
        </p>
      </div>

      <!-- 3 мини-бенто плашки (1:1 miniScore, miniBest, miniAccuracy) -->
      <div class="grid-3" style="margin-bottom: 20px;">
        <div class="bento-stat-card bento-indigo">
          <div class="bento-stat-num">${user.score}</div>
          <div class="bento-stat-label">всего XP</div>
        </div>

        <div class="bento-stat-card bento-mint">
          <div class="bento-stat-num">${user.accuracy || 94}%</div>
          <div class="bento-stat-label">средняя точность</div>
        </div>

        <div class="bento-stat-card bento-amber">
          <div class="bento-stat-num">5 из 5</div>
          <div class="bento-stat-label">прогноз оценки</div>
        </div>
      </div>

      <!-- График динамики прогресса (ScoreChartView) -->
      <div class="card" style="padding: 24px; margin-bottom: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 900; color: var(--text-main); margin: 0;">
              Динамика точности (последние 7 дней)
            </h3>
            <span style="font-size: 0.82rem; color: var(--text-secondary);">Точность ответов на тренировках</span>
          </div>

          <span class="badge" style="background: rgba(52, 211, 153, 0.2); color: #34D399; font-weight: 800;">
            📈 Уверенный рост +12%
          </span>
        </div>

        <!-- SVG График точности -->
        <div style="width: 100%; height: 160px; margin-top: 10px;">
          <svg viewBox="0 0 500 160" style="width: 100%; height: 100%; overflow: visible;">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#818CF8" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#818CF8" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <!-- Сетка -->
            <line x1="0" y1="40" x2="500" y2="40" stroke="var(--border)" stroke-dasharray="4 4" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="var(--border)" stroke-dasharray="4 4" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="var(--border)" stroke-dasharray="4 4" />

            <!-- Область под графиком -->
            <polygon points="0,150 0,110 80,95 160,105 240,75 320,60 400,50 500,35 500,150" fill="url(#chartGradient)" />

            <!-- Линия графика -->
            <polyline fill="none" stroke="#818CF8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"
              points="0,110 80,95 160,105 240,75 320,60 400,50 500,35" />

            <!-- Точки на графике -->
            <circle cx="80" cy="95" r="5" fill="#818CF8" stroke="var(--surface)" stroke-width="2" />
            <circle cx="160" cy="105" r="5" fill="#818CF8" stroke="var(--surface)" stroke-width="2" />
            <circle cx="240" cy="75" r="5" fill="#818CF8" stroke="var(--surface)" stroke-width="2" />
            <circle cx="320" cy="60" r="5" fill="#818CF8" stroke="var(--surface)" stroke-width="2" />
            <circle cx="400" cy="50" r="5" fill="#818CF8" stroke="var(--surface)" stroke-width="2" />
            <circle cx="500" cy="35" r="6" fill="#34D399" stroke="var(--surface)" stroke-width="2" />
          </svg>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-dim); margin-top: 8px;">
          <span>Пн</span>
          <span>Вт</span>
          <span>Ср</span>
          <span>Чт</span>
          <span>Пт</span>
          <span>Сб</span>
          <span>Вс (Сегодня 100%)</span>
        </div>
      </div>

      <!-- История квестов (1:1 HistoryAdapter) -->
      <div class="card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 1.2rem; font-weight: 900; color: var(--text-main); margin: 0;">
            История попыток и тренировок
          </h3>
          <span style="font-size: 0.84rem; color: var(--text-secondary); font-weight: 700;">
            Всего: ${user.solvedCount || 142} решено
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${attempts.map(att => `
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 14px 18px;
              background: var(--surface2);
              border-radius: var(--radius-lg);
              border: 1px solid var(--border);
              transition: transform 0.2s ease;
            ">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="font-size: 1.8rem;">${att.icon}</div>
                <div>
                  <div style="font-weight: 800; font-size: 1rem; color: var(--text-main);">
                    ${att.subject}
                  </div>
                  <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                    ${att.date} · 5 из 5 задач
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="text-align: right;">
                  <div style="font-weight: 900; font-size: 1.05rem; color: var(--primary);">
                    ${att.accuracy}%
                  </div>
                  <div style="font-size: 0.76rem; color: var(--text-dim);">точность</div>
                </div>

                <div class="quiz-option-badge" style="background: var(--primary-container); color: var(--on-primary-container); width: 38px; height: 38px; font-size: 1.1rem;">
                  ${att.grade}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
