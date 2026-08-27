#!/usr/bin/env bash
# One-time setup for a fresh clone of project_brawlstars.
# - creates a Python venv and installs the extractor's pip deps
# - ensures a JDK 17 is available (needed only for the reference renderer)
# - optionally rebuilds the Java reference-renderer jars from the vendored source
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SC_CONVERTER="$HERE/tools/sc_converter"
RR="$SC_CONVERTER/reference_renderer"

echo "==> Python venv + deps (extractor / sc6_parser)"
if [ ! -d "$SC_CONVERTER/.venv" ]; then
  python3 -m venv "$SC_CONVERTER/.venv"
fi
"$SC_CONVERTER/.venv/bin/pip" install -q -r "$SC_CONVERTER/requirements.txt"
echo "    venv ready at $SC_CONVERTER/.venv (activate with: source $SC_CONVERTER/.venv/bin/activate)"

echo "==> JDK 17 (reference renderer only)"
if ! /usr/libexec/java_home -v 17 >/dev/null 2>&1 && [ -z "${JAVA_HOME:-}" ]; then
  if command -v brew >/dev/null 2>&1; then
    echo "    installing openjdk@17 via Homebrew (may take a minute)"
    brew install openjdk@17
  else
    echo "    !!! openjdk@17 not found and Homebrew unavailable."
    echo "        Install a JDK 17 and set JAVA_HOME, or skip the Java reference renderer."
  fi
fi
JAVA_HOME="${JAVA_HOME:-$(/usr/libexec/java_home -v 17 2>/dev/null || true)}"

echo "==> Reference-renderer jars"
if [ -d "$RR/jars" ] && ls "$RR/jars"/*.jar >/dev/null 2>&1; then
  echo "    built jars already present ($(ls "$RR/jars"/*.jar | wc -l | tr -d ' ') jars). Skipping rebuild."
  echo "    To rebuild from the vendored source instead: $RR/build_reference_renderer.sh"
else
  echo "    no built jars found - building from vendored source..."
  if [ -n "$JAVA_HOME" ]; then
    JAVA_HOME="$JAVA_HOME" bash "$RR/build_reference_renderer.sh"
  else
    echo "    !!! cannot build without JDK 17. Set JAVA_HOME and re-run."
  fi
fi

echo
echo "Done. Quick smoke test:"
echo "  source $SC_CONVERTER/.venv/bin/activate"
echo "  python $SC_CONVERTER/extract_effects_v6.py --brawler gale --exports gale_006_ulti_trail_bolts_02"
