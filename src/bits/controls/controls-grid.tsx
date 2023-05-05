/* ┐
   │ File: controls-grid.tsx [/src/bits/controls/controls-grid.tsx]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 21st, 2023 - 17:16:16
   │ Modified: May 5th, 2023 - 13:15:56
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */
import clsx from 'clsx'
import React from 'react'

import BaseControl from './base-control'
import { isControlComponent, isControlKey } from './control-is'
import { controls } from './index'
import { ControlsGroupType, ControlsGridType, ControlsRowType } from './types'

/**
 * This component displays grids, rows and groups of controls.
 * grid -> rows -> groups -> controls
 * Grids and controls are mandatory, rows and groups are optional.
 * Grids are displayed vertically, rows are displayed horizontally (space-between)
 * and groups are displayed horizontally (first group is left-aligned, last group
 * is right-aligned, all other groups are centered).
 * This component is recursive, so you can nest grids, rows and groups.
 */
function ControlsGrid(
    props: {
        /**
         * The array of controls to display. (grids, rows or groups)
         */
        elements: ControlsGridType | ControlsRowType | ControlsGroupType
        /**
         * Whether to display the controls as a row (default: false)
         */
        isRow?: boolean
        /**
         * Whether to display the controls as a group (default: false)
         */
        isGroup?: boolean
    } & React.HTMLAttributes<HTMLDivElement>,
    ref: React.ForwardedRef<HTMLDivElement>,
) {
    const { elements = [], isRow: _isRow = false, isGroup: _isGroup = false, ...rest } = props

    const isGroup = _isGroup
    const isRow = _isRow && !isGroup
    const isGrid = !isRow && !isGroup

    return (
        <div
            {...rest}
            ref={ref}
            id={isGrid ? rest.id || 'rmp-media-controls-grid' : undefined}
            className={clsx(
                !isGrid && `rmp-media-controls-${isRow ? 'row' : 'group'}`,
                'items-center',
                {
                    // Grids are verical
                    'grid grid-cols-1 w-full justify-center gap-y-2': isGrid,
                    // Rows and groups are horizontal
                    'flex space-x-4 w-full': isRow || isGroup,
                    // Rows are space-between
                    'justify-between': isRow,
                    // Groups are: first group is left-aligned, last group is right-aligned, all other groups are centered
                    'flex-1 justify-center first:justify-start last:justify-end first:last:justify-center': isGroup,
                },
                // We don't want the original className for nested controls
                isGrid && rest.className,
            )}
        >
            {Array.isArray(elements) &&
                elements.map((row, idx) => {
                    if (isControlKey(row)) {
                        // If the control is a string, it's a key to a control component
                        // We need to load the component from the controls object (if it exists, see index.tsx)
                        if (row in controls) {
                            const control = controls[row as keyof typeof controls]
                            return <BaseControl key={idx} Component={control} />
                        }
                        return null
                    }
                    if (isControlComponent(row)) {
                        // If the control is a component, we can render it directly via BaseControl
                        return <BaseControl key={idx} Component={row} />
                    }
                    // If the control is an array, it's a group or a row.
                    // If we are rendering a grid, that means it's a row.
                    // If we are rendering a row, that means it's a group.
                    // For further nesting we consider it a group.
                    // See the top of this file for more info about the nesting logic.
                    return <ForwardGrid key={idx} elements={row} isRow isGroup={_isRow} />
                })}
        </div>
    )
}

const ForwardGrid = React.forwardRef(ControlsGrid)

export default ForwardGrid
