(function () {
  const init = () => {
    const body = document.body;
    if (!body) return;
    const pageTitle = body.dataset.aiTitle || document.title.replace(/\s*[—|-].*$/, '').trim() || 'study material';
    const pageText = body.innerText.replace(/\s+/g, ' ').trim().slice(0, 12000);
    const topic = body.dataset.aiTopic || `${pageTitle}. Use the following study material as the primary source: ${pageText}`;
    const pagePath = decodeURIComponent(window.location.pathname).toLowerCase();
    const isFinancePage = /\/(pajak|ekonomi|investment bank)\//.test(pagePath);
    const labels = isFinancePage ? {
      title: 'Pembuat Soal AI Gemini',
      description: 'Masukkan kunci API Gemini untuk membuat 20 soal pilihan ganda berdasarkan halaman ini.',
      keyPlaceholder: 'Masukkan kunci API Gemini',
      generate: 'Buat 20 Soal',
      generating: 'Sedang membuat 20 soal AI...',
      keyRequired: 'Kunci API Gemini diperlukan.',
      questionUnavailable: 'Pertanyaan tidak tersedia',
      checkAnswer: 'Periksa Jawaban',
      selectAnswer: 'Pilih jawaban terlebih dahulu',
      correct: 'Benar',
      tryAgain: 'Coba Lagi',
      answer: 'Jawaban',
      explanation: 'Pembahasan',
      success: (count) => `Berhasil membuat ${count} soal AI untuk ${pageTitle}.`,
      connectionError: 'Tidak dapat terhubung ke Gemini API.',
      invalidFormat: 'Gemini menghasilkan format soal yang tidak valid.',
      generationError: 'Terjadi kesalahan saat membuat soal AI.'
    } : {
      title: '🤖 Gemini AI Question Generator',
      description: 'Enter a Gemini API key to create 20 multiple-choice questions based on this page.',
      keyPlaceholder: 'Enter Gemini API key',
      generate: 'Generate 20 Questions',
      generating: 'Generating 20 AI questions...',
      keyRequired: 'A Gemini API key is required.',
      questionUnavailable: 'Question not available',
      checkAnswer: 'Check Answer',
      selectAnswer: 'Please select an answer first',
      correct: 'Correct',
      tryAgain: 'Try Again',
      answer: 'Answer',
      explanation: 'Explanation',
      success: (count) => `Successfully generated ${count} AI questions for ${pageTitle}.`,
      connectionError: 'Could not connect to the Gemini API.',
      invalidFormat: 'Gemini returned an invalid question format.',
      generationError: 'An error occurred while generating AI questions.'
    };
    if (!topic) return;

  const generator = document.createElement('section');
  generator.className = 'ai-generator';
  generator.innerHTML = `
    <h2>${labels.title}</h2>
    <p>${labels.description}</p>
    <div class="ai-controls">
      <input type="password" data-ai-key placeholder="${labels.keyPlaceholder}" aria-label="${labels.keyPlaceholder}">
      <button type="button" data-ai-generate>${labels.generate}</button>
    </div>
    <div class="ai-status" data-ai-status role="status"></div>
    <div data-ai-result></div>
  `;

  const footer = document.querySelector('footer');
  (footer ? footer.parentNode : body).insertBefore(generator, footer || null);

  const keyInput = generator.querySelector('[data-ai-key]');
  const generateButton = generator.querySelector('[data-ai-generate]');
  const status = generator.querySelector('[data-ai-status]');
  const result = generator.querySelector('[data-ai-result]');
  keyInput.value = localStorage.getItem('gemini_api_key') || '';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);

  const setStatus = (message, type) => {
    status.textContent = message;
    status.className = `ai-status show ${type}`;
  };

  const renderQuestions = (questions) => {
    result.innerHTML = questions.slice(0, 20).map((item, index) => {
      const options = Array.isArray(item.options) ? item.options.slice(0, 4) : [];
      const answer = String(item.answer || '').trim().toUpperCase();
      return `
        <div class="ai-question" data-answer="${escapeHtml(answer)}">
          <p>${index + 1}. ${escapeHtml(item.question || labels.questionUnavailable)}</p>
          ${options.map((option, optionIndex) => {
            const letter = String.fromCharCode(65 + optionIndex);
            return `<label><input type="radio" name="ai-question-${index}" value="${letter}"> ${letter}. ${escapeHtml(option)}</label>`;
          }).join('')}
          <button type="button" class="ai-check-btn">${labels.checkAnswer}</button>
          <div class="ai-answer">${labels.answer}: ${escapeHtml(answer || 'Not available')}</div>
          <div class="ai-explanation">${labels.explanation}: ${escapeHtml(item.explanation || 'Explanation not available.')}</div>
        </div>
      `;
    }).join('');

    result.querySelectorAll('.ai-check-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const question = button.closest('.ai-question');
        const selected = question.querySelector('input:checked');
        if (!selected) {
          button.textContent = labels.selectAnswer;
          return;
        }
        question.classList.add('checked');
        button.textContent = selected.value === question.dataset.answer ? labels.correct : labels.tryAgain;
      });
    });
  };

    generateButton.addEventListener('click', async () => {
    const apiKey = (keyInput.value || '').trim() || window.prompt('Enter a Gemini API key to generate questions:');
    if (!apiKey) {
      setStatus(labels.keyRequired, 'error');
      return;
    }

    keyInput.value = apiKey;
    localStorage.setItem('gemini_api_key', apiKey);
    generateButton.disabled = true;
    setStatus(labels.generating, 'loading');

    const prompt = isFinancePage
      ? `Anda adalah penyusun soal untuk materi keuangan, perpajakan, ekonomi, dan perbankan.\n\nBuat tepat 20 soal pilihan ganda orisinal berdasarkan materi di bawah ini.\n\nKetentuan soal:\n1. Tulis seluruh pertanyaan, pilihan jawaban, instruksi, dan pembahasan dalam bahasa Indonesia yang jelas dan alami. Pertahankan istilah teknis, nama peraturan, singkatan, dan rumus yang lazim digunakan bila diperlukan.\n2. Uji pemahaman konsep, penerapan, perhitungan, dan contoh yang benar-benar dibahas dalam materi.\n3. Sesuaikan tingkat kesulitan dengan materi dan variasikan tingkat kesulitannya.\n4. Setiap soal harus memiliki tepat empat pilihan jawaban A-D dan tepat satu jawaban benar.\n5. Buat pengecoh yang masuk akal tetapi jelas salah. Hindari soal ambigu, duplikat, atau menjebak.\n6. Buat soal orisinal dan jangan menambahkan fakta yang tidak didukung oleh materi.\n7. Kembalikan JSON valid saja tanpa Markdown atau teks tambahan.\n8. Gunakan struktur berikut: [{"question":"Pertanyaan dalam bahasa Indonesia","options":["Pilihan A","Pilihan B","Pilihan C","Pilihan D"],"answer":"A","explanation":"Pembahasan dalam bahasa Indonesia"}]\n\nMateri:\n${topic}`
      : `You are an experienced TOEFL test developer.\n\nCreate exactly 20 original multiple-choice questions based on the study material below.\n\nTest requirements:\n1. Create TOEFL-style practice questions appropriate to the subject and level of the study material. For English-learning cards, use TOEFL ITP-style Structure and Written Expression questions.\n2. Focus on the grammar, vocabulary, concepts, and examples covered by the material.\n3. Use natural academic English and vary the difficulty from intermediate to advanced.\n4. Each question must have exactly four answer choices, A-D, and exactly one correct answer.\n5. Distractors must be plausible but clearly incorrect. Do not create ambiguous, duplicate, or trick questions.\n6. All questions, answer choices, instructions, and explanations must be written entirely in English. Never use Indonesian, even if the source material contains Indonesian.\n7. Create original questions. Do not reproduce real TOEFL questions.\n8. Return valid JSON only, without Markdown or any additional text.\n9. Use exactly this structure: [{"question":"English question","options":["choice A","choice B","choice C","choice D"],"answer":"A","explanation":"English explanation"}]\n\nStudy material:\n${topic}`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0, topK: 1 }
        })
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson?.error?.message || labels.connectionError);
      }

      const data = await response.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      const parsed = JSON.parse(raw.replace(/```json|```/gi, '').trim());
      const questions = Array.isArray(parsed) ? parsed : parsed.questions;
      const isValidQuestion = (item) => item && typeof item.question === 'string' && item.question.trim()
        && Array.isArray(item.options) && item.options.length === 4
        && item.options.every((option) => typeof option === 'string' && option.trim())
        && new Set(item.options.map((option) => option.trim().toLowerCase())).size === 4
        && /^[A-D]$/i.test(String(item.answer || '').trim());
      if (!Array.isArray(questions) || questions.length !== 20 || !questions.every(isValidQuestion)) {
        throw new Error(labels.invalidFormat);
      }

      renderQuestions(questions);
      setStatus(labels.success(questions.length), 'success');
    } catch (error) {
    setStatus(error.message || labels.generationError, 'error');
    } finally {
      generateButton.disabled = false;
    }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
