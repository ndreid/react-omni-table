import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './Table.css'
import Header from './Header'
import Body from './Body'
// import ResizeDetector from 'react-resize-detector'

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
      columns: props.columns,
      columnTotalFixedWidths: {},
      columnWidths: {},
    }

    this.makeStateColumns = this.makeStateColumns.bind(this)
    this.handleHeadClick = this.handleHeadClick.bind(this)
    this.handleColumnResize = this.handleColumnResize.bind(this)
  }

  makeStateColumns(propColumns) {
    let columns = JSON.parse(JSON.stringify(propColumns))
    let columnTotalFixedWidths = {
      cm: 0, mm: 0, in: 0, px: 0, pt: 0,
      pc: 0, em: 0, ex: 0, ch: 0, rem: 0,
      vw: 0, vh: 0, vmin: 0, vmax: 0
    }
    // let totalPct = 0
    // let columnsWithoutWidth = columns.reduce((cnt, col) => cnt + ((!col.style || col.style.width === undefined) ? 1 : 0), 0)
    // for (let col of columns) {
    //   if (col.style && col.style.width && typeof col.style.width.replace === 'function') {
    //     let splitIdx = col.style.width.replace(/\d/g, '|').lastIndexOf('|') + 1
    //     if (splitIdx > 0) {
    //       let value = col.style.width.substring(0, splitIdx)
    //       let unit = col.style.width.substring(splitIdx)
    //       if (isNaN(value))
    //         continue
    //       if (unit === '%')
    //         totalPct += Number(value)
    //       else if (columnTotalFixedWidths.hasOwnProperty(unit))
    //         columnTotalFixedWidths[unit] += Number(value)
    //     } 
    //   }
    // }

    // for (let col of columns) {
    //   if (!col.style)
    //     col.style = {}
    //   if (!col.style.width)
    //     col.style.width = `${(100 - totalPct) / columnsWithoutWidth}%`
    // }

    this.setState({ columns, columnTotalFixedWidths })
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

  handleColumnResize(columnName, width) {
    this.setState({ columnWidths: { ...this.state.columnWidths, [columnName]: width } })
  }

  componentDidMount() {
    this.makeStateColumns(this.props.columns)
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
      this.makeStateColumns(this.props.columns)
    }
  }

  render() {
    let style = { width: this.props.settings.tableWidth }
    return (
      <div ref='table' className='t-table' style={style}>
        <Header columns={this.state.columns}
                columnSorts={this.state.columnSorts}
                columnWidths={this.state.columnWidths}
                settings={this.state.settings}
                onHeadClick={this.handleHeadClick}
        />
        <Body tableId={this.props.tableId}
              columns={this.state.columns}
              data={this.props.data}
              rowHeight={this.props.rowHeight}
              tableId={this.props.tableId}
              settings={this.state.settings}
              columnSorts={this.state.columnSorts}
              onCellInput={this.props.onCellInput}
              onResize={this.handleColumnResize}
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