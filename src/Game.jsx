import { useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box, OrbitControls, PerspectiveCamera, Plane } from '@react-three/drei'
import { gsap } from "gsap"
export default function Game({setScore, camera, box, plane,setGameState,gameState,EnemyPositions,setEnemyPositions }) {
  const [isRightPressed, setIsRightPressed] = useState(false);
  const [isLeftPressed, setIsLeftPressed] = useState(false);
  const boxAndCameraSpeed = 0.10 //move forward speed
  const moveForwardSpeed = 0.30 //move left and right speed
  const boxRef = useRef();
  const boxPositionRef = useRef(0);
  useEffect(() => {
    const handleKeyDown = (event) => {  // check w s or up down arrow
      if (event.key === 'd' || event.key === 'D' || event.keyCode === 39) {
        setIsRightPressed(true)
        gsap.to(box.current.rotation, { z: -30 * (Math.PI / 180) })
      }
      if (event.key === 'a' || event.key === 'A' || event.keyCode === 37) {
        setIsLeftPressed(true)
        gsap.to(box.current.rotation, { z: 30 * (Math.PI / 180) })

      }
    };
    const handleKeyUp = (event) => {
      if (event.key === 'd' || event.key === 'D' || event.keyCode === 39) {
        setIsRightPressed(false);
        gsap.to(box.current.rotation, { z: 0 * (Math.PI / 180) })
      }
      if (event.key === 'a' || event.key === 'A' || event.keyCode === 37) {
        setIsLeftPressed(false);
        gsap.to(box.current.rotation, { z: 0 * (Math.PI / 180) })

      }
    };

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    const intervalId = setInterval(() => {
      const newPositions = generateNewPositions(15);
      setEnemyPositions(prevPositions => [...prevPositions, ...newPositions]);
    }, 5000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(intervalId)
    };
  }, [])
  const endGame = () => {
    setGameState('stopped')
    gsap.to('.game-over-wrapper',{scale:1,duration:0.5})
    setEnemyPositions([])
    box.current.position.x=0
    box.current.position.y=0.9
    box.current.position.z=0
    camera.current.position.x=0
    camera.current.position.y=2
    camera.current.position.z=10
    plane.current.position.x=0
    plane.current.position.y=0
    plane.current.position.z=0
  }
  useFrame((state, delta) => {
    const hasCollision = checkCollisions(box.current.position, EnemyPositions);
    if (hasCollision) {
      endGame()
    }
    if (gameState === 'running') {
      if (boxRef.current) {
        boxRef.current.position.z -= 0.05;
        boxPositionRef.current = boxRef.current.position.z;
      }
      if (camera.current) {
        // Animate the camera
        setScore((prev)=>prev+0.10)
        camera.current.position.z -= moveForwardSpeed
        box.current.position.z -= moveForwardSpeed
        plane.current.position.z -= moveForwardSpeed
      }
      if (isLeftPressed && box.current.position.x > -5.5) {
        box.current.position.x -= boxAndCameraSpeed
        camera.current.position.x -= boxAndCameraSpeed
      }
      if (isRightPressed && box.current.position.x < 5.5) {
        box.current.position.x += boxAndCameraSpeed
        camera.current.position.x += boxAndCameraSpeed
      }
    }


  })
  const generateNewPositions = (count) => {
    const boxZPosition = boxPositionRef.current;
    return Array(count).fill().map(() => [
      Math.random() * 10 - 5,
      0.5,
      box.current.position.z - (20 + Math.random() * 200)
    ]);
  };
  const checkCollisions = (playerPosition, enemyPositions) => {
    const collisionThreshold = 1; // Adjust based on your box sizes
    return enemyPositions.some(([x, y, z]) =>
      Math.abs(playerPosition.x - x) < collisionThreshold &&
      Math.abs(playerPosition.y - y) < collisionThreshold &&
      Math.abs(playerPosition.z - z) < collisionThreshold
    );
  };

  return (
    <>
      {EnemyPositions.map((item, idx) => { return <Box key={idx} position={item} scale={[1, 5, 0.1]} material-color="gray" /> })}
    </>
  )
}

