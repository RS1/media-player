/* ┐
   │ File: use-media-element.ts [/src/media/hooks/use-media-element.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 20th, 2023 - 10:48:44
   │ Modified: May 4th, 2023 - 12:48:48
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useContext } from 'react'

import { CoreContext } from '@media/providers/core'

/**
 * Use this hook anywhere within a `MediaProvider` to get the correct props and refs needed to build a custom media player component.
 *
 * You will get the following properties:
 * - `node`: a wrapper around the HTMLMediaElement that provides a unified interface for interacting with the media player. (AugmentedMediaElement)
 * - `container`: a direct ref to the container element that wraps the media player.
 *   (eg: HTMLDivElement - equivalent of `containerRef.current`)
 * - `setRef`: a function that must be bound to the `ref` prop of the HTMLMediaElement.
 *   (eg: `<video ref={setRef} />`)
 * - `setContainerRef`: a function that must be bound to the `ref` prop of the container element.
 *   (eg: `<div ref={setContainerRef}>...</div>`)
 * - `props`: a set of props that must be spread on the HTMLMediaElement.
 *   (eg: `<video {...props} />`)
 *
 * **Note:** you can use this hook in any component to get access to the `AugmentedMediaElement`, but you should not use it to control
 * the media player unless you know what you're doing. Direct changes to the `AugmentedMediaElement` can cause the player to enter an
 * inconsistent state, and you should use the `useMediaControls` hook instead.
 * @example
 * ```js
 * const { container, setRef, setContainerRef, props } = useMediaElement()
 *
 * return (
 *   <div ref={setContainerRef}>
 *     <video ref={setRef} {...props} />
 *   </div>
 * )
 * ```
 */
export const useMediaElement = () => {
    const cx = useContext(CoreContext)
    if (!cx) {
        throw new Error('useMediaElement must be used within a MediaProvider')
    }
    return {
        node: cx.node,
        container: cx.container,
        setRef: cx.setRef,
        setContainerRef: cx.setContainerRef,
        props: cx.props,
    }
}
