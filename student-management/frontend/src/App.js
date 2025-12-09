import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [stuClass, setStuClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get(API_URL)
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStu = { name, age: Number(age), class: stuClass };
    
    if (editingId) {
      // Update existing student
      axios.put(`${API_URL}/${editingId}`, newStu)
        .then(res => {
          console.log("Đã cập nhật:", res.data);
          setStudents(prev => prev.map(s => s._id === editingId ? res.data : s));
          resetForm();
        })
        .catch(err => console.error("Lỗi khi cập nhật:", err));
    } else {
      // Add new student
      axios.post(API_URL, newStu)
        .then(res => {
          console.log("Đã thêm:", res.data);
          setStudents(prev => [...prev, res.data]);
          resetForm();
        })
        .catch(err => console.error("Lỗi khi thêm:", err));
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setAge(student.age.toString());
    setStuClass(student.class);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;
    
    axios.delete(`${API_URL}/${id}`)
      .then(res => {
        console.log(res.data.message);
        setStudents(prevList => prevList.filter(s => s._id !== id));
      })
      .catch(err => console.error("Lỗi khi xóa:", err));
  };

  const resetForm = () => {
    setName('');
    setAge('');
    setStuClass('');
    setEditingId(null);
  };

  // Filter students based on search term
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return sortAsc ? -1 : 1;
    if (a.name.toLowerCase() > b.name.toLowerCase()) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quản Lý Học Sinh</h1>
      </header>
      
      <div className="container">
        {/* Add/Edit Student Form */}
        <div className="form-section">
          <h2>{editingId ? 'Chỉnh Sửa Học Sinh' : 'Thêm Học Sinh Mới'}</h2>
          <form onSubmit={handleAddStudent}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Họ tên"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Tuổi"
                value={age}
                onChange={e => setAge(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Lớp"
                value={stuClass}
                onChange={e => setStuClass(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Cập nhật' : 'Thêm học sinh'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search and Sort Controls */}
        <div className="controls">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setSortAsc(prev => !prev)} className="btn-sort">
            Sắp xếp theo tên: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>

        {/* Student List */}
        <div className="student-list">
          <h2>Danh Sách Học Sinh</h2>
          {sortedStudents.length === 0 ? (
            <p className="empty-message">
              {searchTerm ? 'Không tìm thấy học sinh nào' : 'Chưa có học sinh nào'}
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Họ Tên</th>
                  <th>Tuổi</th>
                  <th>Lớp</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map(student => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.age}</td>
                    <td>{student.class}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(student)} className="btn-edit">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(student._id)} className="btn-delete">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
