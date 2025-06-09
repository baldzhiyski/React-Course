import supabase from "./supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export async function getCabins() {
  let { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded !");
  }

  return data;
}

export async function deleteCabinById(cabinId) {
  const { data, error } = await supabase
    .from("cabins")
    .delete()
    .eq("id", cabinId);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted !");
  }

  return data;
}

export async function createCabin(payload) {
  const hasImagePath = payload.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${payload.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? payload.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { data: createdCabin, error } = await supabase
    .from("cabins")
    .insert([{ ...payload, image: imagePath }])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created !");
  }

  // Upload image
  if (hasImagePath) return createCabin;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, payload.image);

  // Delete Cabin if error on uploading image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", createdCabin.id);
    throw new Error("There was an error uploading the image !");
  }

  return createdCabin;
}
