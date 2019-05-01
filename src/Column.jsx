import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Cell } from './'
import ResizeDetector from 'react-resize-detector'

class Column extends PureComponent {
  constructor() {
    super()
    this.onResize = this.onResize.bind(this)
  }

  onResize() {
    this.props.onResize(this.props.column.dataIndex, this.refs.column.clientWidth)
  }

  componentDidMount() {
    console.log(this.refs.column.clientWidth)
  }

  render() {
    return (
      <div ref='column' className='t-col'>
        {this.props.rowData.map(({data, info}, idx) => {
          let cellOverrideProps = data.cellOverrideProps ? data.cellOverrideProps[this.props.column.dataIndex] : undefined
          return <Cell key={idx}
                      primary={this.props.index === 0}
                      column={this.props.column}
                      tier={info.tier}
                      idMap={info.idMap}
                      data={data[this.props.column.dataIndex]}
                      overrideProps={cellOverrideProps}
                      onCellInput={this.props.onCellInput}
                      onDragStart={this.props.onDragStart}
                      onMouseEnter={this.props.onMouseEnter}
                      onMouseLeave={this.props.onMouseLeave}
                      setIsEditingCell={this.props.setIsEditingCell}
                  />
        })}
        <ResizeDetector handleWidth handleHeight onResize={this.onResize} />
      </div>
    )
  }
}

Column.propTypes = {
  //props
  index: PropTypes.number.isRequired,
  column: PropTypes.object.isRequired,
  rowData: PropTypes.array.isRequired,
  onCellInput: PropTypes.func,
  onDragStart: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  //redux
  setIsEditingCell: PropTypes.func.isRequired,
}

export default Column