<script lang="ts" setup>
/**
 * @description source code: https://21st.dev/davidhzdev/splash-cursor/default
 * Transformed to vue3 code by deepseek
 * Optimised by me
 */
interface Pointer {
  id: number
  texcoordX: number
  texcoordY: number
  prevTexcoordX: number
  prevTexcoordY: number
  deltaX: number
  deltaY: number
  down: boolean
  moved: boolean
  color: { r: number, g: number, b: number }
}

interface FBO {
  texture: WebGLTexture | null
  fbo: WebGLFramebuffer | null
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  attach: (id: number) => number
}

interface DoubleFBO {
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  read: FBO
  write: FBO
  swap: () => void
}

interface Material {
  setKeywords: (keywords: string[]) => void
  bind: () => void
  uniforms: { [key: string]: WebGLUniformLocation | null }
}

interface Program {
  program: WebGLProgram
  uniforms: { [key: string]: WebGLUniformLocation | null }
  bind: () => void
}

interface GLContext {
  gl: WebGL2RenderingContext
  ext: {
    formatRGBA: { internalFormat: number, format: number }
    formatRG: { internalFormat: number, format: number }
    formatR: { internalFormat: number, format: number }
    halfFloatTexType: number
    supportLinearFiltering: boolean
  }
}

interface Config {
  SIM_RESOLUTION: number
  DYE_RESOLUTION: number
  CAPTURE_RESOLUTION: number
  DENSITY_DISSIPATION: number
  VELOCITY_DISSIPATION: number
  PRESSURE: number
  PRESSURE_ITERATIONS: number
  CURL: number
  SPLAT_RADIUS: number
  SPLAT_FORCE: number
  SHADING: boolean
  COLOR_UPDATE_SPEED: number
  PAUSED: boolean
  BACK_COLOR: { r: number, g: number, b: number }
  TRANSPARENT: boolean
}

const props = withDefaults(defineProps<Partial<Config>>(), {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1440,
  CAPTURE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 3.5,
  VELOCITY_DISSIPATION: 2,
  PRESSURE: 0.1,
  PRESSURE_ITERATIONS: 20,
  CURL: 3,
  SPLAT_RADIUS: 0.2,
  SPLAT_FORCE: 6000,
  SHADING: true,
  COLOR_UPDATE_SPEED: 10,
  BACK_COLOR: () => ({ r: 0.5, g: 0, b: 0 }),
  TRANSPARENT: true,
})

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')

const fps = useFps()

useEventListener('contextmenu', (e) => {
  e.preventDefault()
})

onMounted(() => {
  if (!canvasRef.value)
    return

  const canvas = canvasRef.value
  let gl: WebGL2RenderingContext
  let ext: any = null
  let animationFrameId: number
  let lastUpdateTime = Date.now()
  let colorUpdateTimer = 0.0

  let dye: DoubleFBO
  let velocity: DoubleFBO
  let divergence: FBO
  let curl: FBO
  let pressure: DoubleFBO

  let copyProgram: Program
  let clearProgram: Program
  let splatProgram: Program
  let advectionProgram: Program
  let divergenceProgram: Program
  let curlProgram: Program
  let vorticityProgram: Program
  let pressureProgram: Program
  let gradienSubtractProgram: Program
  let displayMaterial: Material

  const pointers: Pointer[] = []

  function PointerPrototype(this: Pointer) {
    this.id = -1
    this.texcoordX = 0
    this.texcoordY = 0
    this.prevTexcoordX = 0
    this.prevTexcoordY = 0
    this.deltaX = 0
    this.deltaY = 0
    this.down = false
    this.moved = false
    this.color = { r: 0, g: 0, b: 0 }
  }

  pointers.push(new (PointerPrototype as any)())

  const config: Config = {
    SIM_RESOLUTION: props.SIM_RESOLUTION,
    DYE_RESOLUTION: props.DYE_RESOLUTION,
    CAPTURE_RESOLUTION: props.CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION: props.DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION: props.VELOCITY_DISSIPATION,
    PRESSURE: props.PRESSURE,
    PRESSURE_ITERATIONS: props.PRESSURE_ITERATIONS,
    CURL: props.CURL,
    SPLAT_RADIUS: props.SPLAT_RADIUS,
    SPLAT_FORCE: props.SPLAT_FORCE,
    SHADING: props.SHADING,
    COLOR_UPDATE_SPEED: props.COLOR_UPDATE_SPEED,
    PAUSED: false,
    BACK_COLOR: props.BACK_COLOR,
    TRANSPARENT: props.TRANSPARENT,
  }

  function getWebGLContext(canvas: HTMLCanvasElement): GLContext {
    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    }

    let context: WebGL2RenderingContext = canvas.getContext('webgl2', params) as WebGL2RenderingContext

    const isWebGL2 = !!context
    if (!isWebGL2) {
      context = (canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)) as WebGL2RenderingContext
    }

    if (!context) {
      throw new Error('WebGL not supported')
    }

    let halfFloat: any
    let supportLinearFiltering: any

    if (isWebGL2) {
      context.getExtension('EXT_color_buffer_float')
      supportLinearFiltering = context.getExtension('OES_texture_float_linear')
    }
    else {
      halfFloat = context.getExtension('OES_texture_half_float')
      supportLinearFiltering = context.getExtension('OES_texture_half_float_linear')
    }

    context.clearColor(0.0, 0.0, 0.0, 1.0)
    const halfFloatTexType = isWebGL2 ? context.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES

    let formatRGBA: { internalFormat: number, format: number }
    let formatRG: { internalFormat: number, format: number }
    let formatR: { internalFormat: number, format: number }

    if (isWebGL2) {
      formatRGBA = getSupportedFormat(
        context,
        context.RGBA16F,
        context.RGBA,
        halfFloatTexType,
      ) as { internalFormat: number, format: number }
      formatRG = getSupportedFormat(
        context,
        context.RG16F,
        context.RG,
        halfFloatTexType,
      ) as { internalFormat: number, format: number }
      formatR = getSupportedFormat(
        context,
        context.R16F,
        context.RED,
        halfFloatTexType,
      ) as { internalFormat: number, format: number }
    }
    else {
      formatRGBA = getSupportedFormat(
        context,
        context.RGBA,
        context.RGBA,
        halfFloatTexType,
      ) as { internalFormat: number, format: number }
      formatRG = getSupportedFormat(
        context,
        context.RGBA,
        context.RGBA,
        halfFloatTexType,
      ) as { internalFormat: number, format: number }
      formatR = getSupportedFormat(
        context,
        context.RGBA,
        context.RGBA,
        halfFloatTexType,
      ) as { internalFormat: number, format: number }
    }

    return {
      gl: context,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering,
      },
    }
  }

  function getSupportedFormat(
    gl: WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number,
  ): { internalFormat: number, format: number } | null {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      if (gl instanceof WebGL2RenderingContext) {
        switch (internalFormat) {
          case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type)
          case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type)
          default:
            return null
        }
      }
      return null
    }
    return {
      internalFormat,
      format,
    }
  }

  function supportRenderTextureFormat(
    gl: WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number,
  ): boolean {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat as number,
      4,
      4,
      0,
      format as number,
      type,
      null,
    )

    const fbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    )

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
    return status === gl.FRAMEBUFFER_COMPLETE
  }

  class MaterialClass implements Material {
    vertexShader: WebGLShader
    fragmentShaderSource: string
    programs: { [key: number]: WebGLProgram } = {}
    activeProgram: WebGLProgram | null = null
    uniforms: { [key: string]: WebGLUniformLocation | null } = {}

    constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
      this.vertexShader = vertexShader
      this.fragmentShaderSource = fragmentShaderSource
    }

    setKeywords(keywords: string[]) {
      if (!gl)
        return

      let hash = 0
      for (let i = 0; i < keywords.length; i++)
        hash += hashCode(keywords[i])

      let program = this.programs[hash]
      if (!program) {
        const fragmentShader = compileShader(
          gl.FRAGMENT_SHADER,
          this.fragmentShaderSource,
          keywords,
        )
        program = createProgram(this.vertexShader, fragmentShader)
        this.programs[hash] = program
      }

      if (program === this.activeProgram)
        return
      this.uniforms = getUniforms(program)
      this.activeProgram = program
    }

    bind() {
      if (!gl || !this.activeProgram)
        return
      gl.useProgram(this.activeProgram)
    }
  }

  class ProgramClass implements Program {
    program: WebGLProgram
    uniforms: { [key: string]: WebGLUniformLocation | null } = {}

    constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      if (!gl)
        throw new Error('WebGL context not initialized')
      this.program = createProgram(vertexShader, fragmentShader)
      this.uniforms = getUniforms(this.program)
    }

    bind() {
      if (!gl)
        return
      gl.useProgram(this.program)
    }
  }

  function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    if (!gl)
      throw new Error('WebGL context not initialized')

    const program = gl.createProgram()
    if (!program)
      throw new Error('Failed to create WebGL program')

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
    }

    return program
  }

  function getUniforms(program: WebGLProgram): { [key: string]: WebGLUniformLocation | null } {
    if (!gl)
      return {}

    const uniforms: { [key: string]: WebGLUniformLocation | null } = {}
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = gl.getActiveUniform(program, i)
      if (uniformInfo) {
        uniforms[uniformInfo.name] = gl.getUniformLocation(program, uniformInfo.name)
      }
    }

    return uniforms
  }

  function compileShader(
    type: number,
    source: string,
    keywords?: string[],
  ): WebGLShader {
    if (!gl)
      throw new Error('WebGL context not initialized')

    const shader = gl.createShader(type)
    if (!shader)
      throw new Error('Failed to create shader')

    let fullSource = source
    if (keywords) {
      let keywordsString = ''
      keywords.forEach((keyword) => {
        keywordsString += `#define ${keyword}\n`
      })
      fullSource = keywordsString + source
    }

    gl.shaderSource(shader, fullSource)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader))
    }

    return shader
  }

  function initWebGL() {
    if (!canvas)
      return

    const context = getWebGLContext(canvas)
    gl = context.gl
    ext = context.ext

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256
      config.SHADING = false
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `,
    )

    const copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `,
    )

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `,
    )

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `,
    )

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,
      ext.supportLinearFiltering ? undefined : ['MANUAL_FILTERING'],
    )

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `,
    )

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `,
    )

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `,
    )

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `,
    )

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `,
    )

    copyProgram = new ProgramClass(baseVertexShader, copyShader)
    clearProgram = new ProgramClass(baseVertexShader, clearShader)
    splatProgram = new ProgramClass(baseVertexShader, splatShader)
    advectionProgram = new ProgramClass(baseVertexShader, advectionShader)
    divergenceProgram = new ProgramClass(baseVertexShader, divergenceShader)
    curlProgram = new ProgramClass(baseVertexShader, curlShader)
    vorticityProgram = new ProgramClass(baseVertexShader, vorticityShader)
    pressureProgram = new ProgramClass(baseVertexShader, pressureShader)
    gradienSubtractProgram = new ProgramClass(baseVertexShader, gradientSubtractShader)
    displayMaterial = new MaterialClass(baseVertexShader, displayShaderSource)

    initFramebuffers()
    updateKeywords()
  }

  function blit(target: FBO | null, clear = false) {
    if (!gl)
      return

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    )

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW,
    )

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)

    if (target === null) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }
    else {
      gl.viewport(0, 0, target.width, target.height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
    }

    if (clear) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  }

  function initFramebuffers() {
    if (!gl || !ext)
      return

    const simRes = getResolution(config.SIM_RESOLUTION)
    const dyeRes = getResolution(config.DYE_RESOLUTION)
    const texType = ext.halfFloatTexType
    const rgba = ext.formatRGBA
    const rg = ext.formatRG
    const r = ext.formatR
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

    gl.disable(gl.BLEND)

    if (!dye) {
      dye = createDoubleFBO(
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering,
      )
    }
    else {
      dye = resizeDoubleFBO(
        dye,
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering,
      )
    }

    if (!velocity) {
      velocity = createDoubleFBO(
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering,
      )
    }
    else {
      velocity = resizeDoubleFBO(
        velocity,
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering,
      )
    }

    divergence = createFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST,
    )

    curl = createFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST,
    )

    pressure = createDoubleFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST,
    )
  }

  function createFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): FBO {
    if (!gl)
      throw new Error('WebGL context not initialized')

    gl.activeTexture(gl.TEXTURE0)
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      w,
      h,
      0,
      format,
      type,
      null,
    )

    const fbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    )

    gl.viewport(0, 0, w, h)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const texelSizeX = 1.0 / w
    const texelSizeY = 1.0 / h

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX,
      texelSizeY,
      attach(id) {
        gl?.activeTexture(gl.TEXTURE0 + id)
        gl?.bindTexture(gl.TEXTURE_2D, texture)
        return id
      },
    }
  }

  function createDoubleFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): DoubleFBO {
    const fbo1 = createFBO(w, h, internalFormat, format, type, param)
    const fbo2 = createFBO(w, h, internalFormat, format, type, param)

    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      read: fbo1,
      write: fbo2,
      swap() {
        const temp = this.read
        this.read = this.write
        this.write = temp
      },
    }
  }

  function resizeFBO(
    target: FBO,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): FBO {
    const newFBO = createFBO(w, h, internalFormat, format, type, param)
    if (!copyProgram)
      return newFBO

    copyProgram.bind()
    gl?.uniform1i(copyProgram.uniforms.uTexture, target.attach(0))
    blit(newFBO)
    return newFBO
  }

  function resizeDoubleFBO(
    target: DoubleFBO,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): DoubleFBO {
    if (target.width === w && target.height === h)
      return target

    target.read = resizeFBO(
      target.read,
      w,
      h,
      internalFormat,
      format,
      type,
      param,
    )

    target.write = createFBO(w, h, internalFormat, format, type, param)
    target.width = w
    target.height = h
    target.texelSizeX = 1.0 / w
    target.texelSizeY = 1.0 / h

    return target
  }

  function updateKeywords() {
    if (!displayMaterial)
      return

    const displayKeywords: string[] = []
    if (config.SHADING)
      displayKeywords.push('SHADING')
    displayMaterial.setKeywords(displayKeywords)
  }

  function updateFrame() {
    if (!gl)
      return

    const dt = calcDeltaTime()
    if (resizeCanvas())
      initFramebuffers()
    updateColors(dt)
    applyInputs()
    step(dt)
    render(null)

    animationFrameId = requestAnimationFrame(updateFrame)
  }

  function calcDeltaTime(): number {
    const now = Date.now()
    const dt = (now - lastUpdateTime) / 1000
    lastUpdateTime = now
    return Math.min(dt, 0.016666)
  }

  function resizeCanvas(): boolean {
    if (!canvas)
      return false

    const width = scaleByPixelRatio(canvas.clientWidth)
    const height = scaleByPixelRatio(canvas.clientHeight)

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      return true
    }

    return false
  }

  function updateColors(dt: number) {
    colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED
    if (colorUpdateTimer >= 1) {
      colorUpdateTimer = wrap(colorUpdateTimer, 0, 1)
      pointers.forEach((p) => {
        p.color = generateColor()
      })
    }
  }

  function applyInputs() {
    pointers.forEach((p) => {
      if (p.moved) {
        p.moved = false
        splatPointer(p)
      }
    })
  }

  function step(dt: number) {
    if (!gl || !velocity || !dye || !divergence || !curl || !pressure)
      return

    gl.disable(gl.BLEND)

    // Curl
    curlProgram?.bind()
    gl.uniform2f(
      curlProgram?.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    )
    gl.uniform1i(
      curlProgram?.uniforms.uVelocity,
      velocity.read.attach(0),
    )
    blit(curl)

    // Vorticity
    vorticityProgram?.bind()
    gl.uniform2f(
      vorticityProgram?.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    )
    gl.uniform1i(
      vorticityProgram?.uniforms.uVelocity,
      velocity.read.attach(0),
    )
    gl.uniform1i(
      vorticityProgram?.uniforms.uCurl,
      curl?.attach(1) ?? 0,
    )
    gl.uniform1f(
      vorticityProgram?.uniforms.curl,
      config.CURL,
    )
    gl.uniform1f(
      vorticityProgram?.uniforms.dt,
      dt,
    )
    blit(velocity.write)
    velocity.swap()

    // Divergence
    divergenceProgram?.bind()
    gl.uniform2f(
      divergenceProgram?.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    )
    gl.uniform1i(
      divergenceProgram?.uniforms.uVelocity,
      velocity.read.attach(0),
    )
    blit(divergence)

    // Clear pressure
    clearProgram?.bind()
    gl.uniform1i(
      clearProgram?.uniforms.uTexture,
      pressure.read.attach(0),
    )
    gl.uniform1f(
      clearProgram?.uniforms.value,
      config.PRESSURE,
    )
    blit(pressure.write)
    pressure.swap()

    // Pressure
    pressureProgram?.bind()
    gl.uniform2f(
      pressureProgram?.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    )
    gl.uniform1i(
      pressureProgram?.uniforms.uDivergence,
      divergence.attach(0),
    )

    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(
        pressureProgram?.uniforms.uPressure,
        pressure.read.attach(1),
      )
      blit(pressure.write)
      pressure.swap()
    }

    // Gradient Subtract
    gradienSubtractProgram?.bind()
    gl.uniform2f(
      gradienSubtractProgram?.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    )
    gl.uniform1i(
      gradienSubtractProgram?.uniforms.uPressure,
      pressure.read.attach(0),
    )
    gl.uniform1i(
      gradienSubtractProgram?.uniforms.uVelocity,
      velocity.read.attach(1),
    )
    blit(velocity.write)
    velocity.swap()

    // Advection
    advectionProgram?.bind()
    gl.uniform2f(
      advectionProgram?.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    )

    if (!ext.supportLinearFiltering) {
      gl.uniform2f(
        advectionProgram?.uniforms.dyeTexelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      )
    }

    const velocityId = velocity.read.attach(0)
    gl.uniform1i(advectionProgram?.uniforms.uVelocity, velocityId)
    gl.uniform1i(advectionProgram?.uniforms.uSource, velocityId)
    gl.uniform1f(advectionProgram?.uniforms.dt, dt)
    gl.uniform1f(
      advectionProgram?.uniforms.dissipation,
      config.VELOCITY_DISSIPATION,
    )
    blit(velocity.write)
    velocity.swap()

    if (!ext.supportLinearFiltering) {
      gl.uniform2f(
        advectionProgram?.uniforms.dyeTexelSize,
        dye.texelSizeX,
        dye.texelSizeY,
      )
    }

    gl.uniform1i(
      advectionProgram?.uniforms.uVelocity,
      velocity.read.attach(0),
    )
    gl.uniform1i(
      advectionProgram?.uniforms.uSource,
      dye.read.attach(1),
    )
    gl.uniform1f(
      advectionProgram?.uniforms.dissipation,
      config.DENSITY_DISSIPATION,
    )
    blit(dye.write)
    dye.swap()
  }

  function render(target: FBO | null) {
    if (!gl)
      return

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    drawDisplay(target)
  }

  function drawDisplay(target: FBO | null) {
    if (!dye || !displayMaterial)
      return

    const width = target === null ? gl?.drawingBufferWidth ?? 0 : target.width
    const height = target === null ? gl?.drawingBufferHeight ?? 0 : target.height

    displayMaterial.bind()

    if (config.SHADING) {
      gl?.uniform2f(
        displayMaterial.uniforms.texelSize,
        1.0 / width,
        1.0 / height,
      )
    }

    gl?.uniform1i(
      displayMaterial.uniforms.uTexture,
      dye.read.attach(0),
    )

    blit(target)
  }

  function splatPointer(pointer: Pointer) {
    const dx = pointer.deltaX * config.SPLAT_FORCE
    const dy = pointer.deltaY * config.SPLAT_FORCE
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color)
  }

  function splat(x: number, y: number, dx: number, dy: number, color: { r: number, g: number, b: number }) {
    if (!splatProgram || !velocity || !dye)
      return

    splatProgram.bind()
    gl?.uniform1i(
      splatProgram.uniforms.uTarget,
      velocity.read.attach(0),
    )
    gl?.uniform1f(
      splatProgram.uniforms.aspectRatio,
      canvas ? canvas.width / canvas.height : 1,
    )
    gl?.uniform2f(
      splatProgram.uniforms.point,
      x,
      y,
    )
    gl?.uniform3f(
      splatProgram.uniforms.color,
      dx,
      dy,
      0.0,
    )
    gl?.uniform1f(
      splatProgram.uniforms.radius,
      correctRadius(config.SPLAT_RADIUS / 100.0),
    )
    blit(velocity.write)
    velocity.swap()

    gl?.uniform1i(
      splatProgram.uniforms.uTarget,
      dye.read.attach(0),
    )
    gl?.uniform3f(
      splatProgram.uniforms.color,
      color.r,
      color.g,
      color.b,
    )
    blit(dye.write)
    dye.swap()
  }

  function correctRadius(radius: number): number {
    if (!canvas)
      return radius

    const aspectRatio = canvas.width / canvas.height
    if (aspectRatio > 1)
      return radius * aspectRatio
    return radius
  }

  function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number) {
    pointer.id = id
    pointer.down = true
    pointer.moved = false
    pointer.texcoordX = posX / (canvas?.width ?? 1)
    pointer.texcoordY = 1.0 - posY / (canvas?.height ?? 1)
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.deltaX = 0
    pointer.deltaY = 0
    pointer.color = generateColor()
  }

  function updatePointerMoveData(pointer: Pointer, posX: number, posY: number, color: { r: number, g: number, b: number }) {
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.texcoordX = posX / (canvas?.width ?? 1)
    pointer.texcoordY = 1.0 - posY / (canvas?.height ?? 1)
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX)
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY)
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
    pointer.color = color
  }

  function updatePointerUpData(pointer: Pointer) {
    pointer.down = false
  }

  function correctDeltaX(delta: number): number {
    if (!canvas)
      return delta

    const aspectRatio = canvas.width / canvas.height
    if (aspectRatio < 1)
      return delta * aspectRatio
    return delta
  }

  function correctDeltaY(delta: number): number {
    if (!canvas)
      return delta

    const aspectRatio = canvas.width / canvas.height
    if (aspectRatio > 1)
      return delta / aspectRatio
    return delta
  }

  function generateColor(): { r: number, g: number, b: number } {
    const c = HSVtoRGB(Math.random(), 1.0, 1.0)
    c.r *= 0.15
    c.g *= 0.15
    c.b *= 0.15
    return c
  }

  function HSVtoRGB(h: number, s: number, v: number): { r: number, g: number, b: number } {
    let r = 0
    let g = 0
    let b = 0
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)

    switch (i % 6) {
      case 0:
        r = v
        g = t
        b = p
        break
      case 1:
        r = q
        g = v
        b = p
        break
      case 2:
        r = p
        g = v
        b = t
        break
      case 3:
        r = p
        g = q
        b = v
        break
      case 4:
        r = t
        g = p
        b = v
        break
      case 5:
        r = v
        g = p
        b = q
        break
    }

    return { r, g, b }
  }

  function wrap(value: number, min: number, max: number): number {
    const range = max - min
    if (range === 0)
      return min
    return ((value - min) % range) + min
  }

  function getResolution(resolution: number): { width: number, height: number } {
    if (!canvas)
      return { width: resolution, height: resolution }

    const aspectRatio = canvas.width / canvas.height
    const min = Math.round(resolution)
    const max = Math.round(resolution * aspectRatio)

    if (canvas.width > canvas.height) {
      return { width: max, height: min }
    }
    return { width: min, height: max }
  }

  function scaleByPixelRatio(input: number): number {
    const pixelRatio = window.devicePixelRatio || 1
    return Math.floor(input * pixelRatio)
  }

  function hashCode(s: string): number {
    if (s.length === 0)
      return 0
    let hash = 0
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i)
      hash |= 0
    }
    return hash
  }

  // 事件处理函数
  const handleMouseDown = (e: MouseEvent) => {
    if (!canvas)
      return

    const pointer = pointers[0]
    const posX = scaleByPixelRatio(e.clientX - canvas.getBoundingClientRect().left)
    const posY = scaleByPixelRatio(e.clientY - canvas.getBoundingClientRect().top)

    updatePointerDownData(pointer, -1, posX, posY)
    splatPointer(pointer)
  }

  const handleFirstMouseMove = (e: MouseEvent) => {
    if (!canvas)
      return

    const pointer = pointers[0]
    const posX = scaleByPixelRatio(e.clientX - canvas.getBoundingClientRect().left)
    const posY = scaleByPixelRatio(e.clientY - canvas.getBoundingClientRect().top)

    // updateFrame()
    updatePointerMoveData(pointer, posX, posY, pointer.color)

    document.body.removeEventListener('mousemove', handleFirstMouseMove)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!canvas)
      return

    const pointer = pointers[0]
    const posX = scaleByPixelRatio(e.clientX - canvas.getBoundingClientRect().left)
    const posY = scaleByPixelRatio(e.clientY - canvas.getBoundingClientRect().top)

    updatePointerMoveData(pointer, posX, posY, pointer.color)
  }

  const handleFirstTouchStart = (e: TouchEvent) => {
    if (!canvas)
      return

    e.preventDefault()
    const touches = e.targetTouches
    const pointer = pointers[0]

    for (let i = 0; i < touches.length; i++) {
      const posX = scaleByPixelRatio(touches[i].clientX - canvas.getBoundingClientRect().left)
      const posY = scaleByPixelRatio(touches[i].clientY - canvas.getBoundingClientRect().top)

      updateFrame()
      updatePointerDownData(pointer, touches[i].identifier, posX, posY)
    }

    document.body.removeEventListener('touchstart', handleFirstTouchStart)
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (!canvas)
      return

    e.preventDefault()
    const touches = e.targetTouches
    const pointer = pointers[0]

    for (let i = 0; i < touches.length; i++) {
      const posX = scaleByPixelRatio(touches[i].clientX - canvas.getBoundingClientRect().left)
      const posY = scaleByPixelRatio(touches[i].clientY - canvas.getBoundingClientRect().top)

      updatePointerDownData(pointer, touches[i].identifier, posX, posY)
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!canvas)
      return

    e.preventDefault()
    const touches = e.targetTouches
    const pointer = pointers[0]

    for (let i = 0; i < touches.length; i++) {
      const posX = scaleByPixelRatio(touches[i].clientX - canvas.getBoundingClientRect().left)
      const posY = scaleByPixelRatio(touches[i].clientY - canvas.getBoundingClientRect().top)

      updatePointerMoveData(pointer, posX, posY, pointer.color)
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!canvas)
      return

    const touches = e.changedTouches
    const pointer = pointers[0]

    for (let i = 0; i < touches.length; i++) {
      updatePointerUpData(pointer)
    }
  }

  // 初始化WebGL和模拟
  initWebGL()

  // 添加事件监听器
  window.addEventListener('mousedown', handleMouseDown)
  document.body.addEventListener('mousemove', handleFirstMouseMove)
  window.addEventListener('mousemove', handleMouseMove)
  document.body.addEventListener('touchstart', handleFirstTouchStart, { passive: false })
  window.addEventListener('touchstart', handleTouchStart, { passive: false })
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('touchend', handleTouchEnd)

  // 启动动画循环
  lastUpdateTime = Date.now()
  updateFrame()

  onUnmounted(() => {
    // 移除事件监听器
    window.removeEventListener('mousedown', handleMouseDown)
    document.body.removeEventListener('mousemove', handleFirstMouseMove)
    window.removeEventListener('mousemove', handleMouseMove)
    document.body.removeEventListener('touchstart', handleFirstTouchStart)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)

    // 停止动画循环
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }

    // 清理WebGL资源
    if (gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  })
})
</script>

<template>
  <div class="pointer-events-none fixed left-0 top-0 z-50 bg-black">
    <canvas id="fluid" ref="canvasRef" class="h-screen w-screen" />

    <div class="fixed left-0 top-0 text-white">
      {{ fps }}
    </div>
  </div>
</template>
