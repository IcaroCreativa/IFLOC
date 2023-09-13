import { app, database } from "../../../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import "firebase/firestore";
import { getAuth, getInstance } from "firebase/auth";

const dbInstance = collection(database, "users");

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "GET": {
      if (req.query.id) {
        return getUserById(req, res);
      } else if (req.query.filter) {
        return getUser(req, res);
      } else if (req.query.matricule) {
        return getUserByMatricule(req, res);
      } else {
        return getUsers(req, res);
      }
    }

    case "POST": {
      return addUser(req, res);
    }

    case "PATCH": {
      return updateUser(req, res);
    }

    case "DELETE": {
      return deleteUserById(req, res);
    }
  }
}

async function addUser(req, res) {
  try {
    console.log(req.body);
    const user = JSON.parse(req.body);
    addDoc(dbInstance, user);
    return res.json({ message: "success", success: true });
  } catch (error) {
    // return the error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function getUserByMatricule(req, res) {
  try {
    const matricule = req.query.matricule;
    let matriculeExist=false;
    console.log(matricule);
    const users = await getDocs(dbInstance);
    const usersArray = [];
    users.forEach((doc) => {
      usersArray.push({ id: doc.id, data: doc.data() }); //get doc id and data
      if (doc.data().matricule == matricule) {
        matriculeExist=true;
      }
    });
    if (matriculeExist) {
    return res.json({
      message: "matricule found",
      success: true,
    });}
    else{
      return res.json({
        message: "matricule not found",
        success: false,
      });
    }
    
  } catch (error) {
    // return the error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function getUsers(req, res) {
  try {
    const users = await getDocs(dbInstance);
    const usersArray = [];
    users.forEach((doc) => {
      usersArray.push({ id: doc.id, data: doc.data() }); //get doc id and data
 
    });
    return res.json({
      message: "success",
      success: true,
      data: usersArray,
    });
  } catch (error) {
    // return the error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function getUserById(req, res) {
  try {
    // Get the user ID from the request parameters
    console.log("ID:" + req.query.id);
    const userId = req.query.id;
    const singleUser = doc(database, "users", userId); // Use the ID to retrieve the specific user from the database
    const data = await getDoc(singleUser);
    console.log({ ...data.data(), id: data.id });

    // If the user doesn't exist, return a 404 error
    if (!data.exists) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    } // If the user exists, return it in the response
    return res.json({
      message: "success",
      success: true,
      data: { ...data.data(), id: data.id }, // création de l'objet data avec l'id et les données
    });
  } catch (error) {
    // Return the error
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}

async function deleteUserById(req, res) {
  // Get the user ID from the request parameters
  console.log("ID:" + req.query.id);
  const userId = req.query.id;
  const collectionById = doc(database, "users", userId); // Use the ID to retrieve the specific user from the database
  deleteDoc(collectionById)
    .then(() => {
      console.log("Document successfully deleted!");

      return res.json({
        message: "success",
        success: true,
      });
    })
    .catch((error) => {
      return res.json({
        message: new Error(error).message,
        success: false,
      });
    });
}

async function getUser(req, res) {
  try {
    const filter = req.query.filter;
    const value = req.query.value;

    const q = query(dbInstance, where(filter, "==", value));

    const querySnapshot = await getDocs(q);
    // console.log("querySnapshot: ", querySnapshot);
    if (querySnapshot.empty) {
      return res.json({
        message: "User not found",
        success: false,
      });
    } else {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      return res.json({
        message: "success",
        success: true,
        data: data,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      message: "Error getting user",
      success: false,
    });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.query.id;
    const updates = req.body;

    const userRef = doc(database, "users", userId);
    await updateDoc(userRef, updates);
    return res.json({
      message: "User updated successfully",
      success: true,
    });
  } catch (error) {
    return res.json({
      message: new Error(error).message,
      success: false,
    });
  }
}
