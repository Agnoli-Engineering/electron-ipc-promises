# electron-ipc-promises (0.0.2)

Electron's IPC with Promises:

### Main Process:

```javascript
import ipc from "electron-ipc-promises"

ipc.main.on("add-sync", num => {
	return num + 1
})

ipc.main.on("add-async", num => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(num + 1)
		}, 2000)
	})
})
```

### Renderer Process:
```javascript
import ipc from "electron-ipc-promises"

ipc.renderer.send("add-sync", 3)
.then(result => {
	console.log(result) // 4
})

ipc.renderer.send("add-async", 3)
.then(result => {
	console.log(result) // 4 after 2 seconds
})
```

Same thing goes the other way around too (from main to renderer).


### Installation

`$ npm install --save electron-ipc-promises`

or ...

`$ yarn add electron-ipc-promises`