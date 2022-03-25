import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { getContributions } from "./utils/getContributions";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { gsap } from "gsap";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const Box = ({ height, color, ...rest }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.userData = {
      height,
    };
  }, []);
  return (
    <mesh ref={ref} {...rest}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Scene = ({ data, mouse }) => {
  const raycaster = new THREE.Raycaster();

  useFrame(({ scene, camera }) => {
    scene.children
      .filter((child) => child.isMesh)
      .forEach((child) => {
        gsap.to(child.scale, {
          y: 0.2,
          duration: 5,
        });
        gsap.to(child.position, {
          y: 0.1,
          duration: 5,
        });
      });
    if (mouse.current !== null) {
      raycaster.setFromCamera(mouse.current, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length) {
        intersects.forEach((object) => {
          const height = object.object.userData.height;
          gsap.to(object.object.scale, {
            y: height,
            duration: 0.1,
          });
          gsap.to(object.object.position, {
            y: height / 2,
            duration: 0.1,
          });
        });
      }
    }
  });

  const {
    data: {
      user: {
        contributionsCollection: { contributionCalendar },
      },
    },
  } = data;
  const { colors, totalContributions, weeks } = contributionCalendar;

  return (
    <React.Fragment>
      {weeks.map(({ contributionDays, firstDay }, weekIndex) => (
        <React.Fragment key={weekIndex}>
          {contributionDays.map(({ contributionCount, color }, dayIndex) => {
            const height = Math.max(0.2, clamp(contributionCount, 0, 15));
            return (
              <Box
                key={dayIndex}
                scale={[1, 0.2, 1]}
                position={[
                  weekIndex + 0.2 * weekIndex,
                  0.1,
                  -dayIndex + 0.2 * -dayIndex,
                ]}
                height={height}
                color={color}
              />
            );
          })}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

const Camera = ({ data, mouse }) => {
  const numWeeks = getNumWeeks(data);
  const ref = useRef();
  // const zoom = 80;
  const zoom = 50;

  useEffect(() => {
    ref.current.lookAt(
      new THREE.Vector3(numWeeks / 2 + 0.2 * (numWeeks / 2), 0, 0)
    );
  }, []);

  useFrame(({ scene, camera }) => {
    ref.current.position.x =
      numWeeks / 2 + 0.2 * (numWeeks / 2) + mouse.current.x * 20;
    ref.current.lookAt(
      new THREE.Vector3(numWeeks / 2 + 0.2 * (numWeeks / 2), 0, 0)
    );
  });

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position={[numWeeks / 2 + 0.2 * (numWeeks / 2), 40, zoom]}
    />
  );
};

export default function App() {
  let mouse = useRef(new THREE.Vector2(0, 0));
  const [data, setData] = useState(null);

  useEffect(() => {
    const update = (e) => {
      mouse.current = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", update);
    return () => {
      window.removeEventListener("pointermove", update);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getContributions();
      setData(data);
    };
    fetchData().catch(console.error);
  }, []);

  if (!data) return <div className="loading">Loading...</div>;
  const numWeeks = getNumWeeks(data);

  return (
    <Canvas dpr={Math.min(devicePixelRatio || 2)}>
      {/* <OrbitControls /> */}
      <Camera data={data} mouse={mouse} />
      <ambientLight color={0xededed} />
      <pointLight
        color={0xffffff}
        intensity={0.5}
        position={[0 - 10, 100, 50]}
      />
      <pointLight
        color={0xffffff}
        intensity={0.5}
        position={[numWeeks + 10, 100, 50]}
      />
      <Scene data={data} mouse={mouse} />
    </Canvas>
  );
}

const getNumWeeks = (data) => {
  return data.data.user.contributionsCollection.contributionCalendar.weeks
    .length;
};
