import React, { useState } from "react";
// import ReactDOM from "react-dom";
import './admin_dashboard.css';

const teachersData = [
  { id: 1, course: "maths", teacher: "Alice", room: 1 },
  { id: 2, course: "maths", teacher: "Bob", room: 2 },
  { id: 3, course: "maths", teacher: "Charlie", room: 2 },
  { id: 4, course: "maths", teacher: "David", room: 4 },
  { id: 5, course: "maths", teacher: "Eve", room: 5 },
  // Add more teacher data as needed
];

export default function adminDashboard() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

function Dashboard() {
  const [teachers, setTeachers] = useState(teachersData);
  const [courseFilter, setCourseFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState("");
  const [newTeacher, setNewTeacher] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [validationError, setValidationError] = useState({});

  const applyFilters = () => {
    const normalizedCourseFilter = courseFilter.toLowerCase();
    const normalizedNameFilter = nameFilter.toLowerCase();

    const filteredTeachers = teachersData.filter((teacher) => {
      const matchesCourse = normalizedCourseFilter === "" || teacher.course.toLowerCase().includes(normalizedCourseFilter);
      const matchesName = normalizedNameFilter === "" || teacher.teacher.toLowerCase().includes(normalizedNameFilter);

      return matchesCourse && matchesName;
    });

    setTeachers(filteredTeachers);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const validateForm = () => {
    const errors = {};

    if (newCourse.trim() === "") {
      errors.newCourse = "Course is required";
    }
    if (newTeacher.trim() === "") {
      errors.newTeacher = "Teacher Name is required";
    }
    if (!/^\d+$/.test(newRoom) || newRoom <= 0) {
      errors.newRoom = "Room must be a positive number";
    }

    return errors;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setValidationError(validationErrors);
      return;
    }

    const newTeacherData = {
      id: teachers.length + 1,
      course: newCourse,
      teacher: newTeacher,
      room: newRoom,
    };
    setTeachers([...teachers, newTeacherData]);
    setIsAdding(false);
    setNewCourse("");
    setNewTeacher("");
    setNewRoom("");
    setValidationError({});
  };

  const handleDelete = (id) => {
    const updatedTeachers = teachers.filter((teacher) => teacher.id !== id);
    setTeachers(updatedTeachers);
  };
  

  const handleEdit = (id) => {
    setEditTeacherId(id);
    const teacherToEdit = teachers.find((teacher) => teacher.id === id);
    setEditedData(teacherToEdit);
  };

  const handleSaveEdit = (id, course, teacherName, room) => {
    const updatedTeachers = teachers.map((teacher) =>
      teacher.id === id ? { ...teacher, course, teacher: teacherName, room } : teacher
    );
    setTeachers(updatedTeachers);
    setEditTeacherId(null);
    setEditedData({});
  };

  const handleEditChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <div>
        <input
          type="text"
          placeholder="Filter by course"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={handleAddClick}>Add Courses</button>
      </div>

      {isAdding && (
        <div className="modal">
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Course"
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
            />
            {validationError.newCourse && (
              <span className="error">{validationError.newCourse}</span>
            )}
            <input
              type="text"
              placeholder="Teacher Name"
              value={newTeacher}
              onChange={(e) => setNewTeacher(e.target.value)}
            />
            {validationError.newTeacher && (
              <span className="error">{validationError.newTeacher}</span>
            )}
            <input
              type="number"
              placeholder="Room"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
            />
            {validationError.newRoom && (
              <span className="error">{validationError.newRoom}</span>
            )}
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
  <div className={isAdding ? "dashboard-blur" : ""}>
      <TeacherTable
        teachers={teachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSave={handleSaveEdit}
        editTeacherId={editTeacherId}
        editedData={editedData}
        onEditChange={handleEditChange}
      />
      </div>
    </div>
  );
}

function TeacherTable({ teachers, onEdit, onDelete, onSave, editTeacherId, editedData, onEditChange }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Teacher Name</th>
          <th>Course Name</th>
          <th>Room</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {teachers.map((teacher) => (
          <tr key={teacher.id}>
            <td>
              {editTeacherId === teacher.id ? (
                <input
                  type="text"
                  value={editedData.teacher}
                  onChange={(e) => onEditChange(e, 'teacher')}
                />
              ) : (
                teacher.teacher
              )}
            </td>
            <td>
              {editTeacherId === teacher.id ? (
                <input
                  type="text"
                  value={editedData.course}
                  onChange={(e) => onEditChange(e, 'course')}
                />
              ) : (
                teacher.course
              )}
            </td>
            <td>
              {editTeacherId === teacher.id ? (
                <input
                  type="number"
                  value={editedData.room}
                  onChange={(e) => onEditChange(e, 'room')}
                />
              ) : (
                teacher.room
              )}
            </td>
            <td>
              {editTeacherId === teacher.id ? (
                <button onClick={() => onSave(teacher.id, editedData.course, editedData.teacher, editedData.room)}>Save</button>
              ) : (
                <>
                  <button onClick={() => onEdit(teacher.id)}>Edit</button>
                  <button onClick={() => onDelete(teacher.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export const teacherCourses = teachersData.map((teacher) => teacher.course);
// ReactDOM.render(<App />, document.getElementById('root'));


// import React, { useState } from "react";
// import ReactDOM from "react-dom";
// import './admin_dashboard.css';

// const teachersData = [
//   { id: 1, course: "maths", teacherName: "Alice", room: 1 },
//   { id: 2, course: "maths", teacherName: "Bob", room: 2 },
//   { id: 3, course: "maths", teacherName: "Charlie", room: 2 },
//   { id: 4, course: "maths", teacherName: "David", room: 4 },
//   { id: 5, course: "maths", teacherName: "Eve", room: 5 },
//   // Add more teacher data as needed
// ];

// function App() {
//   return (
//     <div className="App">
//       <Dashboard />
//     </div>
//   );
// }

// function Dashboard() {
//   const [teachers, setTeachers] = useState(teachersData);
//   const [courseFilter, setCourseFilter] = useState("");
//   const [nameFilter, setNameFilter] = useState("");
//   const [isAdding, setIsAdding] = useState(false);
//   const [newCourse, setNewCourse] = useState("");
//   const [newTeacher, setNewTeacher] = useState("");
//   const [newRoom, setNewRoom] = useState("");
//   const [editTeacherId, setEditTeacherId] = useState(null);

//   const applyFilters = () => {
//     const normalizedCourseFilter = courseFilter.toLowerCase();
//     const normalizedNameFilter = nameFilter.toLowerCase();

//     const filteredTeachers = teachersData.filter((teacher) => {
//       const matchesCourse = normalizedCourseFilter === "" || teacher.course.toLowerCase().includes(normalizedCourseFilter);
//       const matchesName = normalizedNameFilter === "" || teacher.teacherName.toLowerCase().includes(normalizedNameFilter);

//       return matchesCourse && matchesName;
//     });

//     setTeachers(filteredTeachers);
//   };

//   const handleAddClick = () => {
//     setIsAdding(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     const newTeacherData = {
//       id: teachers.length + 1,
//       course: newCourse,
//       teacherName: newTeacher,
//       room: newRoom,
//     };
//     setTeachers([...teachers, newTeacherData]);
//     setIsAdding(false);
//     setNewCourse("");
//     setNewTeacher("");
//     setNewRoom("");
//   };

//   const handleDelete = (id) => {
//     const updatedTeachers = teachers.filter((teacher) => teacher.id !== id);
//     setTeachers(updatedTeachers);
//   };

//   const handleEdit = (id) => {
//     setEditTeacherId(id);
//   };
//   const handleSaveEdit = (id, course, teacherName, room) => {
//     const updatedTeachers = teachers.map((teacher) =>
//       teacher.id === id ? { ...teacher, course, teacherName, room } : teacher
//     );
//     setTeachers(updatedTeachers);
//     setEditTeacherId(null);
//   };

//   return (
//     <div>
//       <h1>Teacher Dashboard</h1>
//       <div>
//         <input
//           type="text"
//           placeholder="Filter by course"
//           value={courseFilter}
//           onChange={(e) => setCourseFilter(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Filter by name"
//           value={nameFilter}
//           onChange={(e) => setNameFilter(e.target.value)}
//         />
//         <button onClick={applyFilters}>Apply Filters</button>
//         <button onClick={handleAddClick}>Add Courses</button>
//       </div>
//       {isAdding ? (
//         <form onSubmit={handleFormSubmit}>
//           <input
//             type="text"
//             placeholder="Course"
//             value={newCourse}
//             onChange={(e) => setNewCourse(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Teacher Name"
//             value={newTeacher}
//             onChange={(e) => setNewTeacher(e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Room"
//             value={newRoom}
//             onChange={(e) => setNewRoom(e.target.value)}
//           />
//           <button type="submit">Submit</button>
//         </form>
//       ) : null}
//       <TeacherTable
//         teachers={teachers}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         onSave={handleSaveEdit}
//         editTeacherId={editTeacherId}
//       />
//     </div>
//   );
// }

// function TeacherTable({ teachers, onEdit, onDelete, onSave, editTeacherId }) {
//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>Name</th>
//           <th>Course Opted</th>
//           <th>Room</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {teachers.map((teacher) => (
//           <tr key={teacher.id}>
//             <td>
//               {editTeacherId === teacher.id ? (
//                 <input
//                   type="text"
//                   value={teacher.teacherName}
//                   onChange={(e) => onSave(teacher.id, teacher.course, e.target.value, teacher.room)}
//                 />
//               ) : (
//                 teacher.teacherName
//               )}
//             </td>
//             <td>
//               {editTeacherId === teacher.id ? (
//                 <input
//                   type="text"
//                   value={teacher.course}
//                   onChange={(e) => onSave(teacher.id, e.target.value, teacher.teacherName, teacher.room)}
//                 />
//               ) : (
//                 teacher.course
//               )}
//             </td>
//             <td>
//               {editTeacherId === teacher.id ? (
//                 <input
//                   type="number"
//                   value={teacher.room}
//                   onChange={(e) => onSave(teacher.id, teacher.course, teacher.teacherName, e.target.value)}
//                 />
//               ) : (
//                 teacher.room
//               )}
//             </td>
//             <td>
//               {editTeacherId === teacher.id ? (
//                 <button onClick={() => onSave(teacher.id, teacher.course, teacher.teacherName, teacher.room)}>Save</button>
//               ) : (
//                 <>
//                   <button onClick={() => onEdit(teacher.id)}>Edit</button>
//                   <button onClick={() => onDelete(teacher.id)}>Delete</button>
//                 </>
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// ReactDOM.render(<App />, document.getElementById('root'));

