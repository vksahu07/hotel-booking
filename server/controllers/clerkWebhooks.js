import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
	try {

		// Create a Svix instance with clerk webhook secret.
		const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
   
		// Getting Headers
		const headers = {
			"svix-id": req.headers["svix-id"],
			"svix-timestamp": req.headers["svix-timestamp"],
			"svix-signature": req.headers["svix-signature"],
		};

		// Verifying Header using rawBody Buffer
		const payload = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
		await whook.verify(payload, headers)

		// Getting Data from request body
		const { data, type } = req.body;
		console.log("Clerk webhook event triggered:", type, "User ID:", data.id);
		
		const userData = {
			_id: data.id,
			email: (data.email_addresses && data.email_addresses[0]) ? data.email_addresses[0].email_address : "",
			username: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "User",
			image: data.image_url || "",
		};
          
		// Switch cases for different Events
		switch (type) {
			case "user.created": {
				const newUser = await User.create(userData);
				console.log("User successfully created in DB:", newUser._id);
				break;
			}

			case "user.updated": {
				const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
				console.log("User successfully updated in DB:", updatedUser._id);
				break;
			}
				
			case "user.deleted": {
				await User.findByIdAndDelete(data.id);
				console.log("User successfully deleted from DB:", data.id);
				break;
			}
			
			default:
				console.log("Unhandled event type:", type);
				break;	
		}
		res.json({success: true, message: "Webhook Received"})

	} catch (error) {
		console.error("Clerk Webhook Error:", error.message);
		res.status(400).json({ success: false, message: error.message });
	}
}

export default clerkWebhooks;