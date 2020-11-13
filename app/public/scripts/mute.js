const userArray = [{
        name: "Peter Xie",
        keyID: '',
        src: ''
    }];
class mute {
    constructor() {
        this.userList = ko.observableArray(userArray);
        this.showAddUser = ko.observable(false);
        this.addUser_name = ko.observable('');
        this.addUser_keyID = ko.observable('');
        this.showPublicKey = ko.observable(false);
        this.showPrivateKey = ko.observable(false);
    }
    addUser() {
        this.userList.unshift({
            name: this.addUser_name(),
            keyID: this.addUser_keyID(),
            src: ''
        });
        this.addUser_keyID('');
        this.addUser_name('');
        this.showAddUser(false);
    }
}
