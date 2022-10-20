class User{
    userId: string='';
    firstName:string='';
    lastName:string='';
    emailAddress:string='';
    password:string='';

    // Return true if all the properties are filled in
    CompleteUser()
    {
        if(this.userId.length > 0 && this.firstName.length > 0 && this.lastName.length > 0 && this.emailAddress.length > 0 && this.password.length > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    // Return a user without the password property
    GetPasswordlessUser()
    {
        let pwdLess = new User();
        Object.assign(pwdLess, this);
        let returnObj = <any>pwdLess;
        delete returnObj.password;
        return returnObj;
    }

    /*
     You can use this to skip returning the password property in the JSON calls
    
    toJSON()
    {
        return {
            userId: this.userId,
            firstName: this.firstName,
            lastName: this.lastName,
            emailAddress: this.emailAddress
        }
    }
    */
}

export {User};