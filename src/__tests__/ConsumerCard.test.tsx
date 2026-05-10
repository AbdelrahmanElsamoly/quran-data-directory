import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConsumerCard } from '@/components/resources/ConsumerCard';
import type { Consumer } from '@/types/resource';

const baseConsumer: Consumer = {
  name: 'Quran.com',
  website_url: 'https://quran.com',
  category: 'Website',
};

describe('ConsumerCard', () => {
  it('renders consumer name and category', () => {
    render(<ConsumerCard consumer={baseConsumer} index={0} />);
    expect(screen.getByText('Quran.com')).toBeTruthy();
    expect(screen.getByText('Website')).toBeTruthy();
  });

  it('renders initials when no logo is provided', () => {
    render(<ConsumerCard consumer={baseConsumer} index={0} />);
    expect(screen.getByText('Q')).toBeTruthy();
  });

  it('renders logo image when logo_url is provided', () => {
    const consumerWithLogo: Consumer = { ...baseConsumer, logo_url: '/logo.png' };
    render(<ConsumerCard consumer={consumerWithLogo} index={0} />);
    const img = screen.getByAltText('Quran.com logo');
    expect(img).toBeTruthy();
    expect(img).toHaveAttribute('src', '/logo.png');
  });

  it('falls back to initials when logo image fails to load', async () => {
    const consumerWithLogo: Consumer = { ...baseConsumer, logo_url: '/broken-logo.png' };
    render(<ConsumerCard consumer={consumerWithLogo} index={0} />);
    const img = screen.getByAltText('Quran.com logo');
    // Simulate image load error
    await act(async () => {
      img.dispatchEvent(new Event('error', { bubbles: true }));
    });
    expect(screen.getByText('Q')).toBeTruthy();
  });

  it('renders as a clickable link when website_url is valid', () => {
    render(<ConsumerCard consumer={baseConsumer} index={0} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://quran.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders as a div when website_url is invalid', () => {
    const consumerNoLink: Consumer = { ...baseConsumer, website_url: 'not-a-url' };
    render(<ConsumerCard consumer={consumerNoLink} index={0} />);
    const card = screen.getByText('Quran.com').closest('div');
    expect(card).not.toBeNull();
    expect(card!.tagName).toBe('DIV');
  });

  it('renders without category when not provided', () => {
    const consumerNoCategory: Consumer = { name: 'Test App', website_url: 'https://test.app' };
    render(<ConsumerCard consumer={consumerNoCategory} index={0} />);
    expect(screen.getByText('Test App')).toBeTruthy();
    expect(screen.queryByText('Website')).toBeNull();
  });

  it('shows correct initials for multi-word names', () => {
    const multiWord: Consumer = { name: 'iSalam App', website_url: 'https://isalam.app' };
    render(<ConsumerCard consumer={multiWord} index={0} />);
    expect(screen.getByText('IA')).toBeTruthy();
  });
});
