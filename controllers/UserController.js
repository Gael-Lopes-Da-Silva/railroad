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
    if (request.params.id == request.user.id) {
        return await UserModel.findByIdAndUpdate(request.params.id, {
            pseudo: request.body.pseudo,
            password: bcrypt.hashSync(request.body.password, 10),
            email: request.body.email,
        });
    }

    return null;
}

export async function deleteUser(request) {
    if (request.params.id == request.user.id) {
        return await UserModel.findByIdAndUpdate(request.params.id, {
            deletedAt: Date.now(),
        });
    }

    return null;
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