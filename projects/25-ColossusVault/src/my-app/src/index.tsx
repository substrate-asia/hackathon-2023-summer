import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { SubsocialContextProvider } from './subsocial/provider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePost from './createPost';
import FetchSubscribe from './fetchSubscribe';
import UserProfile from './UserProfile';
// 程序入口
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// render the whole page from this line
root.render(
  <React.StrictMode>
    <SubsocialContextProvider>
      
      <Router>
        <Routes>
          <Route path="/"               element={< App            />} />
          <Route path="/userProfile"    element={< UserProfile    />} />
          <Route path="/createPost"     element={< CreatePost     />} />
          <Route path="/fetchSubscribe" element={< FetchSubscribe />} />        
        </Routes>
      </Router>

    </SubsocialContextProvider>
  </React.StrictMode> 
)

