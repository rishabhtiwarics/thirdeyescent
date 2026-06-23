const CLOUD_NAME = import.meta.env.VITE_PUBLIC_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_PUBLIC_UPLOAD_PRESET;

export const uploadToCloudinary = async (
	file,
	folder = "banega-brand/default",
) => {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", UPLOAD_PRESET);

	formData.append("folder", folder);

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
		{
			method: "POST",
			body: formData,
		},
	);

	if (!res.ok) {
		throw new Error("Upload failed");
	}

	const data = await res.json();

	return {
		url: data.secure_url,
		public_id: data.public_id,
		type: data.resource_type,
	};
};
