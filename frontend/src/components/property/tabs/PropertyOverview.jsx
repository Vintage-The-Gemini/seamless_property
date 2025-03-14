export const PropertyOverview = ({ stats, onEditProperty }) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Property Summary</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Total Units</dt>
                <dd className="font-medium">{stats.totalUnits}</dd>
              </div>
              {/* Other stats */}
            </dl>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            {/* Quick actions */}
          </div>
        </div>
      </div>
    );
  };