import React, { FunctionComponent, Fragment, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { FaMapMarkerAlt, FaCalendar, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';
import { navigate } from 'gatsby';

import { formattedDate, formattedDateRange } from '@utils/dateUtils';
import {
  Heading,
  FlexContainer,
  HorizontalRule,
  UserMediaObject,
  Box,
  Pill,
  Button,
  DropdownMenu,
  Modal,
  Row,
  Column,
  PackingListNavigation,
  packingListNavigationHeight,
} from '@components';
import { halfSpacer } from '@styles/size';
import { TripType } from '@common/trip';
import { RootState } from '@redux/ducks';
import { UserType } from '@common/user';
import { addAlert } from '@redux/ducks/globalAlerts';

type TripSummaryProps = {
  activeTrip: TripType;
} & RouteComponentProps;

const TripSummary: FunctionComponent<TripSummaryProps> = ({ activeTrip }) => {
  const users = useSelector((state: RootState) => state.firestore.data.users);

  const firebase = useFirebase();
  const dispatch = useDispatch();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const deleteTrip = () => {
    if (activeTrip) {
      firebase
        .firestore()
        .collection('trips')
        .doc(activeTrip.tripId)
        .delete()
        .then(() => {
          navigate('/app/trips');
          dispatch(
            addAlert({
              type: 'success',
              message: 'Successfully deleted trip',
            })
          );
        })
        .catch((err) => {
          dispatch(
            addAlert({
              type: 'danger',
              message: err.message,
            })
          );
        });
    }
  };

  return (
    <>
      <PackingListNavigation tripId={activeTrip.tripId} />
      <Box style={{ marginTop: packingListNavigationHeight }}>
        <FlexContainer justifyContent="space-between" alignItems="flex-start" flexWrap="nowrap">
          {activeTrip ? (
            <Heading as="h3" altStyle noMargin>
              {activeTrip.name}
            </Heading>
          ) : (
            <Skeleton width={200} />
          )}
          {activeTrip && (
            <DropdownMenu>
              <Button
                type="link"
                color="text"
                to={`/app/trips/${activeTrip.tripId}/summary/edit`}
                iconLeft={<FaPencilAlt />}
                block
              >
                Edit
              </Button>
              <Button
                type="button"
                color="text"
                block
                onClick={() => setModalIsOpen(true)}
                iconLeft={<FaTrash />}
              >
                Delete
              </Button>
            </DropdownMenu>
          )}
        </FlexContainer>
        <HorizontalRule compact />
        {activeTrip ? (
          <p style={{ whiteSpace: 'pre-line' }}>{activeTrip.description}</p>
        ) : (
          <Skeleton count={5} />
        )}
      </Box>
      <Box>
        <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
          <FaCalendar style={{ marginRight: halfSpacer }} />{' '}
          {activeTrip ? (
            <>
              {activeTrip.tripLength === 21
                ? formattedDate(new Date(activeTrip.startDate.seconds * 1000))
                : formattedDateRange(
                    activeTrip.startDate.seconds * 1000,
                    activeTrip.endDate.seconds * 1000
                  )}
            </>
          ) : (
            <Skeleton width={200} />
          )}
        </FlexContainer>
        <HorizontalRule compact />
        <FlexContainer flexWrap="nowrap" alignItems="flex-start" justifyContent="flex-start">
          <FaMapMarkerAlt style={{ marginRight: halfSpacer }} />{' '}
          {activeTrip ? activeTrip.startingPoint : <Skeleton width={225} />}
        </FlexContainer>
        <HorizontalRule compact />
        {activeTrip && activeTrip.tags && activeTrip.tags.length ? (
          <>
            {activeTrip.tags.map((tag: string) => (
              <Pill
                key={`${tag}tag`}
                // TODO: link to tags
                // to={`/search/tags/${tag.replace(' ', '-')}`}
                text={tag}
                color="primary"
              />
            ))}
          </>
        ) : (
          <FlexContainer justifyContent="flex-start">
            {/* Generate some tag placeholders and make widths dynamic with Math */}
            {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((i) => (
              <Skeleton
                key={i}
                // random widths between 48 and 128
                width={Math.floor(Math.random() * (128 - 48 + 1) + 48)}
                style={{ marginRight: halfSpacer }}
              />
            ))}
          </FlexContainer>
        )}
      </Box>

      {activeTrip && activeTrip.tripMembers.length > 0 && (
        <Box>
          <Heading as="h4" altStyle>
            Trip Party
          </Heading>

          {activeTrip &&
            activeTrip.tripMembers.length > 0 &&
            activeTrip.tripMembers.map((tripMember, index) => {
              const matchingUser: UserType =
                users && users[tripMember] ? users[tripMember] : undefined;
              if (!matchingUser) return null;
              return (
                <Fragment key={matchingUser.uid}>
                  <UserMediaObject user={matchingUser} />
                  {index !== activeTrip.tripMembers.length - 1 && <HorizontalRule compact />}
                </Fragment>
              );
            })}
        </Box>
      )}
      <Modal
        toggleModal={() => {
          setModalIsOpen(false);
        }}
        isOpen={modalIsOpen}
      >
        <Heading>Are you sure?</Heading>
        <p>Are you sure you want to delete this trip? This action cannot be undone.</p>
        <Row>
          <Column xs={6}>
            <Button
              type="button"
              onClick={() => {
                setModalIsOpen(false);
              }}
              color="primaryOutline"
              block
            >
              Cancel
            </Button>
          </Column>
          <Column xs={6}>
            <Button
              type="button"
              onClick={() => deleteTrip()}
              block
              color="danger"
              iconLeft={<FaTrash />}
            >
              Delete
            </Button>
          </Column>
        </Row>
      </Modal>
    </>
  );
};

export default TripSummary;
