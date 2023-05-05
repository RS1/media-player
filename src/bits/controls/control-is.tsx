/* ┐
   │ File: control-is.tsx [/src/bits/controls/control-is.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 17:16:16
   │ Modified: May 3rd, 2023 - 16:42:40
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import React from 'react'
import { isValidElementType } from 'react-is'

import { ControlKey, ControlsGroupType, ControlsRowType, CustomControlProps, GenericControlType } from './types'

type ControlsGridChild = GenericControlType | ControlsGroupType | ControlsRowType

export const isControlKey = (c: ControlsGridChild): c is ControlKey => typeof c === 'string'
export const isControlComponent = (c: ControlsGridChild): c is React.ComponentType<CustomControlProps> =>
    isValidElementType(c)
export const isControlsGroup = (c: ControlsGridChild): c is ControlsGroupType =>
    Array.isArray(c) && (c.length === 0 || isControlKey(c[0]) || isControlComponent(c[0]))
export const isControlsGroupOrRow = (c: ControlsGridChild): c is ControlsGroupType | ControlsRowType =>
    Array.isArray(c) && (c.length === 0 || isControlKey(c[0]) || isControlsGroup(c[0]) || isControlComponent(c[0]))
