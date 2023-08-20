import Vendor from "@/models/vendor";

export async function GET() {
    try {
      const vendors = await Vendor.find({});
      return new Response(JSON.stringify(vendors), { status: 200 });
    } catch (error) {
      console.error("Error fetching vendors:", error.message);
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      });
    }
  }
  