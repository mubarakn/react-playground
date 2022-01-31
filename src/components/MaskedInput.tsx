import { useState, useRef, useEffect, forwardRef, MouseEventHandler } from 'react'
import InputBox from './InputBox';

interface MaskedInputProps {
  pattern: string;
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
const allowedChars = ["X", "A", "9"]

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(({ pattern, onChange }, ref) => {
  const regexPatternArray = pattern.split('').map(mapCharToRegex)
  
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
      // (parentRef.current?.children.item(index) as HTMLInputElement).disabled = true;
      let prevIndex = index-1
      while (prevIndex >= 0) {
        if (allowedChars.includes(pattern.slice(prevIndex, prevIndex+1))) {
          const element = parentRef.current?.children.item(prevIndex) as HTMLInputElement
          element.disabled = false
          element.select()
          element.focus()
          break;
        }
        prevIndex--
      }
    }
  }

  const handleFocus = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((e.target !== parentRef.current && e.target instanceof HTMLInputElement && !(e.target as HTMLInputElement).disabled)) {
      return
    }
    const children = parentRef.current?.children as HTMLCollection
    for (let i = children.length-1; i >= 0; i--) {
      if (allowedChars.includes(pattern.slice(i, i+1))) {
        const element = children[i] as HTMLInputElement;
        if (!element.disabled) {
          element.focus()
          break;
        }
      }
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} ref={parentRef} onClick={handleFocus}>
      {pattern.split('').map((char, index) => {
        if (allowedChars.includes(char)) {
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
          return <span key={index}>{char}</span>
        }
      })}
    </div>
  )
})

export default MaskedInput;
