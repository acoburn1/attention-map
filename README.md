# Thalamus–Pulvinar Attention Network

[Published map](https://acoburn1.github.io/attention-map/)

Select a region for its short overview, then choose **Explore in depth** for orientation, mechanisms, experiment walkthroughs, open questions, and a suggested reading order. The header's **Region explorer** also lets you browse all 17 guides. Related-region links and four reading trails connect ideas across the network.

The literature library supports combined region, topic, evidence-type, species, and text filters. Guide links preserve the selected region and section, for example `#region/md/experiments`. Nodes and pathways can be selected with Tab followed by Enter or Space; Escape closes the reference panel.

**Theory development** (`#theory`) traces ten circuit histories through 47 selected milestones, using 65 sources. Every region has a tailored interpretation and a **Theory development** guide tab (for example `#region/md/history`); every map pathway links to circuit history with its own evidence boundary (for example `#connection/sc-dpulv/history`). The hub filters by region, while individual histories have links such as `#theory/sampling`. Relevant Latest research entries link into these longer histories. Each milestone separates the finding or proposal from the interpretation of what changed, labels its evidence, and links to sources. See [theory editorial notes](THEORY.md) for scope and maintenance.

**Latest research** (`#latest`) connects new papers to the map, with separate publication and site addition dates. Earlier papers added to the collection are labeled explicitly. **Developer notes** (`#developer-notes`), linked from the sidebar footer, keeps weekly changes in collapsed entries. Selected entries also offer expandable **Theory connections**, with earlier evidence, what the new finding adds, and what remains unresolved. Both sections are maintained in `region-content.js`; the digest keeps six entries visible and retains older entries in an expandable archive.

Open `index.html` locally, or serve this directory with a static web server. Keep `region-content.js` alongside it. There is no build step. See [research notes](RESEARCH.md) for the expansion's scope and important interpretive corrections.

After editing `region-content.js`, run `node scripts/version-content.cjs` before validation and commit the updated `index.html` too. This gives each content revision a different script URL so a refreshed page cannot reuse an older revision from the browser cache. The test suite checks that the version matches the content. GitHub Pages also caches the HTML for up to ten minutes; an already-open tab needs a reload, and Ctrl+Shift+R bypasses a stale browser copy.

For development checks, use Node.js with Playwright available and run `node --test tests/atlas.test.cjs`. The browser checks use installed Microsoft Edge by default; set `ATLAS_BROWSER_CHANNEL` to another installed Playwright Chromium channel if needed. They cover citation integrity, all guide sections, filters, deep links, navigation, keyboard focus, local-file loading, and phone/tablet overflow. Set `ATLAS_SCREENSHOT_DIR` to save preview images.
