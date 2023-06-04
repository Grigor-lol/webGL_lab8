const d = 0
const size = 0.5
var rate = 60
var pressed = {}

this.addEventListener('keyup', event => {
	if (event.code == "KeyQ") pressed["KeyQ"] = false
	else if (event.code == "KeyE") pressed["KeyE"] = false
	else if (event.code == "KeyA") pressed["KeyQ"] = false
	else if (event.code == "KeyD") pressed["KeyE"] = false
})
this.addEventListener('keydown', event => {
	if (event.code == "KeyQ") pressed["KeyQ"] = true
	else if (event.code == "KeyE") pressed["KeyE"] = true
	else if (event.code == "KeyA") pressed["KeyQ"] = true
	else if (event.code == "KeyD") pressed["KeyE"] = true
})


var ambient = 0.27
function updateAmbient(event, ui) {
    ambient = ui.value
}
webglLessonsUI.setupSlider("#ambient", {
	value: ambient, 
	slide: updateAmbient, 
	min: 0, 
	max: 1,
	step: 0.01, 
	precision: 2
})

var shininess = 50.0
function updateShininess(event, ui) {
	shininess = ui.value
}
webglLessonsUI.setupSlider("#shininess", {
	value: shininess,
	slide: updateShininess,
	min: 1,
	max: 100,
	step: 0.01,
	precision: 2
})




