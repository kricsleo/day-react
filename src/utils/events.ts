import type React from 'react'

// Any mouse click event will trigger the React's `onMouseDown` event,
// we need to know which button (the left, the middle or the right) was clicked.
export function isLeftClick(event: React.MouseEvent) {
  return event.button === 0
}

export function isRightClick(event: React.MouseEvent) {
  return event.button === 2
}

export function isEnter(event: KeyboardEvent | React.KeyboardEvent) {
  return event.key === 'Enter'
}

export function isEsc(event: KeyboardEvent | React.KeyboardEvent) {
  return event.key === 'Escape'
}
