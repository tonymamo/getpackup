import React, { FunctionComponent, useState } from 'react';
import { FaInfoCircle, FaRegCheckSquare, FaTrash, FaUsers } from 'react-icons/fa';

import { FlexContainer, DropdownMenu, Breadcrumbs } from '@components';
import { TripType } from '@common/trip';
import TripDeleteModal from '@views/TripDeleteModal';
import { Link } from 'gatsby';

type TripNavigationProps = {
  activeTrip: TripType;
};

const TripNavigation: FunctionComponent<TripNavigationProps> = ({ activeTrip }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <>
      <FlexContainer justifyContent="space-between" alignItems="center" flexWrap="nowrap">
        <Breadcrumbs tripName={activeTrip.name} />
        <DropdownMenu>
          <Link to={`/app/trips/${activeTrip.tripId}`}>
            <FaRegCheckSquare /> Packing List
          </Link>
          <Link to={`/app/trips/${activeTrip.tripId}/details`}>
            <FaInfoCircle /> Details
          </Link>
          <Link to={`/app/trips/${activeTrip.tripId}/party`}>
            <FaUsers /> Party
          </Link>
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
    </>
  );
};

export default TripNavigation;
