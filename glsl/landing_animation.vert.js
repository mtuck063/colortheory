export default `
  uniform float delta;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform vec2 mouse;

  void main() {
    vUv = uv;
    float z = position.z;
    float noise = snoise(position * delta * 0.5);
    vPosition = position * (1.0 + (noise * 0.5));

    float p_distance = max(0.0, distance(mouse.xy * 5., vPosition.xy));

    if(p_distance < 1.75) {
      z = ((1.0 - (p_distance / 1.75)) * .5) + position.z;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, z, 1.0);
  }
`;
