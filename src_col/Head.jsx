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
    const width = this.props.columnWidth
    // const width = this.props.column.style ? this.props.column.style.width : undefined
      // ? String(this.props.column.style.width).includes('%')
      //   ? `calc((100% - ${this.props.scrollbarYIsVisible ? '42' : '25'}px${this.props.fixedWidthsStr}) * ${parseFloat(this.props.column.style.width) / 100})`
      //   : this.props.column.style.width
      // : '13rem'
    const align = this.props.column.style ? this.props.column.style.align : undefined
    const style = {
      width: width,
      minWidth: width,
      maxWidth: width,
      textAlign: align,
    }

    return (
      <div ref='head' className='t-head' style={style} onClick={this.onClick} style={style}>
        {this.props.column.name}
        { this.props.columnSort
          ? this.props.columnSort.sortOrder === 'asc'
            ? <UpSVG width={7} height={5} color='green'/>
            : <DownSVG width={7} height={5} color='red'/>
            // <div style={{ position: 'relative', display: 'inline', bottom: '0', left: '0' }}>
            //   {this.props.columnSort.sortOrder}
            // </div>
          : undefined
        }
      </div>
    )
  }
}

Head.propTypes = {
  column: PropTypes.object.isRequired,
  colNum: PropTypes.number.isRequired,
  columnSort: PropTypes.object,
  columnWidth: PropTypes.number,
  onClick: PropTypes.func.isRequired,
}

export default Head