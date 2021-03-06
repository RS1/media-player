/*
 * *****************************************************************************
 * context.js (/src/components/context.js) | rs1-mediaplayer
 * Written by Andrea Corsini <andrea@rs1.it>
 * =============================================================
 * Created on Monday, 19th October 2020 9:56:49 am
 *
 * Copyright (c) 2020 RS1 Project
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 *
 * Modified on Thursday, 12th November 2020 11:17:06 pm
 * *****************************************************************************
 */
import merge from 'deepmerge'
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
        fontFamily: 'Verdana',
        mediaBackground: '#000000',
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
        onStateChanged: state => {},
    },
}

const _state = (key, value) => ({ state: { [key]: value } })
const _metadata = value => ({ metadata: { ...value } })
const _options = {
    customMerge: key => {
        if (['mediaRect', 'playerRect', 'playerSize'].includes(key)) {
            return (a, b) => [...b]
        }
    },
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
                // eslint-disable-next-line no-prototype-builtins
                if (state.state.hasOwnProperty(key)) {
                    reduced = merge(reduced, _state(key, value), _options)
                }
        }
    })
    return reduced
}

export default createContext(defaults)
