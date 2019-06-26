import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { setDragSource, setDropTarget } from '../redux/actions'

class DragDropContext extends Component {
  constructor() {
    super()

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  getResult({tableId, idMap}) {
    let map = idMap.split('|')
    map.shift() //remove tableId from array
    return {
      tableId,
      id: map.pop(),
      parentIds: map
    }
  }

  clearDragState() {
    if (this.props.dragSource) {
      let domNode = document.getElementById(this.props.dragSource.idMap)
      requestAnimationFrame(() => {
        domNode.style.transform = null
        domNode.style.transition = null
      })
    }
    this.props.setDragSource()
    this.props.setDropTarget()
  }
  
  handleMouseMove(e) {
    if (!this.props.dragSource)
      return

    let domNode = document.getElementById(this.props.dragSource.idMap)
    let deltaX = e.pageX - this.props.dragSource.pos.x - this.props.dragSource.offset.x
    let deltaY = e.pageY - this.props.dragSource.pos.y - this.props.dragSource.offset.y

    requestAnimationFrame(() => {
      domNode.style.transform = `translate(${deltaX}px, ${deltaY}px)`
      domNode.style.transition = 'transform 0s'
    })
  }

  handleMouseUp() {
    if (this.props.dragSource
      && this.props.dropTarget
      && typeof this.props.onDrop === 'function'
    ) {
      this.props.onDrop({
        source: this.getResult(this.props.dragSource),
        target: this.getResult(this.props.dropTarget),
      })
    }
    this.clearDragState()
  }

  handleMouseLeave() {
    this.clearDragState()
  }

  render() {
    return (
      <div className='t-ddc' onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseLeave} style={{ width: this.props.width }}>
        {this.props.children}
      </div>
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
})

const mapDispatchToProps = {
  setDragSource,
  setDropTarget,
}

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContext)