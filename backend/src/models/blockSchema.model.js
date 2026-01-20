// models/subschemas/BlockSchema.js
import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema(
  {
    id: {
      type: String, // client-generated UUID
      required: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "chart"],
      required: true,
    },

    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },

    size: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },

    zIndex: { type: Number, default: 1 },

    locked: { type: Boolean, default: false },

    /* TEXT BLOCK */
    content: String,

    /* IMAGE BLOCK */
    imageUrl: String,
    caption: String,

    /* CHART BLOCK */
    chartConfig: {
      datasetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dataset",
      },
      chartType: String,
      xField: String,
      yField: String,
      filters: Object,
      colorScheme: String,
    },

    meta: {
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  { _id: false }
);

export default BlockSchema;
