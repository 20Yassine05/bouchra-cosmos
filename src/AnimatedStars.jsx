// src/components/CosmicBackgroundStars.jsx
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const AnimatedStars = () => {
  const starsRef = useRef();

  // Optional: Gentle rotation for the entire starfield
  useFrame(() => {
    
      starsRef.current.rotation.y += 0.0001; // Very slow rotation
      starsRef.current.rotation.x += 0.0001;
      starsRef.current.rotation.z += 0.0001;

  });

  return <Stars ref={starsRef}/>;

};

export default AnimatedStars;