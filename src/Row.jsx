import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Cell from './Cell'
import { PlusSVG, MinusSVG } from './SVG'

import { connect } from 'react-redux'
import { setIsEditingCell } from './redux/actions'

class Row extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hideChildren: false,
      hovering: false,
    }

    this.showHideToggle = this.showHideToggle.bind(this)
    this.onCellInput = this.onCellInput.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)

    this.hoveredCells = []
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
        tier: this.props.tier,
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
    this.setState({ hovering: true })
  }

  onMouseLeave(e) {
    this.setState({ hovering: false })
  }

  render() {
    let dragClass =
      this.props.dragSource
      ? this.props.dragSource.idMap === this.props.idMap 
        ? ' t-dragging' : ''
      : this.props.settings.dragEnabled
        ? ' t-draggable' : ''

    let style = {
      ...(this.state.hovering
          ? this.props.settings.hoverColors
          : this.props.settings.tierColors[this.props.tier % this.props.settings.tierColors.length]
        ),
      minHeight: this.props.rowHeight,
    }
    return (
      <div className={`t-row${dragClass}`} style={style} onDragStart={this.onDragStart} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} draggable>
        {this.props.data.children
          ? this.state.hideChildren
            ? <div className={'t-expand-button t-cell'} onClick={this.showHideToggle}><PlusSVG width={15} height={15} stroke={style.color}/></div>
            : <div className={'t-expand-button t-cell'} onClick={this.showHideToggle}><MinusSVG width={15} height={15} stroke={style.color}/></div>
          : <div className={'t-cell t-expand-space'}/>
        }
        {this.props.columns.map((col, idx) => {
          let cellOverrideProps = Array.isArray(this.props.data.cellOverrideProps) ? this.props.data.cellOverrideProps.find(props => props.dataIndex === col.dataIndex) : undefined
          return <Cell key={idx}
                      primary={idx === 0}
                      tier={this.props.tier}
                      data={this.props.data[col.dataIndex]}
                      column={col}
                      columnWidth={this.props.columnWidths[col.dataIndex]}
                      overrideProps={cellOverrideProps}
                      onCellInput={this.onCellInput}
                      setIsEditingCell={this.props.setIsEditingCell}
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
  columnWidths: PropTypes.object.isRequired,
  id: PropTypes.any.isRequired,
  idMap: PropTypes.string.isRequired,
  tier: PropTypes.number.isRequired,
  setIsEditingCell: PropTypes.func.isRequired,
  isEditingCell: PropTypes.bool.isRequired,
  onCellInput: PropTypes.func,
  settings: PropTypes.object.isRequired,
  handleHideChildren: PropTypes.func,
  onDragStart: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onColumnResize: PropTypes.func,
}

const mapStateToProps = state => ({
  isEditingCell: state.isEditingCell,
  dragSource: state.dragSource,
})

const mapDispatchToProps = {
  setIsEditingCell,
}

export default connect(mapStateToProps, mapDispatchToProps)(Row)