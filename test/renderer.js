import ipc from "../src/index.js"

const getNumberValue = () => {
	return parseInt(document.querySelector("#number").innerText, 10)
}

const setDisabled = (v) => {
	document.querySelector("#sync").disabled = v
	document.querySelector("#async").disabled = v
}

document.querySelector("#sync").onclick = () => {
	setDisabled(true)
	ipc.renderer.send("add-sync", getNumberValue())
	.then(num => {
		setDisabled(false)
		document.querySelector("#number").innerText = num
	})
}

document.querySelector("#async").onclick = () => {
	setDisabled(true)
	ipc.renderer.send("add-async", getNumberValue())
	.then(num => {
		setDisabled(false)
		document.querySelector("#number").innerText = num
	})
}
