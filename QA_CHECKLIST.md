# PDF Nova Release Candidate Checklist

## Environment
- [x] `npm install` completed
- [x] `npm run build` passes on `codex` branch
- [x] `.env.local` configured for AI summary

## Core Tools
- [x] PDF to Image
- [x] Image to PDF
- [x] Merge PDF
- [x] Split PDF (Range / Every N / Custom ranges)
- [x] Compress PDF
- [x] OCR PDF (Bangla / English / Bangla+English)

## Page Tools
- [x] Extract pages
- [x] Delete pages
- [x] Rotate pages
- [x] Watermark pages
- [x] Page numbering
- [x] Reorder pages
- [x] Metadata edit (title/author/subject)

## Security Workflow (Client-side)
- [x] Lock PDF to encrypted `.pnova` format
- [x] Unlock `.pnova` back to PDF
- [x] Password-PDF unlock fallback (image-based rebuild)

## UX and Reliability
- [x] Detailed page preview navigation
- [x] 1GB total upload guard
- [x] Performance mode (Balanced / Memory Saver)
- [x] Processing cancel button
- [x] OCR export: DOC / TXT / MD

## Mobile Focus Checks
- [ ] Test low-memory mode on Android Chrome with 200MB+ PDF
- [ ] Test iOS Safari for long OCR tasks
- [ ] Verify touch targets for settings controls

## Known Limits (Client-only constraints)
- Password lock output is `.pnova` encrypted container (not native password-encrypted PDF)
- Password-PDF unlock fallback recreates pages as images, so selectable text is not preserved
- Very large files (500MB-1GB) depend on device RAM/browser limits
