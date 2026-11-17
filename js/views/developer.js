// ==========================================================================
// ПАНЕЛЬ РАЗРАБОТЧИКА (DEVELOPER DASHBOARD)
// ==========================================================================

import { store } from '../store.js';
import { LEVELING, SCHOOLS } from '../data.js';
import { sound } from '../audio.js';

export function renderDeveloper(container) {
  const me = store.currentUser;

  if (me.role !== 'developer') {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px;">
        <h2>🔒 Доступ ограничен</h2>
        <p style="color: var(--text-secondary); margin: 12px 0 20px 0;">Панель предназначена только для разработчиков платформы ReadySquad.</p>
        <button class="btn btn-primary" onclick="window.location.hash='#home'">На главную</button>
      </div>
    `;
    return;
  }

  // Мок-список пользователей для живого поиска и управления
  const mockUsers = [
    { login: 'yaroslav', name: 'Ярослав Акинфиев', role: 'developer', school: 'МБОУ «СОШ № 29»', score: 35000, banned: false, prefix: '[Разработчик] ReadySquad' },
    { login: 'khaidaroli', name: 'Хайдароли Довлатов', role: 'developer', school: 'МБОУ «СОШ № 29»', score: 28000, banned: false, prefix: '[Разработчик] ReadySquad' },
    { login: 'dev_admin', name: 'Системный Администратор', role: 'developer', school: 'МБОУ «СОШ № 29»', score: 20000, banned: false, prefix: '[Разработчик]' },
    { login: 'school29_admin', name: 'Администратор Школы № 29', role: 'school_admin', school: 'МБОУ «СОШ № 29»', score: 18000, banned: false, prefix: '[Куратор] Школа № 29' },
    { login: 'support1', name: 'Агент Поддержки 1', role: 'support', school: 'ReadySquad Helpdesk', score: 8000, banned: false, prefix: 'Агент Поддержки' },
    { login: 'sch01_t_math', name: 'Семёнов Роман Олегович', role: 'teacher', school: 'МБОУ «Гимназия № 1»', score: 12000, banned: false, prefix: '[Учитель] Математика' },
    { login: 'sch01_stud01', name: 'Яковлева Дарья', role: 'student', school: 'МБОУ «Гимназия № 1»', score: 1450, banned: false, prefix: 'Ученик' },
    { login: 'sch34_adm1', name: 'Волкова Анна Павловна', role: 'school_admin', school: 'МБОУ «Погорельская СОШ»', score: 9500, banned: false, prefix: '[Куратор] Школа № 34' }
  ];

  container.innerHTML = `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 6px;">🛠️ Центр управления разработчика ReadySquad</h2>
      <p style="color: var(--text-secondary); font-size: 0.95rem;">
        Абсолютный контроль над пользователями, школами, олимпиадами и базой знаний.
      </p>
    </div>

    <!-- Быстрые действия разработчика -->
    <div class="grid-3" style="margin-bottom: 24px;">
      <div class="card">
        <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px;">⚡ Управление очками и уровнем</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 14px;">Назначить себе или пользователю любой уровень от 1 до 2000.</p>
        <button class="btn btn-primary btn-sm btn-block" onclick="window.openLevelManager()">Задать уровень (1..2000)</button>
      </div>

      <div class="card">
        <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px;">🏫 Управление школами (39 школ)</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 14px;">Назначение ролей, классных руководителей (1-11, А-Д).</p>
        <button class="btn btn-secondary btn-sm btn-block" onclick="window.openSchoolManager()">Назначить роль в школе</button>
      </div>

      <div class="card">
        <h4 style="font-size: 1rem; font-weight: 800; margin-bottom: 8px;">📢 Экстренное оповещение</h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 14px;">Моментальная рассылка всем учителям и ученикам Мытищ.</p>
        <button class="btn btn-accent btn-sm btn-block" onclick="window.location.hash='#chat'">Открыть рассылку</button>
      </div>
    </div>

    <!-- Живой поиск пользователей (Req 6) -->
    <div class="card" style="margin-bottom: 24px;">
      <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 14px;">🔍 Живой поиск пользователей (ввод от 2-х символов)</h3>
      <input type="text" id="dev-user-search-input" class="input" placeholder="Введите имя, логин, школу или статус..." oninput="window.filterUsersList()">

      <div id="dev-users-table-box" style="margin-top: 16px; overflow-x: auto;">
        <!-- Таблица пользователей рендерится здесь -->
      </div>
    </div>
  `;

  window.renderUsersTable = (users) => {
    const box = document.getElementById('dev-users-table-box');
    if (!box) return;

    if (users.length === 0) {
      box.innerHTML = `<div style="text-align: center; color: var(--text-dim); padding: 20px;">Пользователи не найдены</div>`;
      return;
    }

    box.innerHTML = `
      <table class="styled-table" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: var(--surface-variant); text-align: left;">
            <th style="padding: 8px 12px;">Пользователь</th>
            <th style="padding: 8px 12px;">Логин</th>
            <th style="padding: 8px 12px;">Школа</th>
            <th style="padding: 8px 12px;">Уровень</th>
            <th style="padding: 8px 12px;">Статус / Префикс</th>
            <th style="padding: 8px 12px; text-align: right;">Действия</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => {
            const isDev = u.role === 'developer';
            const lvl = LEVELING.level(u.score);
            return `
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 10px 12px; font-weight: 700;">${u.name}</td>
                <td style="padding: 10px 12px;"><code class="cred-code">${u.login}</code></td>
                <td style="padding: 10px 12px; font-size: 0.85rem; color: var(--text-secondary);">${u.school}</td>
                <td style="padding: 10px 12px; font-weight: 700; color: #F59E0B;">Ур. ${lvl} (${u.score})</td>
                <td style="padding: 10px 12px;"><span class="badge ${isDev ? 'badge-dev' : 'badge-student'}">${u.prefix}</span></td>
                <td style="padding: 10px 12px; text-align: right;">
                  <button class="btn btn-secondary btn-sm" onclick="window.editUserStatus('${u.login}')">✏️ Статус</button>
                  ${isDev ? `
                    <span class="badge badge-dev" title="Защита от блокировки">🛡️ Иммунитет</span>
                  ` : `
                    <button class="btn btn-danger btn-sm" onclick="window.openBanDialog('${u.login}', '${u.name}')">🚫 Блок</button>
                  `}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  };

  window.filterUsersList = () => {
    const query = (document.getElementById('dev-user-search-input')?.value || '').trim().toLowerCase();
    if (query.length < 2) {
      window.renderUsersTable(mockUsers);
      return;
    }
    const filtered = mockUsers.filter(u => 
      u.name.toLowerCase().includes(query) ||
      u.login.toLowerCase().includes(query) ||
      u.school.toLowerCase().includes(query) ||
      u.prefix.toLowerCase().includes(query)
    );
    window.renderUsersTable(filtered);
  };

  // Диалог блокировки с пресетами (Req 8)
  window.openBanDialog = (login, name) => {
    const daysStr = prompt(`Блокировка пользователя ${name} (${login}):\n\nВыберите срок блокировки в днях:\n[7] - 7 дней\n[15] - 15 дней\n[30] - 30 дней\n[60] - 60 дней\n[90] - 90 дней\n[365] - 1 год\n[-1] - Навсегда\n(или введите любое число дней):`, '7');
    if (!daysStr) return;

    const reason = prompt('Укажите причину блокировки:', 'Нарушение регламента платформы Квестефи');
    if (!reason) return;

    alert(`Пользователь ${name} успешно заблокирован на ${daysStr === '-1' ? 'бессрочный период' : daysStr + ' дн.'}!\nПричина: ${reason}`);
  };

  // Назначение статуса и префикса (Req 9)
  window.editUserStatus = (login) => {
    const newPref = prompt(`Введите новый префикс для пользователя ${login}:`, '[Знаток] Квестефи');
    if (newPref) {
      alert(`Префикс пользователя ${login} изменён на: ${newPref}`);
    }
  };

  // Менеджер уровней (1..2000) (Req 16)
  window.openLevelManager = () => {
    const targetLvl = prompt('Введите желаемый уровень от 1 до 2000:', '1000');
    if (targetLvl) {
      const lvl = parseInt(targetLvl, 10);
      if (lvl >= 1 && lvl <= 2000) {
        const score = LEVELING.startScore(lvl);
        store.currentUser.score = score;
        store.saveUser();
        sound.fanfare();
        alert(`Ваш уровень установлен на ${lvl} (${LEVELING.title(lvl)})!\nОчки обновлены: ${score}`);
        window.location.reload();
      } else {
        alert('Уровень должен быть в диапазоне от 1 до 2000!');
      }
    }
  };

  // Назначение роли в школе и классного руководителя с выбором класса и буквы (Req 10, 11)
  window.openSchoolManager = () => {
    const grade = prompt('Шаг 1 из 2: Выберите номер класса (1 - 11):', '10');
    if (!grade) return;

    const letter = prompt(`Шаг 2 из 2: Выберите букву класса для ${grade}-го класса (А, Б, В, Г, Д):`, 'А');
    if (!letter) return;

    const school = prompt('Введите номер или название школы г. Мытищи:', 'МБОУ «СОШ № 29»');
    if (!school) return;

    store.currentUser.school_name = school;
    store.currentUser.homeroom = `${grade}${letter.toUpperCase()}`;
    store.currentUser.prefix = `[Классный руководитель ${grade}-${letter.toUpperCase()}]`;
    store.saveUser();

    sound.click();
    alert(`Вы успешно назначены классным руководителем ${grade}-${letter.toUpperCase()} класса школы «${school}»!`);
    window.location.reload();
  };

  window.renderUsersTable(mockUsers);
}
