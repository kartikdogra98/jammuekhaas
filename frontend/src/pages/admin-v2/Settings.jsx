import { useState } from "react";
import toast from "react-hot-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: "Jammu-e-Khaas",
    supportEmail: "support@jammuekhaas.com",
    supportPhone: "+91 9876543210",
    deliveryFee: 30,
    minOrderAmount: 100,
    gst: 5,
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveSettings = () => {
    // Later connect this with backend
    console.log(settings);

    toast.success("Settings Saved Successfully");
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Application Settings
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="font-semibold">
              Website Name
            </label>

            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Support Email
            </label>

            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Support Phone
            </label>

            <input
              type="text"
              name="supportPhone"
              value={settings.supportPhone}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Delivery Fee (₹)
            </label>

            <input
              type="number"
              name="deliveryFee"
              value={settings.deliveryFee}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Minimum Order (₹)
            </label>

            <input
              type="number"
              name="minOrderAmount"
              value={settings.minOrderAmount}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              GST (%)
            </label>

            <input
              type="number"
              name="gst"
              value={settings.gst}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

        </div>

        <div className="mt-8 flex items-center gap-4">

          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
          />

          <label className="font-semibold">
            Enable Maintenance Mode
          </label>

        </div>

        <button
          onClick={saveSettings}
          className="mt-8 bg-dogra-maroon text-white px-8 py-3 rounded-xl hover:bg-red-900 transition"
        >
          Save Settings
        </button>

      </div>

    </div>
  );
};

export default Settings;