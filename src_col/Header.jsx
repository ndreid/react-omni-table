import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Head from './Head'

import { connect } from 'react-redux'

class Header extends Component {

  shouldComponentUpdate(nextProps) {
    if (this.props.scrollLeft !== nextProps.scrollLeft) {
      ReactDOM.findDOMNode(this.refs.header).scrollLeft = nextProps.scrollLeft
    }

    return (
      this.props.columns !== nextProps.columns
      || this.props.columnSorts !== nextProps.columnSorts
      || this.props.scrollbarYIsVisible !== nextProps.scrollbarYIsVisible
      || this.props.columnWidths !== nextProps.columnWidths
    )
  }

  render() {
    return (
      // <div ref='header' className='t-header-wrapper'>
        <div ref='header' className='t-header'>
          <div className='t-expand-button t-head'></div>
          {this.props.columns.map((col, idx) =>
              <Head key={idx}
                colNum={idx}
                column={col}
                onClick={this.props.onHeadClick}
                scrollbarYIsVisible={this.props.scrollbarYIsVisible}
                columnSort={this.props.columnSorts.find(sc => sc.name === col.dataIndex)}
                columnWidth={this.props.columnWidths[col.dataIndex]}
                parent={this.refs.header}
              />
          )}
          {this.props.scrollbarYIsVisible ? <div className='t-head' style={{width: 17}}/> : undefined}
        </div>
      // </div>
    )
  }
}

Header.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  scrollLeft: PropTypes.number,
  columnSorts: PropTypes.array.isRequired,
  columnWidths: PropTypes.object.isRequired,
  onHeadClick: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  scrollLeft: state.scrollLeft,
  scrollbarYIsVisible: state.scrollbarYIsVisible,
})

export default connect(mapStateToProps)(Header)