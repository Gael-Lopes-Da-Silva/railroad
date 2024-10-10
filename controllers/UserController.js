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
    if (request.params.id) {
        return await UserModel.findByIdAndUpdate(request.params.id, {
            pseudo: request.body.pseudo,
            password: bcrypt.hashSync(request.body.password, 10),
            email: request.body.email,
        });
    }

    return await UserModel.findByIdAndUpdate(request.user.id, {
        pseudo: request.body.pseudo,
        password: bcrypt.hashSync(request.body.password, 10),
        email: request.body.email,
    });
}

export async function deleteUser(request) {
    if (request.params.id) {
        return await UserModel.findByIdAndUpdate(request.params.id, {
            deletedAt: Date.now(),
        });
    }
    
    return await UserModel.findByIdAndUpdate(request.user.id, {
        deletedAt: Date.now(),
    });
}

export async function getUser(request) {
	return await UserModel.findById(request.params.id, { deletedAt: null });
}

export async function getAllUsers() {
	return await UserModel.find({ deletedAt: null });
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