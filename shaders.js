const VS_SOURCE =
					`attribute vec3 aVertexPosition;
					attribute vec3 aVertexNormal;
					
					uniform mat4 uModelMatrix;
					uniform mat4 uViewMatrix;
					uniform mat4 uProjectionMatrix;
					
					uniform float uLinear;
					uniform float uQuadratic;
					
					uniform vec3 uLightPosition;
					
					varying vec3 normal;
					varying vec3 lightDirection;
					varying vec3 viewVectorEye;
					
					varying float attenuation;
					
					attribute vec2 aTextureCoord;
					varying highp vec2 vTextureCoord;
					
					void main(void) {
						mat4 mvMatrix = uViewMatrix * uModelMatrix;
						gl_Position = uProjectionMatrix * mvMatrix * vec4(aVertexPosition, 1);
						vTextureCoord = aTextureCoord;
						
						float distance = length(vec4(uLightPosition,1) - gl_Position);
						attenuation = 1.0 / (1.0 + uLinear*distance + uQuadratic*distance*distance);
						
						normal = normalize(mat3(mvMatrix) * aVertexNormal);
						
						vec4 vertexPositionEye4 = mvMatrix * vec4(aVertexPosition, 1.0);
						vec3 vertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;
						lightDirection = normalize(uLightPosition - vertexPositionEye3);
						
						viewVectorEye = -normalize(vertexPositionEye3);
					}`

const FS_SOURCE =
					`precision highp float;
					uniform vec4 uColor;
					
					uniform vec3 uAmbientLightColor;
					uniform vec3 uDiffuseLightColor;
					uniform vec3 uSpecularLightColor; 
					
					varying vec3 normal;
					varying vec3 lightDirection;
					varying vec3 viewVectorEye;
					
					varying float attenuation;
					
					const float shininess = 100.0;
					
					uniform sampler2D uSamplerNum;
					varying vec2 vTextureCoord;
					
					void main() {
						float tCS = 0.011111;
						vec3 xM = texture2D(uSamplerNum, vec2(vTextureCoord.x - tCS, vTextureCoord.y)).xyz;
						vec3 xP = texture2D(uSamplerNum, vec2(vTextureCoord.x + tCS, vTextureCoord.y)).xyz;
						vec3 yM = texture2D(uSamplerNum, vec2(vTextureCoord.x, vTextureCoord.y - tCS)).xyz;
						vec3 yP = texture2D(uSamplerNum, vec2(vTextureCoord.x, vTextureCoord.y + tCS)).xyz;
						
						vec3 xGradient = xM - xP;
						vec3 yGradient = yM - yP;
						
						vec3 normal2 = normal + vTextureCoord.x * xGradient + vTextureCoord.y * yGradient;
						//vec3 normal2 = normal + vec3(xGradient.x, yGradient.y, normal.z);
						
						float diffuseLightDot = max(dot(normal2, lightDirection), 0.0);
						
						vec3 reflectionVector = normalize(reflect(-lightDirection, normal2));
						
						float specularLightDot = max(dot(reflectionVector, viewVectorEye), 0.0);
						float specularLightParam = pow(specularLightDot, shininess);

						vec3 vLightWeighting = (uAmbientLightColor + uDiffuseLightColor * diffuseLightDot + uSpecularLightColor * specularLightParam) * attenuation;
						gl_FragColor = vec4(uColor.rgb, uColor.a);
						gl_FragColor.rgb *= vLightWeighting;
					}`