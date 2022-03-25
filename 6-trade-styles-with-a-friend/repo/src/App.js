import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { useControls } from "leva";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  DotScreen,
  Pixelation,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const RANGE = 12;
const rr = (min, max) => Math.random() * (max - min) + min;

const Sphere = (props) => {
  return (
    <mesh {...props}>
      <sphereBufferGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
};

const Box = (props) => {
  const VERTICAL = Math.random() > 0.5;
  const offset = rr(0, 1000);
  const ref = useRef(null);
  const dimensions = useRef({
    w: VERTICAL ? rr(0.1, 3) : rr(3, 6),
    h: VERTICAL ? rr(3, 6) : rr(0.1, 0.5),
    d: VERTICAL ? rr(0.1, 3) : rr(3, 6),
  });
  const pos = useRef({
    x: rr(-RANGE, RANGE),
    y: rr(-RANGE, RANGE),
    z: rr(-RANGE, RANGE),
  });
  useFrame(({ clock }) => {
    let t = clock.getElapsedTime();
    let tt = t * 0.5;
    if (ref.current && pos.current) {
      if (VERTICAL) {
        ref.current.position.y = Math.sin(tt + offset) * RANGE;
      } else {
        ref.current.position.x = Math.sin(tt + offset) * RANGE;
      }
    }
  });
  return (
    <mesh
      ref={ref}
      {...props}
      position={[pos.current.x, pos.current.y, pos.current.z]}
    >
      <boxBufferGeometry
        args={[
          dimensions.current.w,
          dimensions.current.h,
          dimensions.current.d,
        ]}
      />
      {/* <meshStandardMaterial color="#444894" /> */}
      {/* <meshLambertMaterial color="#444894" /> */}
      {/* <meshLambertMaterial color={`hsl(${rr(0, 360)}, 80%, 40%)`} /> */}
      <meshLambertMaterial color={props.color} />
    </mesh>
  );
};

const Camera = () => {
  return <PerspectiveCamera makeDefault position={[0, 0, 80]} />;
};

export default function App() {
  // const { progress, color1, color2, toggle } = useControls({
  //   progress: { value: 0, min: 0, max: 1, step: 0.01 },
  //   color1: "#6b74a7",
  //   color2: "#000",
  //   toggle: true,
  // });
  const NUM_BOXES = 80;
  const BG_COLOR = "#000";
  return (
    <Canvas
      dpr={Math.min(window.devicePixelRatio, 2)}
      onCreated={(state) => state.gl.setClearColor(BG_COLOR)}
    >
      {/* <fog attach="fog" color={BG_COLOR} near={1} far={200} /> */}
      <Camera />
      <OrbitControls autoRotate autoRotateSpeed={5} />
      <pointLight intensity={7} />
      {[...Array(NUM_BOXES)].map((_, i) => {
        return <Box key={i} color={`#444894`} />;
      })}
      {/* <EffectComposer>
        <Noise
          premultiply // enables or disables noise premultiplication
          blendFunction={BlendFunction.ADD} // blend mode
        />
      </EffectComposer> */}
    </Canvas>
  );
}
