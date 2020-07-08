const userArray = [{
	name: "Peter Xie",
	keyID: '',
	src: ''

}]

class mute {
	public userList = ko.observableArray ( userArray )
	public showAddUser = ko.observable ( false )
	public addUser_name = ko.observable ('')
	public addUser_keyID = ko.observable ('')
	public showPublicKey = ko.observable ( false )
	public showPrivateKey = ko.observable ( false )
	public addUser () {
		this.userList.unshift ({
			name: this.addUser_name(),
			keyID: this.addUser_keyID(),
			src: ''
		})
		this.addUser_keyID('')
		this.addUser_name('')
		this.showAddUser ( false )
	}
	constructor () {

	}
}