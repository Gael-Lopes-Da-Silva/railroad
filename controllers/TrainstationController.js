import TrainstationModel from "../models/TrainstationModel.js";

export async function createTrainstation(name, open_hour, close_hour, image) {
  await TrainstationModel.create({
    name: name,
    open_hour: open_hour,
    close_hour: close_hour,
    image: image,
  });
}

export async function getAllTrainstations() {
  const trains = await TrainstationModel.find({ deletedAt: null });
  return trains;
}

export async function getTrainstation(id) {
  const train = await TrainstationModel.findById(id);
  return train;
}

export async function updateTrainstation(
  id,
  name,
  open_hour,
  close_hour,
  image
) {
  await TrainstationModel.findByIdAndUpdate(id, {
    id: id,
    name: name,
    open_hour: open_hour,
    close_hour: close_hour,
    image: image,
  });
}

export async function deleteTrainstation(id) {
  await TrainstationModel.findByIdAndUpdate(id, {
    deletedAt: Date.now(),
  });
}
