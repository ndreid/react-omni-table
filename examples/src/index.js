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
    style: { width: '30%' },
  },
  {
    name: 'Age', dataIndex: 'age', dataType: 'int', editable: true,
    style: { width: '50%' },
  },
  {
    name: 'Home Owner', dataIndex: 'homeOwner', dataType: 'bool',
    style: { width: '20%', align: 'center' },
  },
]

// const columns = [
//   { name: 'Description', dataIndex: 'description', dataType: 'string', style: {  } },
//   { name: 'Transaction Date', dataIndex: 'date', dataType: 'date', style: { width: '1px', align: 'center' } },
//   { name: 'Amount', dataIndex: 'amount', dataType: 'number', style: { width: '10rem', align: 'right' } },
//   { name: 'Account ID', dataIndex: 'accountId', dataType: 'string', style: { width: '10rem' } },
// ]

// const data = [{"id":0,"description":"Walmart","date":"2019-01-01T06:00:00.000Z","amount":15},{"id":1,"description":"7 Eleven","date":"2019-01-13T06:00:00.000Z","amount":26.54},{"id":2,"description":"ALDI","date":"2019-01-07T06:00:00.000Z","amount":52.9},{"id":3,"description":"Walmart","date":"2019-01-01T06:00:00.000Z","amount":15},{"id":4,"description":"7 Eleven","date":"2019-01-13T06:00:00.000Z","amount":26.54},{"id":5,"description":"ALDI","date":"2019-01-07T06:00:00.000Z","amount":52.9}]

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
  {
    id: '32',
    name: 'John Smith',
    birthday: '1/1/2015',
    age: 4,
    homeOwner: false,
  },
  {
    id: '33',
    name: 'Susie Longstocking',
    birthday: '2/2/1989',
    age: 30,
    homeOwner: true,
    children: [
      {
        id: '34',
        name: 'James Longstocking',
        birthday: '3/3/2010',
        age: 9,
        homeOwner: false,
      },
      {
        id: '35',
        name: 'Sally Longstocking',
        birthday: '4/4/2018',
        age: 1,
        homeOwner: false,
      },
    ]
  },
  {
    id: '36',
    name: 'Jason Jones',
    birthday: '1/1/1969',
    age: 50,
    homeOwner: true,
  },
  {
    id: '37',
    name: 'John Smith',
    birthday: '1/1/2015',
    age: 4,
    homeOwner: false,
  },
  { id: '38', name: 'John Smith', birthday: '2/1/2018', age: 4, homeOwner: false, },
  { id: '39', name: 'John Smith', birthday: '3/1/2016', age: 4, homeOwner: false, },
  { id: '40', name: 'John Smith', birthday: '4/1/1992', age: 4, homeOwner: false, },
  { id: '41', name: 'John Smith', birthday: '5/10/1937', age: 4, homeOwner: false, },
  { id: '42', name: 'John Smith', birthday: '6/11/1842', age: 4, homeOwner: false, },
  { id: '43', name: 'John Smith', birthday: '7/1/2001', age: 4, homeOwner: false, },
  { id: '44', name: 'John Smith', birthday: '8/1/1873', age: 4, homeOwner: false, },
  { id: '45', name: 'John Smith', birthday: '9/16/1974', age: 4, homeOwner: false, },
  { id: '46', name: 'John Smith', birthday: '10/1/1998', age: 4, homeOwner: false, },
  { id: '47', name: 'John Smith', birthday: '11/1/1997', age: 4, homeOwner: false, },
  { id: '48', name: 'John Smith', birthday: '12/2/1909', age: 4, homeOwner: false, },
  { id: '49', name: 'John Smith', birthday: '1/1/2015', age: 4, homeOwner: false, },
  { id: '50', name: 'John Smith', birthday: '2/1/2015', age: 4, homeOwner: false, },
  { id: '51', name: 'John Smith', birthday: '2/7/2015', age: 4, homeOwner: false, },
  { id: '52', name: 'John Smith', birthday: '3/12/2000', age: 4, homeOwner: false, },
  { id: '53', name: 'John Smith', birthday: '4/1/2001', age: 4, homeOwner: false, },
  { id: '54', name: 'John Smith', birthday: '5/1/1768', age: 4, homeOwner: false, },
  { id: '55', name: 'John Smith', birthday: '6/1/1991', age: 4, homeOwner: false, },
  { id: '56', name: 'John Smith', birthday: '7/1/1994', age: 4, homeOwner: false, },
  { id: '57', name: 'John Smith', birthday: '8/1/1993', age: 4, homeOwner: false, },
  { id: '58', name: 'John Smith', birthday: '9/1/1995', age: 4, homeOwner: false, },
  { id: '59', name: 'John Smith', birthday: '1/1/1983', age: 4, homeOwner: false, },
  { id: '60', name: 'John Smith', birthday: '12/1/1982', age: 4, homeOwner: false, },
  {
    id: '71',
    name: 'John Smith',
    birthday: '1/1/2015',
    age: 4,
    homeOwner: false,
  },
  {
    id: '72',
    name: 'Susie Longstocking',
    birthday: '2/2/1989',
    age: 30,
    homeOwner: true,
    children: [
      {
        id: '73',
        name: 'James Longstocking',
        birthday: '3/3/2010',
        age: 9,
        homeOwner: false,
      },
      {
        id: '74',
        name: 'Sally Longstocking',
        birthday: '4/4/2018',
        age: 1,
        homeOwner: false,
      },
    ]
  },
  {
    id: '75',
    name: 'Jason Jones',
    birthday: '1/1/1969',
    age: 50,
    homeOwner: true,
  },
  {
    id: '76',
    name: 'John Smith',
    birthday: '1/1/2015',
    age: 4,
    homeOwner: false,
  },
  { id: '77', name: 'John Smith', birthday: '1/1/2015', age: 4, homeOwner: false, },
  { id: '78', name: 'John Smith', birthday: '2/1/2018', age: 4, homeOwner: false, },
  { id: '79', name: 'John Smith', birthday: '3/1/2016', age: 4, homeOwner: false, },
  { id: '80', name: 'John Smith', birthday: '4/1/1992', age: 4, homeOwner: false, },
  { id: '81', name: 'John Smith', birthday: '5/10/1937', age: 4, homeOwner: false, },
  { id: '82', name: 'John Smith', birthday: '6/11/1842', age: 4, homeOwner: false, },
  { id: '83', name: 'John Smith', birthday: '7/1/2001', age: 4, homeOwner: false, },
  { id: '84', name: 'John Smith', birthday: '8/1/1873', age: 4, homeOwner: false, },
  { id: '85', name: 'John Smith', birthday: '9/16/1974', age: 4, homeOwner: false, },
  { id: '86', name: 'John Smith', birthday: '10/1/1998', age: 4, homeOwner: false, },
  { id: '87', name: 'John Smith', birthday: '11/1/1997', age: 4, homeOwner: false, },
  { id: '88', name: 'John Smith', birthday: '12/2/1909', age: 4, homeOwner: false, },
  { id: '89', name: 'John Smith', birthday: '1/1/2015', age: 4, homeOwner: false, },
  { id: '90', name: 'John Smith', birthday: '2/1/2015', age: 4, homeOwner: false, },
  { id: '91', name: 'John Smith', birthday: '2/7/2015', age: 4, homeOwner: false, },
  { id: '92', name: 'John Smith', birthday: '3/12/2000', age: 4, homeOwner: false, },
  { id: '93', name: 'John Smith', birthday: '4/1/2001', age: 4, homeOwner: false, },
  { id: '94', name: 'John Smith', birthday: '5/1/1768', age: 4, homeOwner: false, },
  { id: '95', name: 'John Smith', birthday: '6/1/1991', age: 4, homeOwner: false, },
  { id: '96', name: 'John Smith', birthday: '7/1/1994', age: 4, homeOwner: false, },
  { id: '97', name: 'John Smith', birthday: '8/1/1993', age: 4, homeOwner: false, },
  { id: '98', name: 'John Smith', birthday: '9/1/1995', age: 4, homeOwner: false, },
  { id: '99', name: 'John Smith', birthday: '1/1/1983', age: 4, homeOwner: false, },
  { id: '100', name: 'John Smith', birthday: '12/1/1982', age: 4, homeOwner: false, },
  { id: '101', name: 'John Smith', birthday: '2/1/1981', age: 4, homeOwner: false, },
]

const settings = {
  tableWidth: '100%',
  // dragEnabled: true,
}

const App = () => (
  <DragDropArea>
    <Table tableId='exampleTable' columns={columns} data={data} rowHeight={26} settings={settings}/>
  </DragDropArea>
);
render(<App />, document.getElementById("root"));