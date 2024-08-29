// CreateComponentModal.js
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './Modal.css'; // Adjust the path as needed

const CreateComponentModal = ({ isOpen, onClose, editorData, setEditorData, handleCreateComponent }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create New Component</h2>
                <CKEditor
                    editor={ClassicEditor}
                    data={editorData}
                    onChange={(event, editor) => setEditorData(editor.getData())}
                />
                <button  style={{backgroundColor:"green"}} onClick={handleCreateComponent}>Create Component</button>
                <button  style={{backgroundColor:"red",marginLeft:"10px"}} onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateComponentModal;
