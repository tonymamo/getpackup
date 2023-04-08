import { TripMemberStatus, TripType } from '@common/trip';
import {
  Avatar,
  Button,
  Column,
  FlexContainer,
  Heading,
  HorizontalRule,
  NotificationDot,
  PageContainer,
  Row,
} from '@components';
import GearClosetIcon from '@images/gearClosetIcon';
import { useLocation } from '@reach/router';
import { RootState } from '@redux/ducks';
import { brandPrimary, brandSecondary, brandSecondaryHover, textColor, white } from '@styles/color';
import { zIndexSmallScreenFooter } from '@styles/layers';
import { baseBorderStyle, visuallyHiddenStyle } from '@styles/mixins';
import { baseSpacer, halfSpacer, quadrupleSpacer } from '@styles/size';
import { fontSizeH3, fontSizeSmall } from '@styles/typography';
import { ThemeContext } from '@utils/ThemeContext';
import trackEvent from '@utils/trackEvent';
import useWindowSize from '@utils/useWindowSize';
import { Link } from 'gatsby';
import React from 'react';
import {
  FaCalendar,
  FaFacebook,
  FaInstagram,
  FaShoppingCart,
  FaTwitter,
  FaUserLock,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  background-color: ${brandSecondary};
  // background-color: var(--color-secondary);
  color: ${white};
  padding: ${quadrupleSpacer} 0;
  font-size: ${fontSizeSmall};
  & a {
    color: ${white};
    opacity: 0.8;

    &:hover,
    &:focus {
      color: ${white};
      opacity: 1;
    }
  }
`;

const Social = styled.a`
  margin-right: ${baseSpacer};
`;

const HiddenText = styled.span`
  ${visuallyHiddenStyle};
`;

const SignupFormWrapper = styled.div`
  padding: ${quadrupleSpacer} 0;
  background-color: ${brandSecondaryHover};
  text-align: center;
`;

const BottomNav = styled.nav`
  position: fixed;
  z-index: ${zIndexSmallScreenFooter};
  bottom: 0;
  min-height: calc(${quadrupleSpacer} + 1px); /* min height plus 1px border top */
  left: 0;
  right: 0;
  display: flex;
  background-color: ${white};
  border-top: ${baseBorderStyle};
  padding-bottom: env(safe-area-inset-bottom);

  & a {
    border-top: 2px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: ${quadrupleSpacer};
    color: ${textColor};
    // color: var(--color-text);
    transition: all 0.2s ease-in-out;
    position: relative;
    font-size: ${fontSizeH3};
  }

  & a:focus {
    outline: none;
  }

  & a.active {
    border-top-color: ${brandPrimary};
    color: ${brandPrimary};
  }
`;

const Footer = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const trips: Array<TripType> = useSelector((state: RootState) => state.firestore.ordered.trips);
  const loggedInUser = auth && auth.isLoaded && !auth.isEmpty;
  const size = useWindowSize();
  const location = useLocation();

  const { colorMode, setColorMode } = React.useContext(ThemeContext);

  const nonArchivedTrips: TripType[] =
    isLoaded(trips) && Array.isArray(trips) && trips && trips.length > 0
      ? trips.filter((trip: TripType) => trip.archived !== true)
      : [];

  const pendingTrips = nonArchivedTrips.filter(
    (trip) =>
      trip.tripMembers &&
      trip.tripMembers[auth.uid] &&
      trip.tripMembers[auth.uid].status === TripMemberStatus.Pending
  );

  const isInOnboardingFlow = location.pathname.includes('onboarding');

  const isPartiallyActive = ({ isPartiallyCurrent }: { isPartiallyCurrent: boolean }) => {
    return isPartiallyCurrent ? { className: 'active' } : {};
  };

  if (!auth.isLoaded) {
    return null;
  }

  return (
    <>
      {!loggedInUser && (
        <>
          <SignupFormWrapper id="signup">
            <PageContainer>
              <Heading as="h1" inverse align="center">
                Plan your first trip today
              </Heading>

              <Button type="link" to="https://packupapp.com">
                Get Started
              </Button>
            </PageContainer>
          </SignupFormWrapper>

          <StyledFooter>
            <PageContainer>
              <Row>
                <Column md={3} lg={6}>
                  <Heading>
                    <Link to="/">packup</Link>
                  </Heading>
                  <p>Get outside faster and safer.</p>
                </Column>
                <Column sm={4} md={3} lg={2}>
                  <p>
                    <Link to="/" onClick={() => trackEvent('Footer Link Click', { link: 'Home' })}>
                      Home
                    </Link>
                  </p>
                  <p>
                    <Link
                      to="https://packupapp.com"
                      onClick={() => trackEvent('Footer Link Click', { link: 'Sign Up' })}
                    >
                      Sign Up
                    </Link>
                  </p>
                </Column>
                <Column sm={4} md={3} lg={2}>
                  <p>
                    <Link
                      to="/blog"
                      onClick={() => trackEvent('Footer Link Click', { link: 'Blog' })}
                    >
                      Blog
                    </Link>
                  </p>
                  <p>
                    <Link
                      to="/about"
                      onClick={() => trackEvent('Footer Link Click', { link: 'About' })}
                    >
                      About
                    </Link>
                  </p>
                </Column>
                <Column sm={4} md={3} lg={2}>
                  <p>
                    <Link
                      to="/contact"
                      onClick={() => trackEvent('Footer Link Click', { link: 'Send a message' })}
                    >
                      Send a Message
                    </Link>
                  </p>
                  <p>
                    <a
                      href="https://reddit.com/r/packup"
                      onClick={() => trackEvent('Footer Link Click', { link: 'Send a message' })}
                    >
                      Community
                    </a>
                  </p>
                  {/* <p>
                    {colorMode ? (
                      // eslint-disable-next-line jsx-a11y/label-has-associated-control
                      <label>
                        <input
                          type="checkbox"
                          checked={colorMode === 'dark'}
                          onChange={(ev) => {
                            setColorMode(ev.target.checked ? 'dark' : 'light');
                          }}
                        />{' '}
                        {colorMode === 'dark' ? `🌝` : `🌞`}
                      </label>
                    ) : null}
                  </p> */}
                </Column>
              </Row>
              <HorizontalRule />
              <FlexContainer justifyContent="space-between">
                <nav>
                  <Social
                    href="https://www.instagram.com/getpackup/"
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Instagram' })}
                  >
                    <FaInstagram />
                    <HiddenText>Instagram</HiddenText>
                  </Social>
                  <Social
                    href="https://www.facebook.com/getpackup"
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Facebook' })}
                  >
                    <FaFacebook />
                    <HiddenText>Facebook</HiddenText>
                  </Social>
                  <Social
                    href="https://twitter.com/getpackup"
                    target="_blank"
                    rel="noopener"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Twitter' })}
                  >
                    <FaTwitter />
                    <HiddenText>Twitter</HiddenText>
                  </Social>
                </nav>
                <small>
                  <Link
                    to="/privacy"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Privacy' })}
                  >
                    Privacy
                  </Link>{' '}
                  <Link
                    to="/terms"
                    onClick={() => trackEvent('Footer Link Click', { link: 'Terms of Use' })}
                  >
                    Terms of Use
                  </Link>{' '}
                  {`Copyright © Packup Technologies, Ltd. ${new Date().getFullYear()}`}
                </small>
              </FlexContainer>
            </PageContainer>
          </StyledFooter>
        </>
      )}
      {size.isSmallScreen && loggedInUser && !isInOnboardingFlow && (
        <BottomNav>
          <Link
            to="/app/trips"
            getProps={isPartiallyActive}
            onClick={() =>
              trackEvent('Logged In Small Screen Footer Link Click', { link: 'Trips' })
            }
          >
            <FaCalendar />
            {pendingTrips.length > 0 && <NotificationDot top={`-${halfSpacer}`} right="0" />}
          </Link>
          <Link
            to="/app/gear-closet"
            getProps={isPartiallyActive}
            onClick={() =>
              trackEvent('Logged In Small Screen Footer Link Click', { link: 'Gear Closet' })
            }
          >
            <GearClosetIcon size={15} />
          </Link>
          {/* TODO: when shopping list is ready <Link
            to="/app/shopping-list"
            getProps={isPartiallyActive}
            onClick={() =>
              trackEvent('Logged In Small Screen Footer Link Click', { link: 'Shopping List' })
            }
          >
            <FaShoppingCart />
          </Link> */}
          {profile.isAdmin && (
            <Link to="/admin/gear-list" getProps={isPartiallyActive}>
              <FaUserLock />
            </Link>
          )}
          <Link
            to="/app/profile"
            getProps={isPartiallyActive}
            onClick={() =>
              trackEvent('Logged In Small Screen Footer Link Click', { link: 'Profile' })
            }
          >
            <Avatar
              src={profile.photoURL as string}
              size="xs"
              gravatarEmail={profile.email as string}
            />
          </Link>
        </BottomNav>
      )}
    </>
  );
};
export default Footer;
