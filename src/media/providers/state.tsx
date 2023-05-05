/* ┐
   │ File: state.tsx [/src/media/providers/state.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 22:30:44
   │ Modified: May 2nd, 2023 - 20:53:57
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React, { createContext, useContext, useEffect } from 'react'

import { useFullscreenAPI, usePiPAPI } from '@/hooks'
import { PartialStateReducer, usePartialStateReducer } from '@hooks/use-partial-state-reducer'

import { MediaState } from '../types'
import { ConfigContext } from './config'

export type StateProviderProps = React.PropsWithChildren

const initialState: MediaState = {
    wasPlaying: false,
    isPlaying: false,
    isWaiting: false,
    isSeeking: false,
    isStalled: false,
    isLoaded: false,
    isMuted: false,
    isFullscreen: false,
    isPictureInPicture: false,

    isAirPlay: false,

    hasError: false,
    hasLoadedData: false,
    hasLoadedMetadata: false,

    volume: 1,
    playbackRate: 1,
    intrinsicSize: [0, 0],
}

export const StateContext = createContext<MediaState>(initialState)
export const StateUpdaterContext = createContext<PartialStateReducer<MediaState>>(() => {})

export function StateProvider(props: StateProviderProps) {
    const { children } = props

    const config = useContext(ConfigContext)

    const [state, updateState] = usePartialStateReducer(() => ({
        ...initialState,
        isMuted: config?.muted ?? initialState.isMuted,
        wasPlaying: config?.autoPlay ?? initialState.wasPlaying,
        isPlaying: config?.autoPlay ?? initialState.isPlaying,
    }))

    useEffect(() => {
        updateState({ isMuted: config?.muted, wasPlaying: config?.autoPlay, isPlaying: config?.autoPlay })
    }, [config?.muted, config?.autoPlay])

    /**
     * Maybe move these to a separate provider?
     */
    const [fullscreenActive] = useFullscreenAPI()
    useEffect(() => {
        updateState(s => ({ ...s, isFullscreen: !!fullscreenActive }))
    }, [fullscreenActive])
    const [pipActive] = usePiPAPI()
    useEffect(() => {
        updateState(s => ({ ...s, isPictureInPicture: !!pipActive }))
    }, [pipActive])

    /**
     * `updateState` is provided separately from `state` to avoid unnecessary re-renders
     * of components that only need to update the state but don't need to read it.
     */
    return (
        <StateUpdaterContext.Provider value={updateState}>
            <StateContext.Provider value={state}>{children}</StateContext.Provider>
        </StateUpdaterContext.Provider>
    )
}
