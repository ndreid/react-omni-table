import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './Table.css'
import Header from './Header'
import Body from './Body'

import { addTable, delTable } from './redux/actions'

const defaultSettings = {
  tierColors: [
    { color: 'black', backgroundColor: 'white' },
  ],
  hoverColors: { color: 'black', backgroundColor: '#efefef' },
  dragEnabled: false,
}

class Table extends Component {
  constructor(props) {
    super(props)

    this.state = {
      settings: {
        ...defaultSettings,
        ...props.settings,
      },
      columnSorts: [],
    }

    this.handleHeadClick = this.handleHeadClick.bind(this)
    this.handleColumnResize = this.handleColumnResize.bind(this)

    this.columnRefs = props.columns.reduce((refs, col) => { refs[col.dataIndex] = React.createRef(); return refs },{})
  }

  handleHeadClick(columnName) {
    let columnSorts = [...this.state.columnSorts],
        index = columnSorts.findIndex(cs => cs.name === columnName),
        columnSort = columnSorts[index]

    if (!columnSort) {
      columnSorts.push({ name: columnName, sortOrder: 'asc' })
    } else if (columnSort.sortOrder === 'asc') {
      columnSorts[index] = { name: columnSort.name, sortOrder: 'desc' }
      columnSorts.splice(columnSorts.length, 0, columnSorts.splice(index, 1)[0])
    } else {
      columnSorts.splice(index, 1)
    }

    this.setState({ columnSorts })
  }

  componentDidMount() {
    this.props.addTable(this.props.tableId)
  }

  componentWillUnmount() {
    this.props.delTable(this.props.tableId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.settings != this.props.settings) {
      this.setState({ settings: { ...defaultSettings, ...this.props.settings } })
    }
    if (prevProps.columns != this.props.columns) {
      this.columnRefs = this.props.columns.reduce((refs, col) => { refs[col.dataIndex] = React.createRef(); return refs },{})
    }
  }

  handleColumnResize(dataIndex, width) {
    if (this.columnRefs[dataIndex] && this.columnRefs[dataIndex].current) {
      this.columnRefs[dataIndex].current.refs.head.style.width = width
    }
  }

  render() {
    let style = { width: this.props.settings.tableWidth }
    
    console.log(this.columnRefs)
    
    return (
        <div ref='table' className='t-table' style={style}>
          <Header columns={this.props.columns}
                  columnSorts={this.state.columnSorts}
                  settings={this.state.settings}
                  onHeadClick={this.handleHeadClick}
                  columnRefs={this.columnRefs}
          />
          <Body columns={this.props.columns}
                data={this.props.data}
                onCellInput={this.props.onCellInput}
                rowHeight={this.props.rowHeight}
                tableId={this.props.tableId}
                settings={this.state.settings}
                columnSorts={this.state.columnSorts}
                onColumnResize={this.handleColumnResize}
          />
        </div>
    )
  }
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  settings: PropTypes.object,
  onCellInput: PropTypes.func,
  tableId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  rowHeight: PropTypes.number.isRequired,
}

Table.defaultProps = {
  settings: {},
}

const mapDispatchToProps = {
  addTable,
  delTable,
}

export default connect(undefined, mapDispatchToProps)(Table)