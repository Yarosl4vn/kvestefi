// ==========================================================================
// ИНТЕРАКТИВНЫЙ ТРЕНАЖЁР / КВЕСТ (11 550 ЗАДАНИЙ)
// Соответствие разметке: activity_quiz.xml + item_option.xml (M3 Expressive)
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
      <div class="card" style="text-align: center; padding: 44px 24px; max-width: 600px; margin: 40px auto;">
        <div style="font-size: 3rem; margin-bottom: 12px;">⏳</div>
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">База заданий загружается...</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Инициализация 11 550 вопросов и распаковка архива.</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Обновить страницу</button>
      </div>
    `;
    return;
  }

  let currentIndex = 0;
  let correctCount = 0;
  let pointsEarned = 0;
  let answered = false;

  const optionLetters = ['A', 'B', 'C', 'D'];

  function renderCurrentQuestion() {
    const q = tasks[currentIndex];
    const progress = Math.round(((currentIndex) / tasks.length) * 100);

    container.innerHTML = `
      <div class="quiz-runner">
        <!-- Верхняя панель (Назад, Предмет, Вопрос N из M) -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn btn-secondary btn-sm" onclick="if(confirm('Прервать квест?')) window.location.hash='#home'">
              ✕ Выйти
            </button>
            <span style="font-weight: 800; font-size: 0.98rem; color: var(--text-main);">
              ${subInfo.icon} ${subInfo.name}
            </span>
          </div>

          <span class="badge" style="background: var(--secondary-container); color: var(--on-secondary-container); font-size: 0.82rem; padding: 5px 12px;">
            Вопрос ${currentIndex + 1} из ${tasks.length}
          </span>
        </div>

        <!-- M3 Прогресс-бар -->
        <div class="m3-progress-track" style="margin-bottom: 18px;">
          <div class="m3-progress-fill" style="width: ${progress}%;"></div>
        </div>

        <!-- Карточка вопроса -->
        <div class="quiz-question-card">
          <div class="quiz-q-num">
            Тема: ${q.t || 'Общий раздел'} · ${q.e || 'ОГЭ/ЕГЭ'}
          </div>
          <div class="quiz-q-text">
            ${q.q}
          </div>
        </div>

        <!-- Варианты ответов (1:1 item_option.xml) -->
        <div class="quiz-options" id="quiz-options-box">
          ${q.o.map((opt, idx) => `
            <button class="quiz-option-btn" id="opt-btn-${idx}" onclick="window.selectQuizOption(${idx})">
              <span class="quiz-option-badge">${optionLetters[idx] || (idx + 1)}</span>
              <span style="flex: 1; line-height: 1.4;">${opt}</span>
            </button>
          `).join('')}
        </div>

        <!-- Пояснение решения -->
        <div id="quiz-explanation" style="display: none;"></div>

        <!-- Кнопка Далее -->
        <div style="margin-top: 22px; display: flex; justify-content: flex-end;">
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
          <strong style="color: var(--accent);">💡 Пояснение решения:</strong><br>
          <div style="margin-top: 6px; color: var(--text-main);">${q.x}</div>
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
      <div class="quiz-runner" style="text-align: center; padding-top: 10px;">
        <div class="card" style="padding: 40px 24px;">
          <div style="font-size: 3.8rem; margin-bottom: 12px;">🏆</div>
          <h2 style="font-size: 1.85rem; font-weight: 900; letter-spacing: -0.4px; margin-bottom: 6px; color: var(--text-main);">
            Квест успешно завершён!
          </h2>
          <p style="color: var(--text-secondary); margin-bottom: 28px; font-size: 0.95rem;">
            Отличный результат тренировки по дисциплине «${subInfo.name}».
          </p>

          <div class="grid-3" style="margin-bottom: 28px;">
            <div class="bento-stat-card bento-mint">
              <div class="bento-stat-num">${correctCount} / ${tasks.length}</div>
              <div class="bento-stat-label">верных ответов</div>
            </div>

            <div class="bento-stat-card bento-indigo">
              <div class="bento-stat-num">${percent}%</div>
              <div class="bento-stat-label">точность</div>
            </div>

            <div class="bento-stat-card bento-amber">
              <div class="bento-stat-num">+${pointsEarned}</div>
              <div class="bento-stat-label">начислено XP</div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-lg" onclick="window.location.hash='#home'">
              🏠 Вернуться на главную
            </button>
            <button class="btn btn-secondary btn-lg" onclick="window.location.hash='#quiz?subject=${subjectId}&count=${count}'">
              🔄 Повторить квест
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Запуск первого вопроса
  renderCurrentQuestion();
}
