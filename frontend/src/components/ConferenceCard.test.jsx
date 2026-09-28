import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import ConferenceCard from './ConferenceCard'

// Example test: shows how to render a component that uses react-router links.
describe('ConferenceCard', () => {
  it('shows the title and a link to the conference details', () => {
    render(
      <MemoryRouter>
        <ConferenceCard conference={{ id: 42, title: 'DevConf', location: 'Tbilisi' }} />
      </MemoryRouter>
    )

    expect(screen.getByText('DevConf')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View Details' })).toHaveAttribute('href', '/conferences/42')
  })
})
