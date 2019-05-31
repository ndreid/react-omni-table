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
    // let minWidth = `max(${[this.props.column.style ? this.props.column.style.minWidth : undefined, `${this.props.columnWidth}px`].filter(Boolean).join(',')})`
    const align = this.props.column.style ? this.props.column.style.align : undefined
    const style = {
      width: this.props.columnWidth,//`max(${[this.props.column.style ? this.props.column.style.minWidth : undefined, `${this.props.columnWidth}px`].filter(Boolean).join(',')})`,
      justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
      textAlign: align
    }

    return (
      <div ref='head' className='t-head' style={style} onClick={this.onClick} style={style}>
        <b>{this.props.column.name}</b>
        { this.props.columnSort ? <span style={{width:10}}/> : undefined}
        { this.props.columnSort
          ? this.props.columnSort.sortOrder === 'asc'
            ? <UpSVG width={10} height={8} color='green'/>
            : <DownSVG width={10} height={8} color='red'/>
          : undefined
        }
      </div>
    )
  }
}

Head.propTypes = {
  colNum: PropTypes.number.isRequired,
  column: PropTypes.object.isRequired,
  columnWidth: PropTypes.number.isRequired,
  columnSort: PropTypes.object,
  width: PropTypes.number,
  onClick: PropTypes.func.isRequired,
}

export default Head