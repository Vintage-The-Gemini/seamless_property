// Add to state declarations
const [expenses, setExpenses] = useState([]);
const [showExpenseModal, setShowExpenseModal] = useState(false);

// Add this type for expenses
const expenseTypes = [
  'Maintenance',
  'Utilities',
  'Insurance',
  'Property Tax',
  'Staff Salary',
  'Other'
];

// Create ExpenseModal component
const ExpenseModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'Maintenance',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Record Expense</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full rounded-lg"
              >
                {expenseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full rounded-lg"
                rows="3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};