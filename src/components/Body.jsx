import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import DataTypes from './DataTypes'
import Row from './Row'
import memoize from 'memoize-one'
import { _Array, _Number } from 'data-type-ext'

import { connect } from 'react-redux'
import { setXScroll, setYScrollVisible, setDragSource, setDropTarget, setIsEditingCell } from '../redux/actions'

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
      xScrollVisible: false,
    }

    this.scrollTop = 0
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

  get expandedRows() {
    let expandedRows = []
    for (let data of this.sortedData) {
      // Ignore if parent row is collapsed or being dragged
      if (!this.state.collapsedIdMaps.some(collapsedIdMap => data.info.idMap.startsWith(collapsedIdMap + '|'))
        && !(this.props.dragSource && data.info.idMap.startsWith(this.props.dragSource.idMap + '|'))
      ) {
        expandedRows.push(data)
      }
    }
    return expandedRows
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

    if (this.props.dragSource && this.props.dragSource.tableId === this.props.tableId) {
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

  handleShowHideToggle(idMap) {
    let collapsedIdMaps = this.state.collapsedIdMaps.includes(idMap)
      ? this.state.collapsedIdMaps.filter(map => map !== idMap)
      : [...this.state.collapsedIdMaps, idMap]
    
    this.setState({ collapsedIdMaps })
  }

  handleScroll(e) {
    this.props.setXScroll(this.props.tableId, e.target.scrollLeft)

    let needsUpdate = false
    if (e.target.scrollTop !== this.scrollTop) {
      this.scrollTop = e.target.scrollTop
      needsUpdate = true
    }

    if (this.props.yScrollVisible !== (this.self.current.scrollHeight > this.self.current.clientHeight)) {
      this.props.setYScrollVisible(this.props.tableId, !this.props.yScrollVisible)
      needsUpdate = false
    }
    if (this.state.xScrollVisible !== (this.self.current.scrollWidth > this.self.current.clientWidth)) {
      this.setState({ xScrollVisible: !this.state.xScrollVisible })
      needsUpdate = false
    }
    if (needsUpdate)
      this.forceUpdate()
  }

  handleDragStart(e, idMap) {
    let data = this.sortedData.filter(({info}) => info.idMap === idMap || info.idMap.startsWith(idMap + '|'))
    let box = ReactDOM.findDOMNode(this.refs[idMap]).getBoundingClientRect()
    this.isFirstDragRender = true
    this.props.setDragSource(this.props.tableId, idMap, { x: box.x, y: box.y }, { x: e.pageX - box.x, y: e.pageY - box.y })
  }

  handleMouseRowEnter(e, idMap) {
    if (!this.props.dragSource || this.props.dragSource.idMap === idMap)
      return

    let direction = e.movementY < 0
        || this.props.dropTarget && this.props.dropTarget.tableId !== this.props.tableId
        || !this.props.dropTarget && this.props.dragSource.tableId !== this.props.tableId 
      ? 'up'
      : 'down'

    let srcIdx = this.expandedRows.findIndex(({info}) => info.idMap === this.props.dragSource.idMap)
    let tgtIdx = this.expandedRows.findIndex(({info}) => info.idMap === idMap)
    if (direction === 'up') {
      tgtIdx = tgtIdx === 0 ? undefined : tgtIdx - 1
    }
    if (srcIdx === tgtIdx)
      tgtIdx--

    if (this.props.dragSource.tableId === this.props.tableId) {
      if (!isNaN(srcIdx) && !isNaN(tgtIdx) && srcIdx === tgtIdx + 1) {
        this.props.setDropTarget()
        return
      }
    }
 
    let tgtIdMap = isNaN(tgtIdx) ? undefined : this.expandedRows[tgtIdx].info.idMap

    if (!this.props.dropTarget
      || this.props.dropTarget.idMap !== tgtIdMap
    ) {
      this.props.setDropTarget(this.props.tableId, tgtIdMap)
    }
  }

  componentDidMount() {
    let _this = this
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        if (_this.props.yScrollVisible !== (_this.self.current.scrollHeight > _this.self.current.clientHeight))
          _this.props.setYScrollVisible(this.props.tableId, !_this.props.yScrollVisible)
        if (_this.state.xScrollVisible !== (_this.self.current.scrollWidth > _this.self.current.clientWidth))
          _this.setState({ xScrollVisible: !_this.state.xScrollVisible })
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
        tgtIdx = this.props.dropTarget.tableId === this.props.tableId ? rows.findIndex(({info}) => info.idMap === this.props.dropTarget.idMap) : undefined
        
        let dragType = this.props.dragSource.tableId === this.props.tableId && this.props.dropTarget.tableId === this.props.tableId ? 'internal-drag'
          : this.props.dragSource.tableId === this.props.tableId && this.props.dropTarget.tableId !== this.props.tableId ? 'cross-drag-out'
          : this.props.dragSource.tableId !== this.props.tableID && this.props.dropTarget.tableId === this.props.tableId ? 'cross-drag-in'
          : 'none'
        switch (dragType) {
          case 'internal-drag':

          break
          case 'cross-drag-out':
            tgtIdx = rows.length - 1
          break
          case 'cross-drag-in':
            srcIdx = -1
          break
        }
      }
    }

    let style = {
      '--hover-color': this.props.settings.hoverColors.color,
      '--hover-background': this.props.settings.hoverColors.backgroundColor,
      height: (
          (this.expandedRows.length * this.props.rowHeight + this.expandedRows.length)
          || (this.props.rowHeight + 1)
        )
        + (this.state.xScrollVisible ? 17 : 0)
        + (this.props.dragSource && this.props.dropTarget
            && this.props.dragSource.tableId !== this.props.tableId
            && this.props.dropTarget.tableId === this.props.tableId
          ? this.props.rowHeight + 1
          : 0
          )
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
          {rows.length > 0
            ? rows.map(({ data, info }, index) => {
              let rowStyle = {}
              if (!isNaN(srcIdx)) {
                let translateY = 0
                if (index > srcIdx)
                  translateY += this.props.rowHeight
                if (!isNaN(tgtIdx) && _Number.isBetween(index, srcIdx, tgtIdx, srcIdx < tgtIdx))
                  translateY += (this.props.rowHeight) * (srcIdx > tgtIdx ? 1 : -1)
                if (translateY !== 0)
                  translateY = Math.abs(translateY) + 1 * Math.sign(translateY)
                if (this.props.dragSource.idMap === info.idMap) {
                  rowStyle.position = 'fixed'
                  rowStyle.maxWidth = this.self.current.clientWidth
                  rowStyle.minWidth = 0
                  rowStyle.overflow = 'hidden'
                  rowStyle.top = this.props.dragSource.pos.y
                  rowStyle.left = this.props.dragSource.pos.x
                }
                rowStyle.transform = `translate(0px, ${translateY}px)`
                rowStyle.transition = 'transform ' + (firstDragRender ? '0ms' : '500ms')
              }

              return <Row key={info.idMap}
                ref={info.idMap}
                id={data.id}
                idMap={info.idMap}
                tier={info.tier}
                data={data}
                style={rowStyle}
                isDragging={!!this.props.dragSource && this.props.dragSource.idMap === info.idMap}
                {...rowProps}
              />
            })
            : <div onMouseEnter={e => this.handleMouseRowEnter(e, undefined)} style={{ height: this.props.rowHeight }}></div>
          }
          <div key={Infinity} className='t-body-buffer' style={{minHeight: !isNaN(tgtIdx) && this.props.dropTarget.tableId === this.props.tableId && tgtIdx === rows.length - 1 ? this.props.rowHeight : windowParams.scrollBuffer.bottom}}/>
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

const mapStateToProps = (state, props) => ({
  yScrollVisible: state.yScrollVisible[props.tableId],
  dragSource: state.dragSource,
  dropTarget: state.dropTarget,
  isEditingCell: state.isEditingCell,
})

const mapDispatchToProps = {
  setXScroll,
  setYScrollVisible,
  setDragSource,
  setDropTarget,
  setIsEditingCell,
}

export default connect(mapStateToProps, mapDispatchToProps)(Body)