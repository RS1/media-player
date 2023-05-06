/* ┐
   │ File: combined.tsx [/src/media/providers/combined.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 24th, 2023 - 9:38:11
   │ Modified: May 6th, 2023 - 15:47:26
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

import { ConfigProvider, ConfigProviderProps } from './config'
import { CoreProvider, CoreProviderProps } from './core'
import { PlaylistProvider, PlaylistProviderProps } from './playlist'
import { StateProvider, StateProviderProps } from './state'
import { ThemeProvider, ThemeProviderProps } from './theme'
import { TimeProvider, TimeProviderProps } from './time'

export type CombinedProviderProps = ConfigProviderProps &
    ThemeProviderProps &
    PlaylistProviderProps &
    StateProviderProps &
    TimeProviderProps &
    CoreProviderProps

/**
 * This is the main provider for the Media Player.
 * Place this as high as necessary in your component tree.
 * All children will have access to the player state, controls, config, etc.
 *
 * Remember to include the `<MediaPlayer />` component somewhere in your tree,
 * or replace it with your own custom player using the `useMediaElement` hook.
 * See the `<MediaPlayer />` component source code for more info.
 */
export const CombinedProvider: React.FC<CombinedProviderProps> = ({
    children,
    config,
    theme,
    playlist = [],
    track = null,
    ...providerProps
}) => (
    /**
     * Combines all the providers into one.
     * This will be the only provider exposed to the user.
     *
     * We need separate providers/context because differente parts of the player
     * need different parts of the state. If we used a single context, every time
     * a part of the state changed, every component would re-render.
     *
     * Take for example the `MediaSource` component: it needs to know the current
     * playlist item, but it doesn't care about the current time or the config.
     * If we used a single context, every time the current time changed, the
     * `MediaSource` component would re-render, even if the current playlist item
     * didn't change.
     */

    <ConfigProvider config={config}>
        <ThemeProvider theme={theme}>
            <PlaylistProvider playlist={playlist} track={track}>
                <StateProvider>
                    <TimeProvider>
                        <CoreProvider {...providerProps}>{children}</CoreProvider>
                    </TimeProvider>
                </StateProvider>
            </PlaylistProvider>
        </ThemeProvider>
    </ConfigProvider>
)
