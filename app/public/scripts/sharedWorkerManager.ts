
class sharedWorkerManager1 {
	
	private sharedWorker = false //typeof SharedWorker === 'function' ? true: false 
	private worker = this.makeWorker ()
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
		if ( this.sharedWorker ) {
			this.worker["port"].addEventListener ( "message", e => {
				return this.catchReturn ( e.data )
			}, false )
			
			this.worker["port"].start()
		} else {
			this.worker['onmessage'] = e => {
				return this.catchReturn ( e.data )
			}
		}
		
	}

	private emitCommand ( cmd: sharedWorkerCommand, CallBack ) {
		this.sharedMainWorkerWaitingPool.set ( cmd[ "uuid" ] = uuid_generate (), CallBack )
		const cmdStream = Buffer.from ( JSON.stringify ( cmd ))
		if ( this.sharedWorker ) {
			this.worker["port"].postMessage ( cmdStream.buffer, [ cmdStream.buffer ])
		} else {
			this.worker["postMessage"] ( cmdStream.buffer, [ cmdStream.buffer ])
		}
		
		if ( cmd.command === "decrypt_withLocalServerKey" ) {
			console.dir ( this.sharedMainWorkerWaitingPool )
		}

	}

	public checkKeypairPassword ( keypair: keypair, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'checkPassword',
			args: keypair
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public getKeyInfo_Daggr ( keypair, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'getKeyInfo_Daggr',
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

	public encryptStream_withMyPublicKey ( message: Buffer, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'encryptStream_withMyPublicKey',
			args: message
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

	public getHistoryTable ( CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'getHistoryTable'
		}
		return this.emitCommand ( cmd, CallBack )
	}

	public saveHistoryTable ( data, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'saveHistoryTable',
			args: data
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

	public unzipHTML ( uuid: string, base64: string, Callback ) {
		const cmd: sharedWorkerCommand = {
			command: 'unzipHTML',
			args: [ uuid, base64 ]
		}
		return this.emitCommand ( cmd, Callback )
	}

	public decryptStreamWithoutPublicKey ( message, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'decryptStreamWithoutPublicKey',
			args: message
		}
		return this.emitCommand ( cmd, CallBack )
	}

	private makeWorker () {
		if ( this.sharedWorker ) {
			return new SharedWorker ( this.sharedPath )
		}
		return new Worker ( this.sharedPath )
	}

	

	private saveFileBlock ( uuid: string, buffer: string, CallBack ) {
		const cmd: sharedWorkerCommand = {
			command: 'decryptStreamWithAPKeyAndUnZIP',
			args: [ uuid, buffer ]
		}
		return this.emitCommand ( cmd, CallBack )
	}

	

}

const getKeyInfo1 = async ( privateKey: string, passwd: string, CallBack: ( err?: Error, data? ) => void ) => {

	const _privateKey = await openpgp.readKey({ armoredKey: privateKey })
	
	const ret = {
		createDate: _privateKey.keyPacket.created.toISOString(),
		verified: false,
		keyid: _privateKey.getFingerprint().substr ( 24 )
	}
	
	if ( passwd ) {
		return _privateKey.decrypt ( passwd ).then ( keyOK => {
			//console.log (`privateKey1.decrypt then keyOK [${ keyOK }] didCallback [${ didCallback }]`)
			ret.verified = true
			return CallBack ( null, ret )
		}).catch ( ex => {
			return CallBack ( null, ret )
		}) 
	}

	return CallBack ( null, ret )
	
}
const kloakPublicArmor = `
-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEYF/6PRYJKwYBBAHaRw8BAQdATMNoTXLMBPzVgMcgwDIJT42QkNuOOwjRLpHF
K2q58la0G1NFR1VSTyA8aW5mb0BnZXRTRUdVUk8uY29tPoiPBBAWCgAgBQJgX/o9
BgsJBwgDAgQVCAoCBBYCAQACGQECGwMCHgEAIQkQvJNMcTPisIgWIQQUTeA25O28
akPm5lO8k0xxM+KwiBVMAP9cMr1pIHb8OHDNU8mW/lfD+YUVH6Qt3xJXSZvw+JUa
gAEAo+chcb5+h3SYwO7El/etUu3z+VKBaVDc1RvMzeHuug64OARgX/o9EgorBgEE
AZdVAQUBAQdAAAPmwSs9MVXDEx+c8HB0KRp7OxIGq1RswnQv/GSrbTcDAQgHiHgE
GBYIAAkFAmBf+j0CGwwAIQkQvJNMcTPisIgWIQQUTeA25O28akPm5lO8k0xxM+Kw
iEJ8AP9i3ZyodVd7wUnI8e1zuMO4hfImjsXMfp28qXQ6yBHHLQEApdtrLmxHEbwm
iUatG/EQn9VLAanhlsOMmZApsHnIxwc=
=u6x5
-----END PGP PUBLIC KEY BLOCK-----
`
class sharedWorkerManager {
	
	constructor ( private sharedPath: string ) {}

	public async NewKeyPair ( sendData: INewKeyPair, CallBack ) {
		const userId = {
			name: sendData.nikeName,
			email: sendData.email
		}
		const option = {
			passphrase: sendData.password,
			userIds: [ userId ],
			curve: "ed25519",
			aead_protect: false,
			//aead_protect_version: 4
		}

		const option1 = {
			userIds: [{
				name: '',
				email: ''
			}],
			curve: "ed25519",
			aead_protect: false,
			//aead_protect_version: 4
		}

		const keypair: keyInfo = {
			kloak_keyid: null,
			kloak_publickey_armor: null,
			kloak_privatekey_armor: null,
			device_keyid: null,
			device_publickey_armor: null,
			device_privatekey_armor: null,
			_password: sendData.password
			
		}
	
		return openpgp.generateKey ( option ).then (( data ) => {
			keypair.device_privatekey_armor = data.privateKeyArmored
			keypair.device_publickey_armor = data.publicKeyArmored
			return openpgp.generateKey ( option1 ).then (( data ) => {
				keypair.kloak_privatekey_armor = data.privateKeyArmored
				keypair.kloak_publickey_armor = data.publicKeyArmored
				return getKeyInfo1 ( keypair.device_privatekey_armor, sendData.password, ( err, data ) => {
					keypair.device_keyid = data.keyid
					return getKeyInfo1 ( keypair.kloak_privatekey_armor, null,  ( err, data ) => {
						keypair.kloak_keyid = data.keyid
						return CallBack ( null, keypair )
					})
				})
			})
		})
	}

	public checkKeypairPassword ( keypair: keyInfo, CallBack ) {
		return getKeyInfo1 ( keypair.device_privatekey_armor, keypair._password, CallBack )
	}

	public async encryptByKloak ( clearText: string, signPrivatekeyArmor: string, passwd: string, CallBack ) {
		const option = {
			privateKeys: await openpgp.readKey({ armoredKey: signPrivatekeyArmor }),
			publicKeys: await openpgp.readKey({ armoredKey: kloakPublicArmor }),
			message: await openpgp.Message.fromText( clearText ),
			compression: openpgp.enums.compression.zip
		}
		if ( passwd ) {
			await option.privateKeys.decrypt( passwd )
		}
		return openpgp.encrypt ( option ).then ( n => {
			return CallBack ( null, n.data )
		}).catch ( ex => {
			return CallBack ( 'systemError' )
		})
	}

}