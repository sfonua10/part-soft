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
