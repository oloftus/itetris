#!/bin/bash

# iTetris build script

itroot="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd )"
distdir="dist"
buildname="build-$(date +%Y%m%d%H%M%s)"
outdir="$itroot/$distdir/$buildname"
minijsfile="mini.js"

mkdir "$outdir"
cp -R "assets" "$outdir/"
cp -R "lib" "$outdir/"
cp -R "src/" "$outdir/app/"
cp "index.html" "$outdir/"
rm -rf "$outdir/assets/Originals"
mv -f $outdir/lib/prod/* "$outdir/lib/"
rm -rf "$outdir/lib/prod"

echo "(function() {" >> "$outdir/app/minitmp.js";
for js in `ls $outdir/app/js/`; do
  if [ "$js" == "main.js" ]; then continue; fi;
  cat "$outdir/app/js/$js" >> "$outdir/app/minitmp.js";
done;
echo "})();" >> "$outdir/app/minitmp.js";
java -jar yuicompressor-2.4.8.jar "$outdir/app/minitmp.js" -o "$outdir/app/$minijsfile";

rm -rf "$outdir/app/js"
sed -i.bak "s|js/main.js|$minijsfile|" "$outdir/app/index.html"
rm "$outdir/app/index.html.bak"
rm "$outdir/app/minitmp.js";
