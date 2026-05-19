"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import Image from "next/image";
import logo from "@/assets/LOGO.png";

const BUNNY_STORAGE_ZONE = "jobforn";
const BUNNY_ACCESS_KEY = "a6448947-c4f4-4310-a492000efc6f-0c88-42ed";
const BUNNY_HOSTNAME = "uk.storage.bunnycdn.com";
const BUNNY_PULL_ZONE_URL = "https://jobform-assets.b-cdn.net";

type EmployeeForm = Record<string, any>;

const formatValue = (value: any) => {
  if (value === undefined || value === null || value === "") return "———";
  return String(value).toUpperCase();
};

const SectionHeader = ({
  number,
  title,
  subText,
}: {
  number: string;
  title: string;
  subText?: string;
}) => (
  <div className="bg-[#dbdbdb] text-black border border-neutral-400 flex justify-between items-center px-4 py-2 mt-6 select-none block-section">
    <div className="flex gap-4 items-center">
      <span className="textxs font-black bg-black text-white px-2 py-0.5 rounded">
        {number}
      </span>
      <span className="text-[11px] font-black tracking-wider uppercase text-black">
        {title}
      </span>
    </div>

    {subText && (
      <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-tight">
        {subText}
      </span>
    )}
  </div>
);
const Field = ({
  label,
  value,
  required,
}: {
  label: string;
  value: any;
  required?: boolean;
}) => (
  <div className="flex flex-col border-b border-gray-300 py-1">
    <label className="text-[9px] font-bold text-gray-400 uppercase flex gap-0.5 leading-none mb-1">
      {label} {required && <span className="text-orange-600">*</span>}
    </label>
    <div className="text-[11px] font-semibold text-black min-h-[16px] uppercase">
      {formatValue(value)}
    </div>
  </div>
);

const ExactImageRow = ({ label, value }: { label: string; value: any }) => {
  const formatValueLocal = (val: any) => {
    if (val === undefined || val === null || val === "")
      return "_______________________";
    if (Array.isArray(val)) return val.join(", ");
    return String(val);
  };

  return (
    <div className="flex flex-col w-full min-h-[42px] h-full justify-between">
      <div className="bg-neutral-50 px-2.5 py-1.5 border-b border-neutral-200 select-none">
        <span className="text-[9px] font-black text-neutral-700 uppercase tracking-wider block">
          {label}
        </span>
      </div>

      <div className="px-2.5 py-2 bg-white text-[11px] font-black text-black uppercase tracking-wide break-words min-h-[24px] flex items-center">
        {formatValueLocal(value)}
      </div>
    </div>
  );
};

const Footer = ({ page, total = 4 }: { page: number; total?: number }) => (
  <div className="flex justify-between items-center text-[9px] text-gray-400 mt-6 pt-2 border-t border-gray-100 uppercase">
    <span>Khushi Media · Gujranwala, Pakistan</span>
    <span>
      KM-HR-001 · Page {page} of {total} · Confidential
    </span>
  </div>
);

export default function EmployeeFormView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [form, setForm] = useState<EmployeeForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [officerFile, setOfficerFile] = useState<File | null>(null);
  const [mgmtFile, setMgmtFile] = useState<File | null>(null);

  const [officerPreview, setOfficerPreview] = useState<string>("");
  const [mgmtPreview, setMgmtPreview] = useState<string>("");

  const [hrInfo, setHrInfo] = useState({
    hrReceivedBy: "",
    hrReceivedDate: "",
    hrVerified: "",
    hrFileNo: "",
    hrOfficerSign: "",
    hrMgmtSign: "",
  });

  const [employmentDetails, setEmploymentDetails] = useState({
    empId: "",
    joiningDate: "",
    designation: "",
    department: "",
    manager: "",
    empType: "",
    location: "",
    hours: "",
    probation: "",
    probationEnd: "",
    contractEnd: "",
    grossSalary: "",
    basicSalary: "",
    allowances: "",
    paymentMode: "",
  });

  const officerFileRef = useRef<HTMLInputElement>(null);
  const mgmtFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const docRef = doc(db as any, "employeeForms", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setForm(data);
          setHrInfo({
            hrReceivedBy: data.hrReceivedBy || "",
            hrReceivedDate: data.hrReceivedDate || "",
            hrVerified: data.hrVerified || "",
            hrFileNo: data.hrFileNo || "",
            hrOfficerSign: data.hrOfficerSign || "",
            hrMgmtSign: data.hrMgmtSign || "",
          });
          setEmploymentDetails({
            empId: data.empId || "",
            joiningDate: data.joiningDate || "",
            designation: data.designation || "",
            department: data.department || "",
            manager: data.manager || "",
            empType: data.empType || "",
            location: data.location || "",
            hours: data.hours || "",
            probation: data.probation || "",
            probationEnd: data.probationEnd || "",
            contractEnd: data.contractEnd || "",
            grossSalary: data.grossSalary || "",
            basicSalary: data.basicSalary || "",
            allowances: data.allowances || "",
            paymentMode: data.paymentMode || "",
          });
        }
      } catch (err) {
        console.error("Error fetching form:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const uploadToBunny = async (file: File) => {
    const fileName = `${id}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const uploadUrl = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/${fileName}`;

    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: BUNNY_ACCESS_KEY,
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) throw new Error("Upload failed");

    return `${BUNNY_PULL_ZONE_URL}/${fileName}`;
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "hrOfficerSign" | "hrMgmtSign",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview URL
    const previewUrl = URL.createObjectURL(file);

    if (field === "hrOfficerSign") {
      setOfficerFile(file);
      setOfficerPreview(previewUrl);
    } else {
      setMgmtFile(file);
      setMgmtPreview(previewUrl);
    }
  };

  const handleEmploymentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEmploymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleHRChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setHrInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveHR = async () => {
    setSaving(true);
    try {
      let finalOfficerSign = hrInfo.hrOfficerSign;
      let finalMgmtSign = hrInfo.hrMgmtSign;

      if (officerFile) {
        finalOfficerSign = await uploadToBunny(officerFile);
      }

      if (mgmtFile) {
        finalMgmtSign = await uploadToBunny(mgmtFile);
      }

      const docRef = doc(db as any, "employeeForms", id);
      const updatedData = {
        ...hrInfo,
        ...employmentDetails,
        hrOfficerSign: finalOfficerSign,
        hrMgmtSign: finalMgmtSign,
      };

      await updateDoc(docRef, updatedData);

      setHrInfo((prev) => ({
        ...prev,
        hrOfficerSign: finalOfficerSign,
        hrMgmtSign: finalMgmtSign,
      }));
      setForm((prev) => (prev ? { ...prev, ...updatedData } : prev));

      setOfficerFile(null);
      setMgmtFile(null);

      alert("HR Details & Images Saved Successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-xs uppercase animate-pulse">
        Loading Document...
      </div>
    );
  if (!form)
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Record Not Found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0">
      <div className="max-w-6xl mx-auto mb-4 flex justify-between print:hidden px-4 select-none">
        <Link
          href="/job-card"
          className="bg-white border border-black px-4 py-2 text-[10px] font-black uppercase text-black hover:bg-neutral-50 transition shadow-xs"
        >
          ← Back
        </Link>

        <div className="flex gap-2">
          <button
            onClick={handleSaveHR}
            disabled={saving}
            className="bg-[#dbdbdb] border border-neutral-400 text-black px-6 py-2 text-[10px] font-black uppercase hover:bg-neutral-300 disabled:opacity-50 transition shadow-xs"
          >
            {saving ? "Saving..." : "Save HR Details"}
          </button>

          <button
            onClick={() => window.print()}
            className="bg-black border border-black text-white px-6 py-2 text-[10px] font-black uppercase hover:bg-neutral-900 transition shadow-xs"
          >
            Print / PDF
          </button>
        </div>
      </div>

      {/* A4 Document */}
      <div className="max-w-6xl mx-auto bg-white shadow-2xl p-[12mm] print:shadow-none">
        {/* Page 1 */}
        <div className="border-[6px] border-[#dbdbdb] p-8 bg-white flex flex-col items-center justify-center text-center mb-6 rounded-2xl shadow-sm select-none">
          <div className="max-w-[300px] flex justify-center items-center">
            <Image src={logo} alt="Logo" className="object-contain" priority />
          </div>

          <p className="text-[10px] font-black tracking-[4px] mt-4 text-neutral-800 uppercase pl-[4px]">
            EXPERTS IN AUTOMOTIVE
          </p>
        </div>
        <SectionHeader number="01" title="Personal Information" />
        <div className="flex gap-6 mt-4">
          <div className="w-[140px] h-[170px] border border-gray-300 overflow-hidden">
            {form.photoUrl ? (
              <img
                src={form.photoUrl}
                className="w-full h-full object-cover"
                alt="photoUrl"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-[10px] text-gray-400">
                Photo
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-3">
            <Field label="Full Name" value={form.fullName} required />
            <Field label="Father's Name" value={form.fatherReal} required />
            <Field label="CNIC" value={form.cnic} required />
            <Field label="CNIC Expiry" value={form.cnicExpiry} />
            <Field label="Date of Birth" value={form.dob} required />
            <Field label="Gender" value={form.gender} required />
            <Field label="Marital Status" value={form.maritalStatus} />
            <Field label="Religion" value={form.religion} />
            <Field label="Nationality" value={form.nationality} />
            <Field label="Location" value={form.location} />
          </div>
        </div>
        {/* Identity Documents Section */}
        <p className="pt-4 text-sm">— — IDENTITY DOCUMENTS — —</p>
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* CNIC Front */}
          <div className="border border-gray-300 p-3">
            <p className="text-[9px] font-bold text-gray-500 mb-2">
              CNIC — FRONT SIDE
            </p>
            {form.cnicFrontUrl ? (
              <img
                src={form.cnicFrontUrl}
                className="w-full h-auto border border-gray-200"
                alt="CNIC Front"
              />
            ) : (
              <div className="h-40 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                No CNIC Front Image
              </div>
            )}
          </div>

          {/* CNIC Back */}
          <div className="border border-gray-300 p-3">
            <p className="text-[9px] font-bold text-gray-500 mb-2">
              CNIC — BACK SIDE
            </p>
            {form.cnicBackUrl ? (
              <img
                src={form.cnicBackUrl}
                className="w-full h-auto border border-gray-200"
                alt="CNIC Back"
              />
            ) : (
              <div className="h-40 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                No CNIC Back Image
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <Field label="Passport Number" value={form.passportNo} />
          <Field label="Passport Expiry" value={form.passportExpiry} />
          {form.passportCopyUrl && (
            <div className="col-span-2 border border-gray-300 p-3">
              <p className="text-[9px] font-bold text-gray-500 mb-2">
                PASSPORT COPY
              </p>
              <img
                src={form.passportCopyUrl}
                className="w-full max-h-60 object-contain border"
                alt="Passport"
              />
            </div>
          )}
        </div>
        <p className="pt-4 text-sm">— — CONTACT & ADDRESS — —</p>
        <div className="grid grid-cols-2 gap-6 mt-4">
          <Field label="Mobile Primary" value={form.mobilePrimary} />
          <Field label="Mobile Secondary" value={form.mobileSecondary} />
          <Field label="Email" value={form.email} />
        </div>
        <p className="pt-4 text-sm">— — RESIDENTIAL ADDRESS — —</p>
        <div className="grid grid-cols-2 gap-6 mt-4">
          <Field label="Current Address" value={form.currentAddress} />
          <Field label="Permanent Address" value={form.permanentAddress} />
        </div>
        <SectionHeader number="02" title="Bank Details" />
        <div className="grid grid-cols-3 gap-6 mt-4">
          <Field label="Bank Name" value={form.bankName} />
          <Field label="Account No" value={form.accountNo} />
          <Field label="IBAN" value={form.iban} />
        </div>
        <p className="pt-4 text-sm">— — AX & SOCIAL SECURITY ——</p>
        <div className="grid grid-cols-3 gap-6 mt-4">
          <Field label="NTN NATIONAL TAX NUMBER)" value={form.ntn} />
          <Field label="EOBI REGISTRATION NO." value={form.eobi} />
          <Field label="SESSI / PESSI REGISTRATION" value={form.sessi} />
        </div>
        <Footer page={1} />
        {/* Page 2 */}
        <div className="page-break" />
        <SectionHeader number="03" title="Health Profile" />
        <div className="grid grid-cols-3 gap-6 mt-4">
          <Field label="Height" value={form.height} />
          <Field label="Weight" value={form.weight} />
          <Field label="Blood Group" value={form.bloodGroup} />
          <Field label="Covid Vaccinated" value={form.covidVaccinated} />
          <Field label="Glasses" value={form.glasses} />
          <Field label="Hearing Impairment" value={form.hearingImpairment} />
          <Field
            label="Personal Health Insurance"
            value={form.personalInsurance}
          />
          <Field label="Disabilities" value={form.disability} />
          <Field label="Disability Details" value={form.disabilityDetails} />
          <Field label="Allergies" value={form.allergies} />
          <Field label="Chronic Illness" value={form.chronic} />
          <Field label="Chronic Details" value={form.chronicDetails} />
          <Field label="Medications" value={form.medications} />
          <Field label="Health Notes" value={form.healthNotes} />
        </div>
        <SectionHeader number="04" title="Family &  Dependents" />
        <div className="space-y-5">
          {/* SEAMLESS STRUCTURED MATRIX CONTAINER */}
          <div className="border border-black bg-white overflow-hidden -mt-1 block-section">
            {/* SUB HEADER - SPOUSE DETAILS */}
            <div className="bg-neutral-100 p-2 font-black text-[9px] uppercase tracking-wider text-black border-b border-black select-none">
              • Spouse Identity & Status Information
            </div>

            {/* SPOUSE ROW 1: Name & CNIC */}
            <div className="grid grid-cols-2 w-full border-b border-black">
              <div className="border-r border-black">
                <ExactImageRow
                  label="Spouse Full Name"
                  value={form.spouseName}
                />
              </div>
              <div>
                <ExactImageRow
                  label="Spouse CNIC / Identity No"
                  value={form.spouseCnic}
                />
              </div>
            </div>

            {/* SPOUSE ROW 2: DOB & Dependency */}
            <div className="grid grid-cols-2 w-full border-b border-black">
              <div className="border-r border-black">
                <ExactImageRow
                  label="Spouse Date of Birth"
                  value={form.spouseDob}
                />
              </div>
              <div>
                <ExactImageRow
                  label="Spouse Dependent Status"
                  value={form.spouseDependent}
                />
              </div>
            </div>

            {/* SPOUSE ROW 3: Occupation & Contact */}
            <div className="grid grid-cols-2 w-full border-b border-black">
              <div className="border-r border-black">
                <ExactImageRow
                  label="Spouse Current Occupation"
                  value={form.spouseOcc}
                />
              </div>
              <div>
                <ExactImageRow
                  label="Spouse Contact Number"
                  value={form.spouseContact}
                />
              </div>
            </div>

            {/* SUB HEADER - FATHER DETAILS */}
            <div className="bg-neutral-100 p-2 font-black text-[9px] uppercase tracking-wider text-black border-b border-black select-none">
              • Paternal Record Specifications
            </div>

            {/* FATHER INFO GRID (3 Columns) */}
            <div className="grid grid-cols-3 w-full border-b border-black">
              <div className="border-r border-black">
                <ExactImageRow
                  label="Father Full Name"
                  value={form.fatherReal}
                />
              </div>
              <div className="border-r border-black">
                <ExactImageRow
                  label="Father Status (Alive/Deceased)"
                  value={form.fatherStatus}
                />
              </div>
              <div>
                <ExactImageRow
                  label="Father Occupation"
                  value={form.fatherOcc}
                />
              </div>
            </div>

            {/* SUB HEADER - MOTHER DETAILS */}
            <div className="bg-neutral-100 p-2 font-black text-[9px] uppercase tracking-wider text-black border-b border-black select-none">
              • Maternal Record Specifications
            </div>

            {/* MOTHER INFO GRID (3 Columns) */}
            <div className="grid grid-cols-3 w-full border-b border-black">
              <div className="border-r border-black">
                <ExactImageRow
                  label="Mother Full Name"
                  value={form.motherReal}
                />
              </div>
              <div className="border-r border-black">
                <ExactImageRow
                  label="Mother Status (Alive/Deceased)"
                  value={form.motherStatus}
                />
              </div>
              <div>
                <ExactImageRow
                  label="Mother Occupation"
                  value={form.motherOcc}
                />
              </div>
            </div>

            {/* SUB HEADER - SIBLINGS & DEPENDENCY */}
            <div className="bg-neutral-100 p-2 font-black text-[9px] uppercase tracking-wider text-black border-b border-black select-none">
              • Household & Parent Dependency Scale
            </div>

            {/* SIBLINGS & PARENTAL DEPENDENCY GRID */}
            <div className="grid grid-cols-2 w-full border-b border-black">
              <div className="border-r border-black">
                <ExactImageRow
                  label="Total Number of Siblings"
                  value={form.siblings}
                />
              </div>
              <div>
                <ExactImageRow
                  label="Are Parents Financially Dependent?"
                  value={form.parentsDependent}
                />
              </div>
            </div>

            {/* SUB HEADER - NEXT OF KIN (NOK) */}
            <div className="bg-neutral-100 p-2 font-black text-[9px] uppercase tracking-wider text-black border-b border-black select-none">
              • Legal Heir / Next of Kin (NOK) Specifications
            </div>

            {/* NEXT OF KIN (NOK) GRID */}
            <div className="grid grid-cols-3 w-full">
              <div className="border-r border-black">
                <ExactImageRow label="NOK Full Name" value={form.nokName} />
              </div>
              <div className="border-r border-black">
                <ExactImageRow
                  label="NOK Legal Relationship"
                  value={form.nokRelation}
                />
              </div>
              <div>
                <ExactImageRow
                  label="NOK Emergency Phone"
                  value={form.nokPhone}
                />
              </div>
            </div>
          </div>

          {/* CHILDREN & DEPENDENTS MATRIX SECTION (EXACTLY 4 CHILDREN ROWS) */}
          <div className="border border-black bg-white overflow-hidden block-section">
            <div className="bg-black text-white px-2 py-1 font-black text-[10px] uppercase tracking-wider select-none">
              CHILDREN / DEPENDENTS DATA MATRIX (MAXIMUM 4 ENTRIES ALLOWED)
            </div>
            <div className="w-full overflow-hidden">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-black font-black uppercase text-[9px] text-black text-center select-none">
                    <th className="p-2 border-r border-black w-[10%]">INDEX</th>
                    <th className="p-2 border-r border-black w-[30%] text-left">
                      CHILD / DEPENDENT FULL NAME
                    </th>
                    <th className="p-2 border-r border-black w-[15%]">
                      RELATIONSHIP
                    </th>
                    <th className="p-2 border-r border-black w-[15%]">
                      DATE OF BIRTH
                    </th>
                    <th className="p-2 border-r border-black w-[15%]">
                      CNIC / B-FORM NO
                    </th>
                    <th className="p-2 border-r border-black w-[7%]">GENDER</th>
                    <th className="p-2 w-[8%]">DEPENDENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black font-medium text-black text-center">
                  {Array.from({ length: 4 }).map((_, idx) => {
                    const childData =
                      Array.isArray(form.children) && form.children[idx]
                        ? form.children[idx]
                        : null;

                    return (
                      <tr key={idx} className="bg-white text-[11px] h-10">
                        {/* Index Indicator */}
                        <td className="p-2 border-r border-black font-black bg-neutral-50 text-center select-none text-[9px] text-neutral-800">
                          CHILD 0{idx + 1}
                        </td>

                        {/* Child Name */}
                        <td className="p-2 border-r border-black text-left font-black uppercase tracking-wide text-xs">
                          {childData?.name ||
                            "______________________________________"}
                        </td>

                        {/* Relationship */}
                        <td className="p-2 border-r border-black uppercase text-xs font-semibold">
                          {childData?.relationship || "___________"}
                        </td>

                        {/* Date of Birth */}
                        <td className="p-2 border-r border-black font-mono text-xs">
                          {childData?.dob || "___________"}
                        </td>

                        {/* CNIC / B-Form */}
                        <td className="p-2 border-r border-black font-mono text-xs">
                          {childData?.cnic || "_______________"}
                        </td>

                        {/* Gender */}
                        <td className="p-2 border-r border-black uppercase text-xs font-semibold">
                          {childData?.gender || "______"}
                        </td>

                        {/* Dependency Status */}
                        <td className="p-2 uppercase text-xs font-bold">
                          {childData?.dependent || "______"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer page={2} />
        {/* Page 3 */}
        <SectionHeader number="05" title="Emergency Contacts" />
        <div className="space-y-4 mt-6">
          {/* EMERGENCY CONTACTS TITLE HEADER */}
          <div className="bg-neutral-100 p-2 font-black border border-black text-[9px] uppercase tracking-wider text-black select-none">
            • EMERGENCY CONTACTS & NEXT OF KIN DEPENDENCY DETAILS
          </div>

          {/* TWO COLUMN GRID FOR EMERGENCY CONTACT 1 & 2 */}
          <div className="grid grid-cols-2 gap-4 -mt-1">
            {/* PRIMARY EMERGENCY CONTACT (E1) */}
            <div className="border border-black bg-white flex flex-col">
              <div className="bg-neutral-50 p-2 font-black border-b border-black text-[9px] uppercase text-neutral-800 select-none">
                01. PRIMARY EMERGENCY CONTACT
              </div>
              <div className="flex flex-col split-rows">
                <ExactImageRow label="Full Name *" value={form.e1Name} />
                <ExactImageRow label="Relationship *" value={form.e1Relation} />
                <ExactImageRow label="Phone No *" value={form.e1Phone} />
                <ExactImageRow label="Alt Phone" value={form.e1Alt} />
                <ExactImageRow label="Address" value={form.e1Address} />
              </div>
            </div>

            {/* SECONDARY EMERGENCY CONTACT (E2) */}
            <div className="border border-black bg-white flex flex-col">
              <div className="bg-neutral-50 p-2 font-black border-b border-black text-[9px] uppercase text-neutral-800 select-none">
                02. SECONDARY EMERGENCY CONTACT
              </div>
              <div className="flex flex-col split-rows">
                <ExactImageRow label="Full Name *" value={form.e2Name} />
                <ExactImageRow label="Relationship *" value={form.e2Relation} />
                <ExactImageRow label="Phone No *" value={form.e2Phone} />
                <ExactImageRow label="Alt Phone" value={form.e2Alt} />
                <ExactImageRow label="Address" value={form.e2Address} />
              </div>
            </div>
          </div>

          {/* NEXT OF KIN (NOK) FULL WIDTH MATRIX BLOCK */}
          <div className="border border-black bg-white -mt-1">
            <div className="bg-neutral-50 p-2 font-black border-b border-black text-[9px] uppercase text-neutral-800 select-none">
              03. LEGAL HEIR / NEXT OF KIN (NOK) SPECIFICATIONS
            </div>
            <div className="grid grid-cols-2 w-full border-b border-black">
              <div className="border-r border-black">
                <ExactImageRow label="NOK Name *" value={form.nokName} />
              </div>
              <div>
                <ExactImageRow
                  label="NOK Relation *"
                  value={form.nokRelation}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 w-full -mt-[1px]">
              <div className="border-r border-black">
                <ExactImageRow label="NOK CNIC *" value={form.nokCnic} />
              </div>
              <div>
                <ExactImageRow label="NOK Phone *" value={form.nokPhone} />
              </div>
            </div>
          </div>
        </div>
        <SectionHeader number="06" title="EDUCATIONAL Details" />
        <div className="space-y-4">
          <div className="border border-black bg-white overflow-hidden -mt-1 block-section">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-black font-black uppercase text-[9px] text-black text-center select-none">
                  <th className="p-2 border-r border-black w-[18%] text-left">
                    DEGREE LEVEL
                  </th>
                  <th className="p-2 border-r border-black w-[22%] text-left">
                    SUBJECT / MAJOR
                  </th>
                  <th className="p-2 border-r border-black w-[25%] text-left">
                    INSTITUTION
                  </th>
                  <th className="p-2 border-r border-black w-[20%] text-left">
                    BOARD / UNIVERSITY
                  </th>
                  <th className="p-2 border-r border-black w-[8%]">YEAR</th>
                  <th className="p-2 border-r border-black w-[12%]">
                    DOCUMENT
                  </th>
                  <th className="p-2 w-[7%]">GRADE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black font-medium text-black">
                {[
                  "Matriculation",
                  "Intermediate",
                  "Bachelor's",
                  "Master's",
                ].map((level, idx) => {
                  const dbEdu = Array.isArray(form.education)
                    ? form.education.find(
                        (e: any) =>
                          e?.level?.toLowerCase() === level.toLowerCase(),
                      ) ||
                      form.education[idx] ||
                      {}
                    : {};

                  return (
                    <tr key={level} className="bg-white text-[11px] h-10">
                      <td className="p-2 border-r border-black font-black bg-neutral-50/80 text-[10px] text-black uppercase select-none">
                        {level}
                      </td>

                      <td className="p-2 border-r border-black text-left uppercase text-xs font-semibold">
                        {dbEdu.subject || "____________"}
                      </td>

                      <td className="p-2 border-r border-black text-left uppercase text-xs font-semibold">
                        {dbEdu.institution || "____________"}
                      </td>

                      <td className="p-2 border-r border-black text-left uppercase text-xs font-semibold">
                        {dbEdu.board || "____________"}
                      </td>

                      <td className="p-2 border-r border-black text-center font-mono text-xs">
                        {dbEdu.year || "______"}
                      </td>

                      <td className="p-2 border-r border-black text-center text-[10px] font-semibold uppercase">
                        {dbEdu.documentUrl ? (
                          <Image
                            src={dbEdu.documentUrl}
                            alt={dbEdu.documentName || "Document"}
                            width={120}
                            height={120}
                            className="rounded border object-cover"
                          />
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="p-2 text-center uppercase text-xs font-bold">
                        {dbEdu.grade || "____"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <SectionHeader number="07" title="Work Experience" />
        <div className="space-y-4">
          <div className="space-y-5 -mt-1">
            {Array.from({ length: 3 }).map((_, idx) => {
              const expData =
                Array.isArray(form.experience) && form.experience[idx]
                  ? form.experience[idx]
                  : {};

              return (
                <div
                  key={idx}
                  className="border border-black bg-white flex flex-col block-section"
                >
                  <div className="bg-neutral-100 p-2 font-black border-b border-black text-[9px] uppercase text-neutral-800 select-none">
                    0{idx + 1}. PREVIOUS EMPLOYMENT RECORD DETAILED
                    SPECIFICATIONS
                  </div>

                  <div className="grid grid-cols-2 w-full border-b border-black">
                    <div className="border-r border-black">
                      <ExactImageRow
                        label="Company Name"
                        value={expData.company}
                      />
                    </div>
                    <div>
                      <ExactImageRow label="Job Title" value={expData.title} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 w-full border-b border-black -mt-[1px]">
                    <div className="border-r border-black">
                      <ExactImageRow label="Department" value={expData.dept} />
                    </div>
                    <div>
                      <ExactImageRow
                        label="Last Drawn Salary"
                        value={expData.salary}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 w-full border-b border-black -mt-[1px]">
                    <div className="border-r border-black">
                      <ExactImageRow label="Start Date" value={expData.start} />
                    </div>
                    <div>
                      <ExactImageRow label="End Date" value={expData.end} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 w-full border-b border-black -mt-[1px]">
                    <div className="border-r border-black">
                      <ExactImageRow
                        label="Supervisor Name"
                        value={expData.supervisor}
                      />
                    </div>
                    <div>
                      <ExactImageRow
                        label="Supervisor Contact"
                        value={expData.contact}
                      />
                    </div>
                  </div>

                  <div className="border-b border-black -mt-[1px]">
                    <ExactImageRow
                      label="Responsibilities"
                      value={expData.responsibilities}
                    />
                  </div>

                  <div className="border-b border-black -mt-[1px]">
                    <ExactImageRow
                      label="Reason for Leaving"
                      value={expData.reason}
                    />
                  </div>

                  {/* Experience Letter Image */}
                  <div className="p-3 flex flex-col items-center justify-center border-t border-black">
                    <p className="text-[9px] font-semibold mb-2 uppercase">
                      Experience Letter
                    </p>

                    {expData.experienceLetterUrl ? (
                      <Image
                        src={expData.experienceLetterUrl}
                        alt="Experience Letter"
                        width={480}
                        height={420}
                        className="rounded border object-contain hover:opacity-80"
                      />
                    ) : (
                      <p className="text-[10px] text-gray-500">
                        No Experience Letter
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <SectionHeader number="08" title="Certifications" />
        <div className="space-y-4">
          <div className="border border-black bg-white overflow-hidden -mt-1 block-section">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-black font-black uppercase text-[9px] text-black text-center select-none">
                  <th className="p-2 border-r border-black w-[10%]">INDEX</th>
                  <th className="p-2 border-r border-black w-[40%] text-left">
                    COURSE / CERTIFICATION TITLE
                  </th>
                  <th className="p-2 border-r border-black w-[30%] text-left">
                    ISSUING AUTHORITY / INSTITUTION
                  </th>
                  <th className="p-2 border-r border-black w-[10%]">YEAR</th>
                  <th className="p-2 w-[10%]">DOCUMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black font-medium text-black">
                {Array.from({ length: 4 }).map((_, idx) => {
                  const certData =
                    Array.isArray(form.certifications) &&
                    form.certifications[idx]
                      ? form.certifications[idx]
                      : {};

                  return (
                    <tr key={idx} className="bg-white text-[11px] h-10">
                      <td className="p-2 border-r border-black font-black bg-neutral-50/80 text-[9px] text-center text-black uppercase select-none">
                        CERT 0{idx + 1}
                      </td>

                      <td className="p-2 border-r border-black text-left uppercase text-xs font-semibold">
                        {certData.course || "______"}
                      </td>

                      <td className="p-2 border-r border-black text-left uppercase text-xs font-semibold">
                        {certData.issuer || "______"}
                      </td>

                      <td className="p-2 border-r border-black text-center font-mono text-xs">
                        {certData.year || "______"}
                      </td>

                      <td className="p-2 text-center text-[10px] font-semibold uppercase">
                        {certData.documentUrl ? (
                          <Image
                            src={certData.documentUrl}
                            alt="Document"
                            width={120}
                            height={120}
                            className="rounded border object-cover"
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="page-break" />
        <SectionHeader number="09" title="Skills & Languages" />
        <div className="mt-4 p-4 border border-gray-300 bg-gray-50 text-[11px] leading-relaxed">
          {form.skills || "—"}
        </div>
        <div className="mt-4 p-4 border border-gray-300 bg-gray-50 text-[11px] leading-relaxed">
          {form.languages || "—"}
        </div>
        <SectionHeader number="10" title="References" />
        <div className="space-y-4 mt-4">
          <div className="bg-neutral-100 p-2 font-black border border-black text-[9px] uppercase tracking-wider text-black select-none">
            • VERIFIED PROFESSIONAL REFERENCES (MINIMUM 2 REFERENCES REQUIRED)
          </div>

          <div className="grid grid-cols-2 gap-4 -mt-1">
            {Array.from({ length: 2 }).map((_, idx) => {
              const refData =
                Array.isArray(form.references) && form.references[idx]
                  ? form.references[idx]
                  : {};

              return (
                <div
                  key={idx}
                  className="border border-black bg-white flex flex-col"
                >
                  <div className="bg-neutral-50 p-2 font-black border-b border-black text-[9px] uppercase text-neutral-800 select-none">
                    0{idx + 1}. PROFESSIONAL REFERENCE DETAILS
                  </div>

                  <div className="flex flex-col">
                    <ExactImageRow label="Full Name" value={refData.name} />
                    <ExactImageRow
                      label="Designation"
                      value={refData.designation}
                    />
                    <ExactImageRow label="Organization" value={refData.org} />
                    <ExactImageRow label="Phone No" value={refData.phone} />
                    <ExactImageRow label="Email ID" value={refData.email} />
                    <ExactImageRow
                      label="Relationship"
                      value={refData.relation}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Footer page={3} />
        {/* Page 4 */}
        <div className="page-break" />
        <SectionHeader number="11" title="Declaration" />
        <div className="mt-8 p-8 bg-gray-50 border border-gray-200 text-[11px] italic">
          "I, the undersigned, hereby declare that all information provided in
          this Employee Information Form is true, complete, and accurate to the
          best of my knowledge. I understand that any false statement,
          misrepresentation, or omission of relevant facts may result in
          disciplinary action, including termination of employment. I authorise
          Khushi Media to verify any information provided herein, contact the
          references listed, and retain this data securely as part of my
          permanent employment record. I am obligated to promptly notify the HR
          Department of any changes to this information. I confirm I have read
          and understood the terms of my employment offer and agree to abide by
          Khushi Media's policies, code of conduct, and confidentiality
          requirements."
        </div>
        <div className="grid grid-cols-2 gap-12 mt-12">
          <div>
            <Field label="Name" value={form.fullName} />
            <Field label="Date" value={form.declarantDate} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="relative border h-32 flex mb-4 items-end justify-center p-2">
              {form.signatureImageUrl && (
                <Image
                  src={form.signatureImageUrl}
                  alt="Employee Signature"
                  width={120}
                  height={80}
                  className="max-h-20 w-auto mb-4 object-contain"
                />
              )}
              <p className="text-[8px] absolute bottom-1">Employee Signature</p>
            </div>

            <div className="relative border h-32 flex items-end justify-center p-2">
              {form.thumbImpressionUrl && (
                <Image
                  src={form.thumbImpressionUrl}
                  alt="Thumb Impression"
                  width={120}
                  height={80}
                  className="max-h-20 w-auto mb-4 object-contain"
                />
              )}
              <p className="text-[8px] absolute bottom-1">Thumb Impression</p>
            </div>
          </div>
        </div>
        {/* HR Section */}
        <SectionHeader number="12" title="HR Use Only" />
        <div className="mt-6 bg-green-50 border border-green-200 p-6 rounded">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-600 mb-2">
                Received By
              </label>
              <input
                name="hrReceivedBy"
                value={hrInfo.hrReceivedBy}
                onChange={handleHRChange}
                className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                placeholder="HR staff name"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-600 mb-2">
                Received Date
              </label>
              <input
                type="date"
                name="hrReceivedDate"
                value={hrInfo.hrReceivedDate}
                onChange={handleHRChange}
                className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-600 mb-2">
                Verified
              </label>
              <select
                name="hrVerified"
                value={hrInfo.hrVerified}
                onChange={handleHRChange}
                className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none bg-white"
              >
                <option value="">Select</option>
                <option>YES</option>
                <option>NO</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-600 mb-2">
                File No
              </label>
              <input
                name="hrFileNo"
                value={hrInfo.hrFileNo}
                onChange={handleHRChange}
                className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                placeholder="File number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mt-10">
            <div
              className="border border-dashed h-36 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => officerFileRef.current?.click()}
            >
              {officerPreview || hrInfo.hrOfficerSign ? (
                <img
                  src={officerPreview || hrInfo.hrOfficerSign}
                  className="h-24 object-contain"
                  alt="Officer Sign"
                />
              ) : (
                <span className="text-gray-400 text-xs text-center">
                  {saving ? "Processing..." : "Click to Select Signature"}
                </span>
              )}
              <input
                type="file"
                ref={officerFileRef}
                className="hidden"
                onChange={(e) => handleImageUpload(e, "hrOfficerSign")}
                accept="image/*"
              />
              <p className="text-[8px] mt-2">HR Officer</p>
            </div>

            <div
              className="border border-dashed h-36 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => mgmtFileRef.current?.click()}
            >
              {mgmtPreview || hrInfo.hrMgmtSign ? (
                <img
                  src={mgmtPreview || hrInfo.hrMgmtSign}
                  className="h-24 object-contain"
                  alt="Mgmt Sign"
                />
              ) : (
                <span className="text-gray-400 text-xs text-center">
                  {saving
                    ? "Processing..."
                    : "Click to Select Signature / Stamp"}
                </span>
              )}
              <input
                type="file"
                ref={mgmtFileRef}
                className="hidden"
                onChange={(e) => handleImageUpload(e, "hrMgmtSign")}
                accept="image/*"
              />
              <p className="text-[8px] mt-2">Management</p>
            </div>
          </div>

          <p className="pt-4 text-sm">— — Employment Details — —</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Employee ID
                </label>
                <input
                  name="empId"
                  value={employmentDetails.empId}
                  onChange={handleEmploymentChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                  placeholder="KM-XXXX"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={employmentDetails.joiningDate}
                  onChange={handleEmploymentChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Designation
                </label>
                <input
                  name="designation"
                  value={employmentDetails.designation}
                  onChange={handleEmploymentChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                  placeholder="e.g. Content Writer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Department
                </label>
                <input
                  name="department"
                  value={employmentDetails.department}
                  onChange={handleEmploymentChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                  placeholder="e.g. Marketing"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Reporting Manager
                </label>
                <input
                  name="manager"
                  value={employmentDetails.manager}
                  onChange={handleEmploymentChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                  placeholder="Manager name"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Employment Type
                </label>
                <select
                  name="empType"
                  value={employmentDetails.empType}
                  onChange={handleEmploymentChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none bg-white"
                >
                  <option value="">Select</option>
                  <option>Full-Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Work Location
                </label>
                <input
                  name="location"
                  value={employmentDetails.location}
                  onChange={handleEmploymentChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                  placeholder="e.g. Gujranwala Office"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Working Hours
                </label>
                <input
                  name="hours"
                  value={employmentDetails.hours}
                  onChange={handleEmploymentChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                  placeholder="e.g. 9AM-6PM"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Probation Period (Months)
                </label>
                <input
                  type="number"
                  name="probation"
                  value={employmentDetails.probation}
                  onChange={handleEmploymentChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                  placeholder="e.g. 3"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                Gross Salary (PKR)
              </label>
              <input
                type="number"
                name="grossSalary"
                value={employmentDetails.grossSalary}
                onChange={handleEmploymentChange}
                className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                placeholder="Gross salary"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                Basic Salary (PKR)
              </label>
              <input
                type="number"
                name="basicSalary"
                value={employmentDetails.basicSalary}
                onChange={handleEmploymentChange}
                className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                placeholder="Basic salary"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                Allowances (PKR)
              </label>
              <input
                type="number"
                name="allowances"
                value={employmentDetails.allowances}
                onChange={handleEmploymentChange}
                className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
                placeholder="Allowances"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                Payment Mode
              </label>
              <select
                name="paymentMode"
                value={employmentDetails.paymentMode}
                onChange={handleEmploymentChange}
                className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none bg-white"
              >
                <option value="">Select</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                Probation End Date
              </label>
              <input
                type="date"
                name="probationEnd"
                value={employmentDetails.probationEnd}
                onChange={handleEmploymentChange}
                className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                Contract End Date
              </label>
              <input
                type="date"
                name="contractEnd"
                value={employmentDetails.contractEnd}
                onChange={handleEmploymentChange}
                className="w-full py-2 px-3 border border-gray-300 rounded text-sm outline-none"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 rounded border border-dashed border-purple-200 bg-purple-50 text-sm text-purple-900">
          These values can be updated by HR/admin. If a field is blank, add it
          here and save.
        </div>
        <Footer page={4} total={4} />
      </div>
    </div>
  );
}
