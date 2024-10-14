
import TrainstationModel from "../models/TrainstationModel.js";
import TrainModel from "../models/TrainModel.js";

export async function createTrainstation(request) {
    await TrainstationModel.create({
        name: request.body.name,
        open_hour: request.body.open_hour,
        close_hour: request.body.close_hour,
        image: request.body.image,
    });
}

export async function getAllTrainstations() {
    return await TrainstationModel.find({ deletedAt: null });
}

export async function getTrainstation(request) {
    return await TrainstationModel.findById(request.params.id, null, { deletedAt: null });
}

export async function updateTrainstation(request) {
    let trainstation = TrainstationModel.findById(request.params.id)

    return await TrainstationModel.findByIdAndUpdate(request.params.id, {
        name: request.body.name ? request.body.name : trainstation.name,
        open_hour: request.body.open_hour ? request.body.open_hour : trainstation.open_hour,
        close_hour: request.body.close_hour ? request.body.close_hour : trainstation.close_hour,
        image: request.body.image ? request.body.image : trainstation.image,
    });
}

export async function deleteTrainstation(request) {
    const startStationTrains = await TrainModel.find({ start_station: request.params.id });
    const endStationTrains = await TrainModel.find({ end_station: request.params.id });

    startStationTrains.forEach((train) => {
        TrainModel.findByIdAndUpdate(train.id, {
            active: false,
        });
    });

    endStationTrains.forEach((train) => {
        TrainModel.findByIdAndUpdate(train.id, {
            active: false,
        });
    });
    
    return await TrainstationModel.findByIdAndUpdate(request.params.id, {
        deletedAt: Date.now(),
    });
}