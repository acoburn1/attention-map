# Thalamus–Pulvinar Attention Network

[Published map](https://acoburn1.github.io/attention-map/)

Select a region for its short overview, then choose **Explore in depth** for orientation, mechanisms, experiment walkthroughs, open questions, and a suggested reading order. The header's **Region explorer** also lets you browse all 17 guides. Related-region links and four reading trails connect ideas across the network.

The literature library supports combined region, topic, evidence-type, species, and text filters. Guide links preserve the selected region and section, for example `#region/md/experiments`. Nodes and pathways can be selected with Tab followed by Enter or Space; Escape closes the reference panel.

**Latest research** (`#latest`) connects new papers to the map, with separate publication and site addition dates. Earlier papers added to the collection are labeled explicitly. **Developer notes** (`#developer-notes`), linked from the sidebar footer, keeps weekly changes in collapsed entries. Selected entries also offer expandable **Theory connections**, with earlier evidence, what the new finding adds, and what remains unresolved. Both sections are maintained in `region-content.js`; the digest keeps six entries visible and retains older entries in an expandable archive.

Open `index.html` locally, or serve this directory with a static web server. Keep `region-content.js` alongside it. There is no build step. See [research notes](RESEARCH.md) for the expansion's scope and important interpretive corrections.

For development checks, use Node.js with Playwright available and run `node --test tests/atlas.test.cjs`. The browser checks use installed Microsoft Edge by default; set `ATLAS_BROWSER_CHANNEL` to another installed Playwright Chromium channel if needed. They cover citation integrity, all guide sections, filters, deep links, navigation, keyboard focus, local-file loading, and phone/tablet overflow. Set `ATLAS_SCREENSHOT_DIR` to save preview images.
