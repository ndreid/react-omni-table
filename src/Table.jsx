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
      sortedColumns: []
    }

    this.handleHeadClick = this.handleHeadClick.bind(this)
  }

  handleHeadClick(columnName) {
    let sortedColumns = [...this.state.sortedColumns],
        index = sortedColumns.findIndex(cs => cs.name === columnName),
        columnSort = sortedColumns[index]

    if (!columnSort) {
      sortedColumns.push({ name: columnName, sortOrder: 'asc' })
    } else if (columnSort.sortOrder === 'asc') {
      sortedColumns[index] = { name: columnSort.name, sortOrder: 'desc' }
      sortedColumns.splice(sortedColumns.length, 0, sortedColumns.splice(index, 1)[0])
    } else {
      sortedColumns.splice(index, 1)
    }

    this.setState({ sortedColumns })
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
  }

  render() {
    let style = { width: this.props.settings.tableWidth }
    let fixedWidths = { cm: 0, mm: 0, in: 0, px: 0, pt: 0, pc: 0, em: 0, ex: 0, ch: 0, rem: 0, vw: 0, vh: 0, vmin: 0, vmax: 0, }
    for (let col of this.props.columns) {
      if (col.style && col.style.width && typeof col.style.width.replace === 'function') {
        let splitIdx = col.style.width.replace(/\d/g, '|').lastIndexOf('|') + 1
        if (splitIdx > 0) {
          let value = col.style.width.substring(0, splitIdx)
          let unit = col.style.width.substring(splitIdx)
          if (!isNaN(value) && fixedWidths.hasOwnProperty(unit))
            fixedWidths[unit] = fixedWidths[unit] + Number(value)
        } 
      }
    }
    let fixedWidthsStr = Object.entries(fixedWidths).reduce((str, [unit, value]) => value > 0 ? `${str} - ${value}${unit}` : str, '')
    return (
        <div ref='table' className='t-table' style={style}>
          <Header columns={this.props.columns}
                  sortedColumns={this.state.sortedColumns}
                  settings={this.state.settings}
                  onHeadClick={this.handleHeadClick}
                  fixedWidthsStr={fixedWidthsStr}
          />
          <Body columns={this.props.columns}
                data={this.props.data}
                onCellInput={this.props.onCellInput}
                rowHeight={this.props.rowHeight}
                tableId={this.props.tableId}
                settings={this.state.settings}
                sortedColumns={this.state.sortedColumns}
                fixedWidthsStr={fixedWidthsStr}
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