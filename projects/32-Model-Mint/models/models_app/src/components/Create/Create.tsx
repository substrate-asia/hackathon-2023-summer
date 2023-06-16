import { memo, useState } from 'react';
import type { FC } from 'react';
import React from 'react';
import resets from '../_resets.module.css';
import { BaseModel_statusDefault } from './BaseModel_statusDefault/BaseModel_statusDefault';
import { ColorfulModelNameLogo_modelA } from './ColorfulModelNameLogo_modelA/ColorfulModelNameLogo_modelA';
import { ColorfulModelNameLogo_modelB } from './ColorfulModelNameLogo_modelB/ColorfulModelNameLogo_modelB';
import { ColorfulModelNameLogo_modelD } from './ColorfulModelNameLogo_modelD/ColorfulModelNameLogo_modelD';
import classes from './Create.module.css';
import { Emoji_flagsIcon } from './Emoji_flagsIcon';
import { Frame11Icon } from './Frame11Icon';
import { Frame2661_statusAvailable } from './Frame2661_statusAvailable/Frame2661_statusAvailable';
import { InfoIcon } from './InfoIcon';
import { SelectACSVFile_statusDefault } from './SelectACSVFile_statusDefault/SelectACSVFile_statusDefault';
import { TextField_statusDefault } from './TextField_statusDefault/TextField_statusDefault';
import { Upload_fileIcon } from './Upload_fileIcon';
import { TextField } from "@mui/material";
import { FilePond, File, registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useHistory } from 'react-router-dom';
import WriteToFirestore_UID from '../../firebaseFunctions/WriteToFirestore_UID.js';
import {getCurrentUserWalletAddress,hostAddress} from '../../globalVariable.js';
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginImageCrop,
  FilePondPluginImageTransform
);


interface Props {
  className?: string;
  hide?: {
    search?: boolean;
    search2?: boolean;
  };
}
/* @figmaId 171:3222 */
export const Create: FC<Props> = memo(function Create(props = {}) {
  const history = useHistory();
  const [modelName, setModelName] = useState('');
  const [basemodel, setBaseModel] = useState('A');
  const [trainFile, settrainFile] = useState([])
  const [modelid, setmodelid] = useState('Have not created yet');
  const [currentstatus, setCurrentStatus] = useState("available");
  // available, training, finished
  const [modelStatus, setModelStatus] = useState(null);
  const [finetunedmodel, setfinetunedmodel] = useState(null);



  const handleNameChange = (nameValue: string) => {
    setModelName(nameValue);
    if (props.onNameChange) {
      props.onNameChange(nameValue); // Call the callback function with the nameValue state
    }
  };

  const handleBaseModelChange = (nameValue: string) => {
    setBaseModel(nameValue);
    if (props.onModelChange) {
      props.onModelChange(nameValue); // Call the callback function with the nameValue state
    }
    setBaseModel(nameValue);
    if (props.onModelChange) {
      props.onModelChange(nameValue); // Call the callback function with the nameValue state
    }
    console.log(basemodel);
  };



  let [descValue, setdescValue] = React.useState('Describe the functions, creative ways, and ideal scenarios of using this model.');
  const handleDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setdescValue(event.target.value);

  };
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setdescValue('');
  };
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (descValue === '') {
      setdescValue('Describe the functions, creative ways, and ideal scenarios of using this model.');
    }
  };

   async function handleClick() {
    if (currentstatus === 'available') {

      setCurrentStatus('training');
      await handleLookup();
      

    } else if (currentstatus === 'training') {
      // setCurrentStatus('finished');


    } else if (currentstatus === 'finished') {
      WriteToFirestore_UID("models",{ 
        'created_time': new Date().toLocaleTimeString(),
        'description': descValue,
        'title': modelName,
        'modelImage': `image-${basemodel.toLocaleLowerCase()}`,
        'creator':getCurrentUserWalletAddress(),
        'model_id': finetunedmodel,
      });
      history.push('/models');
    }
  }

  async function handleLookup() {
    try {//${modelid}
      console.log('modelid', modelid);
      // var data;
      var requestadd = modelid === "Have not created yet" ? `http://${hostAddress}:4003/lookupft-kqp2Xtf0LoPFGekt2iZEoyvq`: `http://${hostAddress}:4003/lookup${modelid}`;
      const response = await fetch(requestadd,{
        method: 'POST'
      });
      const data = await response.json();
      // console.log('data***', data);
      await setTimeout(() => {
          console.log(data.response);
      if (data.response === "pending") {
        setTimeout(handleLookup, 1000);
        console.log('modelstatus', modelStatus);
      } else {
        console.log('modelstatus-finish', modelStatus);
        setfinetunedmodel(data.response);
        console.log('Create.tsx: finetunedmodel', data.response);
        setCurrentStatus('finished');
      }
      }, 5000);
   
    } catch (error) {
      console.error("Error looking up model status:", error);
    }
  }

  const server_upload_add =  `http://${hostAddress}:4003/upload`;
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.frame2659}>
        <div className={classes.frame2650}>
          <div className={classes.frame2654}>
            <div className={classes.nameYourModel}>Name your model</div>
            
          </div>
          <TextField_statusDefault

            hide={{
              search: true,
            }}
            onNameChange={handleNameChange} // Pass the callback function as a prop
          />
        </div>
        <div className={classes.frame26592}>
          <div className={classes.frame26542}>
            <div className={classes.description}>Description</div>
          </div>
          <TextField_statusDefault
            className={classes.textField}
            hide={{
              search: true,
            }}
            text={{
              eGNameGPT: (


                <div className={classes.eGNameGPT}>
                  <div className={classes.textBlock}>

                    <TextField value={descValue}

                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      onChange={handleDescChange}

                      multiline
                      maxRows={4}

                      InputProps={{ // Add the InputProps prop
                        style: {
                          color: "white",
                          backgroundColor: "transparent",
                        }
                      }}
                      style={{ width: "100%" }}
                      id="fullWidth" />


                  </div>
                  <div className={classes.textBlock2}>
                    <p></p>
                  </div>
                  <div className={classes.textBlock3}>
                    <p></p>
                  </div>
                </div>
              ),
            }}
          />
        </div>
        <div className={classes.frame2658}>
          <div className={classes.selectABaseModel}>Select a base model</div>
          <div className={classes.frame2657}>
            <div className={classes.frame2656}>
              <BaseModel_statusDefault
                swap={{
                  colorfulModelNameLogo: <ColorfulModelNameLogo_modelA />,
                }}
                text={{
                  veryCapableButFasterAndLowerCo: (
                    <div className={classes.veryCapableButFasterAndLowerCo}>
                      Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost.
                    </div>
                  ),
                }}
                onNameChange={handleBaseModelChange}
              />
              <BaseModel_statusDefault
                swap={{
                  colorfulModelNameLogo: <ColorfulModelNameLogo_modelB />,
                }}
                text={{
                  veryCapableButFasterAndLowerCo: (
                    <div className={classes.veryCapableButFasterAndLowerCo2}>
                      Capable of straightforward tasks, very fast, and lower cost.
                    </div>
                  ),
                }}
                onNameChange={handleBaseModelChange}

              />
            </div>
            <div className={classes.frame26572}>
              <BaseModel_statusDefault
                onNameChange={handleBaseModelChange}
              />
              <BaseModel_statusDefault
                swap={{
                  colorfulModelNameLogo: (
                    <ColorfulModelNameLogo_modelD
                      swap={{
                        frame11: <Frame11Icon className={classes.icon} />,
                      }}
                    />
                  ),
                }}
                text={{
                  veryCapableButFasterAndLowerCo: (
                    <div className={classes.veryCapableButFasterAndLowerCo3}>
                      Most capable GPT-3 model. Cover all tasks the other models do, with higher quality.
                    </div>
                  ),
                }}
                onNameChange={handleBaseModelChange}
              />
            </div>
          </div>
        </div>
        <div className={classes.frame2649}>
          <div className={classes.uploadYourCSVFile}>Upload your CSV file</div>
          
          {/* <SelectACSVFile_statusDefault
            swap={{
              upload_file: <Upload_fileIcon className={classes.icon2} />,
            }}
            text={{
              selectFileCSV: <div className={classes.selectFileCSV}>Select file (.csv)</div>,
            }}
          /> */}

           <div style={{ display: "flex", justifyContent: "flex-end", marginLeft: "70%" }}> {/* Set the marginLeft to 50% */}
           <div style={{ backgroundColor: "white" }}> {/* Set the background color to white */}
     

      <FilePond
        files={trainFile}
        onupdatefiles={settrainFile}
        instantUpload={false}
        allowMultiple={false}
       server= {server_upload_add}
        name="file"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        onprocessfile={(error, file) => {
          if (!error) {
            const response = JSON.parse(file.serverId);
            console.log(response);
            if(response.message = "File uploaded successfully!"){
              setmodelid(response.model_id);
              
            }
          } else {
            console.log(error);
          }
        }}
       />
   
          </div>
          </div>
        </div>
      </div>
      <Frame2661_statusAvailable
        className={classes.frame2661}
        swap={{
          emoji_flags: <Emoji_flagsIcon className={classes.icon3} />,
          info: <InfoIcon className={classes.icon4} />,
        }}
        currentstatus={currentstatus}
        onClick={handleClick}
      />
      <div className={classes.modelCard}>
        <div className={classes.createATextBasedModel}>Create a text-based model </div>
        <div className={classes.trainingCanOnlyStartOnceAllThe}>
          Training can only start once all the following blanks are filled.{' '}
        </div>
      </div>
    </div>
  );
});
