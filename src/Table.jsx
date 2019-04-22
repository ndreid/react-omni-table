import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './Table.css'
import Header from './Header'
import Body from './Body'

import { addTable, delTable } from './redux/actions'

const defaultSettings = {
  tierColors: [
    { color: 'black', backgroundColor: 'darkgray' },
    { color: 'black', backgroundColor: 'white' },
  ],
  hoverColors: { color: 'black', backgroundColor: '#efefef' },
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
    return (
        <div ref='table' className='t-table'>
          <Header columns={this.props.columns} sortedColumns={this.state.sortedColumns} settings={this.state.settings} onHeadClick={this.handleHeadClick}/>
          <Body columns={this.props.columns}
                data={this.props.data}
                onCellInput={this.props.onCellInput}
                rowHeight={this.props.rowHeight}
                tableId={this.props.tableId}
                settings={this.state.settings}
                sortedColumns={this.state.sortedColumns}
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