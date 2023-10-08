import React  from 'react';
import ReactDOM from 'react-dom';
import './admin_dashboard.css';

const courses = [
  {
    id: 1,
    name: 'Math Class',
    teacher: 'John Doe',
    room: 'A101',
  },
  {
    id: 2,
    name: 'History Class',
    teacher: 'Jane Smith',
    room: 'B202',
  },
  {
    id: 3,
    name: 'Chemistry Class',
    teacher: 'Sarah Johnson',
    room: 'C303',
  },
  {
    id: 4,
    name: 'English Class',
    teacher: 'David Brown',
    room: 'D404',
  },
  {
    id: 5,
    name: 'Computer Science Class',
    teacher: 'Michael Lee',
    room: 'E505',
  },
  {
    id: 6,
    name: 'Physics Class',
    teacher: 'Emily White',
    room: 'F606',
  },
];

// Add as many courses as needed


function App() {
  return (
    <div className="container">
      <Menu />
      <Display courses={courses} />
    </div>
  );
}

function Menu() {
  return (
    <main className="dashboard-header">
      <h1>College Admin Dashboard</h1>
      <button>Add courses</button>
      <input type="text" placeholder="Filter courses" />
      <button>Filter</button>
    </main>
  );
}

function Display(props) {
  return (
    <ul className="course-list">
      {props.courses.map((course) => (
        <li key={course.id} className="course-card">
          <div className="card-header">
            <h3 className="course-name">{course.name}</h3>
          </div>
          <div className="card-body">
            <p className="teacher">Teacher: {course.teacher}</p>
            <p className="room">Room: {course.room}</p>
          </div>
          <div className="card-footer">
            <button className="edit-button">Edit</button>
            <button className="delete-button">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));






































































/// the first code before props

// import React, { useState } from 'react';
// import ReactDOM from 'react-dom';
// const courses = [
//   {
//     id: 1,
//     name: 'Math Class',
//     teacher: 'John Doe',
//     room: 'A101',
//   },
//   {
//     id: 2,
//     name: 'History Class',
//     teacher: 'Jane Smith',
//     room: 'B202',
//   },
// ]
// function App() {
//   return 
//   (<div className='container'>
//     <Menu />
//     <Display />
//   </div>
// )
// }
// function Menu() {
//   return (
   
//       <main className="dashboard-header">
//         <h1>College Admin Dashboard</h1>
//           <button>Add courses</button>
//           <input
//             type="text"
//             placeholder="Filter courses"
//           />
//           <button>Filter</button>
//         </main>
    
//   );
// };
// function Display(props) {
//   return 
//   <ul>
//     <li>
//     <h3>course name:</h3>
//     <p>Teacher:</p>
//     <p>Room:</p>
//     <button>Edit</button>
//     <button>Delete</button>
//     </li>
//   </ul>
// }








// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

