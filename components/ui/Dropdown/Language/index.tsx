'use client';

import React, { useState } from 'react';
import Dropdown from '@/components/ui/Dropdown';

const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

const Language: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const handleLanguageSelect = (selectedLanguage: string) => {
    setSelectedLanguage(selectedLanguage);
  };

  return (
    <Dropdown
      options={languages}
      selectedOption={selectedLanguage}
      onSelect={(selectedOption: string) => handleLanguageSelect(selectedOption)}
      buttonIcon={
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5ZM7.28252 14.7506C6.56057 13.2194 6.11799 11.5307 6.02048 9.75H3.04642C3.3435 12.1324 5.03729 14.081 7.28252 14.7506ZM7.52302 9.75C7.63582 11.5791 8.15835 13.2973 9 14.814C9.84165 13.2973 10.3642 11.5791 10.477 9.75H7.52302ZM14.9536 9.75H11.9795C11.882 11.5307 11.4395 13.2194 10.7175 14.7506C12.9627 14.081 14.6565 12.1324 14.9536 9.75ZM3.04642 8.25H6.02048C6.11799 6.46933 6.56057 4.78055 7.28252 3.24942C5.03729 3.919 3.3435 5.86762 3.04642 8.25ZM7.52302 8.25H10.477C10.3642 6.42092 9.84165 4.70269 9 3.18599C8.15835 4.70269 7.63582 6.42092 7.52302 8.25ZM10.7175 3.24942C11.4395 4.78055 11.882 6.46933 11.9795 8.25H14.9536C14.6565 5.86762 12.9627 3.919 10.7175 3.24942Z" fill="#697177"/>
        </svg>
      }
      buttonText="Language"
    />
  );
};

export default Language;
