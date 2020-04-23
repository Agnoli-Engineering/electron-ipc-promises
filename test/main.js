import electron from "electron"
import path from "path"

import ipc from "../src/index.js"

ipc.main.on("add-sync", num => {
	console.log(num)
	return num + 1
})

ipc.main.on("add-async", num => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(num + 1)
		}, 2000)
	})
})

electron.app.whenReady()
.then(() => {
	let win = new electron.BrowserWindow({
		webPreferences: {
			nodeIntegration: true
		}
	})

	win.loadURL("file://" + path.resolve(__dirname, "index.html"))
	win.openDevTools()
})
