import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import UrlsList from '../../components/UrlsList'

const adapter = new Adapter()
Enzyme.configure({ adapter })

const setUp = ({ lastAddedId = null }) => {
  const props = {
    urls: [{
      id: 1,
      path: '1',
      destination: 'test',
      clicks: 1,
    }],
    lastAddedId,
  }

  const enzymeWrapper = shallow(<UrlsList {...props} />)

  return {
    props,
    enzymeWrapper,
  }
}

describe('UrlsList component', () => {
  it('should render self without crashing', () => {
    const { props, enzymeWrapper } = setUp({})
    const { urls } = props

    const urlsList = enzymeWrapper
    expect(urlsList.length).toEqual(1)

    const list = urlsList.find('li')
    expect(list.length).toEqual(urls.length)

    const lastAddedItem = urlsList.find('.article__last-added')
    expect(lastAddedItem.length).toEqual(0)

    const firstItem = urlsList.find('article')
    expect(firstItem.find('.article__url-id').text()).toEqual(`${urls[0].id}.`)
    expect(firstItem.find('.article__url-path').text()).toEqual(`/${urls[0].path}`)
    expect(firstItem.find('.article__url-destination').text()).toEqual(`${urls[0].destination}`)
    expect(firstItem.find('.article__url-clicks').text()).toEqual(`Clicks: ${urls[0].clicks}`)
  })

  it('correct lastAddedId render last added item', () => {
    const { enzymeWrapper } = setUp({ lastAddedId: 1 })

    const urlsList = enzymeWrapper
    const lastAddedItem = urlsList.find('.article__last-added')
    expect(lastAddedItem.length).toEqual(1)
  })

  it('wrong lastAddedId should not render last added item', () => {
    const { enzymeWrapper } = setUp({ lastAddedId: 2 })

    const urlsList = enzymeWrapper
    const lastAddedItem = urlsList.find('.article__last-added')
    expect(lastAddedItem.length).toEqual(0)
  })
})
