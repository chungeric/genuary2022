import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, { Fragment, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointLightHelper } from "three";

const clamp = (n, min, max) => {
  return Math.min(Math.max(n, min), max);
};

const rr = (min, max) => Math.random() * (max - min) + min;

const BUILDING_SIZE = 3;
const OFFSET = 1;
const W = 6;

const Camera = (props) => {
  return (
    <PerspectiveCamera
      ref={props.cameraRef}
      {...props}
      makeDefault
      // rotation={props.rotation || [0, Math.PI, 0]}
      // position={props.position || [1, 6, 20]}
      rotation={[0, (Math.PI / 2) * 3, 0]}
      position={[0, 4, 1]}
    />
  );
};

const Base = (props) => {
  // const ref = useRef();
  let baseLength = 200;
  let baseWidth = 100;
  return (
    <mesh
      ref={props.baseRef}
      rotation={[Math.PI / 2, 0, Math.PI / 2]}
      position={[baseLength / 2 - BUILDING_SIZE / 2, 0, 0]}
    >
      <planeBufferGeometry args={[baseWidth, baseLength]} />
      <meshPhysicalMaterial side={THREE.DoubleSide} color={0x444444} />
    </mesh>
  );
};

const Building = ({ x, y, z, height, color }) => {
  const ref = useRef();
  // console.log(ref.current);
  // const animatedHeight = useRef();
  // const posY = useRef(0);
  // useFrame(() => {
  //   animatedHeight.current = clamp(animatedHeight.current + 0.05, 0, height);
  //   ref.current.geometry.parameters.height = animatedHeight.current;
  //   ref.current.position.y = animatedHeight.current / 2;
  // });
  return (
    <mesh ref={ref} position={[x, y, z]}>
      <boxBufferGeometry args={[BUILDING_SIZE, height, BUILDING_SIZE]} />
      <meshPhysicalMaterial color={color} />
    </mesh>
  );
};

export default function App() {
  return (
    <Canvas
      dpr={Math.min(window.devicePixelRatio, 2)}
      onCreated={(state) => state.gl.setClearColor("lightskyblue")}
    >
      <Scene />
    </Canvas>
  );
}

const Scene = () => {
  // const { rx, ry, rz, px, py, pz, orbit, paused } = useControls({
  //   px: {
  //     value: 10,
  //     min: -200,
  //     max: 200,
  //     step: 0.5,
  //   },
  //   py: {
  //     value: 6,
  //     min: -200,
  //     max: 200,
  //     step: 0.5,
  //   },
  //   pz: {
  //     value: 1,
  //     min: -200,
  //     max: 200,
  //     step: 0.5,
  //   },
  //   rx: {
  //     value: 0,
  //     min: 0,
  //     max: 0,
  //     step: 0.05,
  //   },
  //   ry: {
  //     value: (Math.PI / 2) * 3,
  //     min: 0,
  //     max: 2 * Math.PI,
  //     step: 0.05,
  //   },
  //   rz: {
  //     value: 0,
  //     min: 0,
  //     max: 2 * Math.PI,
  //     step: 0.05,
  //   },
  //   orbit: false,
  //   paused: false,
  // });
  const cameraRef = useRef();
  const baseRef = useRef();
  const check = useRef(0);
  const pointLightRef = useRef();
  const orbitControlsRef = useRef();
  const SPEED = 5;
  // useHelper(pointLightRef, PointLightHelper, 0.5, "white");

  useFrame(({ clock }, delta) => {
    // let t = clock.getElapsedTime();
    let d = delta;
    check.current += d;
    cameraRef.current.position.x += d * (BUILDING_SIZE + OFFSET) * SPEED;
    pointLightRef.current.position.x += d * (BUILDING_SIZE + OFFSET) * SPEED;
    // orbitControlsRef.current.target.x += d * (BUILDING_SIZE + OFFSET) * SPEED;

    if (check.current - 1 / SPEED > 0) {
      check.current = 0;
      baseRef.current.position.x += BUILDING_SIZE + OFFSET;
      setBuildings((buildings) => {
        const buildingsCopy = buildings.slice();
        const frontBuildings = buildingsCopy.splice(0, 4);
        frontBuildings.forEach((b, i) => {
          const lastX = buildingsCopy.at(-(i + 1)).x;
          return (b.x = lastX + (BUILDING_SIZE + OFFSET));
        });
        const newBuildings = [...buildingsCopy, ...frontBuildings];
        return newBuildings;
      });
    }
  });
  const [buildings, setBuildings] = useState(null);
  useEffect(() => {
    let temp = [];
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < W; j++) {
        let height = Math.random() > 0.9 ? rr(26, 30) : rr(4, 18);
        let y = height / 2;
        if (j == 2 || j == 3) continue;
        temp.push({
          x: i * BUILDING_SIZE + OFFSET * i,
          y,
          z: (j - W / 2) * BUILDING_SIZE + OFFSET * j,
          height,
          color: `hsl(${rr(0, 80)}, ${Math.floor(rr(40, 80))}%, ${Math.floor(
            rr(20, 70)
          )}%)`,
        });
      }
    }
    setBuildings(temp);
  }, []);
  if (!buildings) return null;
  return (
    <>
      {/* <OrbitControls ref={orbitControlsRef} target={[100, 4, 0]} /> */}
      <Camera
        cameraRef={cameraRef}
        // paused={paused}
        // position={[px, py, pz]}
        // rotation={[rx, ry, rz]}
      />
      {/* <hemisphereLight /> */}
      <pointLight ref={pointLightRef} position={[30, 20, 1]} />
      <ambientLight color={0xeeeeee} />
      {/* <pointLight color={0xffffff} position={[-20, -20, 20]} /> */}
      <Base baseRef={baseRef} />
      {buildings.map((building, i) => {
        return <Building key={i} {...building} />;
      })}
    </>
  );
};
