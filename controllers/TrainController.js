import TrainModel from "../models/TrainModel.js";

export async function createTrain(name, start_station, end_station, departure_time) {
    await TrainModel.createTrain({
        name: name,
        start_station: start_station,
        end_station: end_station,
        departure_time: departure_time,
    });
}

export async function getAllTrains() {
    const trains = await TrainModel.find({ deletedAt: null });
    return trains;
}

export async function getTrain(id) {
    const train = await TrainModel.findById(id);
    return train;
}

export async function updateTrain(id, name, start_station, end_station, departure_time) {
    await TrainModel.findByIdAndUpdate(id, {
        name: name,
        start_station: start_station,
        end_station: end_station,
        departure_time: departure_time,
    });
}

export async function deleteTrain(id) {
    await TrainModel.findByIdAndUpdate(id, {
        deletedAt: Date.now(),
    });
}
