#!/usr/bin/env bash
# Rebuild the sc-editor reference-renderer jars from the vendored source under
# reference_renderer/vendor/. Only needed if the committed jars are removed or
# you want to rebuild. Requires JDK 17 + network (gradle/maven fetch deps).
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENDOR="$HERE/vendor"

export JAVA_HOME="${JAVA_HOME:-$(/usr/libexec/java_home -v 17 2>/dev/null || true)}"
if [ -z "$JAVA_HOME" ] || [ ! -x "$JAVA_HOME/bin/java" ]; then
  echo "ERROR: JDK 17 required (install it and set JAVA_HOME)." >&2
  exit 1
fi
export PATH="$JAVA_HOME/bin:$PATH"

FLATC="$VENDOR/flatc/flatc"
[ -x "$FLATC" ] || FLATC="$(command -v flatc || true)"
[ -n "$FLATC" ] || { echo "ERROR: flatc not found" >&2; exit 1; }

M2="$HOME/.m2/repository"

install_jar() { # artifactId version jarPath extraPomGroup
  local a="$1" v="$2" jar="$3"
  local base="$M2/dev/donutquine/$a/$v"
  mkdir -p "$base"
  cp "$jar" "$base/$a-$v.jar"
  cat > "$base/$a-$v.pom" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"><modelVersion>4.0.0</modelVersion>
<groupId>dev.donutquine</groupId><artifactId>$a</artifactId><version>$v</version>
<packaging>jar</packaging><dependencies>
  <dependency><groupId>com.github.luben</groupId><artifactId>zstd-jni</artifactId><version>1.5.7-6</version></dependency>
</dependencies></project>
EOF
  echo "  installed $a:$v"
}

echo "==> building sc-file (jar)"
( cd "$VENDOR/sc-file" && ./gradlew -q jar >/dev/null 2>&1 || ./gradlew -q assemble >/dev/null 2>&1 )
SC_FILE_JAR="$VENDOR/sc-file/build/libs/sc-file-1.0.4.jar"
[ -f "$SC_FILE_JAR" ] || { echo "ERROR: sc-file jar missing" >&2; exit 1; }
install_jar sc-file 1.0.4 "$SC_FILE_JAR"
install_jar sc-file 1.0.3 "$SC_FILE_JAR"

echo "==> building supercell-swf (jar, needs flatc for flatbuffers codegen)"
( cd "$VENDOR/supercell-swf" && ./gradlew -q -Pflatc.path="$FLATC" jar >/dev/null 2>&1 )
SWF_JAR="$VENDOR/supercell-swf/build/libs/supercell-swf-1.2.0.jar"
[ -f "$SWF_JAR" ] || { echo "ERROR: supercell-swf jar missing" >&2; exit 1; }
install_jar_extra() { :; }
DST="$M2/dev/donutquine/supercell-swf/1.2.0"
mkdir -p "$DST"; cp "$SWF_JAR" "$DST/supercell-swf-1.2.0.jar"
cat > "$DST/supercell-swf-1.2.0.pom" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"><modelVersion>4.0.0</modelVersion>
<groupId>dev.donutquine</groupId><artifactId>supercell-swf</artifactId><version>1.2.0</version>
<packaging>jar</packaging><dependencies>
  <dependency><groupId>com.google.flatbuffers</groupId><artifactId>flatbuffers-java</artifactId><version>25.2.10</version></dependency>
  <dependency><groupId>org.slf4j</groupId><artifactId>slf4j-simple</artifactId><version>1.7.29</version></dependency>
  <dependency><groupId>dev.donutquine</groupId><artifactId>sc-file</artifactId><version>1.0.3</version></dependency>
</dependencies></project>
EOF
echo "  installed supercell-swf:1.2.0"

echo "==> building supercell-texture (jar)"
( cd "$VENDOR/supercell-texture" && ./gradlew -q -Pflatc.path="$FLATC" jar >/dev/null 2>&1 )
TEX_JAR="$VENDOR/supercell-texture/build/libs/supercell-texture-1.0.1.jar"
DST="$M2/dev/donutquine/supercell-texture/1.0.1"
mkdir -p "$DST"; cp "$TEX_JAR" "$DST/supercell-texture-1.0.1.jar"
cat > "$DST/supercell-texture-1.0.1.pom" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"><modelVersion>4.0.0</modelVersion>
<groupId>dev.donutquine</groupId><artifactId>supercell-texture</artifactId><version>1.0.1</version>
<packaging>jar</packaging><dependencies>
  <dependency><groupId>dev.donutquine</groupId><artifactId>sc-file</artifactId><version>1.0.3</version></dependency>
</dependencies></project>
EOF
echo "  installed supercell-texture:1.0.1"

echo "==> building sc-editor (maven package -> target/sc-editor-1.0.0.jar + target/libs)"
( cd "$VENDOR/sc-editor" && ./mvnw -q -DreleaseVersion=1.0.0 -DskipTests package >/dev/null 2>&1 )

echo "==> copying built jars into reference_renderer/jars/"
mkdir -p "$HERE/jars"
cp -f "$VENDOR/sc-editor/target/sc-editor-1.0.0.jar" "$HERE/jars/"
cp -f "$VENDOR/sc-editor/target/libs/"*.jar "$HERE/jars/" 2>/dev/null || true
echo "done. $(ls "$HERE/jars"/*.jar | wc -l | tr -d ' ') jars in $HERE/jars/"