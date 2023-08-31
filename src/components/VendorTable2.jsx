'use client'
import { useState } from 'react'
import { WorkOrderHeader } from './WorkOrderComponents/WorkOrderHeader'
import { PartSection } from './WorkOrderComponents/PartSection'

export default function VendorTable2({ data }) {
    const initialShowWorkOrdersState = data?.reduce((acc, order) => {
        acc[order.workOrderNumber] = false;
        return acc;
      }, {});
    
      const [showWorkOrdersState, setShowWorkOrdersState] = useState(initialShowWorkOrdersState);
    
      const toggleWorkOrder = (workOrderNumber) => {
        setShowWorkOrdersState(prevState => ({
          ...prevState,
          [workOrderNumber]: !prevState?.[workOrderNumber]
        }));
      };
    
      const deleteAllWorkOrders = async () => {
        try {
          const response = await fetch('/api/delete-all-workorders', {
            method: 'DELETE',
            header: {
              'Content-Type': 'application/json'
            }
          })

          const result = await response.json();
          if(response.ok) {
            console.log(result.message)
          } else {
            console.error('Error deleting work orders:', result.message);

          }
        } catch (error) {
          console.error('Error deleting work orders:', error.message);

        }
      }
      return (
        <div className="px-4 sm:px-6 lg:px-8 rounded-md border border-gray-200">
          {/* <button onClick={deleteAllWorkOrders}>Delete all workorders</button> */}
          {data?.map((order) => (
            <div key={order.workOrderNumber} className="mb-6">
              <WorkOrderHeader 
                order={order} 
                showWorkOrder={showWorkOrdersState?.[order.workOrderNumber]} 
                toggleWorkOrder={toggleWorkOrder}
              />
              {showWorkOrdersState?.[order.workOrderNumber] && order.parts.map((part) => <PartSection part={part} key={part.partNumber} />)}
              {/* <hr className="mb-4 mt-4" /> */}
            </div>
          ))}
        </div>
      );
  }