const PORT = process.env.PORT || 8000;

const DB_URI = process.env.MONGODB_URI || "mongodb://localhost/googleBooks";

const MONGOOSE_OPTIONS = {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
};

const AUTH_SECRET = process.env.AUTH_SECRET || "test-secret";

module.exports = {
  PORT,
  DB_URI,
  MONGOOSE_OPTIONS,
  AUTH_SECRET,
};
