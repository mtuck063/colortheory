export default `
  uniform float delta;
  uniform vec2 mouse;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    float z = position.z;
    float noise = snoise(position * delta * 0.5);
    vPosition = position * (1.0 + (noise * 0.3));

    float p_distance = max(0.0, distance(mouse.xy * 0.75, vPosition.xy));

    if(p_distance < 0.2) {
      z = ((1.0 - (p_distance / 0.2)) * 0.2) + position.z;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition.xy, z, 1.0);
  }
`;
