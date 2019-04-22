import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Head extends Component {
  constructor() {
    super()
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.props.onClick(this.props.column.dataIndex)
  }

  render() {
    const style = {
      width: this.props.column.style ? this.props.column.style.width : undefined,
      minWidth: this.props.column.style ? this.props.column.style.width : undefined,
      justifyContent: this.props.colNum !== 0 ? 'center' : undefined,
      textAlign: this.props.column.style ? this.props.column.style.align : undefined,
      paddingLeft: 8,
    }

    return (
      <div className='t-head' style={style} onClick={this.onClick}>
        <b>{this.props.column.name}</b>
        { this.props.columnSort
          ? <div style={{ position: 'absolute', bottom: '0', left: '0'}}>
              {this.props.columnSort.sortOrder}
            </div>
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
  onClick: PropTypes.func.isRequired,
}

export default Head