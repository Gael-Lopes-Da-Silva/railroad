import bcrypt from "bcrypt";

import UserModel from "../models/UserModel.js";

export async function createUser(pseudo, email, password) {
	const hash = bcrypt.hashSync(password, 10);

	await UserModel.create({
		pseudo: pseudo,
		password: hash,
		email: email,
	});
}

export async function updateUser(id, pseudo, email, password) {
	const hash = bcrypt.hashSync(password, 10);

	await UserModel.findByIdAndUpdate(id, {
		pseudo: pseudo,
		password: hash,
		email: email,
	});
}

export async function deleteUser(id) {
	await UserModel.findByIdAndUpdate(id, {
		deletedAt: Date.now(),
	});
}

export async function getUser(id) {
	const user = await UserModel.findById(id);
	return user;
}

export async function getAllUsers() {
	const users = await UserModel.find({ deletedAt: null });
	return users;
}

export async function login(email, password) {
	const user = await UserModel.findOne({ email: email });

    if (!user) {
        return false;
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return false;
    }

    return user;
}