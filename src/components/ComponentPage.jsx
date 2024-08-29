import React, { useState, useEffect } from 'react';
import './Component.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import EditComponent from './EditComponent'; 
import Modal from './Modal'; // Import the modal component
import CreateComponentModal from './CreateComponentModal'; // Import the create component modal
import CreateSubComponentModal from './CreateSubComponentModal';

const ProjectComponentsPage = () => {
    const { projectId } = useParams();
    const [components, setComponents] = useState([]);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [subComponents, setSubComponents] = useState([]);
    const [editorData, setEditorData] = useState('');
    const [isExpanded, setIsExpanded] = useState({});
    const [editingSubComponent, setEditingSubComponent] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage edit modal visibility
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State to manage create modal visibility
    const [isCreateSubComponentModalOpen, setIsCreateSubComponentModalOpen] = useState(false); // State for subcomponent modal
const [newSubComponentData, setNewSubComponentData] = useState({
    title: '',
    text: '',
    spanText: '',
    description: '',
    buttonText: '',
    image: null
});


    useEffect(() => {
        const fetchComponents = async () => {
            try {
                const response = await axios.get(`http://localhost:5003/api/component/${projectId}`);
                const fetchedComponents = response.data.components || [];
                
                setComponents(fetchedComponents);
                
                if (fetchedComponents.length > 0) {
                    setSelectedComponent(fetchedComponents[0]);
                    
                    const subComponentsResponse = await axios.get(`http://localhost:5003/api/subcomponent/${fetchedComponents[0]._id}`);
                    setSubComponents(subComponentsResponse.data.subComponents || []);
                }
            } catch (error) {
                console.error('Error fetching components:', error);
            }
        };

        fetchComponents();
    }, [projectId]);

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);
    };

    const handleCreateComponent = async () => {
        if (!editorData.trim()) {
            alert('Component content cannot be empty.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5003/api/component/create/${projectId}`, {
                name: editorData,
                htmlContent: editorData
            });
            console.log('Component created:', response.data);

            const updatedComponentsResponse = await axios.get(`http://localhost:5003/api/component/${projectId}`);
            setComponents(updatedComponentsResponse.data.components);

            setEditorData('');
            setIsCreateModalOpen(false); // Close the create component modal
        } catch (error) {
            console.error('Error creating component:', error);
        }
    };

    const handleDelete = async (subComponentId) => {
        try {
            await axios.delete(`http://localhost:5003/api/subcomponent/${subComponentId}`);
            setSubComponents(subComponents.filter(subComponent => subComponent._id !== subComponentId));
        } catch (error) {
            console.error('Error deleting subcomponent:', error);
        }
    };

    const startEditing = (subComponent) => {
        setEditingSubComponent(subComponent); // Set the subcomponent to edit
        setIsModalOpen(true); // Open the edit modal
    };

    const cancelEditing = () => {
        setEditingSubComponent(null); // Clear the editing state
        setIsModalOpen(false); // Close the edit modal
    };

    const toggleReadMore = (id) => {
        setIsExpanded(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const renderContent = (content, id) => {
        if (!content) return 'null';

        const maxLength = 100;
        const contentText = new DOMParser().parseFromString(content, 'text/html').body.textContent || '';

        if (contentText.length <= maxLength || isExpanded[id]) {
            return <span dangerouslySetInnerHTML={{ __html: content }} />;
        }

        const truncatedText = contentText.slice(0, maxLength) + '...';
        return (
            <>
                <span dangerouslySetInnerHTML={{ __html: truncatedText }} />
                <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => toggleReadMore(id)}>
                    {isExpanded[id] ? ' Show Less' : ' Read More'}
                </span>
            </>
        );
    };

    const handleComponentSelect = async (componentId) => {
        try {
            const selected = components.find(component => component._id === componentId);
            setSelectedComponent(selected);
            
            const response = await axios.get(`http://localhost:5003/api/subcomponent/${componentId}`);
            setSubComponents(response.data.subComponents || []);
        } catch (error) {
            console.error('Error fetching subcomponents:', error);
        }
    };
    const handleCreateSubComponent = async () => {
        const { title, text, spanText, description, buttonText, image } = formData;
        const componentId = selectedComponent._id; // Make sure selectedComponent is set correctly
    
        // Prepare form data for submission
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('title', title);
        formDataToSubmit.append('text', text);
        formDataToSubmit.append('spanText', spanText);
        formDataToSubmit.append('description', description);
        formDataToSubmit.append('buttonText', buttonText);
        if (image) {
            formDataToSubmit.append('image', image);
        }
    
        try {
            // Post data to backend
            await axios.post(`http://localhost:5003/api/subcomponent/create/${componentId}`, formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Subcomponent created successfully');
    
            // Fetch updated list of subcomponents
            const subComponentsResponse = await axios.get(`http://localhost:5003/api/subcomponent/${componentId}`);
            setSubComponents(subComponentsResponse.data.subComponents || []);
    
            // Reset form data
            setFormData({
                title: '',
                text: '',
                spanText: '',
                description: '',
                buttonText: '',
                image: null
            });
            setIsCreateSubComponentModalOpen(false); // Close modal
        } catch (error) {
            console.error('Error creating subcomponent:', error);
        }
    };
    
    return (
        <div className="project-components-page" style={{ display: 'flex' }}>
            <div style={{ 
    width: '20%', 
    position: 'fixed', 
    left: '0', 
    top: '0', 
    height: '100vh', 
    overflowY: 'auto', 
    overflowX: 'hidden', 
    borderRight: '1px solid #ddd' 
}}>
   
    <button 
                  style={{ position: "fixed", top:"10px", left:"300px", backgroundColor: "green" }} 
                  onClick={() => setIsCreateModalOpen(true)} // Open create modal on button click
              >
                  Create Component
              </button>
    <ul style={{ 
        padding: '0', 
        margin: '0', 
        listStyleType: 'none' 
    }}>
        {components.length > 0 ? (
            components.map((component) => (
                <>
                <li key={component._id} 
                    onClick={() => handleComponentSelect(component._id)} 
                    style={{ 
                        padding: '10px', 
                        cursor: 'pointer', 
                        borderBottom: '1px solid #ddd' 
                    }}
                >
                    {component.name}
                </li>
               
              </>
            ))
        ) : (
            <p className="no-components">No components available for this project</p>
        )}
    </ul>
</div>

          <button style={{backgroundColor:"green",position:"fixed",right:"0",top:"10px"}} onClick={() => setIsCreateSubComponentModalOpen(!isCreateSubComponentModalOpen)}>Create SubComponent</button>
            <div style={{ width: '80%', marginLeft: "20%" }}>
                {selectedComponent ? (
                    <div>
                        <h2>{selectedComponent.name}</h2>
                        <ul className="subcomponents-list" style={{ display: "flex", flexWrap: "wrap" }}>
                            {subComponents.length > 0 ? (
                                subComponents.map((subComponent) => (
                                    <div key={subComponent._id} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "500px", height: "auto", border: "1px solid black", marginTop: "10px", padding: "10px", marginLeft: "10px", overflow: 'hidden' }}>
                                            <p><strong style={{ fontSize: "20px" }}>Title:</strong> {renderContent(subComponent.title, subComponent._id)}</p>
                                            <p><strong style={{ fontSize: "20px" }}>Text:</strong> {renderContent(subComponent.text, subComponent._id)}</p>
                                            <p><strong style={{ fontSize: "20px" }}>Span Text:</strong> {renderContent(subComponent.spanText, subComponent._id)}</p>
                                            <p><strong style={{ fontSize: "20px" }}>Description:</strong> {renderContent(subComponent.description, subComponent._id)}</p>
                                            <p><strong style={{ fontSize: "20px" }}>Button Text:</strong> {renderContent(subComponent.buttonText, subComponent._id)}</p>
                                            <p><strong>Image:</strong>
                                                {subComponent.image ? (
                                                    <img src={`http://localhost:5000/api/images/${subComponent.image}`} alt={subComponent.title} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                                ) : (
                                                    'null'
                                                )}
                                            </p>
                                            <button className='main-add-button' style={{ width: "100px", height: "60px", backgroundColor: "green" }} onClick={() => startEditing(subComponent)}>Edit</button>
                                            <button className='main-add-button' style={{ width: "100px", height: "60px", backgroundColor: "red", marginLeft: "20px" }} onClick={() => handleDelete(subComponent._id)}>Delete</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-subcomponents">No subcomponents available for this component</p>
                            )}
                        </ul>

                        <Modal isOpen={isModalOpen} onClose={cancelEditing}>
                            {editingSubComponent && (
                                <EditComponent
                                    subComponent={editingSubComponent}
                                    onSave={() => {
                                        // Refresh the subcomponents list
                                        handleComponentSelect(selectedComponent._id);
                                        cancelEditing();
                                    }}
                                    onCancel={cancelEditing}
                                />
                            )}
                        </Modal>

                        {isCreateSubComponentModalOpen && (
    <CreateSubComponentModal
        onClose={() => setIsCreateSubComponentModalOpen(false)}
        onSave={handleCreateSubComponent}
        formData={newSubComponentData}
        setFormData={setNewSubComponentData}
    />
)}
                        <CreateComponentModal 
                            isOpen={isCreateModalOpen} 
                            onClose={() => setIsCreateModalOpen(false)} 
                            editorData={editorData}
                            setEditorData={setEditorData}
                            handleCreateComponent={handleCreateComponent}
                        />
                        
                    </div>
                ) : (
                    <p>Select a component to view details</p>
                )}
            </div>
        </div>
    );
};

export default ProjectComponentsPage;
