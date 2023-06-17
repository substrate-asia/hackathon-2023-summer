import React from "react";
import { PaymentForm,CreditCard } from 'react-square-web-payments-sdk';
import './SqaurePay.css';
import modelimg from './images/rectangle31916.png';
function SqaurePay() {
   
  return (
    //     <div className={styles.container}> 
    //     <div style={{border: '5px solid #497991', padding: '20px',
    //     marginBottom: '20px',
    //     backgroundColor: '#000000', color: '#497991', fontFamily: 'monospace', fontSize: '24px'}}>
    //     0.045ETH = $85.18
    // </div>
    <div>
    <div class="container">
      <h1 class="header">ModelMint Checkout</h1>
      <div class="product">
        <div class="productImage">
          <img src={modelimg} alt="Voxella AI"/>
        </div>
        <div class="productDetails">
          <h2>Voxella AI</h2>
          <p class="description">An exceptional breakthrough in the field of artificial intelligence designed to <br/>

          provide you with a truly immersive and intelligent conversation experience.</p>
          <p class="price">0.045 ETH per 1000 prompt entered</p>
          <p class="numPrice"> $85.18</p>
        </div>
      </div>
      <PaymentForm
        applicationId="sandbox-sq0idb-4xJjiX5Zn0FAJZJIabwYZQ"
        cardTokenizeResponseReceived={(token, verifiedBuyer) => {
          console.log('token:', token);
          console.log('verifiedBuyer:', verifiedBuyer);
        }}
        locationId='L5F156936NA6N'
      >
              <CreditCard 
               buttonProps={{
                css: {
                  backgroundColor: "#497991",
                  fontSize: "14px",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "grey",
                  },
                },
              }}/>
      </PaymentForm>
              </div>
     </div>
    );

}

export default SqaurePay;

//testing  Visa	4111 1111 1111 1111	111