export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg rounded-lg p-6 border border-blue-500">
          <h2 className="text-sm font-semibold text-blue-100 mb-2">Users</h2>
          <p className="text-4xl font-bold text-white">120</p>
          <p className="text-xs text-blue-200 mt-2">+8% from last month</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-700 shadow-lg rounded-lg p-6 border border-green-500">
          <h2 className="text-sm font-semibold text-green-100 mb-2">Orders</h2>
          <p className="text-4xl font-bold text-white">75</p>
          <p className="text-xs text-green-200 mt-2">+5% from last month</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg rounded-lg p-6 border border-purple-500">
          <h2 className="text-sm font-semibold text-purple-100 mb-2">Revenue</h2>
          <p className="text-4xl font-bold text-white">$12,400</p>
          <p className="text-xs text-purple-200 mt-2">+12% from last month</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg rounded-lg p-6 border border-orange-500">
          <h2 className="text-sm font-semibold text-orange-100 mb-2">Products</h2>
          <p className="text-4xl font-bold text-white">42</p>
          <p className="text-xs text-orange-200 mt-2">+3% from last month</p>
        </div>
      </div>
    </div>
  );
}
