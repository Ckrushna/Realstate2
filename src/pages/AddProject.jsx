import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import './AddProject.css';


const AddProject = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalFlats, setTotalFlats] = useState(0);
  const [projectData, setProjectData] = useState({
    name: "",
    wing: "",
    floor: "",
    series: "",
    image: null,
  });
  const [searchName, setSearchName] = useState(""); // State for search input
  const [searchedProject, setSearchedProject] = useState(null); // State to store searched project
  const [projectName, setProjectName] = useState(''); // Holds the input value for the project name
  const [message, setMessage] = useState(''); // Holds success or error messages
  
  const handleInputChange = (event) => {
    const { name, value, files } = event.target;

    const updatedData = {
      ...projectData,
      [name]: name === "image" ? files[0] : value,
    };

    setProjectData(updatedData);

    if (name !== "image") {
      const wing = parseInt(name === "wing" ? value : updatedData.wing) || 0;
      const floor = parseInt(name === "floor" ? value : updatedData.floor) || 0;
      const series = parseInt(name === "series" ? value : updatedData.series) || 0;
      setTotalFlats(wing * floor * series);
    }
  };

   const handleSubmit = async (event) => {
    event.preventDefault();
    navigate('/AddProject'); 
    if (!projectData.image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", projectData.name);
    formData.append("wing", projectData.wing);
    formData.append("floor", projectData.floor);
    formData.append("series", projectData.series);
    formData.append("image", projectData.image);

    try {
      const response = await api.post("/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Project added successfully!");
      setProjectData({
        name: "",
        wing: "",
        floor: "",
        flat: "",
        image: null,
      });
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the project.");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await api.get(`/projects?name=${searchName}`); // Pass 'name' as a query parameter
      setSearchedProject(response.data); // Store the retrieved project in state
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert("No project found with this name.");
      } else {
        console.error(err);
        alert("An error occurred while searching for the project.");
      }
    }
  };
  const handleDelete = async () => {
    try {
      const response = await api.delete(`/projects${projectName}`); // Call DELETE API with project name
      setMessage(`Project "${response.data.name}" deleted successfully!`); // Success message
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMessage('No project found with this name.'); // Error message for 404
      } else {
        console.error(err);
        setMessage('An error occurred while deleting the project.'); // Generic error message
      }
    }
  };
  return (
    <div className="projects-container">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label>Project Name:</label>
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleInputChange}
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="form-group">
          <label>Number of Wings:</label>
          <input
            type="number"
            name="wing"
            value={projectData.wing}
            onChange={handleInputChange}
            placeholder="Enter number of wings"
            required
          />
        </div>

        <div className="form-group">
          <label>Number of Floors:</label>
          <input
            type="number"
            name="floor"
            value={projectData.floor}
            onChange={handleInputChange}
            placeholder="Enter number of floors"
            required
          />
        </div>

        <div className="form-group">
          <label>Number of Series:</label>
          <input
            type="number"
            name="series"
            value={projectData.series}
            onChange={handleInputChange}
            placeholder="Enter number of flats"
            required
          />
        </div>

        <div className="form-group">
          <label>Logo:</label>
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            accept=".jpg, .jpeg, .png, .gif"
            required
          />
        </div>

        <div className="form-group">
          <label>Total Flats:</label>
          <input
            type="number"
            value={totalFlats}
            onChange={handleInputChange}
            readOnly
            className="readonly-input"
          />
        </div>

        <button type="submit" className="submit-button">
          Add Project
        </button>
      </form>

      <h3>Search for a Project</h3>
<div className="form-group">
  <input
    type="text"
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    placeholder="Enter project name"
    className="search-input"
  />
  <button onClick={handleSearch} className="search-button">
    Search
  </button>
</div>

{searchedProject ? (
  <div className="searched-project">
    <h4>Project Name: {searchedProject.name}</h4>
    <p><strong>Wings:</strong> {searchedProject.wing}</p>
    <p><strong>Floors:</strong> {searchedProject.floor}</p>
    <p><strong>Series:</strong> {searchedProject.series}</p>
    {searchedProject.image ? (
      <img
        src={`http://localhost:8000/${searchedProject.image}`} // Adjust base URL if needed
        alt={`${searchedProject.name} logo`}
        className="project-image"
      />
    ) : (
      <p>No image available</p>
    )}
  </div>
) : (
  <p>No project data found. Try searching for a valid project.</p>
)}
<div style={{ padding: '20px', border: '1px solid black', width: '400px' }}>
      <h3>Delete Project</h3>
      <input
        type="text"
        placeholder="Enter project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
      />
      <button
        onClick={handleDelete}
        style={{ padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Delete Project
      </button>

      {message && <p style={{ marginTop: '10px', color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
    </div>
  

      
    </div>
  );
};

export default AddProject;
