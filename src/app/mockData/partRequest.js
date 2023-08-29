// export const data = [
//     {
//       "partRequest": {
//         "workOrderNumber": "12345",
//         "partName": "Brake Pad",
//         "partNumber": "BP2020FDM",
//         "make": "Ford",
//         "model": "Mustang",
//         "year": "2020",
//         "vin": "XXXXXXXX"
//       },
//       "vendorResponses": [
//         {
//           "_id": "vendor_a_id",
//           "vendorName": "Vendor A",
//           "availability": "In Stock",
//           "orderStatus": "Pending",
//           "price": 50,
//           "delivery": "5 days",
//           "partAvailable": "yes"
//         },
//         {
//           "_id": "vendor_b_id",
//           "vendorName": "Vendor B",
//           "availability": "Out of Stock",
//           "orderStatus": "N/A",
//           "price": "N/A",
//           "delivery": "N/A",
//           "partAvailable": "no"
//         },
//         {
//           "_id": "vendor_c_id",
//           "vendorName": "Vendor C",
//           "availability": "In Stock",
//           "orderStatus": "Confirmed",
//           "price": 45,
//           "delivery": "7 days",
//           "partAvailable": "yes"
//         }
//       ]
//     },
//     {
//       "partRequest": {
//         "workOrderNumber": "67890",
//         "partName": "Oil Filter",
//        "partNumber": "SP2021FXL",
//         "make": "Honda",
//         "model": "Civic",
//         "year": "2019",
//         "vin": "YYYYYYYY"
//       },
//       "vendorResponses": [
//         {
//           "_id": "vendor_a_id",
//           "vendorName": "Vendor A",
//           "availability": "In Stock",
//           "orderStatus": "Confirmed",
//           "price": 15,
//           "delivery": "3 days",
//           "partAvailable": "yes"
//         },
//         {
//           "_id": "vendor_d_id",
//           "vendorName": "Vendor D",
//           "availability": "Pending",
//           "orderStatus": "N/A",
//           "price": "N/A",
//           "delivery": "N/A",
//           "partAvailable": "N/A"
//         },
//         {
//           "_id": "vendor_e_id",
//           "vendorName": "Vendor E",
//           "availability": "Out of Stock",
//           "orderStatus": "Cancelled",
//           "price": "N/A",
//           "delivery": "N/A",
//           "partAvailable": "no"
//         }
//       ]
//     }
//   ]



export const myData = [
  {
    workOrderNumber: "WON12345",
    vehicle: {
      vin: "1HGBH41JXMN109186",
      make: "Honda",
      model: "Civic",
      year: 2020
    },
    parts: [
      {
        partNumber: "PN123",
        partName: "Front Bumper",
        responses: [
          {
            _id: "R1",
            vendorName: "Vendor A",
            availability: "In Stock",
            orderStatus: "Confirmed",
            price: 120.5,
            delivery: "2-3 days",
            partAvailable: "yes"
          },
          {
            _id: "R2",
            vendorName: "Vendor B",
            availability: "Out of Stock",
            orderStatus: "N/A",
            price: null,
            delivery: null,
            partAvailable: "no"
          }
        ]
      },
      {
        partNumber: "PN124",
        partName: "Rear Bumper",
        responses: [
          {
            _id: "R3",
            vendorName: "Vendor A",
            availability: "Pending",
            orderStatus: "Pending",
            price: null,
            delivery: "5-7 days",
            partAvailable: "N/A"
          }
        ]
      }
    ]
  },
  {
    workOrderNumber: "WON12346",
    vehicle: {
      vin: "5NPEB4AC6BH237519",
      make: "Hyundai",
      model: "Elantra",
      year: 2019
    },
    parts: [
      {
        partNumber: "PN125",
        partName: "Car Door",
        responses: [
          {
            _id: "R4",
            vendorName: "Vendor C",
            availability: "In Stock",
            orderStatus: "Confirmed",
            price: 220.75,
            delivery: "1-2 days",
            partAvailable: "yes"
          }
        ]
      }
    ]
  }
];

// export const myData = [
//   {
//     workOrderNumber: "WON12345",
//     parts: [
//       {
//         partNumber: "PN123",
//         partName: "Front Bumper",
//         vin: "1HGBH41JXMN109186",
//         make: "Honda",
//         model: "Civic",
//         year: 2020,
//         responses: [
//           {
//             _id: "R1",
//             vendorName: "Vendor A",
//             availability: "In Stock",
//             orderStatus: "Confirmed",
//             price: 120.5,
//             delivery: "2-3 days",
//             partAvailable: "yes"
//           },
//           {
//             _id: "R2",
//             vendorName: "Vendor B",
//             availability: "Out of Stock",
//             orderStatus: "N/A",
//             price: null,
//             delivery: null,
//             partAvailable: "no"
//           }
//         ]
//       },
//       {
//         partNumber: "PN124",
//         partName: "Rear Bumper",
//         vin: "1HGBH41JXMN109186",
//         make: "Honda",
//         model: "Civic",
//         year: 2020,
//         responses: [
//           {
//             _id: "R3",
//             vendorName: "Vendor A",
//             availability: "Pending",
//             orderStatus: "Pending",
//             price: null,
//             delivery: "5-7 days",
//             partAvailable: "N/A"
//           }
//         ]
//       }
//     ]
//   },
//   {
//     workOrderNumber: "WON12346",
//     parts: [
//       {
//         partNumber: "PN125",
//         partName: "Car Door",
//         vin: "5NPEB4AC6BH237519",
//         make: "Hyundai",
//         model: "Elantra",
//         year: 2019,
//         responses: [
//           {
//             _id: "R4",
//             vendorName: "Vendor C",
//             availability: "In Stock",
//             orderStatus: "Confirmed",
//             price: 220.75,
//             delivery: "1-2 days",
//             partAvailable: "yes"
//           }
//         ]
//       }
//     ]
//   }
// ];
