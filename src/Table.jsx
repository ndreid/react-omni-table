import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './Table.css'
import Header from './Header'
import Body from './Body'

import { addTable, delTable } from './redux/actions'

class Table extends Component {
  getRowCount_R(rows, countObj) {
    countObj.value+= rows.length
    for (let child in rows) {
      if (child.children) {
        this.getRowCount_R(child.children, countObj)
      }
    }
    return countObj.value
  }

  componentDidMount() {
    this.props.addTable(this.props.tableId)
  }

  componentWillUnmount() {
    this.props.delTable(this.props.tableId)
  }

  render() {
    return (
        <div ref='table' className='t-table' >
          <Header columns={this.props.columns}/>
          <Body columns={this.props.columns}
                data={this.props.data}
                dragAndDropDisabled={this.props.settings.dragAndDropDisabled}
                onCellInput={this.props.onCellInput}
                rowHeight={this.props.rowHeight}
                tableId={this.props.tableId}
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