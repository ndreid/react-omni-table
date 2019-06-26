import { SET_X_SCROLL, SET_Y_SCROLL_VISIBLE, SET_IS_EDITING_CELL, ADD_TABLE, DEL_TABLE, SET_DRAG_SOURCE, SET_DROP_TARGET, SET_DRAG_DIRECTION } from './action-types'
import { coalesce } from '../extensions'

export const setYScrollVisible = (tableId, isVisible) => ({
  type: SET_Y_SCROLL_VISIBLE,
  payload: { tableId, isVisible },
})

export const setXScroll = (tableId, xScroll) => ({
  type: SET_X_SCROLL,
  payload: { tableId, xScroll },
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

export const setDragSource = (tableId, idMap, pos, offset) => ({
  type: SET_DRAG_SOURCE,
  payload: coalesce(tableId, idMap) === undefined ? undefined : { tableId, idMap, pos, offset }
})

export const setDropTarget = (tableId, idMap) => ({
  type: SET_DROP_TARGET,
  payload: coalesce(tableId, idMap) === undefined ? undefined : { tableId, idMap }
})

export const setDragDirection = direction => ({
  type: SET_DRAG_DIRECTION,
  payload: direction,
})