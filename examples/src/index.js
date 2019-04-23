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
    style: { width: '120px', align: 'center' },
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
  {
    id: '6',
    name: 'John Smith',
    birthday: '1/1/2015',
    age: 4,
    homeOwner: false,
  },
  { id: '7', name: 'John Smith', birthday: '1/1/2015', age: 4, homeOwner: false, },
  { id: '8', name: 'John Smith', birthday: '2/1/2018', age: 4, homeOwner: false, },
  { id: '9', name: 'John Smith', birthday: '3/1/2016', age: 4, homeOwner: false, },
  { id: '10', name: 'John Smith', birthday: '4/1/1992', age: 4, homeOwner: false, },
  { id: '11', name: 'John Smith', birthday: '5/10/1937', age: 4, homeOwner: false, },
  { id: '12', name: 'John Smith', birthday: '6/11/1842', age: 4, homeOwner: false, },
  { id: '13', name: 'John Smith', birthday: '7/1/2001', age: 4, homeOwner: false, },
  { id: '14', name: 'John Smith', birthday: '8/1/1873', age: 4, homeOwner: false, },
  { id: '15', name: 'John Smith', birthday: '9/16/1974', age: 4, homeOwner: false, },
  { id: '16', name: 'John Smith', birthday: '10/1/1998', age: 4, homeOwner: false, },
  { id: '17', name: 'John Smith', birthday: '11/1/1997', age: 4, homeOwner: false, },
  { id: '18', name: 'John Smith', birthday: '12/2/1909', age: 4, homeOwner: false, },
  { id: '19', name: 'John Smith', birthday: '1/1/2015', age: 4, homeOwner: false, },
  { id: '20', name: 'John Smith', birthday: '2/1/2015', age: 4, homeOwner: false, },
  { id: '21', name: 'John Smith', birthday: '2/7/2015', age: 4, homeOwner: false, },
  { id: '22', name: 'John Smith', birthday: '3/12/2000', age: 4, homeOwner: false, },
  { id: '23', name: 'John Smith', birthday: '4/1/2001', age: 4, homeOwner: false, },
  { id: '24', name: 'John Smith', birthday: '5/1/1768', age: 4, homeOwner: false, },
  { id: '25', name: 'John Smith', birthday: '6/1/1991', age: 4, homeOwner: false, },
  { id: '26', name: 'John Smith', birthday: '7/1/1994', age: 4, homeOwner: false, },
  { id: '27', name: 'John Smith', birthday: '8/1/1993', age: 4, homeOwner: false, },
  { id: '28', name: 'John Smith', birthday: '9/1/1995', age: 4, homeOwner: false, },
  { id: '29', name: 'John Smith', birthday: '1/1/1983', age: 4, homeOwner: false, },
  { id: '30', name: 'John Smith', birthday: '12/1/1982', age: 4, homeOwner: false, },
  { id: '31', name: 'John Smith', birthday: '2/1/1981', age: 4, homeOwner: false, },
]

const settings = {
  // dragEnabled: true,
}

const App = () => (
  <DragDropArea>
    <Table tableId='exampleTable' columns={columns} data={data} rowHeight={26} settings={settings}/>
  </DragDropArea>
);
render(<App />, document.getElementById("root"));