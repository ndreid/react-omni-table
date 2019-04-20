import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Head extends Component {
  render() {
    const style = {
      width: this.props.column.style ? this.props.column.style.width : undefined,
      minWidth: this.props.column.style ? this.props.column.style.width : undefined,
      justifyContent: this.props.colNum !== 0 ? 'center' : undefined,
      textAlign: this.props.column.style ? this.props.column.style.align : undefined,
      paddingLeft: 8,
    }

    return (
      <div className='t-head' style={style}>
        <b>{this.props.column.name}</b>
      </div>
    )
  }
}

Head.propTypes = {
  column: PropTypes.object.isRequired,
  colNum: PropTypes.number.isRequired,
}

export default Head