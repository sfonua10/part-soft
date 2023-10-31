import Vendor from "@/models/vendor";
import User from "@/models/user";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return new Response(JSON.stringify({ message: 'User ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!user.organizationId) {
            return new Response(JSON.stringify({ message: 'User is not associated with any organization' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const vendors = await Vendor.find({ organizationId: user.organizationId });

        return new Response(JSON.stringify(vendors), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error fetching vendors:", error.message);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
