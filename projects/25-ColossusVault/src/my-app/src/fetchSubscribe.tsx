import React from 'react';
import { SubsocialContext } from './subsocial/provider'
import { useContext, useEffect, useState } from 'react'
import { AnyAccountId } from '@subsocial/api/types';

export default function FetchSubscribe() {

  const { isReady, api, network, changeNetwork } = useContext(SubsocialContext)
    // BBob addr
    const addr = '5F6T92VMoMQ3UCTpno1apeQARAYv5zbDzrTpLU4VEVWA76Qv';
    
    // 根据用户地址，获取用户订阅的space id list，
    // 再根据space id list获取每个space的post id list，
    // 再根据post id list获取每个post的内容  
    async function getSpaceIdsFollowedByAccount(addr: AnyAccountId) {
      // fetch the user's profile data from the blockchain
      // 返回类型：字符串数组 (string[])
      const spaceid = await api!.blockchain.spaceIdsFollowedByAccount(addr);
      
      // 写一个循环遍历spaceid数组，根据spaceid获取每个space拥有的post id list
      for (let i = 0; i < spaceid.length; i++) {
        // postIds 是一个字符串数组 (string[])包含了这个spaceid内的所有post id
        const postIds = await api!.blockchain.postIdsBySpaceId(spaceid[i]);
        console.log(postIds);

        // 遍历postIds数组，根据post id获取每个post的内容
        for (let j = 0; j < postIds.length; j++) {
          // 使用postQuery 获取post: 一个对象，包含了post的所有内容
          const post = await api!.blockchain.findPost({id: postIds[j]});
          console.log(post);
        }
      }
      
  }

    // TODO: 根据getSpaceIdsFollowedByAccount 获取到的post内容，渲染到页面上
    return (
        <main>
          <div className='header'>
            <h1 className='title'>Welcome to fetchSubscribe</h1>
            <div className='user-info'>
              <p>User Name: BBob</p>
              <p>User Address: 5GR8P7rtb2j9fN11CywTbgUfUBBAVZQLgp1YyuGJbhA3bhzV</p>
              <p>User Sub Token: 1.4 </p>
              {/* 更多用户资料信息 */}
            </div>
          </div>
          {/* 其他内容 */}
        </main>
      );
}
