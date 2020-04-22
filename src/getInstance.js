import isMainProcess from "./util/isMainProcess.js"
import main from "./main.js"
import renderer from "./renderer.js"

export default function() {
	return isMainProcess() ? main : renderer
}
