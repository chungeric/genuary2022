import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { fragmentShader } from "./shaders/fragment";
import { vertexShader } from "./shaders/vertex";
import * as dat from "dat.gui";

const gui = new dat.GUI();

const colors = {
  blob: "#FFF", // CSS string
  bg: "#000", // RGB array
};
gui.addColor(colors, "blob");
gui.addColor(colors, "bg");

const IMG_SRC = "https://picsum.photos/400/?blur";

const Plane = (props) => {
  const planeRef = useRef(null);
  const tex = useLoader(THREE.TextureLoader, IMG_SRC);
  const img = useLoader(THREE.ImageLoader, IMG_SRC);
  const W = 1;
  const H = 1;
  useFrame(() => {
    if (planeRef.current) {
      planeRef.current.material.uniforms.uTime.value += 0.008;
      planeRef.current.material.uniforms.uBgColor.value = new THREE.Color(
        colors.bg
      );
      planeRef.current.material.uniforms.uBlobColor.value = new THREE.Color(
        colors.blob
      );
    }
  });
  return (
    <mesh ref={planeRef} {...props}>
      <planeBufferGeometry args={[W, H]} />
      <shaderMaterial
        uniforms={{
          uTime: { value: 0.0 },
          uBlobColor: { value: new THREE.Color(colors.blob) },
          uBgColor: { value: new THREE.Color(colors.bg) },
          uTexture: { value: tex },
          uPlaneSize: { value: new THREE.Vector2(W, H) },
          uImageSize: { value: new THREE.Vector2(img.width, img.height) },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        // wireframe={true}
        // transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default function App() {
  return (
    <Canvas dpr={1}>
      {/* <color attach="background" args={["black"]} /> */}
      <PerspectiveCamera makeDefault position={[0, 0, 1.2]} />
      <Plane />
    </Canvas>
  );
}
