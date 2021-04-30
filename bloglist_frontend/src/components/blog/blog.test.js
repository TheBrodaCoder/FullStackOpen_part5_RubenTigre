import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './blog'

describe('<Toggable />', () => {
  const blog = {
    id: 'asdasljkzxcasdqwe',
    title: 'Title test',
    author: 'test jest',
    url: 'test.prueba',
    likes: 0,
    user: 'test user'
  }

  const mockVote = jest.fn()
  const mockDelete = jest.fn()

  let component

  beforeEach( () => {


    component = render(
      <Blog
        key={blog.id}
        title={blog.title}
        author={blog.author}
        url={blog.url}
        likes={blog.likes}
        user={blog.user.username}
        handleVote={mockVote}
        handleDelete={mockDelete}
      />
    )

  })

  test('the title and author are displayed by default', () => {
    expect(component.container).toHaveTextContent('Title test')
    expect(component.container).toHaveTextContent('test jest')
  })

  test('default view dont show url or likes', () => {
    const hiddenDiv = component.container.querySelector('.toggleddiv')
    expect(hiddenDiv).toHaveStyle('display: none')
  })

  test('url and likes are displayed when toggle button is fired', () => {
    const hiddenDiv = component.container.querySelector('.toggleddiv')
    expect(hiddenDiv).toHaveStyle('display: none')
    const buttonMore = component.getByText('more')
    fireEvent.click(buttonMore)
    expect(hiddenDiv).not.toHaveStyle('display: inline-block')
  })

  test('Double vote calls two times the vote function', () => {
    const buttonVote = component.getByText('vote')
    fireEvent.click(buttonVote)
    fireEvent.click(buttonVote)
    expect(mockVote.mock.calls).toHaveLength(2)
  })

})


