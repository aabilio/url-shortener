import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Header from '../../components/Header'

const adapter = new Adapter()
Enzyme.configure({ adapter })

const setUp = ({ url = 'http://', loading = false, error = false }) => {
  const props = {
    url,
    error,
    loading,
    handleInputChange: jest.fn(),
    handleInputKeyPress: jest.fn(),
    handelInputClick: jest.fn(),
    handleShortClick: jest.fn(),
  }

  const enzymeWrapper = shallow(<Header {...props} />)

  return {
    props,
    enzymeWrapper,
  }
}

describe('Header component', () => {
  it('should render self without crashing', () => {
    const { props, enzymeWrapper } = setUp({})
    const {
      url,
      loading,
      handleInputChange,
      handleInputKeyPress,
      handelInputClick,
      handleShortClick,
    } = props


    const header = enzymeWrapper
    expect(header.length).toEqual(1)

    const input = header.find('input')
    expect(input.length).toEqual(1)
    const inputProps = input.props()
    expect(inputProps.type).toEqual('text')
    expect(inputProps.onChange).toEqual(handleInputChange)
    expect(inputProps.onKeyPress).toEqual(handleInputKeyPress)
    expect(inputProps.onClick).toEqual(handelInputClick)
    expect(inputProps.value).toEqual(url)
    expect(inputProps.disabled).toEqual(loading)

    const error = header.find('.input__invalid-url')
    expect(error.length).toEqual(0)

    const button = header.find('button')
    expect(button.length).toEqual(1)
    expect(button.hasClass('button-loading')).toBe(false)
    expect(button.prop('onClick')).toEqual(handleShortClick)
    expect(handleShortClick).toHaveBeenCalledTimes(0)
    button.simulate('click')
    expect(handleShortClick).toHaveBeenCalledTimes(1)
  })

  it('loading should be rendered with props.loading === true', () => {
    const { enzymeWrapper } = setUp({ loading: true })

    const header = enzymeWrapper
    const button = header.find('button')
    expect(button.length).toEqual(1)
    expect(button.hasClass('button-loading')).toBe(true)
  })

  it('loading should render error with props.error === true', () => {
    const { enzymeWrapper } = setUp({ error: true })

    const header = enzymeWrapper
    const error = header.find('.input__invalid-url')
    expect(error.length).toEqual(1)
  })

  it('button click should call handler', () => {
    const { props, enzymeWrapper } = setUp({})
    const { handleShortClick } = props

    const button = enzymeWrapper.find('button')
    expect(button.prop('onClick')).toEqual(handleShortClick)
    expect(handleShortClick).toHaveBeenCalledTimes(0)
    button.simulate('click')
    button.simulate('click')
    button.simulate('click')
    expect(handleShortClick).toHaveBeenCalledTimes(3)
  })

  it('onChange and onKeyPressed events should be fired', () => {
    const { props, enzymeWrapper } = setUp({})
    const { handleInputKeyPress, handleInputChange } = props

    const input = enzymeWrapper.find('input')
    expect(input.prop('onKeyPress')).toEqual(handleInputKeyPress)
    expect(handleInputKeyPress).toHaveBeenCalledTimes(0)
    expect(handleInputChange).toHaveBeenCalledTimes(0)
    input.simulate('keypress', { key: 'Enter' })
    input.simulate('change', { target: { value: '' } })
    expect(handleInputKeyPress).toHaveBeenCalledTimes(1)
    expect(handleInputChange).toHaveBeenCalledTimes(1)
  })
})
