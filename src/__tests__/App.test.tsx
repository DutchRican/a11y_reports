import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  const queryClient = new QueryClient();
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
        ok: true,
      })
    ) as jest.Mock;
  });

  it('renders without crashing', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
    expect(await screen.findByRole('main')).toBeDefined();
  });
});
