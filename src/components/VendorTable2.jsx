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
    
      return (
        <div className="px-4 sm:px-6 lg:px-8 rounded-md border border-gray-200">
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