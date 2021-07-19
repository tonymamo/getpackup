import React, { FunctionComponent, useEffect } from 'react';
import { Link, navigate } from 'gatsby';
import { RouteComponentProps } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import { useFirebase, useFirestoreConnect } from 'react-redux-firebase';
import styled from 'styled-components';

import {
  FlexContainer,
  Heading,
  HeroImageUpload,
  LoadingPage,
  PageContainer,
  Seo,
} from '@components';
import { TripType } from '@common/trip';
import { RootState } from '@redux/ducks';
import { baseSpacer } from '@styles/size';
import trackEvent from '@utils/trackEvent';
import { addAlert } from '@redux/ducks/globalAlerts';
import usePrevious from '@utils/usePrevious';

type TripHeaderImageProps = {
  id?: string;
} & RouteComponentProps;

const ImageOption = styled.img`
  margin-bottom: ${baseSpacer};
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const AddTripHeaderImage: FunctionComponent<TripHeaderImageProps> = (props) => {
  const activeTripById: Array<TripType> = useSelector(
    (state: RootState) => state.firestore.ordered.activeTripById
  );

  useFirestoreConnect([
    {
      collection: 'trips',
      doc: props.id,
      storeAs: 'activeTripById',
    },
  ]);
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const activeTrip: TripType | undefined =
    activeTripById && activeTripById.length > 0 ? activeTripById[0] : undefined;

  const prevValue = usePrevious(activeTrip?.headerImage);
  useEffect(() => {
    if (activeTrip && prevValue !== activeTrip.headerImage && activeTrip.headerImage !== '') {
      navigate(`/app/trips/${props.id}/generator`);
    }
  }, [activeTrip?.headerImage]);

  const predefinedChoices = [
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1617244552/getpackup/0f1a2062-3.jpg',
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1617244549/getpackup/044a8781.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1617244550/getpackup/044a9077-2-2.jpg',
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1617244547/getpackup/044A0009-2.jpg',
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1617244545/getpackup/SnowboarderCuttingTracksOnTheEdgeOfTheShadowOnVirginSnow.jpg',
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1617244556/getpackup/WatertonHike.jpg',
    // 'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_auto,h_512,w_2048/v1617244555/getpackup/chamonix-chrisbrinleejr-sep17-78.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1626131678/getpackup/PanoramaresortBC_TaylorBurk_yhq9bv.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131677/getpackup/BergLakeSunrise_TaylorBurk_gfpilg.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131677/getpackup/VancouverIslandBC_TaylorBurk_fyyalh.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131677/getpackup/Taylor_Burk_Patagonia_z1bec8.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131677/getpackup/VancouverIsland_TaylorBurk-7_zhwgh2.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131674/getpackup/044A4171_vpkdel.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131672/getpackup/BanffNationalParkAB2_TaylorBurk_cj27sc.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131671/getpackup/GrosMorneNFLD_TaylorBurk-15_cxae7q.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131669/getpackup/IceCaveBanffAlberta_TaylorBurk_lb0kfs.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131669/getpackup/GrosMorneNFLD_TaylorBurk-2_oio34q.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131665/getpackup/ElkIslandNationalParkAlberta_TaylorBurk_e0nahc.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1626131664/getpackup/044A5545-3_bcokpp.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131661/getpackup/044A8754-4_vmipxk.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131660/getpackup/044A4630-3_mwf30b.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_north,h_512,w_2048/v1626131659/getpackup/044A6928_rawtp5.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131653/getpackup/044A5652-3_l3sjwb.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131653/getpackup/044A0891_kesrw3.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131648/getpackup/0F1A8159_hkeys7.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131643/getpackup/044A2015-11_p8wrzc.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131644/getpackup/0F1A1972_xxnxn7.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,g_south,h_512,w_2048/v1626131637/getpackup/044A6261-3_xf1fpt.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131637/getpackup/044A6577-3_djipmj.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131635/getpackup/0F1A0636_spg3jy.jpg',
    'https://res.cloudinary.com/getpackup/image/upload/c_fill,h_512,w_2048/v1626131634/getpackup/044A5994-3_ofhstu.jpg',
  ];

  const updateTripImage = (index: number) => {
    firebase
      .firestore()
      .collection('trips')
      .doc(props.id)
      .update({
        headerImage: predefinedChoices[index],
        lastUpdated: new Date(),
      })
      .then(() => {
        trackEvent('New Predefined Trip Header Image Uploaded', {
          tripId: props.id,
          headerImage: predefinedChoices[index],
        });
        navigate(`/app/trips/${props.id}/generator`);
      })
      .catch((err) => {
        dispatch(
          addAlert({
            type: 'danger',
            message: err.message,
          })
        );
        trackEvent('New Predefined Trip Header Image Upload Failure', {
          tripId: props.id,
          headerImage: predefinedChoices[index],
          error: err,
        });
      });
  };

  return (
    <PageContainer>
      <Seo title="Add Trip Header Image" />
      <FlexContainer justifyContent="space-between" alignItems="center">
        <Heading altStyle as="h2">
          Add Trip Header Image
        </Heading>
        <p>
          <Link
            to={`/app/trips/${props.id}/generator`}
            onClick={() => trackEvent('Add Trip Header Image Skipped', { tripId: props.id })}
          >
            Skip For Now
          </Link>
        </p>
      </FlexContainer>

      {activeTrip ? (
        <>
          <HeroImageUpload type="trip" id={props.id as string} image={activeTrip?.headerImage} />
          <p style={{ textAlign: 'center' }}>Or choose from one below:</p>

          {predefinedChoices.map((img, index) => (
            <ImageOption src={img} alt="" key={img} onClick={() => updateTripImage(index)} />
          ))}
          <p>
            All photos courtesy of{' '}
            <a href="https://www.taylorburk.com/" target="_blank" rel="noopener noreferrer">
              Taylor Burk Photography
            </a>
          </p>
        </>
      ) : (
        <LoadingPage />
      )}
    </PageContainer>
  );
};

export default AddTripHeaderImage;
