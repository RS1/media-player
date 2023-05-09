/* ┐
   │ File: use-config-property.ts [/src/media/hooks/use-config-property.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 2nd, 2023 - 10:09:12
   │ Modified: May 9th, 2023 - 14:48:05
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useMemo } from 'react'

import { WithBreakpoint, WithMediaType } from '@media/types'

import { Breakpoint, useBreakpoint } from '@/hooks'

import { useMediaConfig } from './use-media-config'
import { useTrack } from './use-track'

/**
 * Use this hook anywhere within a `MediaProvider` to access and transform a configuration property.\
 * This hook resolves the property based on the current breakpoint and track type.
 * @returns The current property value.
 * @private
 */
export const useConfigProperty = <T extends string>(property: WithBreakpoint<WithMediaType<T>>, fallback: T): T => {
    const { breakpoints } = useMediaConfig()
    const neededBreakpoints =
        typeof property === 'object' && !Array.isArray(property) ? (Object.keys(property) as Breakpoint[]) : []

    const breakpoint = useBreakpoint(breakpoints, neededBreakpoints)
    const [track] = useTrack()

    const _property = useMemo(() => {
        const baseProp = property ?? fallback
        const breakpointProp =
            typeof baseProp === 'object' && !Array.isArray(baseProp)
                ? breakpoint
                    ? baseProp[breakpoint]
                    : Object.values(baseProp)[0]
                : baseProp
        const mediaTypeProp = Array.isArray(breakpointProp)
            ? breakpointProp.find(p => Array.isArray(p) && p[0] === track?.type)?.[1]
            : breakpointProp
        return mediaTypeProp ?? fallback
    }, [property, fallback, track, breakpoint])

    return _property
}
