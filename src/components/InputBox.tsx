import React, { forwardRef } from 'react'

interface InputBoxProps {
    index: number,
    value: string;
    onChange: (index: number, value: string) => void;
    goBack: (index: number) => void,
    disabled?: boolean
}

const InputBox = forwardRef<HTMLInputElement, InputBoxProps>(({ index, value, onChange, goBack, disabled }, ref) => {
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (value === '' && event.key === 'Backspace') {
            goBack(index)   
        } else if (event.key === ' ') {
            event.preventDefault()
        }
    }

    return (
        <input
            ref={ref}
            type='text'
            pattern='\d*'
            maxLength={1}
            className='uppercase bg-gray-100 p-4 w-14 text-center text-xl focus:outline-none border-b-2 border-transparent focus:border-blue-500 ring-inset'
            value={value}
            onChange={event => onChange(index, event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            />
    )
})
export default InputBox