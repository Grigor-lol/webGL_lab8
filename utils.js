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

// var linear = 0
// function updateLinear(event, ui) {
//     linear = ui.value
// }
// webglLessonsUI.setupSlider("#linear", {
// 	value: linear,
// 	slide: updateLinear,
// 	min: 0,
// 	max: 1,
// 	step: 0.001,
// 	precision: 3
// })
//
// var quadratic = 0
// function updateQuadratic(event, ui) {
//     quadratic = ui.value
// }
// webglLessonsUI.setupSlider("#quadratic", {
// 	value: quadratic,
// 	slide: updateQuadratic,
// 	min: 0,
// 	max: 0.25,
// 	step: 0.001,
// 	precision: 3
// })

var ambient = 0.1
function updateAmbient(event, ui) {
    ambient = ui.value
}
webglLessonsUI.setupSlider("#ambient", {
	value: ambient, 
	slide: updateAmbient, 
	min: 0, 
	max: 5, 
	step: 0.01, 
	precision: 2
})




function isPowerOf2(x) {
	return x && !(x & (x - 1))
}



