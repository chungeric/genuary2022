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
      zoom={8}
      position={[20, 20, 20]}
      ref={ref}
    />
  );
};

// const Box = (props) => {
//   const ref = useRef();
//   useFrame(({ clock }) => {
//     const t = clock.getElapsedTime();
//     ref.current.scale.x = map(Math.sin(t + props.offset), -1, 1, 0, 1);
//     ref.current.scale.y = map(Math.sin(t + props.offset), -1, 1, 0, 1);
//     ref.current.scale.z = map(Math.sin(t + props.offset), -1, 1, 0, 1);
//   });
//   return (
//     <mesh {...props} ref={ref}>
//       <boxBufferGeometry args={[1, 1, 1]} />
//       <meshNormalMaterial />
//     </mesh>
//   );
// };

function Boxes() {
  const meshRef = useRef();
  const time = useRef(0);
  const [paused, setPaused] = useState(true);
  const dummy = new Object3D();
  const SIZE = 22;

  const boxes = useMemo(() => {
    const temp = [];
    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        for (let z = 0; z < SIZE; z++) {
          const randomPos = new Vector3(
            rr(-SIZE, SIZE),
            rr(-SIZE, SIZE),
            rr(-SIZE, SIZE)
          );
          const randomRotation = new Vector3(
            rr(0, 2 * Math.PI),
            rr(0, 2 * Math.PI),
            rr(0, 2 * Math.PI)
          );
          temp.push({
            randomPos,
            randomRotation,
            pos: new Vector3(x - SIZE / 2, y - SIZE / 2, z - SIZE / 2),
          });
        }
      }
    }
    return temp;
  }, [SIZE]);

  useEffect(() => {
    if (meshRef == null) return;
    if (meshRef.current == null) return;

    let i = 0;
    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        for (let z = 0; z < SIZE; z++) {
          const id = i++;
          const thisBox = boxes[id];
          dummy.position.set(thisBox.pos.x, thisBox.pos.y, thisBox.pos.z);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(id, dummy.matrix);
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [boxes]);

  useFrame(({ clock }) => {
    if (paused) return;
    time.current += 0.03;
    const tt = map(Math.sin(time.current - 1.5), -1, 1, 0, 1);
    let i = 0;
    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        for (let z = 0; z < SIZE; z++) {
          const id = i++;
          const thisBox = boxes[id];
          // const rotation = map(Math.sin(t), -1, 1, 0, 2 * Math.PI);
          dummy.position.set(
            lerp(thisBox.pos.x, thisBox.randomPos.x, tt),
            lerp(thisBox.pos.y, thisBox.randomPos.y, tt),
            lerp(thisBox.pos.z, thisBox.randomPos.z, tt)
          );
          // dummy.position.set(thisBox.pos.x, thisBox.pos.y, thisBox.pos.z);
          dummy.scale.set(lerp(1, 0, tt), lerp(1, 0, tt), lerp(1, 0, tt));
          dummy.rotation.set(
            lerp(0, thisBox.randomRotation.x, tt),
            lerp(0, thisBox.randomRotation.y, tt),
            lerp(0, thisBox.randomRotation.z, tt)
          );
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(id, dummy.matrix);
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  useEffect(() => {
    function onClick() {
      setPaused(!paused);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[null, null, SIZE ** 3]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </instancedMesh>
  );
}

export default function App() {
  return (
    <Canvas dpr={Math.min(window.devicePixelRatio, 2)}>
      <OrbitControls />
      <Camera />
      {/* <ambientLight />
      <pointLight position={[0, 20, 40]} /> */}
      {/* {[...Array(22)].map((_, x, arr) => {
        return (
          <Fragment key={`x${x}`}>
            {[...Array(22)].map((_, y, arr) => {
              return (
                <Fragment key={`y${y}`}>
                  {[...Array(22)].map((_, z, arr) => {
                    return (
                      <Fragment key={`z${z}`}>
                        <Box
                          key={`${x}${y}${z}`}
                          offset={z * 0.1}
                          position={[x - 11, y - 11, z - 11]}
                        />
                      </Fragment>
                    );
                  })}
                </Fragment>
              );
            })}
          </Fragment>
        );
      })} */}
      <Boxes />
    </Canvas>
  );
}
