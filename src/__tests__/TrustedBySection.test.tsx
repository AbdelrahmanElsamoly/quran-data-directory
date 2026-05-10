import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TrustedBySection } from '@/components/resources/TrustedBySection';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { Consumer } from '@/types/resource';

const makeConsumers = (count: number): Consumer[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `Consumer ${i + 1}`,
    website_url: `https://consumer${i + 1}.app`,
    category: i % 2 === 0 ? 'Enterprise' : 'Platform',
  }));

function renderWithProvider(ui: React.ReactElement, locale: 'ar' | 'en' = 'ar') {
  return render(<LanguageProvider>{ui}</LanguageProvider>, {
    wrapper: ({ children }) => {
      // Override locale by setting localStorage before mount
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: (key: string) => key === 'ratq_locale' ? locale : null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
        },
        writable: true,
      });
      return <LanguageProvider>{children}</LanguageProvider>;
    },
  });
}

describe('TrustedBySection', () => {
  it('renders null when consumers is empty', () => {
    const { container } = renderWithProvider(<TrustedBySection consumers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders heading and count when consumers exist (Arabic)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'ar');
    expect(screen.getByText('موثوق من قبل')).toBeTruthy();
    expect(screen.getByText('موثوق من قبل 5 تطبيق')).toBeTruthy();
  });

  it('renders heading and count when consumers exist (English)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    expect(screen.getByText('Trusted By')).toBeTruthy();
    expect(screen.getByText('Trusted by 5 applications')).toBeTruthy();
  });

  it('renders exactly 3 featured consumers', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'ar');
    expect(screen.getByText('Consumer 1')).toBeTruthy();
    expect(screen.getByText('Consumer 2')).toBeTruthy();
    expect(screen.getByText('Consumer 3')).toBeTruthy();
    // Consumer 4 and 5 should NOT be visible initially
    expect(screen.queryByText('Consumer 4')).toBeNull();
    expect(screen.queryByText('Consumer 5')).toBeNull();
  });

  it('shows expand trigger when there are more than 3 consumers (Arabic)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'ar');
    expect(screen.getByText(/عرض الكل/)).toBeTruthy();
  });

  it('shows expand trigger when there are more than 3 consumers (English)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    expect(screen.getByText(/Show all/)).toBeTruthy();
  });

  it('does not show expand trigger when 3 or fewer consumers', () => {
    const consumers = makeConsumers(3);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'ar');
    expect(screen.queryByText(/عرض الكل|Show all/)).toBeNull();
  });

  it('expands to show all consumers on click (Arabic)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'ar');
    fireEvent.click(screen.getByText(/عرض الكل/));
    expect(screen.getByText('Consumer 4')).toBeTruthy();
    expect(screen.getByText('Consumer 5')).toBeTruthy();
    expect(screen.getByText('عرض أقل')).toBeTruthy();
  });

  it('expands to show all consumers on click (English)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    fireEvent.click(screen.getByText(/Show all/));
    expect(screen.getByText('Consumer 4')).toBeTruthy();
    expect(screen.getByText('Consumer 5')).toBeTruthy();
    expect(screen.getByText('Show less')).toBeTruthy();
  });

  it('collapses back to featured only on second click', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'ar');
    fireEvent.click(screen.getByText(/عرض الكل/));
    expect(screen.getByText('Consumer 4')).toBeTruthy();
    fireEvent.click(screen.getByText('عرض أقل'));
    expect(screen.queryByText('Consumer 4')).toBeNull();
    expect(screen.queryByText('Consumer 5')).toBeNull();
    expect(screen.getByText(/عرض الكل/)).toBeTruthy();
  });

  it('renders category labels for featured consumers', () => {
    const consumers = makeConsumers(3);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'ar');
    // Consumer 1 = Enterprise, Consumer 2 = Platform, Consumer 3 = Enterprise
    const allEnterprise = screen.getAllByText('Enterprise');
    expect(allEnterprise.length).toBe(2);
    expect(screen.getByText('Platform')).toBeTruthy();
  });

  it('renders consumer avatars as links', () => {
    const consumers = makeConsumers(1);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'ar');
    const link = screen.getByText('Consumer 1').closest('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('https://consumer1.app');
    expect(link?.getAttribute('target')).toBe('_blank');
  });
});
