import { userColl, personalDataColl, deliveryColl } from "../utils/collections.js";
import { maskEmail } from "../utils/maskEmail.js";
import { ObjectId } from "mongodb";
import { format } from "date-fns";

const options = {
    projection: { password: 0 },
};

export async function getUser(req, res) {
    const { query, orderBy, sortBy, role } = req.query;
    const excludeMe = { _id: { $ne: new ObjectId(req.user.userId) } };
    let queryObj = {...excludeMe};
    let sortOptions = {};

    if (role === 'admin') queryObj.admin = true;
    else if (role === 'user') queryObj.admin = false;

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


export async function getPersonalData(req, res) {
    const { query, orderBy, sortBy } = req.query;
    let queryObj = {};
    let sortOptions = {};

    const order = sortBy === 'desc' ? -1 : 1;
    sortOptions[orderBy] = order;

    const finalOptions = {
        sort: sortOptions
    };
    
    try {
        let result = [];
        
        if (query) {
            queryObj.address = { $regex: `^${query}`, $options: 'i' };
            
            const nameCursor = await personalDataColl.find(queryObj, finalOptions);
            for await (const doc of nameCursor) {
                result.push(doc);
            }
        } else {
            const cursor = await userColl.find({}, finalOptions);
            for await (const doc of cursor) {
                result.push(doc);
            }
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Database error', message: error.message });
    }
}


export async function getDeliveries(req, res) {
    const { query, orderBy, sortBy } = req.query;
    let queryObj = {};
    let sortOptions = {};

    const order = sortBy === 'desc' ? -1 : 1;
    sortOptions[orderBy] = order;

    const finalOptions = {
        sort: sortOptions
    };
    
    try {
        let result = [];
        
        if (query) {
            queryObj.keyDelivery = { $regex: `^${query}`, $options: 'i' };
            
            const nameCursor = await deliveryColl.find(queryObj, finalOptions);
            for await (const doc of nameCursor) {
                result.push(doc);
            }
        } else {
            const cursor = await userColl.find({}, finalOptions);
            for await (const doc of cursor) {
                result.push(doc);
            }
        }
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Database error', message: error.message });
    }
}