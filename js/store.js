// ==========================================================================
// ЛОКАЛЬНОЕ ХРАНИЛИЩЕ (INDEXEDDB + LOCALSTORAGE) ДЛЯ ОФФЛАЙН-РЕЖИМА
// ==========================================================================

import { LEVELING } from './data.js';

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

    // Если пользователя нет — по умолчанию вход как Ярослав Акинфиев (Главный разработчик)
    if (!this.currentUser) {
      this.currentUser = {
        login: 'yaroslav',
        display_name: 'Ярослав Акинфиев',
        role: 'developer',
        school_code: 'KVDEV',
        school_name: 'МБОУ «СОШ № 29»',
        grade: '11',
        letter: 'А',
        subject: 'Информатика',
        homeroom: '11А',
        avatar: '🛡️',
        score: 35000,
        prefix: '[Разработчик] ReadySquad',
        nick_color: '#6750A4',
        streak: 5,
        solvedCount: 142
      };
      this.saveUser();
    }

    // 2. Загрузить базу заданий (11 550 заданий)
    await this.loadTasks();
    this.isLoaded = true;
  }

  saveUser() {
    if (this.currentUser) {
      localStorage.setItem('kvestefi_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('kvestefi_user');
    }
  }

  logout() {
    this.currentUser = null;
    this.saveUser();
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

  // Получить случайные задания без повторов
  getRandomTasks(subjectCode, count = 10, usedIndices = new Set()) {
    const list = this.tasksBySubject[subjectCode] || this.tasks;
    if (!list || list.length === 0) return [];

    const available = list.filter((_, idx) => !usedIndices.has(idx));
    const pool = available.length >= count ? available : list;

    // Перемешивание Фишера-Йейтса
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

  // Локальные настройки приложения
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
