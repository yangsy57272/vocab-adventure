const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const file = path.join(root, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : 'text/html');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || undefined });
  try {
    const context = await browser.newContext({ timezoneId: 'Asia/Shanghai', viewport: {width: 1280, height: 900} });
    const page = await context.newPage();
    await page.clock.install({time: new Date('2026-11-16T04:00:00Z')});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('dialog', d => d.accept());
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    assert.equal(await page.locator('#vocabCount').innerText(), '3824');
    assert.equal(await page.locator('#bookSelect option').count(), 6);
    assert.equal(await page.locator('#activityGrid button').count(), 28);
    assert.equal(await page.locator('#accuracyChart .chart-col').count(), 7);
    assert.equal(await page.locator('#screen-progress').getAttribute('class'), 'screen active');
    await page.evaluate(() => {knownWords.add('refute');save();});
    await page.getByRole('button', {name:'📚 Book Library',exact:true}).click();
    assert.equal(await page.locator('.library-card').count(), 6);
    for (const [id, count] of [['toefl',50],['ielts',50],['business',40],['everyday',40],['nawl',958]]) {
      await page.selectOption('#bookSelect', id);
      assert.equal(await page.locator('#vocabCount').innerText(), String(count));
      await page.evaluate(() => deleteBook());
      assert.equal(await page.locator('#bookSelect').inputValue(), id);
      await page.evaluate(() => {document.getElementById('importText').value='extra | meaning';importVocab();});
      assert.match(await page.locator('#importStatus').innerText(), /protected/);
    }
    await page.selectOption('#bookSelect','toefl');
    await page.reload();assert.equal(await page.locator('#bookSelect').inputValue(),'toefl');
    // Spaced repetition, local dates, same-day repeat protection, and daily uniqueness.
    await page.evaluate(() => {recordStudy('hypothesis',true,true);recordStudy('hypothesis',true,true);});
    let state=await page.evaluate(()=>study);
    assert.deepEqual(state.reviews['["toefl","hypothesis"]'],{level:1,due:'2026-11-17'});
    assert.equal(state.activity['2026-11-16'].words.length,1);
    assert.equal(state.activity['2026-11-16'].attempts,2);
    await page.clock.setSystemTime(new Date('2026-11-17T04:00:00Z'));
    await page.evaluate(()=>recordStudy('hypothesis',true,true));
    assert.deepEqual(await page.evaluate(()=>study.reviews['["toefl","hypothesis"]']),{level:2,due:'2026-11-20'});
    await page.evaluate(()=>recordStudy('hypothesis',false,true));
    assert.deepEqual(await page.evaluate(()=>study.reviews['["toefl","hypothesis"]']),{level:0,due:'2026-11-17'});
    await page.getByRole('button',{name:'📊 Dashboard',exact:true}).click();
    assert.match(await page.locator('#dashboardSummary').innerText(), /2 day study streak/);
    await page.locator('#dailyGoal').fill('5');await page.locator('#dailyGoal').blur();
    assert.equal(await page.evaluate(()=>study.goal),5);
    await page.getByRole('button',{name:'Review due words →',exact:true}).click();
    assert.equal(await page.locator('.option-btn').count(),4);
    await page.evaluate(()=>selectAnswer(currentOptions.findIndex(w=>w.w===quizWords[quizIndex].w)));
    assert.equal(await page.evaluate(()=>dueWords().length),0);
    // Word-to-meaning choices must not reveal the answer word as a subtitle.
    await page.evaluate(()=>{resetQuiz();quizMode='word2zh';startQuiz();});
    assert.equal(await page.locator('.option-btn small').count(),0);
    await page.selectOption('#bookSelect','sat');
    assert.equal(await page.evaluate(()=>knownWords.has('refute')),true);
    assert.equal(await page.evaluate(()=>dueWords().length),0);
    // User books, file imports, empty columns, quoted words and persistence.
    await page.getByRole('button',{name:'📚 My Books & Import',exact:true}).click();
    await page.locator('#bookName').fill('Class & Notes');await page.getByRole('button',{name:'＋ Create book',exact:true}).click();
    const custom=await page.locator('#bookSelect').inputValue();
    await page.locator('#importFile').setInputFiles({name:'words.tsv',mimeType:'text/tab-separated-values',buffer:Buffer.from("O'Brien\t\ta name\tsurname\nbonjour\tgreeting\thello\ta French greeting\nbonjour\tduplicate\ninvalid")});
    await page.waitForFunction(()=>document.getElementById('importText').value.includes("O'Brien"));
    await page.getByRole('button',{name:'✨ Import Words'}).click();
    assert.equal(await page.locator('#vocabCount').innerText(),'2');
    assert.match(await page.locator('#importStatus').innerText(),/2 duplicate or invalid/);
    await page.getByRole('button',{name:'📖 Word List',exact:true}).click();
    await page.locator('#wordList .word-item').filter({hasText:"O'Brien"}).click();
    await page.getByRole('button',{name:'✓ Got it · schedule review',exact:true}).click();
    assert.equal(await page.evaluate(()=>study.reviews[JSON.stringify([currentBook,"O'Brien"])]),undefined,'first click reveals meaning only');
    await page.getByRole('button',{name:'✓ Got it · schedule review',exact:true}).click();
    assert.ok(await page.evaluate(()=>study.reviews[JSON.stringify([currentBook,"O'Brien"])]));
    await page.reload();assert.equal(await page.locator('#bookSelect').inputValue(),custom);
    assert.equal(await page.evaluate(()=>study.goal),5);
    await page.evaluate(()=>startQuiz());assert.equal(await page.locator('.option-btn').count(),2);
    const download=page.waitForEvent('download');await page.evaluate(()=>exportBook());assert.match((await download).suggestedFilename(),/\.tsv$/);
    await page.evaluate(()=>showScreen('progress'));
    // Render real non-empty history and inspect desktop and mobile layouts.
    fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
    await page.screenshot({path:path.join(root,'test-results/dashboard-desktop.png'),fullPage:true});
    for (const screen of ['progress','library','import','flashcard']) {
      await page.setViewportSize({width:390,height:844});await page.evaluate(name=>showScreen(name),screen);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,screen+' mobile overflow');
      await page.screenshot({path:path.join(root,`test-results/${screen}-mobile.png`),fullPage:true});
    }
    await page.evaluate(()=>clearAllImported());await page.reload();assert.equal(await page.locator('#vocabCount').innerText(),'0');
    await page.evaluate(()=>deleteBook());assert.equal(await page.locator('#bookSelect').inputValue(),'sat');
    assert.equal(await page.evaluate(id=>Object.keys(study.reviews).some(k=>JSON.parse(k)[0]===id),custom),false);
    // Legacy SAT bonus imports still load alongside protected built-in words.
    await page.evaluate(()=>localStorage.setItem('sat_imported',JSON.stringify([{w:'legacyword',p:'',zh:'old import',en:'',s:3,d:21,custom:true}])));
    await page.reload();assert.equal(await page.locator('#vocabCount').innerText(),'3825');
    assert.deepEqual(errors,[]);
    console.log('PASS: six built-in books; licenses and protected imports; preserved SAT data; local-date scheduling; repeated-recall protection; goals, streaks and charts; due quizzes; custom TSV imports and export; persistent progress; deletion; four mobile screens; no browser errors.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.close());
