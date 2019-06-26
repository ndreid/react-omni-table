import { SET_X_SCROLL,
         SET_Y_SCROLL_VISIBLE,
         SET_IS_EDITING_CELL,
         ADD_TABLE,
         DEL_TABLE,
         SET_DRAG_SOURCE,
         SET_DROP_TARGET } from './action-types'

const initialState = {
  xScroll: {},
  yScrollVisible: {},
  isEditingCell: false,
  tableIds: [],
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_X_SCROLL:
      return {
        ...state,
        xScroll: { ...state.xScroll, [payload.tableId]: payload.xScroll }
      }
    case SET_Y_SCROLL_VISIBLE:
      return {
        ...state,
        yScrollVisible: { ...state.yScrollVisible, [payload.tableId]: payload.isVisible }
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
    default: return state
  }
}

export default reducer