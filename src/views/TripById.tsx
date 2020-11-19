import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { FaMapMarkerAlt, FaCalendar, FaPencilAlt } from 'react-icons/fa';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { Link } from 'gatsby';
import SwipeableViews from 'react-swipeable-views';
import styled from 'styled-components';

import { Heading, Box, Seo, FlexContainer, HorizontalRule } from '../components';
import { RootState } from '../redux/ducks';
import { TripType } from './Trips';
import { formattedDateRange, isBeforeToday } from '../utils/dateUtils';
import { brandPrimary, white, textColor } from '../styles/color';
import { baseSpacer, doubleSpacer } from '../styles/size';
import { baseBorderStyle } from '../styles/mixins';

type TripByIdProps = {
  user?: firebase.User;
  id?: string;
} & RouteComponentProps;

const Tabs = styled.div`
  background-color: ${white};
  display: flex;
  justify-content: space-between;
  margin-top: -${doubleSpacer};
  margin-left: -${baseSpacer};
  margin-right: -${baseSpacer};
  margin-bottom: ${baseSpacer};
  cursor: pointer;
  border-bottom: ${baseBorderStyle};
`;

const Tab = styled.div`
  transition: all 0.2s ease-in-out;
  flex: 1;
  text-align: center;
  padding: ${baseSpacer};
  border-bottom: 2px solid;
  border-bottom-color: ${(props: { active: boolean; onClick: () => void }) =>
    props.active ? brandPrimary : 'transparent'};
  color: ${(props) => (props.active ? brandPrimary : textColor)};
`;

const TripById: FunctionComponent<TripByIdProps> = (props) => {
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  useFirestoreConnect([{ collection: 'trips', where: ['owner', '==', props.user?.uid] }]);

  const [activeTab, setActiveTab] = useState(0);

  const activeTrip = trips && trips.find((trip) => trip.id === props.id);
  return (
    <>
      <Seo title={activeTrip?.name || 'Trip Summary'} />

      <Tabs>
        <Tab active={activeTab === 0} onClick={() => setActiveTab(0)}>
          Summary
        </Tab>
        <Tab active={activeTab === 1} onClick={() => setActiveTab(1)}>
          Pre-Trip
        </Tab>
        <Tab active={activeTab === 2} onClick={() => setActiveTab(2)}>
          Checklist
        </Tab>
      </Tabs>

      {activeTrip ? (
        <SwipeableViews index={activeTab} onChangeIndex={(i) => setActiveTab(i)}>
          <div>
            <Box>
              <FlexContainer
                justifyContent="space-between"
                alignItems="flex-start"
                flexWrap="nowrap"
              >
                <Heading as="h3" altStyle>
                  {activeTrip.name}
                </Heading>
                {!isBeforeToday(activeTrip.endDate.seconds * 1000, activeTrip.timezoneOffset) && (
                  <div>
                    <Link to={`/app/trips/${activeTrip.id}/edit`}>
                      <FaPencilAlt /> Edit
                    </Link>
                  </div>
                )}
              </FlexContainer>

              <p>{activeTrip.description}</p>
            </Box>
            <Box>
              <p>
                <FaMapMarkerAlt /> {activeTrip.startingPoint}
              </p>
              <HorizontalRule compact />
              <p>
                <FaCalendar />{' '}
                {formattedDateRange(
                  activeTrip.startDate.seconds * 1000,
                  activeTrip.endDate.seconds * 1000,
                  activeTrip.timezoneOffset
                )}
              </p>
              <HorizontalRule compact />
            </Box>
          </div>
          <Box>
            <strong>To-do</strong>
          </Box>
          <Box>
            <strong>Hiking Gear</strong>
            <ul>
              <li>50-75 L backpack</li>
              <li>Raincover</li>
            </ul>
            <strong>Safety Gear</strong>
            <ul>
              <li>Headlamp</li>
              <li>Sunscreen</li>
            </ul>
          </Box>
        </SwipeableViews>
      ) : (
        <p>No trip found</p>
      )}
    </>
  );
};

export default TripById;
