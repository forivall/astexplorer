#!/bin/sh

TARGETPATH="../$(basename "$(pwd)")_gh_pages"
REMOTE=$(git remote -v | grep forivall | grep "(push)" | cut -f 2 | cut -d ' ' -f 1)
BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if ! git diff --quiet && git diff --cached --quiet; then
  echo >&2 "Cannot build, your index contains uncommitted changes."
  exit 1
fi

if [ ! -d "$TARGETPATH" ]; then
  echo "Cloning into '$TARGETPATH'..."
  git clone ./ "$TARGETPATH"
  cd "$TARGETPATH"
  git remote set-url --push origin $REMOTE
  git rm -f .gitignore .eslintrc
  cd - > /dev/null
fi

# Updating
echo "Clear target..."
cd "$TARGETPATH"
git checkout --detach --quiet
git branch -D gh-pages
git checkout --orphan gh-pages
git rm -rf *
cd - > /dev/null

echo "Building..."
rm -rf out/*
npm run build
echo "Copying artifacts..."
cp -R out/* "$TARGETPATH/"
cp README.md "$TARGETPATH/README.md"

# Commit changes
cd $TARGETPATH
git add -A
if git diff --quiet && git diff --cached --quiet; then
  echo "No changes, nothing to commit..."
  exit 0
fi
echo "Committing..."
git commit -m"Update site from $BRANCH"
echo "Pushing..."
git push --force origin gh-pages:refs/heads/gh-pages
echo "done"
