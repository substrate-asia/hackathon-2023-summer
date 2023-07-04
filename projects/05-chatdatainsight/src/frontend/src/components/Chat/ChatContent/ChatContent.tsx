import React, { useEffect, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import useStore from '@store/store';
import Message from './Message';
import InputBar from './Message/InputBar';
import NewMessageButton from './Message/NewMessageButton';

import useSubmit from '@hooks/useSubmit';

const ChatContent = () => {
  const inputRole = useStore((state) => state.inputRole);
  const setError = useStore((state) => state.setError);
  const messages = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages
      : []
  );
  const stickyIndex = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages.length
      : 0
  );
  const generating = useStore.getState().generating;

  const saveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (generating) {
      setError('');
    }
  }, [generating]);

  const { error } = useSubmit();

  return (
    <div className='flex-1 overflow-hidden relative'>
      <ScrollToBottom
        className='h-full dark:bg-gray-800'
        followButtonClassName='hidden'
      >
        <div className='flex flex-col items-center text-sm dark:bg-gray-800'>
          <div
            className='flex flex-col items-center text-sm dark:bg-gray-800 md:w-[892px]'
            ref={saveRef}
          >
            {messages?.length === 0 && <NewMessageButton messageIndex={-1} />}
            {messages?.map((message, index) => (
              <React.Fragment key={index}>
                <Message
                  role={message.role}
                  content={message.content}
                  question_type = {message.question_type}
                  messageIndex={index}
                  messageLength={messages.length}
                />
              </React.Fragment>
            ))}
          </div>
          <div className='w-full h-36'></div>
        </div>
      </ScrollToBottom>
      <div className='absolute w-full bottom-0'>
        <InputBar
          role={inputRole}
          content=''
          messageIndex={stickyIndex}
          sticky
        />
      </div>
    </div>
  );
};

export default ChatContent;
