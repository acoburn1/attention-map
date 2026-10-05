# Research expansion — 2 October 2026

The region explorer supplements the short map panels with orientation, mechanisms, experiment walkthroughs, and proposed discriminating tests for all 17 elements. Source links are attached to the relevant passages. The reference library includes the original collection and 35 additional primary papers, spanning foundational physiology through 2026.

This was a targeted literature review, not an exhaustive systematic review. Searches focused on the questions raised by the existing map and on underrepresented cortical, basal-ganglia, retinal, and projection-specific thalamic evidence. Publication pages, PubMed records, and available full text were used to check bibliographic information, species, interventions, findings, and the scope of interpretation. Reviews provide orientation; proposed tests are editorial synthesis.

Key additions and corrections:

- Separate encoding, selection bias, and behavioral readout using [Zénon & Krauzlis (2012)](https://www.nature.com/articles/nature11497), [Wilke et al. (2013)](https://pubmed.ncbi.nlm.nih.gov/23574581/), and the existing dorsal-pulvinar signal-detection study.
- Distinguish task phases and projection targets within MD using [Bolkan et al. (2017)](https://www.nature.com/articles/nn.4568), [Peräkylä et al. (2017)](https://pubmed.ncbi.nlm.nih.gov/28777058/), and the [SC–MD–FEF movement-monitoring pathway](https://pubmed.ncbi.nlm.nih.gov/14573558/).
- Label PFC control of sensory TRN as indirect via basal-ganglia intermediates, following [Nakajima et al. (2019)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6886709/). The BG→SC inhibitory output refers to SNr, not a direct striatal projection.
- Place the physiologically identified SC→pulvinar→MT route in inferior visual pulvinar, following [Berman & Wurtz (2010)](https://pubmed.ncbi.nlm.nih.gov/20445060/). The SC→dorsal-pulvinar priority arrow is marked unresolved.
- Compare target-specific visual, locomotor and state signals in mouse LP using [Bennett et al. (2019)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8638696/), [Blot et al. (2021)](https://pubmed.ncbi.nlm.nih.gov/33979633/), and the published [Neske & Cardin (2025)](https://pubmed.ncbi.nlm.nih.gov/39937647/) paper rather than its earlier preprint.
- Distinguish unchanged communication dimensionality from unchanged geometry using [Srinath et al. (2021)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8665027/). Their data concern MT–SC and V1–MT; the V4 guide presents this as a comparator.
- Identify human intracranial recordings separately from imaging, keep clinical stimulation conclusions within the studies' scope, and retain the provisional status of the [V1 theta reviewed preprint](https://elifesciences.org/reviewed-preprints/107731).

`region-content.js` contains the complete additions and their publication links. Existing map coordinates remain schematic. Pulvinar labels overlap, broad cortical/BG nodes compress multiple territories, and mouse LP subdivisions are not a one-to-one primate atlas.

## Weekly update — 5 October 2026

Last successful literature search: **2026-10-05**. First-run window: **2026-09-05 through 2026-10-05**, plus an explicitly labeled earlier addition. This is a targeted search, not a systematic review. Next run should search from **2026-09-28** through its actual run date to overlap by a week and catch delayed indexing.

Searched primary publication and PubMed records for pulvinar/LP, MD, TRN, superior colliculus and their attention/cortical/basal-ganglia interactions, using September 2026 and date variants. Checked existing titles and identifiers before adding references. No existing entries were superseded by these three additions.

Sources and date decisions:

- **Xu, Jasper & Kohn (2026)** — [PubMed / author abstract](https://pubmed.ncbi.nlm.nih.gov/42784457/), DOI `10.1016/j.celrep.2026.117989`. Online September 23. Added to visual pulvinar experiments and the digest. Interpretation is limited to the indexed author abstract; full-text details and numerical estimates were not inferred.
- **Yu et al. (2026)** — [published full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC13600250/), DOI `10.1126/sciadv.aee2152`. Published September 23; September 25 is the issue/collection date. Use the published paper rather than the November 2025 preprint. Added to MD experiments and the digest.
- **Ramezanpour et al. (2026)** — [PubMed and figure descriptions](https://pubmed.ncbi.nlm.nih.gov/42668539/) and [publisher discussion](https://doi.org/10.1016/j.isci.2026.116316). Online August 21, September 18 collection: explicitly classified as an earlier paper newly added, not a September discovery. Added to basal-ganglia experiments and the digest. The publisher discussion identifies missing sham and timing blinding; these limitations are retained.

Triage and follow-ups:

- The September SC review by Heymans, Reinhard & Farrow is a review, not a new primary finding; not added as news.
- MD itch and TRN seizure studies found in the date window were outside this update's attention focus. No equally relevant new LP or SC primary study was verified in this targeted pass; this is not a claim that none exists.
- Follow up the centromedian ultrasound paper, DOI `10.1016/j.brs.2026.103171`, before including it: the primary full-text endpoint returned 403, and online date/method details need verification. Do not use its September–October issue date as the online publication date.
- Revisit the existing V1 theta reviewed preprint (`107731`) for a version-of-record or assessment change in a future pass; no status change verified this run.
- For Xu et al., inspect full methods when accessible before adding subdivision, sample-size or quantitative communication claims. Keep human ultrasound targeting separate from the map's primate pulvinar subdivisions.

Implementation: added a Latest research panel, separate collapsed Developer notes, shareable `#latest` and `#developer-notes` links, and an archive for digest entries beyond the newest six. Three library records and three experiment walkthroughs added; network topology unchanged.

Validation: the documented Node/Playwright suite passed with Microsoft Edge: 17 guides, 41 experiment walkthroughs, 31 pathways and 95 references. Checks include the new digest source/region links, separate paper/addition dates, direct section links, keyboard expansion and focus return, existing filters, and local-file loading. Desktop (1440 px), phone (390 px) and tablet (768 px) layouts were checked for overflow; desktop and phone previews were visually inspected. `git diff --check` passed. Publication will use the existing `main`-branch GitHub Pages deployment; remote `main` matched the local starting commit before publication.
