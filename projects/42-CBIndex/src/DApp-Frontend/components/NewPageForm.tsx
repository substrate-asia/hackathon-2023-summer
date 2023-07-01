import React from 'react'
import FormOne from './createNewForm/FormOne'
import FormTwo from './createNewForm/FormTwo'
import FormThree from './createNewForm/FormThree'
import FormFour from './createNewForm/FormFour'
import FormFive from './createNewForm/FormFive'
import FormSix from './createNewForm/FormSix'
import FormSeven from './createNewForm/FormSeven'
import FormEight from './createNewForm/FormEight'
function getStepContent(
  step: number,
  getNameSymbolFuc: any,
  name: string,
  symbol: string,
  getTreeFee: any,
  myPerformanceFee: string,
  myManagementFee: string,
  myEntranceFee: string,
  myPendingExitFee: string,
  myKindExitFee: string,
  getTreeSwtichStatus: any,
  myManagementFeeSwitch: boolean,
  myPerformanceFeeSwitch: boolean,
  myEntranceFeeSwitch: boolean,
  myExitFeeSwitch: boolean
) {
  switch (step) {
    case 0:
      return <FormOne />
    case 1:
      return (
        <FormTwo
          getNameSymbolFuc={getNameSymbolFuc}
          name={name}
          symbol={symbol}
        />
      )
    case 2:
      return (
        <FormThree
          getTreeFee={getTreeFee} //
          myPerformanceFee={myPerformanceFee}
          myManagementFee={myManagementFee}
          myEntranceFee={myEntranceFee}
          myPendingExitFee={myPendingExitFee}
          myKindExitFee={myKindExitFee}
          getTreeSwtichStatus={getTreeSwtichStatus} //
          myManagementFeeSwitch={myManagementFeeSwitch}
          myPerformanceFeeSwitch={myPerformanceFeeSwitch}
          myEntranceFeeSwitch={myEntranceFeeSwitch}
          myExitFeeSwitch={myExitFeeSwitch}
        />
      )
    case 3:
      return <FormFour />
    case 4:
      return <FormFive />
    case 5:
      return <FormSix />
    case 6:
      return <FormSeven />
    case 7:
      return <FormEight />
    default:
      return 'Unknown step'
  }
}

const NewPageForm = (props: any) => {
  const {
    current,
    getNameSymbolFuc,
    name,
    symbol,
    getTreeFee, //获取Fee的方法
    myPerformanceFee,
    myManagementFee,
    myEntranceFee,
    myPendingExitFee,
    myKindExitFee,
    getTreeSwtichStatus, //获取switch的方法
    myManagementFeeSwitch,
    myPerformanceFeeSwitch,
    myEntranceFeeSwitch,
    myExitFeeSwitch,
  } = props

  return (
    <div style={{ width: '100%' }}>
      {getStepContent(
        current,
        getNameSymbolFuc,
        name,
        symbol,
        getTreeFee, //获取Fee的方法
        myPerformanceFee,
        myManagementFee,
        myEntranceFee,
        myPendingExitFee,
        myKindExitFee,
        getTreeSwtichStatus,
        myManagementFeeSwitch,
        myPerformanceFeeSwitch,
        myEntranceFeeSwitch,
        myExitFeeSwitch
      )}
    </div>
  )
}
export default NewPageForm
