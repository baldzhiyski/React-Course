/* eslint-disable react/prop-types */

// Imports React utilities, portal creation, icons, styling, and a custom hook
import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom"; // for rendering outside the DOM hierarchy
import { HiEllipsisVertical } from "react-icons/hi2"; // vertical ellipsis icon
import styled from "styled-components"; // CSS-in-JS library
import { useOutsideClick } from "../hooks/useOutsideClick"; // hook to detect clicks outside an element

// Base container for menu items (flex-end aligns children to the right)
const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

// Styles for the toggle button that opens the menu
const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

// Styles for the popup list (position fixed to control placement relative to viewport)
const StyledList = styled.ul`
  position: fixed;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  /* position based on calculated x/y from toggle click */
  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

// Styles for each button inside the menu list
const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

// Create a Context for menu state
const MenusContext = createContext();

// Provider component that holds open/close state and position
function Menus({ children }) {
  const [openId, setOpenId] = useState(""); // track which menu is open by ID
  const [position, setPosition] = useState(null); // store x/y for portal positioning

  const close = () => setOpenId(""); // close any open menu
  const open = setOpenId; // open a specific menu by setting its ID

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

// Toggle component: the clickable icon/button to open/close a menu
function Toggle({ id }) {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  function handleClick(e) {
    // Calculate position relative to viewport for portal placement
    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x, // distance from right edge
      y: rect.y + rect.height + 8, // just below the button with margin
    });

    // Toggle open/close based on current openId
    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical /> {/* Icon for menu toggle */}
    </StyledToggle>
  );
}

// List component: renders the menu items via React portal
function List({ id, children }) {
  const { openId, position, close } = useContext(MenusContext);
  const ref = useOutsideClick(close); // close menu when clicking outside

  // Only render if this menu is the open one
  if (openId !== id) return null;

  return createPortal(
    <StyledList position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body // mount list at root of document to avoid overflow issues
  );
}

// Button component: individual action within the menu list
function Button({ children, icon, onClick }) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.(); // call any provided click handler
    close(); // close menu after action
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span> {/* label for the button */}
      </StyledButton>
    </li>
  );
}

// Attach subcomponents to Menus for compound API
Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus; // Default export for usage
