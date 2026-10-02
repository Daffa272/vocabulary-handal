(() => {
    if (document.getElementById('annotationLayer')) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'annotation-toolbar';
    toolbar.setAttribute('aria-label', 'Alat coretan');
    toolbar.innerHTML = `
        <button id="annotationToggle" type="button" title="Aktifkan atau matikan mode coretan">✎ Coretan</button>
        <button id="annotationEraser" type="button" title="Hapus bagian coretan" aria-label="Hapus bagian coretan"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 21 9-9"/><path d="M14.5 5.5 18 2l4 4-3.5 3.5"/><path d="m3 17 4 4h5l9-9-4-4-9 9H3Z"/></svg></button>
        <button id="annotationText" type="button" title="Tambahkan kotak teks">Teks</button>
        <input id="annotationColor" type="color" value="#e53935" title="Warna pen" aria-label="Warna pen">
        <label for="annotationSize">Ukuran</label>
        <input id="annotationSize" type="range" min="1" max="12" value="3" title="Ukuran pen" aria-label="Ukuran pen">
        <button id="annotationUndo" type="button" title="Batalkan coretan terakhir">↶</button>
        <button id="annotationRedo" type="button" title="Ulangi perubahan terakhir">↷</button>
        <button id="annotationClear" type="button" title="Hapus semua coretan">Hapus semua</button>`;

    const layer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    layer.id = 'annotationLayer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.append(toolbar, layer);

    const toggle = document.getElementById('annotationToggle');
    const colorInput = document.getElementById('annotationColor');
    const sizeInput = document.getElementById('annotationSize');
    const eraser = document.getElementById('annotationEraser');
    const textButton = document.getElementById('annotationText');
    const undo = document.getElementById('annotationUndo');
    const redo = document.getElementById('annotationRedo');
    const clear = document.getElementById('annotationClear');
    const storageKey = 'page_annotations_v2:' + location.pathname;
    const textStorageKey = storageKey + ':texts';
    const textLayer = document.createElement('div');
    textLayer.id = 'annotationTextLayer';
    document.body.appendChild(textLayer);
    let strokes = loadStrokes();
    let drawing = false;
    let activeStroke = null;
    let isActive = false;
    let isEraser = false;
    let erasing = false;
    let isTextMode = false;
    let texts = loadTexts();
    let erasingRecorded = false;
    const undoHistory = [];
    const redoHistory = [];
    let historySuspended = false;

    function snapshot() {
        return JSON.parse(JSON.stringify({ strokes, texts }));
    }

    function recordHistory() {
        if (historySuspended) return;
        undoHistory.push(snapshot());
        if (undoHistory.length > 100) undoHistory.shift();
        redoHistory.length = 0;
    }

    function restoreState(state) {
        historySuspended = true;
        strokes = state.strokes || [];
        texts = state.texts || [];
        saveStrokes();
        saveTexts();
        renderStrokes();
        renderTexts();
        requestAnimationFrame(() => { historySuspended = false; });
    }

    function documentHeight() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, window.innerHeight);
    }

    function updateLayerSize() {
        const height = documentHeight();
        layer.setAttribute('viewBox', `0 0 ${window.innerWidth} ${height}`);
        layer.setAttribute('width', window.innerWidth);
        layer.setAttribute('height', height);
    }

    function loadStrokes() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function saveStrokes() {
        localStorage.setItem(storageKey, JSON.stringify(strokes));
    }

    function loadTexts() {
        try {
            const saved = JSON.parse(localStorage.getItem(textStorageKey) || '[]');
            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function saveTexts() {
        localStorage.setItem(textStorageKey, JSON.stringify(texts));
    }

    function renderTexts() {
        textLayer.replaceChildren();
        texts.forEach((item, index) => {
            const text = document.createElement('div');
            text.className = 'annotation-text';
            text.style.left = `${item.x}px`;
            text.style.top = `${item.y}px`;
            text.style.color = item.color;
            text.style.fontSize = `${item.size}px`;
            if (item.width) text.style.width = `${item.width}px`;
            if (item.height) text.style.height = `${item.height}px`;
            const handle = document.createElement('div');
            handle.className = 'annotation-text-handle';
            const handleLabel = document.createElement('span');
            handleLabel.textContent = 'Kotak teks - geser untuk memindahkan';
            const deleteButton = document.createElement('button');
            deleteButton.className = 'annotation-text-delete';
            deleteButton.type = 'button';
            deleteButton.title = 'Hapus kotak teks';
            deleteButton.textContent = '×';
            deleteButton.addEventListener('pointerdown', event => event.stopPropagation());
            deleteButton.addEventListener('click', event => {
                event.stopPropagation();
                recordHistory();
                texts.splice(index, 1);
                saveTexts();
                renderTexts();
            });
            handle.append(handleLabel, deleteButton);
            const content = document.createElement('div');
            content.className = 'annotation-text-content';
            content.contentEditable = 'true';
            content.textContent = item.value;
            let editingRecorded = false;
            content.addEventListener('focus', () => { editingRecorded = false; });
            content.addEventListener('input', () => {
                if (!editingRecorded) {
                    recordHistory();
                    editingRecorded = true;
                }
                item.value = content.textContent;
                saveTexts();
            });
            handle.addEventListener('pointerdown', event => {
                event.preventDefault();
                const startX = event.clientX;
                const startY = event.clientY;
                const originX = item.x;
                const originY = item.y;
                recordHistory();
                const move = moveEvent => {
                    item.x = originX + moveEvent.clientX - startX;
                    item.y = originY + moveEvent.clientY - startY;
                    text.style.left = `${item.x}px`;
                    text.style.top = `${item.y}px`;
                };
                const stop = () => {
                    document.removeEventListener('pointermove', move);
                    document.removeEventListener('pointerup', stop);
                    saveTexts();
                };
                document.addEventListener('pointermove', move);
                document.addEventListener('pointerup', stop, { once: true });
            });
            text.append(handle, content);
            textLayer.appendChild(text);
            text.addEventListener('pointerdown', event => {
                const nearRight = event.offsetX >= text.offsetWidth - 18;
                const nearBottom = event.offsetY >= text.offsetHeight - 18;
                if (nearRight && nearBottom) recordHistory();
            });
            if (window.ResizeObserver) {
                new ResizeObserver(() => {
                    item.width = text.offsetWidth;
                    item.height = text.offsetHeight;
                    saveTexts();
                }).observe(text);
            }
        });
    }

    function addText(event) {
        const point = pointFromEvent(event);
        recordHistory();
        texts.push({ x: point.x, y: point.y, value: '', color: colorInput.value, size: Math.max(12, Number(sizeInput.value) * 4 + 4) });
        saveTexts();
        renderTexts();
        const content = textLayer.lastElementChild?.querySelector('.annotation-text-content');
        if (content) content.focus();
    }

    function pointFromEvent(event) {
        const screenPoint = layer.createSVGPoint();
        screenPoint.x = event.clientX;
        screenPoint.y = event.clientY;
        const screenMatrix = layer.getScreenCTM();
        if (!screenMatrix) return { x: event.clientX, y: event.clientY + window.scrollY };
        const pagePoint = screenPoint.matrixTransform(screenMatrix.inverse());
        return { x: pagePoint.x, y: pagePoint.y };
    }

    function renderStrokes() {
        layer.replaceChildren();
        strokes.forEach(stroke => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const points = stroke.points.map(point => `${point.x},${point.y}`).join(' ');
            path.setAttribute('d', `M ${points.replace(/ /g, ' L ')}`);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', stroke.color);
            path.setAttribute('stroke-width', stroke.size);
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            layer.appendChild(path);
        });
    }

    function renderWithActiveStroke() {
        const savedStrokes = strokes;
        if (activeStroke) strokes = savedStrokes.concat(activeStroke);
        renderStrokes();
        strokes = savedStrokes;
    }

    function beginStroke(event) {
        if (!isActive) return;
        event.preventDefault();
        drawing = true;
        activeStroke = {
            color: colorInput.value,
            size: Number(sizeInput.value),
            points: [pointFromEvent(event)]
        };
        layer.setPointerCapture(event.pointerId);
    }

    function continueStroke(event) {
        if (!drawing || !activeStroke) return;
        event.preventDefault();
        activeStroke.points.push(pointFromEvent(event));
        renderWithActiveStroke();
    }

    function finishStroke() {
        if (!drawing || !activeStroke) return;
        drawing = false;
        if (activeStroke.points.length > 1) {
            recordHistory();
            strokes.push(activeStroke);
            saveStrokes();
        }
        activeStroke = null;
        renderStrokes();
    }

    function eraseAt(event) {
        const point = pointFromEvent(event);
        const threshold = Math.max(12, Number(sizeInput.value) * 3);
        const nextStrokes = [];
        let changed = false;

        strokes.forEach(stroke => {
            let remainingPoints = [];
            const keepSegment = () => {
                if (remainingPoints.length > 1) {
                    nextStrokes.push({ ...stroke, points: remainingPoints });
                }
                remainingPoints = [];
            };

            stroke.points.forEach(item => {
                const isErased = Math.hypot(item.x - point.x, item.y - point.y) <= threshold + (stroke.size / 2);
                if (isErased) {
                    changed = true;
                    keepSegment();
                } else {
                    remainingPoints.push(item);
                }
            });
            keepSegment();
        });

        if (changed) {
            if (!erasingRecorded) {
                recordHistory();
                erasingRecorded = true;
            }
            strokes = nextStrokes;
            saveStrokes();
            renderStrokes();
        }
    }

    function beginErase(event) {
        if (!isActive || !isEraser) return;
        event.preventDefault();
        erasing = true;
        erasingRecorded = false;
        layer.setPointerCapture(event.pointerId);
        eraseAt(event);
    }

    toggle.addEventListener('click', () => {
        isActive = !isActive;
        isTextMode = false;
        textButton.classList.remove('active');
        layer.classList.toggle('is-active', isActive);
        toggle.classList.toggle('active', isActive);
        toggle.textContent = isActive ? '✓ Selesai' : '✎ Coretan';
    });

    textButton.addEventListener('click', () => {
        isTextMode = !isTextMode;
        isActive = isTextMode;
        layer.classList.toggle('is-active', isActive);
        textButton.classList.toggle('active', isTextMode);
        toggle.classList.toggle('active', false);
    });

    eraser.addEventListener('click', () => {
        isEraser = !isEraser;
        eraser.classList.toggle('active', isEraser);
        eraser.innerHTML = isEraser
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 21 9-9"/><path d="M14.5 5.5 18 2l4 4-3.5 3.5"/><path d="m3 17 4 4h5l9-9-4-4-9 9H3Z"/></svg> Aktif'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 21 9-9"/><path d="M14.5 5.5 18 2l4 4-3.5 3.5"/><path d="m3 17 4 4h5l9-9-4-4-9 9H3Z"/></svg>';
    });

    undo.addEventListener('click', () => {
        if (!undoHistory.length) return;
        redoHistory.push(snapshot());
        restoreState(undoHistory.pop());
    });

    redo.addEventListener('click', () => {
        if (!redoHistory.length) return;
        undoHistory.push(snapshot());
        restoreState(redoHistory.pop());
    });

    document.addEventListener('keydown', event => {
        if (!(event.ctrlKey || event.metaKey)) return;
        const isUndo = event.key.toLowerCase() === 'z' && !event.shiftKey;
        const isRedo = event.key.toLowerCase() === 'y' || (event.key.toLowerCase() === 'z' && event.shiftKey);
        if (!isUndo && !isRedo) return;
        event.preventDefault();
        (isUndo ? undo : redo).click();
    });

    clear.addEventListener('click', () => {
        if ((!strokes.length && !texts.length) || !confirm('Hapus semua anotasi pada halaman ini?')) return;
        recordHistory();
        strokes = [];
        texts = [];
        saveStrokes();
        saveTexts();
        renderStrokes();
        renderTexts();
    });

    layer.addEventListener('pointerdown', event => isTextMode ? addText(event) : (isEraser ? beginErase(event) : beginStroke(event)));
    layer.addEventListener('pointermove', event => {
        if (isEraser && erasing) eraseAt(event);
        else continueStroke(event);
    });
    layer.addEventListener('pointerup', finishStroke);
    layer.addEventListener('pointercancel', finishStroke);
    layer.addEventListener('pointerup', () => { erasing = false; erasingRecorded = false; });
    layer.addEventListener('pointercancel', () => { erasing = false; erasingRecorded = false; });
    window.addEventListener('resize', () => { updateLayerSize(); renderStrokes(); });
    window.addEventListener('load', () => { updateLayerSize(); renderStrokes(); renderTexts(); });
    updateLayerSize();
    renderStrokes();
    renderTexts();
})();
