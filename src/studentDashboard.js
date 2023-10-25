import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./admin_dashboard.css";

const initialStudentData = JSON.parse(localStorage.getItem("studentData")) || [
  { id: 1, course: "maths", name: "Alice", phone: 0 },
  { id: 2, course: "maths", name: "Bob", phone: 0 },
  { id: 3, course: "maths", name: "Charlie", phone: 0 },
  { id: 4, course: "maths", name: "David", phone: 0 },
  { id: 5, course: "maths", name: "Eve", phone: 8630877198 },
];
export default function studentDashboard() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

function Dashboard() {
  const [students, setstudents] = useState(initialStudentData);
  const [courseFilter, setCourseFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState("");
  const [newstudent, setNewstudent] = useState("");
  const [newId, setId] = useState("");
  const [editstudentId, setEditstudentId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    localStorage.setItem("studentData", JSON.stringify(students));
  }, [students]);

  const applyFilters = () => {
    const normalizedCourseFilter = courseFilter.toLowerCase();
    const normalizedNameFilter = nameFilter.toLowerCase();

    const filteredStudents = students.filter((student) => {
      const matchesCourse =
        !normalizedCourseFilter ||
        (student.course &&
          student.course.toLowerCase().includes(normalizedCourseFilter));
      const matchesName =
        !normalizedNameFilter ||
        (student.name &&
          student.name.toLowerCase().includes(normalizedNameFilter));

      return matchesCourse && matchesName;
    });

    setstudents(filteredStudents);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newstudentData = {
      id: newId,
      course: newCourse,
      name: newstudent,
      phone: newPhone,
    };
    setstudents([...students, newstudentData]);
    setIsAdding(false);
    setNewCourse("");
    setId("");
    setNewstudent("");
    setNewPhone("");
  };

  const handleDelete = (id) => {
    const updatedstudents = students.filter((student) => student.id !== id);
    setstudents(updatedstudents);
  };

  const handleEdit = (id) => {
    setEditstudentId(id);
    const studentToEdit = students.find((student) => student.id === id);
    setEditedData(studentToEdit);
  };

  const handleSaveEdit = (id, course, studentName) => {
    const updatedstudents = students.map((student) =>
      student.id === id ? { ...student, course, student: studentName } : student
    );
    setstudents(updatedstudents);
    setEditstudentId(null);
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
        <h1>student Dashboard</h1>
        <button className="navigate-button">
          <Link to="/">teacher dashboard </Link>
        </button>
      </div>
      {isAdding && (
        <div className="overlay">
          <div className="add-courses">
            <form onSubmit={handleFormSubmit}>
              <input
                type="number"
                placeholder="id"
                value={newId}
                required
                onChange={(e) => setId(e.target.value)}
              />
              <select
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
              >
                <option value="">Select a Course</option>
                {/* {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))} */}
              </select>
              <input
                type="text"
                placeholder="student Name"
                value={newstudent}
                required
                onChange={(e) => setNewstudent(e.target.value)}
              />
              <input
                type="number"
                placeholder="student ph no"
                value={newPhone}
                required
                onChange={(e) => setNewPhone(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      <div className={isAdding ? "dashboard-blur" : "teacher-table"}>
        <button onClick={handleAddClick}>Add Courses</button>
        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSave={handleSaveEdit}
          editstudentId={editstudentId}
          editedData={editedData}
          onEditChange={handleEditChange}
        />
      </div>
    </div>
  );
}

function StudentTable({
  students,
  onEdit,
  onDelete,
  onSave,
  editstudentId,
  editedData,
  onEditChange,
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>student id</th>
          <th>student Name</th>
          <th>Course Name</th>
          <th>Phone no</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>
              {editstudentId === student.id ? (
                <input
                  type="number"
                  value={editedData.id}
                  required
                  onChange={(e) => onEditChange(e, "id")}
                />
              ) : (
                student.id
              )}
            </td>
            <td>
              {editstudentId === student.id ? (
                <input
                  type="text"
                  value={editedData.student}
                  onChange={(e) => onEditChange(e, "student")}
                />
              ) : (
                student.name
              )}
            </td>
            <td>
              {editstudentId === student.id ? (
                <input
                  type="text"
                  value={editedData.course}
                  onChange={(e) => onEditChange(e, "course")}
                />
              ) : (
                student.course
              )}
            </td>
            <td>
              {editstudentId === student.id ? (
                <input
                  type="number"
                  value={editedData.phone}
                  onChange={(e) => onEditChange(e, "phone")}
                />
              ) : (
                student.phone
              )}
            </td>
            <td>
              {editstudentId === student.id ? (
                <button
                  onClick={() =>
                    onSave(
                      student.id,
                      editedData.course,
                      editedData.student,
                      editedData.phone
                    )
                  }
                >
                  Save
                </button>
              ) : (
                <>
                  <button onClick={() => onEdit(student.id)}>Edit</button>
                  <button onClick={() => onDelete(student.id)}>Delete</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
