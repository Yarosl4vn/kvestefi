// ==========================================================================
// УЧЕБНИК И ШПАРГАЛКИ (LEARN & THEORY KNOWLEDGE BASE)
// 1:1 Соответствие: LearnFragment.kt + fragment_learn.xml
// ==========================================================================

import { SUBJECTS } from '../data.js';
import { sound } from '../audio.js';

export function renderLearn(container) {
  const quickTopics = [
    { title: "Теорема Пифагора", subject: "Геометрия", formula: "a² + b² = c²", desc: "В прямоугольном треугольнике квадрат длины гипотенузы равен сумме квадратов длин катетов." },
    { title: "Квадратное уравнение", subject: "Алгебра", formula: "D = b² - 4ac, x = (-b ± √D) / 2a", desc: "При D > 0 — два различных вещественных корня, при D = 0 — один корень кратности 2, при D < 0 — вещественных корней нет." },
    { title: "Проценты и дроби", subject: "Математика", formula: "p% от числа A = A · (p / 100)", desc: "Чтобы найти число по его проценту b, составляющему p%, нужно: b / (p / 100)." },
    { title: "Знаки препинания в СПП", subject: "Русский язык", formula: "[Главное], (придаточное)", desc: "Придаточная часть отделяется от главной запятой или выделяется запятыми с обеих сторон, если находится внутри главной." },
    { title: "Закон Ома для участка цепи", subject: "Физика", formula: "I = U / R", desc: "Сила тока в участке цепи прямо пропорциональна напряжению на концах этого участка и обратно пропорциональна его сопротивлению." },
    { title: "Закон Архимеда", subject: "Физика", formula: "F_A = ρ · g · V", desc: "На тело, погружённое в жидкость или газ, действует выталкивающая сила, равная весу вытесненной жидкости." },
    { title: "Периодический закон", subject: "Химия", formula: "Свойства элементов зависят от заряда ядер Z", desc: "Свойства простых веществ, а также формы и свойства соединений элементов находятся в периодической зависимости от заряда ядер их атомов." },
    { title: "Конституция РФ (Основы строя)", subject: "Обществознание", formula: "Статья 1, 2, 7 Конституции", desc: "Российская Федерация — Россия есть демократическое федеративное правовое государство с республиканской формой правления." },
    { title: "Куликовская битва (1380 г.)", subject: "История", formula: "8 сентября 1380 года", desc: "Сражение войск русских княжеств во главе с великим князем московским Дмитрием Ивановичем (Донским) и ордынского войска Мамая." },
    { title: "Двоичная система счисления", subject: "Информатика", formula: "N = a_n·2^n + ... + a_0·2^0", desc: "Позиционная система счисления с основанием 2. В компьютерной технике используются цифры 0 и 1." }
  ];

  let currentCategory = 'all';
  let searchQuery = '';

  function render() {
    const filteredTopics = quickTopics.filter(t => {
      const matchCat = currentCategory === 'all' || t.subject.toLowerCase().includes(currentCategory);
      const matchSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <!-- Заголовок страницы (1:1 fragment_learn.xml) -->
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 1.7rem; font-weight: 900; letter-spacing: -0.4px; margin-bottom: 4px; color: var(--text-main);">
            Учебник и шпаргалки
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Конспекты по школьным предметам, формулы, типовые ловушки ОГЭ/ЕГЭ и база знаний.
          </p>
        </div>

        <!-- Поисковая строка -->
        <div style="position: relative; margin-bottom: 18px;">
          <input type="text" id="learn-search-input" class="input" placeholder="🔍 Поиск темы, формулы или термина (например, Пифагор, Ом, 1380)..." value="${searchQuery}" oninput="window.onLearnSearch(this.value)" style="padding-left: 18px; font-size: 1rem;">
        </div>

        <!-- Горизонтальный скролл категорий (modeRow) -->
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 20px;">
          ${[
            { id: 'all', title: '📚 Все темы' },
            { id: 'матем', title: '📐 Математика' },
            { id: 'рус', title: '✍️ Русский язык' },
            { id: 'физ', title: '⚡ Физика' },
            { id: 'инф', title: '💻 Информатика' },
            { id: 'хим', title: '🧪 Химия' },
            { id: 'ист', title: '🏛️ История' },
            { id: 'общ', title: '⚖️ Обществознание' }
          ].map(c => `
            <button class="btn btn-sm ${currentCategory === c.id ? 'btn-primary' : 'btn-secondary'}" onclick="window.setLearnCategory('${c.id}')" style="white-space: nowrap;">
              ${c.title}
            </button>
          `).join('')}
        </div>

        <!-- Быстрые шпаргалки (Quick Topics Chips) -->
        <div class="card" style="padding: 16px 20px; margin-bottom: 24px; background: var(--surface2);">
          <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-secondary); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
            Часто ищут перед ОГЭ/ЕГЭ:
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${quickTopics.slice(0, 7).map(qt => `
              <span class="badge" onclick="window.openTopicModal('${qt.title}')" style="background: var(--surface-container); border: 1px solid var(--border); color: var(--primary); cursor: pointer; padding: 6px 12px; font-size: 0.82rem;">
                📌 ${qt.title}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Список конспектов и формул -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 30px;">
          ${filteredTopics.length > 0 ? filteredTopics.map(t => `
            <div class="card card-clickable" style="padding: 20px;" onclick="window.openTopicModal('${t.title}')">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                <span class="badge badge-dev" style="font-size: 0.72rem;">${t.subject}</span>
                <span style="font-size: 1.2rem;">📖</span>
              </div>

              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">
                ${t.title}
              </h3>

              <div style="background: var(--surface2); padding: 8px 12px; border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: 0.84rem; color: var(--primary); font-weight: 700; margin-bottom: 10px;">
                ${t.formula}
              </div>

              <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45; margin: 0;">
                ${t.desc}
              </p>
            </div>
          `).join('') : `
            <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
              <div style="font-size: 2.5rem; margin-bottom: 8px;">🔍</div>
              <div style="font-size: 1.1rem; font-weight: 800; color: var(--text-main);">Ничего не найдено</div>
              <div style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">Попробуйте изменить запрос поиска.</div>
            </div>
          `}
        </div>
      </div>

      <!-- Модальное окно полного конспекта -->
      <div id="learn-topic-modal" class="modal-overlay" style="display: none;">
        <div class="modal-box" style="max-width: 640px;">
          <div class="modal-header">
            <h3 id="learn-modal-title" class="modal-title">Конспект</h3>
            <button class="modal-close" onclick="window.closeLearnModal()">✕</button>
          </div>
          <div id="learn-modal-body" class="modal-body"></div>
          <div class="modal-footer">
            <button class="btn btn-primary" onclick="window.closeLearnModal()">Понятно, закрыть</button>
          </div>
        </div>
      </div>
    `;
  }

  window.setLearnCategory = (cat) => {
    sound.click();
    currentCategory = cat;
    render();
  };

  window.onLearnSearch = (val) => {
    searchQuery = val.trim();
    render();
  };

  window.openTopicModal = (title) => {
    sound.click();
    const t = quickTopics.find(item => item.title === title) || quickTopics[0];
    const modal = document.getElementById('learn-topic-modal');
    const titleEl = document.getElementById('learn-modal-title');
    const bodyEl = document.getElementById('learn-modal-body');

    titleEl.innerText = `${t.title} (${t.subject})`;
    bodyEl.innerHTML = `
      <div style="line-height: 1.6; font-size: 0.95rem;">
        <div style="background: var(--surface2); padding: 14px 18px; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 1.05rem; color: var(--primary); font-weight: 800; margin-bottom: 16px; border: 1px solid var(--border);">
          ${t.formula}
        </div>

        <h4 style="color: var(--text-main); font-weight: 800; margin-bottom: 6px;">Теоретическое правило:</h4>
        <p style="color: var(--text-secondary); margin-bottom: 18px;">
          ${t.desc}
        </p>

        <div style="background: var(--surface2); padding: 16px; border-radius: var(--radius-md); border-left: 4px solid var(--accent); margin-bottom: 14px;">
          <strong style="color: var(--text-main);">💡 Совет экспертов ReadySquad к ОГЭ/ЕГЭ:</strong><br>
          <span style="color: var(--text-secondary); font-size: 0.88rem;">
            На реальном экзамене всегда проверяйте единицы измерения (СИ) и размерности. По этой теме в банке Квестефи доступно более 150 тренировочных заданий.
          </span>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  };

  window.closeLearnModal = () => {
    const modal = document.getElementById('learn-topic-modal');
    if (modal) modal.style.display = 'none';
  };

  render();
}
