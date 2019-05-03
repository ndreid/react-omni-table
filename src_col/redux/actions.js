import { SET_SCROLL_LEFT, SET_SCROLLBAR_Y_VISIBILITY, SET_IS_EDITING_CELL, SET_CURRENT_DRAG, ADD_TABLE, DEL_TABLE, SET_DRAG_SOURCE, SET_DROP_TARGET, SET_DRAG_DIRECTION, SET_HOVER } from './action-types'
import { coalesce } from '../extensions'

export const setScrollbarYVisibility = isVisible => ({
  type: SET_SCROLLBAR_Y_VISIBILITY,
  payload: isVisible,
})

export const setScrollLeft = scrollLeft => ({
  type: SET_SCROLL_LEFT,
  payload: scrollLeft,
})

export const setIsEditingCell = isEditingCell => ({
  type: SET_IS_EDITING_CELL,
  payload: isEditingCell,
})

export const setCurrentDrag = currentDrag => ({
  type: SET_CURRENT_DRAG,
  payload: currentDrag
})

export const addTable = tableId => ({
  type: ADD_TABLE,
  payload: tableId
})

export const delTable = tableId => ({
  type: DEL_TABLE,
  payload: tableId
})

export const setDragSource = (tableId, idMap) => ({
  type: SET_DRAG_SOURCE,
  payload: coalesce(tableId, idMap) === undefined ? undefined : { tableId, idMap }
})

export const setDropTarget = (tableId, idMap) => ({
  type: SET_DROP_TARGET,
  payload: coalesce(tableId, idMap) === undefined ? undefined : { tableId, idMap }
})

export const setDragDirection = direction => ({
  type: SET_DRAG_DIRECTION,
  payload: direction,
})

export const setHover = (tableId, idMap) => ({
  type: SET_HOVER,
  payload: coalesce(tableId, idMap) === undefined ? undefined : { tableId, idMap }
})