import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import Email from "next-auth/providers/email";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
import User from "@/models/user";
import { connectToDB } from "@/utils/database";
// import clientPromise from "@/utils/mongodb";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Email({
    //   server: {
    //     host: process.env.SMTP_HOST,
    //     port: Number(process.env.SMTP_PORT),
    //     auth: {
    //       user: process.env.SMTP_USER,
    //       pass: process.env.SMTP_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // store the user id from MongoDB to session
      if (session?.user?.email) {
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        } else {
          console.error('No user found in database');
        }
      } else {
        console.error('No email found in session user');
      }
      console.log('session callback', session); // Log the session data

      return session;
    },
    async signIn({ account, profile, user, credentials, error }) {      
      try {
        await connectToDB();
    
        if (error) {
          console.error('Signin error: ', error);
          return false;
        }

        // Restrict access based on the email domain
        if (account.provider === 'google') {
          // if (!profile.email_verified || !profile.email.endsWith("@uniteddieselservice.net")) {
          if (!profile.email_verified || !profile.email.endsWith("@gmail.com")) {
            console.error('Invalid email domain or email not verified');
            return false;
          }
        }
        // Declare variables to store user details
        let email, name, picture;
    
        // Check if the provider is google
        if(account.provider === 'google') {
          email = profile.email;
          name = profile.name;
          picture = profile.picture;
        } 
        // Check if the provider is email
        // else if(account.provider === 'email') {
        //   email = user.email;
        //   name = ""; 
        //   picture = ""; 
        // } 
    
        // Check if the user email exists in the database
        if (email) {
          const userExists = await User.findOne({ email });
          // If user does not exist, create a new user in MongoDB
          if (!userExists) {
            await User.create({
              email,
              username: name?.replace(" ", "").toLowerCase(),
              image: picture
            });
          }
        } else {
          console.error('No email found');
          return false;
        }
    
        return true;
      } catch (error) {
        console.error("Error checking if user exists: ", error.message);
        return false;
      }
    },  
  },
});

export { handler as GET, handler as POST };
