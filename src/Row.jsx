import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Cell from './Cell'
import { PlusSVG, MinusSVG } from './SVG'


import { connect } from 'react-redux'
import { setIsEditingCell } from './redux/actions'

class Row extends Component {
  constructor(props) {
    super(props)

    const defaultSettings = {
      draggable: true,
    }

    this.state = {
      hideChildren: false,
      settings: { ...defaultSettings, ...props.data.settings }
    }

    this.showHideToggle = this.showHideToggle.bind(this)
    this.onCellInput = this.onCellInput.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
  }
  
  showHideToggle() {
    this.setState({ hideChildren: !this.state.hideChildren })
    this.props.handleShowHideToggle(this.props.idMap)
  }

  onCellInput(inputObj) {
    if (typeof this.props.onCellInput === 'function') {
      this.props.onCellInput({
        id: this.props.id,
        idMap: this.props.idMap,
        lvl: this.props.lvl,
        ...inputObj
      })
    }

  }

  onDragStart(e) {
    e.preventDefault()
    this.props.onDragStart(this.props.idMap)
  }

  onMouseEnter(e) {
    this.props.onMouseEnter(e, this.props.idMap)
  }

  render() {
    let classes = `t-row${this.props.dragSource ? this.props.dragSource.idMap === this.props.idMap ? ' t-dragging' : '' : ' t-draggable'}`
    
    return (
      <div id={this.props.idMap} className={classes} style={this.props.style} draggable='true'
        onDragStart={this.onDragStart}
        onMouseEnter={this.onMouseEnter}
      >
        {this.props.data.children
          ? this.state.hideChildren
            ? <div className='t-cell t-expand-button' onClick={this.showHideToggle}><PlusSVG width={15} height={15} stroke={'black'}/></div>
            : <div className='t-cell t-expand-button' onClick={this.showHideToggle}><MinusSVG width={15} height={15} stroke={'black'}/></div>
          : <div className='t-cell t-expand-space'/>
        }
        {this.props.columns.map((col, idx) => {
          let cellOverrideProps = Array.isArray(this.props.data.cellOverrideProps) ? this.props.data.cellOverrideProps.find(props => props.dataIndex === col.dataIndex) : undefined
          return <Cell key={idx}
                      primary={idx === 0}
                      column={col}
                      lvl={this.props.lvl}
                      data={this.props.data[col.dataIndex]}
                      setIsEditingCell={this.props.setIsEditingCell}
                      overrideProps={cellOverrideProps}
                      onCellInput={this.onCellInput}
                  />
        }
        )}
      </div>
    )
  }
}

Row.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.any.isRequired,
  lvl: PropTypes.number.isRequired,
  idMap: PropTypes.string.isRequired,
  setIsEditingCell: PropTypes.func.isRequired,
  isEditingCell: PropTypes.bool.isRequired,
  onCellInput: PropTypes.func,
  settings: PropTypes.object,
  handleHideChildren: PropTypes.func,
  onDragStart: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  isEditingCell: state.isEditingCell,
  dragSource: state.dragSource,
})

const mapDispatchToProps = {
  setIsEditingCell,
}

export default connect(mapStateToProps, mapDispatchToProps)(Row)