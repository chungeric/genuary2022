import { helpers } from "./helpers";

export const fragmentShader = `
  uniform float uTime;
  uniform vec3 uBlobColor;
  uniform vec3 uBgColor;
  uniform vec2 uPlaneSize;
  uniform vec2 uImageSize;
  uniform sampler2D uTexture;
  varying vec2 vUv;
  ${helpers}

  float drawCircle(vec2 uv, float radius) {
    float blur = 0.1;
    return smoothstep(0.0, radius, distance(uv, vec2(0.5)));
  }

  void main() {
    vec2 uv = vUv;
    vec2 coverUv = getCoverUv(uv, uPlaneSize, uImageSize);
    vec4 texture = texture2D(uTexture, coverUv);
    float spikes = 2.4;
    float n = snoise(vec3(uv * spikes, uTime * spikes));
    float r = map(n, 0.0, 1.0, 0.25, 0.35);
    float blob = drawCircle(uv, r);
    vec3 color = mix(uBlobColor, uBgColor, blob);
    vec3 mask = dither(gl_FragCoord.xy, color);
    gl_FragColor = vec4(mask, 1.0);
  }
`;
