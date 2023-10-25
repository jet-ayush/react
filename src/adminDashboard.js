import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./admin_dashboard.css";

export default function adminDashboard() {
  return <Dashboard />;
}

function Dashboard() {
  const [teachers, setTeachers] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState("");
  const [newTeacher, setNewTeacher] = useState("");
  const [newTime, setNewtime] = useState("");
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/teachers")
      .then((response) => {
        const fetchedTeachers = response.data;
        setTeachers(fetchedTeachers);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const applyFilters = () => {
    const normalizedCourseFilter = courseFilter.toLowerCase();
    const normalizedNameFilter = nameFilter.toLowerCase();

    const filteredTeachers = teachers.filter((teacher) => {
      const matchesCourse =
        normalizedCourseFilter === "" ||
        teacher.course.toLowerCase().includes(normalizedCourseFilter);
      const matchesName =
        normalizedNameFilter === "" ||
        teacher.teacher.toLowerCase().includes(normalizedNameFilter);

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
      time: newTime,
      course: newCourse,
      name: newTeacher,
    };

    // Send a POST request to add the new course
    axios
      .post("http://localhost:5001/api/addteachers", newTeacherData)
      .then((response) => {
        console.log(response);
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error("Error adding teacher:", error);
      });

    setIsAdding(false);
    setNewCourse("");
    setNewTeacher("");
    setNewtime("");
    setValidationError({});
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5001/api/teachers/${id}`)
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error("Error deleting teacher:", error);
      });
  };

  const handleEdit = (id) => {
    setEditTeacherId(id);
    const teacherToEdit = teachers.find((teacher) => teacher.id === id);
    setEditedData(teacherToEdit);
  };

  const handleSaveEdit = (id, course, teacherName, time) => {
    // Make a PUT request to update the teacher's information
    axios
      .put(`http://localhost:5001/api/teachers/${id}`, {
        course,
        name: teacherName,
        time,
      })
      .then((response) => {
        // Update the teachers state with the updated data from the backend
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error("Error updating teacher:", error);
      });

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
        <button className="navigate-button">
          <Link to="/studentDashboard">student dashboard </Link>
        </button>
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
                value={newTime}
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

function TeacherTable({
  teachers,
  onEdit,
  onDelete,
  onSave,
  editTeacherId,
  editedData,
  onEditChange,
}) {
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
                  onChange={(e) => onEditChange(e, "teacher")}
                />
              ) : (
                teacher.name
              )}
            </td>
            <td>
              {editTeacherId === teacher.id ? (
                <input
                  type="text"
                  value={editedData.course}
                  onChange={(e) => onEditChange(e, "course")}
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
                  onChange={(e) => onEditChange(e, "time")}
                />
              ) : (
                teacher.time
              )}
            </td>
            <td>
              {editTeacherId === teacher.id ? (
                <button
                  onClick={() =>
                    onSave(
                      teacher.id,
                      editedData.course,
                      editedData.teacher,
                      editedData.time
                    )
                  }
                >
                  Save
                </button>
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
