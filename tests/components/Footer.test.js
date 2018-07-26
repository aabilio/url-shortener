import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Footer from '../../components/Footer'

const adapter = new Adapter()
Enzyme.configure({ adapter })

const setUp = () => {
  const props = {}

  const enzymeWrapper = shallow(<Footer {...props} />)

  return {
    props,
    enzymeWrapper,
  }
}

describe('Footer component', () => {
  it('should render self without crashing', () => {
    const { enzymeWrapper } = setUp({})

    const footer = enzymeWrapper
    expect(footer.length).toEqual(1)

    const linkProps = footer.find('a').props()
    expect(linkProps.href).toEqual('https://twitter.com/aabilio')
  })
})
