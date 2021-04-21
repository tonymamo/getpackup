import React, { FunctionComponent, useState } from 'react';
import { FaInfoCircle, FaRegCheckSquare, FaTrash, FaUsers } from 'react-icons/fa';
import { Link } from 'gatsby';
import { useLocation } from '@reach/router';

import { FlexContainer, DropdownMenu, Breadcrumbs } from '@components';
import { TripType } from '@common/trip';
import TripDeleteModal from '@views/TripDeleteModal';
import { baseSpacer } from '@styles/size';

type TripNavigationProps = {
  activeTrip: TripType;
};

const TripNavigation: FunctionComponent<TripNavigationProps> = ({ activeTrip }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { pathname } = useLocation();
  const detailspageIsActive = pathname.includes('details');
  const partyPageIsActive = pathname.includes('party');

  return (
    <div style={{ marginBottom: baseSpacer }}>
      <FlexContainer justifyContent="space-between" alignItems="center" flexWrap="nowrap">
        <Breadcrumbs tripName={activeTrip.name} />
        <DropdownMenu>
          <Link to={`/app/trips/${activeTrip.tripId}`}>
            <FaRegCheckSquare /> Packing List
          </Link>
          {partyPageIsActive && (
            <Link to={`/app/trips/${activeTrip.tripId}/details`}>
              <FaInfoCircle /> Details
            </Link>
          )}
          {detailspageIsActive && (
            <Link to={`/app/trips/${activeTrip.tripId}/party`}>
              <FaUsers /> Party
            </Link>
          )}

          <Link to="/" onClick={() => setModalIsOpen(true)}>
            <FaTrash /> Delete
          </Link>
        </DropdownMenu>
      </FlexContainer>
      <TripDeleteModal
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        tripId={activeTrip.tripId}
      />
    </div>
  );
};

export default TripNavigation;
