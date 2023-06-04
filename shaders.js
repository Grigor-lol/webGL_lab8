const VS_SOURCE =
					`attribute vec3 aVertexPosition;
					attribute vec3 aVertexNormal;
					attribute vec2 aTextureCoord;
					
					uniform mat4 uModelMatrix;
					uniform mat4 uViewMatrix;
					uniform mat4 uProjectionMatrix;
					
					
					uniform vec3 uLightPosition;
					
					varying vec3 normal;
					varying vec3 lightDirection;
					varying vec3 viewVectorEye;
					
					
					varying highp vec2 vTextureCoord;
					
					void main(void) {
						mat4 mvMatrix = uViewMatrix * uModelMatrix;
						gl_Position = uProjectionMatrix * mvMatrix * vec4(aVertexPosition, 1);
						vTextureCoord = aTextureCoord;	
						
						normal = normalize(mat3(mvMatrix) * aVertexNormal);
						
						vec4 vertexPositionEye4 = mvMatrix * vec4(aVertexPosition, 1.0);
						vec3 vertexPositionEye3 = vertexPositionEye4.xyz / vertexPositionEye4.w;
						lightDirection = normalize(uLightPosition - vertexPositionEye3);
						
						viewVectorEye = normalize(viewVectorEye - vertexPositionEye3);
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
					
					
					uniform float shininess;
					
					uniform sampler2D uSamplerNum;
					varying vec2 vTextureCoord;
					
					void main() {
						vec3 normalMap = normal + texture2D(uSamplerNum, vTextureCoord).rgb;
						
						vec3 newNormal =  normalize(normalMap * 2.0 - 1.0);
						vec3 normLightDirection = normalize(lightDirection);
						
						float diffuseVal = max(dot(newNormal, normLightDirection), 0.0);
						float specular = 0.0;
						
					    vec3 reflected = normalize(reflect(-normLightDirection, newNormal));      
					    vec3 normViewVectorEye = normalize(-viewVectorEye); 
					    
					    float specAngle = max(dot(reflected, normViewVectorEye), 0.0);
					    specular = pow(specAngle, shininess);
						
						vec3 vLightWeighting = uAmbientLightColor +
										  diffuseVal * uDiffuseLightColor +
										  specular * uSpecularLightColor;
						gl_FragColor = vec4(uColor.rgb, uColor.a);
						gl_FragColor.rgb *= vLightWeighting;
						
					}`
