(() => {
    if (window.__pomodoroWidgetInitialized) return;
    window.__pomodoroWidgetInitialized = true;

    const timerStorageKey = 'english_pomodoro_state_v1';
    const durationStorageKey = 'english_pomodoro_durations';
    const sessionStorageKey = 'english_pomodoro_completed_sessions';
    const collapsedStorageKey = 'english_pomodoro_collapsed';
    const youtubeStorageKey = 'english_pomodoro_youtube_v1';
    const readJson = (key, fallback) => {
        try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch { return fallback; }
    };
    const clampDuration = value => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 180 ? Number(value) : null;
    const savedTimer = readJson(timerStorageKey, {});
    const savedDurations = readJson(durationStorageKey, {});
    const durations = {
        focus: clampDuration(savedTimer.durations?.focus) || clampDuration(savedDurations.focus) || 25,
        break: clampDuration(savedTimer.durations?.break) || clampDuration(savedDurations.break) || 5
    };
    let mode = savedTimer.mode === 'break' ? 'break' : 'focus';
    let completedSessions = Number.isInteger(savedTimer.sessions)
        ? Math.min(4, Math.max(0, savedTimer.sessions))
        : Math.min(4, Math.max(0, Number.parseInt(localStorage.getItem(sessionStorageKey) || '0', 10) || 0));
    let isRunning = Boolean(savedTimer.running && Number(savedTimer.endTime) > 0);
    let endTime = isRunning ? Number(savedTimer.endTime) : 0;
    let remainingSeconds = isRunning
        ? Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
        : Math.max(0, Number(savedTimer.remainingSeconds) || durations[mode] * 60);
    let ticker = null;
    let alarmAudioContext = null;

    const existingWidget = document.getElementById('pomodoroWidget');
    const widget = existingWidget || document.createElement('section');
    widget.id = 'pomodoroWidget';
    widget.className = 'pomodoro-widget';
    widget.setAttribute('aria-label', 'Pomodoro dan pemutar YouTube');
    if (!existingWidget) {
        widget.innerHTML = `
            <div class="pomodoro-panel">
                <div class="pomodoro-header">
                    <h2 class="pomodoro-title">Pomodoro</h2>
                    <button id="pomodoroMinimize" class="pomodoro-minimize" type="button" aria-label="Perkecil Pomodoro" title="Perkecil">−</button>
                </div>
                <div class="pomodoro-modes" aria-label="Mode Pomodoro">
                    <button class="pomodoro-mode" type="button" data-pomodoro-mode="focus" aria-pressed="true">Fokus · <span id="pomodoroFocusLabel">25</span> mnt</button>
                    <button class="pomodoro-mode" type="button" data-pomodoro-mode="break" aria-pressed="false">Istirahat · <span id="pomodoroBreakLabel">5</span> mnt</button>
                </div>
                <div class="pomodoro-duration-row">
                    <label class="pomodoro-duration-field" for="pomodoroFocusDuration">Durasi fokus (menit)
                        <input id="pomodoroFocusDuration" data-pomodoro-duration="focus" type="number" min="1" max="180" step="1" value="25" inputmode="numeric">
                    </label>
                    <label class="pomodoro-duration-field" for="pomodoroBreakDuration">Durasi istirahat (menit)
                        <input id="pomodoroBreakDuration" data-pomodoro-duration="break" type="number" min="1" max="180" step="1" value="5" inputmode="numeric">
                    </label>
                </div>
                <div class="pomodoro-session-row" aria-label="Progres sesi fokus">
                    <span>Sesi</span>
                    <div id="pomodoroSessionDots" class="pomodoro-session-dots" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
                    <strong id="pomodoroSessionCount">0 / 4</strong>
                </div>
                <div id="pomodoroClock" class="pomodoro-clock" role="timer" aria-live="off">25:00</div>
                <div id="pomodoroStatus" class="pomodoro-status" role="status" aria-live="polite">Siap fokus</div>
                <div class="pomodoro-progress" aria-hidden="true"><span id="pomodoroProgress"></span></div>
                <div class="pomodoro-actions">
                    <button id="pomodoroStart" class="pomodoro-start" type="button">Mulai</button>
                    <button id="pomodoroReset" class="pomodoro-reset" type="button">Reset</button>
                </div>
                <div class="pomodoro-divider"></div>
                <label class="pomodoro-youtube-label" for="pomodoroYoutubeUrl">Putar video YouTube</label>
                <form id="pomodoroYoutubeForm" class="pomodoro-youtube-form">
                    <input id="pomodoroYoutubeUrl" type="url" placeholder="Tempel tautan YouTube" autocomplete="url" aria-describedby="pomodoroYoutubeError">
                    <button type="submit">Putar</button>
                </form>
                <div id="pomodoroYoutubeError" class="pomodoro-youtube-error" role="status" aria-live="polite"></div>
                <div id="pomodoroVideo" class="pomodoro-video"></div>
            </div>
            <button id="pomodoroExpand" class="pomodoro-expand" type="button" aria-label="Perbesar Pomodoro" aria-expanded="false" title="Perbesar Pomodoro">
                <span class="pomodoro-expand-icon" aria-hidden="true">◷</span>
                <span id="pomodoroExpandTime" class="pomodoro-expand-time">25:00</span>
            </button>`;
        document.body.appendChild(widget);
    }

    if (!widget.querySelector('#pomodoroTranslateForm')) {
        const translator = document.createElement('section');
        translator.className = 'pomodoro-translator';
        translator.innerHTML = `
            <h3 class="pomodoro-translator-title">Terjemahkan Inggris → Indonesia</h3>
            <form id="pomodoroTranslateForm">
                <label class="pomodoro-youtube-label" for="pomodoroTranslateInput">Teks bahasa Inggris</label>
                <textarea id="pomodoroTranslateInput" maxlength="2000" placeholder="Ketik atau tempel teks bahasa Inggris..." aria-describedby="pomodoroTranslateNotice"></textarea>
                <button id="pomodoroTranslateButton" type="submit">Terjemahkan</button>
            </form>
            <p id="pomodoroTranslateNotice" class="pomodoro-translate-notice">Teks akan dikirim ke Google Gemini untuk diterjemahkan.</p>
            <div id="pomodoroTranslateStatus" class="pomodoro-translate-status" role="status" aria-live="polite"></div>
            <div id="pomodoroTranslateResult" class="pomodoro-translate-result" lang="id" aria-live="polite"></div>`;
        const youtubeLabel = widget.querySelector('.pomodoro-youtube-label');
        if (youtubeLabel) {
            widget.querySelector('.pomodoro-panel').insertBefore(translator, youtubeLabel);
            const divider = document.createElement('div');
            divider.className = 'pomodoro-divider';
            translator.after(divider);
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        #pomodoroWidget, #pomodoroWidget * { box-sizing: border-box; }
        #pomodoroWidget { position: fixed; right: 20px; bottom: 20px; z-index: 900; color: #172554; font-family: Arial, sans-serif; line-height: 1.45; }
        #pomodoroWidget button, #pomodoroWidget input { font: inherit; }
        #pomodoroWidget button { display: flex; align-items: center; justify-content: center; gap: 7px; border: 0; cursor: pointer; font-weight: 700; transition: background .18s ease, color .18s ease; }
        #pomodoroWidget .pomodoro-panel { width: min(360px, calc(100vw - 24px)); max-height: calc(100dvh - 32px); overflow-y: auto; padding: 18px; background: #fff; border: 1px solid #fed7aa; border-radius: 15px; box-shadow: 0 16px 44px rgba(15, 23, 42, .22); }
        #pomodoroWidget.is-collapsed .pomodoro-panel { display: none; }
        #pomodoroWidget .pomodoro-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        #pomodoroWidget .pomodoro-title { margin: 0; font-size: 1rem; font-weight: 800; color: #172554; }
        #pomodoroWidget .pomodoro-minimize, #pomodoroWidget .pomodoro-expand { padding: 0; color: #9a3412; background: #ffedd5; }
        #pomodoroWidget .pomodoro-minimize { width: 34px; height: 34px; border-radius: 50%; font-size: 1.2rem; }
        #pomodoroWidget .pomodoro-minimize:hover, #pomodoroWidget .pomodoro-expand:hover { background: #fed7aa; color: #7c2d12; }
        #pomodoroWidget .pomodoro-modes { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 4px; background: #f1f5f9; border-radius: 10px; }
        #pomodoroWidget .pomodoro-mode { min-width: 0; padding: 9px 5px; border-radius: 7px; color: #475569; background: transparent; font-size: .82rem; }
        #pomodoroWidget .pomodoro-mode:hover { color: #172554; background: #fff7ed; }
        #pomodoroWidget .pomodoro-mode[aria-pressed="true"] { color: #fff; background: #ea580c; }
        #pomodoroWidget .pomodoro-mode[aria-pressed="true"]:hover { background: #c2410c; }
        #pomodoroWidget .pomodoro-duration-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
        #pomodoroWidget .pomodoro-duration-field { display: grid; gap: 4px; color: #475569; font-size: .74rem; font-weight: 700; }
        #pomodoroWidget .pomodoro-duration-field input { width: 100%; min-width: 0; padding: 7px 9px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; color: #172554; font-size: .86rem; }
        #pomodoroWidget .pomodoro-duration-field input:focus, #pomodoroWidget .pomodoro-youtube-form input:focus { outline: 2px solid #fdba74; border-color: #f97316; }
        #pomodoroWidget .pomodoro-session-row { display: flex; align-items: center; gap: 9px; margin-top: 14px; color: #475569; font-size: .78rem; }
        #pomodoroWidget .pomodoro-session-row strong { margin-left: auto; color: #172554; font-size: .82rem; font-variant-numeric: tabular-nums; }
        #pomodoroWidget .pomodoro-session-dots { display: flex; gap: 4px; }
        #pomodoroWidget .pomodoro-session-dots span { width: 8px; height: 8px; border-radius: 50%; background: #e2e8f0; }
        #pomodoroWidget .pomodoro-session-dots span.is-complete { background: #ea580c; }
        #pomodoroWidget .pomodoro-clock { padding: 12px 0 8px; text-align: center; color: #172554; font-size: 3rem; line-height: 1.15; font-weight: 800; font-variant-numeric: tabular-nums; }
        #pomodoroWidget .pomodoro-status { min-height: 21px; text-align: center; color: #64748b; font-size: .82rem; }
        #pomodoroWidget .pomodoro-progress { height: 6px; overflow: hidden; margin: 10px 0 14px; background: #e2e8f0; border-radius: 99px; }
        #pomodoroWidget .pomodoro-progress > span { display: block; width: 100%; height: 100%; background: #f97316; transition: width .25s linear; }
        #pomodoroWidget .pomodoro-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        #pomodoroWidget .pomodoro-actions button { min-width: 0; padding: 10px; border-radius: 9px; font-size: .88rem; }
        #pomodoroWidget .pomodoro-start { color: #fff; background: #ea580c; }
        #pomodoroWidget .pomodoro-start:hover { background: #c2410c; }
        #pomodoroWidget .pomodoro-reset { color: #334155; background: #f1f5f9; }
        #pomodoroWidget .pomodoro-reset:hover { color: #0f172a; background: #e2e8f0; }
        #pomodoroWidget .pomodoro-divider { height: 1px; margin: 16px 0; background: #e2e8f0; }
        #pomodoroWidget .pomodoro-youtube-label { display: block; margin-bottom: 7px; color: #334155; font-size: .83rem; font-weight: 700; }
        #pomodoroWidget .pomodoro-youtube-form { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 7px; }
        #pomodoroWidget .pomodoro-youtube-form input { width: 100%; min-width: 0; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: .82rem; }
        #pomodoroWidget .pomodoro-youtube-form button { padding: 9px 11px; border-radius: 8px; color: #fff; background: #b91c1c; font-size: .82rem; }
        #pomodoroWidget .pomodoro-youtube-form button:hover { background: #991b1b; }
        #pomodoroWidget .pomodoro-youtube-error { min-height: 18px; margin-top: 5px; color: #b91c1c; font-size: .75rem; }
        #pomodoroWidget .pomodoro-translator-title { margin: 0 0 8px; color: #172554; font-size: .88rem; }
        #pomodoroWidget .pomodoro-translator form { display: grid; gap: 7px; }
        #pomodoroWidget .pomodoro-translator textarea { width: 100%; min-height: 72px; resize: vertical; padding: 9px 10px; border: 1px solid #cbd5e1; border-radius: 8px; color: #172554; font: inherit; font-size: .82rem; }
        #pomodoroWidget .pomodoro-translator textarea:focus { outline: 2px solid #fdba74; border-color: #f97316; }
        #pomodoroWidget .pomodoro-translator form button { justify-self: start; padding: 8px 11px; border-radius: 8px; color: #fff; background: #ea580c; font-size: .82rem; }
        #pomodoroWidget .pomodoro-translator form button:hover:not(:disabled) { background: #c2410c; }
        #pomodoroWidget .pomodoro-translator form button:disabled { cursor: wait; opacity: .65; }
        #pomodoroWidget .pomodoro-translate-notice, #pomodoroWidget .pomodoro-translate-status { margin: 6px 0 0; color: #64748b; font-size: .72rem; }
        #pomodoroWidget .pomodoro-translate-result { display: none; margin-top: 8px; padding: 9px 10px; border-radius: 8px; background: #f1f5f9; color: #172554; font-size: .84rem; white-space: pre-wrap; overflow-wrap: anywhere; }
        #pomodoroWidget .pomodoro-translate-result:not(:empty) { display: block; }
        #pomodoroWidget .pomodoro-video { display: none; margin-top: 9px; overflow: hidden; aspect-ratio: 16 / 9; background: #0f172a; border-radius: 9px; }
        #pomodoroWidget .pomodoro-video.is-visible { display: block; }
        #pomodoroWidget .pomodoro-video iframe { display: block; width: 100%; height: 100%; border: 0; }
        #pomodoroWidget .pomodoro-expand { display: none; width: 66px; height: 66px; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 8px 24px rgba(15, 23, 42, .24); }
        #pomodoroWidget .pomodoro-expand-icon { display: block; font-size: 1.45rem; line-height: 1; }
        #pomodoroWidget .pomodoro-expand-time { display: block; margin-top: 2px; font-size: .68rem; font-variant-numeric: tabular-nums; }
        #pomodoroWidget.is-collapsed .pomodoro-expand { display: flex; width: 66px; height: 66px; flex-direction: column; border-radius: 50%; color: #fff; background: #ea580c; }
        #pomodoroWidget.is-collapsed .pomodoro-expand:hover { color: #fff; background: #c2410c; }
        @media (max-width: 768px) { #pomodoroWidget { right: 12px; bottom: 12px; } #pomodoroWidget .pomodoro-panel { max-height: calc(100dvh - 24px); } }
    `;
    document.head.appendChild(style);

    const byId = id => widget.querySelector(`#${id}`);
    const status = byId('pomodoroStatus');
    const startButton = byId('pomodoroStart');
    const durationOf = currentMode => durations[currentMode] * 60;
    const formatTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    byId('pomodoroFocusDuration').value = durations.focus;
    byId('pomodoroBreakDuration').value = durations.break;

    function saveTimerState() {
        if (isRunning) remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        const state = { mode, running: isRunning, endTime: isRunning ? endTime : 0, remainingSeconds, sessions: completedSessions, durations };
        localStorage.setItem(timerStorageKey, JSON.stringify(state));
        localStorage.setItem(durationStorageKey, JSON.stringify(durations));
        localStorage.setItem(sessionStorageKey, String(completedSessions));
    }

    function renderTimer() {
        const shownSeconds = isRunning ? Math.max(0, Math.ceil((endTime - Date.now()) / 1000)) : remainingSeconds;
        byId('pomodoroClock').textContent = formatTime(shownSeconds);
        byId('pomodoroExpandTime').textContent = formatTime(shownSeconds);
        byId('pomodoroProgress').style.width = `${Math.min(100, (shownSeconds / durationOf(mode)) * 100)}%`;
        startButton.textContent = isRunning ? 'Jeda' : 'Mulai';
        byId('pomodoroFocusLabel').textContent = durations.focus;
        byId('pomodoroBreakLabel').textContent = durations.break;
        widget.querySelectorAll('[data-pomodoro-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.pomodoroMode === mode)));
        byId('pomodoroSessionCount').textContent = `${completedSessions} / 4`;
        widget.querySelectorAll('#pomodoroSessionDots span').forEach((dot, index) => dot.classList.toggle('is-complete', index < completedSessions));
    }

    function prepareAlarmAudio() {
        const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextConstructor) return;
        if (!alarmAudioContext) alarmAudioContext = new AudioContextConstructor();
        if (alarmAudioContext.state === 'suspended') alarmAudioContext.resume().catch(() => {});
    }

    function speakAlarmFallback() {
        if (!('speechSynthesis' in window)) return;
        const alarmMessage = new SpeechSynthesisUtterance('Waktu Pomodoro selesai');
        alarmMessage.lang = 'id-ID';
        window.speechSynthesis.speak(alarmMessage);
    }

    function playPomodoroAlarm() {
        if (!alarmAudioContext) {
            speakAlarmFallback();
            return;
        }
        const playTone = () => {
            if (alarmAudioContext.state !== 'running') {
                speakAlarmFallback();
                return;
            }
            const startAt = alarmAudioContext.currentTime;
            [0, 0.32, 0.64].forEach(offset => {
                const oscillator = alarmAudioContext.createOscillator();
                const gain = alarmAudioContext.createGain();
                const toneStart = startAt + offset;
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, toneStart);
                gain.gain.setValueAtTime(0.0001, toneStart);
                gain.gain.exponentialRampToValueAtTime(0.18, toneStart + 0.025);
                gain.gain.exponentialRampToValueAtTime(0.0001, toneStart + 0.23);
                oscillator.connect(gain);
                gain.connect(alarmAudioContext.destination);
                oscillator.start(toneStart);
                oscillator.stop(toneStart + 0.24);
            });
        };
        if (alarmAudioContext.state === 'suspended') alarmAudioContext.resume().then(playTone).catch(speakAlarmFallback);
        else playTone();
    }

    function advancePhase(shouldPlayAlarm, startNextAt = Date.now()) {
        if (mode === 'focus') {
            completedSessions = Math.min(4, completedSessions + 1);
            mode = 'break';
            status.textContent = `Sesi ${completedSessions} dari 4 selesai · istirahat dimulai`;
        } else {
            const cycleCompleted = completedSessions === 4;
            if (cycleCompleted) completedSessions = 0;
            mode = 'focus';
            status.textContent = cycleCompleted ? 'Empat sesi selesai · siklus baru dimulai' : `Istirahat selesai · sesi ${completedSessions + 1} dimulai`;
        }
        remainingSeconds = durationOf(mode);
        endTime = startNextAt + remainingSeconds * 1000;
        isRunning = true;
        if (shouldPlayAlarm) playPomodoroAlarm();
    }

    function tick() {
        const now = Date.now();
        if (now >= endTime) {
            let completedPhase = false;
            let transitions = 0;
            while (now >= endTime && transitions < 10000) {
                const previousEnd = endTime;
                advancePhase(false, previousEnd);
                completedPhase = true;
                transitions++;
            }
            if (completedPhase) playPomodoroAlarm();
            saveTimerState();
        }
        remainingSeconds = Math.max(0, Math.ceil((endTime - now) / 1000));
        renderTimer();
    }

    function startTicker() {
        clearInterval(ticker);
        ticker = window.setInterval(tick, 250);
    }

    startButton.addEventListener('click', () => {
        if (isRunning) {
            remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
            isRunning = false;
            clearInterval(ticker);
            status.textContent = 'Timer dijeda';
        } else {
            prepareAlarmAudio();
            if (remainingSeconds <= 0) remainingSeconds = durationOf(mode);
            endTime = Date.now() + remainingSeconds * 1000;
            isRunning = true;
            status.textContent = mode === 'focus' ? 'Sedang fokus' : 'Sedang istirahat';
            startTicker();
        }
        saveTimerState();
        renderTimer();
    });

    byId('pomodoroReset').addEventListener('click', () => {
        clearInterval(ticker);
        isRunning = false;
        completedSessions = 0;
        remainingSeconds = durationOf(mode);
        status.textContent = 'Timer dan sesi direset';
        saveTimerState();
        renderTimer();
    });

    widget.querySelectorAll('[data-pomodoro-mode]').forEach(button => button.addEventListener('click', () => {
        if (button.dataset.pomodoroMode === mode) return;
        clearInterval(ticker);
        isRunning = false;
        mode = button.dataset.pomodoroMode;
        remainingSeconds = durationOf(mode);
        status.textContent = mode === 'focus' ? 'Siap fokus' : 'Waktunya istirahat';
        saveTimerState();
        renderTimer();
    }));

    widget.querySelectorAll('[data-pomodoro-duration]').forEach(input => input.addEventListener('change', () => {
        const durationMode = input.dataset.pomodoroDuration;
        durations[durationMode] = Math.min(180, Math.max(1, Math.round(Number(input.value) || 1)));
        if (mode === durationMode) {
            clearInterval(ticker);
            isRunning = false;
            remainingSeconds = durationOf(mode);
            status.textContent = 'Durasi diperbarui · timer direset';
        }
        saveTimerState();
        renderTimer();
    }));

    function setCollapsed(collapsed) {
        widget.classList.toggle('is-collapsed', collapsed);
        byId('pomodoroExpand').setAttribute('aria-expanded', String(!collapsed));
        localStorage.setItem(collapsedStorageKey, String(collapsed));
    }
    byId('pomodoroMinimize').addEventListener('click', () => setCollapsed(true));
    byId('pomodoroExpand').addEventListener('click', () => setCollapsed(false));
    setCollapsed(localStorage.getItem(collapsedStorageKey) === 'true');

    const translateForm = byId('pomodoroTranslateForm');
    const translateInput = byId('pomodoroTranslateInput');
    const translateButton = byId('pomodoroTranslateButton');
    const translateStatus = byId('pomodoroTranslateStatus');
    const translateResult = byId('pomodoroTranslateResult');
    translateForm.addEventListener('submit', async event => {
        event.preventDefault();
        const text = translateInput.value.trim();
        translateResult.textContent = '';
        if (!text) {
            translateStatus.textContent = 'Masukkan teks bahasa Inggris terlebih dahulu.';
            translateInput.focus();
            return;
        }

        const apiKey = localStorage.getItem('gemini_api_key')
            || localStorage.getItem('chunkspeak_api_key')
            || '';
        if (!apiKey) {
            translateStatus.textContent = 'Gemini API key belum disetel. Atur API key di halaman Vocabulary terlebih dahulu.';
            return;
        }

        translateButton.disabled = true;
        translateStatus.textContent = 'Sedang menerjemahkan dengan Gemini...';
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: 'Translate the user-provided English text into natural Indonesian. Preserve the meaning, tone, names, formatting, and line breaks. Return only the Indonesian translation without explanations or quotation marks.' }]
                    },
                    contents: [{ role: 'user', parts: [{ text }] }],
                    generationConfig: { temperature: 0.2 }
                }),
                signal: AbortSignal.timeout(30000)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error?.message || `Gemini API merespons dengan status ${response.status}.`);
            }
            const translatedText = data?.candidates?.[0]?.content?.parts
                ?.map(part => part.text || '')
                .join('')
                .trim();
            if (!translatedText) throw new Error('Gemini tidak mengembalikan hasil terjemahan.');
            translateResult.textContent = translatedText;
            translateStatus.textContent = 'Terjemahan selesai.';
        } catch (error) {
            console.error('Pomodoro translation failed.', error);
            translateStatus.textContent = error.name === 'TimeoutError'
                ? 'Permintaan terjemahan melewati batas waktu. Coba lagi.'
                : error instanceof TypeError
                    ? 'Gemini tidak dapat diakses. Periksa koneksi internet lalu coba lagi.'
                    : error.message || 'Terjemahan gagal. Silakan coba lagi.';
        } finally {
            translateButton.disabled = false;
        }
    });

    const youtubeInput = byId('pomodoroYoutubeUrl');
    const youtubeError = byId('pomodoroYoutubeError');
    const videoContainer = byId('pomodoroVideo');
    let youtubeState = readJson(youtubeStorageKey, {});
    const legacyYoutubeUrl = localStorage.getItem('english_pomodoro_youtube_url') || '';
    let youtubePlayer = null;
    let youtubeVideoId = youtubeState.videoId || '';
    let youtubeUrl = youtubeState.url || legacyYoutubeUrl;
    let youtubeTime = Math.max(0, Number(youtubeState.currentTime) || 0);
    let youtubeShouldPlay = Boolean(youtubeState.isPlaying);

    function parseYouTubeId(value) {
        try {
            const url = new URL(value);
            const host = url.hostname.replace(/^www\./, '').toLowerCase();
            if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
            if (!['youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(host)) return '';
            if (url.pathname === '/watch') return url.searchParams.get('v') || '';
            const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
            return match ? match[1] : '';
        } catch {
            return '';
        }
    }

    function persistYouTubeState() {
        if (youtubePlayer) {
            try {
                if (youtubePlayer.getPlayerState() === 1) youtubeTime = youtubePlayer.getCurrentTime();
            } catch {}
        }
        localStorage.setItem(youtubeStorageKey, JSON.stringify({ videoId: youtubeVideoId, url: youtubeUrl, currentTime: youtubeTime, isPlaying: youtubeShouldPlay }));
        if (youtubeUrl) localStorage.setItem('english_pomodoro_youtube_url', youtubeUrl);
    }

    function mountYouTubePlayer() {
        if (!window.YT?.Player || !youtubeVideoId) return;
        youtubePlayer = null;
        videoContainer.replaceChildren();
        videoContainer.classList.add('is-visible');
        const playerTarget = document.createElement('div');
        playerTarget.id = 'pomodoroYoutubePlayer';
        videoContainer.appendChild(playerTarget);
        const startAt = Math.floor(youtubeTime);
        const shouldPlay = youtubeShouldPlay;
        const playerVars = { autoplay: shouldPlay ? 1 : 0, controls: 1, playsinline: 1, rel: 0, start: startAt, enablejsapi: 1 };
        if (location.origin && location.origin !== 'null') playerVars.origin = location.origin;
        youtubePlayer = new window.YT.Player(playerTarget, {
            width: '100%',
            height: '100%',
            videoId: youtubeVideoId,
            playerVars,
            events: {
                onReady(event) {
                    const iframe = event.target.getIframe();
                    iframe.title = 'Pemutar video YouTube';
                    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
                    iframe.allowFullscreen = true;
                    if (startAt > 0) event.target.seekTo(startAt, true);
                    if (shouldPlay) event.target.playVideo();
                },
                onStateChange(event) {
                    if (event.data === window.YT.PlayerState.PLAYING) youtubeShouldPlay = true;
                    if (event.data === window.YT.PlayerState.PAUSED) youtubeShouldPlay = false;
                    if (event.data === window.YT.PlayerState.ENDED) {
                        youtubeShouldPlay = false;
                        youtubeTime = 0;
                    }
                    persistYouTubeState();
                }
            }
        });
    }

    function loadYouTubeApi() {
        if (window.YT?.Player) {
            mountYouTubePlayer();
            return;
        }
        if (window.__pomodoroYouTubeApiRequested) return;
        window.__pomodoroYouTubeApiRequested = true;
        const previousReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            if (typeof previousReady === 'function') previousReady();
            mountYouTubePlayer();
        };
        const apiScript = document.createElement('script');
        apiScript.src = 'https://www.youtube.com/iframe_api';
        apiScript.async = true;
        document.head.appendChild(apiScript);
    }

    widget.querySelector('#pomodoroYoutubeForm').addEventListener('submit', event => {
        event.preventDefault();
        const url = youtubeInput.value.trim();
        const videoId = parseYouTubeId(url);
        if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
            youtubeError.textContent = 'Masukkan tautan video YouTube yang valid.';
            return;
        }
        youtubeError.textContent = '';
        youtubeUrl = url;
        youtubeVideoId = videoId;
        youtubeTime = 0;
        youtubeShouldPlay = true;
        persistYouTubeState();
        videoContainer.classList.add('is-visible');
        loadYouTubeApi();
    });

    if (!youtubeVideoId && youtubeUrl) youtubeVideoId = parseYouTubeId(youtubeUrl);
    if (youtubeVideoId) {
        youtubeInput.value = youtubeUrl;
        loadYouTubeApi();
    }

    window.setInterval(persistYouTubeState, 1000);
    window.addEventListener('pagehide', () => {
        saveTimerState();
        persistYouTubeState();
    });

    if (isRunning) {
        let transitions = 0;
        const now = Date.now();
        while (now >= endTime && transitions < 10000) {
            const previousEnd = endTime;
            advancePhase(false, previousEnd);
            transitions++;
        }
        if (transitions > 0) {
            status.textContent = 'Pomodoro berlanjut setelah berpindah halaman';
            playPomodoroAlarm();
            saveTimerState();
        }
        startTicker();
    }
    renderTimer();
})();
