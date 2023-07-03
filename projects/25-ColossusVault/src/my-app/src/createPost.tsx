import React from 'react';
import { IpfsContent } from "@subsocial/api/substrate/wrappers"
import { SubsocialContext } from './subsocial/provider'
import { useContext, useEffect, useState } from 'react'
import { signAndSendTx } from './subsocial/signandsend';


export default function CreatePost() {
    // 获取到subsocial的api实例
    const { isReady, api, network, changeNetwork } = useContext(SubsocialContext)

    // useState hook创建了两个状态变量，title和content。useState('')的参数是这两个状态的初始值，这里都是空字符串。
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    // 当用户在标题输入框中输入内容时，这个函数将被调用，并将输入框的值更新到对应的状态变量中。
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };
    
    // 当用户在内容输入框中输入内容时，这个函数将被调用，并将输入框的值更新到对应的状态变量中。
    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    // 用户提交表单时，这个函数将被调用。这个函数首先阻止了表单的默认提交行为，然后在控制台打印出了标题和内容的值
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Title:', title);
        console.log('Content:', content);

        // 将内容加密存储到IPFS中，返回CID
        const cid = await api!.ipfs.saveContent({
          title: title,
          body: content,
        });
      
        const substrateApi = await api!.blockchain.api
        const spaceId = '1002'
        // 使用得到的CID, spaceid = 1, 将内容存储到subsocial的space中
        const postTransaction = substrateApi.tx.posts.createPost(spaceId, { RegularPost: null}, IpfsContent(cid));
        
        // 目前该地址还没有足够多的sub token, 所以在签署交易这一步会报错
        const account = '5GR8P7rtb2j9fN11CywTbgUfUBBAVZQLgp1YyuGJbhA3bhzV'

        // 发送交易, 需要签名
        signAndSendTx(postTransaction, account, async (result) => {
          const { status } = result;
      
          if (!result || !status) {
            return;
          }
      
          if (status.isFinalized || status.isInBlock) {
            const blockHash = status.isFinalized
              ? status.asFinalized
              : status.asInBlock;
            
            console.log(`✅ Tx finalized. Block hash: ${blockHash.toString()}`);
          } else if (result.isError) {
            console.log(JSON.stringify(result));
          } else {
            console.log(`⏱ Current tx status: ${status.type}`);
          }
        });

    };
    
    // 创建一个表单，包含用户提交的标题和内容，提交后将内容存储到subsocial的space中,并且将内容存储到IPFS中，返回CID
    return (
        <main>
          <div className='header'>
            <h1 className='title'>Create your Post</h1>
            <div className='user-info'>
              <p>User Name: BBob</p>
              <p>User Address:5GR8P7rtb2j9fN11CywTbgUfUBBAVZQLgp1YyuGJbhA3bhzV</p>
              <p>User Sub Token: 10.4 </p>
              {/* 更多用户资料信息 */}
            </div>
          </div>
          <div className='post-creation'>
            <h2>Create a Post</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor='post-title'>Title:</label><br />
              <input type='text' id='post-title' name='post-title' value={title} onChange={handleTitleChange} /><br />
              <label htmlFor='post-content'>Content:</label><br />
              <textarea id='post-content' name='post-content' value={content} onChange={handleContentChange} /><br />
              <input type='submit' value='Submit' />
            </form>
          </div>
          {/* 其他内容 */}
        </main>
      );
}
