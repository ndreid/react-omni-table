/***  examples/src/index.js ***/

import React from 'react';
import { render } from 'react-dom';
import { DragDropArea, Table } from '../../src';

const columns = [
  {
    name: 'Name', dataIndex: 'name', dataType: 'string',
    style: { width: '200px' },
  },
  {
    name: 'Birthday', dataIndex: 'birthday', dataType: 'date', editable: true,
    style: { width: '100px' },
  },
  {
    name: 'Age', dataIndex: 'age', dataType: 'int', editable: true,
    style: { width: '100px' },
  },
  {
    name: 'Home Owner', dataIndex: 'homeOwner', dataType: 'bool',
    style: { width: '60px', align: 'center' },
  },
]

const data = [
  {
    id: '1',
    name: 'John Smith',
    birthday: '1/1/2015',
    age: 4,
    homeOwner: false,
  },
  {
    id: '2',
    name: 'Susie Longstocking',
    birthday: '2/2/1989',
    age: 30,
    homeOwner: true,
    children: [
      {
        id: '3',
        name: 'James Longstocking',
        birthday: '3/3/2010',
        age: 9,
        homeOwner: false,
      },
      {
        id: '4',
        name: 'Sally Longstocking',
        birthday: '4/4/2018',
        age: 1,
        homeOwner: false,
      },
    ]
  },
  {
    id: '5',
    name: 'Jason Jones',
    birthday: '1/1/1969',
    age: 50,
    homeOwner: true,
  },
]

const settings = {
  color: 'red',
  backgroundColor: 'blue',
}

const App = () => (
  <DragDropArea>
    <Table tableId='exampleTable' columns={columns} data={data} rowHeight={26} settings={settings}/>
  </DragDropArea>
);
render(<App />, document.getElementById("root"));