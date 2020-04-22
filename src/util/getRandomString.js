export default function() {
	let ret = ""

	for (let i = 0; i < 4; ++i) {
		ret += Math.random().toString(32).substr(2)
	}

	return ret
}
