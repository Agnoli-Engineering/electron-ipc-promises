import electron from "electron"
import getInstance from "./getInstance.js"
import getRandomString from "./util/getRandomString.js"
import isMainProcess from "./util/isMainProcess.js"

/**
 * Table where the Promise resolve functions
 * are stored.
 */
let table = {}

/**
 * getInstance() automatically returns the
 * correct ipc instance for the calling process (main or renderer).
 *
 * This event handler is automatically installed:
 * It runs the corresponding Promise resolve function when a
 * `message-received` event is received.
 */
getInstance().on("message-received", (_, ctx) => {
	const msgId   = ctx.msgId
	const payload = ctx.payload
	const resolve = table[msgId]
	delete table[msgId]

	resolve(payload)
})

/**
 * Make send() return a Promise.
 * Save the Promise resolve function in `table` to
 * call it later when `message-received` is received.
 */
let patched_send = function(sendFn, channel, payload) {
	return new Promise(resolve => {
		const msgId = getRandomString()
		table[msgId] = resolve

		sendFn(channel, {msgId, payload})
	})
}

/**
 * Make .on() automatically send `message-received` to
 * sender after handler `fn` was run.
 */
let patched_on = function(channel, fn) {
	getInstance().on(channel, (e, data) => {
		const msgId   = data.msgId

		const reply = (payload) => {
			e.sender.send("message-received", {msgId, payload})
		}

		const response = fn(data.payload)

		if (response instanceof Promise) {
			response.then(reply)
		} else {
			reply(response)
		}
	})
}

const obj_main = {
	on: patched_on,
	send(win, channel, data) {
		return patched_send((...args) => {
			win.webContents.send(...args)
		}, channel, data)
	},
	broadcast(windows, channel, data) {
		return Promise.all(windows.map(win => {
			return patched_send((...args) => {
				win.webContents.send(...args)
			}, channel, data)
		}))
	}
}

const obj_renderer = {
	on: patched_on,
	send(channel, data) {
		return patched_send(electron.ipcRenderer.send, channel, data)
	}
}

let obj = {}

Object.defineProperty(obj, "main", {
	get() {
		if (!isMainProcess()) {
			throw new Error("ipc.main can only be accessed in the main process.")
		}

		return obj_main
	}
})

Object.defineProperty(obj, "renderer", {
	get() {
		if (isMainProcess()) {
			throw new Error("ipc.renderer can only be accessed in a renderer process.")
		}

		return obj_renderer
	}
})

export default obj
