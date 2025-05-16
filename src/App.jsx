// App.jsx
import { Canvas } from "@react-three/fiber";
import MainContainer from "./MainContainer";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react"; // Import useState

function App() {
  const [showBirthdayMessage, setShowBirthdayMessage] = useState(false);

  const handleCosmicEventTrigger = () => {
    console.log("App.jsx: Cosmic event triggered, preparing message.");
    // Delay showing message slightly after Earth's flash (if Earth has one)
    setTimeout(() => {
      setShowBirthdayMessage(true);
    }, 800); // Adjust delay as needed
  };

  return (
    // This div will wrap both the Canvas and the HTML overlay
    // It needs to have relative positioning for the absolute positioned message
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 10, 25] }}
        // onCreated={({ gl }) => { gl.setClearColor('black'); }} // Alternative to <color attach="background">
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
        />
        {/* Pass the callback to MainContainer */}
        <MainContainer onTriggerCosmicEvent={handleCosmicEventTrigger} />
      </Canvas>

      {/* Birthday Message Overlay - Rendered as HTML sibling to Canvas */}
      {showBirthdayMessage && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '30px 40px',
            backgroundColor: 'rgba(20, 0, 50, 0.9)',
            color: 'white',
            borderRadius: '15px',
            border: '2px solid #FFD700', // Gold border
            textAlign: 'center',
            fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Arial', sans-serif",
            fontSize: '24px',
            boxShadow: '0 0 30px rgba(255, 223, 0, 0.7)',
            zIndex: 1000, // Ensure it's on top
          }}
        >
          🎉🎂✨ Happy Birthday, Bouchra! ✨🎂🎉
          <br />
          May your day be as bright as a supernova 🚀🚀
          <br />
          Rah ma3rftx wax kay3jbek t7tafli b birthday dyalk  
          <br />
          wla la walakin bghit ndir lik xi small gift ou sf 
          <br />
          kanbghik ou kol 3am ou nti m3aya
          <br />
          <button
            onClick={() => setShowBirthdayMessage(false)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#FFD700',
              color: '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App; 