/***  examples/src/index.js ***/

import React from 'react';
import { render } from 'react-dom';
import { DragDropArea, Table } from '../../src';

const columns = [
  {
    name: 'Column 1', dataIndex: 'column1', dataType: 'string',
    style: { width: '200px' },
  },
  {
    name: 'Column 2', dataIndex: 'column2', dataType: 'string', editable: true,
    style: { width: '100px' },
  },
  {
    name: 'Column 3', dataIndex: 'column3', dataType: 'string', editable: true,
    style: { width: '100px' },
  },
  {
    name: 'Column 4', dataIndex: 'column4', dataType: 'string', editable: true,
    style: { width: '100px' },
  },
  {
    name: 'Column 5', dataIndex: 'column5', dataType: 'string',
    style: { width: '60px' },
  },
]

const data = [
  {
    id: '1',
    column1: 'value 1-1',
    column2: 'value 1-2',
    column3: 'value 1-3',
    column4: 'value 1-4',
    column5: 'value 1-5',
  },
  {
    id: '2',
    column1: 'value 2-1',
    column2: 'value 2-2',
    column3: 'value 2-3',
    column4: 'value 2-4',
    column5: 'value 2-5',
    children: [
      {
        id: '3',
        column1: 'value 2-1a',
        column2: 'value 2-2a',
        column3: 'value 2-3a',
        column4: 'value 2-4a',
        column5: 'value 2-5a',
      },
      {
        id: '4',
        column1: 'value 2-1b',
        column2: 'value 2-2b',
        column3: 'value 2-3b',
        column4: 'value 2-4b',
        column5: 'value 2-5b',
      },
    ]
  }
]

const App = () => (
  <DragDropArea>
    <Table tableId='exampleTable' columns={columns} data={data} rowHeight={26}/>
  </DragDropArea>
);
render(<App />, document.getElementById("root"));