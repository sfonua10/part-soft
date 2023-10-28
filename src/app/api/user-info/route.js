import User from "@/models/user";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const userEmail = url.searchParams.get('email');

        let user;

        if (userId) {
            user = await User.findById(userId);
        } else if (userEmail) {
            user = await User.findOne({ email: userEmail });
        }

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify(user), { status: 200 });

    } catch (error) {
        console.error("Error fetching user:", error.message);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
        });
    }
}
