import React, { useState, useImperativeHandle } from 'react'

const Toggable = React.forwardRef((props, ref) => {
  const [createVisible, toggCreate] = useState(true)

  const toggVisibility = () => {
    toggCreate(!createVisible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggVisibility
    }
  })



  return (
    <>
      <div style={{ display: createVisible ? 'inline' : 'none' }}  className='initialdiv'>
        <button onClick={() => toggCreate(!createVisible)} className={props.buttonName ? props.buttonName : null}>{props.label}</button>
      </div>
      <div style={{ display: createVisible ? 'none' : 'inline' }} className='toggleddiv' >
        <button onClick={() => toggCreate(!createVisible)} >close</button>
        {props.children}
      </div>
    </>
  )
})

Toggable.displayName = 'Toggable'

export default Toggable
