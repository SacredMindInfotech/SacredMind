import { Request, Response } from "express";
import { Webhook } from "svix";
import dotenv from "dotenv";
import { User } from "@prisma/client";
import { createUser, updateUserbyId } from "./webhookMethods";
import { deleteUserbyId } from "./webhookMethods";

dotenv.config();

const WebhookController = async (req: Request, res: Response) => {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers and body
  const headers = req.headers;
  const payload = req.body;

  // Get Svix headers for verification
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return void res.status(400).json({
      success: false,
      message: "Error: Missing svix headers",
    });
  }

  let evt: any;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If verification fails, error out and return error code
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id as string,
      "svix-timestamp": svix_timestamp as string,
      "svix-signature": svix_signature as string,
    });
  } catch (err: any) {
    console.log("Error: Could not verify webhook:", err.message);
    return void res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {

    
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    if (!id || !email_addresses) {
      res.status(400).send({
        message: "Error: Missing fields",
      });
    }

    const user = {
      clerkuserId: id,
      email: email_addresses[0].email_address,
      ...(first_name ? { firstName: first_name } : {}),
      ...(last_name ? { lastName: last_name } : {}),
      ...(image_url ? { imageUrl: image_url } : {}),
    };

    await createUser(user as User);
    console.log("User created successfully");
  } 

  else if (eventType === "user.updated") {


    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    if (!id || !email_addresses) {
        res.status(400).send({
          message: "Error: Missing fields",
        });
      }
  
      const user = {
        clerkuserId: id,
        email: email_addresses[0].email_address,
        ...(first_name ? { firstName: first_name } : {}),
        ...(last_name ? { lastName: last_name } : {}),
        ...(image_url ? { imageUrl: image_url } : {}),
      };

      await updateUserbyId({id, data:user as User});
      console.log("User updated successfully");

  } 
  
  else if (eventType === "user.deleted") {
    const { id } = evt.data;
    await deleteUserbyId({clerkuserId:id});
    console.log("User deleted successfully");
  }

  return void res.status(200).json({
    success: true,
    message: "Webhook received",
  });

};

export default WebhookController;
