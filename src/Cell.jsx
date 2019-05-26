import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import DataTypes from './DataTypes'
import { isNumber, numFunc, coalesce } from './extensions'
import ResizeDetector from 'react-resize-detector'

class Cell extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      dataType: coalesce(props.overrideProps.dataType, props.column.dataType, DataTypes.String),
      editable: coalesce(props.overrideProps.editable, props.column.editable, false),
    }

    this.handleDoubleClick = this.handleDoubleClick.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  getFormattedData() {
    switch (this.state.dataType) {
      case DataTypes.String:
        return this.props.data ? String(this.props.data) : undefined
      case DataTypes.Number:
        if (isNaN(this.props.data)) { return undefined }
        switch (this.props.column.format) {
          case 'currency': return numFunc.toCurrency(this.props.data, 2)
          case 'currency-whole': return numFunc.toCurrency(this.props.data, 0)
          default: return String(this.props.data)
        }
      case DataTypes.Date:
        return (moment.isMoment(this.props.data) || this.props.data instanceof Date)
          ? this.props.data.format('MM/DD/YYYY')
          : this.props.data
      case DataTypes.Bool:
        return this.props.data ? true : false
      case DataTypes.Int:
        return Number.isInteger(this.props.data) ? String(this.props.data) : undefined
      default: throw Error('Cell Component is not configured to handle DataType ' + this.state.dataType)
    }
  }

  handleInput({target}) {
    let validInput
    let returnValue
    switch (this.state.dataType) {
      case DataTypes.String:
        validInput = true
        if (validInput) { returnValue = target.value.trim() === '' ? undefined : target.value.trim() }
        break
      case DataTypes.Date:
        let formats = ['MM/DD/YYYY','M/D/YYYY','MM/D/YYYY','M/DD/YYYY','MM/DD/YY','M/D/YY','MM/D/YY','M/DD/YY']
        validInput = target.value.trim() === '' || moment(target.value, formats, true).isValid()
        if (validInput) { returnValue = target.value.trim() === '' ? undefined : new Date(target.value) }
        break
      case DataTypes.Number:
        validInput = target.value.trim() === '' || isNumber(target.value)
        if (validInput) { returnValue = target.value.trim() === '' ? undefined : Number(target.value) }
        break
      case DataTypes.Int:
        validInput = target.value.trim() === '' || (!isNaN(target.value) && Number.isInteger(Number(target.value)))
        if (validInput) { returnValue = target.value.trim() === '' ? undefined : Number(target.value) }
        break
      case DataTypes.Bool:
        validInput = true
        if (validInput) { returnValue = target.checked }
        break
      default:
        throw Error('TableCell.jsx handleInput is not configured to handle Data Type ' + this.state.dataType)
    }
    if (validInput && typeof this.props.onCellInput === 'function') {
      this.props.onCellInput({
        dataIndex: this.props.column.dataIndex,
        input: returnValue
      })
    }
    if (this.state.dataType !== DataTypes.Bool) {
      this.setState({ editMode: false })
    }
    
    this.props.setIsEditingCell(false)
  }

  handleKeyUp(e) {
    if (e.key === 'Enter') {
      this.handleInput(e)
    }
  }

  handleDoubleClick() {
    if (this.state.editable) {
      this.setState({ editMode: true })
      this.props.setIsEditingCell(true)
    }
  }

  onMouseEnter(e) {
    this.props.onMouseEnter(e, this.props.column.dataIndex)
  }

  onMouseLeave(e) {
    this.props.onMouseLeave(e, this.props.column.dataIndex)
  }

  onResize() {
    this.props.onResize(this.props.column.dataIndex, this.refs.cell.clientWidth)
  }

  componentDidMount() {
    if (this.props.onResize)
      this.onResize()
  }

  componentDidUpdate() {
    if (this.state.dataType !== (this.props.overrideProps.dataType || this.props.column.dataType || DataTypes.String)
      || this.state.editable !== coalesce(this.props.overrideProps.editable, this.props.column.editable, false)
    ) {
      this.setState({
        dataType: this.props.overrideProps.dataType || this.props.column.dataType || DataTypes.String,
        editable: this.props.overrideProps.editable || this.props.column.editable || false,
      })
    }
  }

  render() {
    const align = this.props.column.style ? this.props.column.style.align : undefined
    const style = {
      ...this.props.style,
      minWidth: this.props.column.style ? this.props.column.style.minWidth : undefined,
      justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
      paddingLeft: 8 + (this.props.primary ? this.props.tier * 8 : 0),
    }

    return this.state.dataType === DataTypes.Bool
      ? <div ref={this.props.onResize ? 'cell' : undefined} className={`t-cell${this.props.classes}`} style={style} draggable={!!this.props.classes}
          onDragStart={this.props.onDragStart}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <input type='checkbox' checked={this.props.data} onChange={this.handleInput}/>
          {this.props.onResize ? <ResizeDetector handleWidth handleHeight onResize={this.onResize} /> : undefined }
        </div>
      : this.state.editMode
        ? <input ref={this.props.onResize ? 'cell' : undefined} defaultValue={this.props.data} onFocus={this.handleFocus} className='t-cell' style={style} onBlur={this.handleInput} autoFocus onKeyUp={this.handleKeyUp}>
            {this.props.onResize ? <ResizeDetector handleWidth handleHeight onResize={this.onResize} /> : undefined }
          </input>
        : (
          <div ref={this.props.onResize ? 'cell' : undefined} className={`t-cell${this.props.classes}`} style={style} draggable={!!this.props.classes}
               onDoubleClick={this.handleDoubleClick}
               onDragStart={this.props.onDragStart}
               onMouseEnter={this.onMouseEnter}
               onMouseLeave={this.onMouseLeave}
          >
            {this.getFormattedData()}
            {this.props.onResize ? <ResizeDetector handleWidth handleHeight onResize={this.onResize} /> : undefined }
            
          </div>
      )
  }
}

Cell.propTypes = {
  primary: PropTypes.bool.isRequired,
  tier: PropTypes.number.isRequired,
  data: PropTypes.any,
  column: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  classes: PropTypes.string.isRequired,
  onCellInput: PropTypes.func.isRequired,
  overrideProps: PropTypes.object,
  onDragStart: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onResize: PropTypes.func,
}

Cell.defaultProps = {
  overrideProps: {},
}

export default Cell