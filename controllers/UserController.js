import bcrypt from "bcrypt";

import UserModel from "../models/UserModel.js";

export async function createUser(request) {
    // we create a new user via mongoose
	await UserModel.create({
		pseudo: request.body.pseudo,
		password: bcrypt.hashSync(request.body.password, 10), // we hash the user password
		email: request.body.email,
	});
}

export async function updateUser(request) {
    // we get the old user infos either with a given id or with the id inside the token
    let user = await UserModel.findById(request.params.id ? request.params.id : request.user.id);
    
    // we change the user of the given id or the logged user
    // if the data is not set in body, we use the old value
    return await UserModel.findByIdAndUpdate(request.params.id ? request.params.id : request.user.id, {
        pseudo: request.body.pseudo ? request.body.pseudo : user.pseudo,
        password: request.body.password ? bcrypt.hashSync(request.body.password, 10) : user.password,
        email: request.body.email ? request.body.email : user.email,
    });
}

export async function deleteUser(request) {
    // we soft delete the user of the given id or the logged user
    return await UserModel.findByIdAndUpdate(request.params.id ? request.params.id : request.user.id, {
        deletedAt: Date.now(),
    });
}

export async function getUser(request) {
    // we get the user of the id if not deleted
	return await UserModel.findById(request.params.id, null, { deletedAt: null });
}

export async function getAllUsers(request) {
    const sortQuery = request.query.sort ? request.query.sort.split(',') : []; // we get the sort query if set
    const limitQuery = request.query.limit ? parseInt(request.query.limit) : 10; // we get the limit query if set
    let users = UserModel.find({ deletedAt: null }); // we get all undeleted users

    if (sortQuery.length > 0) {
        let sortOptions = [];

        sortQuery.forEach((element) => {
            let sortOrder = 1;

            // we change the order of the sort if there is a - in front of the parameter
            if (element.startsWith('-')) {
                sortOrder = -1;
                element = element.substring(1);
            }

            // we check the following parameters
            if (["pseudo", "email", "role"].includes(element)) {
                sortOptions.push([element, sortOrder]);
            }
        });

        if (sortOptions.length > 0) {
            users.sort(sortOptions);
        }
    }

    if (limitQuery > 0) {
        users.limit(limitQuery);
    }
    
	return await users;
}

export async function login(request) {
	const user = await UserModel.findOne({ email: request.body.email });

    // we check if a user exist with the given email (the email is unique)
    if (!user) {
        return null;
    }

    const match = await bcrypt.compare(request.body.password, user.password);

    // we check the given password
    if (!match) {
        return null;
    }

    return user;
}

export async function setAdmin(request) {
    // we change the role of the user of the id to admin
    return await UserModel.findByIdAndUpdate(request.params.id, {
        role: "admin",
    });
}

export async function setEmployee(request) {
    // we change the role of the user of the id to employee
    return await UserModel.findByIdAndUpdate(request.params.id, {
        role: "employee",
    });
}

export async function setUser(request) {
    // we change the role of the user of the id to user
    return await UserModel.findByIdAndUpdate(request.params.id, {
        role: "user",
    });
}