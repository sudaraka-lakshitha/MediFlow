// AN ERROR WE EXPECT AND CAN EXPLAIN
// Throw an AppError when something is not allowed (for example "This bill is already paid").
// statusCode tells the browser what kind of problem it is (400 wrong input, 403 not allowed, 404
// not found,
// 409 changed by someone else or wrong step). The message is shown to the user as it is, so write
// it in plain words.

export class AppError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}
