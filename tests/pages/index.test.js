import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ShortenerPage, {
  DEFAULT_URL,
} from '../../pages/index'

const adapter = new Adapter()
Enzyme.configure({ adapter })

const setUp = () => {
  const props = {
    lastShorts: [{
      id: 1,
      path: '1',
      destination: 'test',
      clicks: 1,
    }],
  }

  const enzymeWrapper = shallow(<ShortenerPage {...props} />)

  return {
    props,
    enzymeWrapper,
  }
}

describe('ShortenerPage component', () => {
  it('should render self and child components without crashing', () => {
    const { props, enzymeWrapper } = setUp({})
    const { lastShorts } = props

    const shortenerPage = enzymeWrapper
    expect(shortenerPage.length).toEqual(1)

    const Header = shortenerPage.find('Header')
    expect(Header.length).toEqual(1)
    const headerProps = Header.props()
    expect(headerProps.url).toEqual(DEFAULT_URL)
    expect(headerProps.error).toEqual(false)
    expect(headerProps.loading).toEqual(false)

    const UrlsList = shortenerPage.find('UrlsList')
    expect(UrlsList.length).toEqual(1)
    const urlsListProps = UrlsList.props()
    expect(urlsListProps.urls).toEqual(lastShorts)
    expect(urlsListProps.lastAddedId).toEqual(null)

    const Footer = shortenerPage.find('Footer')
    expect(Footer.length).toEqual(1)
  })
})
