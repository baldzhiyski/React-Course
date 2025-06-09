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

export async function createEditCabin(payload, id) {
  const hasImagePath = payload.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${payload.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? payload.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. Create/edit cabin
  let query = supabase.from("cabins");

  // A) CREATE
  if (!id) query = query.insert([{ ...payload, image: imagePath }]);

  // B) EDIT
  if (id) query = query.update({ ...payload, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created !");
  }

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, payload.image);

  // 3. Delete the cabin IF there was an error uplaoding image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data;
}
