import React, { useEffect, useState } from "react";
import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdateProduct = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [images, setImages] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedSuccess, setUpdatedSuccess] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    price: 0,
    imagesUrls: [],
  });
  const params = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(
          `/api/product/getProducts?productId=${params.productId}`
        );
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
        }
        if (res.ok) {
          setFormData(data.products[0]);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getProduct();
  }, [params.productId]);
  const handleImagesChange = (e) => {
    const images = e.target.files;
    if (images) {
      setImages(images);
    }
  };
  const handleUploadImages = () => {
    if (images.length > 0 && images.length + formData.imagesUrls < 6) {
      setImageUploading(true);
      setImageUploadError(null);
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imagesUrls: formData.imagesUrls.concat(urls),
          });
          setImageUploading(false);
          setImageUploadError(null);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setImageUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setImageUploading(false);
    }
  };
  const storeImage = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const imageName = new Date().getTime() + image.name;
      const storageRef = ref(storage, imageName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleDelete = (index) => {
    setFormData({
      ...formData,
      imagesUrls: formData.imagesUrls.filter((_, i) => i !== index),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setUpdatedSuccess("");
      const res = await fetch(
        `/api/product/update/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        setUpdatedSuccess("product has been updated");
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setUpdatedSuccess("");
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            id="images"
            onChange={handleImagesChange}
            multiple
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            disabled={imageUploading}
            onClick={handleUploadImages}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.imagesUrls.length > 0 &&
          formData.imagesUrls.map((url, index) => (
            <div
              key={url}
              className="flex justify-between p-3 border items-center"
            >
              <img
                src={url}
                alt="listing image"
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                type="button"
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          ))}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          id="description"
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content}
        />
        <TextInput
          type="number"
          placeholder="Price"
          required
          id="price"
          className="flex-1"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          onClick={handleSubmit}
          disabled={imageUploading || loading}
        >
          {loading ? "Puplishing" : "Puplish"}
        </Button>
        {updatedSuccess && <Alert color="success">{updatedSuccess}</Alert>}
      </form>
    </div>
  );
};

export default UpdateProduct;
