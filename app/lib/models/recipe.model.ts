// recipe.model.ts
import { Schema, model, models, Types } from "mongoose";

const RecipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: String, required: true },
    },
  ],
  instructions: {
    type: [String], // Array of steps
    required: true,
  },
  imageUrl: {
    type: String,
    required: false, // Optional image URL for the recipe
  },
  prepTime: {
    type: Number, // In minutes
    required: true,
  },
  cookTime: {
    type: Number, // In minutes
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String], // e.g., ["vegan", "dessert"]
    required: false,
  },
  createdBy: {
    type: Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Recipe = models?.Recipe || model("Recipe", RecipeSchema);

export default Recipe;
