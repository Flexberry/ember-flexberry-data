# Exit with nonzero exit code if anything fails.
set -e

# Define repository relative GitHub address.
repositoryRelativeGitHubAddress="Flexberry/ember-flexberry-data"

# Clone project into 'repository' subdirectory && move to it.
echo "Prepare for deploy to gh-pages."
echo "Clone ${repositoryRelativeGitHubAddress} repository & checkout latest version of gh-pages branch."
git clone --recursive "https://github.com/${repositoryRelativeGitHubAddress}.git" emberFlexberryDataRepository
cd emberFlexberryDataRepository

# Checkout gh-pages branch & pull it's latest version.
git checkout gh-pages
git pull

cd ..

# Generate autodoc.
npm install -g yuidocjs

# Define yuidoc theme repository relative GitHub address.
repositoryYuidocTheme="Flexberry/flexberry-yuidoc-theme"

# Clone project into 'repositoryYuidocTheme' subdirectory && move to it.
echo "Prepare for deploy to gh-pages."
echo "Clone ${repositoryYuidocTheme} repository & checkout latest version of gh-pages branch."
git clone --recursive "https://github.com/${repositoryYuidocTheme}.git" repositoryYuidocTheme
cd repositoryYuidocTheme

# Checkout and pull same branch.
git checkout ${TRAVIS_BRANCH}
git pull

echo "Copy ember addon source (for ${TRAVIS_BRANCH} branch) into addon directory."
mkdir addon
cp -r ../addon/* addon

echo "Execute yuidoc autodocumentation generator."
yuidoc

echo "Navigate to target directory for autodoc in gh-pages."
cd "../emberFlexberryDataRepository/autodoc"

# Remove results of previous deploy (for current branch) & recreate directory.
rm -rf "${TRAVIS_BRANCH}"
mkdir "${TRAVIS_BRANCH}"

echo "Copy autodoc result into ${TRAVIS_BRANCH} directory."
cp -r ../../repositoryYuidocTheme/autodoc-result/* ${TRAVIS_BRANCH}

cd ..

# Configure git.
git config user.name "Flexberry-man"
git config user.email "mail@flexberry.net"

echo "Commit & push changes."
git add --all
git commit -m "Update gh-pages for ${TRAVIS_BRANCH} branch"

# Redirect any output to /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${GH_TOKEN}@github.com/${repositoryRelativeGitHubAddress}.git" > /dev/null 2>&1

echo "Deploy to gh-pages finished."
