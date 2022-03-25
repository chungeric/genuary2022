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

const SIZE = 100;

const clamp = (n, min, max) => {
  return Math.min(Math.max(n, min), max);
};

const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const rr = (min, max) => Math.random() * (max - min) + min;

const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;

function Boxes() {
  const meshRef = useRef();
  const time = useRef(0);
  // const [paused, setPaused] = useState(true);
  const dummy = new Object3D();

  const boxes = useMemo(() => {
    const temp = [];
    for (let x = 0; x < SIZE; x++) {
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
        let height = Math.ceil(Math.random() * 10);
        temp.push({
          randomPos,
          randomRotation,
          offset: Math.random() * 20,
          scale: new Vector3(1, height, 1),
          pos: new Vector3(-x - x, height / 2, -z - z),
        });
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
        const id = i++;
        const thisBox = boxes[id];
        dummy.position.set(thisBox.pos.x, thisBox.pos.y, thisBox.pos.z);
        dummy.scale.set(thisBox.scale.x, thisBox.scale.y, thisBox.scale.z);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(id, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [boxes]);

  useFrame(({ clock }) => {
    // if (paused) return;
    time.current += 0.03;
    let i = 0;
    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        const id = i++;
        const thisBox = boxes[id];
        const tt = map(Math.sin(time.current + thisBox.offset), -1, 1, 0, 1);
        let newHeight = lerp(thisBox.scale.y, 1, tt);
        dummy.position.set(thisBox.pos.x, newHeight / 2, thisBox.pos.z);
        // dummy.position.set(thisBox.pos.x, thisBox.pos.y, thisBox.pos.z);
        dummy.scale.set(thisBox.scale.x, newHeight, thisBox.scale.z);
        // dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(id, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // useEffect(() => {
  //   function onClick() {
  //     setPaused(!paused);
  //   }
  //   window.addEventListener("click", onClick);
  //   return () => window.removeEventListener("click", onClick);
  // }, []);

  return (
    <instancedMesh ref={meshRef} args={[null, null, SIZE ** 2]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </instancedMesh>
  );
}

const Camera = () => {
  const ref = useRef();
  useEffect(() => {
    ref.current.lookAt(new Vector3(-50 - SIZE / 2, 0, -50 - SIZE / 2));
  });
  useFrame(({ clock }) => {
    let t = clock.getElapsedTime();
    const tt = map(Math.sin(t), -1, 1, 0, 1);
    ref.current.zoom = lerp(3, 30, tt);
    ref.current.updateProjectionMatrix();
  });
  return (
    <OrthographicCamera
      makeDefault
      zoom={3}
      position={[80, 70, 100]}
      ref={ref}
    />
  );
};

export default function App() {
  return (
    <Canvas dpr={Math.min(window.devicePixelRatio, 2)}>
      {/* <OrbitControls /> */}
      <Camera />
      <Boxes />
    </Canvas>
  );
}
