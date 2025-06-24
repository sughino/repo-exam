import { faker } from "@faker-js/faker";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
const URI = "mongodb+srv://LudoG:iyNHqo99uFPhQrzy@dbstudenti.wkesu.mongodb.net/?retryWrites=true&w=majority&appName=DBTracking";
const DB = "DBTracking";

const client = new MongoClient(URI);
const conn = await client.db(DB);

const deliveryColl = conn.collection("Delivery");
const personalDataColl = conn.collection("PersonalData");
const userColl = conn.collection("User");

const provinces = ["MI", "RM", "TO", "NA", "FI", "VE", "PA", "BO", "GE", "BA"];

async function generateUsers(count = 50) {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const password = faker.internet.password();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const registrationDate = faker.date.between({ from: '2025-01-01', to: Date.now() });
    
    users.push({
      _id: new ObjectId(),
      email: faker.internet.email().toLowerCase(),
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      password: hashedPassword,
      regDate: registrationDate,
      admin: faker.datatype.boolean()
    });
  }
  
  return users;
}

function generatePersonalData(count = 50) {
  return Array.from({ length: count }, () => ({
    _id: new ObjectId(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    province: faker.helpers.arrayElement(provinces),
    phoneNumber: faker.phone.number('3##-###-####'),
    note: faker.lorem.sentence()
  }));
}

function generateDeliveries(count = 100, personalData) {
  return Array.from({ length: count }, () => {
    const randomPersonalData = faker.helpers.arrayElement(personalData);
    const withdrawalDate = faker.date.past();
    const deliveryDate = faker.date.future({ refDate: withdrawalDate });
    
    //? Formattazione delle date nel formato gg/mm/yyyy
    /*const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() è 0-indexed
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    };*/
    
    return {
      _id: new ObjectId(),
      withdrawalDate: faker.date.between({ from: '2025-01-01', to: Date.now() }),
      deliveryDate: faker.date.between({ from: '2025-01-01', to: Date.now() }),
      state: faker.helpers.arrayElement(["Pending", "Shipped", "Delivered", "Cancelled"]),
      keyDelivery: faker.string.alphanumeric(10).toUpperCase(),
      personalDataId: randomPersonalData._id // Riferimento diretto all'ObjectId
    };
  });
}

async function insertData() {
  try {
    // Generiamo prima i dati personali
    //const personalData = generatePersonalData();
    //console.log(`Generati ${personalData.length} dati personali`);
    
    // Poi generiamo gli utenti
    const users = await generateUsers();
    console.log(`Generati ${users.length} utenti`);
    
    // Infine le consegne
    //const deliveries = generateDeliveries(100, personalData);
    //console.log(`Generate ${deliveries.length} consegne`);

    // Inseriamo tutto nel database
    //await personalDataColl.insertMany(personalData);
    await userColl.insertMany(users);
    //await deliveryColl.insertMany(deliveries);

    console.log("Dati inseriti con successo!");
  } catch (error) {
    console.error("Errore durante l'inserimento:", error);
  }
}

insertData();