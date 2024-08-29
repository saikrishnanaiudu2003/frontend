import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

const EditComponent = ({ subComponent, onSave, onCancel }) => {
    const [editFields, setEditFields] = useState({
        title: '',
        text: '',
        spanText: '',
        description: '',
        buttonText: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (subComponent) {
            setEditFields({
                title: subComponent.title || '',
                text: subComponent.text || '',
                spanText: subComponent.spanText || '',
                description: subComponent.description || '',
                buttonText: subComponent.buttonText || ''
            });
        }
    }, [subComponent]);

    const handleEditorChange = (field, event, editor) => {
        const data = editor.getData();
        setEditFields(prevFields => ({
            ...prevFields,
            [field]: data
        }));
    };

    const handleEditSave = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('title', editFields.title);
        formData.append('text', editFields.text);
        formData.append('spanText', editFields.spanText);
        formData.append('description', editFields.description);
        formData.append('buttonText', editFields.buttonText);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await axios.put(`http://localhost:5003/api/subcomponent/update/${subComponent._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            onSave();
        } catch (error) {
            console.error('Error updating subcomponent:', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelEditing = () => {
        onCancel(); // Notify parent component to cancel editing
    };

    return (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "30px" }}>
            <label style={{ width: "300px" }}>
                Title:
                <CKEditor
                    editor={ClassicEditor}
                    data={editFields.title}
                    onChange={(event, editor) => handleEditorChange('title', event, editor)}
                />
            </label>
            <label style={{ width: "300px" }}>
                Text:
                <CKEditor
                    editor={ClassicEditor}
                    data={editFields.text}
                    onChange={(event, editor) => handleEditorChange('text', event, editor)}
                />
            </label>
            <label style={{ width: "300px" }}>
                Span Text:
                <CKEditor
                    editor={ClassicEditor}
                    data={editFields.spanText}
                    onChange={(event, editor) => handleEditorChange('spanText', event, editor)}
                />
            </label>
            <label style={{ width: "300px" }}>
                Description:
                <CKEditor
                    editor={ClassicEditor}
                    data={editFields.description}
                    onChange={(event, editor) => handleEditorChange('description', event, editor)}
                />
            </label>
            <label style={{ width: "300px" }}>
                Button Text:
                <CKEditor
                    editor={ClassicEditor}
                    data={editFields.buttonText}
                    onChange={(event, editor) => handleEditorChange('buttonText', event, editor)}
                />
            </label>
            <label style={{ width: "300px" }}>
                Image:
                <input
                    type="file"
                    name="image"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
            </label>
            <button className='main-add-button' style={{ width: "100px", height: "60px", backgroundColor: "green" }} onClick={handleEditSave}>Save</button>
            <button className='main-add-button' style={{ width: "100px", height: "60px", backgroundColor: "green", marginLeft: "20px" }} onClick={cancelEditing}>Cancel</button>
        </div>
    );
};

export default EditComponent;
