import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import SimpleMenuProduct from '../SimpleMenuProduct';

// Mock the DateView component
jest.mock('@/components/common/DateView', () => {
  return function MockDateView({ date, format }: { date: string; format: string }) {
    return <span data-testid="date-view">{format === 'relative' ? '2 hours ago' : date}</span>;
  };
});

// Mock the formatPrice function
jest.mock('@/lib/format', () => ({
  formatPrice: (price: number, currency: string) => `${price.toFixed(2)} ${currency}`,
}));

const messages = {
  common: {
    lastUpdated: 'Last updated',
    productImage: 'product image',
    containsAllergens: 'Contains allergens',
    calories: 'Calories',
    preparationTime: 'Preparation time',
    minutes: 'minutes',
    kilocalories: 'kilocalories',
  },
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('SimpleMenuProduct', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test description',
    price: 10.99,
    image_url: 'https://example.com/image.jpg',
    is_available: true,
    calory: 250,
    preparation_time: 15,
    tags: ['vegetarian', 'healthy'],
    allergens: ['nuts', 'dairy'],
    updated_at: '2024-01-15T10:30:00Z',
  };

  it('renders product information correctly', () => {
    renderWithIntl(<SimpleMenuProduct product={mockProduct} currency="USD" />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('10.99 USD')).toBeInTheDocument();
  });

  it('renders nutritional and preparation information', () => {
    renderWithIntl(<SimpleMenuProduct product={mockProduct} currency="USD" />);
    
    expect(screen.getByText('250 kcal')).toBeInTheDocument();
    expect(screen.getByText('15 dk')).toBeInTheDocument();
  });

  it('renders allergens information', () => {
    renderWithIntl(<SimpleMenuProduct product={mockProduct} currency="USD" />);
    
    expect(screen.getByText('Contains allergens:')).toBeInTheDocument();
    expect(screen.getByText('nuts')).toBeInTheDocument();
    expect(screen.getByText('dairy')).toBeInTheDocument();
  });

  it('renders last updated date when available', () => {
    renderWithIntl(<SimpleMenuProduct product={mockProduct} currency="USD" />);
    
    expect(screen.getByText('Last updated:')).toBeInTheDocument();
    expect(screen.getByTestId('date-view')).toBeInTheDocument();
  });

  it('does not render last updated date when null', () => {
    const productWithoutUpdateDate = { ...mockProduct, updated_at: null };
    renderWithIntl(<SimpleMenuProduct product={productWithoutUpdateDate} currency="USD" />);
    
    expect(screen.queryByText('Last updated:')).not.toBeInTheDocument();
  });

  it('does not render last updated date when empty string', () => {
    const productWithoutUpdateDate = { ...mockProduct, updated_at: '' };
    renderWithIntl(<SimpleMenuProduct product={productWithoutUpdateDate} currency="USD" />);
    
    expect(screen.queryByText('Last updated:')).not.toBeInTheDocument();
  });

  it('handles product without optional fields', () => {
    const minimalProduct = {
      id: 2,
      name: 'Minimal Product',
      description: null,
      price: null,
      image_url: null,
      is_available: true,
      calory: null,
      preparation_time: null,
      tags: null,
      allergens: null,
      updated_at: null,
    };

    renderWithIntl(<SimpleMenuProduct product={minimalProduct} currency="USD" />);
    
    expect(screen.getByText('Minimal Product')).toBeInTheDocument();
    expect(screen.queryByText('Contains allergens:')).not.toBeInTheDocument();
    expect(screen.queryByText('Last updated:')).not.toBeInTheDocument();
  });

  it('applies correct accessibility attributes', () => {
    renderWithIntl(<SimpleMenuProduct product={mockProduct} currency="USD" />);
    
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    expect(article).toHaveAttribute('itemscope');
    expect(article).toHaveAttribute('itemtype', 'https://schema.org/Product');
  });

  it('handles unavailable products', () => {
    const unavailableProduct = { ...mockProduct, is_available: false };
    renderWithIntl(<SimpleMenuProduct product={unavailableProduct} currency="USD" />);
    
    const article = screen.getByRole('article');
    expect(article).toHaveClass('opacity-60');
  });

  it('renders product image with correct alt text', () => {
    renderWithIntl(<SimpleMenuProduct product={mockProduct} currency="USD" />);
    
    const image = screen.getByAltText('Test Product product image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('itemprop', 'image');
  });

  it('handles image loading errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithIntl(<SimpleMenuProduct product={mockProduct} currency="USD" />);
    
    const image = screen.getByAltText('Test Product product image');
    
    // Simulate image loading error
    const errorEvent = new Event('error');
    Object.defineProperty(errorEvent, 'target', {
      value: image,
      writable: false,
    });
    
    image.dispatchEvent(errorEvent);
    
    consoleSpy.mockRestore();
  });
});
