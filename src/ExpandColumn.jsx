import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ExpandCell from './ExpandCell'

class ExpandColumn extends PureComponent {
  render() {
    let val = (
      <div ref='column' className='t-col t-expand-col'>
        {this.props.data.map(({ data, info }, index) =>
          <ExpandCell key={index}
            idMap={info.idMap}
            tableId={this.props.tableId}
            hasChildren={!!data.children}
            onClick={this.props.onExpandClick}
          />
        )}
      </div>
    )

    console.log(val)
    return val
  }
}

ExpandColumn.propTypes = {
  tableId: PropTypes.any.isRequired,
  data: PropTypes.array.isRequired,
  onExpandClick: PropTypes.func.isRequired,
}

export default ExpandColumn