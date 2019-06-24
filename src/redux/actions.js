import { SET_SCROLL_LEFT, SET_SCROLLBAR_Y_VISIBILITY, SET_IS_EDITING_CELL, ADD_TABLE, DEL_TABLE, SET_DRAG_SOURCE, SET_DROP_TARGET, SET_DRAG_DIRECTION } from './action-types'
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

export const addTable = tableId => ({
  type: ADD_TABLE,
  payload: tableId
})

export const delTable = tableId => ({
  type: DEL_TABLE,
  payload: tableId
})

export const setDragSource = (tableId, idMap, data, pos, offset) => ({
  type: SET_DRAG_SOURCE,
  payload: coalesce(tableId, idMap, data) === undefined ? undefined : { tableId, idMap, data, pos, offset }
})

export const setDropTarget = (tableId, idMap) => ({
  type: SET_DROP_TARGET,
  payload: coalesce(tableId, idMap) === undefined ? undefined : { tableId, idMap }
})

export const setDragDirection = direction => ({
  type: SET_DRAG_DIRECTION,
  payload: direction,
})