if (process.platform == "win32") {
    console.log("This script does work on windows");
    process.exit(1);
}

var homedir = require('os').homedir();
var macPath = homedir + "/Library/Application Support/Mozilla/NativeMessagingHosts/sbot_native_app.json";
var linuxPath = homedir + "/.mozilla/native-messaging-hosts/sbot_native_app.json";
var manifestPath = process.platform == "darwin" ? macPath : linuxPath;
var manifestFolderPath = manifestPath.replace("sbot_native_app.json", "");
var appPath = __dirname + "/index.js";
var localManifestFile = __dirname + "/sbot_native_app.json";
var fs = require("fs");
var mkdirp = require("mkdirp");

if (!fs.existsSync(appPath)) {
    console.log("[ERROR] Application not found at: ", appPath);
    process.exit(1);
}


if (!fs.existsSync(localManifestFile)) {
    console.log("[ERROR] Local copy of app manifest not found at: ", localManifestFile);
    process.exit(1);
}

let manifest = JSON.parse(fs.readFileSync(localManifestFile));

let applicationLauncherPath = manifest.path;

if (!fs.existsSync(applicationLauncherPath)) {
    console.log("[ERROR] App not found at declared location", applicationLauncherPath);
    console.log("FIXING...");
    manifest.path = appPath;
    fs.writeFileSync(localManifestFile, JSON.stringify(manifest));
} else {
    console.log("[OK] Application found at the correct location", applicationLauncherPath);
}

mkdirp.sync(manifestFolderPath);
fs.writeFileSync(manifestPath, JSON.stringify(manifest));

console.log("[OK] Wrote manifest path to registry.\n[INFO] Try: npm run check");
process.exit(0);
