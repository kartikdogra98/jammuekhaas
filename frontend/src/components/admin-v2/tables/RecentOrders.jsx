const orders = [
    {
      id: "#1001",
      customer: "Rahul Sharma",
      restaurant: "Dogra Chicken Corner",
      amount: "₹580",
      status: "Delivered",
    },
    {
      id: "#1002",
      customer: "Priya Singh",
      restaurant: "Punjab Tadka",
      amount: "₹420",
      status: "Preparing",
    },
    {
      id: "#1003",
      customer: "Aman Gupta",
      restaurant: "Wazwan House",
      amount: "₹850",
      status: "Pending",
    },
    {
      id: "#1004",
      customer: "Neha Kapoor",
      restaurant: "Chai & Chill Café",
      amount: "₹240",
      status: "Delivered",
    },
  ];
  
  const statusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Preparing":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };
  
  const RecentOrders = () => {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
  
        <h2 className="text-2xl font-semibold mb-6">
          Recent Orders
        </h2>
  
        <div className="overflow-x-auto">
  
          <table className="w-full">
  
            <thead>
  
              <tr className="border-b">
  
                <th className="py-3 text-left">Order ID</th>
  
                <th className="py-3 text-left">Customer</th>
  
                <th className="py-3 text-left">Restaurant</th>
  
                <th className="py-3 text-left">Amount</th>
  
                <th className="py-3 text-left">Status</th>
  
              </tr>
  
            </thead>
  
            <tbody>
  
              {orders.map((order) => (
  
                <tr key={order.id} className="border-b hover:bg-gray-50">
  
                  <td className="py-4">{order.id}</td>
  
                  <td>{order.customer}</td>
  
                  <td>{order.restaurant}</td>
  
                  <td>{order.amount}</td>
  
                  <td>
  
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
  
                  </td>
  
                </tr>
  
              ))}
  
            </tbody>
  
          </table>
  
        </div>
  
      </div>
    );
  };
  
  export default RecentOrders;