// MainContainer.jsx
import { useRef } from "react";
// No more useState needed here for the message
import AnimatedStars from "./AnimatedStars";
import Earth from "./Earth";
import Sun from "./Sun";
import { useFrame } from "@react-three/fiber";

// Receive the callback prop from App.jsx
const MainContainer = ({ onTriggerCosmicEvent }) => {
  const earthOrbitRef = useRef();

  const EARTH_ORBIT_RADIUS = 15;
  const EARTH_ORBIT_SPEED = 0.05;

  useFrame(({ clock }) => {
    if (earthOrbitRef.current) {
      const elapsedTime = clock.getElapsedTime();
      earthOrbitRef.current.position.x = Math.sin(elapsedTime * EARTH_ORBIT_SPEED) * EARTH_ORBIT_RADIUS;
      earthOrbitRef.current.position.z = Math.cos(elapsedTime * EARTH_ORBIT_SPEED) * EARTH_ORBIT_RADIUS;
    }
  });

  // This function will be called by Earth component upon moon collision
  const handleMoonEarthCollision = () => {
    console.log("MainContainer.jsx: Collision detected, triggering cosmic event in App.");
    if (onTriggerCosmicEvent) {
      onTriggerCosmicEvent(); // Call the prop passed from App.jsx
    }
  };

  return (
    <>
      <color attach="background" args={["black"]} />
      <ambientLight intensity={Math.PI * 0.03} />
      <AnimatedStars />
      <Sun />

      <group ref={earthOrbitRef}>
        {/* Pass the handler down to Earth */}
        <Earth name="Yassine" onMoonCollision={handleMoonEarthCollision} />
      </group>

      {/* The birthday message div is REMOVED from here */}
    </>
  );
};

export default MainContainer;