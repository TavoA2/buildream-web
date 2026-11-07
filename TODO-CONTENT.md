# TODO-CONTENT

Pending items. Nothing here may be invented; placeholders render in dev only.

## Content
- [ ] `[PENDIENTE]` Natural project description (`src/content/projects/{es,en}/natural.md`). The entry is `draft: true`, so it is hidden in production until filled in and the flag is removed.
- [ ] Fitness demo: no URL yet (demo to be built separately). Add `url` when it exists.
- [ ] Project images (`image`) for all projects; a typographic placeholder is used until then.
- [ ] Confirm the TaskFlow repo: the exact name `TaskFlow` returns 404 on GitHub; `repo` points to `https://github.com/TavoA2/taskflow-platform` (a sibling `taskflow-app` also exists). Verify which one to show.
- [ ] Testimonials: none exist. Add real ones under `src/content/testimonials/{es,en}/` with `published: true`; the section stays hidden at zero.

## Brand icons (simple-icons 16.x)
- [ ] Missing slugs (no logo in the installed simple-icons; the Stack section shows the name only): `openai`, `amazonwebservices` (AWS). Listed in `MISSING_ICON_SLUGS` in `src/lib/stack-icons.ts`. Decide whether to keep name-only.

## Assets and keys
- [ ] Photo of Dixon (About section uses a placeholder).
- [ ] Cal.com URL (`PUBLIC_CAL_URL`); the Cal.com link stays hidden while empty.
- [ ] Web3Forms access key (`PUBLIC_WEB3FORMS_KEY`).
- [ ] Final email on own domain (currently dixon.ar08@gmail.com, temporary).

## Legal
- [ ] Legal review of Privacy and Terms templates.

## Mini-diagnostic
- [ ] `[PENDIENTE: rango USD]` Budget ranges for the mini-diagnostic options `low` / `mid` / `high` (`src/content/diagnostic/{es,en}.json`). Confirm the USD ranges with Dixon, then replace the placeholder text in the labels.
