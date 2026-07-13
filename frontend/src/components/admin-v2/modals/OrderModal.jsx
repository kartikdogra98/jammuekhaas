const OrderModal = ({ order, onClose }) => {
    if (!order) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
  
        <div className="bg-white rounded-2xl w-[900px] p-8">
  
          <div className="flex justify-between">
  
            <h2 className="text-3xl font-bold">
  
              Order #{order.orderNumber}
  
            </h2>
  
            <button onClick={onClose}>
              ✖
            </button>
  
          </div>
  
          <div className="grid grid-cols-2 gap-8 mt-8">
  
            <div>
  
              <h3 className="font-bold mb-2">
  
                Customer
  
              </h3>
  
              <p>{order.user?.name}</p>
  
              <p>{order.user?.email}</p>
  
              <p>{order.deliveryAddress.phone}</p>
  
            </div>
  
            <div>
  
              <h3 className="font-bold mb-2">
  
                Restaurant
  
              </h3>
  
              <p>{order.restaurant?.name}</p>
  
              <p>{order.paymentMethod}</p>
  
              <p>{order.paymentStatus}</p>
  
            </div>
  
          </div>
  
          <div className="mt-10">
  
            <h3 className="font-bold mb-4">
  
              Ordered Items
  
            </h3>
  
            <table className="w-full">
  
              <thead>
  
                <tr>
  
                  <th>Name</th>
  
                  <th>Qty</th>
  
                  <th>Price</th>
  
                </tr>
  
              </thead>
  
              <tbody>
  
                {order.items.map((item) => (
  
                  <tr key={item._id}>
  
                    <td>{item.name}</td>
  
                    <td>{item.quantity}</td>
  
                    <td>₹ {item.price}</td>
  
                  </tr>
  
                ))}
  
              </tbody>
  
            </table>
  
          </div>
  
          <div className="text-right mt-8 text-2xl font-bold">
  
            Total ₹ {order.total}
  
          </div>
  
        </div>
  
      </div>
    );
  };
  
  export default OrderModal;