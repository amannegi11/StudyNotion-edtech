import { useState,useRef,useEffect} from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../common/ConfirmationModal"
import SidebarLink from "./SidebarLink"
import {FcSettings} from 'react-icons/fc'
import {BsFillArrowLeftSquareFill} from 'react-icons/bs'
export default function Sidebar() {
  const [open,setopen]=useState(false)

  const handler=()=>{
    setopen((open)=>!open)
  }
  

  

    
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }
  // flex
  return (
    <>
      <div className={`${!open ? "md:hidden  absolute   rounded-sm right-8 top-8":"hidden" }`}>
        <FcSettings className="text-[38px] font-extrabold "
        onClick={handler}/>
      </div>
      <div className={`${!open ? "translate-x-[-220px] ":"translate-x-0 "} h-[calc(100vh-3.5rem)] lg:mt-0  min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10
          lg:translate-x-0  lg:relative absolute transition-all duration-1000 z-[999]`}>
        <div className="flex flex-col ">
          
          {/* extra  */}
          <div className="ml-[20px] mr-6 flex gap-2 bg-yellow-100 mb-4 p-2 rounded-md lg:hidden"
          onClick={handler}>
            
            <BsFillArrowLeftSquareFill
            className="text-2xl text-richblack-900"
            />
            <p className="text-richblack-900 font-semibold">BACK</p>
          </div>

          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} 
              />
            )
          })}
        </div>
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
        <div className="flex flex-col">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}