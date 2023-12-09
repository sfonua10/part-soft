import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Email from 'next-auth/providers/email'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import User from '@/models/user'
import clientPromise from '@/utils/mongodb'
import { createTransport } from 'nodemailer'
import specificAllowedEmails from '@/utils/specificAllowedEmails'

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Email({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (!session?.user?.email) {
        console.error('No email found in session user');
        return session;
      }

      const sessionUser = await User.findOne({ email: session.user.email }).lean();
      if (sessionUser) {
        session.user = { ...session.user, ...sessionUser };
      } else {
        console.error('No user found in database');
      }
    
      return session;
    },
    async signIn({ profile, user, error }) {
      if (error) {
        console.error('Signin error: ', error);
        return false;
      }

      // Determine the user's email
      const email = profile?.email || user?.email;
      if (!email || !specificAllowedEmails.includes(email) && !email.endsWith('@uniteddieselservice.net')) {
        console.error('Email not allowed for sign-in');
        return false;
      }

      // Check if the user exists, create if not
      const userExists = await User.findOneAndUpdate(
        { email },
        { $setOnInsert: { email, name: profile?.name || user?.name, image: profile?.picture || user?.image }},
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();

      return !!userExists;
    },
  },
})

async function sendVerificationRequest({ identifier: email, url, provider }) {
  const transport = createTransport(provider.server);
  transport.sendMail({
    to: email,
    from: provider.from,
    subject: `Sign in to ${new URL(url).host}`,
    text: `Sign in to ${new URL(url).host}\n${url}\n\n`,
    html: `<p>Sign in to <a href="${url}">${new URL(url).host}</a></p>`,
  });
}

export { handler as GET, handler as POST }
