import React from "react";
import { getCurrentUserWalletAddress } from "./globalVariable";
function NewModel(props)
{
    const handleUploadClick = () => {
        console.log("upload clicked");
        props.func();
      };
    let userWallet = getCurrentUserWalletAddress();
    console.log(userWallet);


     // get from backend
    // fetch(`http://localhost:4001/user${userWallet}`)
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));

    // send post request to backend
    // fetch(`http://localhost:4001/user${userWallet}`, {
    //     method: 'POST', // or 'PUT'
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         "name":"Daniel",
    //         "age":"19",
    //         "sdf":"sdf"
    //       }),
        
    //   })
      


    return (
        <div style={{width:'59%'}} className="new-model-container">
            <h1>Create a new model</h1>
            <h2>Upload your own trained language model to the ModelGPT marketplace for sale. </h2>
            {/* <button  onClick={handleUploadClick}>  Upload my model  </button> */}
        </div>
    );
}


export default NewModel;
