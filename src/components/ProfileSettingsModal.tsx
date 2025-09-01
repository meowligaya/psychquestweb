import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export default function ProfileSettingsModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ userName: user?.userName || "", email: user?.email || "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    await updateProfile(form); // update via context/api
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-6 w-80 sm:w-96">
        <h2 className="mb-4 font-bold text-xl">Profile Settings</h2>
        <div className="mb-3">
          <label className="block mb-1 text-sm">Username</label>
          <input name="userName" value={form.userName} onChange={handleChange} className="input" />
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="input" />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Dialog>
  );
}