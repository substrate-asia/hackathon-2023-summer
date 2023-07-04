import React, { useEffect, useState, useCallback } from 'react'    
import { Dropdown } from "react-bootstrap";
import {Link} from 'react-router-dom';

const Header = ({ walletConnected, changeChain, setupSpecs, getUserChain }) => {

	const [dropdowncolor, setDropdowncolor] = useState("#DE5106");
	const [dropdownDisabled, setDropdownDisabled] = useState(true);		
	const [polkadotAccount, setPolkadotAccount] = useState("");
	const [polkadotAccountsDropDown, setPolkadotAccountsDropDown] = useState("");

  const [activeEcosystem, setActiveEcosystem] = useState("EVM");
  const [mmChainName, setMMChainName] = useState("Select Chain");


  const handleChainChange = (val) => {
    if (val==="1")
    {
      setMMChainName("Moonbeam");
      changeChain("0x504"); //1284
      setActiveEcosystem("EVM");
      getUserChain("MOONBEAM");
    }
    else if (val==="2")
    {
      setMMChainName("Binance");
      changeChain("0x38"); //56
      setActiveEcosystem("EVM");
      getUserChain("BINANCE");
    }
    else if (val==="5")
    {
      setMMChainName("Moonbase"); //1287
      changeChain("0x507");
      setActiveEcosystem("EVM");
      getUserChain("MOONBASE");
    }
    else if (val==="7")
    {
      setMMChainName("Fantom");
      changeChain("0xFA");
      setActiveEcosystem("EVM");
      getUserChain("FANTOM");
    }

    
  };


  useEffect(() => {
    if(setupSpecs.walletAddress)
    {
      console.log(` ********************* ********************* ********************* *********************`);
      console.log(`ACCOUTN SELECTED walletAddress: ${setupSpecs.walletAddress} mm_chainId: ${setupSpecs.mm_chainId}`);
      
      if (setupSpecs.mm_chainId==="0x504") setMMChainName("Moonbeam");
      else if (setupSpecs.mm_chainId==="0x38") setMMChainName("Binance");
      else if (setupSpecs.mm_chainId==="0x507") setMMChainName("Moonbase");
      else if (setupSpecs.mm_chainId==="0x61") setMMChainName("BinanceTestNet");
      else if (setupSpecs.mm_chainId.toLowerCase()==="0xfa") setMMChainName("Fantom");

    } 
},[setupSpecs])


  useEffect(() => {
      if(walletConnected)
      {
        // setDropdowncolor("white");
        setDropdowncolor("#DE5106");
        setDropdownDisabled(false);
      } else {
        // setDropdowncolor("#DE5106");
        setDropdowncolor("white");
        setDropdownDisabled(true);
      }
  },[walletConnected])


  const metamaskSelectedAccount =   (		
    <div className="form-group">
      <div className="input-group input-group-lg">
        <div className="input-group-prepend">

          <Dropdown className="btn-sm rounded py-1" style={{backgroundColor:"#171622", marginTop:"0px"}}>
            <Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{width:"550px", fontSize:"12px",   backgroundColor:"#171622"}}>
              <span className="fs-16 font-w650 d-flex" style={{backgroundColor:"#171622", marginRight:"10px"}}>{setupSpecs.walletAddress? setupSpecs.walletAddress : "Sign in to Metamask Extension"}</span>
            </Dropdown.Toggle>
            {/* <Dropdown.Menu style={{height:"200px", width:"550px", overflowY: "scroll", fontSize:"14px"}}>{polkadotAccountsDropDown}</Dropdown.Menu> */}
          </Dropdown>
          
        </div>
      </div>
    </div>
          )

  const polokadotAccountMenu =   (		
    	
    <div className="form-group">
      <div className="input-group input-group-lg">
        <div className="input-group-prepend">
          <Dropdown className="btn-sm rounded py-1" style={{backgroundColor:"#171622", marginTop:"0px"}}>
            <Dropdown.Toggle variant="" as="div" className="input-group-text form-control style-2 default-select cursor-pointer" style={{width:"550px", fontSize:"12px",   backgroundColor:"#171622"}}>
              <span className="fs-16 font-w650 d-flex" style={{backgroundColor:"#171622", marginRight:"10px"}}>{polkadotAccount? polkadotAccount : "Sign in to Polkadot Extension"}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{height:"200px", width:"550px", overflowY: "scroll", fontSize:"14px"}}>{polkadotAccountsDropDown}</Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
          )
 
  return (
    <div className="header">
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
            <li className="nav-item">
              <div  style={{ width: "50vw"}}> 
                <div style={{ width: "100v%" }}> 
                </div> 
              </div>
            </li>
            </div>
            <div className="basic-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="" className="" style={{backgroundColor:"#171622"}}>
                    {mmChainName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item value="1"  href="#" onClick={() => handleChainChange("1")} >Moonbeam</Dropdown.Item >
                    <Dropdown.Item value="7"  href="#" onClick={() => handleChainChange("7")} >Fantom</Dropdown.Item >
                    <Dropdown.Item value="2" href="#" onClick={() => handleChainChange("2")} >Binance SC</Dropdown.Item >
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            <ul className="" style={{backgroundColor:""}}>
                   {metamaskSelectedAccount}
            </ul>
          </div>
        </nav>
      </div>
    </div>
    
  );
};

export default Header;
