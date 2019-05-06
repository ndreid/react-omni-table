import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { UpSVG, DownSVG } from './SVG'

class Head extends Component {
  constructor() {
    super()
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.props.onClick(this.props.column.dataIndex)
  }

  render() {
    const align = this.props.column.style ? this.props.column.style.align : undefined
    const style = {
      width: this.props.width,
      minWidth: this.props.column.style ? this.props.column.style.minWidth : undefined,
      justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
    }

    console.log(style)
    return (
      <div ref='head' className='t-head' style={style} onClick={this.onClick} style={style}>
        <b>{this.props.column.name}</b>
        { this.props.columnSort
          ? this.props.columnSort.sortOrder === 'asc'
            ? <UpSVG width={7} height={5} color='green'/>
            : <DownSVG width={7} height={5} color='red'/>
          : undefined
        }
      </div>
    )
  }
}

Head.propTypes = {
  colNum: PropTypes.number.isRequired,
  column: PropTypes.object.isRequired,
  columnSort: PropTypes.object,
  width: PropTypes.number,
  onClick: PropTypes.func.isRequired,
}

export default Head