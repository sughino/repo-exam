const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
export const DB = process.env.DB_NAME || "DBTracking";
export const URI = `mongodb+srv://${USER}:${PASSWORD}@dbstudenti.wkesu.mongodb.net/?retryWrites=true&w=majority&appName=DBStudenti`;