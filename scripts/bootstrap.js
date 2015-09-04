require("shelljs/global");

var path = require("path");
var fs   = require("fs");

if (!process.env.TACOSCRIPT_PATH) {
  console.error("Please set TACOSCRIPT_PATH");
  process.exit();
}

// get packages
var packages = [];
ls(process.env.TACOSCRIPT_PATH + "/packages/*").forEach(function (loc) {
  var name = path.basename(loc);
  if (name[0] !== ".") {
    var pkg = JSON.parse(fs.readFileSync(process.env.TACOSCRIPT_PATH + "/packages/" + name + "/package.json"));
    packages.push({
      folder: name,
      pkg: pkg,
      name: pkg.name
    });
  }
});

var pkg = JSON.parse(fs.readFileSync("./package.json"));

// create links to tacoscript
var nodeModulesLoc = "./node_modules";
mkdir("-p", nodeModulesLoc);

packages.forEach(function (sub) {
  if (!pkg.dependencies || !pkg.dependencies[sub.name]) return;

  if (!fs.existsSync(nodeModulesLoc + "/" + sub.name)) {
    console.log("Linking", process.env.TACOSCRIPT_PATH + "/packages/" + sub.folder, "to", nodeModulesLoc + "/" + sub.name);
    ln("-s", process.env.TACOSCRIPT_PATH + "/packages/" + sub.folder, nodeModulesLoc + "/" + sub.name);
  }
});

exec("npm install");
