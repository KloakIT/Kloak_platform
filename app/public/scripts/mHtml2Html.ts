self.onmessage = evt => {
	const jsonData =  Buffer.from ( evt.data, 'base64').toString()
	let data = null
	try {
		data = JSON.parse ( jsonData )
	} catch ( ex ) {
		return new EvalError (``)
	}
	console.log ( evt )
	data.data = converts
	return self.postMessage ( data )
}

const converts = ( mhtml: string ) => {

}