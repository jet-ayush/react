import React,{useState} from "react";
//  import {Link} from "react-router-dom";
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import { teacherCourses } from './adminDashboard';
const rows = [
    {id:1, name:"ayush",course:"mathematics"}
]
export default function studentDashboard() {
    return (
        <div>
            <Menu />
            <DataFridDemo rows = {rows} teacherCourses={teacherCourses} />
        </div>
    )
}

function DataFridDemo({rows}) {

    const columns =  [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'name',
          headerName: 'name',
          width: 150
        },
        {
          field: 'course',
          headerName: 'course',
          width: 150,
          editable: true
        },
        {
            field :"action",
            headerName:"edit/delete",
            width:200,
            renderCell: (params) => {
                <div>
                    <button> edit</button>
                    <button onClick = {() =>HandleDelete(params.row.id)}> delete</button>
                </div>
            }

        }
    ]
    const [myRows,setMyRows] = useState(rows);
    const [showForm,setShowForm] = useState(false);
    const HandleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newRow = {
            id :formData.get('student'),
            dept:formData.get('dept'),
            course:formData.get('course'),
        }
        setMyRows(...myRows,newRow);
    }
    const HandleDelete = (id) => {
        const updateRows = myRows.filter((row) => row.id !== id)
        setMyRows(updateRows);
    };
    return (
        <div>
            <button onClick = {() => setShowForm(!showForm)}>add record</button>
            {showForm && (
                <form onSubmit = {HandleSubmit}>
                    <input type = "number" name = "id" placeholder="id"/>
                    <input type = "text" name = "name" placeholder="name"/>
                    <select name="course" placeholder="Course">
                        {teacherCourses.map((course, index) => (
                            <option key={index} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                    <button type = "submit">submit</button>
                </form>
            )}
 <Box sx={{ height: 200, width: '30%' }}>
      <DataGrid
        rows={myRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        disableRowSelectionOnClick
      />
    </Box>
        </div>
    )
    }
    function Menu() {
        return (
            <div>
                <h1> college admin dashboard</h1>
            </div>
        )
    }