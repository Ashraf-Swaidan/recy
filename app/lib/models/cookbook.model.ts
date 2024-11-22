import { Schema, model, models, Types } from "mongoose";

const CookbookSchema = new Schema({
  userId: {
    type: Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  savedRecipes: [
    {
      recipeId: {
        type: Types.ObjectId, // Reference to Recipe model
        ref: "Recipe",
        required: true,
      },
      savedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Cookbook = models?.Cookbook || model("Cookbook", CookbookSchema);

export default Cookbook;
