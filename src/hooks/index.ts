/* ┐
   │ File: index.ts [/src/hooks/index.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 11:04:41
   │ Modified: May 5th, 2023 - 10:41:27
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

// State management
export { default as useConstant } from './use-constant'
export { default as usePrevious } from './use-previous'
export { default as useStaticState } from './use-static-state'
export { default as useAutoRevertToggle } from './use-auto-revert-toggle'

// Refs
export { default as useForwardedRef } from './use-forwarded-ref'

// UI interactions
export { default as useDetectInteraction } from './use-detect-interaction'
export { default as useDoubleTap } from './use-double-tap'
export { default as useSlider } from './use-slider'

// Window
export type { Breakpoint, BreakpointSizes, CustomBreakpoints } from './use-breakpoint'
export { useBreakpoint, extendBreakpoints, baseBreakpoints } from './use-breakpoint'

// APIs
export { default as useFullscreenAPI } from './use-fullscreen-api'
export { default as usePiPAPI } from './use-pip-api'
export { default as useAirPlayAPI } from './use-airplay-api'

// Debug
export { default as useTraceUpdate } from './use-trace-update'

// Audio
export { useKeepAliveAudio } from './use-keep-alive-audio'
