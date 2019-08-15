import React, { Component } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import Cell from './Cell'
import { PlusSVG, MinusSVG } from './SVG'
import gripImg from '../img_grip.png'
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu'

const defaultSettings = {
  draggable: true,
}

class Row extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hideChildren: false,
      origPos: {},
      translate: {},
    }

    this.showHideToggle = this.showHideToggle.bind(this)
    this.onCellInput = this.onCellInput.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
  }

  get rowSettings() { return this.get_rowSettings(this.props.data.settings) }
  get_rowSettings = memoize(settings => {
    return {
      ...defaultSettings,
      ...(settings || {})
    }
  })
  
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
    e.stopPropagation()
    e.preventDefault()
    this.props.onDragStart(e, this.props.idMap)
  }

  onMouseEnter(e) {
    this.props.onMouseEnter(e, this.props.idMap)
  }

  render() {
    let dragClass =
      this.props.dragSource
      ? this.props.dragSource.idMap === this.props.idMap 
        ? ' t-dragging' : ''
      : this.props.settings.dragEnabled
        ? ' t-draggable' : ''

    let style = {
      ...(this.props.dragSource && this.props.idMap === this.props.dragSource.idMap
          ? this.props.settings.hoverColors
          : this.props.settings.tierColors[this.props.tier % this.props.settings.tierColors.length]
        ),
      minHeight: this.props.rowHeight,
      pointerEvents: this.props.dragSource && this.props.dragSource.idMap === this.props.idMap ? 'none' : undefined,
      zIndex: this.props.dragSource && this.props.dragSource.idMap === this.props.idMap ? 9999 : undefined,
      ...this.props.style
    }
    
    let contextMenuOptions = this.rowSettings.contextMenuOptions || (this.props.settings.tierContextMenuOptions.length >= this.props.tier ? this.props.settings.tierContextMenuOptions[this.props.tier] : undefined)
    
    return (
      <React.Fragment>
        <ContextMenuTrigger id={this.props.idMap}>    
          <div ref='self' id={this.props.idMap} className={'t-row'} style={style} onMouseEnter={this.onMouseEnter}>
            {
              this.props.settings.dragEnabled && this.rowSettings.draggable
                ? <img className={'t-drag-gutter' + dragClass} src={gripImg} draggable onDragStart={this.onDragStart}/>
                : <div className='t-drag-gutter-space'/>
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
                      >
                        {idx === 0
                          ? this.props.data.children
                            ? this.state.hideChildren || this.props.isDragging
                              ? <div className={'t-expand-button t-cell'} onClick={this.showHideToggle}><PlusSVG width={'1em'} height={'1em'} stroke={style.color}/></div>
                              : <div className={'t-expand-button t-cell'} onClick={this.showHideToggle}><MinusSVG width={'1em'} height={'1em'} stroke={style.color}/></div>
                            : <div className={'t-cell t-expand-space'}/>
                          : undefined
                        }
                      </Cell>
            }
            )}
          </div>
        </ContextMenuTrigger>
        {
          contextMenuOptions
            ? <ContextMenu id={this.props.idMap}>
                {contextMenuOptions.map(o => 
                  <MenuItem key={this.props.idMap + o} data={{idMap: this.props.idMap, action: o}} onClick={this.props.onContextMenuClick}>
                    {o}
                  </MenuItem>
                )}
              </ContextMenu>
            : undefined
        }
      </React.Fragment>
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
  isDragging: PropTypes.bool.isRequired,
  onCellInput: PropTypes.func,
  onContextMenuClick: PropTypes.func,
  settings: PropTypes.object.isRequired,
  handleHideChildren: PropTypes.func,
  onDragStart: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
}

export default Row