// ==========================================================================
// СЛУЖБА ПОДДЕРЖКИ (ТИКЕТЫ, ПРЕДЛОЖЕНИЯ, ЖАЛОБЫ)
// ==========================================================================

import { store } from '../store.js';
import { supabase } from '../supabase.js';
import { sound } from '../audio.js';

export async function renderSupport(container) {
  const me = store.currentUser;
  if (!me) {
    window.location.hash = '#auth';
    return;
  }
  const isDev = me.role === 'developer' || me.role === 'support';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 24px;">
      <div>
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 4px;">🛡️ Служба поддержки Квестефи</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          ${isDev ? 'Панель обработки обращений пользователей г. Мытищи' : 'Задайте вопрос, сообщите об ошибке или предложите улучшение'}
        </p>
      </div>

      <button class="btn btn-primary" onclick="window.openNewTicketModal()">
        ➕ Создать обращение
      </button>
    </div>

    <!-- Список обращений -->
    <div class="card" style="padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
        <h3 style="font-size: 1.15rem; font-weight: 800;">
          ${isDev ? 'Все обращения пользователей платформы' : 'Ваши обращения и предложения'}
        </h3>
        <button class="btn btn-secondary btn-sm" onclick="window.refreshTickets()">🔄 Обновить</button>
      </div>

      <div id="tickets-container" style="display: flex; flex-direction: column; gap: 14px;">
        <div style="text-align: center; color: var(--text-dim); padding: 20px;">Загрузка обращений...</div>
      </div>
    </div>

    <!-- Модалка нового обращения -->
    <div id="new-ticket-modal" class="modal-overlay" style="display: none;">
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">Создать обращение</h3>
          <button class="modal-close" onclick="window.closeNewTicketModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Тип обращения:</label>
            <select id="ticket-kind-select" class="input">
              <option value="вопрос">❓ Вопрос по заданиям или платформе</option>
              <option value="предложение" selected>💡 Предложение по улучшению</option>
              <option value="жалоба">⚠️ Жалоба на ошибку или нарушение</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Текст обращения:</label>
            <textarea id="ticket-text-input" class="input" rows="5" placeholder="Опишите подробно ваш вопрос или идею..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="window.closeNewTicketModal()">Отмена</button>
          <button class="btn btn-primary" onclick="window.submitTicket()">Отправить в поддержку</button>
        </div>
      </div>
    </div>
  `;

  async function loadTickets() {
    const box = document.getElementById('tickets-container');
    if (!box) return;

    const tickets = await supabase.getSupportTickets(me.login, isDev);

    if (!tickets || tickets.length === 0) {
      box.innerHTML = `
        <div style="text-align: center; color: var(--text-dim); padding: 30px;">
          📭 Обращений пока нет.
        </div>
      `;
      return;
    }

    box.innerHTML = tickets.map(t => {
      let statusBadge = '<span class="badge" style="background:#F59E0B; color:#000;">НА РАССМОТРЕНИИ</span>';
      if (t.status === 'approved') {
        statusBadge = '<span class="badge badge-approved">ОДОБРЕНО</span>';
      } else if (t.status === 'closed') {
        statusBadge = '<span class="badge badge-closed">ЗАКРЫТО</span>';
      } else if (t.status === 'review') {
        statusBadge = '<span class="badge" style="background:#3B82F6; color:#FFF;">ОТВЕЧЕНО</span>';
      }

      const timeStr = new Date(t.created_at).toLocaleString();

      return `
        <div style="background: var(--surface-variant); padding: 16px; border-radius: var(--radius-md); border-left: 4px solid var(--primary);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <span style="font-weight: 800; font-size: 0.95rem;">Тикет #${t.id} · ${t.kind.toUpperCase()}</span>
              <div style="font-size: 0.8rem; color: var(--text-dim);">От: ${t.from_name} (${t.from_login || 'Гость'}) · ${timeStr}</div>
            </div>
            <div>${statusBadge}</div>
          </div>

          <div style="margin: 10px 0; font-size: 0.95rem; color: var(--text-main); line-height: 1.5;">
            ${t.text}
          </div>

          ${t.reply ? `
            <div style="background: var(--surface); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-top: 10px;">
              <div style="font-size: 0.8rem; font-weight: 700; color: #10B981; margin-bottom: 4px;">
                💬 Ответ службы поддержки (${t.replied_by || 'Агент'}):
              </div>
              <div style="font-size: 0.9rem; color: var(--text-main);">${t.reply}</div>
            </div>
          ` : ''}

          ${isDev ? `
            <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-sm btn-primary" onclick="window.replyTicket(${t.id})">Ответить</button>
              <button class="btn btn-sm btn-secondary" style="color: #10B981;" onclick="window.changeTicketStatus(${t.id}, 'approved')">Одобрить</button>
              <button class="btn btn-sm btn-secondary" style="color: #EF4444;" onclick="window.changeTicketStatus(${t.id}, 'closed')">Закрыть</button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  window.openNewTicketModal = () => {
    document.getElementById('new-ticket-modal').style.display = 'flex';
  };
  window.closeNewTicketModal = () => {
    document.getElementById('new-ticket-modal').style.display = 'none';
  };

  window.submitTicket = async () => {
    const kind = document.getElementById('ticket-kind-select').value;
    const text = document.getElementById('ticket-text-input').value.trim();

    if (text.length < 5) {
      alert('Пожалуйста, опишите обращение подробнее (минимум 5 символов)');
      return;
    }

    sound.click();
    window.closeNewTicketModal();
    document.getElementById('ticket-text-input').value = '';

    await supabase.sendSupportTicket(me, kind, text);
    alert('Обращение успешно отправлено!');
    await loadTickets();
  };

  window.replyTicket = async (id) => {
    const rep = prompt('Введите ответ службы поддержки:');
    if (rep && rep.trim()) {
      await supabase.replySupportTicket(id, rep.trim(), me.display_name, 'review');
      alert('Ответ успешно опубликован!');
      await loadTickets();
    }
  };

  window.changeTicketStatus = async (id, status) => {
    await supabase.replySupportTicket(id, '', me.display_name, status);
    await loadTickets();
  };

  window.refreshTickets = async () => {
    sound.click();
    await loadTickets();
  };

  await loadTickets();
}
