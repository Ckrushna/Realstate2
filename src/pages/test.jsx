import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState({
    name: "",
    wing: "",
    floor: "",
    flat: "",
    image: null,
  });
  const [searchName, setSearchName] = useState(""); // State for search input
  const [searchedProject, setSearchedProject] = useState(null); // State to store searched project

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image") {
      setProjectData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setProjectData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!projectData.image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", projectData.name);
    formData.append("wing", projectData.wing);
    formData.append("floor", projectData.floor);
    formData.append("flat", projectData.flat);
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
      navigate("/LoginSign");
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the project.");
    }
  };

  const handleSearch = async () => {
    try {
      const response = await api.get(`/projects?name=${searchName}`);
      if (response.data.length > 0) {
        setSearchedProject(response.data[0]);
      } else {
        alert("No project found with this name.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while searching for the project.");
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch projects. Please try again later.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
          <label>Number of Flats:</label>
          <input
            type="number"
            name="flat"
            value={projectData.flat}
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
          placeholder="kk"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {searchedProject && (
        <div className="searched-project">
          <h4>{searchedProject.name}</h4>
          <p>Wings: {searchedProject.wing}</p>
          <p>Floors: {searchedProject.floor}</p>
          <p>Flats: {searchedProject.flat}</p>
          {searchedProject.image && (
            <img
              src={searchedProject.image} // Adjust the URL if needed
              alt={searchedProject.name}
              className="project-image"
            />
          )}
        </div>
      )}

      
    </div>
  );
};

export default AddProject;
