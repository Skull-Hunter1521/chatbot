
import React, { useState } from 'react';
import { MenuOption } from '../types';

interface MenuOptionsProps {
  options: MenuOption[];
  onSelect: (key: string, label: string) => void;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({ options, onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: MenuOption) => {
    if (!selected) {
      setSelected(option.key);
      onSelect(option.key, option.label);
    }
  };

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => handleSelect(option)}
          disabled={!!selected}
          className={`
            px-4 py-2 text-sm font-medium rounded-full border transition-colors duration-200
            ${selected === option.key
              ? 'bg-blue-500 border-blue-500 text-white'
              : selected
                ? 'bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default MenuOptions;
