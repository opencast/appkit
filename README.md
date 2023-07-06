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

Neutral colors that can be used throughout the design.
You may make the grey tone configurable in your app (e.g. to allow organizations to choose a slightly warm grey), but the individual colors must still have the same perceived brightness values as specified here.
(Note: perceived brightness is the same as L in the LCH color space, but NOT the same as the L in HSL!)

```
             Perceived brightness  sRGB hex code
Light mode
neutral05    99.7                  #fefefe
neutral10    95.9                  #f3f3f3
neutral15    92.0                  #e8e8e8
neutral20    88.0                  #dddddd
neutral25    83.9                  #d1d1d1
neutral30    78.0                  #c1c1c1
neutral40    67.0                  #a3a3a3
neutral50    50.0                  #777777
neutral60    37.0                  #575757
neutral70    27.0                  #404040
neutral80    17.0                  #2a2a2a
neutral90    8.0                   #181818

Dark mode
neutral05    7.7                   #171717
neutral10    11.5                  #1e1e1e
neutral15    15.3                  #262626
neutral20    19.1                  #2e2e2e
neutral25    22.9                  #373737
neutral30    26.7                  #3f3f3f
neutral40    32.7                  #4d4d4d
neutral50    43.4                  #676767
neutral60    56.0                  #868686
neutral70    62.0                  #969696
neutral80    68.0                  #a6a6a6
neutral90    79.0                  #c4c4c4
```

### Accent color

TODO

### Destructive color

TODO


## Color Scheme Switching

Appkit provides utlities to have multiple color schemes in your app: `useColorScheme` and `ColorSchemeProvider`.
(Note: currently it only supports "light" and "dark"! This might be expanded in the future.)
See the [documentation on `ColorSchemeProvider`](./src/colorScheme.tsx) to understand how this system works and what you have to do to set it up.

