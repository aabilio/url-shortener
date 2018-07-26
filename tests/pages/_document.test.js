import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import MyDocument from '../../pages/_document'

const adapter = new Adapter()
Enzyme.configure({ adapter })

const setUp = () => {
  const props = {}

  const enzymeWrapper = shallow(<MyDocument {...props} />)

  return {
    props,
    enzymeWrapper,
  }
}

describe('MyDocument component', () => {
  it('should render self and child components without crashing', () => {
    const { enzymeWrapper } = setUp({})

    const myDocument = enzymeWrapper
    expect(myDocument.length).toEqual(1)

    const Head = myDocument.find('Head')
    expect(Head.find('title').text()).toEqual('Url Shortener - @aabilio')

    const Main = myDocument.find('Main')
    expect(Main.length).toEqual(1)

    const NextScript = myDocument.find('NextScript')
    expect(NextScript.length).toEqual(1)
  })
})
