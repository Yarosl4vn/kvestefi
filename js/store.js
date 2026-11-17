// ==========================================================================
// ЛОКАЛЬНОЕ ХРАНИЛИЩЕ (INDEXEDDB + LOCALSTORAGE) ДЛЯ ОФФЛАЙН-РЕЖИМА
// ==========================================================================

import { LEVELING, SCHOOLS } from './data.js';

export const PRESET_ACCOUNTS = {
  yaroslav: {
    login: 'yaroslav',
    display_name: 'Ярослав Акинфиев',
    role: 'developer',
    school_code: '201026',
    school_name: 'МБОУ «СОШ № 29» г. Мытищи',
    grade: '9',
    letter: 'Б',
    subject: 'Информатика',
    homeroom: '9Б',
    avatar: '🛡️',
    score: 35000,
    prefix: '[Разработчик] ReadySquad',
    nick_color: '#818CF8',
    streak: 5,
    solvedCount: 142,
    goal: 15
  },
  khaidaroli: {
    login: 'khaidaroli',
    display_name: 'Хайдароли Довлатов',
    role: 'developer',
    school_code: '201026',
    school_name: 'МБОУ «СОШ № 29» г. Мытищи',
    grade: '9',
    letter: 'Б',
    subject: 'Математика',
    homeroom: '9Б',
    avatar: '🚀',
    score: 28000,
    prefix: '[Разработчик] ReadySquad',
    nick_color: '#818CF8',
    streak: 4,
    solvedCount: 110,
    goal: 15
  },
  teacher: {
    login: 'teacher',
    display_name: 'Семёнов Роман Олегович',
    role: 'teacher',
    school_code: '201026',
    school_name: 'МБОУ «СОШ № 29» г. Мытищи',
    grade: '10',
    letter: 'Б',
    subject: 'Математика',
    homeroom: '10Б',
    avatar: '📚',
    score: 12500,
    prefix: '[Учитель] Математика',
    nick_color: '#A5B4FC',
    streak: 3,
    solvedCount: 88,
    goal: 20
  },
  student_alex: {
    login: 'student_alex',
    display_name: 'Алексей Смирнов',
    role: 'student',
    school_code: '201026',
    school_name: 'МБОУ «СОШ № 29» г. Мытищи',
    grade: '9',
    letter: 'Б',
    subject: 'Физика',
    homeroom: '9Б',
    avatar: '🦁',
    score: 3200,
    prefix: 'Ученик',
    nick_color: '#34D399',
    streak: 2,
    solvedCount: 26,
    goal: 10
  },
  school29_admin: {
    login: 'school29_admin',
    display_name: 'Администратор Школы № 29',
    role: 'school_admin',
    school_code: '201026',
    school_name: 'МБОУ «СОШ № 29» г. Мытищи',
    grade: '',
    letter: '',
    subject: 'Обществознание',
    homeroom: 'Администрация',
    avatar: '🏛️',
    score: 18000,
    prefix: '[Куратор] Школа № 29',
    nick_color: '#FBBF24',
    streak: 7,
    solvedCount: 95,
    goal: 15
  }
};

class AppStore {
  constructor() {
    this.currentUser = null;
    this.tasks = [];
    this.tasksBySubject = {};
    this.isLoaded = false;
  }

  async init() {
    // 1. Восстановить сессию пользователя
    const savedUser = localStorage.getItem('kvestefi_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        this.currentUser = null;
      }
    }

    // 2. Загрузить банк заданий (11 550 заданий)
    await this.loadTasks();
    this.isLoaded = true;
  }

  isOnboarded() {
    return localStorage.getItem('kvestefi_onboarded') === 'true';
  }

  setOnboarded(val = true) {
    if (val) {
      localStorage.setItem('kvestefi_onboarded', 'true');
    } else {
      localStorage.removeItem('kvestefi_onboarded');
    }
  }

  saveUser() {
    if (this.currentUser) {
      localStorage.setItem('kvestefi_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('kvestefi_user');
    }
  }

  loginAs(presetKey) {
    if (PRESET_ACCOUNTS[presetKey]) {
      this.currentUser = { ...PRESET_ACCOUNTS[presetKey] };
      this.saveUser();
      this.setOnboarded(true);
      return this.currentUser;
    }
    return null;
  }

  login(login, password) {
    // Проверка пресетов
    for (const key in PRESET_ACCOUNTS) {
      if (PRESET_ACCOUNTS[key].login.toLowerCase() === login.trim().toLowerCase()) {
        this.currentUser = { ...PRESET_ACCOUNTS[key] };
        this.saveUser();
        this.setOnboarded(true);
        return { success: true, user: this.currentUser };
      }
    }

    // Проверка сохраненных пользователей
    const customUsers = JSON.parse(localStorage.getItem('kvestefi_custom_users') || '[]');
    const found = customUsers.find(u => u.login.toLowerCase() === login.trim().toLowerCase());
    if (found) {
      this.currentUser = { ...found };
      this.saveUser();
      this.setOnboarded(true);
      return { success: true, user: this.currentUser };
    }

    // Гостевой вход с введенным логином
    const guestUser = {
      login: login.trim().toLowerCase() || 'guest',
      display_name: login.trim() || 'Гость',
      role: 'guest',
      school_code: '201026',
      school_name: 'МБОУ «СОШ № 29» г. Мытищи',
      grade: '9',
      letter: 'Б',
      subject: 'Математика',
      homeroom: '9Б',
      avatar: '🛡️',
      score: 50,
      prefix: 'Гость',
      nick_color: '#34D399',
      streak: 1,
      solvedCount: 1,
      goal: 10
    };
    this.currentUser = guestUser;
    this.saveUser();
    this.setOnboarded(true);
    return { success: true, user: this.currentUser };
  }

  register(userData) {
    const newUser = {
      login: (userData.login || 'user_' + Date.now()).toLowerCase().trim(),
      display_name: userData.display_name || 'Ученик',
      role: userData.role || 'student',
      school_code: userData.school_code || '201026',
      school_name: userData.school_name || 'МБОУ «СОШ № 29» г. Мытищи',
      grade: userData.grade || '9',
      letter: userData.letter || 'Б',
      subject: userData.subject || 'Математика',
      homeroom: `${userData.grade || '9'}${userData.letter || 'Б'}`,
      avatar: userData.avatar || '🛡️',
      score: 100,
      prefix: userData.role === 'teacher' ? '[Учитель]' : 'Ученик',
      nick_color: userData.role === 'teacher' ? '#A5B4FC' : '#34D399',
      streak: 1,
      solvedCount: 0,
      goal: userData.goal || 15
    };

    const customUsers = JSON.parse(localStorage.getItem('kvestefi_custom_users') || '[]');
    customUsers.push(newUser);
    localStorage.setItem('kvestefi_custom_users', JSON.stringify(customUsers));

    this.currentUser = newUser;
    this.saveUser();
    this.setOnboarded(true);
    return { success: true, user: this.currentUser };
  }

  logout() {
    this.currentUser = null;
    this.saveUser();
    this.setOnboarded(false);
  }

  async loadTasks() {
    try {
      const resp = await fetch('./assets/tasks_bank.json');
      if (resp.ok) {
        this.tasks = await resp.json();
        console.log(`[Store] Loaded ${this.tasks.length} tasks from bank`);

        // Индексация по предметам
        this.tasksBySubject = {};
        for (const task of this.tasks) {
          const s = task.s;
          if (!this.tasksBySubject[s]) this.tasksBySubject[s] = [];
          this.tasksBySubject[s].push(task);
        }
      }
    } catch (e) {
      console.warn('[Store] Could not load tasks_bank.json:', e);
    }
  }

  getRandomTasks(subjectCode, count = 10, usedIndices = new Set()) {
    const list = this.tasksBySubject[subjectCode] || this.tasks;
    if (!list || list.length === 0) return [];

    const available = list.filter((_, idx) => !usedIndices.has(idx));
    const pool = available.length >= count ? available : list;

    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }

  addScore(points) {
    if (!this.currentUser) return;
    const oldLevel = LEVELING.level(this.currentUser.score);
    this.currentUser.score += points;
    this.currentUser.solvedCount = (this.currentUser.solvedCount || 0) + 1;
    const newLevel = LEVELING.level(this.currentUser.score);

    this.saveUser();
    return {
      leveledUp: newLevel > oldLevel,
      newLevel,
      points
    };
  }

  getSettings() {
    return {
      theme: localStorage.getItem('kvestefi_theme') || 'dark',
      sound: localStorage.getItem('kvestefi_sound') !== 'false',
      haptics: localStorage.getItem('kvestefi_haptics') !== 'false'
    };
  }

  saveSettings(settings) {
    if (settings.theme) localStorage.setItem('kvestefi_theme', settings.theme);
    if (settings.sound !== undefined) localStorage.setItem('kvestefi_sound', settings.sound);
    if (settings.haptics !== undefined) localStorage.setItem('kvestefi_haptics', settings.haptics);
  }
}

export const store = new AppStore();
