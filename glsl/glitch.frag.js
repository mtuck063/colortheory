export default `
  uniform sampler2D texture;
  uniform vec2 mouse;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    if(texture2D(texture, vUv).a == 0.) {
      discard;
    }

    gl_FragColor = texture2D(texture, vUv);

    if(distance(mouse.xy * 0.75, vPosition.xy) < 0.2) {
      gl_FragColor.rgb *= 1.5;
    }
  }
`;
