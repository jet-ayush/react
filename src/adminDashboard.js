import React, { useState,useEffect,createContext, useContext } from "react";
import {Link} from "react-router-dom";
import './admin_dashboard.css';
const initialteacherData = JSON.parse(localStorage.getItem("teacherData")) || [
  { time: 1, course: "maths", name: "Alice" },
  { time: 2, course: "maths", name: "Bob" },
  { time: 3, course: "maths", name: "Charlie" },
  { time: 4, course: "maths", name: "David"},
  { time: 5, course: "maths", name: "Eve" },
];
export const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState(initialteacherData.map((teacher) => teacher.course));

  const addCourse = (course) => {
    setCourses((prevCourses) => [...prevCourses, course]);
  };

  const updateCourse = (oldCourse, newCourse) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => (course === oldCourse ? newCourse : course))
    );
  };

  const deleteCourse = (course) => {
    setCourses((prevCourses) => prevCourses.filter((c) => c !== course));
  };

  const contextValue = {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
}

export default function adminDashboard() {
  return (
    <CourseProvider>
      <Dashboard />
  </CourseProvider>
  );
}


function Dashboard() {
  const [teachers, setTeachers] = useState(initialteacherData);
  const [courseFilter, setCourseFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState("");
  const [newTeacher, setNewTeacher] = useState("");
  const [newtime, setNewtime] = useState("");
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [validationError, setValidationError] = useState({});
  const {addCourse, updateCourse, deleteCourse } = useContext(CourseContext);

  useEffect(() => {
    localStorage.setItem("teacherData", JSON.stringify(teachers));
  }, [teachers]);

  const applyFilters = () => {
    const normalizedCourseFilter = courseFilter.toLowerCase();
    const normalizedNameFilter = nameFilter.toLowerCase();

    const filteredTeachers = teachers.filter((teacher) => {
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

    if (newCourse === "") {
      errors.newCourse = "Course is required";
    }
    if (newTeacher === "") {
      errors.newTeacher = "Teacher Name is required";
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
      time: newtime,
    };
    setTeachers([...teachers, newTeacherData]);
    setIsAdding(false);
    setNewCourse("");
    setNewTeacher("");
    setNewtime("");
    setValidationError({});
    addCourse(newCourse);
  };

  const handleDelete = (id) => {
    const updatedTeachers = teachers.filter((teacher) => teacher.id !== id);
    deleteCourse(updatedTeachers.course); 
    setTeachers(updatedTeachers);
  };
  

  const handleEdit = (id) => {
    setEditTeacherId(id);
    const teacherToEdit = teachers.find((teacher) => teacher.id === id);
    setEditedData(teacherToEdit);
  };

  const handleSaveEdit = (id, course, teacherName, time) => {
    const updatedTeachers = teachers.map((teacher) =>
      teacher.id === id ? { ...teacher, course, teacher: teacherName, time } : teacher
    );
    updateCourse(course, editedData.course);
    setTeachers(updatedTeachers);
    setEditTeacherId(null);
    setEditedData({});
  };

  const handleEditChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  return (
    <div className="container">
      <div className="header">

      <div className="filter">
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
      </div>
      <h1>Teacher Dashboard</h1>
      <button className = "navigate-button">
        <Link to= "/studentDashboard">student dashboard </Link></button>
      </div>

      {isAdding && (
         <div className="overlay">
        <div className="add-courses">
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
              type="text"
              placeholder="time"
              value={newtime}
              onChange={(e) => setNewtime(e.target.value)}
            />
            {validationError.newtime && (
              <span className="error">{validationError.newtime}</span>
            )}
            <button type="submit">Submit</button>
          </form>
        </div>
        </div>
      )}
  <div className={isAdding ? "dashboard-blur" : "teacher-table"}>
      <button onClick={handleAddClick}>Add Courses</button>
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
          <th>time</th>
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
                  type="text"
                  value={editedData.time}
                  onChange={(e) => onEditChange(e, 'time')}
                />
              ) : (
                teacher.time
              )}
            </td>
            <td>
              {editTeacherId === teacher.id ? (
                <button onClick={() => onSave(teacher.id, editedData.course, editedData.teacher, editedData.time)}>Save</button>
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


