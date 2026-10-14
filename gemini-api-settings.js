(function () {
  if (document.getElementById('gemini-api-settings-button')) return;

  const activeApiKeyStorageKey = 'geminiActiveApiKey';
  const savedApiKeysStorageKey = 'geminiApiKeyBackups';

  const style = document.createElement('style');
  style.textContent = `
    #gemini-api-settings-button {
      position: fixed;
      left: 20px;
      bottom: 20px;
      z-index: 1000;
      display: grid;
      width: 52px;
      height: 52px;
      place-items: center;
      border: 1px solid #dbe2ef;
      border-radius: 50%;
      background: #fff;
      color: #334155;
      box-shadow: 0 8px 24px rgb(15 23 42 / 18%);
      cursor: pointer;
      font: inherit;
      font-size: 23px;
      transition: transform .15s ease, background .15s ease;
    }
    #gemini-api-settings-button:hover {
      transform: translateY(-2px);
      background: #f8fafc;
    }
    #gemini-api-settings-dialog {
      width: min(520px, calc(100% - 28px));
      max-height: min(80vh, 680px);
      padding: 0;
      overflow: auto;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      color: #172033;
      box-shadow: 0 24px 80px rgb(15 23 42 / 30%);
      font: 15px/1.5 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #gemini-api-settings-dialog::backdrop {
      background: rgb(15 23 42 / 52%);
      backdrop-filter: blur(3px);
    }
    .gemini-settings-content { padding: 22px; }
    .gemini-settings-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }
    .gemini-settings-header h2 { margin: 0; font-size: 20px; }
    .gemini-settings-header p { margin: 5px 0 0; color: #64748b; font-size: 13px; }
    .gemini-settings-close {
      width: 36px;
      height: 36px;
      flex: 0 0 auto;
      border: 0;
      border-radius: 10px;
      background: #f1f5f9;
      color: #334155;
      cursor: pointer;
      font: inherit;
      font-size: 20px;
    }
    .gemini-settings-form { display: grid; gap: 10px; }
    .gemini-settings-form label { font-size: 13px; font-weight: 700; }
    .gemini-settings-form input {
      width: 100%;
      min-height: 44px;
      padding: 9px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      color: #172033;
      font: inherit;
    }
    .gemini-settings-form button,
    .gemini-settings-key-actions button {
      min-height: 38px;
      padding: 7px 12px;
      border: 1px solid #dbe2ef;
      border-radius: 9px;
      background: #f8fafc;
      color: #334155;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
    }
    .gemini-settings-form button {
      justify-self: start;
      border-color: #4f46e5;
      background: #4f46e5;
      color: #fff;
    }
    .gemini-settings-active-details {
      display: grid;
      gap: 9px;
      margin-top: 16px;
      padding: 13px;
      border: 1px solid #a7f3d0;
      border-radius: 11px;
      background: #ecfdf5;
    }
    .gemini-settings-active-details[hidden] { display: none; }
    .gemini-settings-active-details label {
      display: grid;
      gap: 4px;
      color: #166534;
      font-size: 12px;
      font-weight: 700;
    }
    .gemini-settings-active-details input {
      width: 100%;
      min-height: 40px;
      padding: 8px 10px;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      background: #fff;
      color: #172033;
      font: inherit;
      font-size: 13px;
    }
    .gemini-settings-hint,
    .gemini-settings-status {
      margin: 12px 0 0;
      color: #64748b;
      font-size: 12px;
    }
    .gemini-settings-status:empty { display: none; }
    .gemini-settings-status[data-error="true"] { color: #b91c1c; }
    .gemini-settings-list {
      display: grid;
      gap: 8px;
      margin-top: 12px;
    }
    .gemini-settings-key {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px;
      border: 1px solid #e2e8f0;
      border-radius: 11px;
      background: #f8fafc;
    }
    .gemini-settings-key-name {
      min-width: 0;
      overflow-wrap: anywhere;
      font-size: 13px;
      font-weight: 700;
    }
    .gemini-settings-active {
      display: block;
      color: #047857;
      font-size: 11px;
      font-weight: 700;
    }
    .gemini-settings-key-actions {
      display: flex;
      flex: 0 0 auto;
      gap: 6px;
    }
    .gemini-settings-empty { color: #64748b; font-size: 13px; }
    @media (max-width: 480px) {
      #gemini-api-settings-button { left: 14px; bottom: 14px; }
      .gemini-settings-content { padding: 18px; }
      .gemini-settings-key { align-items: flex-start; flex-direction: column; }
      .gemini-settings-key-actions { width: 100%; }
    }
  `;
  document.head.appendChild(style);

  const settingsButton = document.createElement('button');
  settingsButton.id = 'gemini-api-settings-button';
  settingsButton.type = 'button';
  settingsButton.setAttribute('aria-label', 'Pengaturan API Gemini');
  settingsButton.title = 'Pengaturan API Gemini';
  settingsButton.textContent = '⚙';
  document.body.appendChild(settingsButton);

  const dialog = document.createElement('dialog');
  dialog.id = 'gemini-api-settings-dialog';
  dialog.setAttribute('aria-labelledby', 'gemini-api-settings-title');
  dialog.innerHTML = `
    <div class="gemini-settings-content">
      <div class="gemini-settings-header">
        <div>
          <h2 id="gemini-api-settings-title">Pengaturan API Gemini</h2>
          <p>Simpan beberapa API key agar mudah digunakan di halaman Tanya (DOD).</p>
        </div>
        <button class="gemini-settings-close" type="button" aria-label="Tutup pengaturan">×</button>
      </div>
      <form class="gemini-settings-form">
        <label for="gemini-settings-name">Nama API key</label>
        <input id="gemini-settings-name" type="text" maxlength="60" autocomplete="off" placeholder="Contoh: Akun utama" required>
        <label for="gemini-settings-key">Gemini API key</label>
        <input id="gemini-settings-key" type="password" autocomplete="off" spellcheck="false" placeholder="Masukkan API key Gemini" required>
        <button type="submit">Simpan API key</button>
      </form>
      <div class="gemini-settings-active-details" hidden>
        <label for="gemini-settings-active-name">Nama API key aktif</label>
        <input id="gemini-settings-active-name" type="text" readonly>
        <label for="gemini-settings-active-key">Gemini API key aktif</label>
        <input id="gemini-settings-active-key" type="text" readonly spellcheck="false">
      </div>
      <p class="gemini-settings-hint">API key disimpan tanpa enkripsi di penyimpanan browser ini. Hindari perangkat bersama.</p>
      <div class="gemini-settings-status" role="status" aria-live="polite"></div>
      <div class="gemini-settings-list" aria-live="polite"></div>
    </div>
  `;
  document.body.appendChild(dialog);

  const form = dialog.querySelector('.gemini-settings-form');
  const nameInput = dialog.querySelector('#gemini-settings-name');
  const keyInput = dialog.querySelector('#gemini-settings-key');
  const status = dialog.querySelector('.gemini-settings-status');
  const keyList = dialog.querySelector('.gemini-settings-list');
  const activeDetails = dialog.querySelector('.gemini-settings-active-details');
  const activeNameInput = dialog.querySelector('#gemini-settings-active-name');
  const activeKeyInput = dialog.querySelector('#gemini-settings-active-key');

  function setStatus(message, isError) {
    status.textContent = message;
    status.dataset.error = isError ? 'true' : 'false';
  }

  function showActiveApiKey(entries, activeKey) {
    if (!activeKey) {
      activeDetails.hidden = true;
      activeNameInput.value = '';
      activeKeyInput.value = '';
      return;
    }

    const activeEntry = entries.find(entry => entry.key === activeKey);
    activeNameInput.value = activeEntry ? activeEntry.name : 'API key aktif (nama tidak tersedia)';
    activeKeyInput.value = activeKey;
    activeDetails.hidden = false;
  }

  function readSavedApiKeys() {
    const stored = localStorage.getItem(savedApiKeysStorageKey);
    if (!stored) return [];

    const entries = JSON.parse(stored);
    if (!Array.isArray(entries) || entries.some(entry =>
      !entry ||
      typeof entry.id !== 'string' ||
      typeof entry.name !== 'string' ||
      typeof entry.key !== 'string'
    )) {
      throw new Error('Format data API key cadangan tidak valid.');
    }
    return entries;
  }

  function renderSavedApiKeys() {
    keyList.replaceChildren();
    let entries;
    let activeKey;

    try {
      entries = readSavedApiKeys();
      activeKey = localStorage.getItem(activeApiKeyStorageKey);
      showActiveApiKey(entries, activeKey);
    } catch (error) {
      const message = document.createElement('span');
      message.className = 'gemini-settings-empty';
      message.textContent = `Gagal membaca penyimpanan API key: ${error.message}`;
      keyList.appendChild(message);
      setStatus('Periksa izin penyimpanan browser atau format data API key.', true);
      return;
    }

    if (!entries.length) {
      const message = document.createElement('span');
      message.className = 'gemini-settings-empty';
      message.textContent = 'Belum ada API key tersimpan.';
      keyList.appendChild(message);
      return;
    }

    for (const entry of entries) {
      const row = document.createElement('div');
      row.className = 'gemini-settings-key';

      const details = document.createElement('div');
      const name = document.createElement('span');
      name.className = 'gemini-settings-key-name';
      name.textContent = entry.name;
      details.appendChild(name);

      if (entry.key === activeKey) {
        const activeLabel = document.createElement('span');
        activeLabel.className = 'gemini-settings-active';
        activeLabel.textContent = 'API key aktif';
        details.appendChild(activeLabel);
      }

      const actions = document.createElement('div');
      actions.className = 'gemini-settings-key-actions';

      const useButton = document.createElement('button');
      useButton.type = 'button';
      useButton.textContent = 'Gunakan';
      useButton.addEventListener('click', () => {
        try {
          localStorage.setItem(activeApiKeyStorageKey, entry.key);
          showActiveApiKey(entries, entry.key);
          window.dispatchEvent(new CustomEvent('gemini-active-api-key-changed', {
            detail: { key: entry.key }
          }));
          setStatus(`API key "${entry.name}" sekarang aktif.`, false);
          renderSavedApiKeys();
        } catch (error) {
          setStatus(`Gagal mengaktifkan API key: ${error.message}`, true);
        }
      });

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'Hapus';
      deleteButton.setAttribute('aria-label', `Hapus API key ${entry.name}`);
      deleteButton.addEventListener('click', () => {
        try {
          const remainingEntries = readSavedApiKeys().filter(
            savedEntry => savedEntry.id !== entry.id
          );
          localStorage.setItem(savedApiKeysStorageKey, JSON.stringify(remainingEntries));
          window.dispatchEvent(new Event('gemini-api-keys-changed'));
          setStatus(`API key "${entry.name}" dihapus.`, false);
          renderSavedApiKeys();
        } catch (error) {
          setStatus(`Gagal menghapus API key: ${error.message}`, true);
        }
      });

      actions.append(useButton, deleteButton);
      row.append(details, actions);
      keyList.appendChild(row);
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const key = keyInput.value.trim();
    if (!name || !key) {
      setStatus('Nama dan API key wajib diisi.', true);
      return;
    }

    try {
      const entries = readSavedApiKeys();
      entries.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        key
      });
      localStorage.setItem(savedApiKeysStorageKey, JSON.stringify(entries));
      nameInput.value = '';
      keyInput.value = '';
      window.dispatchEvent(new Event('gemini-api-keys-changed'));
      setStatus(`API key "${name}" berhasil disimpan.`, false);
      renderSavedApiKeys();
    } catch (error) {
      setStatus(`Gagal menyimpan API key: ${error.message}`, true);
    }
  });

  settingsButton.addEventListener('click', () => {
    setStatus('', false);
    renderSavedApiKeys();
    dialog.showModal();
  });
  dialog.querySelector('.gemini-settings-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  window.addEventListener('gemini-api-keys-changed', renderSavedApiKeys);
  window.addEventListener('gemini-active-api-key-changed', renderSavedApiKeys);
  window.addEventListener('storage', (event) => {
    if (event.key === savedApiKeysStorageKey || event.key === activeApiKeyStorageKey) {
      renderSavedApiKeys();
    }
  });
})();
