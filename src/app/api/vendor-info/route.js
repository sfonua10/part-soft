// import Vendor from "@/models/vendor";

// export async function GET(request) {
//     try {
//       //Get the activeOnly query parameter from the request
//       const url = new URL(request?.url);
//       const activeOnly = url.searchParams.get('activeOnly');

//       let query = {};

//       if (activeOnly === 'true') {
//         query.isActive = true;
//       }

//       const vendors = await Vendor.find(query);
      
//       return new Response(JSON.stringify(vendors), { status: 200 });
//     } catch (error) {
//       console.error("Error fetching vendors:", error.message);
//       return new Response(JSON.stringify({ message: error.message }), {
//         status: 500,
//       });
//     }
//   }
  
import Vendor from "@/models/vendor";

export async function GET() {
    try {
        // Since you're not using activeOnly, you can query all vendors directly
        const vendors = await Vendor.find();
      
        return new Response(JSON.stringify(vendors), { status: 200 });
    } catch (error) {
        console.error("Error fetching vendors:", error.message);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
        });
    }
}
