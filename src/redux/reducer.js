import { SET_SCROLL_LEFT,
         SET_SCROLLBAR_Y_VISIBILITY,
         SET_IS_EDITING_CELL,
         ADD_TABLE,
         DEL_TABLE,
         SET_DRAG_SOURCE,
         SET_DROP_TARGET,
         SET_DRAG_DIRECTION } from './action-types'

const initialState = {
  scrollLeft: 0,
  scrollbarYIsVisible: false,
  isEditingCell: false,
  tableIds: [],
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SCROLL_LEFT:
      return {
        ...state,
        scrollLeft: payload
      }
    case SET_SCROLLBAR_Y_VISIBILITY:
      return {
        ...state,
        scrollbarYIsVisible: payload
      }
    case SET_IS_EDITING_CELL:
      return {
        ...state,
        isEditingCell: payload
      }
    case ADD_TABLE:
      return {
        ...state,
        tableIds: [...state.tableIds, payload]
      }
    case DEL_TABLE:
      let { [payload]: deletedTable, ...tableIds } = state.tableIds
      return {
        ...state,
        tableIds
      }
    case SET_DRAG_SOURCE:
      return {
        ...state,
        dragSource: payload
      }
    case SET_DROP_TARGET:
      return {
        ...state,
        dropTarget: payload
      }
    case SET_DRAG_DIRECTION:
      return {
        ...state,
        dragDirection: payload
      }
    default: return state
  }
}

export default reducer