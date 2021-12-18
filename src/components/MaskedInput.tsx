import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import InputBox from './InputBox';

interface MaskedInputProps {
  length: number;
  onChange: (value: string) => void
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(({ length, onChange }, ref) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState<string[]>(new Array(length).fill(''))


  useEffect(() => {
    if (inputValue.indexOf('') === -1) {
      onChange(inputValue.join(''))
    }
  }, [inputValue, onChange])

  const handleOnChange = (index: number, value: string) => {
    const newValue = [...inputValue]
    newValue[index] = value
    setInputValue(newValue)
    if (value !== '' && index < length -1) {
      const elem = parentRef.current?.children.item(index + 1) as HTMLInputElement
      elem.disabled = false
      if (elem.value) {
        elem.select()
      }
      elem.focus()
    }
  }

  const handleGoBack = (index: number) => {
    if (index > 0) {
      const elem = parentRef.current?.children.item(index-1) as HTMLInputElement
      elem.disabled = false
      elem.focus()
    }
  }

  return (
    <div ref={parentRef}>
      {inputValue.map((_, index) => (
        <InputBox
          ref={index === 0 ? ref : null }
          key={index}
          index={index}
          value={inputValue[index]}
          disabled={(index > 0 && !inputValue[index - 1]) || (index > 0 && index < length-1 && !inputValue[index + 1])}
          onChange={handleOnChange}
          goBack={handleGoBack}
          />
      ))}
    </div>
  )
})

export default MaskedInput;
