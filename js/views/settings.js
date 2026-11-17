// ==========================================================================
// НАСТРОЙКИ ПРИЛОЖЕНИЯ И ИНСТРУКЦИЯ PWA ДЛЯ IPHONE / ПК
// ==========================================================================

import { store } from '../store.js';
import { sound } from '../audio.js';

export function renderSettings(container) {
  const currentSettings = store.getSettings();

  container.innerHTML = `
    <div style="max-width: 760px; margin: 0 auto;">
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 6px;">⚙️ Настройки и PWA</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          Управление темой, звуками, кэшированием и установка на главный экран смартфона или рабочий стол ПК.
        </p>
      </div>

      <!-- Внешний вид и эффекты -->
      <div class="card" style="margin-bottom: 20px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 16px;">🎨 Внешний вид и звуки</h3>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border);">
          <div>
            <div style="font-weight: 700;">Цветовая тема</div>
            <div style="font-size: 0.8rem; color: var(--text-dim);">Тёмная тема экономит заряд на OLED / iPhone</div>
          </div>
          <select id="setting-theme" class="input" style="width: 140px;" onchange="window.toggleTheme(this.value)">
            <option value="dark" ${currentSettings.theme === 'dark' ? 'selected' : ''}>🌙 Тёмная</option>
            <option value="light" ${currentSettings.theme === 'light' ? 'selected' : ''}>☀️ Светлая</option>
          </select>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border);">
          <div>
            <div style="font-weight: 700;">Звуковые эффекты</div>
            <div style="font-size: 0.8rem; color: var(--text-dim);">Аудио-клики и фанфары при решении задач</div>
          </div>
          <input type="checkbox" id="setting-sound" style="width: 22px; height: 22px; accent-color: var(--primary);" 
            ${currentSettings.sound ? 'checked' : ''} onchange="window.toggleSound(this.checked)">
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
          <div>
            <div style="font-weight: 700;">Тактильный отклик (Вибрация)</div>
            <div style="font-size: 0.8rem; color: var(--text-dim);">Виброотклик на смартфонах при нажатии кнопок</div>
          </div>
          <input type="checkbox" id="setting-haptics" style="width: 22px; height: 22px; accent-color: var(--primary);" 
            ${currentSettings.haptics ? 'checked' : ''} onchange="window.toggleHaptics(this.checked)">
        </div>
      </div>

      <!-- PWA: Установка на iPhone и ПК -->
      <div class="card" style="margin-bottom: 20px; border-left: 4px solid #6366F1;">
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 12px;">📱 Установка PWA на iPhone (iOS) и ПК</h3>
        
        <div style="margin-bottom: 16px;">
          <h4 style="color: #A5B4FC; font-size: 0.95rem; margin-bottom: 6px;">🍏 Для iPhone / iPad (Safari):</h4>
          <ol style="margin-left: 20px; font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary);">
            <li>Откройте сайт в браузере <strong>Safari</strong> на вашем iPhone.</li>
            <li>Нажмите кнопку <strong>«Поделиться»</strong> (квадрат со стрелкой вверх внизу экрана).</li>
            <li>Прокрутите вниз и выберите <strong>«На экран "Домой"»</strong> (Add to Home Screen).</li>
            <li>Нажмите <strong>«Добавить»</strong>. Квестефи появится на рабочем столе как полноценное нативное приложение без рамок браузера!</li>
          </ol>
        </div>

        <div>
          <h4 style="color: #06B6D4; font-size: 0.95rem; margin-bottom: 6px;">💻 Для ПК (Chrome / Edge / Яндекс):</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px;">
            В адресной строке нажмите значок <strong>«Установить приложение»</strong> (монитор со стрелкой) для запуска Квестефи в отдельном окне на рабочем столе.
          </p>
          <button id="pwa-install-btn" class="btn btn-primary btn-sm" style="display: none;" onclick="window.triggerPwaInstall()">
            ⬇️ Установить Квестефи на рабочий стол
          </button>
        </div>
      </div>

      <!-- Оффлайн-кэш и статус базы -->
      <div class="card" style="margin-bottom: 24px;">
        <h3 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 12px;">💾 База знаний и оффлайн-режим</h3>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 14px;">
          В локальный кэш загружено <strong>11 550 заданий</strong> по 11 школьным дисциплинам. Приложение полностью работоспособно даже без подключения к интернету.
        </p>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="window.clearAppCache()">
            🧹 Очистить кэш и обновить
          </button>
        </div>
      </div>
    </div>
  `;

  window.toggleTheme = (theme) => {
    store.saveSettings({ theme });
    document.body.className = theme === 'light' ? 'theme-light' : '';
    sound.click();
  };

  window.toggleSound = (enabled) => {
    sound.enabled = enabled;
    store.saveSettings({ sound: enabled });
    if (enabled) sound.click();
  };

  window.toggleHaptics = (enabled) => {
    store.saveSettings({ haptics: enabled });
    if (enabled) sound.vibrate(20);
  };

  window.clearAppCache = async () => {
    if (confirm('Очистить оффлайн-кэш и перезагрузить приложение?')) {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      localStorage.clear();
      window.location.reload();
    }
  };

  // Проверка PWA Install Prompt
  if (window._deferredPwaPrompt) {
    const btn = document.getElementById('pwa-install-btn');
    if (btn) btn.style.display = 'inline-flex';
  }

  window.triggerPwaInstall = () => {
    if (window._deferredPwaPrompt) {
      window._deferredPwaPrompt.prompt();
      window._deferredPwaPrompt.userChoice.then(() => {
        window._deferredPwaPrompt = null;
        document.getElementById('pwa-install-btn').style.display = 'none';
      });
    }
  };
}
