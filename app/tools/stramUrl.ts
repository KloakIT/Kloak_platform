import * as Stream from 'stream'

export default class streamUrl extends Stream.Transform {
	constructor () {
		super ()
	}

	public _transform ( chunk, encode, next ) {
		next ()
	}
}