import { useEffect, useReducer, useRef, useState } from 'react'
import './App.css'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box, OrbitControls, PerspectiveCamera, Plane } from '@react-three/drei'
import { gsap } from "gsap" 
export default function Overlay({ setGameState, score, setScore }){
    const [isCountdown, setIsCountdown] = useState(false);
    const countdownRef = useRef(null);
  
    const startCountdown = () => {
      setIsCountdown(true);
    };
  
    useEffect(() => {
      if (isCountdown) {
        const tl = gsap.timeline({
          onComplete: () => {
            console.log("Countdown finished!");
            setGameState('running');
            setIsCountdown(false);
          }
        });
  
        tl.set(countdownRef.current, { innerHTML: '3' })
          .to(countdownRef.current, {
            duration: 1,
            scale: 1.5,
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => gsap.set(countdownRef.current, { innerHTML: '2', scale: 1, opacity: 1 })
          })
          .to(countdownRef.current, {
            duration: 1,
            scale: 1.5,
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => gsap.set(countdownRef.current, { innerHTML: '1', scale: 1, opacity: 1 })
          })
          .to(countdownRef.current, {
            duration: 1,
            scale: 1.5,
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => gsap.set(countdownRef.current, { innerHTML: 'GO!', scale: 1, opacity: 1 })
          })
          .to(countdownRef.current, {
            duration: 1,
            scale: 1.5,
            opacity: 0,
            ease: "power2.inOut",
          });
      }
    }, [isCountdown, setGameState]);
  
    const handleRestart = () => {
      console.log('Restarting game');
      gsap.to('.game-over-wrapper', { scale: 0 });
      setScore(0);
      startCountdown();
    };
  
    return (
      <div className='overlay'>
        <h1 className='score'>Score : {Math.floor(score)} </h1>
        
        {setGameState !== 'running' && (
          <div className='game-over-wrapper'>
            <h1>Game Over</h1>
            <p>Your score : {Math.floor(score)}</p>
            <button onClick={handleRestart}>Restart</button>
          </div>
        )}
       
        {!isCountdown && setGameState !== 'running' ? (
          <div className='start-game-wrapper' style={{display:'flex',flexDirection:"column",gap:"20px"}}>
            <p style={{fontSize:"20px",color:"gray",textAlign:"center"}}>Click the button below to start the game.</p>
            <button onClick={startCountdown}>
              Start Game
            </button>
          </div>
        ) : isCountdown && (
          <div className='countdown' ref={countdownRef} style={{ fontSize: '72px', fontWeight: 'bold' }}>
            3
          </div>
        )}
      </div>
    );
  };