/* ┐
   │ File: use-detect-interaction.ts [/src/hooks/use-detect-interaction.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 22:19:54
   │ Modified: May 2nd, 2023 - 14:39:52
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useState, useEffect } from 'react'

/**
 * This hook detects user interactions on the page, or on a specific node.
 * @param {HTMLElement | null | boolean | number} [node] The node to watch for interactions. If not specified, the whole page will be watched.
 * @param {boolean | number} [initial] The initial value of the interaction state. If not specified, it will be set to false.
 * @param {number} [timeout] The timeout after which the interaction state will be reset to false. If not specified, it will be set to 3000ms.
 * @returns {boolean} The current interaction state.
 * @example const isInteracting = useDetectInteraction() // Detects interactions on the whole page, with a 3000ms timeout, and an initial interaction state of false.
 *          const isInteracting = useDetectInteraction(5000) // Detects interactions on the whole page, with a 5000ms timeout, and an initial interaction state of false.
 *          const isInteracting = useDetectInteraction(true) // Detects interactions on the whole page, with a 3000ms timeout, and an initial interaction state of true.
 *          const isInteracting = useDetectInteraction(5000, true) // Detects interactions on the whole page, with a 5000ms timeout, and an initial interaction state of true.
 *          const isInteracting = useDetectInteraction(ref.current) // Detects interactions on the specified node, with a 3000ms timeout, and an initial interaction state of false.
 *          const isInteracting = useDetectInteraction(ref.current, 5000) // Detects interactions on the specified node, with a 5000ms timeout, and an initial interaction state of false.
 *          const isInteracting = useDetectInteraction(ref.current, true) // Detects interactions on the specified node, with a 3000ms timeout, and an initial interaction state of true.
 *          const isInteracting = useDetectInteraction(ref.current, true, 5000) // Detects interactions on the specified node, with a 5000ms timeout, and an initial interaction state of true.
 */
function useDetectInteraction(): boolean
function useDetectInteraction(initial: boolean): boolean
function useDetectInteraction(timeout: number): boolean
function useDetectInteraction(initial: boolean, timeout: number): boolean
function useDetectInteraction(node: HTMLElement | null): boolean
function useDetectInteraction(node: HTMLElement | null, initial: boolean): boolean
function useDetectInteraction(node: HTMLElement | null, timeout: number): boolean
function useDetectInteraction(node: HTMLElement | null, initial: boolean, timeout: number): boolean
function useDetectInteraction(
    node: HTMLElement | null,
    hover: HTMLElement | null,
    initial: boolean,
    timeout: number,
): boolean
function useDetectInteraction(
    node?: HTMLElement | null | boolean | number,
    hover?: HTMLElement | null | boolean | number,
    initial?: boolean | number,
    timeout?: number,
): boolean {
    const _node = typeof node === 'number' || typeof node === 'boolean' || !node ? undefined : node
    const _hover = typeof hover === 'number' || typeof hover === 'boolean' || !hover ? undefined : hover
    const _initial =
        typeof node === 'boolean'
            ? node
            : typeof hover === 'boolean'
            ? hover
            : typeof initial === 'boolean'
            ? initial
            : false
    const _timeout =
        typeof node === 'number'
            ? node
            : typeof hover === 'number'
            ? hover
            : typeof initial === 'number'
            ? initial
            : typeof timeout === 'number'
            ? timeout
            : 3000

    const [isHovering, setIsHovering] = useState(false)
    const [moved, setMoved] = useState(_initial)

    useEffect(() => {
        if (moved) return
        const handleHover = () => {
            // @todo: fix hover detection
            setIsHovering(true)
        }
        const handleHoverOut = () => setIsHovering(false)

        const handleMouseMove = () => setMoved(true)

        const node = _node ?? window?.document

        // Detect interactions - mouse
        node.addEventListener('mousemove', handleMouseMove)
        node.addEventListener('mousedown', handleMouseMove)
        node.addEventListener('click', handleMouseMove)
        // Detect interactions - touch
        node.addEventListener('touchend', handleMouseMove)
        // Detect interactions - keyboard
        node.addEventListener('keydown', handleMouseMove)

        // Prevent hover effects
        if (_hover) {
            _hover.addEventListener('mouseenter', handleHover)
            _hover.addEventListener('mouseleave', handleHoverOut)
        }

        return () => {
            node.removeEventListener('mousemove', handleMouseMove)
            node.removeEventListener('mousedown', handleMouseMove)
            node.removeEventListener('click', handleMouseMove)
            node.removeEventListener('touchend', handleMouseMove)
            node.removeEventListener('keydown', handleMouseMove)
            if (_hover) {
                _hover.removeEventListener('mouseenter', handleHover)
                _hover.removeEventListener('mouseleave', handleHoverOut)
            }
        }
    }, [moved, _node, _hover])

    useEffect(() => {
        if (moved) {
            setTimeout(() => setMoved(false), _timeout)
        }
    }, [moved, _timeout])

    return moved || isHovering
}

export default useDetectInteraction
