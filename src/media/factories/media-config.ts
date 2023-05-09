/* ┐
   │ File: media-config.ts [/src/media/factories/media-config.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 24th, 2023 - 10:12:32
   │ Modified: May 9th, 2023 - 14:23:32
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useEffect, useState } from 'react'

import { ControlsGroupType, ControlsGridType } from '@bits/controls/types'

import { MediaConfig } from '@media/types'

import { baseBreakpoints } from '@/hooks'

export const controlGroups: Record<string, ControlsGroupType> = {
    volume: ['mute'],
    playback: ['previous', 'backward10', 'playpause', 'forward10', 'next'],
    playlist: ['playlist', 'shuffle', 'repeat'],
    metadata: ['metadata'],
    time: ['time', 'seekbar', 'remaining'],
    screen: ['airplay', 'pictureinpicture', 'fullscreen'],
    state: ['loading', 'stalled', 'error'],
}

const extendedControls: ControlsGridType = [
    [['playlist', 'shuffle', 'error'], controlGroups.playback, ['stalled', 'repeat']],
    controlGroups.time,
    [['mute', 'airplay'], 'metadata', ['pictureinpicture', 'fullscreen']],
]

const compactControls: ControlsGridType = [
    [controlGroups.volume, controlGroups.playback, controlGroups.screen],
    [controlGroups.time],
]

const miniControls: ControlsGridType = [
    [controlGroups.metadata],
    ['error', controlGroups.playback, 'stalled'],
    [controlGroups.time],
    ['mute', 'playlist', 'shuffle', 'repeat', 'airplay', 'pictureinpicture', 'fullscreen'],
]

export const controlsConfig: Record<string, ControlsGridType> = {
    extended: extendedControls,
    compact: compactControls,
    mini: miniControls,
}

const base: MediaConfig = {
    aspectRatio: 'stretch',
    playerMode: 'auto',
    playerBackground: 'flat',
    breakpoints: baseBreakpoints,
    autoHideControls: 3000,
    controls: {
        xs: controlsConfig.mini,
        // sm: controlsConfig.compact,
        md: controlsConfig.extended,
    },
    controlsMetadataSeparator: ' — ',

    autoPlay: false,
    loop: false,
    muted: false,

    canControlWithKeyboard: true,
    canShuffle: true,
    canLoop: true,
    canPause: true,
    canSeek: true,
    canMute: true,
    canChangeVolume: true,
    canChangePlaybackRate: true,
    canFullscreen: true,
    canPictureInPicture: true,
    canAirPlay: true,
    canRemotePlay: true,
    canTapToPause: true,
    canDoubleTapToSeek: true,
}

export const configs: Record<string, MediaConfig> = {
    default: base,
}

export function parseConfig(config: Partial<MediaConfig> | string): MediaConfig {
    const baseConfig = base
    const parsedConfig =
        typeof config === 'string' && Object.prototype.hasOwnProperty.call(configs, config)
            ? configs[config]
            : typeof config === 'object'
            ? config
            : {}
    return {
        ...baseConfig,
        ...parsedConfig,
    }
}

export function useMediaConfigFactory(initial: Partial<MediaConfig> | string): MediaConfig {
    const [config, setConfig] = useState<MediaConfig>(parseConfig(initial))

    useEffect(() => {
        setConfig(parseConfig(initial))
    }, [JSON.stringify(initial)])

    return config
}
