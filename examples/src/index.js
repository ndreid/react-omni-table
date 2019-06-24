/***  examples/src/index.js ***/

import React from 'react';
import { render } from 'react-dom';
import { DragDropArea, Table } from '../../src';

const columns = [
  {
    name: 'Name', dataIndex: 'name', dataType: 'string',
    style: { minWidth: '300px' },
  },
  {
    name: 'Birthday', dataIndex: 'birthday', dataType: 'date', editable: true,
    style: { minWidth: '300px' },
  },
  {
    name: 'Age', dataIndex: 'age', dataType: 'int', editable: true,
    style: { minWidth: '100px' },
  },
  {
    name: 'Home Owner', dataIndex: 'homeOwner', dataType: 'bool',
    style: { minWidth: '200px',  align: 'center' },
  },
  { name: 'Column', dataIndex: 'col5', dataType: 'string', style: { minWidth: '200px' } },
  { name: 'Column', dataIndex: 'col6', dataType: 'string', style: { minWidth: '200px' } },
  { name: 'Column', dataIndex: 'col7', dataType: 'string' },
  { name: 'Column', dataIndex: 'col8', dataType: 'string' },
  { name: 'Column', dataIndex: 'col9', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col10', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col11', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col12', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col13', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col14', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col15', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col16', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col17', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col18', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col19', dataType: 'string' },
  // { name: 'Column', dataIndex: 'col20', dataType: 'string' },
]

const settings = {
  // tableWidth: '100%',
  dragEnabled: true,
  tierColors: [
    { color: 'black', backgroundColor: 'lightblue' },
    { color: 'black', backgroundColor: 'lightgreen' },
    { color: 'black', backgroundColor: 'white' },
  ],
  // headerColors: { color: 'white', backgroundColor: 'darkblue' , borderColor: 'black' }
}

const App = () => {

  let tableData = []
  for (let i = 1; i < 100; i++) {
    tableData.push({
      id: i,
      name: 'My Name' + i,
      birthday: '1/1/2019',
      age: 0,
      homeOwner: false,
      col5: 'owijef',
      col6: 'owijef',
      col7: 'owijef',
      col8: 'owijef',
      col9: 'owijef',
      col10: 'owijef' + (i % 100 === 0 ? 'oiwjefoijweofijweofijwoefijwoeifjwoeijf' : ''),
      col11: 'owijef',
      col12: 'owijef',
      col13: 'owijef',
      col14: 'owijef',
      col15: 'owijef',
      col16: 'owijef',
      col17: 'owijef',
      col18: 'owijef',
      col19: 'owijef',
      col20: 'owijef',
      children: [
        {
          id: i + 0.1,
          name: 'My Name',
          birthday: '1/1/2019',
          age: 0,
          homeOwner: false,
          col5: 'owijef',
          col6: 'owijef',
          col7: 'owijef',
          col8: 'owijef',
          col9: 'owijef',
          col10: 'owijef',
          col11: 'owijef',
          col12: 'owijef',
          col13: 'owijef',
          col14: 'owijef',
          col15: 'owijef',
          col16: 'owijef',
          col17: 'owijef',
          col18: 'owijef',
          col19: 'owijef',
          col20: 'owijef',
          children: [
            { id: i + 0.11, name: 'Grandchild' }
          ]
        },
        {
          id: i + 0.2,
          name: 'My Name',
          birthday: '1/1/2019',
          age: 0,
          homeOwner: false,
          col5: 'owijef',
          col6: 'owijef',
          col7: 'owijef',
          col8: 'owijef',
          col9: 'owijef',
          col10: 'owijef',
          col11: 'owijef',
          col12: 'owijef',
          col13: 'owijef',
          col14: 'owijef',
          col15: 'owijef',
          col16: 'owijef',
          col17: 'owijef',
          col18: 'owijef',
          col19: 'owijef',
          col20: 'owijef',
          children: [
            { id: i + 0.11, name: 'Grandchild' }
          ]
        }
      ],
    })
  }
  let data1 = tableData.slice(0, 80)
  let data2 = tableData.slice(80)


  let config = {
    tierDropTargets: {
      0: {
        'table2': [0]
      },
      1: {
        'table2': [1]
      }
    }
  }

  return (
    <DragDropArea width='100%'>
      <div style={{display: 'flex', maxHeight: '100%'}}>
          <Table tableId='table1' columns={columns} data={data1} rowHeight={25} settings={settings} config={config}/>
          <Table tableId='table2' columns={columns.slice(0,1)} data={data2} rowHeight={25} settings={settings}/>
      </div>
    </DragDropArea>
  )
};
render(<App />, document.getElementById("root"));
