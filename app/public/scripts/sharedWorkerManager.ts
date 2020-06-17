
class sharedWorkerManager {
	private worker = new SharedWorker ( this.sharedPath )
	public sharedMainWorkerWaitingPool: Map< string, ( err?: Error, cmd? ) => void > = new Map ()

	private catchReturn ( messageData: string ) {
		const jsonData = Buffer.from ( messageData ).toString()
		let cmd : sharedWorkerCommand = null
		try {
			cmd = JSON.parse ( jsonData )
		} catch ( ex ) {
			return console.dir ( ex )
		}
		const getCallBack = this.sharedMainWorkerWaitingPool.get ( cmd.uuid )

		if ( !getCallBack ) {
			console.dir ( cmd )
			console.dir ( this.sharedMainWorkerWaitingPool )
			return console.dir ( `catch unknow UUID sharedMainWorker Return: ${ cmd.uuid } `)
		}
		this.sharedMainWorkerWaitingPool.delete ( cmd.uuid )
		if ( cmd.error ) {
			return getCallBack ( new Error ( cmd.error ))
		}

		return getCallBack ( null, cmd.args )
	}

	constructor ( private sharedPath: string ) {
		this.worker.port.addEventListener ( "message", e => {
			return this.catchReturn ( e.data )
		}, false )
		this.worker.port.start()
	}

	private emitCommand ( cmd: sharedWorkerCommand, CallBack ) {
		this.sharedMainWorkerWaitingPool.set ( cmd[ "uuid" ] = uuid_generate (), CallBack )
		const cmdStream = Buffer.from ( JSON.stringify ( cmd ))
		this.worker.port.postMessage ( cmdStream.buffer, [ cmdStream.buffer ])
		if ( cmd.command === "decrypt_withLocalServerKey" ) {
			console.dir ( this.sharedMainWorkerWaitingPool )
		}
		return //console.dir ( cmd )

	}

	public checkKeypairPassword ( keypair: keypair, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'checkPassword',
			args: keypair
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public getKeyPairInfo ( keypair, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'getKeyInfo',
			args: keypair
		}

		return this.emitCommand ( cmd, CallBack )
	}

	public NewKeyPair ( sendData: INewKeyPair, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'NewKeyPair',
			args: sendData
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public localSeverPublicKey ( publicKey: string, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'localSeverPublicKey',
			args: publicKey
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public encrypto_withNodeKey ( message: string, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'encryptedWithNodePublicKey',
			args: message
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public encrypto_withLocalServerKey ( command: any, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'encrypto_withLocalServerKey',
			args: JSON.stringify ( command )
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public encryptedWithAccessPointKey ( command: any, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'encryptedWithAccessPointPublicKey',
			args: JSON.stringify ( command )
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public decrypt_withLocalServerKey ( message: string, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'decrypt_withLocalServerKey',
			args: message
		}
		
		return this.emitCommand ( cmd, CallBack )
	}

	public decryptJsonWithAPKey ( message, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'decryptTextWithNodeAPIKey',
			args: message
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public decryptStreamWithAPKey ( message, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'decryptStreamWithAPKey',
			args: message
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public saveImapIInputData ( imap: IinputData, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'saveImapIInputData',
			args: imap
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public decryptStreamWithAPKeyAndUnZIP ( uuid: string, message: string, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'decryptStreamWithAPKeyAndUnZIP',
			args: [ uuid, message ]
		}
		return this.emitCommand ( cmd, CallBack )
	}
}