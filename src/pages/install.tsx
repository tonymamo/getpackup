import { Box, Button, Column, Heading, HorizontalRule, PageContainer, Row, Seo } from '@components';
import step1android from '@images/A2HS-step1-android.png';
import step1ios from '@images/A2HS-step1-ios.png';
import step2android from '@images/A2HS-step2-android.png';
import step2ios from '@images/A2HS-step2-ios.png';
import step3android from '@images/A2HS-step3-android.png';
import step3ios from '@images/A2HS-step3-ios.png';
import step4ios from '@images/A2HS-step4-ios.png';
import { Link } from 'gatsby';
import React, { FunctionComponent } from 'react';
import { FaCaretDown } from 'react-icons/fa';

type InstallProps = {};

const Install: FunctionComponent<InstallProps> = () => {
  return (
    <PageContainer withVerticalPadding>
      <Seo title="Install the Packup App" />
      <Box>
        <Row>
          <Column md={8} mdOffset={2}>
            <Heading align="center">Get the App</Heading>
            <HorizontalRule />
            <Heading as="h5" align="center">
              Wait, no link to the App Store? 🧐
            </Heading>
            <HorizontalRule />
            <p>
              That&apos;s right! Packup is basically a website you can save as an app to your device
              without the need to use the Apple App Store or Google Play Store!
            </p>
            <Button
              type="link"
              to="#read-more"
              block
              iconLeft={<FaCaretDown />}
              iconRight={<FaCaretDown />}
            >
              Skip to Instructions
            </Button>
            <br />
            <br />
            <br />
            <br />
            <p>
              We’re using a new technology called a “Progressive Web App” for the early stages of
              our platform - it combines the best of web and mobile apps. Think of it as a website
              built using web technologies, but acts and feels like an app. It seems complicated,
              but it&apos;s not.
            </p>

            <p>
              Want to know more? You can read more about the specifics{' '}
              <Link to="/blog/2021-07-11-packup-beta-guide-were-finally-public/#what-is-a-progressive-web-app">
                on our blog post about our Beta Launch
              </Link>
              .
            </p>
            <div style={{ marginBottom: 100 }}>&nbsp;</div>
          </Column>
        </Row>
        <HorizontalRule />
        <Row>
          <Column md={8} mdOffset={2}>
            <Heading align="center" as="h2" id="read-more">
              How to Add the Packup App to Your Home Screen
            </Heading>
            <p style={{ textAlign: 'center' }}>
              Follow the instructions below to add a shortcut to the packup app on the home screen
              of your iPad, iPhone, or Android devices, or even as an app on your laptop or desktop.
            </p>
            <p style={{ textAlign: 'center' }}>
              Jump to: <a href="#ios">iPhone/iPad</a>
              {' | '}
              <a href="#android">Android</a>
              {' | '}
              <a href="#desktop">Laptop/Desktop</a>
            </p>
          </Column>
        </Row>
        <HorizontalRule />
        <Row>
          <Column md={8} mdOffset={2}>
            <Heading as="h3" id="ios">
              iPhone or iPad
            </Heading>
            <ol start={1}>
              <li>
                <p>
                  View <a href="/">getpackup.com</a> in the Safari app. &nbsp;This does not work
                  from the Chrome app or other third-party browsers at this time unfortunately.
                </p>
              </li>
              <li>
                <p>
                  Tap the icon featuring an up-pointing arrow coming out of a box from the menu bar
                  of the Safari window to open a drop-down menu. On iPhones this at the bottom, and
                  on iPads at the top right corner.
                </p>
                <p style={{ textAlign: 'center' }}>
                  <img src={step1ios} alt="" width={300} height={600} />
                </p>
              </li>
              <li>
                <p>
                  Tap the <strong>Add to Home Screen</strong> option, which you may have to scroll
                  down a bit to see. A dialog box will appear, with the icon that will be used for
                  this app on the left side of the dialog box.
                </p>
                <p style={{ textAlign: 'center' }}>
                  <img src={step2ios} alt="" width={300} height={600} />
                </p>
              </li>
              <li>
                <p>
                  Tap <strong>Add</strong>, and then Safari will close automatically and you will be
                  taken to where the icon is located on your iPhone&apos;s or iPad&apos;s home
                  screen.
                </p>
                <p style={{ textAlign: 'center' }}>
                  <img src={step3ios} alt="" width={300} height={600} />
                </p>
              </li>
              <li>
                <p>Observe that your app is now saved to your home screen!</p>
                <p style={{ textAlign: 'center' }}>
                  <img src={step4ios} alt="" width={300} height={600} />
                </p>
              </li>
            </ol>
          </Column>
        </Row>

        <HorizontalRule />
        <Row>
          <Column md={8} mdOffset={2}>
            <Heading as="h3" id="android">
              Android
            </Heading>
            <ol start={1}>
              <li>
                <p>
                  Launch the Chrome app and visit <a href="/">getpackup.com</a>.
                </p>
                <p style={{ textAlign: 'center' }}>
                  <img src={step1android} alt="" width={300} height={618} />
                </p>
              </li>
              <li>
                <p>
                  Tap the menu icon (3 dots in upper right-hand corner) and tap{' '}
                  <strong>Add to Home screen</strong>.
                </p>
                <p style={{ textAlign: 'center' }}>
                  <img src={step2android} alt="" width={300} height={618} />
                </p>
              </li>
              <li>
                <p>
                  Tap <strong>Add</strong>, and the app will now live on your Android&apos;s home
                  screen.
                </p>
                <p style={{ textAlign: 'center' }}>
                  <img src={step3android} alt="" width={300} height={618} />
                </p>
              </li>
            </ol>
          </Column>
        </Row>

        <HorizontalRule />
        <Row>
          <Column md={8} mdOffset={2}>
            <Heading as="h3" id="desktop">
              Laptop/Desktop
            </Heading>
            <ol start={1}>
              <li>
                <p>
                  Launch your browser of choice and visit <a href="/">getpackup.com</a>.
                </p>
              </li>
              <li>
                <p>
                  Look for a Plus icon (+), a menu option, or follow prompts for saving the website
                  as an App on your computer. Each browser is slightly different unfortunately, so{' '}
                  <Link to="/contact">give us a shout</Link> if you need help.
                </p>
              </li>
              <li>
                <p>
                  Tap <strong>Add</strong>, and the app will now live on your computer as a
                  standalone app!
                </p>
              </li>
            </ol>
            <p>
              <em>
                PS&mdash;Don&apos;t worry if you cannot figure it out, you can still just use it as
                a website and save a bookmark
              </em>{' '}
              😎
            </p>
          </Column>
        </Row>
      </Box>
    </PageContainer>
  );
};

export default Install;
