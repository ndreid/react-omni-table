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
      || this.props.fixedWidthsStr !== nextProps.fixedWidthsStr
    )
  }

  render() {
    return (
      <div ref='header' className='t-header-wrapper'>
        <div className='t-header'>
          <div className='t-expand-button t-cell'></div>
          {this.props.columns.map((col, idx) =>
              <Head key={idx} colNum={idx} column={col} onClick={this.props.onHeadClick} scrollbarYIsVisible={this.props.scrollbarYIsVisible}
                columnSort={this.props.columnSorts.find(sc => sc.name === col.dataIndex)} parent={this.refs.header} fixedWidthsStr={this.props.fixedWidthsStr}
              />
          )}
          {this.props.scrollbarYIsVisible ? <div style={{maxWidth: 17, minWidth: 17}}/> : undefined}
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  scrollLeft: PropTypes.number,
  columnSorts: PropTypes.array.isRequired,
  fixedWidthsStr: PropTypes.string.isRequired,
  onHeadClick: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  scrollLeft: state.scrollLeft,
  scrollbarYIsVisible: state.scrollbarYIsVisible,
})

export default connect(mapStateToProps)(Header)