import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import reducer from './redux/reducer'
import { DragDropContext } from './'

class DragDropArea extends PureComponent {
  constructor() {
    super()

    this.store = createStore(
      reducer
    );
  }

  render() {
    return (
      <Provider store={this.store}>
        <DragDropContext {...this.props}>
          {this.props.children}
        </DragDropContext>
      </Provider>
    )
  }
}

DragDropArea.propTypes = {
  onDrop: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

DragDropArea.defaultProps = {
  width: '100%',
}

export default DragDropArea