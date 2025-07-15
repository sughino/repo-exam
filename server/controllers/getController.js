import { userColl, itemColl, otherItemColl } from "../utils/collections.js";
import { maskEmail } from "../utils/maskEmail.js";
import { ObjectId } from "mongodb";
import { format } from "date-fns";

const options = {
    projection: { password: 0 },
};

export async function getUser(req, res) {
    const { query, orderBy, sortBy } = req.query;
    const excludeMe = { _id: { $ne: new ObjectId(req.user.userId) } };
    let queryObj = {...excludeMe};
    let sortOptions = {};

    const order = sortBy === 'desc' ? -1 : 1;
    if (orderBy.includes(',')) {
        const fields = orderBy.split(',');
        for (const field of fields) {
            sortOptions[field] = order;
        }
    } else {
        sortOptions[orderBy] = order;
    }

    const finalOptions = {
        ...options,
        sort: sortOptions
    };
    
    try {
        let result = [];
        
        if (query) {
            const nameQuery = {
                ...queryObj,
                name: { $regex: `^${query}`, $options: 'i' },
            };
            
            const nameCursor = await userColl.find(nameQuery, finalOptions);
            for await (const doc of nameCursor) {
                doc.email = maskEmail(doc.email);
                result.push(doc);
            }

            if (result.length === 0) {
                const surnameQuery = {
                    ...queryObj,
                    surname: { $regex: `^${query}`, $options: 'i' },
                };
                
                const surnameCursor = await userColl.find(surnameQuery, finalOptions);
                for await (const doc of surnameCursor) {
                    doc.email = maskEmail(doc.email);
                    result.push(doc);
                }
                
                if (result.length === 0 && query.includes(' ')) {
                    const [firstName, lastName] = query.split(' ', 2);
                    
                    const fullNameQuery = {
                        ...queryObj,
                        name: { $regex: `^${firstName}`, $options: 'i' },
                        surname: { $regex: `^${lastName}`, $options: 'i' },
                    };
                    
                    const fullNameCursor = await userColl.find(fullNameQuery, finalOptions);
                    for await (const doc of fullNameCursor) {
                        doc.email = maskEmail(doc.email);
                        result.push(doc);
                    }
                }
            }
        } else {
            const cursor = await userColl.find(queryObj, finalOptions);
            for await (const doc of cursor) {
                doc.email = maskEmail(doc.email);
                doc.regDate = format(new Date(doc.regDate), "yyyy/MM/dd")
                result.push(doc);
            }
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Database error', message: error.message });
    }
}

export async function getItem(req, res) {
    const { query, orderBy, sortBy } = req.query;

    const userId = new ObjectId(req.user.userId);
    const filter = { requesterId: userId };
    const sortOrder = sortBy === "desc" ? -1 : 1;
    const sortOptions = {};

    if (orderBy.includes(',')) {
        for (const field of orderBy.split(',')) {
            sortOptions[field] = sortOrder;
        }
    } else {
        sortOptions[orderBy] = sortOrder;
    }

    try {
        let pipeline = [];

        if (query) {
            pipeline.push({
                $match: {
                    ...filter,
                    itemDescription: { $regex: query, $options: 'i' }
                }
            });
        } else {
            pipeline.push({
                $match: filter
            });
        }

        pipeline.push({
            $lookup: {
                from: "User",
                localField: "requesterId",
                foreignField: "_id",
                as: "requester"
            }
        });

        pipeline.push({
            $lookup: {
                from: "User",
                localField: "approverId",
                foreignField: "_id",
                as: "approver"
            }
        });

        pipeline.push({
            $lookup: {
                from: "PurchaseCategory",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        });

        pipeline.push({
            $project: {
                _id: 1,
                itemDescription: 1,
                requestDate: 1,
                approvalDate: 1,
                status: 1,
                quantity: 1,
                unitCost: 1,
                justification: 1,

                requesterName: { $arrayElemAt: ["$requester.name", 0] },
                requesterSurname: { $arrayElemAt: ["$requester.surname", 0] },
                approverName: { $arrayElemAt: ["$approver.name", 0] },
                approverSurname: { $arrayElemAt: ["$approver.surname", 0] },
                categoryDescription: { $arrayElemAt: ["$category.description", 0] }
            }
        });
        
        pipeline.push({
            $sort: sortOptions
        });

        const cursor = itemColl.aggregate(pipeline);
        const results = [];

        for await (const doc of cursor) {
            doc.requestDate = format(new Date(doc.requestDate), "yyyy/MM/dd");
            if (doc.approvalDate) {
                doc.approvalDate = format(new Date(doc.approvalDate), "yyyy/MM/dd");
            }
            results.push(doc);
        }

        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching purchase requests:", err);
        res.status(500).json({ error: "Database error", message: err.message });
    }
}

export async function getOtherItem(req, res) {
    const { query, orderBy, sortBy } = req.query;

    const userId = new ObjectId(req.user.userId);

    const baseFilter = {
        requesterId: { $ne: userId },
        status: "pending"
    };

    const sortOrder = sortBy === "desc" ? -1 : 1;
    const sortOptions = {};
    for (const field of orderBy.split(",")) {
        sortOptions[field] = sortOrder;
    }

    try {
        let pipeline = [];

        pipeline.push({
            $match: baseFilter
        });

        pipeline.push({
            $lookup: {
                from: "User",
                localField: "requesterId",
                foreignField: "_id",
                as: "requester"
            }
        });

        pipeline.push({
            $lookup: {
                from: "User",
                localField: "approverId",
                foreignField: "_id",
                as: "approver"
            }
        });

        pipeline.push({
            $lookup: {
                from: "PurchaseCategory",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        });

        if (query) {
            pipeline.push({
                $match: {
                    $or: [
                        { "requester.name": { $regex: query, $options: "i" } },
                        { "requester.surname": { $regex: query, $options: "i" } }
                    ]
                }
            });
        }

        pipeline.push({
            $project: {
                _id: 1,
                itemDescription: 1,
                requestDate: 1,
                approvalDate: 1,
                status: 1,
                quantity: 1,
                unitCost: 1,
                justification: 1,

                requesterName: { $arrayElemAt: ["$requester.name", 0] },
                requesterSurname: { $arrayElemAt: ["$requester.surname", 0] },
                approverName: { $arrayElemAt: ["$approver.name", 0] },
                approverSurname: { $arrayElemAt: ["$approver.surname", 0] },
                categoryDescription: { $arrayElemAt: ["$category.description", 0] }
            }
        });

        pipeline.push({ $sort: sortOptions });

        const cursor = itemColl.aggregate(pipeline);
        const results = [];

        for await (const doc of cursor) {
            doc.requestDate = format(new Date(doc.requestDate), "yyyy/MM/dd");
            if (doc.approvalDate) {
                doc.approvalDate = format(new Date(doc.approvalDate), "yyyy/MM/dd");
            }
            results.push(doc);
        }

        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching pending requests:", err);
        res.status(500).json({ error: "Database error", message: err.message });
    }
}


export async function getCategory(req, res) {
    try {
        const categories = await otherItemColl.find({}, { projection: { _id: 0 } }).toArray();
        res.status(200).json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: "Database error", message: err.message });
    }
}