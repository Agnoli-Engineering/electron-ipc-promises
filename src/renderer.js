import electron from "electron"

export default {
	_name: "renderer",

	on(channel, fn) {
		electron.ipcRenderer.on(channel, fn)
	},

	send(channel, data) {
		electron.ipcRenderer.send(channel, data)
	}
}
