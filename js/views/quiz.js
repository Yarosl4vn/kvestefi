// ==========================================================================
// ИНТЕРАКТИВНЫЙ ТРЕНАЖЁР / КВЕСТ (11 550 ЗАДАНИЙ)
// ==========================================================================

import { store } from '../store.js';
import { sound } from '../audio.js';
import { SUBJECTS } from '../data.js';

export function renderQuiz(container, params = {}) {
  const subjectId = params.subject || 'math';
  const count = parseInt(params.count || '10', 10);
  const subInfo = SUBJECTS.find(s => s.id === subjectId) || SUBJECTS[0];

  const tasks = store.getRandomTasks(subjectId, count);

  if (!tasks || tasks.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px;">
        <h2>⚠️ Задания загружаются...</h2>
        <p style="color: var(--text-secondary); margin: 12px 0 20px 0;">База вопросов инициализируется, подождите секунду.</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Обновить страницу</button>
      </div>
    `;
    return;
  }

  let currentIndex = 0;
  let correctCount = 0;
  let pointsEarned = 0;
  let answered = false;

  function renderCurrentQuestion() {
    const q = tasks[currentIndex];
    const progress = Math.round(((currentIndex) / tasks.length) * 100);

    container.innerHTML = `
      <div class="quiz-runner">
        <!-- Верхняя плашка -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="if(confirm('Прервать квест?')) window.location.hash='#home'">✕ Выйти</button>
            <span style="font-weight: 700; font-size: 0.95rem;">${subInfo.icon} ${subInfo.name}</span>
          </div>
          <div style="font-weight: 800; color: var(--primary);">
            Вопрос ${currentIndex + 1} из ${tasks.length}
          </div>
        </div>

        <!-- Прогресс бар -->
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${progress}%;"></div>
        </div>

        <!-- Карточка вопроса -->
        <div class="quiz-question-card">
          <div class="quiz-q-num">Тема: ${q.t || 'Общий раздел'} · ${q.e || 'ОГЭ/ЕГЭ'}</div>
          <div class="quiz-q-text">${q.q}</div>
        </div>

        <!-- Варианты ответов -->
        <div class="quiz-options" id="quiz-options-box">
          ${q.o.map((opt, idx) => `
            <button class="quiz-option-btn" id="opt-btn-${idx}" onclick="window.selectQuizOption(${idx})">
              <span class="quiz-option-key">${idx + 1}</span>
              <span style="flex: 1;">${opt}</span>
            </button>
          `).join('')}
        </div>

        <!-- Пояснение решения -->
        <div id="quiz-explanation" style="display: none;"></div>

        <!-- Кнопка Далее -->
        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <button id="quiz-next-btn" class="btn btn-primary btn-lg" style="display: none;" onclick="window.nextQuizQuestion()">
            ${currentIndex + 1 === tasks.length ? '🏁 Завершить квест' : 'Следующий вопрос →'}
          </button>
        </div>
      </div>
    `;

    answered = false;
  }

  window.selectQuizOption = (selectedIndex) => {
    if (answered) return;
    answered = true;

    const q = tasks[currentIndex];
    const isCorrect = selectedIndex === q.c;

    const selectedBtn = document.getElementById(`opt-btn-${selectedIndex}`);
    const correctBtn = document.getElementById(`opt-btn-${q.c}`);
    const nextBtn = document.getElementById(`quiz-next-btn`);
    const explBox = document.getElementById(`quiz-explanation`);

    // Отключить все кнопки
    for (let i = 0; i < q.o.length; i++) {
      const b = document.getElementById(`opt-btn-${i}`);
      if (b) b.disabled = true;
    }

    if (isCorrect) {
      selectedBtn.classList.add('correct');
      sound.correct();
      sound.vibrate(20);
      correctCount++;
      pointsEarned += 25;
    } else {
      selectedBtn.classList.add('wrong');
      if (correctBtn) correctBtn.classList.add('correct');
      sound.error();
      sound.vibrate([40, 40, 40]);
      pointsEarned += 5;
    }

    // Пояснение
    if (q.x) {
      explBox.innerHTML = `
        <div class="quiz-explanation-box">
          <strong>💡 Пояснение решения:</strong><br>${q.x}
        </div>
      `;
      explBox.style.display = 'block';
    }

    if (nextBtn) nextBtn.style.display = 'inline-flex';
  };

  window.nextQuizQuestion = () => {
    sound.click();
    currentIndex++;
    if (currentIndex < tasks.length) {
      renderCurrentQuestion();
    } else {
      renderCompletionScreen();
    }
  };

  function renderCompletionScreen() {
    sound.fanfare();
    const result = store.addScore(pointsEarned);
    const percent = Math.round((correctCount / tasks.length) * 100);

    container.innerHTML = `
      <div class="quiz-runner" style="text-align: center; padding-top: 20px;">
        <div class="card" style="padding: 36px 24px;">
          <div style="font-size: 3.5rem; margin-bottom: 12px;">🏆</div>
          <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 6px;">Квест успешно завершён!</h2>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">
            Отличный результат тренировки по предмету «${subInfo.name}».
          </p>

          <div class="grid-3" style="margin-bottom: 24px;">
            <div style="background: var(--surface-variant); padding: 16px; border-radius: var(--radius-md);">
              <div style="font-size: 1.6rem; font-weight: 800; color: #10B981;">${correctCount} / ${tasks.length}</div>
              <div style="font-size: 0.8rem; color: var(--text-dim); font-weight: 600;">Правильных ответов</div>
            </div>
            <div style="background: var(--surface-variant); padding: 16px; border-radius: var(--radius-md);">
              <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary);">${percent}%</div>
              <div style="font-size: 0.8rem; color: var(--text-dim); font-weight: 600;">Точность решений</div>
            </div>
            <div style="background: var(--surface-variant); padding: 16px; border-radius: var(--radius-md);">
              <div style="font-size: 1.6rem; font-weight: 800; color: #F59E0B;">+${pointsEarned}</div>
              <div style="font-size: 0.8rem; color: var(--text-dim); font-weight: 600;">Очков опыта (XP)</div>
            </div>
          </div>

          ${result && result.leveledUp ? `
            <div style="background: rgba(99, 102, 241, 0.2); border: 1px solid var(--primary); padding: 14px; border-radius: var(--radius-md); margin-bottom: 24px; color: #A5B4FC; font-weight: 700;">
              🎉 ПОЗДРАВЛЯЕМ! Вы достигли нового УРОВНЯ ${result.newLevel}!
            </div>
          ` : ''}

          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-lg" onclick="window.location.hash='#quiz?subject=${subjectId}&count=${count}'">
              🔄 Решить ещё раз
            </button>
            <button class="btn btn-secondary btn-lg" onclick="window.location.hash='#home'">
              🏠 На главную
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Горячие клавиши 1, 2, 3, 4 для клавиатуры на ПК
  const keyHandler = (e) => {
    if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      window.selectQuizOption(idx);
    } else if (e.key === 'Enter') {
      const nextBtn = document.getElementById('quiz-next-btn');
      if (nextBtn && nextBtn.style.display !== 'none') {
        window.nextQuizQuestion();
      }
    }
  };

  window.removeEventListener('keydown', window._quizKeyHandler);
  window._quizKeyHandler = keyHandler;
  window.addEventListener('keydown', keyHandler);

  renderCurrentQuestion();
}
