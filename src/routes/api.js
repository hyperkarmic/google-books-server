const express = require("express");
const axios = require("axios");

const db = require("../models");

const GOOGLE_URL = "https://www.googleapis.com/books/v1/volumes";

const apiRouter = express.Router();

const transformGoogleBooks = (googleBooks = []) => {
  return googleBooks.map((googleBook) => {
    const { volumeInfo } = googleBook;
    return {
      title: volumeInfo.title || "No title available",
      subTitle: volumeInfo.subTitle || "",
      description: volumeInfo.description || "No description available",
      authors: volumeInfo.authors || [],
      image:
        (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) ||
        "https://via.placeholder.com/400",
      link: volumeInfo.previewLink || "",
    };
  });
};

const getBooksFromGoogle = async (req, res) => {
  try {
    const { searchTerm } = req.body;

    const { data } = await axios.get(GOOGLE_URL, { params: { q: searchTerm } });

    const books = transformGoogleBooks(data.items);

    res.json({
      results: books,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

const saveBookInDb = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const payload = req.body;

    await db.Book.create({ ...payload, userId });

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const removeBookInDb = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    await db.Book.findOneAndDelete({ _id: id, userId });
    const results = await db.Book.find({ userId });

    res.json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getAllSavedBooks = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const books = await db.Book.find({ userId });

    res.json({
      results: books,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

apiRouter.post("/books", getBooksFromGoogle);
apiRouter.get("/save", getAllSavedBooks);
apiRouter.post("/save", saveBookInDb);
apiRouter.delete("/books/:id", removeBookInDb);

module.exports = apiRouter;
