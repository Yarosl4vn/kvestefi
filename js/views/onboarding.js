// ==========================================================================
// НАЧАЛЬНЫЙ ЭКРАН / МАСТЕР ОНБОРДИНГА
// 1:1 Соответствие: OnboardingActivity.kt + activity_onboarding.xml
// ==========================================================================

import { store } from '../store.js';
import { sound } from '../audio.js';
import { SUBJECTS } from '../data.js';

export function renderOnboarding(container) {
  let currentStep = 1;
  const totalSteps = 4;

  const draft = {
    name: 'Ярослав',
    gender: 'male',
    avatar: '🛡️',
    exam: 'ОГЭ',
    grade: '9',
    subjects: ['math', 'inf', 'rus'],
    weakTopics: ['Уравнения и неравенства', 'Алгоритмы и логика', 'Синтаксис и пунктуация'],
    goal: 15,
    theme: 'dark',
    sound: true
  };

  const avatarsList = ['🛡️', '🚀', '🎓', '🦁', '⚡', '🎯', '🏆', '🧠', '🦊', '🦉', '🌟', '🔬', '👑', '🐱', '🐶', '🐉'];

  function renderStep() {
    container.innerHTML = `
      <div style="max-width: 680px; margin: 0 auto; padding-top: 10px;">
        <!-- Фирменный Hero-баннер онбординга -->
        <div class="hero-cta-card" style="margin-bottom: 22px; cursor: default;">
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
              <div style="font-size: 0.90rem; color: #E0E7FF; margin-top: 2px;">
                Учимся к ОГЭ и ЕГЭ играя · Платформа ReadySquad г. Мытищи
              </div>
            </div>
          </div>
        </div>

        <!-- Контейнер текущего шага -->
        <div class="card" style="padding: 28px; margin-bottom: 20px;">
          ${renderStepContent(currentStep)}
        </div>

        <!-- Точки-индикаторы (Dots) -->
        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 18px;">
          ${[1, 2, 3, 4].map(s => `
            <div style="
              width: ${s === currentStep ? '28px' : '9px'};
              height: 9px;
              border-radius: var(--radius-full);
              background: ${s === currentStep ? 'var(--primary)' : 'var(--surface2)'};
              transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
            "></div>
          `).join('')}
        </div>

        <!-- Нижние кнопки действий -->
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          ${currentStep > 1 ? `
            <button class="btn btn-secondary btn-lg" style="flex: 1;" onclick="window.onboardingPrev()">
              ← Назад
            </button>
          ` : `
            <button class="btn btn-secondary btn-lg" style="flex: 1;" onclick="window.location.hash='#auth'">
              🔑 У меня есть аккаунт
            </button>
          `}

          <button class="btn btn-primary btn-lg" style="flex: 1.4;" onclick="window.onboardingNext()">
            ${currentStep === totalSteps ? '🔥 Начать подготовку!' : 'Дальше →'}
          </button>
        </div>

        <div style="text-align: center;">
          <a href="#home" onclick="store.setOnboarded(true)" style="color: var(--text-dim); font-size: 0.86rem; text-decoration: underline; font-weight: 600;">
            Пропустить и заполнить позже
          </a>
        </div>
      </div>
    `;
  }

  function renderStepContent(step) {
    switch (step) {
      case 1:
        return `
          <div>
            <h3 style="font-size: 1.45rem; font-weight: 900; margin-bottom: 10px; color: var(--text-main);">
              Привет! Я — Квестефи
            </h3>
            <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; margin-bottom: 22px;">
              Собираю квесты из настоящих заданий ОГЭ и ЕГЭ. Решаешь — получаешь очки, держишь серию дней и видишь прогноз своей экзаменационной оценки. Настроим всё за минуту: имя, аватар, предметы и слабые темы.
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 14px; background: var(--surface2); padding: 14px 18px; border-radius: var(--radius-lg); border: 1px solid var(--border);">
                <div style="font-size: 1.8rem;">⚡</div>
                <div>
                  <div style="font-weight: 800; font-size: 0.98rem; color: var(--text-main);">Очки за скорость</div>
                  <div style="font-size: 0.84rem; color: var(--text-secondary);">Ответил быстрее 10 секунд — плюс 5 бонусных очков XP.</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 14px; background: var(--surface2); padding: 14px 18px; border-radius: var(--radius-lg); border: 1px solid var(--border);">
                <div style="font-size: 1.8rem;">📈</div>
                <div>
                  <div style="font-weight: 800; font-size: 0.98rem; color: var(--text-main);">Прогноз оценки</div>
                  <div style="font-size: 0.84rem; color: var(--text-secondary);">Результат оценивается по реальной шкале ФИПИ ОГЭ/ЕГЭ 2026.</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 14px; background: var(--surface2); padding: 14px 18px; border-radius: var(--radius-lg); border: 1px solid var(--border);">
                <div style="font-size: 1.8rem;">🎯</div>
                <div>
                  <div style="font-weight: 800; font-size: 0.98rem; color: var(--text-main);">11 550 заданий открытого банка</div>
                  <div style="font-size: 0.84rem; color: var(--text-secondary);">Разбор ошибок показывается после каждого вопроса. Работает оффлайн!</div>
                </div>
              </div>
            </div>
          </div>
        `;

      case 2:
        return `
          <div>
            <h3 style="font-size: 1.45rem; font-weight: 900; margin-bottom: 8px; color: var(--text-main);">
              Как тебя звать?
            </h3>
            <p style="color: var(--text-secondary); font-size: 0.90rem; margin-bottom: 18px;">
              Имя будет отображаться в рейтинге школ Мытищ, в профиле и в сертификатах.
            </p>

            <div class="form-group">
              <label class="form-label">Твоё имя или никнейм:</label>
              <input type="text" id="ob-name-input" class="input" value="${draft.name}" placeholder="Введите имя..." oninput="draft.name = this.value">
            </div>

            <div style="margin: 20px 0;">
              <div class="form-label" style="margin-bottom: 8px;">ПОЛ:</div>
              <div style="display: flex; gap: 10px;">
                <button class="btn ${draft.gender === 'male' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1;" onclick="window.setGender('male')">
                  👦 Парень
                </button>
                <button class="btn ${draft.gender === 'female' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1;" onclick="window.setGender('female')">
                  👧 Девушка
                </button>
              </div>
            </div>

            <div>
              <div class="form-label" style="margin-bottom: 8px;">ВЫБЕРИ АВАТАР:</div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 10px;">
                ${avatarsList.map(av => `
                  <div onclick="window.setAvatar('${av}')" style="
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.7rem;
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    background: ${draft.avatar === av ? 'var(--primary-container)' : 'var(--surface2)'};
                    border: 2px solid ${draft.avatar === av ? 'var(--primary)' : 'transparent'};
                    transition: all 0.2s ease;
                  ">
                    ${av}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;

      case 3:
        return `
          <div>
            <h3 style="font-size: 1.45rem; font-weight: 900; margin-bottom: 8px; color: var(--text-main);">
              Что готовим?
            </h3>
            <p style="color: var(--text-secondary); font-size: 0.90rem; margin-bottom: 18px;">
              Выберите целевой экзамен и предметы, по которым хотите проходить квесты:
            </p>

            <div class="form-group">
              <label class="form-label">Целевой экзамен:</label>
              <div style="display: flex; gap: 8px;">
                ${['ОГЭ (9 класс)', 'ЕГЭ (11 класс)', 'База (5–8 классы)'].map(ex => {
                  const val = ex.split(' ')[0];
                  const active = draft.exam === val;
                  return `
                    <button class="btn ${active ? 'btn-primary' : 'btn-secondary'} btn-sm" style="flex: 1;" onclick="window.setExam('${val}')">
                      ${ex}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <div style="margin: 20px 0;">
              <label class="form-label" style="margin-bottom: 10px; display: block;">ПРЕДМЕТЫ ПОДГОТОВКИ:</label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px;">
                ${SUBJECTS.map(sub => {
                  const isChecked = draft.subjects.includes(sub.id);
                  return `
                    <div onclick="window.toggleSubject('${sub.id}')" style="
                      padding: 12px 14px;
                      background: ${isChecked ? 'var(--primary-container)' : 'var(--surface2)'};
                      border: 1px solid ${isChecked ? 'var(--primary)' : 'var(--border)'};
                      border-radius: var(--radius-md);
                      display: flex;
                      align-items: center;
                      gap: 10px;
                      cursor: pointer;
                      transition: all 0.2s ease;
                    ">
                      <span style="font-size: 1.3rem;">${sub.icon}</span>
                      <span style="font-size: 0.88rem; font-weight: 700; color: ${isChecked ? 'var(--on-primary-container)' : 'var(--text-main)'};">
                        ${sub.name}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <div style="background: var(--surface2); padding: 14px 18px; border-radius: var(--radius-lg); border-left: 4px solid var(--accent);">
              <div style="font-weight: 800; font-size: 0.90rem; margin-bottom: 4px; color: var(--text-main);">🎯 Слабые темы:</div>
              <div style="font-size: 0.82rem; color: var(--text-secondary);">
                Система автоматически отслеживает ваши ошибки и в следующих квестах подбирает аналогичные задания для закрепления материала.
              </div>
            </div>
          </div>
        `;

      case 4:
        return `
          <div>
            <h3 style="font-size: 1.45rem; font-weight: 900; margin-bottom: 8px; color: var(--text-main);">
              Твой план и цель дня
            </h3>
            <p style="color: var(--text-secondary); font-size: 0.90rem; margin-bottom: 22px;">
              Установите ежедневную норму заданий для поддержания ударного темпа:
            </p>

            <div style="background: var(--surface2); padding: 20px; border-radius: var(--radius-lg); margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-weight: 800; font-size: 0.95rem; color: var(--text-main);">Цель на день:</span>
                <span class="badge" style="background: var(--primary-container); color: var(--on-primary-container); font-size: 0.92rem; padding: 6px 14px;">
                  🎯 ${draft.goal} заданий в день
                </span>
              </div>

              <div style="display: flex; gap: 8px;">
                ${[5, 10, 15, 20, 30].map(val => `
                  <button class="btn ${draft.goal === val ? 'btn-primary' : 'btn-secondary'} btn-sm" style="flex: 1;" onclick="window.setGoal(${val})">
                    ${val}
                  </button>
                `).join('')}
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--surface2); border-radius: var(--radius-md);">
                <div>
                  <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-main);">Тёмная тема (AMOLED)</div>
                  <div style="font-size: 0.78rem; color: var(--text-secondary);">Экономит заряд батареи на смартфонах</div>
                </div>
                <input type="checkbox" checked disabled style="width: 22px; height: 22px; accent-color: var(--primary);">
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--surface2); border-radius: var(--radius-md);">
                <div>
                  <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-main);">Подсказки и звуковые эффекты</div>
                  <div style="font-size: 0.78rem; color: var(--text-secondary);">Аудио-клики и фанфары при решении задач</div>
                </div>
                <input type="checkbox" checked onchange="draft.sound = this.checked; sound.enabled = this.checked;" style="width: 22px; height: 22px; accent-color: var(--primary);">
              </div>
            </div>

            <div style="background: var(--bento-indigo-bg); padding: 16px 20px; border-radius: var(--radius-lg); text-align: center;">
              <div style="font-weight: 900; font-size: 1.05rem; color: #A5B4FC; margin-bottom: 4px;">
                🎉 Всё готово к первому квесту!
              </div>
              <div style="font-size: 0.84rem; color: #C7D2FE;">
                Участник: <strong>${draft.name}</strong> (${draft.avatar}) · Экзамен: <strong>${draft.exam}</strong> · Цель: <strong>${draft.goal} задач/день</strong>
              </div>
            </div>
          </div>
        `;
    }
  }

  // Глобальные методы управления шагами
  window.onboardingNext = () => {
    sound.click();
    const nameEl = document.getElementById('ob-name-input');
    if (nameEl && nameEl.value.trim()) {
      draft.name = nameEl.value.trim();
    }

    if (currentStep < totalSteps) {
      currentStep++;
      renderStep();
    } else {
      // Завершение онбординга: сохранение пользователя
      store.register({
        display_name: draft.name,
        login: 'user_' + draft.name.toLowerCase().replace(/[^a-zа-я0-9]/gi, ''),
        role: 'student',
        school_code: '201026',
        school_name: 'МБОУ «СОШ № 29» г. Мытищи',
        grade: draft.grade,
        avatar: draft.avatar,
        goal: draft.goal
      });
      store.setOnboarded(true);
      sound.fanfare();
      window.location.hash = '#home';
    }
  };

  window.onboardingPrev = () => {
    sound.click();
    if (currentStep > 1) {
      currentStep--;
      renderStep();
    }
  };

  window.setGender = (g) => {
    sound.click();
    draft.gender = g;
    renderStep();
  };

  window.setAvatar = (av) => {
    sound.click();
    draft.avatar = av;
    renderStep();
  };

  window.setExam = (ex) => {
    sound.click();
    draft.exam = ex;
    renderStep();
  };

  window.toggleSubject = (subId) => {
    sound.click();
    if (draft.subjects.includes(subId)) {
      if (draft.subjects.length > 1) {
        draft.subjects = draft.subjects.filter(s => s !== subId);
      }
    } else {
      draft.subjects.push(subId);
    }
    renderStep();
  };

  window.setGoal = (g) => {
    sound.click();
    draft.goal = g;
    renderStep();
  };

  // Первый запуск
  renderStep();
}
