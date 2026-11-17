// ==========================================================================
// ДРУЖЕСКИЕ ЗАБЕГИ (ДУЭЛИ 1 НА 1)
// ==========================================================================

import { store } from '../store.js';
import { sound } from '../audio.js';
import { SUBJECTS } from '../data.js';

export function renderDuels(container) {
  let duelActive = false;
  let currentQ = 0;
  let myScore = 0;
  let botScore = 0;
  let timerInterval = null;
  let timeLeft = 20;

  const user = store.currentUser;
  if (!user) {
    window.location.hash = '#auth';
    return;
  }

  container.innerHTML = `
    <div id="duel-setup-screen">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 6px;">⚔️ Дружеские забеги (1 на 1)</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          Бросьте вызов одноклассникам или сразитесь в интеллектуальном поединке с системой!
        </p>
      </div>

      <div class="card" style="max-width: 600px; margin: 0 auto; padding: 28px;">
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 18px; text-align: center;">Параметры дуэли</h3>

        <div class="form-group">
          <label class="form-label">Предмет поединка:</label>
          <select id="duel-subject-select" class="input">
            ${SUBJECTS.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Количество вопросов:</label>
          <select id="duel-count-select" class="input">
            <option value="5">5 быстрых вопросов (блиц)</option>
            <option value="10" selected>10 вопросов (стандартный забег)</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Соперник:</label>
          <select id="duel-opponent-select" class="input">
            <option value="bot_smart">🤖 Интеллект Квестефи (Продвинутый)</option>
            <option value="bot_speed">⚡ Скоростной бот (Быстрые ответы)</option>
            <option value="classmate">🎓 Вызов однокласснику по ссылке</option>
          </select>
        </div>

        <button class="btn btn-primary btn-lg btn-block" style="margin-top: 18px;" onclick="window.startDuel()">
          🔥 НАЧАТЬ ЗАБЕГ
        </button>
      </div>
    </div>

    <div id="duel-arena-screen" style="display: none;">
      <!-- Игровая арена дуэли -->
      <div style="max-width: 780px; margin: 0 auto;">
        <!-- Табло счёта -->
        <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, rgba(30, 27, 75, 0.9), rgba(15, 23, 42, 0.95));">
          <div style="display: flex; justify-content: space-around; align-items: center;">
            <div style="text-align: center;">
              <div style="font-size: 2rem;">${user.avatar || '🛡️'}</div>
              <div style="font-weight: 800; font-size: 1.05rem;">${user.display_name}</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #10B981;" id="duel-my-score">0</div>
            </div>

            <div style="text-align: center;">
              <div style="font-size: 1.2rem; font-weight: 800; color: #F59E0B;" id="duel-timer">⏱️ 20s</div>
              <div style="font-size: 0.8rem; color: var(--text-dim); font-weight: 700;">VS</div>
            </div>

            <div style="text-align: center;">
              <div style="font-size: 2rem;">🤖</div>
              <div style="font-weight: 800; font-size: 1.05rem;">Бот Квестефи</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #EF4444;" id="duel-bot-score">0</div>
            </div>
          </div>
        </div>

        <!-- Вопрос дуэли -->
        <div id="duel-question-container"></div>
      </div>
    </div>
  `;

  window.startDuel = () => {
    sound.click();
    const subId = document.getElementById('duel-subject-select').value;
    const count = parseInt(document.getElementById('duel-count-select').value, 10);
    const tasks = store.getRandomTasks(subId, count);

    if (!tasks || tasks.length === 0) {
      alert('Не удалось загрузить задания для дуэли');
      return;
    }

    duelActive = true;
    currentQ = 0;
    myScore = 0;
    botScore = 0;

    document.getElementById('duel-setup-screen').style.display = 'none';
    document.getElementById('duel-arena-screen').style.display = 'block';

    runDuelQuestion(tasks);
  };

  function runDuelQuestion(tasks) {
    if (currentQ >= tasks.length) {
      finishDuel();
      return;
    }

    const q = tasks[currentQ];
    timeLeft = 20;
    document.getElementById('duel-timer').innerText = `⏱️ ${timeLeft}s`;
    document.getElementById('duel-my-score').innerText = myScore;
    document.getElementById('duel-bot-score').innerText = botScore;

    const qBox = document.getElementById('duel-question-container');
    qBox.innerHTML = `
      <div class="quiz-question-card">
        <div class="quiz-q-num">Раунд ${currentQ + 1} из ${tasks.length}</div>
        <div class="quiz-q-text">${q.q}</div>
      </div>

      <div class="quiz-options">
        ${q.o.map((opt, idx) => `
          <button class="quiz-option-btn" id="duel-opt-${idx}" onclick="window.pickDuelOption(${idx})">
            <span class="quiz-option-key">${idx + 1}</span>
            <span style="flex: 1;">${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      const tEl = document.getElementById('duel-timer');
      if (tEl) tEl.innerText = `⏱️ ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        window.pickDuelOption(-1); // таймаут
      }
    }, 1000);

    // Логика бота
    const botWillBeCorrect = Math.random() < 0.75;
    const botDelay = Math.floor(Math.random() * 6000) + 3000;
    setTimeout(() => {
      if (duelActive) {
        if (botWillBeCorrect) {
          botScore += 10;
          const bEl = document.getElementById('duel-bot-score');
          if (bEl) bEl.innerText = botScore;
        }
      }
    }, botDelay);

    window.pickDuelOption = (idx) => {
      clearInterval(timerInterval);
      for (let i = 0; i < q.o.length; i++) {
        const b = document.getElementById(`duel-opt-${i}`);
        if (b) b.disabled = true;
      }

      if (idx === q.c) {
        const b = document.getElementById(`duel-opt-${idx}`);
        if (b) b.classList.add('correct');
        sound.correct();
        myScore += Math.max(timeLeft, 5);
      } else if (idx >= 0) {
        const b = document.getElementById(`duel-opt-${idx}`);
        if (b) b.classList.add('wrong');
        const correctB = document.getElementById(`duel-opt-${q.c}`);
        if (correctB) correctB.classList.add('correct');
        sound.error();
      }

      document.getElementById('duel-my-score').innerText = myScore;

      setTimeout(() => {
        currentQ++;
        runDuelQuestion(tasks);
      }, 1500);
    };
  }

  function finishDuel() {
    clearInterval(timerInterval);
    duelActive = false;

    const won = myScore > botScore;
    if (won) {
      sound.fanfare();
      store.addScore(100);
    }

    container.innerHTML = `
      <div class="card" style="max-width: 600px; margin: 40px auto; text-align: center; padding: 36px 24px;">
        <div style="font-size: 3.5rem; margin-bottom: 10px;">${won ? '🥇' : '🤝'}</div>
        <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 6px;">
          ${won ? 'БЛЕСТЯЩАЯ ПОБЕДА В ЗАБЕГЕ!' : 'НИЧЬЯ / ДОСТОЙНЫЙ БОЙ!'}
        </h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">
          Итоговый счёт забега: Вы — <strong style="color: #10B981;">${myScore}</strong>, Соперник — <strong style="color: #EF4444;">${botScore}</strong>.
        </p>

        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-primary btn-lg" onclick="window.location.reload()">
            🔄 Играть снова
          </button>
          <button class="btn btn-secondary btn-lg" onclick="window.location.hash='#home'">
            🏠 На главную
          </button>
        </div>
      </div>
    `;
  }
}
