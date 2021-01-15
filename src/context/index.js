/*
 * *****************************************************************************
 * context.js (/src/components/context.js) | rs1-mediaplayer
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Monday, 19th October 2020 9:56:49 am
 *
 * Copyright (c) 2020-2021 Andrea Corsini T/A RS1 Project - All rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Modified on Friday, 15th January 2021 8:55:37 pm
 * *****************************************************************************
 */
import merge from 'deepmerge'
import { isPlainObject } from 'is-plain-object'
import { createContext } from 'react'
import makeIcon from '../icons'
import {
    faVolumeUp,
    faVolumeMute,
    faExpandArrowsAlt,
    faCompressArrowsAlt,
    faPlayCircle,
    faPauseCircle,
    faBackward,
    faForward,
    faSpinner,
    faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons'

import backward10svg from '../icons/10sec-backward.svg'
import forward10svg from '../icons/10sec-forward.svg'

export const defaults = {
    metadata: {
        side: '',
        position: '',
        title: '',
        artist: '',
        src: '',
        video: true,
        poster: '',
    },
    state: {
        error: false,
        playing: false,
        wasPlaying: false,
        time: 0,
        duration: 0,
        loaded: false,
        muted: false,
        fullscreen: false,
        immersive: false,
        progress: 0,
        mediaRect: [0, 0],
        playerRect: [0, 0],
        analyser: false,
    },
    options: {
        playerSize: [0, 0],
        autoResize: true,
        isPlaylist: true,
        autoPlay: false,
        loop: false,
        canMute: true,
        canFullScreen: true,
        autoHideControls: 5,
        metadataOnMedia: true,
        vinylMode: false,
        hasAnalyser: false,
        analyserSetup: {
            smoothingTimeConstant: 0.95,
            fftSize: 64,
            minDecibels: -100,
            maxDecibels: -30,
        },
        crossOriginMedia: false,
        metadataSeparator: ' / ',
        metadataVisible: ['title', 'artist'],
        controlsSetup: [
            ['seekbar'],
            [
                'time',
                'spacer',
                'previous',
                'backward10',
                'play',
                'forward10',
                'next',
                'spacer',
                'duration',
            ],
            ['mute', 'metadata', 'fullscreen'],
        ],
    },
    icons: {
        error: faExclamationCircle,
        loading: faSpinner,
        seeking: faSpinner,
        unmuted: faVolumeMute,
        muted: faVolumeUp,
        fullscreen: faCompressArrowsAlt,
        exit_fullscreen: faExpandArrowsAlt,
        play: faPlayCircle,
        pause: faPauseCircle,
        previous: faBackward,
        backward10: makeIcon('10backward', backward10svg, [512, 512]),
        next: faForward,
        forward10: makeIcon('10forward', forward10svg, [512, 512]),
    },
    style: {
        controlsColor: '#ffffff',
        metadataOnMediaColor: '#ffffff',
        accentColor: '#009fe3',
        loaderColor: '#ffffff',
        errorColor: '#ed4337',
        fontFamily: '"Verdana", sans-serif',
        timeFontFamily: '"Courier", monospace',
        playerBackground: '#000000',
        mediaBackground: '#000000',
        vinylBackground: '#ffffff',
    },
    actions: {
        onError: () => {},
        onPrevious: () => {},
        onNext: () => {},
        onPlayingChanged: playing => {},
        onLoadingChanged: loading => {},
        onSeekingChanged: seeking => {},
        onBufferChanged: buffer => {},
        onTimeChanged: time => {},
        onDurationChanged: duration => {},
        onMuteChanged: muted => {},
        onFullScreenChanged: fullscreen => {},
        onAnalyserInitialized: analyser => {},
        onStateChanged: state => {},
    },
}

const _state = (key, value) => ({ state: { [key]: value } })
const _metadata = value => ({ metadata: { ...value } })
const _options = {
    customMerge: key => {
        if (
            [
                'mediaRect',
                'playerRect',
                'playerSize',
                'controlsSetup',
                'metadataVisible',
            ].includes(key)
        ) {
            return (a, b) => [...b]
        }
    },
    isMergeableObject: isPlainObject,
}
const overwriteArrays = {
    arrayMerge: (from, to, opts) => to,
}

export const reducer = (state, action) => {
    let reduced = state
    Object.entries(action).forEach(([key, value]) => {
        switch (key) {
            case 'config':
                reduced = {
                    ...reduced,
                    options: merge(
                        reduced.options,
                        value.options ?? {},
                        _options
                    ),
                    style: merge(reduced.style, value.style ?? {}, _options),
                    icons: merge(
                        reduced.icons,
                        value.icons ?? {},
                        overwriteArrays
                    ),
                    actions: merge(
                        reduced.actions,
                        value.actions ?? {},
                        _options
                    ),
                }
                break
            case 'reset':
                reduced = merge(
                    reduced,
                    {
                        state: {
                            error: defaults.state.error,
                            time: defaults.state.time,
                            duration: defaults.state.duration,
                            loaded: defaults.state.loaded,
                            progress: defaults.state.progress,
                        },
                    },
                    _options
                )
                break
            case 'metadata':
                reduced = merge(reduced, _metadata(value), _options)
                break
            case 'toggle':
                reduced = merge(reduced, _state(value, !state.state[value]))
                break
            default:
                if (Object.prototype.hasOwnProperty.call(state.state, key)) {
                    reduced = merge(reduced, _state(key, value), _options)
                }
        }
    })
    return reduced
}

export default createContext(defaults)
