import conn from "../services/connection.js";

export const deliveryColl = conn.collection("Delivery");
export const personalDataColl = conn.collection("PersonalData");
export const userColl = conn.collection("User");