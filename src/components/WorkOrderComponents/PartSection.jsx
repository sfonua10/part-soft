'use client'
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { PartTable } from "./PartTable";

export function PartSection({ part }) {
  const [showPartTable, setShowPartTable] = useState(true);

  return (
    <div key={part.partNumber} className="part-section">
      <h3 className="mt-2 flex items-center space-x-2 text-xs">
        <span>{part.partName} - {part.partNumber}</span>
        {showPartTable ? 
          <EyeSlashIcon className="h-5 w-5 cursor-pointer" onClick={() => setShowPartTable(false)} /> 
          :
          <EyeIcon className="h-5 w-5 cursor-pointer" onClick={() => setShowPartTable(true)} />
        }
      </h3>
      {showPartTable && <PartTable responses={part.vendorResponses} />}
    </div>
  );
}
