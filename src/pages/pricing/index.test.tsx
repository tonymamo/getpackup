import '@testing-library/jest-dom/extend-expect';

import { LocationProvider, navigate } from '@reach/router';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useStaticQuery } from 'gatsby';
import React, { FunctionComponent } from 'react';
import { HelmetProvider } from 'react-helmet-async';

import Pricing from './index';

// Mirrors gatsby-plugin-react-helmet-async's wrapRootElement, which isn't run under Jest
const TestProviders: FunctionComponent = ({ children }) => (
  <HelmetProvider>
    <LocationProvider>{children}</LocationProvider>
  </HelmetProvider>
);

const renderPricingPage = () => render(<Pricing />, { wrapper: TestProviders });

const mockSiteMetadata = {
  site: {
    siteMetadata: {
      title: 'packup',
      author: 'packup',
      description: 'Get outside faster and safer.',
      url: 'https://getpackup.com',
      image: '',
    },
  },
};

// reach-router caches location on a module-level history singleton that only
// updates via its own navigate() (or a real popstate event) - a raw
// window.history.pushState() is invisible to useLocation().
const navigateTo = (path: string) => navigate(path);

describe('Pricing page', () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockReturnValue(mockSiteMetadata);
    HTMLFormElement.prototype.requestSubmit = jest.fn();
    global.fetch = jest.fn();
    navigateTo('/pricing');
  });

  afterEach(() => {
    // resetAllMocks would also wipe the module-level Gatsby `Link` mock's
    // implementation set once in __mocks__/gatsby.js, breaking later tests.
    jest.clearAllMocks();
  });

  it('renders the Free and Pro feature cards, with Coming Soon features flagged only on the Pro card', () => {
    renderPricingPage();

    // each feature is listed on both cards, so expect one match per plan
    expect(screen.getAllByText(/Create New Trips/)).toHaveLength(2);
    expect(screen.getAllByText(/Create Custom Gear Tags/)).toHaveLength(2);

    const comingSoonBadges = screen.getAllByText('Coming Soon');
    expect(comingSoonBadges).toHaveLength(3);
    expect(screen.getAllByText(/Trip Templates/)).toHaveLength(2);
    expect(screen.getAllByText(/Weight Tracking \(with charts\)/)).toHaveLength(2);
    expect(screen.getAllByText(/Print\/Export packing list/)).toHaveLength(2);
  });

  it('submits the checkout form directly when uid is present in the URL, without showing the email input', () => {
    navigateTo('/pricing?uid=abc123');
    renderPricingPage();

    fireEvent.click(screen.getByRole('button', { name: 'Get Packup Pro' }));

    expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument();
    expect(HTMLFormElement.prototype.requestSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByDisplayValue('abc123')).toBeInTheDocument();
  });

  it('asks whether the visitor already has an account before showing the email input', () => {
    renderPricingPage();

    fireEvent.click(screen.getByRole('button', { name: 'Get Packup Pro' }));

    expect(
      screen.getByRole('heading', { name: 'Do you already have a Packup account?' })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument();
    expect(HTMLFormElement.prototype.requestSubmit).not.toHaveBeenCalled();
  });

  it('reveals the email input after choosing "Yes, I have an account"', () => {
    renderPricingPage();

    fireEvent.click(screen.getByRole('button', { name: 'Get Packup Pro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes, I have an account' }));

    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(HTMLFormElement.prototype.requestSubmit).not.toHaveBeenCalled();
  });

  it('links new visitors straight to signup instead of showing the email input', () => {
    renderPricingPage();

    fireEvent.click(screen.getByRole('button', { name: 'Get Packup Pro' }));

    expect(screen.getByRole('link', { name: "No, I'm new here" })).toBeInTheDocument();
    expect(screen.queryByLabelText('Email address')).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('auto-submits the checkout form with the resolved uid after a successful email lookup', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ uid: 'resolved-uid' }),
    });

    renderPricingPage();
    fireEvent.click(screen.getByRole('button', { name: 'Get Packup Pro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes, I have an account' }));
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'person@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(HTMLFormElement.prototype.requestSubmit).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByDisplayValue('resolved-uid')).toBeInTheDocument();
  });

  it('shows a vague neutral message and signup link on a 404, and does not submit checkout', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 404,
      json: async () => ({}),
    });

    renderPricingPage();
    fireEvent.click(screen.getByRole('button', { name: 'Get Packup Pro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes, I have an account' }));
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'person@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(
        screen.getByText(/If an account exists, you will receive further instructions\./)
      ).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Sign up' })).toBeInTheDocument();
    expect(HTMLFormElement.prototype.requestSubmit).not.toHaveBeenCalled();
  });

  it('shows a generic retry message on a 429', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 429,
      json: async () => ({}),
    });

    renderPricingPage();
    fireEvent.click(screen.getByRole('button', { name: 'Get Packup Pro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes, I have an account' }));
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'person@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.getByText('Please try again in a moment.')).toBeInTheDocument();
    });
    expect(HTMLFormElement.prototype.requestSubmit).not.toHaveBeenCalled();
  });
});
