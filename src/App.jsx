import { useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box, OrbitControls, PerspectiveCamera, Plane } from '@react-three/drei'
import { gsap } from "gsap"
import Game from './Game'
import Overlay from './Overlay'
function App() {
  const camera = useRef()
  const box = useRef()
  const plane = useRef()
  const [gameState, setGameState] = useState('beginning')
  const [EnemyPositions, setEnemyPositions] = useState([])
  const [score,setScore]=useState(0)
  return (
    <main>
      <Overlay setScore={setScore} setEnemyPositions={setEnemyPositions} setGameState={setGameState} score={score} />

      <Canvas >
        <PerspectiveCamera ref={camera} position={[0, 2, 10]} makeDefault ></PerspectiveCamera>
        <Game setScore={setScore} EnemyPositions={EnemyPositions} setEnemyPositions={setEnemyPositions} setGameState={setGameState} gameState={gameState} camera={camera} box={box} plane={plane} />
        <Box ref={box} material-color='hotpink' position={[0, 0.5, 0]} />
        <Plane ref={plane} scale={[12, 500, 10]} rotation={[-90 * (Math.PI / 180), 0, 0]} />
      </Canvas>
    </main>
  )
}

export default App





