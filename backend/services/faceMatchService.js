import Album from "../models/Album.js";

// Service to match face (TEMP DEMO)
export async function matchFace(eventId, selfieBuffer) {
  const album = await Album.findOne({ eventId });
  if (!album) throw new Error("Event not found");

  // TEMP logic: return all photos from album
  // Replace with AI face recognition logic later
  return album.photos;
}