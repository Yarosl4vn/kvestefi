// ==========================================================================
// ЭКРАН ПРЕДМЕТОВ И ТЕОРИИ (11 ШКОЛЬНЫХ ДИСЦИПЛИН)
// Соответствие разметке: fragment_subjects.xml + item_subject.xml (M3 Expressive)
// ==========================================================================

import { SUBJECTS } from '../data.js';
import { store } from '../store.js';

export function renderSubjects(container) {
  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 1.55rem; font-weight: 900; letter-spacing: -0.4px; margin-bottom: 6px; color: var(--text-main);">
        📚 Школьные дисциплины и теория
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.95rem;">
        11 предметов школьной программы, подготовка к ОГЭ/ЕГЭ и олимпиадный банк заданий г. Мытищи.
      </p>
    </div>

    <div class="grid-3" style="margin-bottom: 30px;">
      ${SUBJECTS.map(sub => {
        const tasksCount = (store.tasksBySubject[sub.id] || []).length || 1050;
        return `
          <div class="card card-clickable" style="padding: 20px; background: #1D234A; border-color: #2D366E;" onclick="window.location.hash='#quiz?subject=${sub.id}&count=10'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <div class="m3-cookie-box" style="width: 48px; height: 48px;">
                <svg class="m3-cookie-svg" viewBox="0 0 48 48">
                  <use href="#cookie-10" fill="#2D366E" />
                </svg>
                <div class="m3-cookie-inner" style="font-size: 1.35rem;">
                  ${sub.icon}
                </div>
              </div>

              <span class="badge" style="background: rgba(255, 255, 255, 0.1); color: #E0E7FF; font-size: 0.76rem;">
                ${tasksCount} задач
              </span>
            </div>

            <h3 style="font-size: 1.15rem; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">
              ${sub.name}
            </h3>
            <p style="font-size: 0.82rem; color: #A5B4FC; margin-bottom: 16px;">
              Форматы: ${sub.exams.join(', ')} · 1–11 классы
            </p>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="event.stopPropagation(); window.location.hash='#quiz?subject=${sub.id}&count=10'">
                ▶️ Квест
              </button>
              <button class="btn btn-secondary btn-sm" style="background: rgba(255,255,255,0.12); color: #FFFFFF;" onclick="event.stopPropagation(); window.openTheoryModal('${sub.id}')">
                📖 Теория
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Модальное окно теории -->
    <div id="theory-modal" class="modal-overlay" style="display: none;">
      <div class="modal-box">
        <div class="modal-header">
          <h3 id="theory-modal-title" class="modal-title">📖 Шпаргалка по теме</h3>
          <button class="modal-close" onclick="window.closeTheoryModal()">✕</button>
        </div>
        <div id="theory-modal-body" class="modal-body">
          <!-- Заполняется динамически -->
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="window.closeTheoryModal()">Понятно</button>
        </div>
      </div>
    </div>
  `;

  // Глобальные методы для модалки теории
  window.openTheoryModal = (subId) => {
    const sub = SUBJECTS.find(s => s.id === subId) || SUBJECTS[0];
    const modal = document.getElementById('theory-modal');
    const title = document.getElementById('theory-modal-title');
    const body = document.getElementById('theory-modal-body');

    title.innerText = `${sub.icon} ${sub.name} — Ключевая теория`;
    body.innerHTML = `
      <div style="line-height: 1.6; font-size: 0.95rem;">
        <h4 style="color: var(--primary); margin-bottom: 8px; font-weight: 800;">📌 Опорные конспекты и правила</h4>
        <p style="margin-bottom: 14px; color: var(--text-secondary);">
          Официальные материалы школьной программы и типовые алгоритмы решения для дисциплины «${sub.name}».
        </p>

        <div style="background: var(--surface2); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 14px; border-left: 4px solid var(--accent);">
          <strong style="color: var(--text-main);">Совет экспертов ReadySquad:</strong><br>
          <span style="color: var(--text-secondary);">
            Внимательно читайте условие задачи до конца. На ОГЭ/ЕГЭ 30% ошибок совершается из-за невнимательности при подсчёте размерностей и знаков.
          </span>
        </div>

        <div style="background: var(--surface2); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border);">
          <div style="font-weight: 800; margin-bottom: 6px; color: var(--text-main);">🎯 Форматы заданий:</div>
          <ul style="padding-left: 20px; color: var(--text-secondary); font-size: 0.9rem;">
            <li>Базовый уровень (1–4 классы и 5–9 классы)</li>
            <li>ОГЭ — Государственная итоговая аттестация 9 класс</li>
            <li>ЕГЭ — Единый государственный экзамен 11 класс (База и Профиль)</li>
            <li>Олимпиадные задания Всероссийской олимпиады школьников (ВсОШ)</li>
          </ul>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
  };

  window.closeTheoryModal = () => {
    const modal = document.getElementById('theory-modal');
    if (modal) modal.style.display = 'none';
  };
}
