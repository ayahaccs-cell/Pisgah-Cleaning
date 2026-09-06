# Deploy fix

## What went wrong

Nothing in the code. `src/components/layout/MobilePinnedBar.tsx` was deleted in v5, but
**unpacking a zip over a checkout adds and overwrites files, it never deletes them.**
The old component stayed in your repository and referenced two dictionary keys that no
longer exist, so the validator stopped the build. That is the validator doing its job.

## The one command that fixes the repository

From the project root:

```bash
git rm -f --ignore-unmatch \
  src/components/layout/MobilePinnedBar.tsx \
  public/media/hero-wide.jpg \
  public/media/hero-technician.jpg \
  public/media/journey-survey.jpg \
  public/media/journey-mobilisation.jpg \
  public/media/journey-signoff.jpg

git commit -m "Remove files retired in v5"
git push
```

That is the whole fix. The next Vercel build will pass.

## It also heals itself now

`scripts/prune-legacy.mjs` runs first in `prebuild`. It deletes retired files from the
checkout before the validator runs, so a stale tree no longer fails a deploy. The script
holds an explicit list of exact paths, never a pattern, so it cannot delete anything that
was not deliberately retired. It prints the git command above when it removes something.

The build chain is now:

```
prune -> guardrails -> validate -> next build
```

## Unpacking future releases

To avoid this entirely, replace the tracked directories rather than merging into them:

```bash
rm -rf src public
unzip -q pisgah-cleaning-web-vX.zip
cp -r pisgah-web/. .
rm -rf pisgah-web
git add -A          # -A stages deletions as well as additions
git commit -m "Update to vX"
```

`git add -A` is the important part. `git add .` does not stage deletions.

## One thing to do separately

The install log flagged `next@14.2.15` as having a security vulnerability. Bump it to the
newest 14.2 patch and commit the lockfile:

```bash
npm install next@^14.2 --save
npm run verify
```

I could not check the registry from my environment, so I have not pinned an exact patch
version for you. Run the command above and take whatever 14.2.x npm resolves to.
