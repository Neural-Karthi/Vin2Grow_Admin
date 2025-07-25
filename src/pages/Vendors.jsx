import { useEffect, useState } from "react";
import adminApi from "../services/api";

const CATEGORY_OPTIONS = [

  "Sanchi Stupa",
  "Warli House",
  "Tiger Crafting",
  "Bamboo Peacock",
  "Miniaure Ship",
  "Bamboo Trophy",
  "Bamboo Ganesha",
  "Bamboo Swords",
  "Tribal Mask -1",
  "Tribal Mask -2",
  "Bamboo Dry Fruit Tray",
  "Bamboo Tissue Paper Holder",
  "Bamboo Strip Tray",
  "Bamboo Mobile Booster",
  "Bamboo Card-Pen Holder"
];

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", category: [] });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState({ field: "", message: "" });
  const [formSuccess, setFormSuccess] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.vendors.getAll();
      setVendors(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, options } = e.target;
    if (type === "select-multiple") {
      const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
      setForm(f => ({ ...f, [name]: selected }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError({ field: "", message: "" });
    setFormSuccess("");
    try {
      await adminApi.vendors.create(form);
      setFormSuccess("Vendor created successfully!");
      setForm({ name: "", email: "", password: "", category: [] });
      setDialogOpen(false);
      fetchVendors();
    } catch (err) {
      const backendError = err.response?.data?.error || "Failed to create vendor";
      if (backendError.includes("already exists")) {
        setFormError({ field: "email", message: "A vendor with this email already exists." });
      } else {
        setFormError({ field: "general", message: backendError });
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    setDeletingId(id);
    try {
      await adminApi.vendors.delete(id);
      fetchVendors();
    } catch (err) {
      alert('Failed to delete vendor.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-700">Vendors</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow"
          onClick={() => setDialogOpen(true)}
        >
          + Add Vendor
        </button>
      </div>
      {/* Add Vendor Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setDialogOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-2">Add New Vendor</h3>
            <form onSubmit={handleFormSubmit} autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2"
                    required
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    className={`w-full border rounded px-3 py-2 ${formError.field === 'email' ? 'border-red-500' : ''}`}
                    required
                    autoComplete="off"
                  />
                  {formError.field === 'email' && (
                    <div className="text-red-500 text-sm mt-1">{formError.message}</div>
                  )}
                </div>
                <div className="relative">
                  <label className="block mb-1 font-medium">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 pr-10"
                    required
                    autoComplete="new-password"
                  />
                  <span
                    className="absolute right-2 top-0 bottom-0 my-auto flex items-center h-full cursor-pointer text-gray-500 hover:text-green-600"
                    style={{ height: '2.5rem' }}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      // Eye-off SVG
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.664-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 2.21-.715 4.25-1.925 5.925M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    ) : (
                      // Eye SVG
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </span>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Categories</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-32 overflow-y-auto border rounded px-3 py-2 bg-white">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <label key={cat} className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          name="category"
                          value={cat}
                          checked={form.category.includes(cat)}
                          onChange={e => {
                            setForm(f => {
                              if (e.target.checked) {
                                return { ...f, category: [...f.category, cat] };
                              } else {
                                return { ...f, category: f.category.filter(c => c !== cat) };
                              }
                            });
                          }}
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">Select one or more categories</span>
                </div>
              </div>
              {formError.field === 'general' && <div className="text-red-500 mt-2">{formError.message}</div>}
              {formSuccess && <div className="text-green-600 mt-2">{formSuccess}</div>}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={formLoading}
                >
                  {formLoading ? "Adding..." : "Add Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Vendor Table */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-green-100">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Categories</th>
                <th className="py-2 px-4 border-b">Active</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-green-50">
                  <td className="py-2 px-4 border-b font-medium">{vendor.name}</td>
                  <td className="py-2 px-4 border-b">{vendor.email}</td>
                  <td className="py-2 px-4 border-b">
                    {Array.isArray(vendor.category)
                      ? vendor.category.join(", ")
                      : vendor.category}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {vendor.isActive ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-500 font-semibold">No</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      className="text-red-600 hover:text-red-800 font-bold px-2 py-1 rounded disabled:opacity-50"
                      onClick={() => handleDelete(vendor._id)}
                      disabled={deletingId === vendor._id}
                      title="Delete Vendor"
                    >
                      {deletingId === vendor._id ? (
                        <svg className="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Vendors; 