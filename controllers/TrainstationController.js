
import TrainstationModel from "../models/TrainstationModel.js";
import TrainModel from "../models/TrainModel.js";

export async function createTrainstation(request) {
    // we create a trainstation with the given body fields
    // we do not check the open and close hour, the admin need to check it himself
    await TrainstationModel.create({
        name: request.body.name,
        open_hour: request.body.open_hour,
        close_hour: request.body.close_hour,
        image: request.body.image,
    });
}

export async function getAllTrainstations(request) {
    const sortQuery = request.query.sort ? request.query.sort.split(',') : []; // we get the sort query if set
    const limitQuery = request.query.limit ? parseInt(request.query.limit) : 10; // we get the limit query if set
    let trainstations = TrainstationModel.find({ deletedAt: null }); // we get all undeleted trainstations

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
    // we get the trainstation of the given id if not deleted
    return await TrainstationModel.findById(request.params.id, null, { deletedAt: null });
}

export async function updateTrainstation(request) {
    // with get the old infos of the trainstation of the given id
    let trainstation = TrainstationModel.findById(request.params.id)

    // we change the infos of the trainstation of the given id
    // if the data is not set in body, we use the old value
    return await TrainstationModel.findByIdAndUpdate(request.params.id, {
        name: request.body.name ? request.body.name : trainstation.name,
        open_hour: request.body.open_hour ? request.body.open_hour : trainstation.open_hour,
        close_hour: request.body.close_hour ? request.body.close_hour : trainstation.close_hour,
        image: request.body.image ? request.body.image : trainstation.image,
    });
}

export async function deleteTrainstation(request) {
    const startStationTrains = await TrainModel.find({ start_station: request.params.id }); // we get all the trains that start with this trainstation 
    const endStationTrains = await TrainModel.find({ end_station: request.params.id }); // we get all the trains that end with this trainstation 

    // we do a soft delete of all the trains that start with this trainstation
    // as to not let orphans trains
    startStationTrains.forEach((train) => {
        TrainModel.findByIdAndUpdate(train.id, {
            active: false,
        });
    });

    // we do a soft delete of all the trains that end with this trainstation
    // as to not let orphans trains
    endStationTrains.forEach((train) => {
        TrainModel.findByIdAndUpdate(train.id, {
            active: false,
        });
    });
    
    // we soft delete the trainstation of the given id
    return await TrainstationModel.findByIdAndUpdate(request.params.id, {
        deletedAt: Date.now(),
    });
}