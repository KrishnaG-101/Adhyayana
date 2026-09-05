import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { NavigationProvider, useNavigation } from '@/context/NavigationContext';
import { RulesModal } from '@/components/layout/RulesModal';

const ModalTriggerHelper: React.FC = () => {
  const { openRulesModal, isRulesModalOpen } = useNavigation();
  return (
    <div>
      <button onClick={openRulesModal}>Open Rules</button>
      <span data-testid="modal-state">{isRulesModalOpen ? 'open' : 'closed'}</span>
    </div>
  );
};

describe('RulesModal', () => {
  it('does not render dialog content when closed', () => {
    render(
      <MemoryRouter>
        <NavigationProvider>
          <RulesModal />
          <ModalTriggerHelper />
        </NavigationProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('modal-state').textContent).toBe('closed');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens and closes via close button and dismiss button', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <NavigationProvider>
          <RulesModal />
          <ModalTriggerHelper />
        </NavigationProvider>
      </MemoryRouter>
    );

    // Open modal
    await user.click(screen.getByRole('button', { name: 'Open Rules' }));
    expect(screen.getByTestId('modal-state').textContent).toBe('open');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Rules & Mechanics')).toBeInTheDocument();
    expect(screen.getByText(/How to Play/)).toBeInTheDocument();

    // Close via close icon button
    await user.click(screen.getByLabelText('Close rules dialog'));
    expect(screen.getByTestId('modal-state').textContent).toBe('closed');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Open again and close via "Start Playing" button
    await user.click(screen.getByRole('button', { name: 'Open Rules' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Start Playing/ }));
    expect(screen.getByTestId('modal-state').textContent).toBe('closed');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
