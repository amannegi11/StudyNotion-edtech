import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart,AiOutlineClose,AiOutlineArrowRight } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"
import {CiLogin} from 'react-icons/ci'
// import {RiLoginCircleLine} from 'react-icons/ri'


import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {
  const [showOptions, setShowOptions] = useState(false);
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow((prevShowOptions) => !prevShowOptions);
  };

  const handleHamburgerClick = () => {
    setShowOptions((prevShowOptions) => !prevShowOptions);
  };
  useEffect(() => {
    // Add event listener when the component mounts
    window.addEventListener('scroll', closeHamburgerMenuOnReload);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', closeHamburgerMenuOnReload);
    };
  }, []);

 

  const closeHamburgerMenuOnReload = () => {
    setShowOptions(false); // Close the hamburger menu before reloading
  };

  
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // When the location.pathname changes, close the hamburger menu
    closeHamburgerMenuOnReload();
  }, [location.pathname]);

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }
  
  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700  relative  ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) :subLinks /*.length*/ ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" 
          onClick={handleHamburgerClick}
          />
        </button>
        {showOptions ?
        (<div className="w-[50%] absolute right-0 top-0 h-screen bg-richblack-900 z-[1000] md:hidden">
        <div className="m-[15px] mb-16 ">
            <AiOutlineClose className="text-white text-2xl border-2 border-white"
            onClick={handleHamburgerClick}/>
        </div>
        <ul className="m-4">
         <li>
            {token !== null && <ProfileDropdown />}
        </li> 
        {NavbarLinks.map((link, index) => (
            <li key={index} className="mt-4">
              {link.title === "Catalog" ? (
                <>
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                    onClick={handleShow}
                  >
                    <p>Courses</p>
                    <BsChevronDown />
                    <div  
                    className={`${show ? "invisible absolute left-[50%] top-[50%] z-[1000] flex w-[170px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]":"hidden" }`}>
                      <div className="absolute left-[30%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) :subLinks /*.length*/ ? (
                        <>
                          {subLinks
                            ?.filter(
                              (subLink) => subLink?.courses?.length > 0
                            )
                            ?.map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                key={i}
                              >
                                <p>{subLink.name}</p>
                              </Link>
                            ))}
                        </>
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <Link to={link?.path}>
                  <p
                    className={`${
                      matchRoute(link?.path)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    {link.title}
                  </p>
                </Link>
              )}
            </li>
          ))}
          <li className=" items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className={`${ matchRoute("/dashboard/cart")
            ? "text-yellow-25"
            : "text-richblack-25"} relative flex mt-4 gap-2`}>
              <p >Cart</p>
              <AiOutlineShoppingCart className="text-2xl" />
              {totalItems > 0 && (
                <span className="absolute lg:-bottom-2  bottom-3 lg:-right-2 right-24  grid h-5 w-5 place-items-center overflow-hidden rounded-full
                 bg-richblack-600 text-center text-xs font-bold text-yellow-100 ">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className={`${ matchRoute("/login")
                        ? "text-yellow-25"
                        : "text-richblack-25"} mt-4 mr-20 flex items-center gap-1`}>
                <p>Log in</p>
                <AiOutlineArrowRight />
                
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className={`${ matchRoute("/signup")
                        ? "text-yellow-25"
                        : "text-richblack-25"} mt-4 flex items-center gap-1`}>
                <p>Sign up</p>
                <CiLogin className="text-xl"/>
              </button>
            </Link>
          )}
          
        </li>
        </ul>
        

      </div>):(<></>)}
      </div>
      
    </div>
  )
}

export default Navbar