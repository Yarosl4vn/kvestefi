// ==========================================================================
// ЧАТ И СООБЩЕНИЯ (РЕАЛЬНОЕ ВРЕМЯ + SUPABASE)
// ==========================================================================

import { store } from '../store.js';
import { supabase } from '../supabase.js';
import { sound } from '../audio.js';

export async function renderChat(container) {
  const me = store.currentUser;
  if (!me) {
    window.location.hash = '#auth';
    return;
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <div>
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 4px;">💬 Сообщения и Чат</h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">Прямая связь с одноклассниками, учителями и разработчиками платформы</p>
      </div>

      ${me.role === 'developer' ? `
        <button class="btn btn-primary btn-sm" onclick="window.openBroadcastModal()">
          📢 Рассылка всем
        </button>
      ` : ''}
    </div>

    <div class="card" style="padding: 0; display: flex; height: 600px; max-height: calc(100vh - 220px); overflow: hidden;">
      <!-- Список собеседников -->
      <div style="width: 280px; border-right: 1px solid var(--border); background: var(--surface-variant); display: flex; flex-direction: column;">
        <div style="padding: 14px; border-bottom: 1px solid var(--border); font-weight: 700; font-size: 0.9rem;">
          Диалоги
        </div>
        <div id="chat-threads-list" style="flex: 1; overflow-y: auto;">
          <div class="nav-link active" style="margin: 8px; border-radius: var(--radius-md);">
            <span style="font-size: 1.3rem;">🌐</span>
            <div style="overflow: hidden;">
              <div style="font-weight: 700; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">Общий чат / Оповещения</div>
              <div style="font-size: 0.75rem; color: var(--text-dim);">Все 39 школ</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Окно переписки -->
      <div style="flex: 1; display: flex; flex-direction: column; background: var(--surface);">
        <div style="padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 1.05rem;" id="chat-header-title">Общий канал оповещений</div>
          <button class="btn btn-secondary btn-sm" onclick="window.refreshMessages()">🔄 Обновить</button>
        </div>

        <div id="chat-messages-box" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
          <div style="text-align: center; color: var(--text-dim); font-size: 0.9rem;">Загрузка сообщений...</div>
        </div>

        <div style="padding: 14px 18px; border-top: 1px solid var(--border); display: flex; gap: 10px; background: var(--surface-variant);">
          <input type="text" id="chat-input" class="input" placeholder="Напишите сообщение..." onkeydown="if(event.key==='Enter') window.sendChatMessage()">
          <button class="btn btn-primary" onclick="window.sendChatMessage()">Отправить</button>
        </div>
      </div>
    </div>
  `;

  async function loadAndDisplayMessages() {
    const box = document.getElementById('chat-messages-box');
    if (!box) return;

    const msgs = await supabase.getMessages(me.login);

    if (!msgs || msgs.length === 0) {
      box.innerHTML = `
        <div style="text-align: center; color: var(--text-dim); margin-top: 40px;">
          📭 Нет новых сообщений. Отправьте первое сообщение!
        </div>
      `;
      return;
    }

    box.innerHTML = msgs.map(m => {
      const isMine = m.from_login === me.login;
      const isBroadcast = m.to_login === 'all';
      const timeStr = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return `
        <div style="display: flex; flex-direction: column; align-items: ${isMine ? 'flex-end' : 'flex-start'};">
          <div style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 3px; font-weight: 600;">
            ${isMine ? 'Вы' : m.from_name} ${isBroadcast ? '· <span style="color: #F59E0B;">[Оповещение]</span>' : ''} · ${timeStr}
          </div>
          <div style="
            max-width: 75%;
            padding: 10px 16px;
            border-radius: var(--radius-md);
            background: ${isMine ? 'var(--primary)' : 'var(--surface-variant)'};
            color: ${isMine ? 'var(--on-primary)' : 'var(--text-main)'};
            font-size: 0.95rem;
            word-break: break-word;
            box-shadow: var(--shadow-sm);
          ">
            ${m.text}
          </div>
        </div>
      `;
    }).join('');

    box.scrollTop = box.scrollHeight;
  }

  window.sendChatMessage = async () => {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';
    sound.click();

    await supabase.sendMessage(me, 'all', 'Все пользователи', text);
    await loadAndDisplayMessages();
  };

  window.refreshMessages = async () => {
    sound.click();
    await loadAndDisplayMessages();
  };

  window.openBroadcastModal = () => {
    const text = prompt('Введите текст объявления всем пользователям (ученикам, учителям, поддержке):');
    if (text && text.trim()) {
      supabase.sendMessage(me, 'all', 'Все пользователи', text.trim()).then(() => {
        alert('Объявление успешно отправлено всем пользователям!');
        loadAndDisplayMessages();
      });
    }
  };

  await loadAndDisplayMessages();
}
