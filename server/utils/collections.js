import conn from "../services/connection.js";

export const itemColl = conn.collection("PurchaseRequest");
export const otherItemColl = conn.collection("PurchaseCategory");
export const userColl = conn.collection("User");