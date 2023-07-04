import { FC } from "react"
import Icon1 from "../svg/Icon1"
import Icon2 from "../svg/Icon2"
import Icon3 from "../svg/Icon3"
import Icon4 from "../svg/Icon4"
import Icon12 from "../svg/Icon12"
import { useRouter } from "next/router"
import Logo from "../svg/logo"

type Props = {
  currentPage?: 'Dashboard' | 'Service' | 'Ad' | 'Swap' | 'User Info'
}

const Sidebar: FC<Props> = ({ currentPage = 'dashboard' }) => {
  const router = useRouter()

  return (
    <div className="w-[18.125rem] h-[100vh] py-[1.875rem]">
      <div className="mb-[4.0625rem] flex justify-center cursor-pointer"
        onClick={() => {
          router.push('/')
        }}
      >
        <Logo />
      </div>
      <div className="flex flex-col items-center">
        <div className="text-[.75rem] text-gray-400 mb-4 -ml-[8.75rem]">MAIN MENU</div>
        <div className={`flex items-center w-[13.75rem] h-[2.625rem] px-[1.25rem] rounded  cursor-pointer mb-4 hover:bg-[#E1EDF9] ${currentPage === 'Dashboard' && 'bg-[#E1EDF9]'}`}
          onClick={() => {
            router.push('/dashboard')
          }}
        >
          <Icon1 />
          <div className="ml-[.4375rem] text-[1.125rem]">Dashboard</div>
        </div>
        <div className={`flex items-center w-[13.75rem] h-[2.625rem] px-[1.25rem] rounded  cursor-pointer mb-4 hover:bg-[#E1EDF9] ${currentPage === 'Service' && 'bg-[#E1EDF9]'}`}
          onClick={() => {
            router.push('/service')
          }}>
          <Icon2 />
          <div className="ml-[.4375rem] text-[1.125rem]">Service</div>
        </div>
        <div className={`flex items-center w-[13.75rem] h-[2.625rem] px-[1.25rem] rounded  cursor-pointer mb-4 hover:bg-[#E1EDF9] ${currentPage === 'Ad' && 'bg-[#E1EDF9]'}`}
          onClick={() => {
            router.push('/ad-pool')
          }}
        >
          <Icon3 />
          <div className="ml-[.4375rem] text-[1.125rem]">Ad pool</div>
        </div>
        {/* <div className={`flex items-center w-[13.75rem] h-[2.625rem] px-[1.25rem] rounded  cursor-pointer mb-4 hover:bg-[#E1EDF9] ${currentPage === 'Swap' && 'bg-[#E1EDF9]'}`}
          onClick={() => {
            router.push('/swap')
          }}
        >
          <Icon4 />
          <div className="ml-[.4375rem] text-[1.125rem]">Swap</div>
        </div> */}
        <div className={`flex items-center w-[13.75rem] h-[2.625rem] px-[1.25rem] rounded  cursor-pointer mb-4 hover:bg-[#E1EDF9] ${currentPage === 'User Info' && 'bg-[#E1EDF9]'}`}
          onClick={() => {
            router.push('/user-info')
          }}
        >
          <Icon12 />
          <div className="ml-[.4375rem] text-[1.125rem]">User Info</div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar