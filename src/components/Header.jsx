import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Head from './Head'

import { connect } from 'react-redux'

class Header extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.xScroll !== nextProps.xScroll) {
      ReactDOM.findDOMNode(this.refs.header).scrollLeft = nextProps.xScroll
    }

    return (
      this.props.columns !== nextProps.columns
      || this.props.columnSorts !== nextProps.columnSorts
      || this.props.columnWidths !== nextProps.columnWidths
      || this.props.yScrollVisible !== nextProps.yScrollVisible
    )
  }


  render() {
    return (
      <div ref='header' className='t-header-wrapper' style={this.props.settings.headerColors}>
        <div className='t-header'>
          <div className='t-expand-button t-head'></div>
          {this.props.columns.map((col, idx) => 
            <Head ref={this.props.columnRefs[col.dataIndex]} key={idx}
              colNum={idx}
              column={col}
              columnWidth={this.props.columnWidths[col.dataIndex]}
              columnSort={this.props.columnSorts.find(sc => sc.name === col.dataIndex)}
              onClick={this.props.onHeadClick}
            />
          )}
          {this.props.yScrollVisible ? <div style={{maxWidth: 17, minWidth: 17}}/> : undefined}
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  tableId: PropTypes.any.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  columnSorts: PropTypes.array.isRequired,
  onHeadClick: PropTypes.func.isRequired,
  columnRefs: PropTypes.object.isRequired,
  columnWidths: PropTypes.object.isRequired,
}

const mapStateToProps = (state, props) => ({
  xScroll: state.xScroll[props.tableId],
  yScrollVisible: state.yScrollVisible//[props.tableId],
})

export default connect(mapStateToProps)(Header)