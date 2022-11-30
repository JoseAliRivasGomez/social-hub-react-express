import { Navbar, Dropdown, Avatar } from "flowbite-react/lib/cjs/index.js";
import { useAuthStore } from "../../hooks/useAuthStore";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '/vite.svg' // relative path to image 

export const NavbarX = () => {

  const {startLogout, user} = useAuthStore();

  let profileDropdown = (
    <div className="flex md:order-2 z-40">
      <Dropdown
        arrowIcon={false}
        inline={true}
        label={
          <Avatar
            alt="User settings"
            img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            rounded={true}
          />
        }
      >
        <Dropdown.Header>
          <span className="block text-sm">{}</span>
          <span className="block truncate text-sm font-medium px-2">
            {user.firstName}{" "}{user.lastName}
          </span>
        </Dropdown.Header>
        <Dropdown.Item>
          <NavLink 
              className="py-0 px-4"
              to="/settings"
          >
              Settings
          </NavLink>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>
          <a className="py-0 px-4" onClick={startLogout}>Log out</a>
        </Dropdown.Item>
      </Dropdown>
      <Navbar.Toggle />
    </div>
  );

  return (
    <div className="border-2 rounded-lg mt-2">
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand>
          <img
            src={logo}
            className="mr-3 h-6 sm:h-9"
            alt="Social Hub Manager Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Social Hub Manager
          </span>
        </Navbar.Brand>
        {profileDropdown}
        <Navbar.Collapse>

          <NavLink 
              className={({isActive}) => `${isActive ? 'text-violet-900 font-bold' : ''}`} 
              to="/posts"
          >
              Posts
          </NavLink>
          <NavLink 
              className={({isActive}) => ` ${isActive ? 'text-violet-900 font-bold' : ''}`} 
              to="/schedules"
          >
              Schedules
          </NavLink>
          <NavLink 
              className={({isActive}) => ` ${isActive ? 'text-violet-900 font-bold' : ''}`} 
              to="/channels"
          >
              Channels
          </NavLink>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};