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
    // Later connect with backend
    console.log(settings);

    toast.success("Settings Saved Successfully");
  };

  return (
    <div className="p-6 text-slate-900 dark:text-white">

      <h1 className="text-2xl sm:text-3xl font-bold mb-8">
        Application Settings
      </h1>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-transparent dark:border-slate-700 p-8 max-w-4xl">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Website Name */}

          <div>
            <label className="font-semibold">
              Website Name
            </label>

            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dogra-maroon"
            />
          </div>

          {/* Support Email */}

          <div>
            <label className="font-semibold">
              Support Email
            </label>

            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dogra-maroon"
            />
          </div>

          {/* Support Phone */}

          <div>
            <label className="font-semibold">
              Support Phone
            </label>

            <input
              type="text"
              name="supportPhone"
              value={settings.supportPhone}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dogra-maroon"
            />
          </div>

          {/* Delivery Fee */}

          <div>
            <label className="font-semibold">
              Delivery Fee (₹)
            </label>

            <input
              type="number"
              name="deliveryFee"
              value={settings.deliveryFee}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dogra-maroon"
            />
          </div>

          {/* Minimum Order */}

          <div>
            <label className="font-semibold">
              Minimum Order (₹)
            </label>

            <input
              type="number"
              name="minOrderAmount"
              value={settings.minOrderAmount}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dogra-maroon"
            />
          </div>

          {/* GST */}

          <div>
            <label className="font-semibold">
              GST (%)
            </label>

            <input
              type="number"
              name="gst"
              value={settings.gst}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dogra-maroon"
            />
          </div>

        </div>

        {/* Maintenance Mode */}

        <div className="mt-8 flex items-center gap-4">

          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
            className="w-5 h-5 accent-dogra-maroon"
          />

          <label className="font-semibold">
            Enable Maintenance Mode
          </label>

        </div>

        {/* Save Button */}

        <button
          onClick={saveSettings}
          className="mt-8 bg-dogra-maroon hover:bg-red-900 text-white px-8 py-3 rounded-xl transition shadow-lg"
        >
          Save Settings
        </button>

      </div>

    </div>
  );
};

export default Settings;