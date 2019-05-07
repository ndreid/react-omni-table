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
              onClick={this.props.onHeadClick}
              columnSort={this.props.columnSorts.find(sc => sc.name === col.dataIndex)}
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
  onHeadClick: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  scrollLeft: state.scrollLeft,
  scrollbarYIsVisible: state.scrollbarYIsVisible,
})

export default connect(mapStateToProps)(Header)