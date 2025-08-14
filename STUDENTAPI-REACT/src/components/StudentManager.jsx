import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import config from './config.js';

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({
    id: '',
    name: '',
    gender: '',
    department: '',
    program: '',
    year: '',
    semester: '',
    email: '',
    password: '',
    contact: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedStudent, setFetchedStudent] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${config.url}/studentapi`;

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setStudents(res.data);
    } catch (error) {
      setMessage('Failed to fetch students.');
    }
  };

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };


  const validateForm = () => {
    for (let key in student) {
      if (!student[key] || student[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addStudent = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, student);
      setMessage('Student added successfully.');
      fetchAllStudents();
      resetForm();
    } catch (error) {
      setMessage('Error adding student.');
    }
  };

  const updateStudent = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, student);
      setMessage('Student updated successfully.');
      fetchAllStudents();
      resetForm();
    } catch (error) {
      setMessage('Error updating student.');
    }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllStudents();
    } catch (error) {
      setMessage('Error deleting student.');
    }
  };

  const getStudentById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedStudent(res.data);
      setMessage('');
    } catch (error) {
      setFetchedStudent(null);
      setMessage('Student not found.');
    }
  };

  const handleEdit = (stud) => {
    setStudent(stud);
    setEditMode(true);
    setMessage(`Editing student with ID ${stud.id}`);
  };

  const resetForm = () => {
    setStudent({
      id: '',
      name: '',
      gender: '',
      department: '',
      program: '',
      year: '',
      semester: '',
      email: '',
      password: '',
      contact: ''
    });
    setEditMode(false);
  };

  return (
    <div className="student-container">

{message && (
  <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
    {message}
  </div>
)}


      <h2>Student Management - Happy Independence</h2>

      <div>
        <h3>{editMode ? 'Edit Student' : 'Add Student'}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="ID" value={student.id} onChange={handleChange} />
          <input type="text" name="name" placeholder="Name" value={student.name} onChange={handleChange} />
          <select name="gender" value={student.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
          <select name="department" value={student.department} onChange={handleChange}>
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="CS&IT">CS&IT</option>
          </select>
          <select name="program" value={student.program} onChange={handleChange}>
            <option value="">Select Program</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
          </select>
          <select name="year" value={student.year} onChange={handleChange}>
            <option value="">Select Year</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <select name="semester" value={student.semester} onChange={handleChange}>
            <option value="">Select Semester</option>
            <option value="ODD">ODD</option>
            <option value="EVEN">EVEN</option>
          </select>
          <input type="email" name="email" placeholder="Email" value={student.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={student.password} onChange={handleChange} />
          <input type="text" name="contact" placeholder="Contact" value={student.contact} onChange={handleChange} />
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addStudent}>Add Student</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateStudent}>Update Student</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3>Get Student By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
        />
        <button className="btn-blue" onClick={getStudentById}>Fetch</button>

        {fetchedStudent && (
          <div>
            <h4>Student Found:</h4>
            <pre>{JSON.stringify(fetchedStudent, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Students</h3>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(student).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stud) => (
                  <tr key={stud.id}>
                    {Object.keys(student).map((key) => (
                      <td key={key}>{stud[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(stud)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteStudent(stud.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default StudentManager;
