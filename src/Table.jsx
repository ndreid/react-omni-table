import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './Table.css'
import Header from './Header'
import Body from './Body'
import CSSUnitTranslator from 'css-unit-translator'
import ResizeDetector from 'react-resize-detector'
import { debounce } from 'lodash'

import { addTable, delTable } from './redux/actions'

class Table extends Component {
  constructor(props) {
    super(props)

    let canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    let { fontSize, fontFamily } = window.getComputedStyle(canvas)
    document.body.removeChild(canvas)

    this.defaultSettings = {
      headerColors: { color: 'white', backgroundColor: '#707070' },
      tierColors: [
        { color: 'black', backgroundColor: '#dedede' },
        { color: 'black', backgroundColor: 'white'}
      ],
      hoverColors: { color: 'black', backgroundColor: '#cccccc' },
      dragEnabled: false,
      fontFamily: fontFamily.replace(new RegExp('"', 'g'), ''),
      fontSize,
      tableWidth: '100%',
    }

    let settings = {
      ...this.defaultSettings,
      ...props.settings
    }
 
    this.cssUnitTranslator = new CSSUnitTranslator(settings.fontSize, settings.fontFamily)

    this.state = {
      settings,
      columnSorts: [],
      columnWidths: {},
      rowHeight: this.cssUnitTranslator.translate(props.rowHeight, 'px', 0),
      mounted: false
    }
    
    let columnWidths = this.getColumnWidths_r(props.data)
    this.state.columnWidths = columnWidths

    this.handleHeadClick = this.handleHeadClick.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.handleResize_debounced = debounce(this.handleResize, 100)

    this.columnRefs = props.columns.reduce((refs, col) => { refs[col.dataIndex] = React.createRef(); return refs },{})
  }

  get columnWidths() {
    let widths = {}

    let context = document.createElement('canvas').getContext('2d')
    context.font = 'bold ' + this.state.settings.fontSize + ' ' + this.state.settings.fontFamily

    for (let col of this.props.columns) {
      let settingsWidth, contentWidth, titleWidth
      if (col.style && col.style.minWidth) {
        settingsWidth = isNaN(col.style.minWidth)
          ? +this.cssUnitTranslator.translate(col.style.minWidth, 'px', 2).replace('px', '')
          : +col.style.minWidth
      }

      contentWidth = this.state.columnWidths[col.dataIndex] + 16/*padding*/
      titleWidth = Math.ceil(context.measureText(col.name.split(' ').reduce((a, b) => a.length > b.length ? a : b)).width + 16/*padding*/)
      widths[col.dataIndex] = {
        actual: Math.max(settingsWidth || 0, contentWidth || 0, titleWidth || 0, 25),
        extra: Math.max(settingsWidth || 0, contentWidth || 0, titleWidth || 0, 25) - Math.max(contentWidth || 0, titleWidth || 0, 25)
      }
    }

    if (!this.state.mounted)
      return Object.entries(widths).map(([k,v]) => [k, v.actual]).reduce((obj, kvp) => { obj[kvp[0]] = kvp[1]; return obj }, {})

    let remainingWidth = this.refs.table.clientWidth - Object.values(widths).reduce((sum,w) => sum + w.actual, 0) - (this.props.scrollbarYIsVisible ? 17 : 0) - 25/*expand*/ - 2/*border*/
    if (remainingWidth <= 0)
      return Object.entries(widths).map(([k,v]) => [k, v.actual]).reduce((obj, kvp) => { obj[kvp[0]] = kvp[1]; return obj }, {})

    let widthsArray = Object.values(widths)
    for (let [_, extraWidth] of Object.entries(widths).sort(([, aWidth], [, bWidth]) => aWidth.extra - bWidth.extra)) {
      if (extraWidth.extra <= 0)
        continue
      let expandWidths = widthsArray.filter(w => w.extra <= 0)
      let extraWidths = widthsArray.filter(w => w.extra > 0)
      let expandPx = expandWidths.length * extraWidth.extra < remainingWidth ? extraWidth.extra : (remainingWidth / expandWidths.length)
      for (let w of expandWidths) {
        w.actual += expandPx
      }
      for (let w of extraWidths) {
        w.extra -= expandPx
      }

      remainingWidth -= expandPx * expandWidths.length
      if (Math.round(remainingWidth) <= 0)
        break
    }

    if (remainingWidth > 0) {
      for (let w of widthsArray) {
        w.actual += remainingWidth / widthsArray.length
      }
    }
    
    return Object.entries(widths).map(([k,v]) => [k, v.actual]).reduce((obj, kvp) => { obj[kvp[0]] = kvp[1]; return obj }, {})
  }

  getColumnWidths_r(rows, columnWidths = {}, context) {
    if (!context) {
      context = document.createElement('canvas').getContext('2d')
      context.font = this.state.settings.fontSize + ' ' + this.state.settings.fontFamily
    }
    for (let row of rows) {
      for (let col of this.props.columns) {
        let txt = row[col.dataIndex]
        if (txt === undefined || txt === null)
          continue
        let width = Math.ceil(context.measureText(txt).width)
        if (!columnWidths[col.dataIndex] || width > columnWidths[col.dataIndex])
          columnWidths[col.dataIndex] = width
      }
      if (Array.isArray(row.children))
        this.getColumnWidths_r(row.children, columnWidths, context)
    }
    return columnWidths
  }

  handleHeadClick(columnName) {
    let columnSorts = [...this.state.columnSorts],
        index = columnSorts.findIndex(cs => cs.name === columnName),
        columnSort = columnSorts[index]

    if (!columnSort) {
      columnSorts.push({ name: columnName, sortOrder: 'asc' })
    } else if (columnSort.sortOrder === 'asc') {
      columnSorts[index] = { name: columnSort.name, sortOrder: 'desc' }
      columnSorts.splice(columnSorts.length, 0, columnSorts.splice(index, 1)[0])
    } else {
      columnSorts.splice(index, 1)
    }

    this.setState({ columnSorts })
  }

  handleResize() {
    this.forceUpdate()
  }

  componentDidMount() {
    this.props.addTable(this.props.tableId)
    this.setState({ mounted: true })
  }

  componentWillUnmount() {
    this.props.delTable(this.props.tableId)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.settings != this.props.settings) {
      this.setState({ settings: { ...this.defaultSettings, ...this.props.settings } })
    }
    if (prevProps.columns != this.props.columns) {
      this.columnRefs = this.props.columns.reduce((refs, col) => { refs[col.dataIndex] = React.createRef(); return refs },{})
    }
    if (prevProps.rowHeight != this.props.rowHeight) {
      this.setState({ rowHeight: this.cssUnitTranslator.translate(this.props.rowHeight, 'px', 2) })
    }
  }

  render() {
    let columnWidths = this.columnWidths
    return (
        <div ref='table' className='t-table' style={{ width: this.state.settings.tableWidth, maxWidth: this.state.settings.tableWidth, minWidth: this.state.settings.tableWidth }}>
          <Header columns={this.props.columns}
                  columnSorts={this.state.columnSorts}
                  settings={this.state.settings}
                  onHeadClick={this.handleHeadClick}
                  columnRefs={this.columnRefs}
                  columnWidths={columnWidths}
          />
          <Body columns={this.props.columns}
                data={this.props.data}
                onCellInput={this.props.onCellInput}
                rowHeight={this.props.rowHeight}
                tableId={this.props.tableId}
                settings={this.state.settings}
                columnSorts={this.state.columnSorts}
                columnWidths={columnWidths}
          />
          <ResizeDetector handleWidth onResize={this.handleResize_debounced} />
        </div>
    )
  }
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  settings: PropTypes.object,
  onCellInput: PropTypes.func,
  tableId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  rowHeight: PropTypes.number.isRequired,
}

Table.defaultProps = {
  settings: {},
  rowHeight: '1.5em',
}

const mapStateToProps = state => ({
  scrollbarYIsVisible: state.scrollbarYIsVisible
})

const mapDispatchToProps = {
  addTable,
  delTable,
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)