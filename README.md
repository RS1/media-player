# MediaPlayer

A smart media player for React, for audio and video content.  
[View demo site](https://rs1.github.io/media-player/)

## THIS IS THE v1.x DOCUMENTATION - v2.x IS COMING SOON

### Installation

```sh
npm i -D @rs1/media-player
```

### Usage

You can use the component inside your React app by following these steps.

Import it in your app:

```javascript
import Player from '@rs1/media-player'
```

define the media you want to play:

```javascript
const media = {
    /* Title of the media */
    title: 'Big Buck Bunny',

    /* Artist/author of the media */
    artist: 'Blender Foundation',

    /* Path/URL to the media */
    src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',

    /* Path/URL to the poster image of the media (optional) */
    poster: 'https://en.wikipedia.org/wiki/Big_Buck_Bunny#/media/File:Big_buck_bunny_poster_big.jpg',

    /* Set to true if you want to play a video */
    video: true,
}
```

then use it as a component with the prop `media`:

```javascript
<Player media={media} />
```

enjoy your new amazing media player!

### Configuration options

There are dozens of settings you can tune based on your needs.

###### General options

```javascript
<Player
    media={media}
    config={{
        options: {
            /* Show/hide the previous/next controls */
            isPlaylist: true,

            /* Loop over the media
             * ref: https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop */
            loop: false,

            /* Show/hide mute controls */
            canMute: true,

            /* Show/hide full screen controls */
            canFullScreen: true,

            /* Seconds to wait before hiding the controls
             * set to 0 to never hide */
            autoHideControls: 5,

            /* Show/hide metadata information directly on
             * the media element when the controls are hidden */
            metadataOnMedia: true,

            /* Fixed player size [width, height] to be used when
             * autoResize = false or when media is audio.
             * Set to [0, 0] to fill all available space */
            playerSize: [0, 0],

            /* Whether or not to autoresize the player
             * based on the media aspect-ratio. (video only) */
            autoResize: true,

            /* Whether or not to play autoatically the new
             * provided media.
             * ref: https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide */
            autoPlay: true,
        },
    }}
/>
```

###### Styling options

```javascript
<Player
    media={media}
    config={{
        style: {
            /*
             * Here you can define custom colors to be used
             * througout the player. Any CSS-valid value
             * can be specified.
             */

            /* Controls main color */
            controlsColor: '#ffffff',

            /* Color for metadata shown on media */
            metadataOnMediaColor: '#ffffff',

            /* Active/hover controls color */
            accentColor: '#009fe3',

            /* Loading text and spinner color */
            loaderColor: '#ffffff',

            /* Error text color */
            errorColor: '#ed4337',

            /* Player font-family */
            fontFamily: 'Verdana',

            /* Player background color */
            mediaBackground: '#000000',
        },
    }}
/>
```

###### Icons options

```javascript
<Player
    media={media}
    config={{
        icons: {
            /*
             * Here you can define custom icons to be used
             * for the controls section of the player.
             * These icons can be FontAwesome icons, or custom
             * SVG transformed through the method 'makeIcon'
             */

            /* Error message icon */
            error: faExclamationCircle,

            /* Loading message icon */
            loading: faSpinner,

            /* Seeking indicator icon */
            seeking: faSpinner,

            /* Unmute media player */
            unmuted: faVolumeMute,

            /* Mute media player */
            muted: faVolumeUp,

            /* Enter full screen */
            fullscreen: faCompressArrowsAlt,

            /* Exit full screen */
            exit_fullscreen: faExpandArrowsAlt,

            /* Play control icon */
            play: faPlayCircle,

            /* Pause control icon */
            pause: faPauseCircle,

            /* Previous control icon */
            previous: faBackward,

            /* Back 10 seconds control icon */
            backward10: makeIcon('10backward', backward10svg, [512, 512]),

            /* Next control icon */
            next: faForward,

            /* Skip 10 seconds control icon */
            forward10: makeIcon('10forward', forward10svg, [512, 512]),
        },
    }}
/>
```

Build custom icons:

```javascript
import { makeIcon } from '@rs1/media-player'

/*
 * Please note that the you need to convert
 * your SVG shapes to paths if you want
 * them to be parsed. This tool recognizes
 * just <path d="..." /> elements.
 */
import svgFile from 'path/to/file.svg'

const customIcon = makeIcon(
    /* The name of the icon */
    'my-icon',

    /* The SVG file as string */
    svgFile,

    /* The size [width, height] of the SVG (SVG viewBox attribute) */
    [512, 512],
)

export default customIcon
```

###### Callback options

```javascript
<Player
    media={media}
    config={{
        actions: {
            /*
             * Here you can define custom actions to be
             * executed as callbacks to react to changes
             * in the player inner state.
             * Please be aware that callbacks may be called
             * even if nothing has changed, this is expected
             * behaviour. Be sure to rely on the callback argument,
             * not on the fact that the callback has been called.
             */

            /* Whenever an error occurs during the media playback */
            onError: () => console.log(`An error occurred`),

            /* When the player requests the previous track.
             * You should update the Player media prop accordingly. */
            onPrevious: () => console.log(`Previous track requested`),

            /* When the player requests the next track.
             * You should update the Player media prop accordingly. */
            onNext: () => console.log(`Next track requested`),

            /* Whenever the player changes between playing/paused */
            onPlayingChanged: playing => console.log(`The media is ${playing ? 'playing' : 'paused'}`),

            /* When the media starts/finishes loading */
            onLoadingChanged: loading => console.log(`The media is ${loading ? 'loading' : 'loaded'}`),

            /* When the media starts/finishes seeking */
            onSeekingChanged: seeking => console.log(`The media is ${seeking ? 'seeking' : 'seeked'}`),

            /* When the loaded buffer of the media changes.
             * The argument buffer is expressed in the range 0 - 1. */
            onBufferChanged: buffer => console.log(`The download progress is at ${Math.round(buffer * 100)}%`),

            /* When the current playback time of the media changes.
             * The argument time is expressed in seconds. */
            onTimeChanged: time => console.log(`The media is at ${Math.round(time)}sec`),

            /* When the duration of the media element changes.
             * The argument duration is expressed in seconds. */
            onDurationChanged: duration => console.log(`The media has a duration of ${duration}sec`),

            /* When the player is muted/unmuted */
            onMuteChanged: muted => console.log(`The media is now ${muted ? 'muted' : 'unmuted'}`),

            /* When the player enters/exits full screen mode */
            onFullScreenChanged: fullscreen => console.log(`The media is now ${fullscreen ? '' : 'not '}full screen`),

            /* Whenever any of the state property above changes.
             * The argument state is an object with the properties:
             * {
             *      error:      error,
             *      time:       time,
             *      duration:   duration,
             *      playing:    playing,
             *      buffer:     buffer,
             *      loading:    loading,
             *      seeking:    seeking,
             *      muted:      muted,
             *      fullscreen: fullscreen,
             * } */
            onStateChanged: state => console.log(`The media player state is now: ${JSON.stringify(state)}`),
        },
    }}
/>
```
