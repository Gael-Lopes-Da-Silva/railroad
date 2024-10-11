import TrainModel from "../models/TrainModel.js";
import TrainstationModel from "../models/TrainstationModel.js";

export async function createTrain(request) {
    const start_station = TrainstationModel.findById(request.body.start_station, { deletedAt: null });
    const end_station = TrainstationModel.findById(request.body.end_station, { deletedAt: null });
    
    if (!start_station || !end_station) {
        return null;
    }
    
    return await TrainModel.create({
        name: request.body.name,
        start_station: request.body.start_station,
        end_station: request.body.end_station,
        departure_time: request.body.departure_time,
    });
}

export async function getAllTrains() {
    return await TrainModel.find({ deletedAt: null });
}

export async function getTrain(request) {
    return await TrainModel.findById(request.params.id, null, { deletedAt: null });
}

export async function updateTrain(request) {
    return await TrainModel.findByIdAndUpdate(request.params.id, {
        name: request.params.name,
        start_station: request.params.start_station,
        end_station: request.params.end_station,
        departure_time: request.params.departure_time,
    });
}

export async function deleteTrain(request) {
    return await TrainModel.findByIdAndUpdate(request.params.id, {
        deletedAt: Date.now(),
    });
}

export async function activateTrain(request) {
    return await TrainModel.findByIdAndUpdate(request.params.id, {
        active: true,
    });
}

export async function deactivateTrain(request) {
    return await TrainModel.findByIdAndUpdate(request.params.id, {
        active: false,
    });
}