function getShader(type, src) {
	let shader = gl.createShader(type)
	gl.shaderSource(shader, src)
	gl.compileShader(shader)
	return shader
}

function initShaders() {
	let VS = getShader(gl.VERTEX_SHADER, VS_SOURCE)
	let FS = getShader(gl.FRAGMENT_SHADER, FS_SOURCE)

	shaderProgram = gl.createProgram()
	gl.attachShader(shaderProgram, VS)
	gl.attachShader(shaderProgram, FS)
	gl.linkProgram(shaderProgram)
	gl.useProgram(shaderProgram)
	
	if (!gl.getShaderParameter(FS, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(FS));
	}
}

function handleTextureLoaded(image, texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
}



function registerTexture(imgSRC) {
	let texture = gl.createTexture();
	let image = new Image();
	image.onload = function () {
		handleTextureLoaded(image, texture);
	}
	image.src = imgSRC;
	return texture
}

function webGLStart() {
	let canvas = document.getElementById("canvasGL")
	canvas.width = 1200
	canvas.height = 1200

	gl = canvas.getContext("webgl", {antialias: false})
	
	initShaders()
	
	gl.enable(gl.DEPTH_TEST)
	
	model = mat4.translate(mat4.create(), mat4.create(), [0, -0.3, 0])
	
	bumpTexture = registerTexture("textures/orange.jpg")
	
	view = mat4.rotateY(mat4.create(), mat4.rotateX(mat4.create(), mat4.create(), d), d)
	
	let last = 0
	requestAnimationFrame(render)
	
	function render(now) {
		if (now - last < 1000/rate) { 
			requestAnimationFrame(render)
			return
		}
		
		if (pressed["KeyQ"] || pressed["KeyE"]) {
			let angle = Math.PI/rate
			if (pressed["KeyE"] || pressed["KeyD"]) angle *= -1
			mat4.mul(model, mat4.rotateY(mat4.create(), mat4.create(), angle), model)
		}
		
		gl.clearColor(1, 1, 1, 1)
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

		draw(size, [1, 0.5, 0], bumpTexture, model, view, mat4.create())
		
		last = now
		requestAnimationFrame(render)
	}
}

function draw(s, color, bumpTexture, modelMatrix, viewMatrix, projectionMatrix) {
	let vertexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices.map(x => x * s)), gl.STATIC_DRAW)
	
	let verticesIndexBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticesIndexBuffer)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW)
	
	let aVertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
	gl.enableVertexAttribArray(aVertexPosition)
	gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 12, 0)
	
	let uColor = gl.getUniformLocation(shaderProgram, 'uColor')
	gl.uniform4f(uColor, color[0], color[1], color[2], 1)

	initMatrix(modelMatrix, viewMatrix, projectionMatrix)
	
	initLight()
	
	initTextures(bumpTexture)
	
	gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0)
}

function initMatrix(modelMatrix, viewMatrix, projectionMatrix) {
	let uModelMatrix = gl.getUniformLocation(shaderProgram, 'uModelMatrix')
	let uViewMatrix = gl.getUniformLocation(shaderProgram, 'uViewMatrix')
	let uProjectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
	
	gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix)
	gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix)
	gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix)
}

function initLight() {
	let uLightPosition = gl.getUniformLocation(shaderProgram, 'uLightPosition')
	let uAmbientLightColor = gl.getUniformLocation(shaderProgram, 'uAmbientLightColor')
	let uDiffuseLightColor = gl.getUniformLocation(shaderProgram, 'uDiffuseLightColor')
	let uSpecularLightColor = gl.getUniformLocation(shaderProgram, 'uSpecularLightColor')
	let uShineness = gl.getUniformLocation(shaderProgram, 'shininess')


	gl.uniform1f(uShineness,shininess)
	gl.uniform3fv(uLightPosition, [0.0, -0.5, -5.0])
	gl.uniform3fv(uAmbientLightColor, [ambient, ambient, ambient])
	gl.uniform3fv(uDiffuseLightColor, [0.7, 0.7, 0.7])
	gl.uniform3fv(uSpecularLightColor, [1.0, 1.0, 1.0])
	
	let uLinear = gl.getUniformLocation(shaderProgram, 'uLinear')
	let uQuadratic = gl.getUniformLocation(shaderProgram, 'uQuadratic')
	gl.uniform1f(uLinear, linear)
	gl.uniform1f(uQuadratic, quadratic)
	
	let normalBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW)

	let aVertexNormal = gl.getAttribLocation(shaderProgram, 'aVertexNormal')
	gl.enableVertexAttribArray(aVertexNormal)
	gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 12, 0)
}

function initTextures(texture) {
	let textureCoordBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW)
	
	let aTextureCoord = gl.getAttribLocation(shaderProgram, 'aTextureCoord')
	gl.enableVertexAttribArray(aTextureCoord)
	gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 0, 0)
	
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, texture)
	
	let uSamplerNum = gl.getUniformLocation(shaderProgram, 'uSamplerNum')
	gl.uniform1i(uSamplerNum, 0)
}

