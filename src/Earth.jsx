// Earth.jsx
import { useTexture, Text } from "@react-three/drei"; // Import Text
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react"; // Import useState, useEffect
import Moon from "./Moon";
import * as THREE from "three";

const Earth = ({ name, onMoonCollision }) => { // Add onMoonCollision prop
  const earthRef = useRef();
  const originalMaterialProps = useRef(null); // To store original material properties

  const [earthTexture, earthNormalMap, earthSpecularMap, earthDisplacementMap] =
    useTexture([
      "/assets/earth_day.jpg",
      "/assets/earth_normal.jpg",
      "/assets/earth_specular.jpg",
      "/assets/earth_displacement.jpg",
    ]);

  const [isFlashing, setIsFlashing] = useState(false);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  const handleCollision = () => {
    if (!isFlashing) { // Prevent multiple flashes if event fires rapidly
      setIsFlashing(true);
      if (onMoonCollision) {
        onMoonCollision(); // Notify parent (MainContainer)
      }
    }
  };

  useEffect(() => {
    if (isFlashing && earthRef.current) {
      const material = earthRef.current.material;
      // Store original properties if not already stored
      if (!originalMaterialProps.current) {
        originalMaterialProps.current = {
          emissive: material.emissive.clone(),
          emissiveIntensity: material.emissiveIntensity,
        };
      }

      // Make Earth flash (e.g., bright white emissive)
      material.emissive.set("white");
      material.emissiveIntensity = 2; // Strong flash
      material.needsUpdate = true;

      const flashTimer = setTimeout(() => {
        // Restore original material properties
        if (originalMaterialProps.current) {
          material.emissive.copy(originalMaterialProps.current.emissive);
          material.emissiveIntensity = originalMaterialProps.current.emissiveIntensity;
          material.needsUpdate = true;
        }
        setIsFlashing(false); // Reset flashing state
        originalMaterialProps.current = null; // Clear stored props
      }, 700); // Flash duration

      return () => clearTimeout(flashTimer);
    }
  }, [isFlashing]);

  return (
    <group>
      <mesh
        receiveShadow
        castShadow
        ref={earthRef}
        name={name} // Name prop used here
      >
        <sphereGeometry args={[1, 64, 64]} /> {/* Increased segments */}
        <meshPhongMaterial
          map={earthTexture}
          normalMap={earthNormalMap}
          specularMap={earthSpecularMap}
          displacementMap={earthDisplacementMap}
          displacementScale={0.05}
          shininess={20}
          // Initial emissive properties (could be dark or slightly emissive if needed)
          emissive={new THREE.Color(0x000000)}
          emissiveIntensity={0}
        />
      </mesh>
      <Text
        position={[0, 1.5, 0]} // Position above Earth
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      // Provide a path to a JSON font (see notes below)
      >
        {name} {/* Display "Yassine" */}
      </Text>
      <Moon
        name="Bouchra"
        earthRadius={1}
        initialOrbitRadius={3.5} // Slightly increased radius
        initialOrbitSpeed={0.25}
        onCollision={handleCollision} // Pass collision handler to Moon
      />
    </group>
  );
};

export default Earth;