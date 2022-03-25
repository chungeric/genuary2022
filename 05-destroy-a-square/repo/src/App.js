import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  OrthographicCamera,
} from "@react-three/drei";
import { InstancedMesh } from "three";
import { Object3D, Vector3 } from "three";
import { gsap } from "gsap";
import * as dat from "dat.gui";
import { Physics, useBox, usePlane } from "@react-three/cannon";

// const gui = new dat.GUI();

// var settings = { progress: 0 };
// gui.add(settings, "progress", 0, 1, 0.01);

const clamp = (n, min, max) => {
  return Math.min(Math.max(n, min), max);
};

const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const rr = (min, max) => Math.random() * (max - min) + min;

const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;

const Camera = () => {
  const ref = useRef();
  return (
    <OrthographicCamera
      makeDefault
      zoom={40}
      position={[10, 10, 20]}
      ref={ref}
    />
  );
};

const Box = (props) => {
  const [ref, api] = useBox(() => ({
    ...props,
    mass: rr(600, 900),
  }));
  // useFrame(({ clock }) => {
  //   const t = clock.getElapsedTime();
  //   ref.current.scale.x = map(Math.sin(t + props.offset), -1, 1, 0, 1);
  //   ref.current.scale.y = map(Math.sin(t + props.offset), -1, 1, 0, 1);
  //   ref.current.scale.z = map(Math.sin(t + props.offset), -1, 1, 0, 1);
  // });
  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
};

function Plane(props) {
  const [ref] = usePlane(() => ({
    position: [0, -0.5, 0],
    rotation: [-Math.PI / 2, 0, 0],
    ...props,
  }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial color="#171717" />
    </mesh>
  );
}

const Boxes = () => {
  // let MASS = rr(8, 100);
  let COLOR = `hsl(${rr(0, 360)},70%,30%)`;
  let CUBE_SIZE = 3;
  return (
    <Fragment>
      {[...Array(CUBE_SIZE)].map((_, x, arr) => {
        return (
          <Fragment key={`x${x}`}>
            {[...Array(CUBE_SIZE)].map((_, y, arr) => {
              return (
                <Fragment key={`y${y}`}>
                  {[...Array(CUBE_SIZE)].map((_, z, arr) => {
                    return (
                      <Fragment key={`z${z}`}>
                        <Box
                          // mass={MASS}
                          color={COLOR}
                          key={`${x}${y}${z}`}
                          offset={z * 0.1}
                          position={[x, y + 20, z]}
                        />
                      </Fragment>
                    );
                  })}
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default function App() {
  // useEffect(
  //   () => window.addEventListener("click", () => window.location.reload()),
  //   [boxesVisible]
  // );
  return (
    <Canvas dpr={Math.min(window.devicePixelRatio, 2)}>
      <ambientLight />
      <pointLight position={[10, 20, 30]} />
      <OrbitControls />
      <Camera />
      <Physics gravity={[0, -rr(20, 40), 0]}>
        <Boxes />
        <Plane />
      </Physics>
    </Canvas>
  );
}
