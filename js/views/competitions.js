// ==========================================================================
// МЕЖШКОЛЬНЫЕ СОРЕВНОВАНИЯ Г. МЫТИЩИ (10 ТУРНИРОВ, 39 ШКОЛ)
// ==========================================================================

import { COMPETITIONS, SCHOOLS } from '../data.js';

export function renderCompetitions(container) {
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 24px;">
      <div>
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 6px;">🏛️ Межшкольные соревнования г. Мытищи</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          Городские олимпиады и интеллектуальные турниры для всех 39 школ городского округа Мытищи.
        </p>
      </div>

      <div style="display: flex; gap: 8px;">
        <button class="btn btn-secondary btn-sm" onclick="window.openRegulationsModal()">
          📜 Положение о соревнованиях
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.openCompInfoModal()">
          ℹ️ Регламент и призы
        </button>
      </div>
    </div>

    <!-- Список соревнований -->
    <div class="grid-2" style="margin-bottom: 36px;">
      ${COMPETITIONS.map(comp => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 2.2rem;">${comp.badge}</span>
              <div>
                <h3 class="card-title" style="margin: 0;">${comp.title}</h3>
                <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: 600;">3 тура · ${comp.tasksPerRound} заданий на тур</span>
              </div>
            </div>
            <span class="badge badge-dev">Сезон 2026</span>
          </div>

          <p class="card-subtitle" style="margin-bottom: 14px;">${comp.desc}</p>

          <!-- Статус 3-х туров -->
          <div style="background: var(--surface-variant); padding: 12px; border-radius: var(--radius-md); margin-bottom: 14px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 8px;">ЭТАПЫ СОРЕВНОВАНИЯ:</div>
            <div style="display: flex; gap: 8px;">
              <span class="badge ${comp.round1_open ? 'badge-student' : 'badge-closed'}" style="flex: 1; justify-content: center;">
                Тур 1: ${comp.round1_open ? '🟢 Открыт' : '🔒 Завершён'}
              </span>
              <span class="badge ${comp.round2_open ? 'badge-student' : 'badge-closed'}" style="flex: 1; justify-content: center;">
                Тур 2: ${comp.round2_open ? '🟢 Открыт' : '🔒 Ожидание'}
              </span>
              <span class="badge ${comp.round3_open ? 'badge-student' : 'badge-closed'}" style="flex: 1; justify-content: center;">
                Тур 3: ${comp.round3_open ? '🟢 Финал' : '🔒 Ожидание'}
              </span>
            </div>
          </div>

          <div style="font-size: 0.85rem; color: #F59E0B; font-weight: 700; margin-bottom: 16px;">
            🥇 1 место: ${comp.prizeGold}
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.location.hash='#quiz?subject=${comp.subject === 'all' ? 'math' : comp.subject}&count=${comp.tasksPerRound}'">
              🚀 Принять участие в туре
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.openCompInfoModal()">
              🏆 Призы
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Рейтинг школ г. Мытищи -->
    <div class="card" style="margin-bottom: 30px;">
      <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 14px;">🏫 Общекомандный зачёт 39 школ г. Мытищи</h3>
      <div style="overflow-x: auto;">
        <table class="styled-table" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: var(--surface-variant); text-align: left;">
              <th style="padding: 10px 14px; border-radius: var(--radius-sm) 0 0 var(--radius-sm);">Место</th>
              <th style="padding: 10px 14px;">Школа</th>
              <th style="padding: 10px 14px;">Код</th>
              <th style="padding: 10px 14px;">Тур 1</th>
              <th style="padding: 10px 14px;">Тур 2</th>
              <th style="padding: 10px 14px;">Тур 3</th>
              <th style="padding: 10px 14px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">Всего очков</th>
            </tr>
          </thead>
          <tbody>
            ${SCHOOLS.slice(1, 11).map((s, idx) => {
              const r1 = 3400 - idx * 180;
              const r2 = 2900 - idx * 150;
              const r3 = 2100 - idx * 110;
              const total = r1 + r2 + r3;
              const medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `${idx + 1}`));
              return `
                <tr style="border-bottom: 1px solid var(--border);">
                  <td style="padding: 12px 14px; font-weight: 800; font-size: 1.05rem;">${medal}</td>
                  <td style="padding: 12px 14px; font-weight: 700;">${s.name}</td>
                  <td style="padding: 12px 14px; color: var(--text-dim);"><code class="cred-code">${s.code}</code></td>
                  <td style="padding: 12px 14px; color: #10B981;">+${r1}</td>
                  <td style="padding: 12px 14px; color: #06B6D4;">+${r2}</td>
                  <td style="padding: 12px 14px; color: #A5B4FC;">+${r3}</td>
                  <td style="padding: 12px 14px; font-weight: 800; color: #F59E0B;">${total}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Модальное окно: Положение о соревнованиях -->
    <div id="regulations-modal" class="modal-overlay" style="display: none;">
      <div class="modal-box" style="max-width: 680px;">
        <div class="modal-header">
          <h3 class="modal-title">📜 Положение о межшкольных соревнованиях</h3>
          <button class="modal-close" onclick="window.closeRegulationsModal()">✕</button>
        </div>
        <div class="modal-body" style="font-size: 0.92rem; line-height: 1.6;">
          <h4 style="color: var(--primary); margin-bottom: 6px;">1. Общие положения</h4>
          <p style="margin-bottom: 10px;">
            1.1. Настоящее Положение определяет порядок организации и проведения общегородских межшкольных соревнований на платформе «Квестефи» среди общеобразовательных организаций городского округа Мытищи Московской области.<br>
            1.2. Целями соревнований являются повышение качества подготовки обучающихся 9–11 классов к государственной итоговой аттестации (ОГЭ/ЕГЭ), выявление и поддержка одарённых школьников, укрепление межшкольного интеллектуального сотрудничества.<br>
            1.3. Организатором соревнований выступает команда разработчиков ReadySquad (МБОУ СОШ № 29 г. Мытищи).
          </p>

          <h4 style="color: var(--primary); margin-top: 14px; margin-bottom: 6px;">2. Условия участия и регламент туров</h4>
          <p style="margin-bottom: 10px;">
            2.1. К участию допускаются обучающиеся всех 39 общеобразовательных организаций г. Мытищи.<br>
            2.2. Турнир состоит из трёх последовательных туров. Очки участника за каждый тур суммируются в единый накопительный рейтинг.<br>
            2.3. Исключаются повторные задания: алгоритм Квестефи гарантирует уникальный набор вопросов для каждого раунда.
          </p>

          <h4 style="color: var(--primary); margin-top: 14px; margin-bottom: 6px;">3. Награждение и призовой фонд</h4>
          <p>
            3.1. Победители и призёры определяются по суммарному баллу за все 3 тура.<br>
            3.2. Награды (электронные дипломы, медали и кубки платформы) автоматически зачисляются в цифровой профиль ученика и школы.<br>
            3.3. Разработчики платформы оставляют за собой право вносить изменения в состав призов и учреждать специальные номинации.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="window.closeRegulationsModal()">Ознакомлен</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно: Информация о мероприятиях -->
    <div id="comp-info-modal" class="modal-overlay" style="display: none;">
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">ℹ️ Информация о мероприятиях и призах</h3>
          <button class="modal-close" onclick="window.closeCompInfoModal()">✕</button>
        </div>
        <div class="modal-body" style="font-size: 0.95rem; line-height: 1.6;">
          <p style="margin-bottom: 12px;">
            Каждое мероприятие разработано в строгом соответствии с кодификаторами ФИПИ для 9–11 классов.
          </p>
          <div style="background: var(--surface-variant); padding: 14px; border-radius: var(--radius-md); margin-bottom: 12px;">
            <strong>🏆 Наградная система:</strong>
            <ul style="margin: 8px 0 0 20px;">
              <li>🥇 1 место: Диплом победителя + Медаль Олимпа + Баллы школе</li>
              <li>🥈 2 место: Диплом лауреата II степени + Серебряная медаль</li>
              <li>🥉 3 место: Диплом лауреата III степени + Бронзовая медаль</li>
            </ul>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.85rem;">
            Все заработанные баллы автоматически учитываются в общем рейтинге образовательных организаций г. Мытищи.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="window.closeCompInfoModal()">Закрыть</button>
        </div>
      </div>
    </div>
  `;

  window.openRegulationsModal = () => {
    document.getElementById('regulations-modal').style.display = 'flex';
  };
  window.closeRegulationsModal = () => {
    document.getElementById('regulations-modal').style.display = 'none';
  };
  window.openCompInfoModal = () => {
    document.getElementById('comp-info-modal').style.display = 'flex';
  };
  window.closeCompInfoModal = () => {
    document.getElementById('comp-info-modal').style.display = 'none';
  };
}
