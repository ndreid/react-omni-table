import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { PlusSVG, MinusSVG } from './SVG'

class ExpandCell extends PureComponent {
  constructor() {
    super()

    this.state = {
      hideChildren: false
    }

    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.setState({ hideChildren: !this.state.hideChildren })
  }

  render() {
    return (
      this.props.hasChildren
      ? this.state.hideChildren
        ? <div className='t-expand-button t-cell' onClick={() => this.handleClick(info.idMap)}><PlusSVG width={15} height={15} stroke={this.props.color}/></div>
        : <div className='t-expand-button t-cell' onClick={() => this.handleClick(info.idMap)}><MinusSVG width={15} height={15} stroke={this.props.color}/></div>
      : <div className='t-cell t-expand-space'/>
    )
  }
}

ExpandCell.propTypes = {
  idMap: PropTypes.string.isRequired,
  hasChildren: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
}

export default ExpandCell