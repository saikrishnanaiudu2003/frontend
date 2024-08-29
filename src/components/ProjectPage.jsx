import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './project.css';
import axios from 'axios';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const ProjectPage = () => {
    const [editorData, setEditorData] = useState('');
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5003/api/projects/all-projects');
                console.log('Fetched projects:', response.data); // Log response data
                
                if (response.data && Array.isArray(response.data.projects)) {
                    setProjects(response.data.projects);
                } else {
                    console.error('Expected response data to have a "projects" array:', response.data);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
    };

    const handleCreateProject = async () => {
        if (!editorData.trim()) {
            alert('Project content cannot be empty.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5003/api/projects/create', {
                name: editorData 
            });
            
            if (response.data && response.data._id && response.data.name) {
                setProjects((prevProjects) => [...prevProjects, response.data]);
                setEditorData('');
            } else {
                console.error('Unexpected response data:', response.data);
            }
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleProjectSelect = (projectId) => {
        navigate(`/project/${projectId}/components`);
    };

    return (
        <div className="project-page-container">
            <div className="project-page-content">
                <h2>Create a New Project</h2>
                <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={handleEditorChange}
                    config={{
                        toolbar: {
                            items: [
                                'heading', '|',
                                'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                                'fontColor', 'fontBackgroundColor', '|',
                                'undo', 'redo'
                            ],
                        },
                    }}
                />
                <button className="create-project-button" onClick={handleCreateProject}>Create Project</button>

                <h3>Existing Projects</h3>
                <ul className="projects-list">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <li key={project._id} onClick={() => handleProjectSelect(project._id)}>
                                <div dangerouslySetInnerHTML={{ __html: project.name }} />
                            </li>
                        ))
                    ) : (
                        <p className="no-projects">No projects available</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ProjectPage;
