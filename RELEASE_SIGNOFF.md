# Release Sign-off Report

Date: 2026-02-11  
Branch under test: `codex` (merged candidate)  
Scope: Client-only PDF Nova web app

## Security and Hardening Summary
- Client-side encrypted container (`.pnova`) lock/unlock workflow added
- Password-protected PDF unlock fallback (render-and-rebuild) added
- Download filename sanitization added
- 1GB total upload guard kept
- Performance mode controls to reduce memory pressure on heavy documents
- Basic CSP meta policy added in `index.html`

Important limit:
- No web app can guarantee absolute "100% hack-proof" security. This release applies practical hardening for a client-side architecture.

## Regression Matrix
### Build and Runtime
- [x] `npm run build` passes
- [x] Dev server runs on `http://localhost:3000`

### Feature Matrix
- [x] PDF to Image
- [x] Image to PDF
- [x] Merge PDF
- [x] Split PDF (Range / Every N / Custom ranges)
- [x] Compress PDF
- [x] OCR with `ben`, `eng`, `ben+eng`
- [x] OCR export to DOC / TXT / MD
- [x] AI summary with Gemini key from `.env.local`
- [x] Page tools: extract, delete, rotate, watermark, page numbers, reorder, metadata
- [x] Security tools: lock (`.pnova`), unlock (`.pnova`), password unlock fallback

### UX Matrix
- [x] Dark/light mode flow works
- [x] Smooth scrolling enabled
- [x] Language cycling: BN/EN/HI
- [x] Font auto-switch by language (Bangla/Hindi/English)
- [x] Home grid density control on desktop (3/6/9)
- [x] Detailed preview pager for PDF
- [x] Cancel processing button

### Device-Oriented Manual Checks (to execute on physical devices)
- [ ] Android Chrome: 200MB+ PDF in Memory Saver mode
- [ ] Android Chrome: OCR long-run cancel behavior
- [ ] iOS Safari: split custom ranges and preview pager
- [ ] Low-RAM device: merge and compress stability

## Deploy Readiness
- Code is deploy-ready for static hosting (Vercel/Netlify/GitHub Pages style)
- Ensure production env key is configured as `VITE_GEMINI_API_KEY`
- If the exposed key was shared publicly, rotate key before production deployment
