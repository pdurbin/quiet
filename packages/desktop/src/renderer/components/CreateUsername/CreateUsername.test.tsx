import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/dom'
import { renderComponent } from '../../testUtils/renderComponent'

import CreateUsernameComponent from './CreateUsernameComponent'
import { FieldErrors, UsernameErrors } from '../../forms/fieldsErrors'

describe('Create username', () => {
  it.each([
    ['double-hyp--hens', 'double-hyp-hens'],
    ['-start-with-hyphen', 'start-with-hyphen'],
    [' start-with-space', 'start-with-space'],
    ['end-with-hyphen-', 'end-with-hyphen'],
    ['end-with-space ', 'end-with-space'],
    ['UpperCaseToLowerCase', 'uppercasetolowercase'],
    ['spaces to hyphens', 'spaces-to-hyphens']
  ])('user inserting wrong name "%s" gets corrected "%s"', async (name: string, corrected: string) => {
    renderComponent(
      <CreateUsernameComponent open={true} registerUsername={() => {}} handleClose={() => {}} />
    )

    const input = screen.getByPlaceholderText('Enter a username')

    userEvent.type(input, name)
    expect(screen.getByTestId('createUserNameWarning')).toHaveTextContent(`Your username will be registered as @${corrected}`)
  })

  it.each([
    ['   whitespaces', FieldErrors.Whitespaces],
    ['----hyphens', FieldErrors.Whitespaces],
    ['!@#', UsernameErrors.WrongCharacter]
  ])('user inserting invalid name "%s" should see "%s" error', async (name: string, error: string) => {
    const registerUsername = jest.fn()

    renderComponent(
      <CreateUsernameComponent open={true} registerUsername={registerUsername} handleClose={() => {}} />
    )

    const input = screen.getByPlaceholderText('Enter a username')
    const button = screen.getByText('Register')

    userEvent.type(input, name)
    userEvent.click(button)

    await waitFor(() => expect(registerUsername).not.toBeCalled())

    const message = await screen.findByText(error)
    expect(message).toBeVisible()
  })
})
