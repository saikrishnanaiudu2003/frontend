


import React, { useState, useEffect } from 'react';
import './subindex.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const SubcomponentsPage = () => {
    const { projectId, componentId } = useParams();
    const [subComponents, setSubComponents] = useState([]);
    const [editFields, setEditFields] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [editingSubComponentId, setEditingSubComponentId] = useState(null);
    const [componentName,setComponentName]=useState("");    
    const [components, setComponents] = useState([]);
    
    const [editorData, setEditorData] = useState('');
    const [newSubComponent, setNewSubComponent] = useState({
        title: '',
        text: '',
        spanText: '',
        description: '',
        buttonText: '',
        image: null,
    });


    useEffect(() => {
        const fetchComponentName = async () => {
            try {
                const response = await axios.get(`http://localhost:5003/api/component/name/${componentId}`);
                setComponentName(response.data.component.name);
            } catch (error) {
                console.error('Error fetching component name:', error);
            }
        };
 
        fetchComponentName();
    }, [componentId]);

    useEffect(() => {
        const fetchSubComponents = async () => {
            try {
                const response = await axios.get(`http://localhost:5003/api/subComponent/${componentId}`);
                setSubComponents(response.data.subComponents || []);
            } catch (error) {
                console.error('Error fetching subcomponents:', error);
            }
        };

        fetchSubComponents();
    }, [componentId]);

    const handleEditChange = (name, data) => {
        setEditFields((prev) => ({ ...prev, [name]: data }));
    };

    const handleEditorChange = (name, event, editor) => {
        const data = editor.getData();
        handleEditChange(name, data);
    };

    const handleEditSave = async (subComponentId) => {
        const formData = new FormData();
        for (const key in editFields) {
            formData.append(key, editFields[key]);
        }
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await axios.put(`http://localhost:5003/api/subComponent/update/${subComponentId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSubComponents(subComponents.map(subComponent => 
                subComponent._id === subComponentId ? response.data.subComponent : subComponent
            ));
            setEditingSubComponentId(null);
            setEditFields({});
            setImageFile(null);
        } catch (error) {
            console.error('Error updating subcomponent:', error);
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
        setEditingSubComponentId(subComponent._id);
        setEditFields(subComponent);
    };

    const cancelEditing = () => {
        setEditingSubComponentId(null);
        setEditFields({});
        setImageFile(null);
    };

    const handleNewSubComponentChange = (name, data) => {
        setNewSubComponent((prev) => ({ ...prev, [name]: data }));
    };

    const handleNewEditorChange = (name, event, editor) => {
        const data = editor.getData();
        handleNewSubComponentChange(name, data);
    };

    const handleNewSubComponentSave = async () => {
        const formData = new FormData();
        for (const key in newSubComponent) {
            formData.append(key, newSubComponent[key]);
        }
        if (newSubComponent.image) {
            formData.append('image', newSubComponent.image);
        }

        try {
            const response = await axios.post(`http://localhost:5003/api/subComponent/create/${componentId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSubComponents([...subComponents, response.data.subComponent]);
            setNewSubComponent({
                title: '',
                text: '',
                spanText: '',
                description: '',
                buttonText: '',
                image: null,
            });
        } catch (error) {
            console.error('Error creating subcomponent:', error);
        }
    };


    const handleCreateComponent = async () => {
        if (!editorData.trim()) {
            alert('Component content cannot be empty.');
            return;
        }
 
        try {
            const response = await axios.post(`http://localhost:5000/api/component/create/${projectId}`, {
                name: editorData, // Adjust if necessary to match backend schema
                htmlContent: editorData // Send HTML content to backend
            });
            console.log('Component created:', response.data);
 
            const updatedComponentsResponse = await axios.get(`http://localhost:5000/api/component/${projectId}`);
            setComponents(updatedComponentsResponse.data.components);
 
            setEditorData('');
        } catch (error) {
            console.error('Error creating component:', error);
        }
    };


    return (
        <div style={{display:"flex",justifyContent:"center",width:"100vw",margin:"unsent !important"}}>
            <div>
            <h2>Subcomponents for Component {componentName}</h2>

            <h3>Add New Subcomponent</h3>
            <div style={{display:"flex",flexWrap:"wrap",gap:"20px",justifyContent:"center",alignItems:"center"}}>
                <label>
                    Title:
                    <CKEditor
                        editor={ClassicEditor}
                        data={newSubComponent.title || ''}
                        onChange={(event, editor) => handleNewEditorChange('title', event, editor)}
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
                </label>
                <label>
                    Text:
                    <CKEditor
                        editor={ClassicEditor}
                        data={newSubComponent.text || ''}
                        onChange={(event, editor) => handleNewEditorChange('text', event, editor)}
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
                </label>
                <label>
                    Span Text:
                    <CKEditor
                        editor={ClassicEditor}
                        data={newSubComponent.spanText || ''}
                        onChange={(event, editor) => handleNewEditorChange('spanText', event, editor)}
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
                </label>
                <label>
                    Description:
                    <CKEditor
                        editor={ClassicEditor}
                        data={newSubComponent.description || ''}
                        onChange={(event, editor) => handleNewEditorChange('description', event, editor)}
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
                </label>
                <label>
                    Button Text:
                    <CKEditor
                        editor={ClassicEditor}
                        data={newSubComponent.buttonText || ''}
                        onChange={(event, editor) => handleNewEditorChange('buttonText', event, editor)}
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
                </label>
                <label>
                    Image:
                    <input
                        type="file"
                        name="image"
                        onChange={(e) => setNewSubComponent((prev) => ({ ...prev, image: e.target.files[0] }))}
                    />
                </label>
                <button className='main-add-utton' style={{width:"100px",height:"60px",backgroundColor:"green"}} onClick={handleNewSubComponentSave}>Add</button>
            </div>

            <h3>Existing Subcomponents</h3>
            <ul style={{listStyle:"none"}}> 
                {subComponents.length > 0 ? (
                    subComponents.map((subComponent) => (
                        <li key={subComponent._id}>
                            {editingSubComponentId === subComponent._id ? (
                                <div>
                                    <label>
                                        Title:
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={editFields.title || ''}
                                            onChange={(event, editor) => handleEditorChange('title', event, editor)}
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
                                    </label>
                                    <label>
                                        Text:
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={editFields.text || ''}
                                            onChange={(event, editor) => handleEditorChange('text', event, editor)}
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
                                    </label>
                                    <label>
                                        Span Text:
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={editFields.spanText || ''}
                                            onChange={(event, editor) => handleEditorChange('spanText', event, editor)}
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
                                    </label>
                                    <label>
                                        Description:
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={editFields.description || ''}
                                            onChange={(event, editor) => handleEditorChange('description', event, editor)}
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
                                    </label>
                                    <label>
                                        Button Text:
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={editFields.buttonText || ''}
                                            onChange={(event, editor) => handleEditorChange('buttonText', event, editor)}
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
                                    </label>
                                    <label>
                                        Image:
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                        />
                                    </label>
                                    <button  className='main-add-utton' style={{width:"100px",height:"60px",backgroundColor:"green",}} onClick={() => handleEditSave(subComponent._id)}>Save</button>
                                    <button  className='main-add-utton' style={{width:"100px",height:"60px",backgroundColor:"green",marginLeft:"20px"}} onClick={cancelEditing}>Cancel</button>
                                </div>
                            ) : (
                              <>
                            
                                <div>
                                    <p><strong style={{fontSize:"20px"}}>Title:</strong> <span dangerouslySetInnerHTML={{ __html: subComponent.title || 'null' }} /></p>
                                    <p><strong style={{fontSize:"5px",textAlign:"left"}}>Text:</strong> <span dangerouslySetInnerHTML={{ __html: subComponent.text || 'null' }} /></p>
                                    <p><strong style={{fontSize:"20px"}}>Span Text:</strong> <span dangerouslySetInnerHTML={{ __html: subComponent.spanText || 'null' }} /></p>
                                    <p><strong style={{fontSize:"20px"}}> Description:</strong> <span dangerouslySetInnerHTML={{ __html: subComponent.description || 'null' }} /></p>
                                    <p><strong style={{fontSize:"20px"}}>Button Text:</strong> <span dangerouslySetInnerHTML={{ __html: subComponent.buttonText || 'null' }} /></p>
                                    <p><strong>Image:</strong> 
                                        {subComponent.image ? (
                                            <img src={`http://localhost:5000/api/images/${subComponent.image}`} alt={subComponent.title} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                        ) : (
                                            'null'
                                        )}
                                    </p>
                                    <button  className='main-add-utton' style={{width:"100px",height:"60px",backgroundColor:"green"}} onClick={() => startEditing(subComponent)}>Edit</button>
                                    <button  className='main-add-utton' style={{width:"100px",height:"60px",backgroundColor:"green",marginLeft:"20px"}} onClick={() => handleDelete(subComponent._id)}>Delete</button>
                                </div>
                                </>
                            )}
                        </li>
                    ))
                ) : (
                    <p>No subcomponents available for this component</p>
                )}
            </ul>
        </div>
        </div>
    );
};

export default SubcomponentsPage;
