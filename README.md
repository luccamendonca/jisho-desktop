# Jisho Desktop

A lightweight [Electron](https://www.electronjs.org/) wrapper around [jisho.org](https://jisho.org/) that feels like a native desktop app.

## Features

- **Instant search focus** – the search bar is focused automatically when the app opens.
- **`/` hotkey** – press `/` at any time (when not already typing) to jump to the search bar, just like GitHub or YouTube.
- **`Escape`** – blurs the search bar so you can scroll results with the keyboard.
- **Native macOS look** – hidden title bar with inset traffic lights and vibrancy on macOS; standard chrome on Windows and Linux.
- **External links** – anything outside jisho.org opens in your default browser.
- **Cross-platform** – builds for macOS, Windows, and Linux on both x64 and arm64.

## Setup

```sh
npm install
```

## Run

```sh
npm start
```

## Build locally

```sh
# Current platform
npm run build

# Specific platform
npm run build:mac
npm run build:win
npm run build:linux
```

Output goes to the `dist/` directory.

### Build artifacts by platform

| Platform | Formats                        | Architectures |
| -------- | ------------------------------ | ------------- |
| macOS    | `.dmg`, `.zip`                 | x64, arm64    |
| Windows  | `.exe` (NSIS installer), `.zip`| x64, arm64    |
| Linux    | `.AppImage`, `.deb`, `.tar.gz` | x64, arm64    |

## Releases (CI/CD)

A [GitHub Actions workflow](.github/workflows/release.yml) builds and publishes automatically when you push a version tag:

```sh
git tag v1.0.0
git push --tags
```

This triggers builds on all three platforms and uploads every artifact to a **GitHub Release** matching the tag.

## Global hotkey (skhd)

To launch or focus Jisho with a keyboard shortcut, add something like this to your `.skhdrc`:

```sh
# Hyper+J to open/focus Jisho (adjust the combo to taste)
cmd + shift + ctrl + alt - j : open -a Jisho
```

## Project structure

| File                             | Purpose                                                        |
| -------------------------------- | -------------------------------------------------------------- |
| `main.js`                        | Electron main process – window creation, lifecycle, navigation |
| `preload.js`                     | Injected into the page – search focus, `/` hotkey, CSS tweaks  |
| `package.json`                   | Dependencies, scripts, and electron-builder config             |
| `.github/workflows/release.yml`  | CI/CD – build & publish on tag push                            |

## License

[MIT](LICENSE)
