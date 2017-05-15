export default `
  uniform sampler2D texture;
  uniform vec2 mouse;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    gl_FragColor = texture2D(texture, vUv);

    if(distance((mouse.xy * 5.), vPosition.xy) < 1.75) {
      gl_FragColor.rgb *= 1.5;
    }
  }
`;
