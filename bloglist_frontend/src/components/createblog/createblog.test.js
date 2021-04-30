import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import CreateBlog from './createblog'


test('data send is the one writed', () => {

    const mockAdd = jest.fn()

    let component = render(
        <CreateBlog addBlog={mockAdd}/>
    )

    const author = component.container.querySelector('#author-input')
    const title = component.container.querySelector('#title-input')
    const url = component.container.querySelector('#url-input')
    const button = component.container.querySelector('#submit')
    
    fireEvent.change(author, {
      target: { value: 'test author' }
    })
    fireEvent.change(title, {
      target: { value: 'test title' }
    })
    fireEvent.change(url, {
      target: { value: 'test url' }
    })

    fireEvent.click(button)

    expect(mockAdd.mock.calls).toHaveLength(1)
    expect(mockAdd.mock.calls[0][0].title).toBe('test title')
    expect(mockAdd.mock.calls[0][0].author).toBe('test author')
    expect(mockAdd.mock.calls[0][0].url).toBe('test url')
    
})
