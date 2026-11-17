// ==========================================================================
// ЭКРАН ПРЕДМЕТОВ И ТЕОРИИ (11 ШКОЛЬНЫХ ДИСЦИПЛИН)
// ==========================================================================

import { SUBJECTS } from '../data.js';
import { store } from '../store.js';

export function renderSubjects(container) {
  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 6px;">📚 Школьные предметы и теория</h2>
      <p style="color: var(--text-secondary); font-size: 0.95rem;">
        Выберите предмет для тренировки заданий ОГЭ/ЕГЭ или повторения теоретических шпаргалок.
      </p>
    </div>

    <div class="grid-3" style="margin-bottom: 30px;">
      ${SUBJECTS.map(sub => {
        const tasksCount = (store.tasksBySubject[sub.id] || []).length || 1050;
        return `
          <div class="card" style="border-top: 4px solid ${sub.color};">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <span style="font-size: 2.2rem;">${sub.icon}</span>
              <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--text-secondary);">${tasksCount} задач</span>
            </div>
            
            <h3 class="card-title">${sub.name}</h3>
            <p class="card-subtitle" style="margin-bottom: 16px;">
              Форматы: ${sub.exams.join(', ')} · 1–11 классы
            </p>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.location.hash='#quiz?subject=${sub.id}&count=10'">
                ▶️ Тренировка
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.openTheoryModal('${sub.id}')">
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
        <h4 style="color: var(--primary); margin-bottom: 8px;">📌 Основные формулы и правила</h4>
        <p style="margin-bottom: 14px; color: var(--text-secondary);">
          Здесь собраны ключевые опорные конспекты и типовые ловушки на экзаменах ОГЭ и ЕГЭ по предмету «${sub.name}».
        </p>

        <div style="background: var(--surface-variant); padding: 14px; border-radius: var(--radius-md); margin-bottom: 12px; border-left: 4px solid var(--accent);">
          <strong>Совет экспертов ReadySquad:</strong><br>
          Внимательно читайте условие задачи до конца. На ОГЭ/ЕГЭ 30% ошибок совершается из-за спешки при подсчёте размерностей и знаков.
        </div>

        <button class="btn btn-primary btn-block" style="margin-top: 16px;" onclick="window.location.hash='#quiz?subject=${sub.id}&count=10'; window.closeTheoryModal();">
          🔥 Закрепить на практике (10 задач)
        </button>
      </div>
    `;
    modal.style.display = 'flex';
  };

  window.closeTheoryModal = () => {
    const modal = document.getElementById('theory-modal');
    if (modal) modal.style.display = 'none';
  };
}
