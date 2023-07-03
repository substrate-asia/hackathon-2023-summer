const emojis = {
  welcome: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <circle cx='12' cy='12' r='10'></circle>
      <path d='M8 14s1.5 2 4 2 4-2 4-2'></path>
      <line x1='9' y1='9' x2='9.01' y2='9'></line>
      <line x1='15' y1='9' x2='15.01' y2='9'></line>
    </svg>
  ),

  done: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3'></path>
    </svg>
  ),

  success: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <polyline points='9 11 12 14 22 4'></polyline>
      <path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'></path>
    </svg>
  ),

  info: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <circle cx='12' cy='12' r='10'></circle>
      <line x1='12' y1='16' x2='12' y2='12'></line>
      <line x1='12' y1='8' x2='12.01' y2='8'></line>
    </svg>
  ),

  warning: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path>
      <line x1='12' y1='9' x2='12' y2='13'></line>
      <line x1='12' y1='17' x2='12.01' y2='17'></line>
    </svg>
  ),

  error: (
    <svg
      viewBox='0 0 24 24'
      width='24'
      height='24'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='me-2'
    >
      <polygon points='7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2'></polygon>
      <line x1='15' y1='9' x2='9' y2='15'></line>
      <line x1='9' y1='9' x2='15' y2='15'></line>
    </svg>
  ),
}

const mainData = [
  {
    text: 'Message has been sent.',
    msg: 'Welcome!',
    emoji: emojis.welcome,
    variant: 'primary',
    icon: 'mdi mdi-account-search',
  },
  {
    text: 'Your profile photo updated.',
    msg: 'Done!',
    emoji: emojis.done,
    variant: 'secondary',
    icon: 'icon icon-bell-53',
  },
  {
    text: 'Message has been sent.',
    msg: 'Success!',
    emoji: emojis.success,
    variant: 'success',
    icon: 'mdi mdi-check',
  },
  {
    text: 'You have got 5 new email.',
    msg: 'Info!',
    emoji: emojis.info,
    variant: 'info',
    icon: 'mdi mdi-email',
  },
  {
    text: 'Something went wrong. Please check.',
    msg: 'Error!',
    emoji: emojis.error,
    variant: 'warning',
    icon: 'mdi mdi-alert',
  },
  {
    text: 'Message sending failed.',
    msg: 'Error!',
    emoji: emojis.error,
    variant: 'danger',
    icon: 'mdi mdi-help',
  },
  {
    text: 'You successfully read this important alert message.',
    msg: 'Error!',
    emoji: emojis.error,
    variant: 'dark',
    icon: 'mdi mdi-settings',
  },
  {
    text: 'You successfully read this message..',
    msg: 'Error!',
    emoji: emojis.error,
    variant: 'light',
    icon: 'mdi mdi-cogs',
  },
]

const socialMediaData = [
  { name: 'Facebook', icon: 'mdi mdi-facebook' },
  { name: 'Twitter', icon: 'mdi mdi-twitter' },
  { name: 'Linkedin', icon: 'mdi mdi-linkedin' },
  { name: 'Google Plus', icon: 'mdi mdi-google-plus' },
]
const leftBigIconData = [
  {
    text: 'Welcome to your account, Dear user!         ',
    msg: 'Please confirm your email address: email@example.com',
    variant: 'primary',
    icon: 'email-alert',
  },
  {
    text: 'Pending!',
    msg: 'You message sending failed.         ',
    variant: 'warning',
    icon: 'help-circle-outline',
  },
  {
    text: 'Congratulations!         ',
    msg: 'You have successfully created a account.',
    variant: 'success',
    icon: 'check-circle-outline',
  },
  {
    text: 'Loading failed!         ',
    msg: 'Again upload your server         ',
    variant: 'danger',
    icon: 'alert',
  },
]

const data = {
  mainData,
  socialMediaData,
  leftBigIconData,
}

export default data
