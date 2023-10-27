# PartSoft

PartSoft is a [Tailwind UI](https://tailwindui.com) site template built using [Tailwind CSS](https://tailwindcss.com) and [Next.js](https://nextjs.org).

## Getting started

To get started with this template, first install the npm dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

After starting the development server, if you need to expose your local server for the Twilio webhook using `ngrok`:

1. Downlad and install `ngrok`
2. In a new terminal window, navigate to the location where you have `ngrok` and run:

```bash
./ngrok http 3000
```

This will provide you with a public URL, e.g., `https://4135-170-39-98-183.ngrok-free.app`.

## Setting Up the Twilio Webhook

For local development, when you want to test Twilio message responses:

1. Log in to your Twilio account (ask me for credentials).
2. Navigate to the Phone Numbers section and select the number you're working with.
3. Locate the section labeled A message comes in.
4. Under Webhook, update the URL field with your ngrok URL followed by your incoming message endpoint. E.g., if your ngrok URL is `https://4135-170-39-98-183.ngrok-free.app`, you'd enter: https://4135-170-39-98-183.ngrok-free.app/api/incoming-sms-2 (or whatever api route endpoint path it is that listens for messages).
5. Save your changes.

Now, when Twilio receives a message on your number, it will forwarda it to your local development environment via the ngrok URL.

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Customizing

You can start editing this template by modifying the files in the `/src` folder. The site will auto-update as you edit these files.

## License

This site template is a commercial product and is licensed under the [Tailwind UI license](https://tailwindui.com/license).

## Learn more

To learn more about the technologies used in this site template, see the following resources:

- [Tailwind CSS](https://tailwindcss.com/docs) - the official Tailwind CSS documentation
- [Next.js](https://nextjs.org/docs) - the official Next.js documentation
- [Headless UI](https://headlessui.dev) - the official Headless UI documentation
