import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
// import { EffectComposer, Bloom, DotScreen } from "@react-three/postprocessing";
// import { BlendFunction } from "postprocessing";

const TorusKnot = (props) => {
  const ref = useRef();
  useFrame(({ clock }) => {
    let t = clock.getElapsedTime();
    let offset = props.offset || 0;
    ref.current.material.uniforms.uTime.value = (t + offset) * 0.03;
  });

  return (
    <mesh ref={ref} {...props}>
      <torusKnotBufferGeometry args={[1, 0.03, 2000, 32, 12, 11]} />
      {/* <torusKnotBufferGeometry args={[1, 0.03, 2000, 32, 6, 10]} /> */}
      {/* <torusKnotBufferGeometry args={[1, 0.03, 2000, 32, 4, 30]} /> */}
      {/* <torusKnotBufferGeometry args={[1, 0.02, 500, 32, 6, 2]} /> */}
      <shaderMaterial
        uniforms={{
          uTime: { value: 0.0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vec2 uv = vUv;
            vec3 white = vec3(1.0);
            vec3 black = vec3(0.0);
            vec3 red = vec3(1.0, 0.0, 0.0);
            vec3 green = vec3(0.349,0.89,0.49);
            vec3 blue = vec3(0.0, 0.0, 1.0);
            vec3 yellow = vec3(1.0, 1.0, 0.0);
            float n = 3.0; // 6.0

            float repeat = smoothstep(0.8, 1.0, fract(((uv.x - uTime) * 2.0 - 1.0) * n));

            // float repeat = step(0.8, fract(((uv.x - uTime) * 2.0 - 1.0) * n));
            if (repeat == 0.0) discard;

            float m = floor(mod(((uv.x - uTime) * 2.0 - 1.0) * 3.0, 3.0)); // returns 0, 1 or 2
            vec3 color = mix(
              black,
              m == 0.0 ? red : m == 1.0 ? blue : yellow,
              repeat
            );
            gl_FragColor = vec4(color, repeat);
          }
        `}
        transparent={true}
        // wireframe={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default function App() {
  return (
    <>
      <Canvas
        onCreated={(state) => state.gl.setClearColor(0x000000)}
        dpr={Math.min(devicePixelRatio, 2)}
      >
        <OrbitControls autoRotate autoRotateSpeed={10} />
        <TorusKnot />
        {/* <TorusKnot position={[0, 0, -2]} offset={-0.1} /> */}
        {/* <TorusKnot position={[0, 0, -4]} offset={-0.2} /> */}
        {/* <TorusKnot position={[0, 0, -6]} />
      <TorusKnot position={[0, 0, -8]} />
      <TorusKnot position={[0, 0, -10]} /> */}
        {/* <TorusKnot position={[-0.5, 0, 0]} />
      <TorusKnot position={[0, 0, 0]} /> */}
        {/* <EffectComposer>
        <DotScreen
          blendFunction={BlendFunction.NORMAL} // blend mode
          angle={Math.PI * 0.5} // angle of the dot pattern
          scale={1.0} // scale of the dot pattern
        />
      </EffectComposer> */}
      </Canvas>
    </>
  );
}
