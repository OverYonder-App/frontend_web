"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UIErrorMessage } from "@/components/UIErrorComponent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AddInstitutionForm from "@/features/institutions/components/AddInstitutionForm";
import UserOnboardingForm from "@/features/users/components/UserOnboardingForm";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [userEmail, setUserEmail] = useState<string>("gerald.akorli@gmail.com"); // Replace with actual user email from auth
  const [institutionStatus, setInstitutionStatus] = useState<
    "checking" | "found" | "not_found"
  >("not_found");
  const [isAdminChoice, setIsAdminChoice] = useState<null | boolean>(null);
  const [adminForm, setAdminForm] = useState({
    schoolName: "",
    schoolDomain: "",
  });
  const [studentDirectorEmail, setStudentDirectorEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUserEmail(user?.email || "")
    const checkInstitution = async () => {
      const domain = user?.email.split("@")[1];

      console.log(domain);
      try {
        if (!loading) {
          const res = await fetch(
            `api/institution_domains/check?domain=${domain}`
          );
          const data = await res.json();
          setInstitutionStatus(data.exists ? "found" : "not_found");
          // if (data.exists) {
          //   router.push(`/onboarding/${domain.split(".")[0]}`); // student or faculty
          // }}
        }
      } catch (e) {
        setError("Failed to verify your institution");
        console.log(e)
      }
    };
    checkInstitution();
  }, [user, router,loading]);

  const handleAdminSubmit = async () => {
    try {
      const res = await fetch("/api/institutions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...adminForm,
          adminEmail: userEmail,
        }),
      });
      if (!res.ok) throw new Error("Failed to onboard institution");
      router.push("/dashboard"); // proceed to admin dashboard
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleStudentSubmit = async () => {
    try {
      await fetch("/api/institutions/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          directorEmail: studentDirectorEmail,
        }),
      });
      router.push("/thank-you");
    } catch (err) {
      setError("Error submitting request");
      console.log(err)
    }
  };

  if (institutionStatus === "checking")
    return <p>Verifying your institution...</p>;

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold text-[#745296] mb-4">
        Welcome to OverYonder 🎓
      </h1>

      {institutionStatus === "not_found" && isAdminChoice === null && (
        <>
          <p className="mb-4">
            We couldn&apos;t find your institution. Are you an administrator?
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setIsAdminChoice(true)}>
              Yes, I&apos;m an Admin
            </Button>
            <Button variant="outline" onClick={() => setIsAdminChoice(false)}>
              No, I&apos;m a Student/Faculty
            </Button>
          </div>
        </>
      )}
      {/* //TODO: */}
      {/* show form for onboarding your student/faculty/student leader if user email matches the faculty email in instuition_domain in db we give them the option to select their role based on the institution_domains table 
      if they are a student they can either choose student or student leader  */}
      {institutionStatus === "found" && isAdminChoice === null && (
        <UserOnboardingForm />
      )}

      {isAdminChoice === true && <AddInstitutionForm />}

      {institutionStatus === "not_found" && isAdminChoice === false && (
        <div className="mt-6 space-y-4 text-left">
          <h2 className="text-lg font-semibold text-[#745296]">
            Get Your School Onboarded
          </h2>
          <p>
            We will send an email to your Student Involvement Director or
            equivalent to onboard your college.
          </p>
          <input
            type="email"
            placeholder="Student Involvement Director Email"
            value={studentDirectorEmail}
            onChange={(e) => setStudentDirectorEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <Button
            className="w-full bg-[#745296] text-white"
            onClick={handleStudentSubmit}
          >
            Request Access
          </Button>
        </div>
      )}

      <UIErrorMessage message={error} />
    </div>
  );
}
