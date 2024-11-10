import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser } from "../../../actions/user.action";
import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import User from "@/app/lib/models/user.model";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, image_url, first_name, last_name, username } =
          evt.data;

        const user = {
          clerkId: id,
          email: email_addresses[0].email_address,
          username: username!,
          photo: image_url!,
          firstName: first_name,
          lastName: last_name,
        };

        const newUser = await createUser(user);

        if (newUser) {
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUser._id,
            },
          });
        }

        return NextResponse.json({ message: "New user created", user: newUser });
      }

      case "user.updated": {
        const { id, email_addresses, image_url, first_name, last_name, username } =
          evt.data;

        // Find user by clerkId instead of using metadata
        const existingUser = await User.findOne({ clerkId: id });
        
        if (!existingUser) {
          return new Response("User not found", { status: 404 });
        }

        // Update the user in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
          existingUser._id,
          {
            email: email_addresses[0].email_address,
            username: username!,
            photo: image_url!,
            firstName: first_name,
            lastName: last_name,
          },
          { new: true }
        );

        return NextResponse.json({
          message: "User updated",
          user: updatedUser,
        });
      }

      case "user.deleted": {
        // Find and delete user by clerkId instead of using metadata
        const deletedUser = await User.findOneAndDelete({ clerkId: id });
        
        if (!deletedUser) {
          return new Response("User not found", { status: 404 });
        }

        return NextResponse.json({ 
          message: "User deleted",
          user: deletedUser 
        });
      }

      default:
        console.log(`Webhook event type ${eventType} not handled`);
        return new Response("", { status: 200 });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(`Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}