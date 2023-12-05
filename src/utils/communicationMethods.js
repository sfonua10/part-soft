import axios from 'axios';

export const sendCommunication = async (method, vendorData, organizationName) => {
    let endpoint;
    let payload;

    switch(method) {
        case 'sms':
            endpoint = "/api/send-sms-2";
            payload = {
                _id: vendorData._id,
                workOrderNumber: vendorData.workOrderNumber,
                vehicle: vendorData.vehicle,
                organizationName: organizationName,
                part: {
                    _id: vendorData.parts._id,
                    partName: vendorData.parts.partName,
                    partNumber: vendorData.parts.partNumber,
                },
                vendors: vendorData.vendors,
            };
            break;
        
        case 'email':
            endpoint = "/api/send-email";
            payload = { vendorData, organizationName };
            break;
        // Add other cases as needed
        default:
            throw new Error(`Unsupported communication method: ${method}`);
    }

    try {
        const response = await axios.post(endpoint, payload, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if(response.status !== 200) {
            throw new Error("Failed to send communication.");
        }

        return response.data;
    } catch (error) {
        console.error("Error in sendCommunication:", error);
        throw new Error(error.response ? error.response.data : error.message);
    }
    
};
