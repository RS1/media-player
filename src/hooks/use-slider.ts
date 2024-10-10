/* ┐
   │ File: use-slider.ts [/src/hooks/use-slider.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 11:36:55
   │ Modified: May 3rd, 2023 - 12:56:13
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { useState, useCallback, useRef, useEffect } from 'react'

import { throttle } from '@utils/fn'
import { clamp } from '@utils/math'

type SliderDirection = 'BTT' | 'TTB' | 'RTL' | 'LTR'

type SliderProperties = {
    axis: 'X' | 'Y'
    scroll: 'Left' | 'Top'
    start: 'left' | 'right' | 'top' | 'bottom'
    end: 'width' | 'height'
    reverse: boolean
}

type UseSliderProps = [
    initialValue?: number,
    options?: {
        direction?: SliderDirection
        onChange?: (value: number) => void
    },
]

interface UseSliderReturn {
    value: number
    props: {
        onMouseDown: (e: React.MouseEvent) => void
        onTouchStart: (e: React.TouchEvent) => void
    }
    isSliding: boolean
}

interface SliderEvent {
    target: HTMLElement
    x: number
    y: number
}

const sliderSetup: {
    [key in SliderDirection]: SliderProperties
} = {
    BTT: {
        axis: 'Y',
        scroll: 'Top',
        start: 'top',
        end: 'height',
        reverse: false,
    },
    TTB: {
        axis: 'Y',
        scroll: 'Top',
        start: 'bottom',
        end: 'height',
        reverse: true,
    },
    RTL: {
        axis: 'X',
        scroll: 'Left',
        start: 'right',
        end: 'width',
        reverse: false,
    },
    LTR: {
        axis: 'X',
        scroll: 'Left',
        start: 'left',
        end: 'width',
        reverse: true,
    },
}

function getValue(e: SliderEvent, dir: SliderDirection): number {
    const rect = e.target.getBoundingClientRect()

    const { axis, scroll, start, end, reverse } = sliderSetup[dir]
    const { [start]: minValue, [end]: maxValue } = rect

    const value = axis === 'X' ? e.x : e.y
    const offset =
        window?.[`page${axis}Offset`] ??
        (document?.documentElement || document?.body.parentNode || document?.body || {})[`scroll${scroll}`]

    return clamp(0, (reverse ? 1 : -1) * (value - minValue + offset), maxValue) / maxValue
}

function useSlider(...props: UseSliderProps): UseSliderReturn {
    const [initialValue = 0, options = {}] = props
    const { direction = 'LTR', onChange } = options

    const target = useRef<HTMLElement | null>(null)
    const [value, setValue] = useState(initialValue)
    const [isSliding, setIsSliding] = useState(false)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const moveToValue = useCallback(
        (move: { x: number; y: number }) => {
            if (!target.current) return
            const val = clamp(
                getValue(
                    {
                        target: target.current,
                        ...move,
                    },
                    direction,
                ),
                0,
                0.99,
            )
            setValue(val)
            onChange && onChange(val)
        },
        [direction, onChange],
    )

    const handleMoveStart = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            const scrollEvent: React.Touch | React.MouseEvent =
                e.type === 'touchstart' ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent)
            target.current = e.currentTarget as HTMLElement
            setIsSliding(true)

            const handleMove = (e: MouseEvent | TouchEvent) => {
                const scrollEvent: Touch | MouseEvent =
                    e.type === 'touchmove' ? (e as TouchEvent).touches[0] : (e as MouseEvent)
                moveToValue({ x: scrollEvent.pageX, y: scrollEvent.pageY })
            }
            const handleMoveEnd = () => {
                target.current = null
                setIsSliding(false)
                document.removeEventListener('mousemove', handleMove)
                document.removeEventListener('touchmove', handleMove)
            }
            document.addEventListener('mousemove', throttle(handleMove, 25))
            document.addEventListener('touchmove', throttle(handleMove, 25))
            document.addEventListener('mouseup', handleMoveEnd, { once: true })
            document.addEventListener('touchend', handleMoveEnd, { once: true })

            moveToValue({ x: scrollEvent.pageX, y: scrollEvent.pageY })
        },
        [moveToValue],
    )

    return {
        value,
        props: {
            onMouseDown: handleMoveStart,
            onTouchStart: handleMoveStart,
        },
        isSliding,
    }
}

export default useSlider
