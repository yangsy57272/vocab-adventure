/* Study records use the learner's local calendar, independent of UTC. */
function dateKey(date=new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function daysAgo(n) { const d=new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()-n); return dateKey(d); }
function saveStudy() { localStorage.setItem('vocab_study',JSON.stringify(study)); }
function recordStudy(word,correct,isQuiz) {
  const today=dateKey(), key=JSON.stringify([currentBook,word]);
  const activity=study.activity[today] ||= {words:[],attempts:0,correct:0};
  if(!activity.words.includes(key)) activity.words.push(key);
  if(isQuiz) { activity.attempts++; if(correct) activity.correct++; }
  const old=study.reviews[key];
  if(!correct) study.reviews[key]={level:0,due:today};
  else if(!old || old.due<=today) {
    const level=Math.min((old?.level||0)+1,5);
    const next=new Date(); next.setHours(12,0,0,0); next.setDate(next.getDate()+[0,1,3,7,14,30][level]);
    study.reviews[key]={level,due:dateKey(next)};
  }
  saveStudy();
}
function rateCard(correct) {
  const words=cardWords(); if(!words.length)return;
  const word=words[Math.min(cardIndex,words.length-1)];
  if(!cardFlipped) { flipCard(); document.getElementById('reviewHint').textContent='Check the meaning, then tap Again or Got it to rate your recall.'; return; }
  recordStudy(word.w,correct,false);
  const due=study.reviews[JSON.stringify([currentBook,word.w])].due;
  document.getElementById('reviewHint').textContent=`${word.w}: next review ${due===dateKey()?'today':due}.`;
  nextCard();
}
function dueWords() {
  return allWords.filter(w=> {const r=study.reviews[JSON.stringify([currentBook,w.w])]; return r && r.due<=dateKey();});
}
function startDueReview() {
  const due=dueWords(); if(!due.length)return;
  if(!allWords.some(w=>w.w!==due[0].w && w.zh!==due[0].zh)) {showScreen('flashcard');jumpToCard(due[0].w);return;}
  showScreen('quiz');startQuiz(due.slice(0,20));
}
function studyNewWords() {
  const next=allWords.find(w=>!knownWords.has(w.w) && !study.reviews[JSON.stringify([currentBook,w.w])]);
  if(!next) {showScreen('flashcard');return;}
  currentDay='all'; currentStar='all';
  if(shuffleOn) reshuffle();
  jumpToCard(next.w); refreshAll();
}
function setDailyGoal(value) {
  const n=Number(value);
  if(!Number.isInteger(n) || n<1 || n>500) return;
  study.goal=n;saveStudy();renderDashboard();
}
function studyStreak() {
  let count=0, offset=(study.activity[dateKey()]?.words.length ? 0 : 1);
  while(study.activity[daysAgo(offset)]?.words.length) {count++;offset++;}
  return count;
}
function renderLibrary() {
  const entries=[{id:'sat',name:'SAT · 20-day plan',description:'The original 3,824-word collection with Chinese meanings, priorities, and daily study sets.',words:VOCAB_DATA},...BUILTIN_BOOKS,...books];
  document.getElementById('libraryGrid').innerHTML=entries.map(book=>`<article class="panel library-card">
    <h3>${esc(book.name)}</h3><strong>${book.words.length.toLocaleString()} words ${book.id===currentBook?'· Selected':''}</strong>
    <p class="muted">${esc(book.description||'Your personal vocabulary collection.')}</p>
    ${book.credit?`<p class="source-note">${esc(book.credit)} <a href="${esc(book.source)}" target="_blank" rel="noopener">Source</a> · <a href="https://creativecommons.org/licenses/${book.license==='CC BY-SA 4.0'?'by-sa':'by'}/4.0/" target="_blank" rel="noopener">${esc(book.license)}</a></p>`:''}
    <button class="tool-btn" onclick="switchBook('${jsEsc(book.id)}');showScreen('flashcard')">Study this book →</button>
  </article>`).join('');
}
function renderDashboard() {
  const today=study.activity[dateKey()], practiced=today?.words.length||0, due=dueWords().length;
  const known=allWords.filter(w=>knownWords.has(w.w)).length, pct=allWords.length?Math.round(100*known/allWords.length):0;
  const tracked=allWords.filter(w=>study.reviews[JSON.stringify([currentBook,w.w])]).length;
  document.getElementById('dashboardSummary').innerHTML=`<div class="dashboard-grid">
    <section class="panel"><h3>🌱 Today's goal · all books</h3><div class="metric">${practiced} / ${study.goal}</div>
      <p class="muted">Distinct words practiced today${practiced>=study.goal?' · Goal reached! 🎉':''}</p>
      <div class="goal-bar" role="progressbar" aria-label="Daily word goal" aria-valuemin="0" aria-valuemax="${study.goal}" aria-valuenow="${Math.min(practiced,study.goal)}"><i style="width:${Math.min(100,100*practiced/study.goal)}%"></i></div>
      <label class="muted" for="dailyGoal">Words per day:</label> <input id="dailyGoal" type="number" min="1" max="500" value="${study.goal}" style="width:80px;padding:6px" onchange="setDailyGoal(this.value)">
      <p class="muted" style="margin:12px 0">🔥 ${studyStreak()} day study streak</p><button class="tool-btn" onclick="studyNewWords()">Study new words →</button>
    </section>
    <section class="panel"><h3>📖 Selected book · known words</h3><div class="ring" style="--pct:${pct}%" role="img" aria-label="${pct}% marked known"><div>${pct}%<small>${known} / ${allWords.length} known</small></div></div>
      <p class="muted">Known is your own flashcard mark. Quiz accuracy is shown separately below. ${tracked} word${tracked===1?' has':'s have'} a review schedule.</p>
    </section>
    <section class="panel"><h3>🔁 Reviews due · selected book</h3><div class="metric">${due}</div><p class="muted">Words scheduled for today or earlier.</p>
      <button class="tool-btn" style="margin:14px 0" onclick="startDueReview()" ${due?'':'disabled'}>Review due words →</button>
      <p class="muted">Rate flashcards or answer quizzes to schedule reviews. Correct recalls move to 1, 3, 7, 14, then 30 days. Missed words return today.</p>
    </section></div>`;
  const colors=['#f5f3ff','#ddd6fe','#a78bfa','#7c3aed','#4c1d95'];
  document.getElementById('activityGrid').innerHTML=Array.from({length:28},(_,i)=>{
    const day=daysAgo(27-i), a=study.activity[day], count=a?.words.length||0;
    const label=`${day}: ${count} words practiced, ${a?.correct||0}/${a?.attempts||0} quiz answers correct`;
    const color=colors[count>=20?4:count>=10?3:count>=5?2:count?1:0];
    return `<button class="activity-cell" style="background:${color}" title="${label}" aria-label="${label}" onclick="document.getElementById('activityDetails').textContent=this.title"></button>`;
  }).join('');
  document.getElementById('activityDetails').textContent=`Today: ${practiced} distinct words · ${today?.correct||0}/${today?.attempts||0} quiz answers correct. Activity tracking started with this update; earlier activity is not reconstructed.`;
  document.getElementById('accuracyChart').innerHTML=Array.from({length:7},(_,i)=>{
    const day=daysAgo(6-i), a=study.activity[day], acc=a?.attempts?Math.round(100*a.correct/a.attempts):null;
    const label=`${day}: ${acc===null?'no quiz answers':`${acc}% correct (${a.correct}/${a.attempts})`}`;
    return `<div class="chart-col" role="img" aria-label="${label}" title="${label}"><span class="chart-value">${acc===null?'—':acc+'%'}</span><div class="chart-bar" style="height:${acc===null?0:acc}%;background:${acc===null?'#ede9fe':'var(--purple)'}"></div><small>${day.slice(5)}</small></div>`;
  }).join('');
  document.getElementById('bookComparison').innerHTML=allBookEntries().map(b=>{
    const knownSet=b.id===currentBook?knownWords:new Set(JSON.parse(localStorage.getItem(b.id==='sat'?'sat_known':'vocab_'+b.id+'_known')||'[]'));
    const words=b.id===currentBook?allWords:b.id==='sat'?[...VOCAB_DATA,...JSON.parse(localStorage.getItem('sat_imported')||'[]')]:b.words;
    const k=words.filter(w=>knownSet.has(w.w)).length, percent=words.length?Math.round(100*k/words.length):0;
    return `<div class="book-row"><button onclick="switchBook('${jsEsc(b.id)}')">${esc(b.name)}</button><div class="progress-bar" role="img" aria-label="${percent}% known"><div class="progress-fill" style="width:${percent}%"></div></div><span class="muted">${k} / ${words.length} known · ${percent}%</span></div>`;
  }).join('');
}
