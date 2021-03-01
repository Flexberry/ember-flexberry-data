"use strict";

// var RSVP = require('rsvp');
var path = require('path');
var fs = require('fs');

function updateVersion(project, versions, fileWithVersionPath) {
  let filePath = path.join(project.root, fileWithVersionPath);
  if (fs.existsSync(filePath)) {
    let contents = fs.readFileSync(filePath, {
      encoding: 'utf8'
    });
     // Version string without 'v' tag prefix.
    let newVersion = versions.next.replace(/^v/, '');

    // Replace version number in line "var version = 'x.x.x';".
    contents = contents.replace(/(version = ')(.+)(';)/, '$1' + newVersion + '$3');

    fs.writeFileSync(filePath, contents, {
      encoding: 'utf8'
    });
  } else {
    throw new Error('File not found: ' + filePath);
  }
}

// For details on each option run `ember help release`
module.exports = {
  // local: true,
  // remote: 'some_remote',
  // annotation: "Release %@",
  // message: "Bumped version to %@",
  // manifest: [ 'package.json', 'bower.json', 'someconfig.json' ],
  // strategy: 'date',
  // format: 'YYYY-MM-DD',
  // timezone: 'America/Los_Angeles',
  //
  // beforeCommit: function(project, versions) {
  //   return new RSVP.Promise(function(resolve, reject) {
  //     // Do custom things here...
  //   });
  // }

  // TODO: rewrite using promises and async fs.
  beforeCommit: function(project, versions) {
    updateVersion(project, versions, 'vendor/ember-flexberry-data/register-version.js');
    updateVersion(project, versions, 'addon/version.js');
  }
};
