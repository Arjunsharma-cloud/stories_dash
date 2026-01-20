// models/Dataset.js
import mongoose from "mongoose";

const DatasetSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },

    fileUrl: { type: String, required: true }, // S3 / Cloudinary

    schema: {
      columns: [
        {
          name: String,
          type: String, // string | number | date | boolean
        },
      ],
    },

    rowCount: Number,

    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Dataset", DatasetSchema);



/** now schema is ready and 
 * steps 
 * now when the file is clikced change the state in the ui adn tehn show the number beside it and number should be
 * a button which when clicked shows all the files 
 * 
 * then in the backend the file should be stored use a database that can store the file like cloudinary with image
 * or any otther and then store it there 
 * 
 * then connecct it with the rest of the database schema 
 */
