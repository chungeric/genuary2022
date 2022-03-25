export const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 3.0;
    float scale = 4.;
		gl_PointSize *= ( scale / - mvPosition.z );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform float uTime;
  uniform sampler2D uTexture;
  varying vec2 vUv;
  void main() {
    // vec2 st = gl_FragCoord.xy/u_resolution;
    vec2 uv = vUv;
    gl_FragColor = texture2D(uTexture, vUv);;
  }
`;
