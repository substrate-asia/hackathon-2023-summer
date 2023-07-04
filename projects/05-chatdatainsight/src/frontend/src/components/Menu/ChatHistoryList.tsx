import React, { useEffect, useRef, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';
import ChatHistory from './ChatHistory';

import {
  ChatHistoryInterface,
  ChatInterface,
} from '@type/chat';

const ChatHistoryList = () => {
  // 当前索引
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  // 聊天
  const setChats = useStore((state) => state.setChats);
  const chatTitles = useStore(
    (state) => state.chats?.map((chat) => chat.title),
    shallow
  );

  const [chatItems, setChatItems] = useState<ChatHistoryInterface[]>([]);
  const chatsRef = useRef<ChatInterface[]>(useStore.getState().chats || []);
  const foldersNameRef = useRef<string[]>(useStore.getState().foldersName);

  const updateFolders = () => {
    const _chatItems: ChatHistoryInterface[] = [];
    const chats = useStore.getState().chats;

    if (chats) {
      chats.forEach((chat, index) => {
        _chatItems.push({ title: chat.title, index: index });
      });
    }

    setChatItems(_chatItems);
  };

  useEffect(() => {
    updateFolders();

    useStore.subscribe((state) => {
      if (
        !state.generating &&
        state.chats &&
        state.chats !== chatsRef.current
      ) {
        updateFolders();
        chatsRef.current = state.chats;
      } else if (state.foldersName !== foldersNameRef.current) {
        updateFolders();
        foldersNameRef.current = state.foldersName;
      }
    });
  }, []);

  useEffect(() => {
    if (
      chatTitles &&
      currentChatIndex >= 0 &&
      currentChatIndex < chatTitles.length
    ) {
      document.title = chatTitles[currentChatIndex];
    }
  }, [currentChatIndex, chatTitles]);

  return (
    <div
      className={`flex-col flex-1 overflow-y-auto border-b border-white/20`}
    >
      <div className='flex flex-col gap-1 p-5 text-sm'>
        {chatItems.map(({ title, index }) => (
          <ChatHistory
            title={title}
            key={`${title}-${index}`}
            chatIndex={index}
          />
        ))}
      </div>
      <div className='w-full h-10' />
    </div>
  );
};

export default ChatHistoryList;
