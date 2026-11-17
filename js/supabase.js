// ==========================================================================
// КЛИЕНТ SUPABASE REST API ДЛЯ КВЕСТЕФИ WEB
// ==========================================================================

const SUPABASE_URL = 'https://nyhrloyezoktdymkbgye.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tcrU0urUWmimGWpLghA_tg_gsxJ3ljQ';

class SupabaseService {
  constructor() {
    this.url = SUPABASE_URL;
    this.key = SUPABASE_KEY;
  }

  async sha256(text) {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async request(path, options = {}) {
    const headers = {
      'apikey': this.key,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    try {
      const resp = await fetch(`${this.url}${path}`, {
        ...options,
        headers
      });
      if (!resp.ok) {
        const errorText = await resp.text();
        console.warn(`[Supabase] ${path} error:`, resp.status, errorText);
        return { ok: false, status: resp.status, error: errorText };
      }
      const data = await resp.json().catch(() => null);
      return { ok: true, status: resp.status, data };
    } catch (e) {
      console.warn(`[Supabase] Network error on ${path}:`, e.message);
      return { ok: false, error: e.message };
    }
  }

  // --- ШКОЛЫ ---
  async getSchools() {
    const res = await this.request('/rest/v1/kvest_schools?select=*&order=name.asc');
    return res.ok ? res.data : [];
  }

  // --- ПОЛЬЗОВАТЕЛИ ---
  async login(login, password) {
    const cleanLogin = login.trim().toLowerCase();
    const passHash = await this.sha256(`${cleanLogin}:${password}`);

    const res = await this.request(`/rest/v1/kvest_users?login=eq.${encodeURIComponent(cleanLogin)}&select=*`);
    if (!res.ok || !res.data || res.data.length === 0) {
      return { ok: false, error: 'Пользователь не найден' };
    }

    const user = res.data[0];
    if (user.pass_hash !== passHash) {
      return { ok: false, error: 'Неверный пароль' };
    }

    return { ok: true, user };
  }

  async updateUserScore(login, newScore) {
    return this.request(`/rest/v1/kvest_users?login=eq.${encodeURIComponent(login)}`, {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify({ score: newScore })
    });
  }

  async updateUserPrefix(login, prefix, nickColor) {
    return this.request(`/rest/v1/kvest_users?login=eq.${encodeURIComponent(login)}`, {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify({ prefix, nick_color: nickColor })
    });
  }

  // --- СООБЩЕНИЯ ---
  async getMessages(userLogin) {
    const enc = encodeURIComponent(userLogin);
    const res = await this.request(`/rest/v1/kvest_messages?or=(from_login.eq.${enc},to_login.eq.${enc},to_login.eq.all)&order=created_at.asc&limit=150`);
    return res.ok ? res.data : [];
  }

  async sendMessage(fromAccount, toLogin, toName, text, replyText = '') {
    const payload = {
      school_code: fromAccount.school_code || 'KVDEV',
      from_login: fromAccount.login,
      from_name: fromAccount.display_name,
      to_login: toLogin,
      to_name: toName,
      text: text.trim(),
      reply_text: replyText,
      created_at: Date.now()
    };

    return this.request('/rest/v1/kvest_messages', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(payload)
    });
  }

  // --- ПОДДЕРЖКА ---
  async getSupportTickets(userLogin, isDeveloper = false) {
    const query = isDeveloper 
      ? '/rest/v1/kvest_support?order=created_at.desc&limit=100'
      : `/rest/v1/kvest_support?from_login=eq.${encodeURIComponent(userLogin)}&order=created_at.desc&limit=50`;
    const res = await this.request(query);
    return res.ok ? res.data : [];
  }

  async sendSupportTicket(user, kind, text) {
    const payload = {
      device_id: 'web-' + Math.random().toString(36).substring(2, 10),
      from_login: user ? user.login : 'guest',
      from_name: user ? user.display_name : 'Гость',
      school_code: user ? user.school_code : 'KVDEV',
      kind,
      text: text.trim(),
      status: 'pending',
      created_at: Date.now()
    };

    return this.request('/rest/v1/kvest_support', {
      method: 'POST',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(payload)
    });
  }

  async replySupportTicket(ticketId, replyText, repliedBy, newStatus = 'review') {
    const payload = {
      status: newStatus,
      reply: replyText.trim(),
      replied_by: repliedBy,
      replied_at: Date.now()
    };

    return this.request(`/rest/v1/kvest_support?id=eq.${ticketId}`, {
      method: 'PATCH',
      headers: { 'Prefer': 'return=representation' },
      body: JSON.stringify(payload)
    });
  }
}

export const supabase = new SupabaseService();
