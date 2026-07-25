import { useRef, useEffect } from 'react';

const Dither = ({
  waveColor = [0.5, 0.5, 0.5],
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 0.3,
  colorNum = 4,
  waveAmplitude = 0.3,
  waveFrequency = 3,
  waveSpeed = 0.05,
}) => {
  const canvasRef = useRef(null);
  
  // Mouse state
  const mouseRef = useRef({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Shader Sources
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform bool u_enableMouse;
      uniform float u_mouseRadius;
      uniform vec3 u_waveColor;
      uniform float u_colorNum;
      uniform float u_waveAmplitude;
      uniform float u_waveFrequency;
      uniform float u_waveSpeed;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution;
        float aspect = u_resolution.x / u_resolution.y;
        st.x *= aspect;

        // Mouse Interaction
        float dist = distance(st, vec2(u_mouse.x * aspect, 1.0 - u_mouse.y));
        float mouseEffect = 0.0;
        if (u_enableMouse) {
            mouseEffect = smoothstep(u_mouseRadius, 0.0, dist) * 0.5;
        }

        // Wave Logic
        float wave = sin(st.y * u_waveFrequency + u_time * u_waveSpeed + mouseEffect * 5.0) * u_waveAmplitude;
        
        // Dither Logic (Posterization)
        float brightness = st.x + wave;
        float levels = u_colorNum;
        float stepped = floor(brightness * levels) / levels;

        vec3 color = u_waveColor * stepped;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Compile Shaders
    const createShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Buffer Setup
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const uniforms = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      enableMouse: gl.getUniformLocation(program, 'u_enableMouse'),
      mouseRadius: gl.getUniformLocation(program, 'u_mouseRadius'),
      waveColor: gl.getUniformLocation(program, 'u_waveColor'),
      colorNum: gl.getUniformLocation(program, 'u_colorNum'),
      waveAmplitude: gl.getUniformLocation(program, 'u_waveAmplitude'),
      waveFrequency: gl.getUniformLocation(program, 'u_waveFrequency'),
      waveSpeed: gl.getUniformLocation(program, 'u_waveSpeed'),
    };

    // Render Loop
    let animationId;
    const startTime = performance.now();

    const render = (time) => {
      const currentTime = (time - startTime) * 0.001; // seconds

      // Resize logic
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Uniform Updates
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, disableAnimation ? 0 : currentTime);
      gl.uniform2f(uniforms.mouse, mouseRef.current.x / canvas.width, mouseRef.current.y / canvas.height);
      gl.uniform1i(uniforms.enableMouse, enableMouseInteraction);
      gl.uniform1f(uniforms.mouseRadius, mouseRadius);
      gl.uniform3fv(uniforms.waveColor, waveColor);
      gl.uniform1f(uniforms.colorNum, colorNum);
      gl.uniform1f(uniforms.waveAmplitude, waveAmplitude);
      gl.uniform1f(uniforms.waveFrequency, waveFrequency);
      gl.uniform1f(uniforms.waveSpeed, waveSpeed);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };

    render(performance.now());

    // Event Listeners
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    if (enableMouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [disableAnimation, enableMouseInteraction, mouseRadius, colorNum, waveAmplitude, waveFrequency, waveSpeed, waveColor]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

export default Dither;