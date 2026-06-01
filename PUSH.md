# Pushing xo-research to GitHub

The repo is committed and ready. Run the steps below from your host to push.

## 1. Move the repo to its final location

The repo currently lives at `~/Programming/XO/ClaudeWorkspace/xo-research/`. Move it to sit as a sibling of `xo-docs`:

```bash
mv ~/Programming/XO/ClaudeWorkspace/xo-research ~/Programming/XO/xo-research
cd ~/Programming/XO/xo-research
```

## 2. Clean up sandbox artifacts

A previous commit attempt left a stuck `.git-stuck/` directory the sandbox couldn't unlink. Remove it on your host:

```bash
rm -rf .git-stuck
```

## 3. Create the GitHub repo

Public, matching `gitConfig` in `src/lib/shared.ts`:

```bash
# Via gh CLI:
gh repo create sharmasuraj0123/xo-research --public --source=. --remote=origin --description="Research notes, briefs, and data behind XO"

# Or manually:
# 1. Open https://github.com/new
# 2. Name: xo-research, owner: sharmasuraj0123, visibility: public
# 3. Do NOT initialize with README/license/.gitignore (we already have them)
# 4. After creating:
git remote add origin git@github.com:sharmasuraj0123/xo-research.git
```

## 4. Verify and push

```bash
git log --oneline                 # should show one commit
git push -u origin main
```

## 5. Run the build to verify

The sandbox couldn't run `npm run build` (disk was full), so this is the first real build:

```bash
pnpm install
pnpm build
```

If pnpm complains, `npm install && npm run build` works too: the scripts are framework-agnostic.

## 6. Optional: enable Vercel deployment

Same shape as `xo-docs`. Either:

- Vercel dashboard: import the GitHub repo, framework auto-detects as Next.js, set `ANTHROPIC_API_KEY` env var, deploy.
- Or via CLI: `vercel link` then `vercel --prod`.

Production URL convention: `research.xo.builders` (the `siteUrl` already declared in `src/lib/shared.ts`). Add the CNAME in Vercel once the repo is wired.

## 7. Delete this file

Once everything is up, `rm PUSH.md && git commit -am "remove PUSH.md handoff"` to clean up.
