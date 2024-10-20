import TrainModel from "../models/TrainModel.js";
import TrainstationModel from "../models/TrainstationModel.js";

export async function createTrain(request) {
    const start_station = await TrainstationModel.findById(request.body.start_station, null, { deletedAt: null });
    const end_station = await TrainstationModel.findById(request.body.end_station, null, { deletedAt: null });

    // we get and check if the start and end station are valid stations (exists and not deleted)
    if (!start_station || !end_station) {
        return null;
    }

    // we create the train with the given body fields
    return await TrainModel.create({
        name: request.body.name,
        start_station: request.body.start_station,
        end_station: request.body.end_station,
        departure_time: request.body.departure_time,
    });
}

export async function getAllTrains(request) {
    const sortQuery = request.query.sort ? request.query.sort.split(',') : []; // we get the sort query if set
    const limitQuery = request.query.limit ? parseInt(request.query.limit) : 10; // we get the limit query if set
    let trains = TrainModel.find({ deletedAt: null }); // we get all undeleted trains

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
    // we get the train of the given id if not deleted
    return await TrainModel.findById(request.params.id, null, { deletedAt: null });
}

export async function updateTrain(request) {
    // with get the old infos of the train of the given id
    let train = await TrainModel.findById(request.params.id)
    
    // we change the infos of the train of the given id
    // if the data is not set in body, we use the old value
    return await TrainModel.findByIdAndUpdate(request.params.id, {
        name: request.body.name ? request.body.name : train.name,
        start_station: request.body.start_station ? request.body.start_station : train.start_station,
        end_station: request.body.end_station ? request.body.end_station : train.end_station,
        departure_time: request.body.departure_time ? request.body.departure_time : train.departure_time,
    });
}

export async function deleteTrain(request) {
    // we soft delete the train of the given id
    return await TrainModel.findByIdAndUpdate(request.params.id, {
        deletedAt: Date.now(),
    });
}

export async function activateTrain(request) {
    // we activate the train of the given id
    return await TrainModel.findByIdAndUpdate(request.params.id, {
        active: true,
    });
}

export async function deactivateTrain(request) {
    // we deactivate the train of the given id
    return await TrainModel.findByIdAndUpdate(request.params.id, {
        active: false,
    });
}