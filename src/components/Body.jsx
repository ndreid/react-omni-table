import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import DataTypes from './DataTypes'
import Row from './Row'
import memoize from 'memoize-one'
import { _Array } from 'data-type-ext'

import { connect } from 'react-redux'
import { setScrollLeft, setScrollbarYVisibility, setDragSource, setDropTarget, setDragDirection, setIsEditingCell } from '../redux/actions'

class Body extends PureComponent {
  constructor(props) {
    super(props)

    this.handleScroll = this.handleScroll.bind(this)
    this.handleShowHideToggle = this.handleShowHideToggle.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleMouseRowEnter = this.handleMouseRowEnter.bind(this)

    this.state = {
      windowRange: {
        start: -1,
        stop: -1,
      },
      collapsedIdMaps: [],
      scrollBuffer: {
        top: 0,
        bottom: 0
      },
      rowBoxes: {},
    }

    this.scrollTop = 0
    this.prevY = 0

    this.self = React.createRef()
  }

  get sortedData() { return this.get_sortedData(this.props.data, this.props.columns, this.props.columnSorts) }
  get_sortedData = memoize((data, columns, columnSorts) => {
    let sortedData = [...data]
    for (let sortedColumn of columnSorts) {
      let dataType = columns.find(c => c.dataIndex === sortedColumn.name).dataType
      sortedData.sort((dataA, dataB) => {
        let aVal = dataA[sortedColumn.name], bVal = dataB[sortedColumn.name]
        let a, b
        switch (dataType) {
          case DataTypes.Date:
            let aDate = new Date(aVal), bDate = new Date(bVal)
            a = isNaN(aDate) ? undefined : aDate
            b = isNaN(bDate) ? undefined : bDate
            break
          case DataTypes.String:
            a = typeof aVal === 'string' ? aVal.toUpperCase() : ''
            b = typeof bVal === 'string' ? bVal.toUpperCase() : ''
            break
          case DataTypes.Number:
          case DataTypes.Int:
          case DataTypes.Bool:
            a = aVal
            b = bVal
            break
        }
        return (!a-!b || +(a>b) || -(a<b)) * (sortedColumn.sortOrder === 'asc' ? 1 : -1)
      })
    }
    return this.flattenData_R(sortedData)
  })

  flattenData_R(data, flatData = [], idMapPrefix = String(this.props.tableId), tier = 0) {
    for (let row of data) {
      let idMap = idMapPrefix + '|' + row.id
      flatData.push({ data: row, info: { idMap, tier } })
  
      if (Array.isArray(row.children)) {
        this.flattenData_R(row.children, flatData, idMap, tier + 1)
      }
    }
    return flatData
  }

  handleScroll(e) {
    this.props.setScrollLeft(e.target.scrollLeft)

    let needsUpdate = false
    if (e.target.scrollTop !== this.scrollTop) {
      this.scrollTop = e.target.scrollTop
      needsUpdate = true
    }

    if (this.props.scrollbarYIsVisible !== (this.self.current.scrollHeight > this.self.current.clientHeight)) {
      this.props.setScrollbarYVisibility(!this.props.scrollbarYIsVisible)
    } else if (needsUpdate) {
      this.forceUpdate()
    }
  }

  getWindowParams() {
    if (!this.self.current)
      return {
        windowRange: { start: -1, stop: -1 },
        scrollBuffer: { top: 0, bottom: 0 }
      }

    let expandedRows = this.expandedRows
    let expandedRowCountOffTop = Math.floor(this.self.current.scrollTop / this.props.rowHeight)
    let rowCountInWindow = Math.ceil((this.self.current.clientHeight || 1000) / this.props.rowHeight)

    let start = expandedRowCountOffTop
    let stop = expandedRowCountOffTop + rowCountInWindow
    
    start = Math.max(start - 2, 0)
    stop = Math.min(stop + 2, this.sortedData.length - 1)
    let top = start * this.props.rowHeight
    let bottom = (expandedRows.length - stop - 1) * this.props.rowHeight

    if (this.props.dragSource) {
      let dragIdx = expandedRows.findIndex(({info}) => info.idMap === this.props.dragSource.idMap)
      if (dragIdx < start)
        top -= this.props.rowHeight
      if (dragIdx > stop)
        bottom -= this.props.rowHeight
    }

    return {
      windowRange: { start, stop },
      scrollBuffer: { top, bottom },
    }
  }

  get expandedRows() {
    let expandedRows = []
    let isDragging = this.props.dragSource
    let isCrossTableDrag = this.props.dragSource && this.props.dragSource.tableId !== this.props.tableId
    for (let data of this.sortedData) {
      /* 
       * If parent row is not collapsed
       * And row is not dragging outside table
       * And parent row is not dragging outside table
      */
      if (!this.state.collapsedIdMaps.some(collapsedIdMap => data.info.idMap.startsWith(collapsedIdMap + '|'))
        && !(isDragging && isCrossTableDrag
          && (
            this.props.dragSource.idMap === data.info.idMap
            || data.info.idMap.startsWith(`${this.props.dragSource.idMap}-`))
          )
      ) {
        expandedRows.push(data)
      }
    }
    return expandedRows
  }

  handleShowHideToggle(idMap) {
    let collapsedIdMaps = this.state.collapsedIdMaps.includes(idMap)
      ? this.state.collapsedIdMaps.filter(map => map !== idMap)
      : [...this.state.collapsedIdMaps, idMap]
    
    this.setState({ collapsedIdMaps })
  }

  handleDragStart(e, idMap) {
    let data = this.sortedData.filter(({info}) => info.idMap === idMap || info.idMap.startsWith(idMap + '|'))
    let box = ReactDOM.findDOMNode(this.refs[idMap]).getBoundingClientRect()
    this.isFirstDragRender = true
    this.props.setDragSource(this.props.tableId, idMap, data, { x: box.x, y: box.y }, { x: e.pageX - box.x, y: e.pageY - box.y })
  }

  handleMouseRowEnter(e, idMap) {
    if (!this.props.dragSource || this.props.dragSource.idMap === idMap)
      return

    let direction = e.movementY < 0 ? 'up' : 'down'

    if (this.props.dragSource.tableId === this.props.tableId) {
      let srcIdx = this.expandedRows.findIndex(({info}) => info.idMap === this.props.dragSource.idMap)
      let tgtIdx = this.expandedRows.findIndex(({info}) => info.idMap === idMap)
      if (!isNaN(srcIdx) && !isNaN(tgtIdx) && srcIdx === tgtIdx + (direction === 'up' ? -1 : 1)) {
        this.props.setDropTarget()
        this.props.setDragDirection()
        return
      }
    }

    if (!this.props.dropTarget
      || this.props.dropTarget.idMap !== idMap
      || this.props.dragDirection !== direction
    ) {
      this.props.setDropTarget(this.props.tableId, idMap)
      this.props.setDragDirection(direction)
    }
  }

  componentDidMount() {
    let _this = this
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        if (_this.props.scrollbarYIsVisible !== (_this.self.current.scrollHeight > _this.self.current.clientHeight)) {
          _this.props.setScrollbarYVisibility(!_this.props.scrollbarYIsVisible)
        }
      })
    }, 0)
  }


  isFirstDragRender = false
  render() {
    let firstDragRender = this.isFirstDragRender
    this.isFirstDragRender = false
    let classes = `t-body${this.props.dragSource ? ' t-dragging' : ''}`

    let windowParams = this.getWindowParams()
    let rows = this.expandedRows.filter(({info}, index) =>
      windowParams.windowRange.start <= index && index <= windowParams.windowRange.stop + 1
      || this.props.dragSource && this.props.dragSource.idMap === info.idMap
    )
    let srcIdx, tgtIdx
    if (this.props.dragSource) {
      srcIdx = this.props.dragSource.tableId === this.props.tableId ? rows.findIndex(({info}) => info.idMap === this.props.dragSource.idMap) : undefined

      if (this.props.dropTarget) {
        // let srcLastIdx = this.props.dragSource.tableId === this.props.tableId ? _Array.findLastIndex(rows, ({info}) => info.idMap.startsWith(this.props.dragSource.idMap + '-')) : undefined
        tgtIdx = this.props.dropTarget.tableId === this.props.tableId ? rows.findIndex(({info}) => info.idMap === this.props.dropTarget.idMap) : undefined
        // let tgtNextIsFamily = tgtIdx > 0 && rows[tgtIdx + 1] && rows[tgtIdx + 1].info.idMap.startsWith(this.props.dropTarget.idMap + '|')
        // if (tgtNextIsFamily){
        //   for (let i = srcIdx; i <= srcLastIdx; i++) {
        //     rows[i].info.tier = rows[tgtIdx].info.tier + 1 + (rows[i].info.tier - rows[srcIdx].info.tier)
        //   }
        // }
        // if (srcLastIdx === -1)
        //   srcLastIdx = srcIdx
        // let srcRowCount = srcLastIdx - srcIdx + 1

        
        let dragType = this.props.dragSource.tableId === this.props.tableId && this.props.dropTarget.tableId === this.props.tableId ? 'internal-drag'
          : this.props.dragSource.tableId === this.props.tableId && this.props.dropTarget.tableId !== this.props.tableId ? 'cross-drag-out'
          : this.props.dragSource.tableId !== this.props.tableID && this.props.dropTarget.tableId === this.props.tableId ? 'cross-drag-in'
          : 'none'
        switch (dragType) {
          case 'internal-drag':
            if (tgtIdx > srcIdx && this.props.dragDirection === 'up')
              tgtIdx--
            if (tgtIdx < srcIdx && this.props.dragDirection === 'down')
              tgtIdx++
          break
          case 'cross-drag-out':
            tgtIdx = rows.length - 1
          break
          case 'cross-drag-in':
            srcIdx = 0
          break
        }
      }
    }

    let style = {
      '--hover-color': this.props.settings.hoverColors.color,
      '--hover-background': this.props.settings.hoverColors.backgroundColor,
      minHeight: rows.length === 0 ? this.props.rowHeight : undefined,
    }

    let rowProps = {
      rowHeight: this.props.rowHeight,
      columns: this.props.columns,
      columnWidths: this.props.columnWidths,
      settings: this.props.settings,
      dragSource: this.props.dragSource,
      isEditingCell: this.props.isEditingCell,
      setIsEditingCell: this.props.setIsEditingCell,
      onCellInput: this.props.onCellInput,
      handleShowHideToggle: this.handleShowHideToggle,
      onDragStart: this.handleDragStart,
      onMouseEnter: this.handleMouseRowEnter,
    }

    return (             
      <div ref={this.self} className={classes} onScroll={this.handleScroll} style={style}>
          <div key={-1} className='t-body-buffer' style={{minHeight: windowParams.scrollBuffer.top}}/>
          {rows.map(({ data, info }, index) => {
            let style = {}
            if (!isNaN(srcIdx)) {
              let translateY = 0
              if (index >= srcIdx)
                translateY += this.props.rowHeight
              if (!isNaN(tgtIdx) && (index - srcIdx) * (index - tgtIdx) <= 0)
                translateY += (this.props.rowHeight) * (srcIdx > tgtIdx ? 1 : -1)
              if (translateY !== 0)
                translateY = Math.abs(translateY) + 1 * Math.sign(translateY)
              if (this.props.dragSource.idMap === info.idMap) {
                style.position = 'fixed'
                style.maxWidth = this.self.current.clientWidth
                style.minWidth = 0
                style.overflow = 'hidden'
                style.top = this.props.dragSource.pos.y
                style.left = this.props.dragSource.pos.x
              }
              style.transform = `translate(0px, ${translateY}px)`
              style.transition = 'transform ' + (firstDragRender ? '0ms' : '500ms')
            }

            return <Row key={info.idMap}
              ref={info.idMap}
              id={data.id}
              idMap={info.idMap}
              tier={info.tier}
              data={data}
              hidden={this.props.dragSource && this.props.dragSource.idMap === info.idMap}
              style={style}
              {...rowProps}
            />
          })}
          <div key={Infinity} className='t-body-buffer' style={{minHeight: !isNaN(tgtIdx) && tgtIdx === rows.length - 1 ? this.props.rowHeight : windowParams.scrollBuffer.bottom}}/>
      </div>
    )
  }
}

Body.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCellInput: PropTypes.func,
  rowHeight: PropTypes.number.isRequired,
  settings: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  columnSorts: PropTypes.array.isRequired,
  columnWidths: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  scrollbarYIsVisible: state.scrollbarYIsVisible,
  dragSource: state.dragSource,
  dropTarget: state.dropTarget,
  dragDirection: state.dragDirection,
  isEditingCell: state.isEditingCell,
})

const mapDispatchToProps = {
  setScrollLeft,
  setScrollbarYVisibility,
  setDragSource,
  setDropTarget,
  setDragDirection,
  setIsEditingCell,
}

export default connect(mapStateToProps, mapDispatchToProps)(Body)