import {
  Box,
  Button,
  Column,
  FlexContainer,
  Heading,
  HorizontalRule,
  Input,
  Modal,
  PageContainer,
  Pill,
  Row,
  Seo,
} from '@components';
import { RouteComponentProps, useLocation } from '@reach/router';
import { brandSuccess, lightGray, lightestGray, offWhite, white } from '@styles/color';
import { baseBorderStyle } from '@styles/mixins';
import { baseSpacer, borderRadius, doubleSpacer, halfSpacer, quarterSpacer } from '@styles/size';
import { getQueryStringParams } from '@utils/queryStringUtils';
import trackEvent from '@utils/trackEvent';
import { requiredEmail } from '@utils/validations';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { CSSProperties, FunctionComponent, useRef, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styled from 'styled-components';

type LookupState = 'idle' | 'loading' | 'not-found' | 'rate-limited' | 'error';
type AccountChoice = 'unknown' | 'existing' | 'new';

type ComparisonRow = {
  feature: string;
  free: boolean | string;
  pro: boolean | string;
};

const comparisonRows: ComparisonRow[] = [
  { feature: 'Create New Trips', free: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Trip Members (per trip)', free: 'Up to 3', pro: 'Unlimited' },
  { feature: 'Personalized Gear Closet', free: true, pro: true },
  { feature: 'Shopping List', free: true, pro: true },
  { feature: 'Trip Weather Report', free: true, pro: true },
  { feature: 'Friends', free: true, pro: true },
  { feature: 'Safety Itinerary & Emergency Contacts', free: true, pro: true },
  { feature: 'Trip Chat', free: 'Read-only', pro: 'Full functionality' },
  { feature: 'Create Custom Gear Tags', free: false, pro: 'Unlimited' },
];

const comingSoonFeatures: ComparisonRow[] = [
  { feature: 'Trip Templates', free: false, pro: true },
  { feature: 'Weight Tracking (with charts)', free: false, pro: true },
  { feature: 'Print/Export packing list', free: false, pro: true },
];

const PlanCard = styled.div<{ highlight?: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${(props) => (props.highlight ? offWhite : white)};
  border: ${baseBorderStyle};
  border-radius: ${borderRadius};
  padding: ${doubleSpacer};
`;

const PlanSubHeading = styled.p`
  text-transform: uppercase;
  margin: 0;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
`;

const PlanPrice = styled.p`
  font-size: 2rem;
  font-weight: bold;
`;

const PlanFeatureList = styled.ul`
  list-style: none;
  margin: 0 0 ${doubleSpacer};
  padding: 0;
  flex-grow: 1;
`;

const PlanFeatureItem = styled.li<{ isComingSoon?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: ${baseSpacer};
  padding: ${halfSpacer} 0;
  border-bottom: ${baseBorderStyle};
  opacity: ${(props) => (props.isComingSoon ? 0.6 : 1)};

  &:last-child {
    border-bottom: none;
  }
`;

const NeutralNotice = styled.p`
  background-color: ${lightestGray};
  border-radius: ${borderRadius};
  padding: ${baseSpacer};
`;

const MountainSnowIcon: FunctionComponent<{ style?: CSSProperties }> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-mountain-snow-icon lucide-mountain-snow"
    style={style}
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" />
  </svg>
);

MountainSnowIcon.defaultProps = {
  style: undefined,
};

const renderCellValue = (value: ComparisonRow['free']) => {
  return value ? <FaCheckCircle color={brandSuccess} /> : <FaTimesCircle color={lightGray} />;
};

const Pricing: FunctionComponent<RouteComponentProps> = () => {
  const location = useLocation();
  const { uid: uidFromUrl } = getQueryStringParams(location);
  const hasUidInUrl = typeof uidFromUrl === 'string' && uidFromUrl.length > 0;

  const [emailModalIsOpen, setEmailModalIsOpen] = useState(false);
  const [lookupState, setLookupState] = useState<LookupState>('idle');
  const [accountChoice, setAccountChoice] = useState<AccountChoice>('unknown');

  const formRef = useRef<HTMLFormElement>(null);
  const uidInputRef = useRef<HTMLInputElement>(null);

  const submitCheckout = (uid: string) => {
    if (uidInputRef.current) {
      uidInputRef.current.value = uid;
    }
    // eslint-disable-next-line no-unused-expressions
    formRef.current?.requestSubmit();
  };

  const handleUpgradeClick = () => {
    trackEvent('Pricing Upgrade To Pro Clicked', { hasUidInUrl });
    if (hasUidInUrl) {
      submitCheckout(uidFromUrl as string);
    } else {
      setLookupState('idle');
      setAccountChoice('unknown');
      setEmailModalIsOpen(true);
    }
  };

  const handleEmailSubmit = async (
    values: { email: string },
    { setSubmitting }: FormikHelpers<{ email: string }>
  ) => {
    setLookupState('loading');
    try {
      const response = await fetch(process.env.GATSBY_LOOKUP_UID_FUNCTION_URL as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      if (response.status === 200) {
        const { uid } = await response.json();
        setEmailModalIsOpen(false);
        setLookupState('idle');
        submitCheckout(uid);
        return;
      }

      if (response.status === 404) {
        setLookupState('not-found');
      } else if (response.status === 429) {
        setLookupState('rate-limited');
      } else {
        setLookupState('error');
      }
    } catch {
      setLookupState('error');
    }

    // Skipped on the 200 path above (early return) - the modal has already
    // closed and unmounted Formik by then, so setSubmitting would warn about
    // updating state on an unmounted component.
    setSubmitting(false);
  };

  const renderFeatureList = (planKey: 'free' | 'pro') => (
    <PlanFeatureList>
      {comparisonRows.map((row) => (
        <PlanFeatureItem key={row.feature}>
          {renderCellValue(row[planKey])}
          <span>
            {row.feature}{' '}
            {typeof row[planKey] === 'string' ? (
              <span style={{ fontStyle: 'italic' }}> - {row[planKey]}</span>
            ) : (
              ''
            )}
          </span>
        </PlanFeatureItem>
      ))}
      {comingSoonFeatures.map((row) => (
        <PlanFeatureItem key={row.feature} isComingSoon>
          {renderCellValue(row[planKey])}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flex: 1,
              alignItems: 'center',
            }}
          >
            {row.feature} {planKey === 'pro' ? <Pill color="neutral" text="Coming Soon" /> : ''}
          </div>
        </PlanFeatureItem>
      ))}
    </PlanFeatureList>
  );

  return (
    <PageContainer withVerticalPadding>
      <Seo title="Pricing" />
      <Box>
        <Row>
          <Column sm={8} smOffset={2}>
            <div style={{ textAlign: 'center' }}>
              <Heading>Choose Your Plan</Heading>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.5 }}>
                Packup will always be free to use. Upgrade to Packup Pro to unlock additional
                features and support continued development of Packup.
              </p>
            </div>
          </Column>
        </Row>
        <HorizontalRule />
        <Row>
          <Column sm={6} xsSpacer>
            <PlanCard>
              <PlanSubHeading>Basic</PlanSubHeading>
              <Heading as="h4">Packup</Heading>
              <PlanPrice>Forever Free</PlanPrice>
              {renderFeatureList('free')}
              <Button
                type="link"
                to={process.env.GATSBY_APP_URL}
                color="primaryOutline"
                block
                onClick={() => trackEvent('Pricing Free CTA Clicked', { hasUidInUrl })}
              >
                {hasUidInUrl ? 'Open app' : 'Get started'}
              </Button>
            </PlanCard>
          </Column>
          <Column sm={6}>
            <PlanCard highlight>
              <PlanSubHeading>Full Featured</PlanSubHeading>
              <Heading as="h4">
                <MountainSnowIcon style={{ marginRight: quarterSpacer }} />
                Packup Pro
              </Heading>
              <PlanPrice>$3 CAD/mo</PlanPrice>
              {renderFeatureList('pro')}
              <Button type="button" color="primary" block onClick={handleUpgradeClick}>
                <MountainSnowIcon style={{ marginRight: quarterSpacer }} />
                Get Packup Pro
              </Button>
            </PlanCard>
          </Column>
        </Row>
      </Box>

      <form
        ref={formRef}
        method="post"
        action={`${process.env.GATSBY_APP_URL}/resource/create-checkout-session`}
        style={{ display: 'none' }}
      >
        <input
          type="hidden"
          name="lookup_key"
          defaultValue={process.env.GATSBY_STRIPE_PRICE_LOOKUP_KEY}
        />
        <input
          type="hidden"
          name="uid"
          ref={uidInputRef}
          defaultValue={hasUidInUrl ? (uidFromUrl as string) : ''}
        />
      </form>

      <Modal isOpen={emailModalIsOpen} toggleModal={() => setEmailModalIsOpen(false)}>
        {accountChoice === 'unknown' && (
          <>
            <Heading as="h4">Do you already have a Packup account?</Heading>
            <p style={{ lineHeight: 1.2 }}>
              If you already have a Packup account, use your email address to sign in on the next
              screen. Otherwise, you can create a new account.
            </p>
            <FlexContainer
              flexDirection="row"
              style={{ marginTop: doubleSpacer, gap: baseSpacer }}
              flexWrap="nowrap"
            >
              <Button
                type="button"
                color="primary"
                block
                onClick={() => {
                  trackEvent('Pricing Account Choice Selected', { choice: 'existing' });
                  setAccountChoice('existing');
                }}
              >
                Yes, I have an account
              </Button>

              <Button
                type="link"
                to={`${process.env.GATSBY_APP_URL}/signup`}
                color="primaryOutline"
                block
                onClick={() => trackEvent('Pricing Account Choice Selected', { choice: 'new' })}
              >
                No, I&apos;m new here
              </Button>
            </FlexContainer>
          </>
        )}
        {accountChoice === 'existing' && (
          <Formik initialValues={{ email: '' }} onSubmit={handleEmailSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <Heading as="h4">Enter your email to continue</Heading>
                <p style={{ lineHeight: 1.2 }}>
                  This must match your existing Packup account email address, otherwise you will not
                  be able to continue.
                </p>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  label="Email address"
                  validate={requiredEmail}
                  required
                />
                {lookupState === 'not-found' && (
                  <NeutralNotice>
                    If an account exists, you will receive further instructions.
                    <br />
                    Don&apos;t have an account yet?{' '}
                    <a href={`${process.env.GATSBY_APP_URL}/signup`}>Sign up</a>
                  </NeutralNotice>
                )}
                {lookupState === 'rate-limited' && (
                  <NeutralNotice>Please try again in a moment.</NeutralNotice>
                )}
                {lookupState === 'error' && (
                  <NeutralNotice>Something went wrong. Please try again.</NeutralNotice>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting || lookupState === 'loading'}
                  block
                  color="primary"
                >
                  Continue
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Pricing;
