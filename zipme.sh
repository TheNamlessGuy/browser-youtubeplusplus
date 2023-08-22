#!/bin/bash

if [[ -f './youtube++.zip' ]]; then
  \rm -i './youtube++.zip'
  if [[ -f './youtube++.zip' ]]; then
    echo >&2 'Cannot continue while the old .zip exists'
    exit 1
  fi
fi

echo "Zipping..."
zip -r -q './youtube++.zip' res/ src/ manifest.json