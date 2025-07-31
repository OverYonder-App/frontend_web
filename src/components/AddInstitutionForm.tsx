import { useState } from "react";
import { Button } from "@/components/ui/button"; // adjust if different path
import { Toast } from "./Toast";

export default function AddInstitutionForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    institutionName: "",
    abbreviatedName: "",
    address: "",
    schoolDomain: "",
    domainType: "Student", // or "faculty"
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async () => {
    try {
      // 1. Create institution
      const res1 = await fetch("/api/institutions/create", {
        method: "POST",
        body: JSON.stringify({
          institution_name: form.institutionName,
          abbreviated_name: form.abbreviatedName,
          address: form.address,
        }),
      });
      const institution = await res1.json();

      // 2. Add institution domain
      await fetch("/api/institution_domains/create", {
        method: "POST",
        body: JSON.stringify({
          domain: form.schoolDomain,
          institution_id: institution.institution_id,
          type_category: form.domainType,
        }),
      });

      setToast({ msg: "Institution created!", type: "success" });
    } catch (e) {
      setToast({ msg: (e as Error).message, type: "error" });
    }
  };

  return (
    <div className="mt-6 space-y-6 text-left">
      <h2 className="text-lg font-semibold text-[#745296]">
        {step === 1 ? "Institution Info" : "Institution Domain"}
      </h2>

      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="Institution Name"
            value={form.institutionName}
            onChange={(e) =>
              setForm({ ...form, institutionName: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Abbreviated Name (e.g. UofI)"
            value={form.abbreviatedName}
            onChange={(e) =>
              setForm({ ...form, abbreviatedName: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Address (optional)"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
          <Button
            className="w-full bg-[#745296] text-white"
            onClick={handleNext}
          >
            Next
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="School Domain (e.g. college.edu)"
            value={form.schoolDomain}
            onChange={(e) => setForm({ ...form, schoolDomain: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
          <select
            value={form.domainType}
            onChange={(e) => setForm({ ...form, domainType: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="Student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
          <div className="flex justify-between gap-4">
            <Button
              onClick={handleBack}
              className="w-1/2 border border-gray-300"
            >
              Back
            </Button>
            <Button
              className="w-1/2 bg-[#745296] text-white"
              onClick={handleSubmit}
            >
              Submit & Become Admin
            </Button>
          </div>
        </>
      )}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
