import electron from "electron"

export default {
	_name: "main",

	on(channel, fn) {
		electron.ipcMain.on(channel, fn)
	},

	send(win, channel, data) {
		win.webContents.send(channel, data)
	}
}
