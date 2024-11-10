import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, updateUser, deleteUser } from "../../../actions/user.action";
import { NextResponse } from "next/server";
import { createClerkClient } from '@clerk/backend'

export async function POST(req: Request) {
  // Initialize Clerk Client
  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

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
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
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
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Do something with the payload
  const { id } = evt.data;
  if(!id) return null;
  const eventType = evt.type;

  // Prevent processing if the event is already processed
  const userMetadata = await clerkClient.users.getUser(id);
  if (userMetadata.publicMetadata?.processed === true) {
    return new Response("Event already processed", { status: 200 });
  }

  // Handling the event based on type
  if (eventType === "user.created") {
    const { email_addresses, image_url, first_name, last_name, username } = evt.data;

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
      // Mark the user as processed to prevent webhook loop

      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
          processed: true,
        },
      });
    }

    return NextResponse.json({ message: "New user created", user: newUser });
  }

  if (eventType === "user.updated") {
    const { email_addresses, image_url, first_name, last_name, username } = evt.data;

    const updatedUser = {
      email: email_addresses[0].email_address,
      username: username!,
      photo: image_url!,
      firstName: first_name,
      lastName: last_name,
    };


    const user = await updateUser(id, updatedUser);

    if (user) {
      // Mark the user as processed
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: user._id,
          processed: true,
        },
      });
    }

    return NextResponse.json({ message: "User updated", user });
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    if (!id) {
      return NextResponse.json({ message: 'No such id' })
    }
    await deleteUser(id);

    // Mark the user as processed
    await clerkClient.users.updateUserMetadata(id, {
      publicMetadata: {
        processed: true,
      },
    });

    return NextResponse.json({ message: "User deleted" });
  }

  console.log(`Webhook with ID ${id} and type ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}
