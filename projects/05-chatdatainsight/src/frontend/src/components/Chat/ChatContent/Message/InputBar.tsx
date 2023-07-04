import React, { useState, useEffect } from 'react';
import useStore from '@store/store';
import { Role } from '@type/chat';
import { useTranslation } from 'react-i18next';
import { ChatInterface } from '@type/chat';
import useSubmit from '@hooks/useSubmit';
import useAddChat from '@hooks/useAddChat';
const EditViewButtons = React.memo(
  ({
    sticky = false,
    handleSaveAndSubmit,
    handleSave,
    setIsModalOpen,
    setIsEdit,
    _setContent,
  }: {
    sticky?: boolean;
    handleSaveAndSubmit: () => void;
    handleSave: () => void;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    _setContent: React.Dispatch<React.SetStateAction<string>>;
  }) => {
    const { t } = useTranslation();

    return (
      <div className='flex'>
        <div className='flex-1 text-center flex justify-center'>
          {sticky && (
            <button
              className='btn relative btn-primary'
              onClick={handleSaveAndSubmit}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('saveAndSubmit')}
              </div>
            </button>
          )}

          {sticky || (
            <button
              className='btn relative btn-neutral'
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('saveAndSubmit')}
              </div>
            </button>
          )}

          {sticky || (
            <button
              className='btn relative btn-neutral'
              onClick={() => setIsEdit(false)}
            >
              <div className='flex items-center justify-center gap-2'>
                {t('cancel')}
              </div>
            </button>
          )}
        </div>
      </div>
    );
  }
);
const EditView = ({
  content,
  setIsEdit,
  messageIndex,
  sticky,
}: {
  content: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const inputRole = useStore((state) => state.inputRole);
  const setChats = useStore((state) => state.setChats);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);
  const addChat = useAddChat();
  const generating = useStore((state) => state.generating);
  const [_content, _setContent] = useState<string>(content);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const textareaRef = React.createRef<HTMLTextAreaElement>();

  const { t } = useTranslation();

  const resetTextAreaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.shiftKey) && e.key === 'Enter') {
      return
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (sticky) {
        handleSaveAndSubmit();
        resetTextAreaHeight();
      } else handleSave();
    }
  };

  const clickHandle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleSaveAndSubmit();
    resetTextAreaHeight();
  };
  const handleSave = () => {
    if (sticky && _content === '') return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;
    if (sticky) {
      updatedMessages.push({ role: inputRole, content: _content });
      _setContent('');
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      setIsEdit(false);
    }
    setChats(updatedChats);
  };

  const { handleSubmit } = useSubmit();
  const handleSaveAndSubmit = () => {
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const updatedMessages = updatedChats[currentChatIndex].messages;
    if (sticky) {
      if (_content !== '') {
        updatedMessages.push({ role: inputRole, content: _content });
      }
      _setContent('');
      resetTextAreaHeight();
    } else {
      updatedMessages[messageIndex].content = _content;
      updatedChats[currentChatIndex].messages = updatedMessages.slice(
        0,
        messageIndex + 1
      );
      setIsEdit(false);
    }
    setChats(updatedChats);
    handleSubmit(_content);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [_content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  return (
    <div className='fixed bottom-0 left-0 right-0 shrink-0 px-3 py-8 bg-vert-light-gradient dark:bg-vert-dark-gradient transition-transform md:ml-[358px] bg-white'>
      {error && (
        <div className='text-center max-w-3xl mx-auto p-2 border rounded-md	border-rose-700	text-rose-700 mb-2'>
          {error}
        </div>
      )}
      <div className='max-w-3xl mx-auto h-full'>
        <div className='relative'>
          <div className='flex items-center h-full bg-white  shadow-md

 rounded-xl focus-within:ring-2 ring-gray-300'>
            <textarea
              ref={textareaRef}
              className='flex-grow outline-none bg-transparent scroll-p-2 px-3 py-2 min-h-[2.6rem] rounded-xl resize-none'
              placeholder='Type message or / to select a prompt'
              onChange={(e) => {
                _setContent(e.target.value);
              }}
              value={_content}
              onKeyDown={handleKeyDown}
              rows={1}
            ></textarea>
            <div className='pr-2 inline-flex items-center'>
              <button
                type='button'
                onClick={clickHandle}
                className='h-8 w-8 hover:bg-zinc-300 rounded-xl inline-flex items-center justify-center'
              >
                <svg
                  width='24'
                  height='19'
                  viewBox='0 0 24 19'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M22.0178 9.7095L1.33386 1.18524L6.27447 9.38864M22.0178 9.7095L1.80963 17.788L6.27447 9.38864M22.0178 9.7095L6.27447 9.38864'
                    stroke='#BBBBBB'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='pt-3'>
        <div className='max-w-3xl mx-auto flex justify-center h-full items-center'>
          <div className='text-xs flex items-center gap-2'>
            <button
              type='button'
              className='rounded-lg px-2 inline-flex items-center justify-center border shrink-0 text-center disabled:pointer-events-none bg-white text-xs border-gray-300 text-gray-300 h-6'
            >
              <svg
                className='mr-2'
                width='10'
                height='9'
                viewBox='0 0 10 9'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle cx='5.00073' cy='4.5' r='4' stroke='#949494' />
              </svg>
              Regenerate
            </button>
            <button
              type='button'
              onClick={
                () => {
                  if (!generating) { setError(''); addChat() };
               }
              }
              className='rounded-lg px-2 inline-flex items-center justify-center border shrink-0 text-center disabled:pointer-events-none bg-white text-xs border-gray-300 text-gray-300 h-6'
            >
              <svg
                className='mr-2'
                width='12'
                height='13'
                viewBox='0 0 12 13'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M9.70647 0.934003C9.43147 0.656834 9.05493 0.5 8.66213 0.5C8.26978 0.5 7.89365 0.65648 7.61708 0.934726L0.796538 7.75521C0.347892 8.15051 0.0537892 8.73874 0.00268078 9.37135L0.000732422 11.9001V12.5H3.08113C3.76163 12.4533 4.35564 12.1563 4.77468 11.673L11.5668 4.88299C11.8438 4.60602 11.9994 4.23036 11.9994 3.83866C11.9994 3.44696 11.8438 3.0713 11.5668 2.79433L9.70647 0.934003ZM3.89737 10.856C3.65781 11.13 3.35948 11.2792 3.03898 11.3019L1.20081 11.3007V9.41987C1.22499 9.14475 1.37536 8.844 1.61842 8.62902L8.4681 1.78098C8.51948 1.7292 8.5894 1.70007 8.66235 1.70007C8.73529 1.70007 8.80521 1.7292 8.85659 1.78098L10.7186 3.64297C10.7705 3.69493 10.7997 3.76539 10.7997 3.83887C10.7997 3.91235 10.7705 3.98282 10.7186 4.03477L3.89737 10.856Z'
                  fill='#BBBBBB'
                />
              </svg>
              New Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const InputBar = React.memo(
  ({
    role,
    content,
    messageIndex,
    sticky = false,
  }: {
    role: Role;
    content: string;
    messageIndex: number;
    sticky?: boolean;
  }) => {
    const hideSideMenu = useStore((state) => state.hideSideMenu);
    const [isEdit, setIsEdit] = useState<boolean>(sticky);

    return (
      <div
        className={`w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 bg-white group`}
      >
        <div
          className={`text-sm flex transition-all justify-center bgimage ease-in-out py-3`}
        >
          <div>
            <EditView
              content={content}
              setIsEdit={setIsEdit}
              messageIndex={messageIndex}
              sticky={sticky}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default InputBar;
