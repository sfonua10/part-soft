import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Email from 'next-auth/providers/email'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import User from '@/models/user'
import { connectToDB } from '@/utils/database'
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
      from: process.env.EMAIL_FROM || 'saiafonua@gmail.com',
      sendVerificationRequest: sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session?.user?.email) {
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
          session.user.role = sessionUser.role;
          session.user.name = sessionUser.name;
          session.user.image = sessionUser.image;
          session.user.organizationId =  sessionUser.organizationId || null;
          session.user.organizationName = sessionUser.organizationName;
        } else {
          console.error('No user found in database');
        }
      } else {
        console.error('No email found in session user');
      }
    
      return session;
    },
    async signIn({ account, profile, user, error }) {
      try {
        await connectToDB()

        if (error) {
          console.error('Signin error: ', error)
          return false
        }

        // Set default values
        let email = ''
        let name = ''
        let picture = ''
        let organizationId = ''
        // Check if the provider is google
        if (account.provider === 'google') {
          email = profile.email
          name = profile.name
          picture = profile.picture
        } else if (!profile && user) {
          // Fall back to the user object when profile is undefined
          email = user.email
          name = user.name || ''
          picture = user.image || ''
        }

        // Restrict access based on the email domain
        if (
          !specificAllowedEmails.includes(email) &&
          !email.endsWith('@uniteddieselservice.net')
        ) {
          console.error('Email not allowed for sign-in')
          return false
        }

        // Check if the user email exists in the database
        if (email) {
          const userExists = await User.findOne({ email })
          // If user does not exist, create a new user in MongoDB
          if (!userExists) {
            const newUser = {
              email,
              username: name?.replace(' ', '').toLowerCase(),
              image: picture,
              name: name,
            }

            if (organizationId) {
              newUser.organizationId = organizationId
              newUser.organizationName = organizationName
            }

            await User.create(newUser)
          }
        } else {
          console.error('No email found')
          return false
        }

        return true
      } catch (error) {
        console.error('Error checking if user exists: ', error.message)
        return false
      }
    },
  },
})

async function sendVerificationRequest({ identifier: email, url, provider }) {
  const { host } = new URL(url)
  const transport = createTransport(provider.server)
  await transport.sendMail({
    to: email,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host }),
  })
}

function html({ url, host }) {
  const escapedHost = host.replace(/\./g, '&#8203;.')
  return `
  <div style="background-color: #f0f0f0; padding: 20px; display: flex; justify-content: center; align-items: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
  <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); max-width: 600px; width: 100%; margin: auto;">
    <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 20px; text-align: center;">
      Welcome to ${escapedHost}
    </h1>
    <p style="color: #333333; margin-bottom: 20px; font-size: 18px; text-align: center;">
      You can log into PartSoft by clicking the link below:
    </p>
    <a href="${url}" target="_blank" style="display: block; text-align: center; background-color: #2563EB; color: #ffffff; padding: 14px 20px; border-radius: 8px; text-decoration: none; margin-bottom: 20px; font-weight: bold; font-size: 16px; margin: 0 auto; max-width: 200px;">
      Click to log in
    </a>
    <p style="color: #333333; font-size: 16px; text-align: center;">
      This platform uses "passwordless login". This is more secure, and hopefully more convenient—no more passwords to remember!
    </p>
  </div>
</div>

  `
}

function text({ url, host }) {
  return `Sign in to ${host}\n${url}\n\n`
}
export { handler as GET, handler as POST }
