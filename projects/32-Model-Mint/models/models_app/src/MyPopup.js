import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getCurrentUserOpenAIKey, getCurrentUserWalletAddress, hostAddress, setCurrentUserOpenAIKey } from './globalVariable';
import WriteToFirestore from './firebaseFunctions/WriteToFirestore';

function MyPopup({show, handleShow,handleClose }) {
  const [email, setEmail] = useState('');

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handleSubscribe() {
    setCurrentUserOpenAIKey(email);
    console.log('sending this to firebase:', getCurrentUserOpenAIKey());
    console.log('sending to this user', getCurrentUserWalletAddress());
    WriteToFirestore('Users', getCurrentUserWalletAddress(), { 
      'created_date': new Date().toLocaleDateString(),
      'created_time': new Date().toLocaleTimeString(),
      'open_ai_key': getCurrentUserOpenAIKey(),
  });

  async function handleSetupKey() {
    try {
      // var data;
      var requestadd = `http://${hostAddress}:4003/setkey${getCurrentUserOpenAIKey()}`;
      const response = await fetch(requestadd,{
        method: 'POST'
      });
      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error("Error set up key", error);
    }
  }
  
  handleSetupKey();

  handleClose();
  }

  console.log(show);
  return (
   
    <div>
      <Dialog open={show} onClose={handleClose} >
        
        <DialogTitle  sx={{ fontFamily: 'SF Pro', color: 'white', backgroundColor: '#171717'}}>Enter your OpenAI key</DialogTitle>
        <DialogContent  sx={{ backgroundColor: '#171717' }}>
          <DialogContentText sx={{ color: 'rgb(139,139,139)' }}> 
          Ready to unlock the power of AI? Simply enter your OpenAI API key so that we can streamline the process of training customized models for you, without any coding required.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Your OpenAI API key"
            type="text"
            fullWidth
            variant="standard"
            value={email}
            onChange={handleEmailChange}
            sx={{ color: 'white', '& label.Mui-focused': { color: 'grey' } }}
            InputLabelProps={{ sx: { color: 'grey' } }}
            inputProps={{ style: { color: 'white' } }}
          />
        </DialogContent>
        <DialogActions    sx={{ backgroundColor: '#171717', '& > div': { backgroundColor: '#336F87' } }}>
          <Button onClick={handleClose}>later</Button>
          <Button onClick={handleSubscribe}>Continue</Button>
        </DialogActions>
      </Dialog>
    </div>);

}

export default MyPopup;