import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async () => {
	try {

		// Create a Svix instance with clerk webhook secret.
      const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
   
		// Getting Headers
		const header = {
			"svix-id": req.headers["svix-id"],
			"svix-timestamp": req.header["svix-timestamp"],
			"svix-signature": req.header["svix-signature"],
		
		};

		// Verifying Header

		await whook.verify(JSON.stringify(req.body), headers)

		// Getting Data from request body

		const { data, type } = req.body
		
		const userData = {
			_id: data.id,
			email: data.email_addressess[0].email_addressess,
			username: data.first_name + " " + data.last_name,
			image: data.image_url,
		}
          
		// Switch cases for different Events

		switch (type) {
			case "user.created": {
				await User.create(userDate);
				break;
			}

			case "user.updated": {
				await User.findByIdAndUpdate(data.id, userData);
				break;
			}
				
			case "user.deleted": {
				await User.findByIdAndDelete(data.id);
				break;
			}
			
			default:
				break;	
		}
		res.JSON({success: true, message: "Webhook Recieved"})

	} catch (error) {
		console.log(error.message);
		res.json({ success: false, message: error.message });
	}
}

export default clerkWebhooks;