import { MongoClient } from "mongodb";
import { URI, DB } from "../config/db-config.js";

const client = new MongoClient(URI);

const conn = await client.db(DB);

export default conn;