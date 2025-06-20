# Website

This repository contains a minimal website that can be hosted using GitHub Pages.

## Getting Started

1. Clone the repository.
2. Enable GitHub Pages in the repository settings, using the main branch.
3. Visit the generated GitHub Pages URL to see the site.

The main content is in `index.html`. AR cube placement is enabled by default and a simple HUD lets you load a custom `.glb` model instead of the cube.

## Requirements

This site ships with **three.js r128** and requires a browser capable of WebXR's AR features (e.g. Chrome on Android).
DOM overlay is used to display the HUD and performance stats while in AR. Make sure your browser supports this optional feature.
For the best experience, use a mobile device that supports AR and ensure WebXR is enabled.
