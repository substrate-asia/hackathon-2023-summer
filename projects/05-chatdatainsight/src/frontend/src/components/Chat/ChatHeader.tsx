import useStore from '@store/store';

export default function ChatHeader() {
  const chatTitle = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].title
      : 'New Chat'
  );
  return (
    <header className='h-12 bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 flex px-3 items-center border-b justify-between shrink-0 gap-5 z-10 transition-transform md:ml-80'>
      <div className='flex items-center'>
        <button
          type='button'
          className='inline-flex items-center justify-center -ml-2 shrink-0 h-8 w-8 rounded-lg'
        >
          <span className='i-tabler-menu-2'></span>
        </button>
        <span className='line-clamp-1'>{chatTitle}</span>
      </div>
      <div className='flex items-center gap-2 shrink-0'>
        <button
          type='button'
          aria-haspopup='dialog'
          aria-expanded='false'
          aria-controls='radix-:r8:'
          data-state='closed'
          className='rounded-lg px-2 text-sm inline-flex items-center justify-center border shrink-0 text-center disabled:pointer-events-none border-zinc-300 bg-white border-b-zinc-400/80 active:bg-zinc-200 h-8 text-logStart font-semibold'
        >
          <span className='mr-1 i-ion-diamond-outline text-lg'></span>
        </button>
        <button
          type='button'
          aria-haspopup='dialog'
          aria-expanded='false'
          aria-controls='radix-:rb:'
          data-state='closed'
          className='rounded-lg px-2 inline-flex items-center justify-center border shrink-0 text-center disabled:pointer-events-none border-zinc-300 bg-white border-b-zinc-400/80 active:bg-zinc-200 h-8 w-8 text-lg'
        >
          <span className='i-ion-ios-settings-strong'></span>
        </button>
      </div>
    </header>
  );
}
