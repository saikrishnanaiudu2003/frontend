// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import ProjectPage from './components/ProjectPage';
import SubcomponentsPage from './components/SubComponentPage';
import ProjectComponentsPage from './components/ComponentPage';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProjectPage />} />
                <Route path="/project/:projectId/components" element={<ProjectComponentsPage />} />
                <Route path="/project/:projectId/component/:componentId/subcomponents" element={<SubcomponentsPage />} />
                
                
            </Routes>
        </Router>
    );
};

export default App;
