import { useState, useRef, useEffect, forwardRef } from 'react'
import InputBox from './InputBox';

interface MaskedInputProps {
  length: number;
  onChange: (value: string) => void
}

const mapCharToRegex = (char: string) => {
  switch (char) {
    case 'X':
      return '(^$|.)'
    case '9':
      return '(^$|\\d)'
    case 'A':
      return '(^$|[A-Za-z])'
    default:
      return char
  }
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(({ length, onChange }, ref) => {
  const pattern = "A X 9 A X 9"
  const regexPatternArray = pattern.split('').map(mapCharToRegex)
  const reversePattern = pattern.split('').reverse().join('')
  const reverseRegexPatternArray = reversePattern.split('').map(mapCharToRegex)
  
  const parentRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState<string[]>(new Array(pattern.length).fill(''))


  useEffect(() => {
    if (inputValue.indexOf('') === -1) {
      onChange(inputValue.join(''))
    }
  }, [inputValue, onChange])

  const handleOnChange = (index: number, value: string) => {
    if(!value.match(new RegExp(regexPatternArray[index]))) {
      return
    }

    const newValue = [...inputValue]
    newValue[index] = value
    setInputValue(newValue)
    if (value !== '' && index < pattern.length -1) {
      const nextInputIndex = pattern.slice(index+1).search(/(X|9|A){1}/)
      const elem = parentRef.current?.children.item(index + nextInputIndex+1) as HTMLInputElement
      elem.disabled = false
      if (elem.value) {
        elem.select()
      }
      elem.focus()
    }
  }

  const handleGoBack = (index: number) => {
    if (index > 0) {
      const reversePattern = pattern.split('').reverse().join('')
      console.log(pattern, 'reversePattern', reversePattern)
      const reversePrevInputIndex = reversePattern.slice(pattern.length - index).search(/(X|9|A){1}/)
      const prevInputIndex = pattern.length-reversePrevInputIndex
      console.log(reversePrevInputIndex, prevInputIndex)
      const elem = parentRef.current?.children.item(prevInputIndex) as HTMLInputElement
      elem.disabled = false
      elem.focus()
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} ref={parentRef}>
      {pattern.split('').map((char, index) => {
        if (['X', '9', 'A'].includes(char)) {
          return (
            <InputBox
              ref={index === 0 ? ref : null }
              key={index}
              index={index}
              value={inputValue[index]}
              disabled={(index > 0 && !inputValue[index - 1]) || (index > 0 && index < pattern.length-1 && !inputValue[index + 1])}
              onChange={handleOnChange}
              goBack={handleGoBack}
              />
          )
        } else {
          return (
            <span key={index}>
              {char}
            </span>
          )
        }
      })}
    </div>
  )
})

export default MaskedInput;
