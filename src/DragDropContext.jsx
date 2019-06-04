import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { setDragSource, setDropTarget } from './redux/actions'

class DragDropContext extends Component {
  constructor() {
    super()

    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  clearDragState() {
    this.props.setDragSource()
    this.props.setDropTarget()
  }

  handleMouseUp() {
    if (this.props.dragSource
      && this.props.dropTarget
      && typeof this.props.onDrop === 'function'
    ) {
      let dropResult = {
        dragSource: this.props.dragSource,
        dropTarget: this.props.dropTarget,
        dragDirection: this.props.dragDirection,
      }
      console.log('dropResult', dropResult)
      this.props.onDrop(dropResult)
    }
    this.clearDragState()
  }

  handleMouseLeave() {
    this.clearDragState()
  }

  render() {
    return (
      <React.Fragment>
        <div className='t-ddc' onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseLeave} style={{ width: this.props.width}}>
          {this.props.children}
        </div>
      </React.Fragment>
    )
  }
}

DragDropContext.propTypes = {
  onDrop: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

const mapStateToProps = state => ({
  dragSource: state.dragSource,
  dropTarget: state.dropTarget,
  dragDirection: state.dragDirection,
})

const mapDispatchToProps = {
  setDragSource,
  setDropTarget,
}

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContext)