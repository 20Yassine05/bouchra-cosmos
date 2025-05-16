// Sun.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei"; // Import useTexture

const Sun = () => {
  const sunRef = useRef();
  const [sunTexture] = useTexture(['/assets/sun.jpg']); // Load your sun texture

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 64]} /> {/* Increased segments for smoother texture */}
      <meshStandardMaterial
        map={sunTexture}         // Apply the texture
        emissiveMap={sunTexture} // Use texture for emission as well
        emissive={"white"}       // Make the emissive parts glow white (modulated by texture)
        emissiveIntensity={1.5}  // Adjust intensity of the glow
        toneMapped={false}       // Crucial for emissive materials to pop
      />
      <pointLight
        castShadow
        intensity={Math.PI * 300}
        distance={300}
        decay={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={200}
      />
    </mesh>
  );
};

export default Sun;