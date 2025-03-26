// src/components/ui/Card.jsx
// Purpose: Reusable card component that respects the current theme
// Usage: Wrap content in this component to display it in a themed card

const Card = ({ title, children }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {title}
          </h2>
        )}
        <div className="text-gray-600 dark:text-gray-300">
          {children}
        </div>
      </div>
    );
  };
  
  export default Card;