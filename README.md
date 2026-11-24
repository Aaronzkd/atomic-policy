# Atomic Policy · project page

Static site: `index.html`, `css/site.css`, `js/site.js`, `media/`. No build step.

- Preview: `python3 -m http.server 4780` in this folder, then open http://localhost:4780
- Authors, paper and code links: the hero block at the top of `index.html` and the BibTeX block at the bottom.
- Clips: `tools/encode.py` re-creates everything in `media/` from the film project's sources (same trims, speeds and framing as the video); metadata is stripped.
