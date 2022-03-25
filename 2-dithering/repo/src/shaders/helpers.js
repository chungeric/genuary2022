export const helpers = `

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  // https://github.com/hughsk/glsl-luma/blob/master/index.glsl
  float luma(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  // https://github.com/hughsk/glsl-dither/blob/master/2x2.glsl
  float dither2x2(vec2 position, float brightness) {
    int x = int(mod(position.x, 2.0));
    int y = int(mod(position.y, 2.0));
    int index = x + y * 2;
    float limit = 0.0;
    if (x < 8) {
      if (index == 0) limit = 0.25;
      if (index == 1) limit = 0.75;
      if (index == 2) limit = 1.00;
      if (index == 3) limit = 0.50;
    }
    return brightness < limit ? 0.0 : 1.0;
  }
  float dither8x8(vec2 position, float brightness) {
    int x = int(mod(position.x, 8.0));
    int y = int(mod(position.y, 8.0));
    int index = x + y * 8;
    float limit = 0.0;

    if (x < 8) {
      if (index == 0) limit = 0.015625;
      if (index == 1) limit = 0.515625;
      if (index == 2) limit = 0.140625;
      if (index == 3) limit = 0.640625;
      if (index == 4) limit = 0.046875;
      if (index == 5) limit = 0.546875;
      if (index == 6) limit = 0.171875;
      if (index == 7) limit = 0.671875;
      if (index == 8) limit = 0.765625;
      if (index == 9) limit = 0.265625;
      if (index == 10) limit = 0.890625;
      if (index == 11) limit = 0.390625;
      if (index == 12) limit = 0.796875;
      if (index == 13) limit = 0.296875;
      if (index == 14) limit = 0.921875;
      if (index == 15) limit = 0.421875;
      if (index == 16) limit = 0.203125;
      if (index == 17) limit = 0.703125;
      if (index == 18) limit = 0.078125;
      if (index == 19) limit = 0.578125;
      if (index == 20) limit = 0.234375;
      if (index == 21) limit = 0.734375;
      if (index == 22) limit = 0.109375;
      if (index == 23) limit = 0.609375;
      if (index == 24) limit = 0.953125;
      if (index == 25) limit = 0.453125;
      if (index == 26) limit = 0.828125;
      if (index == 27) limit = 0.328125;
      if (index == 28) limit = 0.984375;
      if (index == 29) limit = 0.484375;
      if (index == 30) limit = 0.859375;
      if (index == 31) limit = 0.359375;
      if (index == 32) limit = 0.0625;
      if (index == 33) limit = 0.5625;
      if (index == 34) limit = 0.1875;
      if (index == 35) limit = 0.6875;
      if (index == 36) limit = 0.03125;
      if (index == 37) limit = 0.53125;
      if (index == 38) limit = 0.15625;
      if (index == 39) limit = 0.65625;
      if (index == 40) limit = 0.8125;
      if (index == 41) limit = 0.3125;
      if (index == 42) limit = 0.9375;
      if (index == 43) limit = 0.4375;
      if (index == 44) limit = 0.78125;
      if (index == 45) limit = 0.28125;
      if (index == 46) limit = 0.90625;
      if (index == 47) limit = 0.40625;
      if (index == 48) limit = 0.25;
      if (index == 49) limit = 0.75;
      if (index == 50) limit = 0.125;
      if (index == 51) limit = 0.625;
      if (index == 52) limit = 0.21875;
      if (index == 53) limit = 0.71875;
      if (index == 54) limit = 0.09375;
      if (index == 55) limit = 0.59375;
      if (index == 56) limit = 1.0;
      if (index == 57) limit = 0.5;
      if (index == 58) limit = 0.875;
      if (index == 59) limit = 0.375;
      if (index == 60) limit = 0.96875;
      if (index == 61) limit = 0.46875;
      if (index == 62) limit = 0.84375;
      if (index == 63) limit = 0.34375;
    }

    return brightness < limit ? 0.0 : 1.0;
  }

  vec3 dither(vec2 position, vec3 color) {
    return color * dither8x8(position, luma(color));
  }

  // background cover
  vec2 getCoverUv (vec2 uv, vec2 resolution, vec2 texResolution) {
    vec2 s = resolution; // Screen
    vec2 i = texResolution; // Image
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
    vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
    vec2 coverUv = uv * s / new + offset;
    return coverUv;
  }

  
  
  // Description : Array and textureless GLSL 2D/3D/4D simplex 
  //               noise functions.
  //      Author : Ian McEwan, Ashima Arts.
  //  Maintainer : stegu
  //     Lastmod : 20201014 (stegu)
  //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
  //               Distributed under the MIT License. See LICENSE file.
  //               https://github.com/ashima/webgl-noise
  //               https://github.com/stegu/webgl-noise
  // 

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
      return mod289(((x*34.0)+10.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v)
    { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

  // Mix final noise value
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
    }
`;
