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

export async function getAllTrains(request) {
    const sortQuery = request.query.sort ? request.query.sort.split(',') : [];
    const limitQuery = request.query.limit ? parseInt(request.query.limit) : 10;
    let trains = TrainModel.find({ deletedAt: null });

    if (sortQuery.length > 0) {
        let sortOptions = [];

        sortQuery.forEach((element) => {
            let sortOrder = 1;

            if (element.startsWith('-')) {
                sortOrder = -1;
                element = element.substring(1);
            }

            if (["name", "start_station", "end_station", "departure_time", "active"].includes(element)) {
                sortOptions.push([element, sortOrder]);
            }
        });

        if (sortOptions.length > 0) {
            trains.sort(sortOptions);
        }
    }

    if (limitQuery > 0) {
        trains.limit(limitQuery);
    }

    return await trains;
}

export async function getTrain(request) {
    return await TrainModel.findById(request.params.id, null, { deletedAt: null });
}

export async function updateTrain(request) {
    let train = TrainModel.findById(request.params.id)
    
    return await TrainModel.findByIdAndUpdate(request.params.id, {
        name: request.body.name ? request.body.name : train.name,
        start_station: request.body.start_station ? request.body.start_station : train.start_station,
        end_station: request.body.end_station ? request.body.end_station : train.end_station,
        departure_time: request.body.departure_time ? request.body.departure_time : train.departure_time,
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