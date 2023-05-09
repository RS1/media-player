/* ┐
   │ File: types.ts [/src/bits/controls/types.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 28th, 2023 - 17:47:45
   │ Modified: May 9th, 2023 - 12:40:01
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

export type ControlKey =
    /* Buttons */
    | 'play'
    | 'pause'
    | 'playpause'
    | 'backward10'
    | 'forward10'
    | 'previous'
    | 'next'
    | 'mute'
    | 'fullscreen'
    | 'pictureinpicture'
    | 'shuffle'
    | 'repeat'
    | 'airplay'
    | 'cast'
    | 'playlist'
    /* Seekbar */
    | 'seekbar'
    /* Time */
    | 'time'
    | 'duration'
    | 'remaining'
    /* Metadata */
    | 'title'
    | 'artist'
    | 'album'
    | 'metadata'
    | 'position'
    | 'prefix'
    | 'suffix'
    | 'index'
    /* Loading */
    | 'loading'
    | 'stalled'
    /* Error */
    | 'error'
    /* Spacing */
    | 'spacer'
    | 'empty'

/**
 * The props the custom control receives.
 */
export type CustomControlProps = {
    className?: string
    style?: React.CSSProperties
    [key: string]: unknown
}

/**
 * A control is either a key of the ControlKey type or a React component that accepts CustomControlProps.
 */
export type GenericControlType = ControlKey | React.ComponentType<CustomControlProps>

/**
 * A controls-group is an array of controls (either keys or components).
 */
export type ControlsGroupType = GenericControlType[]

/**
 * A controls-row is an array of controls (either keys or components) or control-groups.
 * This allows nesting controls in a grid-like structure.
 */
export type ControlsRowType = (GenericControlType | ControlsGroupType)[]

/**
 * A controls-grid is an array of controls-rows or a single controls-row.
 * Again, this allows nesting controls in a grid-like structure.
 */
export type ControlsGridType = ControlsRowType[] | ControlsRowType
