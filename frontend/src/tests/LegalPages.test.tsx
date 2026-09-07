import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { Footer } from '@/components/layout/Footer';
import { NavigationProvider } from '@/context/NavigationContext';

describe('Legal Pages (Terms & Conditions & Privacy Policy)', () => {
  it('renders TermsPage with editorial heading and legal sections', () => {
    render(
      <MemoryRouter>
        <TermsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Terms & Conditions' })).toBeInTheDocument();
    expect(screen.getByText(/Effective Date: September 7, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/1\. Acceptance & Use of the Platform/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Intellectual Property & Pedagogical Curricula/)).toBeInTheDocument();
    expect(screen.getByText(/3\. Fair Play & Cognitive Integrity/)).toBeInTheDocument();
    expect(screen.getByText(/4\. Disclaimer & Limitation of Liability/)).toBeInTheDocument();
  });

  it('renders PrivacyPage with editorial heading and transparent privacy sections', () => {
    render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
    expect(screen.getByText(/Effective Date: September 7, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/1\. Our Foundational Privacy Philosophy/)).toBeInTheDocument();
    expect(screen.getByText(/2\. Data Collection: Anonymous Guests vs\. Authenticated Accounts/)).toBeInTheDocument();
    expect(screen.getByText(/3\. Local Storage & Functional Cookies/)).toBeInTheDocument();
    expect(screen.getByText(/4\. Data Retention, Security & Deletion Rights/)).toBeInTheDocument();
  });

  it('verifies Footer contains working links to /privacy and /terms', () => {
    render(
      <MemoryRouter>
        <NavigationProvider>
          <Footer />
        </NavigationProvider>
      </MemoryRouter>
    );

    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' });
    const termsLink = screen.getByRole('link', { name: 'Terms of Service' });

    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(termsLink).toHaveAttribute('href', '/terms');
  });
});
