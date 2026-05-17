// ===================== DATA =====================
// Phonetic renderer — Option I dictionary style: Sawatdee [sa-WAT-dee]
// Input: "sa·WAT·dee", dark=true for dark card faces
function phonDict(phonetic, dark) {
  const cls = dark ? 'ph-dict-dark' : 'ph-dict';
  const inner = phonetic.split('·').map(syl => {
    const stressed = /[A-Z]/.test(syl);
    const low = syl.toLowerCase();
    return stressed ? `<b>${low}</b>` : low;
  }).join('-');
  return `<span class="${cls}"><span class="ph-br">[</span>${inner}<span class="ph-br">]</span></span>`;
}

// LESSON 1 — Greetings
const PHRASES = [
  { thai:'สวัสดี',              roman:'Sawatdee',                  phonetic:'sa·WAT·dee',                 english:'Hello / Goodbye',     category:'Greetings', context:'+ khrap (men) / kha (women)',      usage:'The universal Thai greeting for hello and goodbye. Always add khrap or kha.' },
  { thai:'สวัสดีตอนเช้า',       roman:'Sawatdee dtawn chao',       phonetic:'sa·WAT·dee·DTAWN·chao',      english:'Good Morning',        category:'Greetings', context:'+ khrap (men) / kha (women)',      usage:'Dtawn chao means morning time. Add khrap or kha at the end to be polite.' },
  { thai:'สวัสดีตอนเย็น',       roman:'Sawatdee dtawn yen',        phonetic:'sa·WAT·dee·DTAWN·yen',       english:'Good Evening',        category:'Greetings', context:'+ khrap (men) / kha (women)',      usage:'Dtawn yen means evening time. Use after around 5pm.' },
  { thai:'สบายดีไหม',           roman:'Sabai dee mai?',            phonetic:'sa·BYE·dee·MY',              english:'How are you?',        category:'Greetings', context:'Rising tone on "mai"',             usage:'Casual daily greeting between people who know each other.' },
  { thai:'สบายดี',              roman:'Sabai dee',                 phonetic:'sa·BYE·dee',                 english:"I'm good",            category:'Greetings', context:'Response to sabai dee mai?',       usage:'The natural response. Add khrap or kha at the end.' },
  { thai:'ยินดีที่ได้รู้จัก',   roman:'Yin dee tee dai roo jak',   phonetic:'yin·DEE·tee·dai·ROO·jak',    english:'Nice to meet you',    category:'Greetings', context:'First meeting phrase',             usage:'Said when meeting someone for the first time. Very well received by Thais.' },
  { thai:'ขอบคุณ',              roman:'Khob khun',                 phonetic:'KORP·khun',                  english:'Thank you',           category:'Greetings', context:'+ khrap / kha always',            usage:'Always follow with khrap (men) or kha (women). Essential every day.' },
  { thai:'ไม่เป็นไร',           roman:'Mai pen rai',               phonetic:'MY·pen·RYE',                 english:"You're welcome",      category:'Greetings', context:"Thailand's national phrase",       usage:"Also means no worries, it's okay. One of the most Thai phrases there is." },
];


const NUMS = [
  { thai:'หนึ่ง', roman:'neung', phonetic:'NUNG',  english:'One (1)',              category:'Numbers', context:'Numbers for prices', usage:'Essential for shopping and counting.' },
  { thai:'สอง',   roman:'song',  phonetic:'SONG',  english:'Two (2)',              category:'Numbers', context:'Numbers for prices', usage:'Song — like a song has two parts, easy to remember.' },
  { thai:'สาม',   roman:'sam',   phonetic:'SAAM',  english:'Three (3)',            category:'Numbers', context:'Numbers for prices', usage:'Sam — three.' },
  { thai:'สี่',   roman:'see',   phonetic:'SEE',   english:'Four (4)',             category:'Numbers', context:'Numbers for prices', usage:'See — like "see" something with your eyes.' },
  { thai:'ห้า',   roman:'ha',    phonetic:'HAA',   english:'Five (5)',             category:'Numbers', context:'Numbers for prices', usage:'Ha — short and punchy, easy to remember.' },
  { thai:'หก',    roman:'hok',   phonetic:'HOK',   english:'Six (6)',              category:'Numbers', context:'Numbers for prices', usage:'Hok — six items on the market stall.' },
  { thai:'เจ็ด',  roman:'jet',   phonetic:'JET',   english:'Seven (7)',            category:'Numbers', context:'Numbers for prices', usage:'Jet — like a jet plane, seven letters.' },
  { thai:'แปด',   roman:'paet',  phonetic:'PÀET',  english:'Eight (8)',            category:'Numbers', context:'Numbers for prices', usage:'Paet — eight baht at the street food cart.' },
  { thai:'เก้า',  roman:'kao',   phonetic:'KAO',   english:'Nine (9)',             category:'Numbers', context:'Numbers for prices', usage:'Kao — also means rice! Context tells you which.' },
  { thai:'สิบ',   roman:'sip',   phonetic:'SIP',   english:'Ten (10)',             category:'Numbers', context:'Numbers for prices', usage:'Sip — ten baht items are very common at street food stalls.' },
];



function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

// ===================== STATE =====================
// Lesson 1
let cardOrder = shuffle(PHRASES.map((_,i) => i));
let currentCard = 0;
let isFlipped = false;
let quizQuestions = [];
let currentQ = 0;
let score = 0;
let quizDone = false;
let answered = false;


let speakerGender = localStorage.getItem('thaidee_gender') || 'male';

// ===================== SPEECH =====================
const NO_PARTICLE = new Set(['หนึ่ง','สอง','สาม','สิบ','ร้อย','บาท']);

function getParticle(thaiText) {
  if (NO_PARTICLE.has(thaiText)) return '';
  return speakerGender === 'male' ? 'ครับ' : 'ค่ะ';
}

function buildSpeechText(phrase) {
  const text = phrase.thai;
  const particle = getParticle(text);
  if (!particle) return text;
  if (text.endsWith('ครับ') || text.endsWith('ค่ะ') || text.endsWith('คะ')) return text;
  return text + particle;
}

let currentSpeakBtn = null;

function speakThai(thaiText, btn) {
  // Stop any currently speaking button animation
  if (currentSpeakBtn && currentSpeakBtn !== btn) {
    currentSpeakBtn.classList.remove('speaking');
  }
  currentSpeakBtn = btn || null;
  if (btn) btn.classList.add('speaking');

  // Use ResponsiveVoice — works in all browsers with no install needed
  if (typeof responsiveVoice !== 'undefined') {
    responsiveVoice.cancel();
    const voice = speakerGender === 'female' ? 'Thai Female' : 'Thai Male';
    responsiveVoice.speak(thaiText, voice, {
      rate: 0.9,
      onend: () => { if (btn) btn.classList.remove('speaking'); currentSpeakBtn = null; },
      onerror: () => { if (btn) btn.classList.remove('speaking'); currentSpeakBtn = null; showTTSError(); }
    });
  } else {
    // Fallback: Web Speech API
    if (!('speechSynthesis' in window)) { showTTSError(); return; }
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const utt = new SpeechSynthesisUtterance(thaiText);
      utt.lang = 'th-TH';
      utt.rate = 0.9;
      utt.pitch = speakerGender === 'female' ? 1.15 : 0.9;
      utt.onend = () => { if (btn) btn.classList.remove('speaking'); currentSpeakBtn = null; };
      utt.onerror = () => { if (btn) btn.classList.remove('speaking'); currentSpeakBtn = null; showTTSError(); };
      window.speechSynthesis.speak(utt);
    }, 50);
  }
}

function speakCurrentCard(btn) {
  speakThai(buildSpeechText(PHRASES[cardOrder[currentCard]]), btn);
}

function speakQuizPrompt(btn) {
  const q = quizQuestions[currentQ];
  if (q) speakThai(buildSpeechText(q.phrase), btn);
}

function showTTSError() {
  const old = document.getElementById('tts-err');
  if (old) old.remove();
  const msg = document.createElement('div');
  msg.id = 'tts-err';
  msg.className = 'no-tts-msg';
  msg.textContent = '⚠️ Audio unavailable. Check your internet connection and volume, then try again.';
  const lesson = document.getElementById('lesson1');
  if (lesson) lesson.prepend(msg);
  setTimeout(() => msg.remove(), 5000);
}

function setGender(gender) {
  speakerGender = gender;
  localStorage.setItem('thaidee_gender', gender);
  document.getElementById('btn-male').classList.toggle('active', gender === 'male');
  document.getElementById('btn-female').classList.toggle('active', gender === 'female');
  renderIntroCard();
}


const KEYS = { xp:'thaidee_xp', streak:'thaidee_streak', lastDate:'thaidee_lastdate', badges:'thaidee_badges', bestScore:'thaidee_bestscore', lessonsCompleted:'thaidee_lessons', cultureRead:'thaidee_culture' };

function getXP() { return parseInt(localStorage.getItem(KEYS.xp)||'0'); }
function setXP(v) { localStorage.setItem(KEYS.xp, v); updateNavXP(); }
function addXP(v) { setXP(getXP()+v); showXPPopup(v); }

function getBadges() { try{ return JSON.parse(localStorage.getItem(KEYS.badges)||'[]'); }catch(e){return[];} }
function earnBadge(id) {
  const b = getBadges();
  if(!b.includes(id)) { b.push(id); localStorage.setItem(KEYS.badges, JSON.stringify(b)); }
}

function updateNavXP() {
  const xp = getXP();
  document.getElementById('nav-xp-label').textContent = xp+' XP';
  const pct = Math.min((xp % 100), 100);
  document.getElementById('nav-xp-fill').style.width = pct+'%';
}

function updateStreak() {
  const today = new Date().toDateString();
  const last = localStorage.getItem(KEYS.lastDate);
  let streak = parseInt(localStorage.getItem(KEYS.streak)||'0');
  if(last === today) { /* same day */ }
  else if(last === new Date(Date.now()-86400000).toDateString()) { streak++; }
  else { streak = 1; }
  localStorage.setItem(KEYS.streak, streak);
  localStorage.setItem(KEYS.lastDate, today);
  document.getElementById('streak-badge').textContent = '🔥 '+streak;
  return streak;
}

// ===================== SECTIONS =====================
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);

  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  if (id === 'culture')  document.querySelectorAll('.nav-tab')[0]?.classList.add('active');
  if (id === 'numbers')  document.querySelectorAll('.nav-tab')[1]?.classList.add('active');
  if (id === 'progress') document.querySelectorAll('.nav-tab')[2]?.classList.add('active');
  if (id === 'lesson1')  document.getElementById('nav-lesson1')?.classList.add('active');

  if (id === 'numbers') renderNumbersTable();
  if (id === 'culture') { localStorage.setItem(KEYS.cultureRead,'1'); earnBadge('culture'); }
  if (id === 'progress') updateProgressPage();
}

// ===================== FLASHCARDS (LESSON 1) =====================
function renderCard() {
  const p = PHRASES[cardOrder[currentCard]];
  isFlipped = false;
  document.getElementById('fc-roman').textContent = p.roman;
  document.getElementById('fc-phonetic').innerHTML = phonDict(p.phonetic, true);
  document.getElementById('fc-thai').textContent = '(' + p.thai + ')';
  document.getElementById('fc-context').textContent = p.context;
  document.getElementById('fc-english').textContent = p.english;
  document.getElementById('fc-roman-back').textContent = p.roman;
  document.getElementById('fc-phonetic-back').innerHTML = phonDict(p.phonetic, false);
  document.getElementById('fc-usage').textContent = p.usage;
  document.getElementById('fc-counter').textContent = `Card ${currentCard+1} of ${PHRASES.length}`;
  renderDots('fc-dots', currentCard, PHRASES.length);
}

function renderDots(elId, cur, total) {
  const wrap = document.getElementById(elId);
  if (!wrap) return;
  const max = Math.min(total, 10);
  let html = '';
  for(let i=0;i<max;i++) {
    const idx = Math.floor(cur / total * max);
    html += `<div class="fc-dot ${i===idx?'active':''}"></div>`;
  }
  wrap.innerHTML = html;
}

function _swapCard(cardId, renderFn) {
  const card = document.getElementById(cardId);
  card.style.transition = 'none';
  card.classList.remove('flipped');
  renderFn();
  card.offsetHeight; // force reflow
  card.style.transition = '';
}

function flipCard() {
  isFlipped = !isFlipped;
  document.getElementById('the-flashcard').classList.toggle('flipped', isFlipped);
}

function nextCard() {
  currentCard = (currentCard+1) % PHRASES.length;
  isFlipped = false;
  _swapCard('the-flashcard', renderCard);
}

function prevCard() {
  currentCard = (currentCard-1+PHRASES.length) % PHRASES.length;
  isFlipped = false;
  _swapCard('the-flashcard', renderCard);
}

function speakCurrentCard(btn) {
  speakThai(buildSpeechText(PHRASES[cardOrder[currentCard]]), btn);
}


// ===================== GENERIC LESSON ENGINE =====================
// Each lesson has: lid (id), phrases array, state object
// All lesson functions use lid prefix to target correct DOM elements


const LESSON_STATE = {};
function getLState(lid) {
  if (!LESSON_STATE[lid]) {
    LESSON_STATE[lid] = {
      introIdx: 0, introSeen: new Set(),
      fcIdx: 0, fcIsFlipped: false, fcOrder: [],
      matchSelected: null, matchPairs: [], matchMatched: 0, matchRound: 1, matchAllPhrases: [],
      quizQs: [], quizIdx: 0, quizScore: 0, quizDone: false, quizAnswered: false,
    };
  }
  return LESSON_STATE[lid];
}

function lPhrases(lid) {
  const cfg = LESSON_CONFIG[lid];
  return cfg ? cfg.getPhrases() : [];
}

// ── STEP INDICATOR ──
function lUpdateSteps(lid, phase) {
  const stepMap = { introduce:1, match:2, quiz:3 };
  const cur = stepMap[phase] || 0;
  [1,2,3].forEach(n => {
    document.getElementById(`${lid}-step${n}-node`)?.classList.toggle('active', n === cur);
    document.getElementById(`${lid}-step${n}-node`)?.classList.toggle('done', n < cur || phase === 'results');
    const lbl = document.getElementById(`${lid}-step${n}-label`);
    if (lbl) {
      lbl.style.color = n === cur ? 'var(--red)' : n < cur ? 'var(--gold-dark)' : 'var(--text-light)';
      lbl.style.fontWeight = n === cur ? '700' : '400';
    }
    const line = document.getElementById(`${lid}-step-line-${n}`);
    if (line) line.classList.toggle('done', n < cur || phase === 'results');
  });
}

// ── PHASE SWITCH ──
function lsw(lid, phase) {
  if (phase === 'quiz') {
    const s = getLState(lid);
    if (s.quizQs.length === 0 || s.quizDone) { lStartQuiz(lid); return; }
  }
  if (phase === 'match') lInitMatch(lid);
  const phases = ['introduce','match','flashcards','grammar','notes','quiz','results'];
  phases.forEach(p => {
    const el = document.getElementById(`${lid}-${p}-phase`);
    if (el) el.style.display = p === phase ? 'block' : 'none';
  });
  lUpdateSteps(lid, phase);
}

// ── INTRODUCE ──
function lRenderIntro(lid) {
  const s = getLState(lid);
  const phrases = lPhrases(lid);
  if (!phrases.length) return;
  const p = phrases[s.introIdx];
  document.getElementById(`${lid}-intro-english`).textContent = p.english;
  document.getElementById(`${lid}-intro-roman`).textContent = p.roman;
  document.getElementById(`${lid}-intro-phonetic`).innerHTML = phonDict(p.phonetic, true);
  document.getElementById(`${lid}-intro-thai`).textContent = '(' + p.thai + ')';
  document.getElementById(`${lid}-intro-usage`).textContent = p.usage;
  // Gender-aware particle
  const particle = speakerGender === 'male' ? 'khrap' : 'kha';
  document.getElementById(`${lid}-intro-context`).textContent =
    p.context.includes('khrap') || p.context.includes('kha') ? `+ ${particle}` : p.context;
  document.getElementById(`${lid}-intro-counter`).textContent = `${s.introIdx + 1} / ${phrases.length}`;
  s.introSeen.add(s.introIdx);
  renderDots(`${lid}-intro-dots`, s.introIdx, phrases.length);
  const btn = document.getElementById(`${lid}-intro-continue-btn`);
  if (btn) btn.style.display = s.introSeen.size >= phrases.length ? 'inline-block' : 'none';
}

function lSpeak(lid, btn) {
  const s = getLState(lid);
  const p = lPhrases(lid)[s.introIdx];
  if (p) speakThai(buildSpeechText(p), btn);
}

function lNext(lid) {
  const s = getLState(lid);
  s.introIdx = (s.introIdx + 1) % lPhrases(lid).length;
  lRenderIntro(lid);
}

function lPrev(lid) {
  const s = getLState(lid);
  const phrases = lPhrases(lid);
  s.introIdx = (s.introIdx - 1 + phrases.length) % phrases.length;
  lRenderIntro(lid);
}

// ── FLASHCARDS ──
function lRenderFc(lid) {
  const s = getLState(lid);
  const phrases = lPhrases(lid);
  if (!phrases.length) return;
  if (!s.fcOrder.length) s.fcOrder = shuffle(phrases.map((_,i) => i));
  const p = phrases[s.fcOrder[s.fcIdx]];
  s.fcIsFlipped = false;
  const card = document.getElementById(`${lid}-flashcard`);
  if (card) {
    card.style.transition = 'none';
    card.classList.remove('flipped');
    card.offsetHeight;
    card.style.transition = '';
  }
  document.getElementById(`${lid}-fc-roman`).textContent = p.roman;
  document.getElementById(`${lid}-fc-phonetic`).innerHTML = phonDict(p.phonetic, true);
  document.getElementById(`${lid}-fc-thai`).textContent = '(' + p.thai + ')';
  document.getElementById(`${lid}-fc-english`).textContent = p.english;
  document.getElementById(`${lid}-fc-roman-back`).textContent = p.roman;
  document.getElementById(`${lid}-fc-phonetic-back`).innerHTML = phonDict(p.phonetic, false);
  document.getElementById(`${lid}-fc-usage`).textContent = p.usage;
  document.getElementById(`${lid}-fc-counter`).textContent = `Card ${s.fcIdx + 1} of ${phrases.length}`;
  renderDots(`${lid}-fc-dots`, s.fcIdx, phrases.length);
}

function lFlip(lid) {
  const s = getLState(lid);
  s.fcIsFlipped = !s.fcIsFlipped;
  document.getElementById(`${lid}-flashcard`)?.classList.toggle('flipped', s.fcIsFlipped);
}

function lFcNext(lid) {
  const s = getLState(lid);
  s.fcIdx = (s.fcIdx + 1) % lPhrases(lid).length;
  lRenderFc(lid);
}

function lFcPrev(lid) {
  const s = getLState(lid);
  s.fcIdx = (s.fcIdx - 1 + lPhrases(lid).length) % lPhrases(lid).length;
  lRenderFc(lid);
}

function lFcSpeak(lid, btn) {
  const s = getLState(lid);
  const p = lPhrases(lid)[s.fcOrder[s.fcIdx]];
  if (p) speakThai(buildSpeechText(p), btn);
}

// ── MATCH ──
function lInitMatch(lid, round) {
  const s = getLState(lid);
  s.matchSelected = null;
  s.matchMatched = 0;
  s.matchRound = round || 1;
  document.getElementById(`${lid}-match-feedback`).textContent = '';
  document.getElementById(`${lid}-match-complete`).innerHTML = '';

  if (s.matchRound === 1) s.matchAllPhrases = shuffle([...lPhrases(lid)]);
  s.matchPairs = s.matchAllPhrases.slice((s.matchRound - 1) * 4, s.matchRound * 4);

  document.getElementById(`${lid}-match-feedback`).innerHTML =
    `<span style="color:var(--text-light);font-size:0.78rem">Round ${s.matchRound} of 2 — match all ${s.matchPairs.length} pairs</span>`;

  const romans = shuffle(s.matchPairs.map(p => ({ type:'roman', phrase:p })));
  const engls  = shuffle(s.matchPairs.map(p => ({ type:'english', phrase:p })));
  const grid = document.getElementById(`${lid}-match-grid`);
  grid.innerHTML = '';

  for (let i = 0; i < s.matchPairs.length; i++) {
    [romans[i], engls[i]].forEach(item => {
      const tile = document.createElement('div');
      tile.className = `match-tile ${item.type}`;
      if (item.type === 'roman') {
        tile.innerHTML = `<span style="font-weight:700">${item.phrase.roman}</span><span style="font-size:0.68rem;color:var(--text-light);margin-top:2px;display:block">${phonDict(item.phrase.phonetic, false)}</span>`;
      } else {
        tile.textContent = item.phrase.english;
      }
      tile.addEventListener('click', () => lOnMatchTap(lid, tile, item));
      grid.appendChild(tile);
    });
  }
}

function lOnMatchTap(lid, tile, item) {
  const s = getLState(lid);
  if (tile.classList.contains('matched')) return;
  if (!s.matchSelected) {
    document.querySelectorAll(`#${lid}-match-grid .match-tile.selected`).forEach(t => t.classList.remove('selected'));
    tile.classList.add('selected');
    s.matchSelected = { tile, item };
    return;
  }
  const first = s.matchSelected;
  s.matchSelected = null;
  if (first.item.type === item.type) {
    document.querySelectorAll(`#${lid}-match-grid .match-tile.selected`).forEach(t => t.classList.remove('selected'));
    tile.classList.add('selected');
    s.matchSelected = { tile, item };
    return;
  }
  if (first.item.phrase === item.phrase) {
    first.tile.classList.remove('selected');
    first.tile.classList.add('matched');
    tile.classList.add('matched');
    s.matchMatched++;
    speakThai(buildSpeechText(item.phrase), null);
    document.getElementById(`${lid}-match-feedback`).innerHTML =
      `<span style="color:#2E7D32">✓ ${item.phrase.roman} = ${item.phrase.english}</span>`;
    if (s.matchMatched >= s.matchPairs.length) {
      setTimeout(() => {
        const c = document.getElementById(`${lid}-match-complete`);
        const totalRounds = Math.ceil(lPhrases(lid).length / 4);
        if (s.matchRound < totalRounds) {
          c.innerHTML = `<p style="font-family:'Cinzel',serif;color:var(--red);font-size:1rem;margin-bottom:0.5rem;">Round ${s.matchRound} complete! 🎉</p>
            <button class="btn-start-quiz" onclick="lInitMatch('${lid}',${s.matchRound+1});document.getElementById('${lid}-match-complete').innerHTML=''">Start Round ${s.matchRound+1} →</button>`;
        } else {
          c.innerHTML = `<p style="font-family:'Cinzel',serif;color:var(--red);font-size:1rem;margin-bottom:0.5rem;">All matched! Sut yod! 💪</p>
            <button class="btn-start-quiz" onclick="lsw('${lid}','quiz')" style="margin-bottom:0.5rem">Final Step: Quiz →</button><br>
            <button class="btn-retry" style="margin-top:0.5rem" onclick="lInitMatch('${lid}',1)">🔄 Play Again</button>`;
        }
      }, 400);
    }
  } else {
    first.tile.classList.add('wrong'); tile.classList.add('wrong');
    document.getElementById(`${lid}-match-feedback`).innerHTML = `<span style="color:#C62828">✗ Not a match — try again</span>`;
    setTimeout(() => {
      first.tile.classList.remove('wrong','selected');
      tile.classList.remove('wrong','selected');
      document.getElementById(`${lid}-match-feedback`).innerHTML =
        `<span style="color:var(--text-light);font-size:0.78rem">Round ${s.matchRound} of 2 — match all ${s.matchPairs.length} pairs</span>`;
    }, 800);
  }
}

// ── QUIZ ──
function lStartQuiz(lid) {
  const s = getLState(lid);
  const cfg = LESSON_CONFIG[lid];
  const phrases = lPhrases(lid);
  const shuffled = shuffle([...phrases]);
  const count = Math.min(cfg.quizCount, phrases.length);
  const pool = shuffled.slice(0, count);
  s.quizQs = pool.map((p,i) => {
    const isReverse = i >= cfg.reverseFrom;
    const wrong = phrases.filter(x=>x!==p).sort(()=>Math.random()-0.5).slice(0,3);
    return { phrase:p, isReverse, options:[p,...wrong].sort(()=>Math.random()-0.5) };
  });
  s.quizIdx = 0; s.quizScore = 0; s.quizDone = false; s.quizAnswered = false;
  lsw(lid, 'quiz');
  lRenderQuestion(lid);
}

function lRenderQuestion(lid) {
  const s = getLState(lid);
  const q = s.quizQs[s.quizIdx];
  const total = s.quizQs.length;
  document.getElementById(`${lid}-quiz-counter`).textContent = `Question ${s.quizIdx+1} of ${total}`;
  document.getElementById(`${lid}-quiz-prog-fill`).style.width = (s.quizIdx/total*100)+'%';
  document.getElementById(`${lid}-quiz-feedback`).innerHTML = '';
  s.quizAnswered = false;

  const label = document.getElementById(`${lid}-q-label`);
  const prompt = document.getElementById(`${lid}-q-prompt`);
  const speakRow = document.getElementById(`${lid}-quiz-speak-row`);
  document.getElementById(`${lid}-quiz-speak-btn`)?.classList.remove('speaking');

  if (q.isReverse) {
    label.textContent = 'You hear this — what does it mean?';
    prompt.className = 'quiz-prompt-text';
    prompt.innerHTML = `<span style="font-size:1.1em;display:block;margin-bottom:4px">${q.phrase.roman}</span>${phonDict(q.phrase.phonetic, false)}`;
    speakRow.style.display = 'flex';
  } else {
    label.textContent = 'How do you say this in Thai?';
    prompt.className = 'quiz-prompt-text';
    prompt.textContent = q.phrase.english;
    speakRow.style.display = 'flex';
  }

  const opts = document.getElementById(`${lid}-quiz-opts`);
  opts.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    if (q.isReverse) {
      btn.innerHTML = `<span style="font-weight:700;display:block;margin-bottom:3px">${opt.english}</span><span style="font-size:0.78rem;color:var(--text-light);display:block;margin-bottom:2px">${opt.roman}</span>${phonDict(opt.phonetic, false)}`;
    } else {
      btn.innerHTML = `<span style="font-weight:700;display:block;margin-bottom:3px">${opt.roman}</span>${phonDict(opt.phonetic, false)}`;
    }
    btn.onclick = () => lHandleAnswer(lid, btn, opt, q);
    opts.appendChild(btn);
  });
}

function lQuizSpeak(lid, btn) {
  const s = getLState(lid);
  const q = s.quizQs[s.quizIdx];
  if (q) speakThai(buildSpeechText(q.phrase), btn);
}

function lHandleAnswer(lid, btn, chosen, q) {
  const s = getLState(lid);
  if (s.quizAnswered) return;
  s.quizAnswered = true;
  const correct = chosen === q.phrase;
  const allBtns = [...document.querySelectorAll(`#${lid}-quiz-opts .quiz-opt`)];
  allBtns.forEach((b, idx) => {
    b.disabled = true;
    if (q.options[idx] === q.phrase) {
      b.classList.add('reveal-correct');
      if (!q.isReverse) {
        const eng = document.createElement('span');
        eng.style.cssText = 'font-size:0.7rem;color:#1B5E20;display:block;margin-top:4px';
        eng.textContent = q.options[idx].english;
        b.appendChild(eng);
      }
    }
  });
  const fb = document.getElementById(`${lid}-quiz-feedback`);
  if (correct) {
    btn.classList.add('correct'); s.quizScore++; addXP(10);
    const msgs = ['Geng mak! — Very good! 🌟','Took tong! — Correct! ✅','Yot yiam! — Excellent! 🎉','Sut yod! — Amazing! 💫'];
    fb.innerHTML = `<span class="feedback-correct">${msgs[Math.floor(Math.random()*msgs.length)]}</span>`;
  } else {
    btn.classList.add('wrong');
    fb.innerHTML = `<span class="feedback-wrong">Mai pen rai! — The answer was: <strong>${q.isReverse ? q.phrase.english : q.phrase.roman}</strong></span>`;
  }
  setTimeout(() => {
    s.quizIdx++;
    if (s.quizIdx >= s.quizQs.length) lShowResults(lid);
    else lRenderQuestion(lid);
  }, 1600);
}

function lShowResults(lid) {
  const s = getLState(lid);
  const total = s.quizQs.length;
  const pct = Math.round(s.quizScore/total*100);
  s.quizDone = true;
  lsw(lid, 'results');
  document.getElementById(`${lid}-score-num`).textContent = s.quizScore;
  document.getElementById(`${lid}-score-den`).textContent = '/ '+total;
  document.getElementById(`${lid}-score-ring`).style.background =
    `conic-gradient(var(--gold) ${Math.round(pct/100*360)}deg, var(--cream-dark) ${Math.round(pct/100*360)}deg)`;
  let msgThai, msgEn, emoji;
  if (pct >= 80) { msgThai='Khun geng mak!'; msgEn="You're a natural! 🌟"; emoji='🌟'; earnBadge('perfect'); }
  else if (pct >= 50) { msgThai='Dee mak!'; msgEn='Keep practicing! 💪'; emoji='💪'; }
  else { msgThai='Mai pen rai!'; msgEn="Don't worry, try again! 🙏"; emoji='🙏'; }
  document.getElementById(`${lid}-results-emoji`).textContent = emoji;
  document.getElementById(`${lid}-result-msg-thai`).textContent = msgThai;
  document.getElementById(`${lid}-result-msg-en`).textContent = msgEn;
  document.getElementById(`${lid}-result-xp`).textContent = `+${s.quizScore*10} XP Earned`;
  if (getXP() >= 100) earnBadge('100xp');
}


function buildQuizQuestions() {
  const pool = [...PHRASES];
  const shuffled = pool.sort(()=>Math.random()-0.5).slice(0,8);
  return shuffled.map((p,i) => {
    const isReverse = i >= 6; // last 2 are reverse
    const wrong = PHRASES.filter(x=>x!==p).sort(()=>Math.random()-0.5).slice(0,3);
    const options = [p,...wrong].sort(()=>Math.random()-0.5);
    return { phrase:p, isReverse, options };
  });
}

function startQuiz() {
  quizQuestions = buildQuizQuestions();
  currentQ = 0;
  score = 0;
  quizDone = false;
  answered = false;
  switchPhase('quiz');
  renderQuestion();
}

function renderQuestion() {
  const q = quizQuestions[currentQ];
  const total = quizQuestions.length;
  document.getElementById('quiz-counter').textContent = `Question ${currentQ+1} of ${total}`;
  document.getElementById('quiz-prog-fill').style.width = (currentQ/total*100)+'%';
  document.getElementById('quiz-feedback').innerHTML = '';
  answered = false;

  const label = document.getElementById('q-label');
  const prompt = document.getElementById('q-prompt');
  const speakRow = document.getElementById('quiz-speak-row');
  const speakBtn = document.getElementById('quiz-speak-btn');
  speakBtn.classList.remove('speaking');

  if(q.isReverse) {
    label.textContent = 'You hear this — what does it mean?';
    prompt.className = 'quiz-prompt-text';
    prompt.innerHTML = `<span style="font-size:1.1em;display:block;margin-bottom:4px">${q.phrase.roman}</span>${phonDict(q.phrase.phonetic, false)}`;
    speakRow.style.display = 'flex';
  } else {
    label.textContent = 'How do you say this in Thai?';
    prompt.className = 'quiz-prompt-text';
    prompt.textContent = q.phrase.english;
    speakRow.style.display = 'flex';
  }

  const opts = document.getElementById('quiz-opts');
  opts.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    if(q.isReverse) {
      btn.innerHTML = `<span style="font-weight:700;display:block;margin-bottom:3px">${opt.english}</span><span style="font-size:0.78rem;color:var(--text-light);display:block;margin-bottom:2px">${opt.roman}</span>${phonDict(opt.phonetic, false)}`;
    } else {
      btn.innerHTML = `<span style="font-weight:700;display:block;margin-bottom:3px">${opt.roman}</span>${phonDict(opt.phonetic, false)}`;
    }
    btn.onclick = () => handleAnswer(btn, opt, q);
    opts.appendChild(btn);
  });
}

function handleAnswer(btn, chosen, q) {
  if(answered) return;
  answered = true;
  const correct = chosen === q.phrase;
  const allBtns = [...document.querySelectorAll('.quiz-opt')];

  allBtns.forEach((b, optIdx) => {
    b.disabled = true;
    if(q.options[optIdx] === q.phrase) {
      b.classList.add('reveal-correct');
      // Only reveal English on the correct answer tile after answering
      if(!q.isReverse) {
        const eng = document.createElement('span');
        eng.style.cssText = 'font-size:0.7rem;color:#1B5E20;display:block;margin-top:4px';
        eng.textContent = q.options[optIdx].english;
        b.appendChild(eng);
      }
    }
  });

  const fb = document.getElementById('quiz-feedback');

  if(correct) {
    btn.classList.add('correct');
    score++;
    addXP(10);
    const msgs = [
      'Geng mak! — Very good! 🌟',
      'Took tong! — Correct! ✅',
      'Yot yiam! — Excellent! 🎉',
      'Sut yod! — Amazing! 💫'
    ];
    fb.innerHTML = `<span class="feedback-correct">${msgs[Math.floor(Math.random()*msgs.length)]}</span>`;
  } else {
    btn.classList.add('wrong');
    fb.innerHTML = `<span class="feedback-wrong">Mai pen rai! — The answer was: <strong>${q.isReverse ? q.phrase.english : q.phrase.roman}</strong>${q.isReverse ? ` (${q.phrase.roman} · ${q.phrase.phonetic})` : ` · ${q.phrase.phonetic} — "${q.phrase.english}"`}</span>`;
  }

  setTimeout(() => {
    currentQ++;
    if(currentQ >= quizQuestions.length) {
      showResults();
    } else {
      renderQuestion();
    }
  }, 1600);
}

function showResults() {
  const total = quizQuestions.length;
  const pct = Math.round(score/total*100);
  quizDone = true;
  switchPhase('results');

  document.getElementById('score-num').textContent = score;
  document.getElementById('score-den').textContent = '/ '+total;

  // Animate ring
  const deg = Math.round(pct/100*360);
  document.getElementById('score-ring').style.background =
    `conic-gradient(var(--gold) ${deg}deg, var(--cream-dark) ${deg}deg)`;

  let msgThai, msgEn, emoji;
  if(pct >= 80) {
    msgThai = 'Khun geng mak!'; msgEn = "You're a natural! 🌟"; emoji='🌟';
    earnBadge('perfect');
  } else if(pct >= 50) {
    msgThai = 'Dee mak!'; msgEn = 'Keep practicing! 💪'; emoji='💪';
  } else {
    msgThai = 'Mai pen rai!'; msgEn = "Don't worry, review and try again! 🙏"; emoji='🙏';
  }

  document.getElementById('results-emoji').textContent = emoji;
  document.getElementById('result-msg-thai').textContent = msgThai;
  document.getElementById('result-msg-en').textContent = msgEn;
  document.getElementById('result-xp').textContent = `+${score*10} XP Earned`;

  // Save progress
  const best = parseInt(localStorage.getItem(KEYS.bestScore)||'0');
  if(score > best) localStorage.setItem(KEYS.bestScore, score);
  localStorage.setItem(KEYS.lessonsCompleted,'1');
  earnBadge('first-lesson');

  const xp = getXP();
  if(xp >= 100) earnBadge('100xp');
  const streak = parseInt(localStorage.getItem(KEYS.streak)||'0');
  if(streak >= 3) earnBadge('streak');
}

// ===================== PHASES (LESSON 1 — 3-STEP PATH) =====================
const L1_PHASES = ['introduce','match','notes','flashcards','quiz','results'];

function switchPhase(phase) {
  if (phase === 'quiz' && quizQuestions.length === 0) { startQuiz(); return; }
  if (phase === 'quiz' && quizDone) { startQuiz(); return; }
  if (phase === 'match') { initMatch(); }
  if (phase === 'flashcards') { l1FcRender(); }

  L1_PHASES.forEach(p => {
    const el = document.getElementById(p + '-phase');
    if (el) el.style.display = p === phase ? 'block' : 'none';
  });

  // Update step nodes
  const stepMap = { introduce:1, match:2, quiz:3 };
  [1,2,3].forEach(n => {
    const node = document.getElementById('step' + n + '-node');
    const label = document.getElementById('step' + n + '-label');
    const current = stepMap[phase] || 0;
    if (node) {
      node.classList.toggle('active', n === current);
      node.classList.toggle('done', n < current || (phase === 'results' && n <= 3));
    }
    if (label) {
      label.style.color = n === current ? 'var(--red)' : n < current ? 'var(--gold-dark)' : 'var(--text-light)';
      label.style.fontWeight = n === current ? '700' : '400';
    }
    const line = document.getElementById('step-line-' + n);
    if (line) line.classList.toggle('done', n < current || phase === 'results');
  });
}

// ── L1 FLASHCARDS ──
let l1FcIdx = 0;
let l1FcIsFlipped = false;
let l1FcOrder = [];

function l1FcRender() {
  if (!l1FcOrder.length) l1FcOrder = shuffle(PHRASES.map((_,i) => i));
  const p = PHRASES[l1FcOrder[l1FcIdx]];
  l1FcIsFlipped = false;
  const card = document.getElementById('l1-flashcard');
  if (card) { card.style.transition='none'; card.classList.remove('flipped'); card.offsetHeight; card.style.transition=''; }
  document.getElementById('l1-fc-roman').textContent = p.roman;
  document.getElementById('l1-fc-phonetic').innerHTML = phonDict(p.phonetic, true);
  document.getElementById('l1-fc-thai').textContent = '(' + p.thai + ')';
  document.getElementById('l1-fc-english').textContent = p.english;
  document.getElementById('l1-fc-roman-back').textContent = p.roman;
  document.getElementById('l1-fc-phonetic-back').innerHTML = phonDict(p.phonetic, false);
  document.getElementById('l1-fc-usage').textContent = p.usage;
  document.getElementById('l1-fc-counter').textContent = `Card ${l1FcIdx + 1} of ${PHRASES.length}`;
  renderDots('l1-fc-dots', l1FcIdx, PHRASES.length);
}

function l1FcFlip() {
  l1FcIsFlipped = !l1FcIsFlipped;
  document.getElementById('l1-flashcard')?.classList.toggle('flipped', l1FcIsFlipped);
}

function l1FcNext() {
  l1FcIdx = (l1FcIdx + 1) % PHRASES.length;
  l1FcRender();
}

function l1FcPrev() {
  l1FcIdx = (l1FcIdx - 1 + PHRASES.length) % PHRASES.length;
  l1FcRender();
}

function l1FcSpeak(btn) {
  speakThai(buildSpeechText(PHRASES[l1FcOrder[l1FcIdx]]), btn);
}

// ── INTRODUCE ──
let introIdx = 0;
let introSeen = new Set();

function renderIntroCard() {
  const p = PHRASES[introIdx];
  document.getElementById('intro-english').textContent = p.english;
  document.getElementById('intro-roman').textContent = p.roman;
  document.getElementById('intro-phonetic').innerHTML = phonDict(p.phonetic, true);
  document.getElementById('intro-thai').textContent = '(' + p.thai + ')';
  document.getElementById('intro-usage').textContent = p.usage;
  // Show gender-appropriate particle, not both
  const particle = speakerGender === 'male' ? 'khrap' : 'kha';
  const contextText = p.context.includes('khrap') || p.context.includes('kha')
    ? `+ ${particle}`
    : p.context;
  document.getElementById('intro-context').textContent = contextText;
  document.getElementById('intro-counter').textContent = `${introIdx + 1} / ${PHRASES.length}`;
  introSeen.add(introIdx);
  renderDots('intro-dots', introIdx, PHRASES.length);
  // Show continue button after all cards seen
  const btn = document.getElementById('intro-continue-btn');
  if (btn) btn.style.display = introSeen.size >= PHRASES.length ? 'inline-block' : 'none';
}

function speakIntroCard(btn) {
  speakThai(buildSpeechText(PHRASES[introIdx]), btn);
}

function nextIntro() {
  introIdx = (introIdx + 1) % PHRASES.length;
  renderIntroCard();
}

function prevIntro() {
  introIdx = (introIdx - 1 + PHRASES.length) % PHRASES.length;
  renderIntroCard();
}

// ── MATCH ──
let matchSelected = null;
let matchPairs = [];
let matchMatched = 0;
let matchRound = 1;
let matchAllPhrases = [];

function initMatch(round) {
  matchRound = round || 1;
  matchSelected = null;
  matchMatched = 0;
  document.getElementById('match-feedback').textContent = '';
  const complete = document.getElementById('match-complete');
  if (complete) { complete.innerHTML = ''; complete.style.display = 'none'; }

  // Split all 8 phrases into 2 rounds of 4
  if (matchRound === 1) {
    matchAllPhrases = shuffle([...PHRASES]);
  }
  matchPairs = matchAllPhrases.slice((matchRound - 1) * 4, matchRound * 4);

  // Update round indicator
  document.getElementById('match-feedback').innerHTML =
    `<span style="color:var(--text-light);font-size:0.78rem">Round ${matchRound} of 2 — match all ${matchPairs.length} pairs</span>`;

  const romans = shuffle(matchPairs.map(p => ({ type:'roman', phrase:p })));
  const engls  = shuffle(matchPairs.map(p => ({ type:'english', phrase:p })));

  const grid = document.getElementById('match-grid');
  grid.innerHTML = '';

  for (let i = 0; i < matchPairs.length; i++) {
    [romans[i], engls[i]].forEach(item => {
      const tile = document.createElement('div');
      tile.className = `match-tile ${item.type}`;
      if (item.type === 'roman') {
        tile.innerHTML = `<span style="font-weight:700">${item.phrase.roman}</span><span style="font-size:0.68rem;color:var(--text-light);margin-top:2px;display:block">${phonDict(item.phrase.phonetic, false)}</span>`;
      } else {
        tile.textContent = item.phrase.english;
      }
      tile.addEventListener('click', () => onMatchTap(tile, item));
      grid.appendChild(tile);
    });
  }
}

function onMatchTap(tile, item) {
  if (tile.classList.contains('matched')) return;

  if (!matchSelected) {
    document.querySelectorAll('.match-tile.selected').forEach(t => t.classList.remove('selected'));
    tile.classList.add('selected');
    matchSelected = { tile, item };
    return;
  }

  const first = matchSelected;
  matchSelected = null;

  // Must pick different types
  if (first.item.type === item.type) {
    document.querySelectorAll('.match-tile.selected').forEach(t => t.classList.remove('selected'));
    tile.classList.add('selected');
    matchSelected = { tile, item };
    return;
  }

  const isMatch = first.item.phrase === item.phrase;

  if (isMatch) {
    first.tile.classList.remove('selected');
    first.tile.classList.add('matched');
    tile.classList.add('matched');
    matchMatched++;
    speakThai(buildSpeechText(item.phrase), null);
    document.getElementById('match-feedback').innerHTML =
      `<span style="color:#2E7D32">✓ ${item.phrase.roman} = ${item.phrase.english}</span>`;

    if (matchMatched >= matchPairs.length) {
      setTimeout(() => {
        const c = document.getElementById('match-complete');
        c.style.display = 'block';
        if (matchRound === 1) {
          c.innerHTML = `
            <p style="font-family:'Cinzel',serif;color:var(--red);font-size:1rem;margin-bottom:0.5rem;">Round 1 complete! 🎉</p>
            <p style="font-size:0.82rem;color:var(--text-light);margin-bottom:1rem;">4 more to go — let's finish strong!</p>
            <button class="btn-start-quiz" onclick="initMatch(2);document.getElementById('match-complete').style.display='none'">Start Round 2 →</button>`;
        } else {
          c.innerHTML = `
            <p style="font-family:'Cinzel',serif;color:var(--red);font-size:1rem;margin-bottom:0.5rem;">All 8 matched! Sut yod! 💪</p>
            <button class="btn-start-quiz" onclick="switchPhase('quiz')" style="margin-bottom:0.5rem">Final Step: Quiz →</button><br>
            <button class="btn-retry" style="margin-top:0.5rem" onclick="initMatch(1)">🔄 Play Again</button>`;
        }
      }, 400);
    }
  } else {
    first.tile.classList.add('wrong');
    tile.classList.add('wrong');
    document.getElementById('match-feedback').innerHTML =
      `<span style="color:#C62828">✗ Not a match — try again</span>`;
    setTimeout(() => {
      first.tile.classList.remove('wrong','selected');
      tile.classList.remove('wrong','selected');
      document.getElementById('match-feedback').innerHTML =
        `<span style="color:var(--text-light);font-size:0.78rem">Round ${matchRound} of 2 — match all ${matchPairs.length} pairs</span>`;
    }, 800);
  }
}



// ===================== XP POPUP =====================
function showXPPopup(amount) {
  const el = document.createElement('div');
  el.className = 'xp-popup';
  el.textContent = '+'+amount+' XP';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1900);
}

// ===================== PROGRESS PAGE =====================
function updateProgressPage() {
  const xp = getXP();
  const streak = parseInt(localStorage.getItem(KEYS.streak)||'0');
  const lessons = localStorage.getItem(KEYS.lessonsCompleted)?1:0;
  const best = localStorage.getItem(KEYS.bestScore)||'—';
  const badges = getBadges();

  document.getElementById('total-xp-display').textContent = xp;
  document.getElementById('streak-display').textContent = streak;
  document.getElementById('lessons-display').textContent = lessons;
  document.getElementById('best-score-display').textContent = best !== '—' ? best+'/8' : '—';

  const pct = Math.min((xp%100), 100);
  document.getElementById('prog-xp-fill').style.width = pct+'%';
  document.getElementById('prog-xp-cur').textContent = xp+' XP';
  document.getElementById('prog-xp-next').textContent = (100-(xp%100))+' XP to next level';

  // Badges
  const badgeMap = {
    'first-lesson':'badge-first-lesson',
    'perfect':'badge-perfect',
    'culture':'badge-culture',
    'streak':'badge-streak',
    '100xp':'badge-100xp',
  };
  Object.entries(badgeMap).forEach(([key,id]) => {
    const el = document.getElementById(id);
    if(el) el.classList.toggle('earned', badges.includes(key));
  });

  renderDict();
}

// ===================== DICTIONARY =====================
function renderDict(filter, cat) {
  const search = (filter || document.getElementById('dict-search')?.value || '').toLowerCase();
  const category = cat !== undefined ? cat : (document.getElementById('dict-cat')?.value || '');
  const tbody = document.getElementById('dict-tbody');
  if (!tbody) return;

  const catClass = { 'Greetings':'greetings', 'Numbers':'numbers' };

  const filtered = [...PHRASES, ...NUMS].filter(p => {
    const matchSearch = !search ||
      p.english.toLowerCase().includes(search) ||
      p.roman.toLowerCase().includes(search) ||
      p.thai.includes(search);
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="dict-empty">No words found. Try a different search.</td></tr>`;
    return;
  }

  const allForDict = [...PHRASES, ...NUMS];
  tbody.innerHTML = filtered.map((p) => {
    const cc = catClass[p.category] || 'greetings';
    const idx = allForDict.findIndex(x => x.thai === p.thai && x.english === p.english);
    return `<tr onclick="dictSpeak(${idx}, this)">
      <td>
        <div class="dict-eng">${p.english}</div>
        <div style="font-size:0.75rem;color:var(--text-light);margin-top:1px">${p.context}</div>
      </td>
      <td class="dict-roman">${p.roman}</td>
      <td>${phonDict(p.phonetic, false)}</td>
      <td><span class="dict-cat ${cc}">${p.category}</span></td>
      <td><button class="dict-speak-btn" onclick="event.stopPropagation();dictSpeak(${idx}, this.closest('tr'))" title="Hear pronunciation">🔊</button></td>
    </tr>`;
  }).join('');
}

function filterDict() {
  renderDict();
}

function dictSpeak(phraseIdx, row) {
  const allForDict = [...PHRASES, ...NUMS];
  const phrase = allForDict[phraseIdx];
  if (!phrase) return;
  const btn = row.querySelector('.dict-speak-btn');
  speakThai(buildSpeechText(phrase), btn);
}

// ===================== NUMBERS TABLE =====================
function renderNumbersTable() {
  const tbody = document.getElementById('numbers-table-body');
  if (!tbody || tbody.innerHTML) return; // only render once
  tbody.innerHTML = NUMS.map((p, i) => `
    <tr onclick="speakThai('${p.thai}', this.querySelector('.dict-speak-btn'))" style="cursor:pointer">
      <td style="font-weight:700;color:var(--text-light);font-size:0.85rem">${i < 10 ? i+1 : '฿'}</td>
      <td><div class="dict-eng">${p.english}</div></td>
      <td class="dict-roman">${p.roman}</td>
      <td>${phonDict(p.phonetic, false)}</td>
      <td><button class="dict-speak-btn" onclick="event.stopPropagation();speakThai('${p.thai}',this)" title="Hear it">🔊</button></td>
    </tr>`).join('');
}

// ===================== INIT =====================

function init() {
  renderIntroCard();
  updateStreak();
  updateNavXP();
  updateProgressPage();
  setGender(speakerGender);
}

init();