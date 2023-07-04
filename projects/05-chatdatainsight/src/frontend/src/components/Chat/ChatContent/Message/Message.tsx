import React from 'react';
import MessageContent from './MessageContent';
import { Role } from '@type/chat';
import AvartorIcon from '@icon/AvartorIcon';
import AvartorIconUser from '@icon/AvartorIconUser';

const Message = React.memo(
  ({
    role,
    content,
    messageIndex,
    question_type,
    messageLength,
    sticky = false,
  }: {
    role: Role;
    content: string;
    question_type?: string;
    messageIndex: number;
    messageLength: number;
    sticky?: boolean;
  }) => {

    return (
      <div
        className={`w-full text-gray-800 dark:text-gray-100 flex py-4 ${
          role === 'user' ? 'justify-end' : 'justify-start'
        } `}
      >
        {!(role === 'user') && (
          <div className='h-10 w-10 rounded-xl inline-flex items-center justify-center text-2xl mr-2 text-white'>
            <AvartorIcon />
          </div>
        )}
        <div
          className={`text-base	 flex transition-all max-w-[80%] flex-col ease-in-out rounded-xl p-4 w-fit bg-white`}
        >
          <MessageContent
            role={role}
            content={content}
            messageIndex={messageIndex}
            question_type={question_type}
            messageLength={messageLength}
            sticky={sticky}
          />
        </div>
        {(role === 'user') && (
          <div className='h-10 w-10 rounded-full bg-homeMain inline-flex items-center justify-center text-2xl ml-2 text-white'>
            U
          </div>
        )}
      </div>
    );
  }
);

export default Message;
