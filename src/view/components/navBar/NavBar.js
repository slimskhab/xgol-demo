import { SearchIcon } from '@chakra-ui/icons'
import React from 'react'

export default function NavBar() {
  return (
    <div style={{display:"flex",justifyContent:"space-between",background:"var(--main-color)",borderEndEndRadius:10,borderEndStartRadius:10,padding:10,alignItems:"center",color:"white"}}>
      <h1 style={{fontSize:25}}>
        XGOL
      </h1>

      <div>
        <span style={{marginRight:20}}>About us</span>
        <span style={{marginRight:20}}>How it Words</span>
        <span style={{marginRight:20}}>FQA</span>
      </div>

      <SearchIcon boxSize={6}/>
    </div>
  )
}
