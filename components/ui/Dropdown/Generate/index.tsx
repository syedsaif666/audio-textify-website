'use client';

import React, { useState } from 'react';
import Dropdown from '@/components/ui/Dropdown';

const documentType = ['Convert to .doc', 'Convert to .pdf'];

const Generate: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('');

  const handleTypeSelect = (selectedType: string) => {
    setSelectedType(selectedType);
  };

  return (
    <Dropdown
    options={documentType}
    selectedOption={selectedType}
    onSelect={(selectedOption: string) => handleTypeSelect(selectedOption)}
    buttonIcon={
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M11.25 3.9375C12.5962 3.9375 13.6875 2.8462 13.6875 1.5H14.8125C14.8125 2.8462 15.9038 3.9375 17.25 3.9375V5.0625C15.9038 5.0625 14.8125 6.1538 14.8125 7.5H13.6875C13.6875 6.1538 12.5962 5.0625 11.25 5.0625V3.9375ZM3 5.25C3 4.42157 3.67157 3.75 4.5 3.75H9.75V2.25H4.5C2.84314 2.25 1.5 3.59314 1.5 5.25V12.75C1.5 14.4068 2.84314 15.75 4.5 15.75H13.5C15.1568 15.75 16.5 14.4068 16.5 12.75V9H15V12.75C15 13.5785 14.3285 14.25 13.5 14.25H4.5C3.67157 14.25 3 13.5785 3 12.75V5.25Z" fill="#697177"/>
      </svg>
    }
    buttonText="Generate"
  />
  );
};

export default Generate;
