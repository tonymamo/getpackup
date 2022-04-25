import React, { FunctionComponent, useState } from 'react';
import { FaInfoCircle, FaRegCheckSquare, FaSignOutAlt, FaTrash, FaUsers } from 'react-icons/fa';
import { Link } from 'gatsby';
import { useLocation } from '@reach/router';

import { FlexContainer, DropdownMenu, Breadcrumbs } from '@components';
import { TripType } from '@common/trip';
import TripDeleteModal from '@views/TripDeleteModal';
import { baseSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import LeaveTheTripModal from '@views/LeaveTheTripModal';

type TripNavigationProps = {
  activeTrip: TripType;
  userIsTripOwner: boolean | undefined;
};

const TripNavigation: FunctionComponent<TripNavigationProps> = ({
  activeTrip,
  userIsTripOwner,
}) => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [leaveTripModalIsOpen, setLeaveTripModalIsOpen] = useState(false);

  const { pathname } = useLocation();
  const detailspageIsActive = pathname.includes('details');
  const partyPageIsActive = pathname.includes('party');

  return (
    <div style={{ marginBottom: baseSpacer }}>
      <FlexContainer justifyContent="space-between" alignItems="center" flexWrap="nowrap">
        <Breadcrumbs tripName={activeTrip.name} />
        <DropdownMenu>
          <Link
            to={`/app/trips/${activeTrip.tripId}`}
            onClick={() => trackEvent('Trip Nav Packing List Dropdown Link Clicked', activeTrip)}
          >
            <FaRegCheckSquare /> Packing List
          </Link>
          {partyPageIsActive && (
            <Link
              to={`/app/trips/${activeTrip.tripId}/details`}
              onClick={() => trackEvent('Trip Nav Details Dropdown Link Clicked', activeTrip)}
            >
              <FaInfoCircle /> Details
            </Link>
          )}
          {detailspageIsActive && (
            <Link
              to={`/app/trips/${activeTrip.tripId}/party`}
              onClick={() => trackEvent('Trip Nav Party Dropdown Link Clicked', activeTrip)}
            >
              <FaUsers /> Party
            </Link>
          )}

          {userIsTripOwner ? (
            <button
              type="button"
              onClick={() => {
                setDeleteModalIsOpen(true);
                trackEvent('Trip Nav Delete Trip Dropdown Link Clicked', activeTrip);
              }}
            >
              <FaTrash /> Delete
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setLeaveTripModalIsOpen(true);
                trackEvent('Trip Nav Leave Trip Dropdown Link Clicked', activeTrip);
              }}
            >
              <FaSignOutAlt /> Leave Trip
            </button>
          )}
        </DropdownMenu>
      </FlexContainer>
      <TripDeleteModal
        setModalIsOpen={setDeleteModalIsOpen}
        modalIsOpen={deleteModalIsOpen}
        trip={activeTrip}
      />
      <LeaveTheTripModal
        setModalIsOpen={setLeaveTripModalIsOpen}
        modalIsOpen={leaveTripModalIsOpen}
        trip={activeTrip}
      />
    </div>
  );
};

export default TripNavigation;
