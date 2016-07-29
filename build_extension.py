#!/usr/bin/evn python3
import json
from shutil import copyfile, make_archive, rmtree, copytree, copy
from os import walk, makedirs
from os.path import relpath, isdir, exists, join

VERSION_NUM = "1.0"

def reset_build_dir():
    if isdir("build") and exists("build"):
        rmtree('build')
    copytree("extension","build/firefox")
    copytree("extension","build/chromium")
    copy("extension/background.js", "build/firefox")
    copy("extension/background.js", "build/chromium")


def build_firefox():
    with open("extension/manifest.json", "r") as fin, open("build/firefox/manifest.json", "w") as fout:
        manifest = json.load(fin)
        manifest["applications"] = {
            "gecko": {
                "id": "netflixshuffle@mozilla.org",
                "strict_min_version": "45.0"
            }
        }
        manifest["version"] = VERSION_NUM
        json.dump(manifest, fout, indent=4, sort_keys=True)
    make_archive("build/firefox/netflixshuffle", 'zip', 'build/firefox/')

def build_chromium():
    with open("extension/manifest.json", "r") as fin, open("build/chromium/manifest.json", "w") as fout:
        manifest = json.load(fin)
        manifest["version"] = VERSION_NUM
        manifest["background"]["persistent"] = False
        json.dump(manifest, fout, indent=4, sort_keys=True)

    make_archive("build/chromium/netflixshuffle", 'zip', 'build/chromium/')

def main():
    print("Removing old build")
    reset_build_dir()

    print("Building firefox extension")
    build_firefox()

    print("Building chromium extension")
    build_chromium()

    print("Done!")

if __name__ == '__main__':
    main()
