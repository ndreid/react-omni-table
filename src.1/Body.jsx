import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import DataTypes from './DataTypes'
import { Row } from './'

import { connect } from 'react-redux'
import { setScrollLeft, setScrollbarYVisibility, setDragSource, setDropTarget, setDragDirection } from './redux/actions'

class Body extends PureComponent {
  constructor(props) {
    super(props)

    this.handleScroll = this.handleScroll.bind(this)
    this.handleShowHideToggle = this.handleShowHideToggle.bind(this)
    this.handleDragStart = this.handleDragStart.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)

    let flatData = this.flattenData(this.props.data)
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
      flatData,
      orderedData: [...flatData]
    }

    this.scrollTop = 0
    this.prevY = 0
  }

  handleScroll(e) {
    this.props.setScrollLeft(e.target.scrollLeft)

    if (e.target.scrollTop !== this.scrollTop) {
      this.scrollTop = e.target.scrollTop
      this.calcWindowRange()
    }

    if (this.props.scrollbarYIsVisible !== (this.refs.body.scrollHeight > this.refs.body.clientHeight)) {
      this.props.setScrollbarYVisibility(!this.props.scrollbarYIsVisible)
    }
  }

  calcWindowRange() {
    let expandedRows = this.expandedRows
    let expandedRowCountOffTop = Math.floor(this.refs.body.scrollTop / this.props.rowHeight)
    let rowCountInWindow = Math.ceil((this.refs.body.clientHeight || 1000) / this.props.rowHeight)

    let start = expandedRowCountOffTop
    let stop = expandedRowCountOffTop + rowCountInWindow
  
    if (this.props.dragSource) {
      // let dragIdx = [...expandedRows].findIndex(([idMap, _]) => idMap === this.props.dragSource.idMap)
      let dragIdx = expandedRows.findIndex(({info}) => info.idMap === this.props.dragSource.idMap)
      start = Math.min(start, dragIdx)
      stop = Math.max(stop, dragIdx)
    }
    
    start = Math.max(start - 2, 0)
    stop = Math.min(stop + 2, this.state.orderedData.length - 1) //this.state.rows.length - 1)

    if (this.state.windowRange.start !== start
      || this.state.windowRange.stop !== stop
      || this.state.scrollBuffer.top !== start * this.props.rowHeight
      || this.state.scrollBuffer.bottom !== (expandedRows.length - stop - 1) * this.props.rowHeight
    ) {
      this.setState({
        windowRange: { start, stop },
        scrollBuffer: {
          top: start * this.props.rowHeight,
          bottom: (expandedRows.length - stop - 1) * this.props.rowHeight
        }
      })
    }
  }

  flattenData(data, flatData = [], idMapPrefix = '', tier = 0) {
    for (let row of data) {
      let idMap = idMapPrefix + (idMapPrefix === '' ? '' : '-') + row.id
      flatData.push({ data: row, info: { idMap, tier } })

      if (Array.isArray(row.children)) {
        this.flattenData(row.children, flatData, idMap, tier + 1)
      }
    }
    return flatData
  }

  get expandedRows() {
    let expandedRows = []
    for (let data of this.state.orderedData) { //this.state.rows) {
      if (!this.state.collapsedIdMaps.some(collapsedIdMap => data.info.idMap.startsWith(`${collapsedIdMap}-`))) {
        expandedRows.push(data)
      }
    }
    return expandedRows
  }

  handleShowHideToggle(idMap) {
    let collapsedIdMaps = this.state.collapsedIdMaps.includes(idMap)
      ? this.state.collapsedIdMaps.filter(map => map !== idMap)
      : [...this.state.collapsedIdMaps, idMap]
    
    this.setState({ collapsedIdMaps }, this.calcWindowRange)
  }

  dragReorder(srcIdMap, tgtIdMap) {
    let orderedData = [...this.state.orderedData]
    let srcIdx = orderedData.findIndex(({info}) => info.idMap === srcIdMap)
    let tgtIdx = orderedData.findIndex(({info}) => info.idMap === tgtIdMap)
    if (isNaN(srcIdx) || isNaN(tgtIdx)) return
    orderedData.splice(tgtIdx, 0, orderedData.splice(srcIdx, 1)[0])
    this.setState({ orderedData })
  }

  handleDragStart(idMap) {
    this.props.setDragSource(this.props.tableId, idMap)
  }

  handleMouseEnter(e, idMap) {
    let direction = e.movementY < 0 ? 'up' : 'down'
    if (this.props.dragSource
      && this.props.dragSource.idMap !== idMap
      && (
        !this.props.dropTarget
        || this.props.dropTarget.tableId !== this.props.tableId
        || this.props.dropTarget.idMap !== idMap
        || this.props.dragDirection !== direction
      )
    ) {
      this.props.setDropTarget(this.props.tableId, idMap)
      this.props.setDragDirection(direction)
      this.dragReorder(this.props.dragSource.idMap, idMap)
    }
  }

  componentDidMount() {
    this.calcWindowRange()

    let _this = this
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        if (_this.props.scrollbarYIsVisible !== (_this.refs.body.scrollHeight > _this.refs.body.clientHeight)) {
          _this.props.setScrollbarYVisibility(!_this.props.scrollbarYIsVisible)
        }
      })
    }, 0)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      let flatData = this.flattenData(this.props.data)
      this.setState({ flatData, orderedData: [...flatData] })
      this.calcWindowRange()
    } else if (prevProps.columnSorts !== this.props.columnSorts) {
      let data = [...this.props.data]
      for (let sortedColumn of this.props.columnSorts) {
        let dataType = this.props.columns.find(c => c.dataIndex === sortedColumn.name).dataType
        data.sort((dataA, dataB) => {
          let aVal = dataA[sortedColumn.name], bVal = dataB[sortedColumn.name]
          let a, b
          let r = 0
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
      let flatData = this.flattenData(data)
      this.setState({ flatData, orderedData: [...flatData] })
    }
  }

  render() {
    let classes = `t-body${this.props.dragSource ? ' t-dragging' : ''}`
    return (             
      <div ref='body' className={classes} onScroll={this.handleScroll} >
        <div key={-1} id='start' style={{minHeight: this.state.scrollBuffer.top}}/>
        {this.expandedRows.slice(this.state.windowRange.start, this.state.windowRange.stop + 1).map(({ data, info }) => {
          let colorStyle = this.props.settings.tierColors[info.tier % this.props.settings.tierColors.length]
          return <Row key={info.idMap}
            id={data.id}
            idMap={info.idMap}
            data={data}
            columns={this.props.columns}
            fixedWidthsStr={this.props.fixedWidthsStr}
            tier={info.tier}
            scrollbarYIsVisible={this.props.scrollbarYIsvisible}
            settings={this.props.settings}
            colorStyle={colorStyle}
            onCellInput={this.props.onCellInput}
            handleShowHideToggle={this.handleShowHideToggle}
            onDragStart={this.handleDragStart}
            onMouseEnter={this.handleMouseEnter}
          />
        })}
        <div key={Infinity} id='end' style={{minHeight: this.state.scrollBuffer.bottom}}/>
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
  columnSorts: PropTypes.array.isRequired,
  fixedWidthsStr: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  scrollbarYIsVisible: state.scrollbarYIsVisible,
  dragSource: state.dragSource,
  dropTarget: state.dropTarget,
  dragDirection: state.dragDirection,
})

const mapDispatchToProps = {
  setScrollLeft,
  setScrollbarYVisibility,
  setDragSource,
  setDropTarget,
  setDragDirection,
}

export default connect(mapStateToProps, mapDispatchToProps)(Body)