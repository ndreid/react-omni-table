import React from 'react'
import PropTypes from 'prop-types'

export const PlusSVG = props =>
    <svg width={props.width} height={props.height} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"> {/*display="block" width={props.width} height={props.height}*/}
      <circle cx="50" cy="50" r="40" stroke={props.stroke} strokeWidth="10" fill="none"/>
      <path d="M30 50 h40 M 50 30 v40" stroke={props.stroke} strokeWidth="8"/>
    </svg>

PlusSVG.defaultProps = {
  stroke: "black"
}

PlusSVG.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired
}

export const MinusSVG = props =>
    <svg width={props.width} height={props.height} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" stroke={props.stroke} strokeWidth="10" fill="none"/>
      <path d="M30 50 h40" stroke={props.stroke} strokeWidth="10"/>
    </svg>

MinusSVG.defaultProps = {
  stroke: "black"
}

MinusSVG.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired
}