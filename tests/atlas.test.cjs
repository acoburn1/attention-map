const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const http = require('node:http');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const content = fs.readFileSync(path.join(root, 'region-content.js'), 'utf8');
test('research content URL changes when its content changes', () => {
  const version = require('node:crypto').createHash('sha256').update(content.replace(/\r\n/g, '\n')).digest('hex').slice(0, 12);
  assert.ok(html.includes(`src="region-content.js?v=${version}"`),
    'Run node scripts/version-content.cjs after editing region-content.js');
});
const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
new vm.Script(content);
new vm.Script(inline);
const data = vm.runInNewContext(content + '\n' + inline.slice(0, inline.indexOf('const svg =')) +
  '\n({papers, researchPapers, researchUpdates, developerNotes, regionGuides, readingTrails, nodes, edges, paperMeta, guidePaperIds, synthesisClaims})');

test('every guide, pathway, reading trail and source resolves', () => {
  const nodeIds = new Set(data.nodes.map(n => n.id));
  assert.equal(nodeIds.size, 17);
  assert.equal(Object.keys(data.regionGuides).length, nodeIds.size);
  const checkPaper = id => assert.ok(data.papers[id], `Missing paper ${id}`);
  for (const node of data.nodes) {
    const guide = data.regionGuides[node.id];
    assert.ok(guide.subtitle && guide.test.question && guide.test.prediction && guide.test.controls);
    for (const section of ['anatomy', 'mechanisms']) {
      assert.ok(guide[section].length >= 2);
      for (const card of guide[section]) {
        assert.ok(card.title && card.text && card.papers.length);
        card.papers.forEach(checkPaper);
      }
    }
    assert.ok(guide.experiments.length >= 2);
    for (const experiment of guide.experiments) {
      assert.ok(experiment.question && experiment.design && experiment.result && experiment.limit);
      checkPaper(experiment.paper);
    }
    guide.related.forEach(id => assert.ok(nodeIds.has(id), `Missing related region ${id}`));
    guide.reading.forEach(checkPaper);
    data.guidePaperIds(node.id).forEach(checkPaper);
  }
  for (const edge of data.edges) {
    assert.ok(nodeIds.has(edge.s) && nodeIds.has(edge.t));
    edge.papers.forEach(checkPaper);
  }
  for (const trail of data.readingTrails) trail.regions.forEach(id => assert.ok(nodeIds.has(id)));
  for (const claim of data.synthesisClaims) claim.papers.forEach(checkPaper);
  for (const [id, paper] of Object.entries(data.researchPapers)) {
    assert.ok(paper.title && paper.authors && paper.journal && paper.species && paper.note);
    assert.ok(paper.topics.length && paper.methods.length);
    assert.match(paper.url, /^https:\/\//);
    assert.ok(data.paperMeta[id]);
  }
  assert.equal(new Set(data.edges.map(e => e.id)).size, data.edges.length);
  assert.equal(new Set(data.researchUpdates.map(u => u.paper)).size, data.researchUpdates.length);
  for (const update of data.researchUpdates) {
    checkPaper(update.paper);
    const paper = data.papers[update.paper];
    assert.match(paper.publicationDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(paper.publicationDate <= update.added, 'No future publications in the digest');
    assert.ok(paper.status && update.finding && update.meaning && update.limit);
    if (update.theory) {
      assert.ok(update.theory.background && update.theory.change && update.theory.boundary);
      assert.ok(update.theory.papers.length > 1);
      update.theory.papers.forEach(checkPaper);
    }
    update.regions.forEach(id => assert.ok(nodeIds.has(id)));
    assert.ok(update.regions.some(id => data.guidePaperIds(id).includes(update.paper)), 'Digest study is integrated in a linked guide');
  }
  const experiments = Object.values(data.regionGuides).reduce((count, guide) => count + guide.experiments.length, 0);
  console.log(`${nodeIds.size} guides, ${experiments} experiment walkthroughs, ${data.edges.length} pathways, ${Object.keys(data.papers).length} references; ${Object.keys(data.researchPapers).length} additions`);
});

test('region exploration, reference filters, keyboard access and mobile layouts', async () => {
  const { chromium } = require('playwright');
  const server = http.createServer((req, res) => {
    const file = req.url.split(/[?#]/)[0];
    if (file === '/' || file === '/index.html') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html);
    } else if (file === '/region-content.js') {
      res.setHeader('Content-Type', 'text/javascript; charset=utf-8'); res.end(content);
    } else { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  const errors = [];
  try {
    browser = await chromium.launch({ channel: process.env.ATLAS_BROWSER_CHANNEL || 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', error => errors.push(error.message));
    const url = `http://127.0.0.1:${server.address().port}`;
    await page.goto(url);
    assert.equal(await page.locator('.node').count(), data.nodes.length);
    assert.equal(await page.locator('.edge').count(), data.edges.length);
    if (process.env.ATLAS_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.ATLAS_SCREENSHOT_DIR, 'map-desktop.png') });
    await page.locator('[data-open-reference="latest"]').click();
    assert.equal(await page.locator('.research-card').count(), data.researchUpdates.length);
    assert.match(await page.locator('#reference-latest').innerText(), /Earlier paper · new to the map/i);
    if (process.env.ATLAS_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.ATLAS_SCREENSHOT_DIR, 'latest-desktop.png') });
    const theory = page.locator('[data-update-paper="tomic2026"] .theory-connection');
    assert.equal(await theory.evaluate(el => el.open), false);
    await theory.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.ok(await theory.locator('.theory-content').isVisible());
    assert.equal(await theory.locator('a').count(), 3);
    assert.match(await theory.innerText(), /Editorial synthesis/);
    if (process.env.ATLAS_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.ATLAS_SCREENSHOT_DIR, 'theory-desktop.png') });
    await theory.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await theory.evaluate(el => el.open), false);
    assert.equal(await page.locator('[data-update-paper="xu2026"] .theory-connection').count(), 0);

    await page.locator('[data-update-paper="yu2026"] [data-region-link="md"]').click();
    await page.locator('[data-guide-section="experiments"]').click();
    assert.match(await page.locator('#guideContent').innerText(), /ketamine/);
    await page.keyboard.press('Escape');
    await page.locator('[data-open-reference="notes"]').click();
    assert.equal(await page.locator('#reference-notes details[open]').count(), 0);
    await page.locator('#reference-notes summary').first().focus();
    await page.keyboard.press('Enter');
    assert.ok(await page.locator('#reference-notes ul').first().isVisible());
    if (process.env.ATLAS_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.ATLAS_SCREENSHOT_DIR, 'notes-desktop.png') });
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[data-open-reference="notes"]').evaluate(el => document.activeElement === el), true);
    await page.locator('.node[data-id="md"]').focus();
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#details').innerText(), /Mediodorsal thalamus/);
    await page.locator('#exploreSelectedRegion').click();
    assert.equal(await page.locator('#atlasRegion').inputValue(), 'md');
    assert.match(page.url(), /#region\/md\/anatomy$/);
    assert.equal(await page.locator('.app').evaluate(el => el.inert), true);

    for (const n of data.nodes) {
      await page.locator('#atlasRegion').selectOption(n.id);
      for (const section of ['anatomy', 'mechanisms', 'experiments', 'questions']) {
        await page.locator(`[data-guide-section="${section}"]`).click();
        const text = await page.locator('#guideContent').innerText();
        assert.ok(text.length > 100, `${n.id}/${section} rendered`);
        assert.ok(!text.includes('undefined'));
        assert.match(page.url(), new RegExp(`#region/${n.id}/${section}$`));
      }
    }
    await page.locator('#atlasRegion').selectOption('dpulv');
    await page.locator('[data-guide-section="experiments"]').click();
    assert.equal(await page.locator('#guideContent article').count(), 3);
    if (process.env.ATLAS_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.ATLAS_SCREENSHOT_DIR, { recursive: true });
      await page.screenshot({ path: path.join(process.env.ATLAS_SCREENSHOT_DIR, 'explorer-desktop.png') });
    }
    await page.locator('#atlasLibrary').click();
    assert.equal(await page.locator('#libraryRegion').inputValue(), 'dpulv');
    assert.equal(await page.locator('.library-paper').count(), data.guidePaperIds('dpulv').length);
    await page.locator('#librarySearch').fill('reward');
    assert.ok(await page.locator('.library-paper').count() > 0);
    await page.locator('[data-reference-tab="glossary"]').click();
    await page.locator('[data-reference-tab="library"]').click();
    assert.equal(await page.locator('#librarySearch').inputValue(), 'reward');
    assert.equal(await page.locator('#libraryRegion').inputValue(), 'dpulv');
    await page.locator('#clearLibraryFilters').click();
    assert.equal(await page.locator('.library-paper').count(), Object.keys(data.papers).length);
    await page.locator('#librarySearch').fill('no-matching-study-xyz');
    assert.equal(await page.locator('.library-paper').count(), 0);
    await page.locator('#clearLibraryFilters').click();
    await page.locator('#librarySearch').fill('superior colliculus');
    assert.ok(await page.locator('.library-paper').count() >= data.guidePaperIds('sc').length);
    await page.locator('#clearLibraryFilters').click();
    await page.locator('#libraryMethod').selectOption('Human intracranial');
    assert.ok(await page.locator('.library-paper').count() >= 2);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#referenceModal').evaluate(el => el.hidden), true);
    assert.equal(await page.locator('.app').evaluate(el => el.inert), false);

    // A fresh load must open the requested guide and section without a prior click.
    await page.goto(`${url}/#region/sc/experiments`);
    assert.equal(await page.locator('#atlasRegion').inputValue(), 'sc');
    assert.match(await page.locator('#guideContent').innerText(), /cortical enhancement/);
    await page.locator('[data-guide-section="mechanisms"]').click();
    await page.goBack();
    await page.waitForFunction(() => guideSection === 'experiments');
    await page.locator('#atlasLocate').click();
    assert.equal(await page.locator('.node.selected').getAttribute('data-id'), 'sc');
    assert.equal(await page.locator('.node.selected').evaluate(el => document.activeElement === el), true);
    await page.keyboard.press('Space');
    await page.locator('#exploreSelectedRegion').click();
    const lastFocusable = page.locator('#referenceModal button, #referenceModal a[href], #referenceModal input, #referenceModal select, #referenceModal summary').filter({ visible: true }).last();
    await lastFocusable.focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('#referenceClose').evaluate(el => document.activeElement === el), true);
    await page.keyboard.press('Escape');
    await page.locator('#search').fill('postsynaptic summation');
    assert.equal(await page.locator('.node[data-id="retina"]').evaluate(el => el.classList.contains('hidden')), false);
    await page.locator('#search').fill('');
    // Selecting from a filtered map must show that node and the full overview again.
    await page.locator('.view-btn[data-view="control"]').click();
    await page.locator('[data-open-reference="regions"]').click();
    await page.locator('#atlasRegion').selectOption('retina');
    await page.locator('#atlasLocate').click();
    assert.equal(await page.locator('.node.selected').getAttribute('data-id'), 'retina');
    assert.equal(await page.locator('.node.selected').evaluate(el => el.classList.contains('hidden')), false);
    await page.locator('#reset').click();
    assert.equal(await page.locator('.node:not(.hidden)').count(), data.nodes.length);
    await page.locator('#search').fill('no-matching-region-xyz');
    assert.equal(await page.locator('.node:not(.hidden)').count(), 0);
    await page.locator('#reset').click();
    await page.locator('#search').fill('');

    for (const width of [390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${url}/#latest`);
      assert.ok(await page.locator('#latestTitle').isVisible());
      assert.ok(await page.locator('.reference-body').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
      if (process.env.ATLAS_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.ATLAS_SCREENSHOT_DIR, `latest-${width}.png`) });

      const mobileTheory = page.locator('[data-update-paper="tomic2026"] .theory-connection');
      if (!await mobileTheory.evaluate(el => el.open)) await mobileTheory.locator('summary').click();
      assert.ok(await mobileTheory.locator('.theory-content').isVisible());
      assert.ok(await page.locator('.reference-body').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
      if (process.env.ATLAS_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.ATLAS_SCREENSHOT_DIR, 'theory-' + width + '.png') });
      await page.locator('[data-update-paper="ramezanpour2026"] [data-region-link="bg"]').click();
      assert.equal(await page.locator('#atlasRegion').inputValue(), 'bg');
      await page.goto(`${url}/#developer-notes`);
      assert.ok(await page.locator('#notesTitle').isVisible());
      if (!await page.locator('#reference-notes details').first().evaluate(el => el.open)) await page.locator('#reference-notes summary').first().click();
      assert.ok(await page.locator('#reference-notes ul').first().isVisible());
      assert.ok(await page.locator('.reference-body').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
      if (process.env.ATLAS_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.ATLAS_SCREENSHOT_DIR, `notes-${width}.png`) });
      await page.goto(`${url}/#region/vpulv/experiments`);
      assert.ok(await page.locator('#guideContent').isVisible());
      assert.ok(await page.locator('.reference-shell').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
      assert.ok(await page.locator('.reference-body').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
      if (process.env.ATLAS_SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.ATLAS_SCREENSHOT_DIR, `explorer-${width}.png`) });
      await page.locator('[data-reference-tab="library"]').click();
      assert.ok(await page.locator('.reference-body').evaluate(el => el.scrollWidth <= el.clientWidth + 1));
    }
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href + '#latest');
    assert.ok(await page.locator('#latestTitle').isVisible());
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href + '#developer-notes');
    assert.ok(await page.locator('#notesTitle').isVisible());
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href + '#region/trn/mechanisms');
    assert.equal(await page.locator('#atlasRegion').inputValue(), 'trn');
    assert.match(await page.locator('#guideContent').innerText(), /competing channel/);
    assert.deepEqual(errors, []);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
