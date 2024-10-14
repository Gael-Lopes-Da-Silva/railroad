
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

export async function getAllTrainstations(request) {
    const sortQuery = request.query.sort ? request.query.sort.split(',') : [];
    const limitQuery = request.query.limit ? parseInt(request.query.limit) : 10;
    let trainstations = TrainstationModel.find({ deletedAt: null });

    if (sortQuery.length > 0) {
        let sortOptions = [];

        sortQuery.forEach((element) => {
            let sortOrder = 1;

            if (element.startsWith('-')) {
                sortOrder = -1;
                element = element.substring(1);
            }

            if (["name", "open_hour", "close_hour"].includes(element)) {
                sortOptions.push([element, sortOrder]);
            }
        });

        if (sortOptions.length > 0) {
            trainstations.sort(sortOptions);
        }
    }

    if (limitQuery > 0) {
        trainstations.limit(limitQuery);
    }
    
    return await trainstations;
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