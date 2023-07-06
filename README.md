# AppKit: library for Opencast-related React apps

> **Important**: This is still very much work in progress!
> Expect frequent releases with breaking changes.

Library for the development of (React + TS + emotion.js)-based apps in the Opencast context.
It provides a number of React components and various other utilty features.
In order to ensure style consistency across our apps, appkit "includes" a design and is not suitable as a general purpose library;
that's the whole point: to get a pre-defined design.


## Usage

- `npm install --save @opencast/appkit`
- Make sure all of [appkit's `peerDependencies`](./package.json) are installed (should be done by NPM in the previous step).
- Provide color values, most likely by copying [`colors.css`](./src/colors.css) into your `index.html`. See "colors" section below.
- Optionally configure appkit via `AppkitConfigProvider`.


## Colors

This library also contains a color scheme with a set of fixed colors.
These can be configured, but you should likely stick to the given colors as close as possible, especially the neutral ones.
See [`colors.css`](./src/colors.css): you likely want to copy that into your `index.html` directly;
also see the color color scheme section below.

### Neutral

Grey-ish colors that can be used throughout the design.
These colors are slightly blue, i.e. slightly cold colors.

More important than the exact color codes are the *perceived brightness* values associated with them.
(Note: associated brightness is the same as L in the LCH color space, but NOT the same as the L in HSL!)
In Tobira, we allow organisations to chose their own color tone (e.g. to have slightly warm grey), but we still use the same brightness values as specified here.

```
             Perceived brightness  sRGB hex code
Light mode
neutral05    99.7                  #fefeff
neutral10    95.9                  #f2f3f5
neutral15    92.0                  #e6e8ec
neutral20    88.0                  #dbdde2
neutral25    83.9                  #ced1d8
neutral30    78.0                  #bec1c9
neutral40    67.0                  #9ea4b0
neutral50    50.0                  #717785
neutral60    37.0                  #505866
neutral70    27.0                  #384051
neutral80    17.0                  #222b39
neutral90    8.0                   #0e1827

Dark mode
neutral05    7.7                   #0e1826
neutral10    11.5                  #161f2e
neutral15    15.3                  #1f2735
neutral20    19.1                  #262f3e
neutral25    22.9                  #2f3747
neutral30    26.7                  #374050
neutral40    32.7                  #464e5d
neutral50    43.4                  #606775
neutral60    56.0                  #808794
neutral70    62.0                  #9096a3
neutral80    68.0                  #a0a6b3
neutral90    79.0                  #c0c4cc
```

### Accent color

TODO

### Destructive color

TODO


## Color Scheme Switching

Appkit provides utlities to have multiple color schemes in your app: `useColorScheme` and `ColorSchemeProvider`.
(Note: currently it only supports "light" and "dark"! This might be expanded in the future.)
See the [documentation on `ColorSchemeProvider`](./src/colorScheme.tsx) to understand how this system works and what you have to do to set it up.

