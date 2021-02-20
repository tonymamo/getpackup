import React, { useState, FunctionComponent, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaEllipsisH } from 'react-icons/fa';

import { white } from '@styles/color';
import { baseBorderStyle, z1Shadow } from '@styles/mixins';
import { baseAndAHalfSpacer, doubleSpacer, halfSpacer } from '@styles/size';

type DropdownMenuProps = {};

const StyledDropdown = styled.div`
  position: absolute;
  background-color: ${white};
  border: ${baseBorderStyle};
  box-shadow: ${z1Shadow};
  right: 0;
  top: 100%;
  width: 250px;
  z-index: 1;
  padding: ${halfSpacer};
`;

const StyledDropdownWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${halfSpacer};
  border-radius: ${doubleSpacer};
  height: ${doubleSpacer};
  width: ${doubleSpacer};
  background-color: transparent;
`;

const DropdownMenu: FunctionComponent<DropdownMenuProps> = ({ children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownNode = useRef<HTMLDivElement>(null);

  const handleDropownClick = (e: MouseEvent) => {
    if (dropdownNode && dropdownNode.current && dropdownNode.current.contains(e.target as Node)) {
      return; // inside click
    }
    setDropdownOpen(false); // outside click, close the menu
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDropownClick);

    return () => {
      document.removeEventListener('mousedown', handleDropownClick);
    };
  }, []);

  return (
    <StyledDropdownWrapper onClick={() => setDropdownOpen(!dropdownOpen)} ref={dropdownNode}>
      <FaEllipsisH size={baseAndAHalfSpacer} />
      {dropdownOpen && <StyledDropdown>{children}</StyledDropdown>}
    </StyledDropdownWrapper>
  );
};

export default DropdownMenu;
