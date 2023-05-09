/* ┐
   │ File: base-button.tsx [/src/bits/controls/base-button.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 16:18:51
   │ Modified: May 9th, 2023 - 14:16:46
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import { clsx } from 'clsx'
import React from 'react'

import ErrorIcon from '@bits/misc/error'
import Spinner from '@bits/misc/spinner'
import SvgString from '@bits/misc/svg-string'

import { useMediaTheme } from '@/media'

import { ControlKey } from './types'

/**
 * Map of textually defined button sizes to their numeric values (in `rem` for TailwindCSS)
 */
export const buttonSizes = {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 10,
} as const

const activeSize = {
    xs: 1,
    sm: 3,
    md: 5,
    lg: 6,
    xl: 9,
} as const

/**
 * Map of textually defined button sizes to their corresponding spinner sizes.
 * We need spinners to be slightly smaller than buttons, so we can't use the same size.
 */
const sizeToSpinner = {
    xs: 'xs',
    sm: 'xs',
    md: 'sm',
    lg: 'sm',
    xl: 'md',
} as const

type WithLabel = {
    /**
     * The label to display on the button
     */
    label: string
    /**
     * If we have a label, we can't have an icon
     */
    icon?: never
}
type WithIcon = {
    /**
     * The icon to display on the button.
     * If it's a string, it's assumed to be the content of an SVG file;
     * this will be parsed to extract paths and viewbox and then rendered as a React component.
     * If it's a React node, it's assumed to be a React component that will be rendered as-is.
     */
    icon: string | React.ReactNode
    /**
     * If we have an icon, we can't have a label
     */
    label?: never
}

export type BaseButtonProps = (WithLabel | WithIcon) & {
    /**
     * The key of the control, used to determine if there's a theme color to use for this particular button.
     */
    controlKey?: ControlKey
    /**
     * The size of the icon. Defaults to `md`.
     */
    size?: keyof typeof buttonSizes
    /**
     * Whether the button is currently loading. If `true`, a spinner will be displayed instead of the button content.
     * Defaults to `false`.
     */
    loading?: boolean
    /**
     * Whether the button is currently in error state. If `true`, an error icon will be displayed instead of the button.
     * Defaults to `false`.
     */
    error?: boolean
    /**
     * Whether the button is currently active. If `false`, the button will be rendered with a 50% opacity.
     * It's useful for `toggle` buttons to show if the action the button performs is currently active or not.
     * Defaults to `true`.
     */
    active?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

/**
 * A base button component, used to render all the control buttons.\
 * It's not meant to be used directly, but rather extended by other components.\
 * It can display either a label or an icon, but not both.\
 * Supports conditional behavior/rendering based on:
 * - `controlKey`: if present, it's used to determine if there's a theme color to use for this particular button.
 * - `loading`: if `true`, a spinner will be displayed instead of the button content.
 * - `error`: if `true`, an error icon will be displayed instead of the button.
 * - `active`: if `false`, the button will be rendered with a 50% opacity.
 * - `disabled`: if `true`, the button will be rendered with a 50% opacity and no `onClick` handler will be attached.
 *
 * Accepts all the standard HTML button attributes and an optional `ref` that will be
 * forwarded to the underlying `<button>` element.
 */
function BaseButton(props: BaseButtonProps, ref: React.Ref<HTMLButtonElement>) {
    const { controlKey, label, icon, size = 'md', loading = false, error = false, active, ...rest } = props
    const theme = useMediaTheme()
    // Map the size to the TailwindCSS classes (e.g. `md` -> `w-6 h-6`)
    const clSize = `w-${buttonSizes[size]} h-${buttonSizes[size]}`
    const clActiveSize = `w-${activeSize[size]} h-${activeSize[size]}`
    // Determine the color of the button, based on the control key and the error state.
    // If there's no control key, we use the default controls color.
    const btnColor = controlKey && theme[controlKey] ? theme[controlKey] : undefined

    if (error) {
        // If we're in error state, we display an error icon instead of the button.
        // We keep size and color, but we center the icon.
        return (
            <div className={clsx('flex items-center justify-center', clSize)}>
                <ErrorIcon color={btnColor || (error ? theme.errorColor : theme.controlsColor)} size={size} />
            </div>
        )
    }

    if (loading) {
        // If we're in loading state, we display a spinner instead of the button.
        // We keep size and color, but we center the spinner.
        return (
            <div className={clsx('flex items-center justify-center opacity-50', clSize)}>
                <Spinner color={btnColor} size={sizeToSpinner[size]} />
            </div>
        )
    }

    return (
        <button
            {...rest}
            ref={ref}
            className={clsx(
                'scale-100 transition',
                !icon && {
                    'rounded-full px-2 text-sm font-bold uppercase': true,
                    'bg-controls-color text-controls-bg': !btnColor,
                    'hover:bg-accent-color': !btnColor && !rest.disabled,
                },
                icon && {
                    'text-center': true,
                    'text-controls-color': !btnColor && !active,
                    'hover:text-accent-color': !btnColor && !rest.disabled && !active,
                    'bg-controls-color text-controls-bg': !btnColor && active,
                    'hover:bg-accent-color': !btnColor && !rest.disabled && active,
                    'p-0.5 rounded': active,
                },
                {
                    'hover:scale-105': !rest.disabled,
                    'opacity-50': rest.disabled || (active === false && !icon),
                },
                icon && clSize,
                rest.className,
            )}
            title={icon ? label : undefined}
            style={
                btnColor
                    ? {
                          ...rest.style,
                          [icon && !active ? 'color' : 'background']: btnColor,
                      }
                    : rest.style
            }
        >
            {/* Show either the icon or the label, depending on which one is defined */}
            {icon &&
                (typeof icon === 'string' ? (
                    <SvgString className={clsx('svg-icon', active ? clActiveSize : clSize)} svg={icon} />
                ) : (
                    icon
                ))}
            {!icon && label}
        </button>
    )
}

export default React.memo(React.forwardRef(BaseButton))
