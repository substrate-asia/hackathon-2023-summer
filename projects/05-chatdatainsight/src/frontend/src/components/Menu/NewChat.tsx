import React from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import PlusIcon from '@icon/PlusIcon';
import Avatar from '@icon/Avatar';
import useAddChat from '@hooks/useAddChat';

const NewChat = () => {
  const { t } = useTranslation();
  const addChat = useAddChat();
  const generating = useStore((state) => state.generating);
  const setError = useStore((state) => state.setError);
  //   <button
  //   type='button'
  //   onClick={() => {
  //     if (!generating) { setError(''); addChat() };
  //   }}
  //   className='h-6 w-full inline-flex items-center whitespace-nowrap justify-start bg-transparent hover:text-black'
  // >
  //   <PlusIcon /> New Chat
  // </button>
  // <div className='flex items-center'>
  //   <button
  //     type='button'
  //     className='inline-flex items-center hover:text-black outline-none'
  //     aria-haspopup='menu'
  //     aria-expanded='false'
  //     data-state='closed'
  //   >
  //     <span className='i-tabler-dots'></span>
  //   </button>
  // </div>
  return (
    <div className='border-t-2 shrink-0 p-7'>
      <div className='bg-btn right-8	 text-sm absolute text-white h-5 w-[62px] text-center rounded'>
        Free
      </div>
      <div className='flex text-sm items-center pb-4'>
        <div className='mr-2'>
          <Avatar />
        </div>
        <div>
          <div className='text-black'>User</div>
          <div className='text-gray-500	'>0xfwer8097wgweg0879gewgw35</div>
        </div>
      </div>
      <div className='font-bold	text-white text-sm flex items-center justify-center rounded-xl	bg-btn h-[44px] w-[296px] cursor-pointer mx-auto mb-3'>
        Upgrade to Pro
      </div>
      <div className='flex text-sm text-gray-900 items-center'>
        <svg
          className='mr-1'
          width='10'
          height='14'
          viewBox='0 0 10 14'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M0.857117 7V12C0.857117 12.5523 1.30483 13 1.85712 13H4.19045C4.74273 13 5.19045 12.5523 5.19045 12V10.3333M0.857117 7V2C0.857117 1.44772 1.30483 1 1.85712 1H4.19045C4.74273 1 5.19045 1.44772 5.19045 2V3.66667M0.857117 7H8.85712M8.85712 7L6.19045 4.33333M8.85712 7L6.19045 9.66667'
            stroke='#949494'
          />
        </svg>{' '}
        Log out
      </div>
    </div>
  );
};

export default NewChat;
