import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConsumerGrid } from '@/components/resources/ConsumerGrid';
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

describe('ConsumerGrid', () => {
  it('renders all consumers when count is <= 6', () => {
    const consumers = makeConsumers(4);
    renderWithProvider(<ConsumerGrid consumers={consumers} />);
    consumers.forEach((c) => expect(screen.getByText(c.name)).toBeTruthy());
    expect(screen.queryByText('+2')).toBeNull();
  });

  it('renders 6 consumers and +N placeholder when count > 6', () => {
    const consumers = makeConsumers(10);
    renderWithProvider(<ConsumerGrid consumers={consumers} />);
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Consumer ${i}`)).toBeTruthy();
    }
    expect(screen.getByText('+4')).toBeTruthy();
  });

  it('expands to show all consumers when +N is clicked', () => {
    const consumers = makeConsumers(10);
    renderWithProvider(<ConsumerGrid consumers={consumers} />);
    fireEvent.click(screen.getByText('+4'));
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Consumer ${i}`)).toBeTruthy();
    }
  });

  it('shows "Show less" button after expanding', () => {
    const consumers = makeConsumers(10);
    renderWithProvider(<ConsumerGrid consumers={consumers} />);
    fireEvent.click(screen.getByText('+4'));
    expect(screen.getByText('عرض أقل')).toBeTruthy();
  });

  it('collapses back to 6 when "Show less" is clicked', () => {
    const consumers = makeConsumers(10);
    renderWithProvider(<ConsumerGrid consumers={consumers} />);
    fireEvent.click(screen.getByText('+4'));
    fireEvent.click(screen.getByText('عرض أقل'));
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Consumer ${i}`)).toBeTruthy();
    }
    expect(screen.queryByText('+4')).toBeTruthy();
  });

  it('does not show "+N" when exactly 6 consumers', () => {
    const consumers = makeConsumers(6);
    renderWithProvider(<ConsumerGrid consumers={consumers} />);
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Consumer ${i}`)).toBeTruthy();
    }
    expect(screen.queryByText('+0')).toBeNull();
  });
});
