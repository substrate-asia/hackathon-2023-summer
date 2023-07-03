<p align="center">
<img  src="https://ppxnb-7iaaa-aaaai-qkita-cai.raw.ic0.app/img/crypto-spiral-info.png?v=1"><br/>
</p>


**客户端**

- web 端
  - [ ] Creating an advertising landing page
  - [ ] Creating a promotion DAO.
  - [ ] Participating in crowdfunding.
  - [ ] Translation: Initiating a task (including providing the privacy contract address, prepayment, etc.).
  - [ ] Displaying advertisements that can be clicked to redirect to third-party applications/websites.
  - [ ] Providing API documentation: Actions performed within the third-party application/website as part of the promotional task, invoking the privacy contract to validate the actions and reward accordingly.
 

- 执行任务动作
  
```javascript 
          window.PolkadotWeb3JSSample.unionTaskActionPay(account, taskAction.taskId, taskAction.actionId, BigInt(taskAction.price),
							function (  myEvent, status ) {							
								if(status.type != "Finalized"){//还是处理Finalized吧，不然后面查询你喜欢的有问题
									return;
								}
								//处理我关心的错误信息
								if(myEvent.humanError != null) {									
									if(myEvent.humanError == "web3Dao.TaskNotFound"){										
										//app.dialogContent = "当前任务不存在！";
										window.havorld.jsCallAndroidTaskCallback(id, type, param, JSON.stringify({code:"400", msg: "当前任务不存在！"}) );

									}else if(myEvent.humanError == "web3Dao.DaoNotFound"){
										//app.dialogContent = "当前组织不存在！";	
										window.havorld.jsCallAndroidTaskCallback(id, type, param, JSON.stringify({code:"400", msg: "当前组织不存在！"}) );

									}else if(myEvent.humanError == "web3Dao.TaskActionDuplicte"){
										//app.dialogContent = "有相同的动作还没处理完！";	
										window.havorld.jsCallAndroidTaskCallback(id, type, param, JSON.stringify({code:"400", msg: "有相同的动作还没处理完!"}) );

									}else if(myEvent.humanError == "web3Dao.DaoNotFound"){
										//app.dialogContent = "当前组织不存在";		
										window.havorld.jsCallAndroidTaskCallback(id, type, param, JSON.stringify({code:"400", msg: "当前组织不存在!"}) );

									}else{
										window.havorld.jsCallAndroidTaskCallback(id, type, param, JSON.stringify({code:"500", msg: "未知错误！"+myEvent.humanError}) );
										//app.dialogContent = "未知错误！"+myEvent.humanError;	
									}
									
									return;
								}

								if(myEvent.humanIndex == "web3Dao.TaskActionPayed"){
									//succeed
								}
								
							}	
					
					
					).then(res => {
						console.log(res);
					}).catch(e => {
						console.log(e);
						var no_money  = e.message.indexOf("Inability to pay some fees");
						
					})


```



- 任务动作的验证与奖励
  
```javascript 
window.PolkadotWeb3JSSample.doTaskActionInTEE(mnemonic, taskContract, parseInt(taskId), parseInt(actionId), tokenMd5, fromAddr
					).then(res => {
						var reulstJson = JSON.parse(JSON.stringify(res));
						var resultStr = JSON.stringify(res);//deep copy the result for callback, not be changed ...
						var playload_  = reulstJson.output?.ok;
						if(playload_ !=null){
							if(playload_.err!=null){								
								console.log("contract error: "+playload_.err);
							}
							
							if(actionType == "vpn" && playload_.ok !=null ){//处理VPN生成
								var playload  = JSON.parse(playload_.ok);
								console.log(playload);
								if(playload .code == 200){								
									

								}	
								}else{
									console.log(" vpn server faild ");

								}	

							}

							if(true){//其它action处理

							}
							
													
						}else{
							console.log("unkown error");
						}

					}).catch(e => {
						
					});
