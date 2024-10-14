import bcrypt from "bcrypt";

import UserModel from "../models/UserModel.js";

export async function createUser(request) {
	await UserModel.create({
		pseudo: request.body.pseudo,
		password: bcrypt.hashSync(request.body.password, 10),
		email: request.body.email,
	});
}

export async function updateUser(request) {
    let user = UserModel.findById(request.params.id ? request.params.id : request.user.id);
    
    return await UserModel.findByIdAndUpdate(request.params.id ? request.params.id : request.user.id, {
        pseudo: request.body.pseudo ? request.body.pseudo : user.pseudo,
        password: request.body.password ? bcrypt.hashSync(request.body.password, 10) : user.password,
        email: request.body.email ? request.body.email : user.email,
    });
}

export async function deleteUser(request) {    
    return await UserModel.findByIdAndUpdate(request.params.id ? request.params.id : request.user.id, {
        deletedAt: Date.now(),
    });
}

export async function getUser(request) {
	return await UserModel.findById(request.params.id, null, { deletedAt: null });
}

export async function getAllUsers(request) {
    const sortQuery = request.query.sort ? request.query.sort.split(',') : [];
    const limitQuery = request.query.limit ? parseInt(request.query.limit) : 10;
    let users = UserModel.find({ deletedAt: null });

    if (sortQuery.length > 0) {
        let sortOptions = [];

        sortQuery.forEach((element) => {
            let sortOrder = 1;

            if (element.startsWith('-')) {
                sortOrder = -1;
                element = element.substring(1);
            }

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

    if (!user) {
        return null;
    }

    const match = await bcrypt.compare(request.body.password, user.password);

    if (!match) {
        return null;
    }

    return user;
}

export async function setAdmin(request) {
    return await UserModel.findByIdAndUpdate(request.params.id, {
        role: "admin",
    });
}

export async function setEmployee(request) {
    return await UserModel.findByIdAndUpdate(request.params.id, {
        role: "employee",
    });
}

export async function setUser(request) {
    return await UserModel.findByIdAndUpdate(request.params.id, {
        role: "user",
    });
}