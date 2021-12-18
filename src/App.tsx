import { useRef, useEffect } from 'react'
import MaskedInput from './components/MaskedInput';

const App = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className='h-screen flex'>
      <div className='m-auto'>
        {/* <h1 className='font-semibold mb-4'>Enter Aadhaar Number:</h1> */}
        <MaskedInput ref={inputRef} length={12} onChange={value => console.log(value)} />
      </div>
    </div>
  );
}

export default App;
