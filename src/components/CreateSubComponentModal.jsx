import React from 'react';
import './Modal.css'; // Import CSS for modal styling
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreateSubComponentModal = ({ onClose, onSave, formData, setFormData }) => {
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleEditorChange = (editor, field) => {
        setFormData({ ...formData, [field]: editor.getData() });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" >
                <h2>Create SubComponent</h2>
                <form onSubmit={handleSubmit} style={{display:"flex",flexWrap:"wrap"}}>
                    <label style={{width:"400px"}}>
                        Title:
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.title}
                            onChange={(event, editor) => handleEditorChange(editor, 'title')}
                        />
                    </label>
                    <label style={{width:"400px"}}>
                        Text:
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.text}
                            onChange={(event, editor) => handleEditorChange(editor, 'text')}
                        />
                    </label>
                    <label style={{width:"400px"}}>
                        Span Text:
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.spanText}
                            onChange={(event, editor) => handleEditorChange(editor, 'spanText')}
                        />
                    </label>
                    <label style={{width:"400px"}}>
                        Description:
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.description}
                            onChange={(event, editor) => handleEditorChange(editor, 'description')}
                        />
                    </label>
                    <label style={{width:"400px"}}>
                        Button Text:
                        <CKEditor
                            editor={ClassicEditor}
                            data={formData.buttonText}
                            onChange={(event, editor) => handleEditorChange(editor, 'buttonText')}
                        />
                    </label>
                    <label style={{width:"400px"}}>
                        Image:
                        <input 
                            type="file" 
                            name="image" 
                            onChange={handleChange} 
                        />
                    </label>
                    <button style={{backgroundColor:"green",height:"40px",marginRight:"20px"}} type="submit">Save</button>
                    <button style={{backgroundColor:"red",height:"40px",marginRight:"20px"}} type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CreateSubComponentModal;
