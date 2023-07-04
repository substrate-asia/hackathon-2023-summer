import React, { useEffect, useState } from 'react';
import useStore from '@store/store';

import NewChat from './NewChat';
import ChatHistoryList from './ChatHistoryList';
import LogoIcon from '@icon/LogoIcon2';
import ChatDataInsight from '@src/assets/ChatDataInsight1.png';
import MenuIcon from '@icon/MenuIcon';

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = () => setMenuOpen(!menuOpen);

  return (
    <>
      <div>
        <div className="p-2">
          <MenuIcon onClick={toggle}></MenuIcon>
        </div>
        <div onClick={toggle}  className={`fixed w-full z-10 min-h-full bg-gray-600 ${menuOpen ? '' : 'hidden'}`}>
          <div onClick={ (e) => e.stopPropagation() }  className="w-2/3 bg-white h-screen"><ChatHistoryList /></div>
        </div>
      </div>
      <div
        id='menu'
        className={`fixed md:inset-y-0 hidden md:flex md:w-[360px] md:flex-col transition-transform z-[999] h-full shadow-xl border-r left-0 top-0 bottom-0 bg-white`}
      >
        <div className='flex h-full min-h-0 flex-col'>
          <div className='scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20'>
            <nav className='flex h-full flex-1 flex-col space-y-1'>
              <header className='flex items-center py-[30px] pl-[30px] border-b-2'>
                <div className="pr-4"><LogoIcon /></div>
                <img className="h-7" src={ChatDataInsight} alt="" />
              </header>
              <ChatHistoryList />
              <NewChat />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
