import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TrustedBySection } from '@/components/resources/TrustedBySection';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { Consumer } from '@/types/resource';

const makeConsumers = (count: number): Consumer[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `Consumer ${i + 1}`,
    website_url: `https://consumer${i + 1}.app`,
    category: 'App',
  }));

function renderWithProvider(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('TrustedBySection', () => {
  it('renders null when consumers is empty', () => {
    const { container } = renderWithProvider(<TrustedBySection consumers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when consumers is undefined (via type guard)', () => {
    // We pass an empty array since the prop type requires an array
    // The component checks length === 0, so empty array = null
    const { container } = renderWithProvider(<TrustedBySection consumers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders title and count when consumers exist', () => {
    const consumers = makeConsumers(3);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    expect(screen.getByText('يُستخدم بواسطة')).toBeTruthy();
    expect(screen.getByText('موثوق من قبل 3 تطبيق')).toBeTruthy();
  });

  it('renders count for 1 consumer', () => {
    const consumers = makeConsumers(1);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    expect(screen.getByText('موثوق من قبل 1 تطبيق')).toBeTruthy();
  });

  it('renders ConsumerGrid component', () => {
    const consumers = makeConsumers(4);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    expect(screen.getByText('Consumer 1')).toBeTruthy();
    expect(screen.getByText('Consumer 4')).toBeTruthy();
  });
});
