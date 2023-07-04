import React from 'react';
import ChatContent from './ChatContent';
const Chat = () => {

  return (
    <div className={`flex h-full flex-1 flex-col md:pl-[360px]`}>
      <main className='relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1 bg-gray-200'>
        <ChatContent />
      </main>
    </div>
  );
};

export default Chat;
