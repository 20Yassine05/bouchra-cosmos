// Moon.jsx
// 1. ADD Html to imports
import { useTexture, Text, Billboard, Html } from "@react-three/drei"; // ADDED Html
import { useFrame } from "@react-three/fiber";
// useEffect is already imported, which is good.
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

const Moon = ({ name, earthRadius, initialOrbitRadius, initialOrbitSpeed, onCollision }) => {
  const moonGroupRef = useRef();
  // Your original texture loading (keep as is if it works for you)
  const [moonTexture] = useTexture(["/assets/moon.jpg"]); // Ensure this path is correct

  const [isColliding, setIsColliding] = useState(false);
  const collisionStartTimeRef = useRef(null);
  const initialAngleAtClickRef = useRef(0);

  const COLLISION_DURATION = 8;
  const NUM_SPIRALS = 3;
  const TOTAL_SPIRAL_ANGLE_DELTA = NUM_SPIRALS * 2 * Math.PI;
  const [collisionHasOccurred, setCollisionHasOccurred] = useState(false);

  // 2. ADD state for showing the click instruction
  const [showClickInstruction, setShowClickInstruction] = useState(true);

  const handleClickOnMoonMesh = (event) => {
    event.stopPropagation();
    if (!isColliding && !collisionHasOccurred) {
      console.log("Moon.jsx: Bouchra (Moon) clicked! Initiating collision sequence.");
      setIsColliding(true);
      // 3. HIDE instruction on click
      setShowClickInstruction(false);
    }
  };

  // 4. ADD useEffect to hide instruction after a timeout
  useEffect(() => {
    if (showClickInstruction) {
      const timer = setTimeout(() => {
        setShowClickInstruction(false);
      }, 7000); // Hide after 7 seconds
      return () => clearTimeout(timer);
    }
  }, [showClickInstruction]); // Dependency array

  useFrame(({ clock }) => {
    // ... (NO CHANGES to your existing useFrame animation logic)
    if (!moonGroupRef.current) return;
    const elapsedTime = clock.getElapsedTime();

    if (isColliding) {
      if (collisionStartTimeRef.current === null) {
        collisionStartTimeRef.current = elapsedTime;
        const currentX = moonGroupRef.current.position.x;
        const currentZ = moonGroupRef.current.position.z;
        if (Math.abs(currentX) < 0.01 && Math.abs(currentZ) < 0.01) {
            initialAngleAtClickRef.current = 0;
        } else {
            initialAngleAtClickRef.current = Math.atan2(currentX, currentZ);
        }
      }

      const timeSinceCollisionStart = elapsedTime - collisionStartTimeRef.current;
      let progress = Math.min(timeSinceCollisionStart / COLLISION_DURATION, 1);
      const smoothedProgress = THREE.MathUtils.smootherstep(progress, 0, 1);

      const currentSpiralRadius = THREE.MathUtils.lerp(
        initialOrbitRadius,
        earthRadius * 0.8,
        smoothedProgress
      );
      const currentSpiralAngle = initialAngleAtClickRef.current + progress * TOTAL_SPIRAL_ANGLE_DELTA;

      moonGroupRef.current.position.x = Math.sin(currentSpiralAngle) * currentSpiralRadius;
      moonGroupRef.current.position.z = Math.cos(currentSpiralAngle) * currentSpiralRadius;

      if (progress >= 1 && !collisionHasOccurred) {
        console.log("Moon.jsx: Bouchra has impacted Yassine!");
        setCollisionHasOccurred(true);
        if (onCollision) {
          onCollision();
        }
      }
    } else if (!collisionHasOccurred) {
      const currentAngle = elapsedTime * initialOrbitSpeed;
      moonGroupRef.current.position.x = Math.sin(currentAngle) * initialOrbitRadius;
      moonGroupRef.current.position.z = Math.cos(currentAngle) * initialOrbitRadius;
    }
  });

  const isComponentVisible = true; // Or your preferred logic: !collisionHasOccurred || isColliding;


  return (
    <group ref={moonGroupRef} visible={isComponentVisible}>
      <mesh
        castShadow
        receiveShadow
        name={name}
        onClick={handleClickOnMoonMesh}
        // Assuming your base moon geometry has a radius of 0.3.
        // If you intend to scale the moon based on a prop like `moonSize`,
        // you'd need to add that prop and use it here:
        // scale={moonSize ? moonSize / 0.3 : 1}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhongMaterial map={moonTexture} shininess={5} />
      </mesh>

      <Billboard
        position={[0, 0.55, 0]} // Adjust Y offset as needed relative to moon's center
      >
        <Text
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
           // Make sure this font file exists in public/fonts/
        >
          {name}
        </Text>
      </Billboard>

      {/* 5. ADD the <Html> component for the instruction */}
      {showClickInstruction && !isColliding && !collisionHasOccurred && (
        <Html
          position={[0, 0.55 + 0.4, 0]} // Position slightly above the "Bouchra" label
          center
          distanceFactor={10} // Adjust scaling with distance
          zIndexRange={[100,0]}
          transform // Enable CSS transforms on the HTML
        >
          <div
            style={{
              padding: '5px 10px',
              background: 'rgba(0, 0, 0, 0.65)',
              color: 'white',
              borderRadius: '5px',
              fontSize: '14px', // Or adjust as needed
              fontFamily: 'Arial, Helvetica, sans-serif',
              pointerEvents: 'none', // CRUCIAL: Allows clicks to pass through
              whiteSpace: 'nowrap', // Prevents text from wrapping
              userSelect: 'none', // Prevents text selection
            }}
          >
            khwerih! 👆
          </div>
        </Html>
      )}
    </group>
  );
};

export default Moon;