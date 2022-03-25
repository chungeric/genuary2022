export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  // Simplex 2D noise
  //
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  #define OCTAVES 5
  float fbm (in vec2 st) {
      // Initial values
      float value = 0.0;
      float amplitude = .5;
      float frequency = 0.;
      //
      // Loop of octaves
      for (int i = 0; i < OCTAVES; i++) {
          value += amplitude * snoise(st);
          st *= 2.;
          amplitude *= .5;
      }
      return value;
  }

  uniform float uTime;
  uniform float uOffset;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = (uTime + uOffset);
    float detail = 1.;
    float timeScale = 0.1;
    float n =
      fbm(vec2((uv.x + t * timeScale) * detail, (uv.y + t * timeScale) * detail)) +
      fbm(vec2((uv.x - t * timeScale) * detail, (uv.y - t * timeScale) * detail)) +
      fbm(vec2((uv.x + t * timeScale) * detail, (uv.y - t * timeScale) * detail)) +
      fbm(vec2((uv.x - t * timeScale) * detail, (uv.y + t * timeScale) * detail));

    vec3 navy = vec3(0.18,0.161,0.306);
    vec3 purple = vec3(0.329,0.075,0.533);
    vec3 cream = vec3(0.945,0.914,0.855);
    vec3 yellow = vec3(1.,0.831,0.);
    vec3 pink = vec3(0.851,0.012,0.408);
    vec3 color = mix(navy, purple, step(0.1, n));
    color = mix(color, cream, step(0.2, n));
    color = mix(color, yellow, step(0.3, n));
    color = mix(color, pink, step(0.6, n));
    gl_FragColor = vec4(color, 1.0);
  }
`;
