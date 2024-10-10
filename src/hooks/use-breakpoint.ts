/* ┐
   │ File: use-breakpoint.ts [/src/hooks/use-breakpoint.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: May 5th, 2023 - 9:11:51
   │ Modified: May 5th, 2023 - 11:36:46
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type BreakpointSizes = Record<Breakpoint, number>
export type ExtendedBreakpoints = BreakpointSizes & { [K: string]: typeof K extends Breakpoint ? never : number }
export type CustomBreakpoints = Partial<BreakpointSizes> | ExtendedBreakpoints

/**
 * This is a list of predefined breakpoints.
 * Each number represents the minimum width of the breakpoint.
 */
export const baseBreakpoints: BreakpointSizes = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
}

/**
 * Given a CustomBreakpoints object, it returns an array of [Breakpoint, number] tuples.
 * This is guaranteed to contain only valid breakpoints, and to be sorted by decreasing breakpoint width.
 * @param {CustomBreakpoints} bps The CustomBreakpoints object.
 * @returns {[Breakpoint, number][]} The array of [Breakpoint, number] tuples.
 * @private
 */
const normalizeBreakpoints = (bps: CustomBreakpoints) => {
    return Object.entries(bps)
        .filter(([, v]) => typeof v === 'number')
        .sort(([, a], [, b]) => b - a) as [Breakpoint, number][]
}

/**
 * Extends the default breakpoints with the given ones.
 * @param {CustomBreakpoints} bps The breakpoints to add or override.
 * @returns {ExtendedBreakpoints} The extended breakpoints.
 * @example
 * ```js
 * const breakpoints = extendBreakpoints({ xs: 100, sm: 200 })
 * // breakpoints = { xs: 100, sm: 200, md: 992, lg: 1200, xl: Infinity }
 * ```
 */
export const extendBreakpoints = (bps: CustomBreakpoints): ExtendedBreakpoints => {
    return {
        ...baseBreakpoints,
        ...bps,
    }
}

/**
 * Returns the current breakpoint based on the window width.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint()
 * // On the first render:
 * // breakpoint = undefined
 * // Then, on consecutive renders:
 * // breakpoint = 'xs' → the window width is >= 0px and < 576px
 * // breakpoint = 'sm' → the window width is >= 576px and < 768px
 * // breakpoint = 'md' → the window width is >= 768px and < 992px
 * // breakpoint = 'lg' → the window width is >= 992px and < 1200px
 * // breakpoint = 'xl' → the window width is >= 1200px
 * // In case of error:
 * // breakpoint = undefined → the window width is unknown or doesn't match any breakpoint
 * ```
 */
export function useBreakpoint(): Breakpoint | undefined
/**
 * Returns the current breakpoint based on the window width.
 * @param {Breakpoint} defaultBreakpoint The default breakpoint to use for the first render, or if the window width is unknown/doesn't match any breakpoint.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint('sm')
 * // On the first render:
 * // breakpoint = 'sm'
 * // Then, on consecutive renders:
 * // breakpoint = 'xs' → the window width is >= 0px and < 576px
 * // breakpoint = 'sm' → the window width is >= 576px and < 768px
 * // breakpoint = 'md' → the window width is >= 768px and < 992px
 * // breakpoint = 'lg' → the window width is >= 992px and < 1200px
 * // breakpoint = 'xl' → the window width is >= 1200px
 * // In case of error:
 * // breakpoint = 'sm → the window width is unknown or doesn't match any breakpoint
 * ```
 */
export function useBreakpoint(defaultBreakpoint: Breakpoint): Breakpoint | undefined
/**
 * Returns the current breakpoint based on the window width.
 * @param {Breakpoint[]} neededBreakpoints The breakpoints that must be considered.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint(['sm', 'md'])
 * // On the first render:
 * // breakpoint = undefined
 * // Then, on consecutive renders:
 * // breakpoint = 'sm' → the window width is >= 0px and < 768px
 * // breakpoint = 'md' → the window width is >= 768px
 * // In case of error:
 * // breakpoint = undefined → the window width is unknown or doesn't match any breakpoint
 * ```
 */
export function useBreakpoint(neededBreakpoints: Breakpoint[]): Breakpoint | undefined
/**
 * Returns the current breakpoint based on the window width.
 * @param {CustomBreakpoints} customBreakpoints The breakpoints to use.
 * @see {@link extendBreakpoints} to extend the default breakpoints instead of replacing them.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint({ xs: 0, sm: 200 })
 * // On the first render:
 * // breakpoint = undefined
 * // Then, on consecutive renders:
 * // breakpoint = 'xs' → the window width is >= 0px and < 200px
 * // breakpoint = 'sm' → the window width is >= 200px
 * // In case of error:
 * // breakpoint = undefined → the window width is unknown or doesn't match any breakpoint
 * ```
 */
export function useBreakpoint(customBreakpoints: CustomBreakpoints): Breakpoint | undefined
/**
 * Returns the current breakpoint based on the window width.
 * @param {CustomBreakpoints} customBreakpoints The breakpoints to use.
 * @see {@link extendBreakpoints} to extend the default breakpoints instead of replacing them.
 * @param {Breakpoint[]} neededBreakpoints The breakpoints that must be considered.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint({ xs: 0, sm: 200 }, ['sm', 'md'])
 * // On the first render:
 * // breakpoint = undefined
 * // Then, on consecutive renders:
 * // breakpoint = 'sm' → the window width is >= 0px and < 200px
 * // In case of error:
 * // breakpoint = undefined → the window width is unknown or doesn't match any breakpoint
 * ```
 */
export function useBreakpoint(
    customBreakpoints: CustomBreakpoints,
    neededBreakpoints: Breakpoint[],
): Breakpoint | undefined
/**
 * Returns the current breakpoint based on the window width.
 * @param {Breakpoint} defaultBreakpoint The default breakpoint to use for the first render, or if the window width is unknown/doesn't match any breakpoint.
 * @param {Breakpoint[]} neededBreakpoints The breakpoints that must be considered.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint('sm', ['sm', 'md'])
 * // On the first render:
 * // breakpoint = 'sm'
 * // Then, on consecutive renders:
 * // breakpoint = 'sm' → the window width is >= 0px and < 768px
 * // breakpoint = 'md' → the window width is >= 768px
 * // In case of error:
 * // breakpoint = 'sm' → the window width is unknown or doesn't match any breakpoint
 * ```
 */
export function useBreakpoint(defaultBreakpoint: Breakpoint, neededBreakpoints: Breakpoint[]): Breakpoint | undefined
/**
 * Returns the current breakpoint based on the window width.
 * @param {Breakpoint} defaultBreakpoint The default breakpoint to use for the first render, or if the window width is unknown/doesn't match any breakpoint.
 * @param {CustomBreakpoints} customBreakpoints The breakpoints to use.
 * @see {@link extendBreakpoints} to extend the default breakpoints instead of replacing them.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint('sm', { xs: 0, sm: 200 })
 * // On the first render:
 * // breakpoint = 'sm'
 * // Then, on consecutive renders:
 * // breakpoint = 'xs' → the window width is >= 0px and < 200px
 * // breakpoint = 'sm' → the window width is >= 200px
 * // In case of error:
 * // breakpoint = 'sm' → the window width is unknown or doesn't match any breakpoint
 * ```
 */
export function useBreakpoint(
    defaultBreakpoint: Breakpoint,
    customBreakpoints: CustomBreakpoints,
): Breakpoint | undefined
/**
 * Returns the current breakpoint based on the window width.
 * @param {Breakpoint} defaultBreakpoint The default breakpoint to use for the first render, or if the window width is unknown/doesn't match any breakpoint.
 * @param {CustomBreakpoints} customBreakpoints The breakpoints to use.
 * @see {@link extendBreakpoints} to extend the default breakpoints instead of replacing them.
 * @param {Breakpoint[]} neededBreakpoints The breakpoints that must be considered.
 * @returns {Breakpoint | undefined} The current breakpoint.
 * @example
 * ```js
 * const breakpoint = useBreakpoint('sm', { xs: 0, sm: 200 }, ['sm', 'md'])
 * // On the first render:
 * // breakpoint = 'sm'
 * // Then, on consecutive renders:
 * // breakpoint = 'sm' → the window width is >= 0px and < 200px
 * // In case of error:
 * // breakpoint = 'sm' → the window width is unknown or doesn't match any breakpoint
 * ```
 */
export function useBreakpoint(
    defaultBreakpoint: Breakpoint,
    customBreakpoints: CustomBreakpoints,
    neededBreakpoints: Breakpoint[],
): Breakpoint | undefined
export function useBreakpoint(
    d?: Breakpoint | CustomBreakpoints | Breakpoint[],
    c?: CustomBreakpoints | Breakpoint[],
    n?: Breakpoint[],
): Breakpoint | undefined {
    const [bpState, setBpState] = React.useState(() => {
        const custom =
            typeof d === 'object' && !Array.isArray(d) ? d : typeof c === 'object' && !Array.isArray(c) ? c : undefined
        const needed = Array.isArray(d) ? d : Array.isArray(c) ? c : n
        const initial = typeof d === 'string' && d in baseBreakpoints ? d : undefined

        return {
            default: initial,
            breakpoint: initial,
            breakpoints: normalizeBreakpoints(custom || baseBreakpoints),
            needed,
        }
    })

    React.useEffect(() => {
        const custom =
            typeof d === 'object' && !Array.isArray(d) ? d : typeof c === 'object' && !Array.isArray(c) ? c : undefined
        setBpState(bps => ({
            ...bps,
            breakpoints: normalizeBreakpoints(custom || baseBreakpoints),
        }))
    }, [JSON.stringify(d), JSON.stringify(c)])

    React.useEffect(() => {
        const needed = Array.isArray(d) ? d : Array.isArray(c) ? c : n
        setBpState(bps => ({
            ...bps,
            needed,
        }))
    }, [JSON.stringify(d), JSON.stringify(c), JSON.stringify(n)])

    React.useEffect(() => {
        const onResize = () => {
            const width = window?.innerWidth
            let computed: Breakpoint | undefined = undefined
            for (const [id, minWidth] of bpState.breakpoints) {
                // dont't consider this breakpoint if it's not included
                // in the `needed` state prop
                if (bpState.needed && !bpState.needed.some(bp => bp === id)) {
                    continue
                }
                if (width > minWidth) {
                    computed = id
                    break
                }
            }
            setBpState(bps => ({ ...bps, breakpoint: computed ?? bps.default }))
        }

        // We listen for the resize event only if we need to.
        // This means that the `needed` state prop has to be either `undefined`
        // or an array of breakpoints where at least one of them is included
        // in the `breakpoints` state prop.
        if (bpState.needed === undefined || bpState.needed.some(bp => bpState.breakpoints.some(([id]) => id === bp))) {
            window?.addEventListener('resize', onResize)
            onResize()
        }

        return () => {
            window?.removeEventListener('resize', onResize)
        }
    }, [bpState.breakpoints, bpState.needed])

    return bpState.breakpoint
}
