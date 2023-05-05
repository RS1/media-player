/* ┐
   │ File: time.tsx [/src/media/providers/time.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 22:30:44
   │ Modified: April 28th, 2023 - 22:12:44
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React, { createContext } from 'react'

import { PartialStateReducer, usePartialStateReducer } from '@hooks/use-partial-state-reducer'

import { MediaTimeState } from '../types'

export type TimeProviderProps = React.PropsWithChildren

const initialState: MediaTimeState = {
    time: 0,
    duration: 0,
    progress: 0,
    buffered: 0,
}

export const TimeContext = createContext<MediaTimeState>(initialState)
export const TimeUpdaterContext = createContext<PartialStateReducer<MediaTimeState>>(() => {})

/**
 * The `TimeProvider` is responsible for providing the current time, duration, progress and buffer of the media.
 * It's separate from the `StateProvider` because it's updated very frequently and we don't want to re-render
 * the entire app every time the time changes.
 */
export function TimeProvider(props: TimeProviderProps) {
    const { children } = props

    const [state, updateState] = usePartialStateReducer(initialState)

    /**
     * `updateState` is provided separately from `state` to avoid unnecessary re-renders
     * of components that only need to update the state but don't need to read it.
     */
    return (
        <TimeUpdaterContext.Provider value={updateState}>
            <TimeContext.Provider value={state}>{children}</TimeContext.Provider>
        </TimeUpdaterContext.Provider>
    )
}
