import React, { useState } from "react"; import GlobalNavbar from './GlobalNavbar.js';
import MyPopup from './MyPopup.js';
import './MyPopup.css';
import { getCurrentUserOpenAIKey } from "./globalVariable.js";
function Setup() {
    const [show, setShow] = useState(false);
    function handleClose() {
        console.log(getCurrentUserOpenAIKey());
        setShow(false);
    }
    function handleShow() {
        setShow(true);
    }


    return (
        <div>
            <GlobalNavbar setShowPopup={handleShow} />
            <div>

                {show && <div className="popup-container">
                    <div className="popup-content">
                        {/* <button className="close-button" onClick={handleClose}>Close</button> */}
                        <MyPopup show={show} handleShow={handleShow} handleClose={handleClose} />
                    </div>
                </div>}

            </div>

        </div>);

}

export default Setup;