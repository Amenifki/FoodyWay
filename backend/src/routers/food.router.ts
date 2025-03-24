import { Router } from "express";
import { sample_foods, sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";
const router = Router();

router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await FoodModel.create(sample_foods);
    res.send("Seed Is Done!");
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
  })
);

router.get(
  "/search/:searchTerm",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

router.get(
  "/tags",
  asyncHandler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: "$tags",
      },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "All",
      count: await FoodModel.countDocuments(),
    };

    tags.unshift(all);
    res.send(tags);
  })
);

router.get(
  "/tag/:tagName",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find({ tags: req.params.tagName });
    res.send(foods);
  })
);

router.get(
  "/:foodId",
  asyncHandler(async (req, res) => {
    const food = await FoodModel.findById(req.params.foodId);
    res.send(food);
  })
);
router.delete(
  "/:foodId",
  asyncHandler(async (req, res) => {
    const foodId = req.params.foodId;

    // Try to find the food item and delete it
    const deletedFood = await FoodModel.findByIdAndDelete(foodId);

    if (!deletedFood) {
      // If the food item is not found, return a 404 response
      res.status(404).json({ message: "Food not found" });
      return; // Don't return the response, just exit the function
    }

    // If the deletion is successful, return a success message
    res.status(200).json({ message: "Food deleted successfully" });
  })
);
// Add food route
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, imageUrl, price, tags, origins, cookTime, favorite, stars } =
      req.body;

    // Validate the request body
    if (!name || !price || !imageUrl || !tags || !origins || !cookTime) {
      res.status(400).send("Missing required fields");
      return;
    }

    // Create a new food item
    const food = new FoodModel({
      name,
      imageUrl,
      price,
      tags,
      origins,
      cookTime,
      favorite,
      stars,
    });

    // Save the food item to the database
    const savedFood = await food.save();
    res.status(201).send(savedFood);
  })
);
router.put(
  "/:foodId",
  asyncHandler(async (req, res) => {
    const foodId = req.params.foodId;
    const updatedFood = req.body;

    const food = await FoodModel.findByIdAndUpdate(foodId, updatedFood, {
      new: true,
    });

    if (!food) {
      res.status(404).json({ message: "Food not found" });
      return;
    }

    res.status(200).json(food);
  })
);

export default router;
