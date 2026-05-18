"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

import logo from "@/assets/LOGO.png";
import Image from "next/image";

type SectionCardProps = {
  number: string;
  title: string;
  sub: string;
  children: React.ReactNode;
};

type UnderlineInputProps = {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  formData?: Record<string, any>;
  handleInputChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
};

type TextAreaInputProps = {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  formData?: Record<string, any>;
  handleInputChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
};

type PreviewBoxProps = {
  label: string;
  field: string;
  required?: boolean;
  preview?: string;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, fieldName: string) => void;
};

type SubHeadingProps = {
  text: string;
};

type RadioGroupProps = {
  label: string;
  name: string;
  options: string[];
  current: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const SectionCard = ({ number, title, sub, children }: SectionCardProps) => (
  <div className="bg-white border border-neutral-300 rounded-xl shadow-md mb-10 overflow-hidden">
    {/* TOP BAR WITH EXACT #dbdbdb BACKGROUND */}
    <div className="bg-[#dbdbdb] text-black p-4 flex items-center gap-4 border-b border-neutral-300">
      {/* NUMBER INSIDE COUNTER BOX */}
      <span className="bg-black text-white px-3 py-1 rounded font-black text-sm select-none">
        {number}
      </span>

      {/* TITLE & SUBTEXT CONTAINER */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wide leading-none text-black">
          {title}
        </h2>
        {sub && (
          <p className="text-[10px] text-neutral-600 font-bold mt-1 uppercase tracking-widest">
            {sub}
          </p>
        )}
      </div>
    </div>

    {/* CONTENT INNER CONTAINER */}
    <div className="p-6 md:p-8 bg-white">{children}</div>
  </div>
);

const UnderlineInput = ({
  label,
  name,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
  formData,
  handleInputChange,
}: UnderlineInputProps) => (
  <div className="w-full group">
    <label className="text-[10px] font-black text-neutral-700 uppercase tracking-wider mb-1 block select-none group-focus-within:text-black transition-colors">
      {label}{" "}
      {required && <span className="text-red-600 font-black ml-0.5">*</span>}
    </label>

    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder}
      value={
        value !== undefined
          ? value
          : name
            ? ((formData as any)?.[name] ?? "")
            : ""
      }
      onChange={onChange || handleInputChange}
      className="w-full py-2 border-b border-neutral-300 focus:border-black outline-none text-sm font-semibold text-black transition-all bg-transparent placeholder:text-neutral-300"
    />
  </div>
);

const TextAreaInput = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  formData,
  handleInputChange,
}: TextAreaInputProps) => (
  <div className="w-full">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
      {label}
    </label>
    <textarea
      name={name}
      value={
        value !== undefined
          ? value
          : name
            ? ((formData as any)?.[name] ?? "")
            : ""
      }
      placeholder={placeholder}
      onChange={onChange || handleInputChange}
      className="w-full min-h-[90px] py-2 border border-gray-300 rounded-xl focus:border-[#dbdbdb] outline-none text-sm transition-all bg-transparent placeholder:text-gray-200 resize-none"
    />
  </div>
);

const PreviewBox = ({
  label,
  field,
  required,
  preview,
  onFileChange,
}: PreviewBoxProps) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="h-32 w-full bg-gray-50 border-2 border-dashed border-purple-100 rounded-xl relative flex items-center justify-center overflow-hidden transition-all hover:bg-purple-50">
      {preview && preview.startsWith("data:") ? (
        <img
          src={preview}
          alt="preview"
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="text-center p-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
            {preview ? preview : `Upload ${label}`}
          </p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        required={required}
        onChange={(e) => onFileChange(e, field)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  </div>
);

const SubHeading = ({ text }: SubHeadingProps) => (
  <div className="flex items-center gap-3 mt-8 mb-6">
    <span className="w-2 h-2 bg-[#dbdbdb] rounded-full"></span>
    <h3 className="text-[#dbdbdb] font-black text-xs uppercase tracking-[3px] border-b border-purple-50 flex-1 pb-1">
      {text}
    </h3>
  </div>
);

const RadioGroup = ({
  label,
  name,
  options,
  current,
  onChange,
}: RadioGroupProps) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
      {label}
    </label>
    <div className="flex flex-wrap gap-4">
      {options.map((opt: string) => (
        <label
          key={opt}
          className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={current === opt}
            onChange={onChange}
            className="accent-[#dbdbdb] w-4 h-4"
          />
          {opt}
        </label>
      ))}
    </div>
  </div>
);

interface ChildDependent {
  name: string;
  relationship: string;
  dob: string;
  cnic: string;
  gender: string;
  dependent: string;
}

interface EducationRow {
  level: string;
  subject: string;
  institution: string;
  board: string;
  year: string;
  grade: string;
}

interface ExperienceRow {
  company: string;
  title: string;
  dept: string;
  start: string;
  end: string;
  salary: string;
  reason: string;
  supervisor: string;
  contact: string;
  responsibilities: string;
}

interface ReferenceRow {
  name: string;
  designation: string;
  org: string;
  phone: string;
  email: string;
  relation: string;
}

interface CertificationRow {
  course: string;
  issuer: string;
  year: string;
}

const initialFormData = {
  // 01 Personal
  fullName: "",
  fatherName: "",
  cnic: "",
  cnicExpiry: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  bloodGroup: "",
  religion: "",
  nationality: "Pakistani",
  domicileProvince: "",
  domicileDistrict: "",
  passportNo: "",
  passportExpiry: "",
  mobilePrimary: "",
  mobileSecondary: "",
  email: "",
  currentAddress: "",
  permanentAddress: "",
  // 02 Employment
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
  grossSalary: "0.00",
  basicSalary: "0.00",
  allowances: "0.00",
  paymentMode: "",
  bankName: "",
  accountNo: "",
  iban: "",
  ntn: "",
  eobi: "",
  sessi: "",
  // 03 Health
  height: "",
  weight: "",
  covidVaccinated: "",
  glasses: "",
  hearingImpairment: "",
  personalInsurance: "",
  chronic: "No",
  chronicDetails: "",
  disability: "No",
  disabilityDetails: "",
  allergies: "",
  medications: "",
  healthNotes: "",
  // 04 Family
  spouseName: "",
  spouseCnic: "",
  spouseDob: "",
  spouseDependent: "",
  spouseOcc: "",
  spouseContact: "",
  fatherReal: "",
  fatherStatus: "",
  fatherOcc: "",
  motherReal: "",
  motherStatus: "",
  motherOcc: "",
  siblings: "",
  parentsDependent: "",
  // 05 Emergency
  e1Name: "",
  e1Relation: "",
  e1Phone: "",
  e1Alt: "",
  e1Address: "",
  e2Name: "",
  e2Relation: "",
  e2Phone: "",
  e2Alt: "",
  e2Address: "",
  nokName: "",
  nokRelation: "",
  nokCnic: "",
  nokPhone: "",
  // Lists
  children: Array.from({ length: 4 }, () => ({
    name: "",
    relationship: "",
    dob: "",
    cnic: "",
    gender: "",
    dependent: "",
  })) as ChildDependent[],
  education: [
    {
      level: "Matriculation",
      subject: "",
      institution: "",
      board: "",
      year: "",
      grade: "",
    },
    {
      level: "Intermediate",
      subject: "",
      institution: "",
      board: "",
      year: "",
      grade: "",
    },
    {
      level: "Bachelor's",
      subject: "",
      institution: "",
      board: "",
      year: "",
      grade: "",
    },
    {
      level: "Master's",
      subject: "",
      institution: "",
      board: "",
      year: "",
      grade: "",
    },
  ] as EducationRow[],
  certifications: Array.from({ length: 4 }, () => ({
    course: "",
    issuer: "",
    year: "",
  })) as CertificationRow[],
  experience: Array.from({ length: 3 }, () => ({
    company: "",
    title: "",
    dept: "",
    start: "",
    end: "",
    salary: "0",
    reason: "",
    supervisor: "",
    contact: "",
    responsibilities: "",
  })) as ExperienceRow[],
  references: Array.from({ length: 2 }, () => ({
    name: "",
    designation: "",
    org: "",
    phone: "",
    email: "",
    relation: "",
  })) as ReferenceRow[],
  skills: "",
  languages: "",
  declarantName: "",
  declarantDate: "",
  consent: false,
};

export default function JobForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const { name, type } = target;
    if (!name) return;

    const value =
      type === "checkbox" ? (target as HTMLInputElement).checked : target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileNames((prev) => ({ ...prev, [fieldName]: file.name }));

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setPreviews((prev) => ({
          ...prev,
          [fieldName]: reader.result as string,
        }));
      reader.readAsDataURL(file);
      return;
    }
  };

  const updateList = (
    index: number,
    field: string,
    value: string,
    section: string,
  ) => {
    const newList = [...(formData as any)[section]];
    newList[index] = { ...newList[index], [field]: value };
    setFormData((prev) => ({ ...prev, [section]: newList }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please confirm the declaration checkbox.");
      return;
    }

    setSaving(true);
    if (!db) {
      alert(
        "Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_* env variables.",
      );
      setSaving(false);
      return;
    }

    try {
      const submitData = {
        ...formData,
        fileNames,
        createdAt: serverTimestamp(),
      };

      console.log("📋 Form Data:", formData);
      console.log("📎 File Names:", fileNames);
      console.log("📤 Submitting to Firestore:", submitData);

      const docRef = await addDoc(collection(db, "employeeForms"), submitData);

      console.log("✅ Successfully saved to Firestore!");
      console.log("📍 Document ID:", docRef.id);
      console.log("📊 Saved Data:", submitData);

      setFormData(initialFormData);
      setPreviews({});
      setFileNames({});

      alert("✅ Form submitted successfully! Data saved to Firebase.");
    } catch (error) {
      console.error("❌ Firestore submit failed:", error);
      alert(
        "Unable to save form data. Please check your Firebase configuration.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 font-sans text-gray-800 antialiased">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#dbdbdb] p-8 md:p-10 rounded-t-3xl text-slate-900 text-start border-t border-x border-slate-400 relative overflow-hidden">
          {/* LOGO & BRAND NAME */}
          <div className="flex justify-start items-center gap-4 mb-4 relative z-10">
            <div className="max-w-[160px]">
              <Image src={logo} alt="Logo" className="object-contain" />
            </div>
          </div>

          {/* MAIN HEADING */}
          <h2 className="text-xl md:text-2xl font-black mt-4 tracking-tight relative z-10 uppercase text-start text-slate-900">
            New Employee Information Form
          </h2>

          {/* SUBTEXT / INSTRUCTIONS */}
          <p className="text-[11px] mt-2 text-slate-600 text-start uppercase tracking-wider md:tracking-widest font-bold max-w-3xl leading-relaxed relative z-10">
            Complete all fields in{" "}
            <span className="text-slate-900 font-black">BLOCK CAPITALS</span> ·
            Fields marked <span className="text-red-500 font-black">*</span> are
            mandatory · This form is{" "}
            <span className="underline decoration-slate-900 font-bold text-slate-900">
              CONFIDENTIAL
            </span>
          </p>

          {/* BOTTOM ACCENT LINE - Corporate Charcoal Slate */}
          <div className="mt-6 h-1 w-full bg-slate-800 rounded-full relative z-10"></div>
        </div>

        {/* INSTRUCTIONS BOX */}
        <div className="bg-white p-6 border-x border-b border-slate-300 mb-10 rounded-b-xl shadow-sm">
          <h4 className="text-slate-800 font-black text-xs uppercase mb-3 underline underline-offset-4 tracking-wider">
            Instructions:
          </h4>
          <ul className="text-xs text-slate-600 space-y-2 font-semibold list-disc ml-5 leading-relaxed">
            <li>Fill out all mandatory fields marked with *</li>
            <li>
              Upload clear, legible copies of all required documents (JPG / PNG
              / PDF, max 5 MB each)
            </li>
            <li>
              All uploads are securely stored and remain confidential within
              Khushi Media HR records
            </li>
            <li>
              Notify HR immediately if any information changes after submission
            </li>
            <li className="text-red-500 font-black uppercase mt-2 text-[10px]">
              * Required field
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <SectionCard
            number="01"
            title="Personal Details"
            sub="Legal identity, CNIC & contact"
          >
            <SubHeading text="Photograph & Name" />
            <div className="flex flex-col md:flex-row gap-10">
              <div className="w-40">
                <PreviewBox
                  label="Profile Photo"
                  field="photo"
                  required
                  preview={previews.photo}
                  onFileChange={handleFileChange}
                />
              </div>
              <div className="flex-1 space-y-8">
                <UnderlineInput
                  formData={formData}
                  handleInputChange={handleInputChange}
                  label="Full Name (as per CNIC)"
                  name="fullName"
                  required
                  placeholder="Enter full legal name"
                />
                <UnderlineInput
                  formData={formData}
                  handleInputChange={handleInputChange}
                  label="Father's / Husband's Name"
                  name="fatherName"
                  required
                  placeholder="Enter father's or husband's name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="CNIC Number"
                name="cnic"
                required
                placeholder="XXXXX-XXXXXXX-X"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="CNIC Expiry Date"
                name="cnicExpiry"
                required
                type="date"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Date of Birth"
                name="dob"
                required
                type="date"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
              <RadioGroup
                label="Gender *"
                name="gender"
                options={["Male", "Female", "Other"]}
                current={formData.gender}
                onChange={handleInputChange}
              />
              <RadioGroup
                label="Marital Status *"
                name="maritalStatus"
                options={["Single", "Married", "Divorced", "Widowed"]}
                current={formData.maritalStatus}
                onChange={handleInputChange}
              />
              <div className="w-full">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  className="w-full py-2 border-b border-gray-300 bg-transparent outline-none text-sm"
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Religion"
                name="religion"
                placeholder="e.g. Islam, Christianity..."
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Nationality *"
                name="nationality"
                value={formData.nationality}
                required
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Domicile Province *"
                name="domicileProvince"
                placeholder="e.g. Punjab"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Domicile District"
                name="domicileDistrict"
                placeholder="Enter domicile district"
              />
            </div>

            <SubHeading text="Identity Documents" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PreviewBox
                label="CNIC Front Side"
                field="cnicFront"
                required
                preview={previews.cnicFront}
                onFileChange={handleFileChange}
              />
              <PreviewBox
                label="CNIC Back Side"
                field="cnicBack"
                required
                preview={previews.cnicBack}
                onFileChange={handleFileChange}
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Passport Number (if any)"
                name="passportNo"
                placeholder="e.g. AA1234567"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Passport Expiry"
                name="passportExpiry"
                type="date"
              />
              <div className="md:col-span-2">
                <PreviewBox
                  label="Passport Copy (Optional)"
                  field="passportCopy"
                  preview={previews.passportCopy}
                  onFileChange={handleFileChange}
                />
              </div>
            </div>

            <SubHeading text="Contact & Address" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Mobile ? Primary *"
                name="mobilePrimary"
                required
                placeholder="03XX-XXXXXXX"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Mobile ? Secondary"
                name="mobileSecondary"
                placeholder="03XX-XXXXXXX"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Personal Email Address *"
                name="email"
                required
                placeholder="name@example.com"
              />
              <div className="md:col-span-3">
                <UnderlineInput
                  formData={formData}
                  handleInputChange={handleInputChange}
                  label="Current Residential Address *"
                  name="currentAddress"
                  required
                  placeholder="House No, Street, Area, City, Province"
                />
              </div>
              <div className="md:col-span-3">
                <UnderlineInput
                  formData={formData}
                  handleInputChange={handleInputChange}
                  label="Permanent Address"
                  name="permanentAddress"
                  placeholder="Leave blank if same as current address"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            number="02"
            title="Employment Details"
            sub="Role, compensation & joining"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Employee ID *"
                name="empId"
                required
                placeholder="KM-XXXX"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Date of Joining *"
                name="joiningDate"
                required
                type="date"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Designation *"
                name="designation"
                required
                placeholder="e.g. Content Writer"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Department *"
                name="department"
                required
                placeholder="e.g. Marketing"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Reporting Manager *"
                name="manager"
                required
              />
              <div className="w-full">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Employment Type *
                </label>
                <select
                  name="empType"
                  value={formData.empType}
                  required
                  className="w-full py-2 border-b border-gray-300 bg-transparent outline-none text-sm"
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>Full-Time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Work Location"
                name="location"
                placeholder="e.g. Gujranwala Office"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Working Hours"
                name="hours"
                placeholder="e.g. 9AM?6PM"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Probation Period (Months)"
                name="probation"
                type="number"
                placeholder="e.g. 3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Probation End Date"
                name="probationEnd"
                type="date"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Contract End Date (if applicable)"
                name="contractEnd"
                type="date"
              />
            </div>

            <SubHeading text="Compensation" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Gross Monthly Salary (PKR) *"
                name="grossSalary"
                required
                type="number"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Basic Salary (PKR)"
                name="basicSalary"
                type="number"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Allowances (PKR)"
                name="allowances"
                type="number"
              />
              <div className="w-full">
                <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                  Payment Mode *
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  required
                  className="w-full py-2 border-b border-gray-300 outline-none text-sm"
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Bank Name"
                name="bankName"
                placeholder="e.g. Meezan, HBL"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Bank Account Number"
                name="accountNo"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="IBAN"
                name="iban"
                placeholder="PK00XXXX..."
              />
            </div>

            <SubHeading text="Tax & Social Security" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="NTN"
                name="ntn"
                placeholder="e.g. 1234567-8"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="EOBI Registration No."
                name="eobi"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="SESSI / PESSI Registration"
                name="sessi"
              />
            </div>
          </SectionCard>

          <SectionCard
            number="03"
            title="Health Profile"
            sub="Medical history & wellness"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Height (cm)"
                name="height"
                placeholder="e.g. 170"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Weight (kg)"
                name="weight"
                placeholder="e.g. 65"
              />
              <RadioGroup
                label="Hearing Impairment?"
                name="hearingImpairment"
                options={["Yes", "No"]}
                current={formData.hearingImpairment}
                onChange={handleInputChange}
              />
              <RadioGroup
                label="Personal Health Insurance?"
                name="personalInsurance"
                options={["Yes", "No"]}
                current={formData.personalInsurance}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10">
              <RadioGroup
                label="COVID Vaccinated?"
                name="covidVaccinated"
                options={["Yes", "No"]}
                current={formData.covidVaccinated}
                onChange={handleInputChange}
              />
              <RadioGroup
                label="Wear Glasses?"
                name="glasses"
                options={["Yes", "No"]}
                current={formData.glasses}
                onChange={handleInputChange}
              />
              <div className="w-full">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Do you have any chronic illness?
                </label>
                <select
                  name="chronic"
                  value={formData.chronic}
                  className="w-full py-2 border-b border-gray-300 bg-transparent outline-none text-sm"
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>No</option>
                  <option>Yes ? provide details below</option>
                </select>
              </div>
              <div className="w-full">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Do you have any physical disability?
                </label>
                <select
                  name="disability"
                  value={formData.disability}
                  className="w-full py-2 border-b border-gray-300 bg-transparent outline-none text-sm"
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>No</option>
                  <option>Yes ? provide details below</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Chronic Illness Details"
                name="chronicDetails"
                placeholder="Provide condition details or write NONE"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Disability Details"
                name="disabilityDetails"
                placeholder="Provide details or write NONE"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Known Allergies"
                name="allergies"
                placeholder="e.g. Penicillin, Peanuts, Dust ? or write NONE"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Current Medications & Dosage"
                name="medications"
                placeholder="Medication name ? dosage ? frequency?"
              />
            </div>
            <div className="grid grid-cols-1 gap-8 mt-10">
              <TextAreaInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Additional Health Notes for HR"
                name="healthNotes"
                placeholder="Add any clarifications for HR"
              />
            </div>
          </SectionCard>

          <SectionCard
            number="04"
            title="Family & Dependents"
            sub="Spouse, children, parents"
          >
            <SubHeading text="Spouse Information" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Spouse Full Name"
                name="spouseName"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Spouse CNIC"
                name="spouseCnic"
                placeholder="XXXXX-XXXXXXX-X"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Date of Birth"
                name="spouseDob"
                type="date"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="w-full">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Is Dependent?
                </label>
                <select
                  name="spouseDependent"
                  value={formData.spouseDependent}
                  className="w-full py-2 border-b border-gray-300 bg-transparent outline-none text-sm"
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Spouse Occupation"
                name="spouseOcc"
                placeholder="e.g. Teacher, Housewife"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Spouse Contact Number"
                name="spouseContact"
                placeholder="03XX-XXXXXXX"
              />
            </div>

            <SubHeading text="Children & Other Dependents" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-purple-50">
                <thead className="bg-[#dbdbdb] text-black uppercase font-black tracking-wider border-b border-black select-none text-[9px]">
                  <tr>
                    <th className="p-2.5 border border-black text-left">
                      Name
                    </th>
                    <th className="p-2.5 border border-black text-center">
                      Relation
                    </th>
                    <th className="p-2.5 border border-black text-center">
                      DOB
                    </th>
                    <th className="p-2.5 border border-black text-center">
                      CNIC / B-Form
                    </th>
                    <th className="p-2.5 border border-black text-center">
                      Gender
                    </th>
                    <th className="p-2.5 border border-black text-center">
                      Dependent?
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.children.map((child, idx) => (
                    <tr key={idx}>
                      <td className="p-1 border border-purple-50">
                        <input
                          className="w-full p-2 outline-none"
                          value={child.name}
                          placeholder="Full name"
                          onChange={(e) =>
                            updateList(idx, "name", e.target.value, "children")
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          className="w-full p-2 outline-none"
                          value={child.relationship}
                          placeholder="Son/Daughter?"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "relationship",
                              e.target.value,
                              "children",
                            )
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          type="date"
                          className="w-full p-2 outline-none"
                          value={child.dob}
                          onChange={(e) =>
                            updateList(idx, "dob", e.target.value, "children")
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          className="w-full p-2 outline-none"
                          value={child.cnic}
                          placeholder="ID number"
                          onChange={(e) =>
                            updateList(idx, "cnic", e.target.value, "children")
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <select
                          className="w-full p-2 outline-none"
                          value={child.gender}
                          onChange={(e) =>
                            updateList(
                              idx,
                              "gender",
                              e.target.value,
                              "children",
                            )
                          }
                        >
                          <option value="">--</option>
                          <option>M</option>
                          <option>F</option>
                          <option>Other</option>
                        </select>
                      </td>
                      <td className="p-1 border border-purple-50">
                        <select
                          className="w-full p-2 outline-none"
                          value={child.dependent}
                          onChange={(e) =>
                            updateList(
                              idx,
                              "dependent",
                              e.target.value,
                              "children",
                            )
                          }
                        >
                          <option value="">--</option>
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading text="Parents / Guardians" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Father's Full Name"
                name="fatherReal"
                placeholder="Full name"
              />
              <div className="w-full">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Father's Status
                </label>
                <select
                  name="fatherStatus"
                  value={formData.fatherStatus}
                  className="w-full py-2 border-b border-gray-300 bg-transparent outline-none text-sm"
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>Working</option>
                  <option>Retired</option>
                  <option>Deceased</option>
                  <option>Other</option>
                </select>
              </div>
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Father's Occupation"
                name="fatherOcc"
                placeholder="Occupation or Retired"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Mother's Full Name"
                name="motherReal"
                placeholder="Full name"
              />
              <div className="w-full">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Mother's Status
                </label>
                <select
                  name="motherStatus"
                  value={formData.motherStatus}
                  className="w-full py-2 border-b border-gray-300 bg-transparent outline-none text-sm"
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>Working</option>
                  <option>Housewife</option>
                  <option>Retired</option>
                  <option>Other</option>
                </select>
              </div>
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Mother's Occupation"
                name="motherOcc"
                placeholder="Occupation or Housewife"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Total Number of Siblings"
                name="siblings"
                type="number"
                placeholder="e.g. 3"
              />
              <div className="w-full">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Are Parents Financially Dependent on You?
                </label>
                <select
                  name="parentsDependent"
                  value={formData.parentsDependent}
                  className="w-full py-2 border-b border-gray-300 bg-transparent outline-none text-sm"
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            number="05"
            title="Emergency Contacts"
            sub="Primary, secondary & next of kin"
          >
            <SubHeading text="Emergency Contact 1 (Primary)" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Full Name *"
                name="e1Name"
                required
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Relationship *"
                name="e1Relation"
                required
                placeholder="e.g. Father, Spouse"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Phone Number *"
                name="e1Phone"
                required
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Alternate Phone"
                name="e1Alt"
              />
              <div className="md:col-span-2">
                <UnderlineInput
                  formData={formData}
                  handleInputChange={handleInputChange}
                  label="Residential Address"
                  name="e1Address"
                  placeholder="Full address"
                />
              </div>
            </div>

            <SubHeading text="Emergency Contact 2 (Secondary)" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Full Name *"
                name="e2Name"
                required
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Relationship *"
                name="e2Relation"
                required
                placeholder="e.g. Brother, Mother"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Phone Number *"
                name="e2Phone"
                required
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Alternate Phone"
                name="e2Alt"
              />
              <div className="md:col-span-2">
                <UnderlineInput
                  formData={formData}
                  handleInputChange={handleInputChange}
                  label="Residential Address"
                  name="e2Address"
                />
              </div>
            </div>

            <SubHeading text="Next of Kin" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Full Name *"
                name="nokName"
                required
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Relationship *"
                name="nokRelation"
                required
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="CNIC *"
                name="nokCnic"
                required
                placeholder="XXXXX-XXXXXXX-X"
              />
              <UnderlineInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Phone Number"
                name="nokPhone"
              />
            </div>
          </SectionCard>

          <SectionCard
            number="06"
            title="Educational Details"
            sub="Qualifications & certifications"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-purple-50">
                <thead className="bg-[#dbdbdb] text-black uppercase font-bold tracking-widest">
                  <tr>
                    <th className="p-3 border">Level / Degree</th>
                    <th className="p-3 border">Subject / Specialisation</th>
                    <th className="p-3 border">Institution</th>
                    <th className="p-3 border">Board / University</th>
                    <th className="p-3 border">Year</th>
                    <th className="p-3 border">Grade / CGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.education.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-1 border border-purple-50">
                        <select
                          className="w-full p-2 outline-none"
                          value={row.level}
                          onChange={(e) =>
                            updateList(
                              idx,
                              "level",
                              e.target.value,
                              "education",
                            )
                          }
                        >
                          {[
                            "Matriculation",
                            "Intermediate",
                            "Bachelor's",
                            "Master's",
                            "Other",
                          ].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={row.subject}
                          className="w-full p-2 outline-none"
                          placeholder="e.g. Computer Science"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "subject",
                              e.target.value,
                              "education",
                            )
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={row.institution}
                          className="w-full p-2 outline-none"
                          placeholder="Institution name"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "institution",
                              e.target.value,
                              "education",
                            )
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={row.board}
                          className="w-full p-2 outline-none"
                          placeholder="Board / University"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "board",
                              e.target.value,
                              "education",
                            )
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          type="number"
                          value={row.year}
                          className="w-full p-2 outline-none"
                          placeholder="YYYY"
                          onChange={(e) =>
                            updateList(idx, "year", e.target.value, "education")
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={row.grade}
                          className="w-full p-2 outline-none"
                          placeholder="A / 3.8"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "grade",
                              e.target.value,
                              "education",
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Degree / Certificate Copies ? Upload highest qualification
                  (PDF or image)
                </label>
                <div className="min-h-[90px] bg-gray-50 border border-dashed border-purple-100 rounded-xl relative flex items-center justify-center overflow-hidden transition-all hover:bg-purple-50 p-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-medium">
                      {previews.degreeCertificate ??
                        "PDF / JPG / PNG ? max 5 MB"}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange(e, "degreeCertificate")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <SubHeading text="Professional Certifications & Training" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-purple-50">
                <thead className="bg-[#dbdbdb] text-black uppercase font-bold tracking-widest">
                  <tr>
                    <th className="p-3 border">Certification / Course Name</th>
                    <th className="p-3 border">Issuing Body</th>
                    <th className="p-3 border">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.certifications.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={row.course}
                          className="w-full p-2 outline-none"
                          placeholder="e.g. Google Analytics Certification"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "course",
                              e.target.value,
                              "certifications",
                            )
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={row.issuer}
                          className="w-full p-2 outline-none"
                          placeholder="e.g. Google"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "issuer",
                              e.target.value,
                              "certifications",
                            )
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          type="number"
                          value={row.year}
                          className="w-full p-2 outline-none"
                          placeholder="YYYY"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "year",
                              e.target.value,
                              "certifications",
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubHeading text="Skills & Languages" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <TextAreaInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="Professional Skills (separate by commas)"
                name="skills"
                value={formData.skills}
                placeholder="e.g. Video Editing, Social Media Management, Copywriting"
              />

              <TextAreaInput
                formData={formData}
                handleInputChange={handleInputChange}
                label="anguages Known & Proficiency Level"
                name="languages"
                value={formData.languages}
                placeholder="e.g. Urdu (Native), English (Fluent), Punjabi (Conversational)"
              />
            </div>
          </SectionCard>

          <SectionCard
            number="07"
            title="Work Experience"
            sub="Employment history & letters"
          >
            {formData.experience.map((exp, idx) => (
              <div
                key={idx}
                className="bg-neutral-50 rounded-3xl p-6 mb-8 border border-neutral-300 shadow-sm"
              >
                <h4 className="text-xs uppercase tracking-[2px] font-black text-neutral-800 mb-4 select-none">
                  Employment 0{idx + 1} {idx === 0 ? "· (Most Recent)" : ""}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <UnderlineInput
                    formData={formData}
                    handleInputChange={handleInputChange}
                    label="Company / Organisation Name *"
                    name={`company-${idx}`}
                    required={idx === 0}
                    placeholder="Full name"
                    value={exp.company}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateList(idx, "company", e.target.value, "experience")
                    }
                  />
                  <UnderlineInput
                    formData={formData}
                    handleInputChange={handleInputChange}
                    label="Designation / Job Title *"
                    name={`title-${idx}`}
                    required={idx === 0}
                    placeholder="Job title"
                    value={exp.title}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateList(idx, "title", e.target.value, "experience")
                    }
                  />
                  <UnderlineInput
                    formData={formData}
                    handleInputChange={handleInputChange}
                    label="Department"
                    name={`dept-${idx}`}
                    value={exp.dept}
                    placeholder="Department"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateList(idx, "dept", e.target.value, "experience")
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                  <UnderlineInput
                    formData={formData}
                    handleInputChange={handleInputChange}
                    label="Start Date *"
                    name={`start-${idx}`}
                    required={idx === 0}
                    type="date"
                    value={exp.start}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateList(idx, "start", e.target.value, "experience")
                    }
                  />
                  <UnderlineInput
                    formData={formData}
                    handleInputChange={handleInputChange}
                    label="End Date"
                    name={`end-${idx}`}
                    type="date"
                    value={exp.end}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateList(idx, "end", e.target.value, "experience")
                    }
                  />
                  <UnderlineInput
                    formData={formData}
                    handleInputChange={handleInputChange}
                    label="Last Drawn Salary (PKR)"
                    name={`salary-${idx}`}
                    type="number"
                    value={exp.salary}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateList(idx, "salary", e.target.value, "experience")
                    }
                  />
                  <UnderlineInput
                    formData={formData}
                    handleInputChange={handleInputChange}
                    label="Reason for Leaving"
                    name={`reason-${idx}`}
                    value={exp.reason}
                    placeholder="e.g. Better opportunity"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateList(idx, "reason", e.target.value, "experience")
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <UnderlineInput
                    formData={formData}
                    handleInputChange={handleInputChange}
                    label="Supervisor Name"
                    name={`supervisor-${idx}`}
                    value={exp.supervisor}
                    placeholder="Full name"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateList(
                        idx,
                        "supervisor",
                        e.target.value,
                        "experience",
                      )
                    }
                  />
                  <UnderlineInput
                    formData={formData}
                    handleInputChange={handleInputChange}
                    label="Supervisor Contact"
                    name={`contact-${idx}`}
                    value={exp.contact}
                    placeholder="Phone or email"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateList(idx, "contact", e.target.value, "experience")
                    }
                  />
                </div>
                <div className="mt-8">
                  <div className="w-full">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                      Key Responsibilities
                    </label>
                    <textarea
                      value={exp.responsibilities}
                      placeholder="? Describe your main duties and achievements?"
                      onChange={(e) =>
                        updateList(
                          idx,
                          "responsibilities",
                          e.target.value,
                          "experience",
                        )
                      }
                      className="w-full min-h-[110px] py-2 px-3 border border-gray-300 rounded-xl focus:border-[#dbdbdb] outline-none text-sm bg-transparent resize-none"
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Experience / Relieving Letter ? Employer {idx + 1}
                    </label>
                    <div className="min-h-[90px] bg-gray-50 border border-dashed border-purple-100 rounded-xl relative flex items-center justify-center overflow-hidden transition-all hover:bg-purple-50 p-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 font-medium">
                          {previews[`experienceLetter${idx + 1}`] ??
                            "Upload Letter"}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) =>
                          handleFileChange(e, `experienceLetter${idx + 1}`)
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </SectionCard>

          <SectionCard
            number="08"
            title="Professional References"
            sub="Minimum 2 ? Not family members"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-purple-50">
                <thead className="bg-[#dbdbdb] text-black uppercase font-bold tracking-widest">
                  <tr>
                    <th className="p-3 border">Full Name</th>
                    <th className="p-3 border">Designation</th>
                    <th className="p-3 border">Organisation</th>
                    <th className="p-3 border">Phone</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Relationship</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.references.map((ref, idx) => (
                    <tr key={idx}>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={ref.name}
                          className="w-full p-2 outline-none"
                          placeholder="Full name"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "name",
                              e.target.value,
                              "references",
                            )
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={ref.designation}
                          className="w-full p-2 outline-none"
                          placeholder="Manager, Director?"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "designation",
                              e.target.value,
                              "references",
                            )
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={ref.org}
                          className="w-full p-2 outline-none"
                          placeholder="Company"
                          onChange={(e) =>
                            updateList(idx, "org", e.target.value, "references")
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={ref.phone}
                          className="w-full p-2 outline-none"
                          placeholder="03XX-XXXXXXX"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "phone",
                              e.target.value,
                              "references",
                            )
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={ref.email}
                          className="w-full p-2 outline-none"
                          placeholder="email@company.com"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "email",
                              e.target.value,
                              "references",
                            )
                          }
                        />
                      </td>
                      <td className="p-1 border border-purple-50">
                        <input
                          value={ref.relation}
                          className="w-full p-2 outline-none"
                          placeholder="Colleague, Mentor?"
                          onChange={(e) =>
                            updateList(
                              idx,
                              "relation",
                              e.target.value,
                              "references",
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard
            number="09"
            title="Declaration & Signature"
            sub="Employee confirmation"
          >
            <div className="bg-neutral-50 p-6 md:p-8 rounded-2xl border-l-[6px] border-[#dbdbdb] text-xs font-medium text-neutral-700 italic leading-relaxed mb-10 shadow-sm">
              "I, the undersigned, hereby declare that all information provided
              in this Employee Information Form is true, complete, and accurate
              to the best of my knowledge. I understand that any false
              statement, misrepresentation, or omission of relevant facts may
              result in disciplinary action, including termination of
              employment. I authorise Khushi Media to verify any information
              provided herein, contact the references listed, and retain this
              data securely as part of my permanent employment record. I am
              obligated to promptly notify the HR Department of any changes to
              this information. I confirm I have read and understood the terms
              of my employment offer and agree to abide by Khushi Media's
              policies, code of conduct, and confidentiality requirements."
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <UnderlineInput
                  formData={formData}
                  handleInputChange={handleInputChange}
                  label="Full Name (Print) *"
                  name="declarantName"
                  required
                  placeholder="Print your full name"
                />
                <UnderlineInput
                  formData={formData}
                  handleInputChange={handleInputChange}
                  label="Date *"
                  name="declarantDate"
                  required
                  type="date"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <PreviewBox
                  label="Employee Signature"
                  field="signatureImage"
                  required
                  preview={previews.signatureImage}
                  onFileChange={handleFileChange}
                />
                <PreviewBox
                  label="Thumb Impression"
                  field="thumbImpression"
                  preview={previews.thumbImpression}
                  onFileChange={handleFileChange}
                />
              </div>
            </div>

            <div className="mt-10 flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                name="consent"
                required
                checked={formData.consent}
                onChange={handleInputChange}
                className="mt-1 w-6 h-6 rounded accent-[#dbdbdb]"
              />
              <span className="text-sm font-black text-gray-800 group-hover:text-purple-700 transition-colors uppercase tracking-tight">
                I confirm the above declaration is true and I consent to Khushi
                Media processing my personal data for employment purposes. *
              </span>
            </div>
          </SectionCard>

          <div className="flex flex-col md:flex-row justify-end items-center gap-4 pb-20 print:hidden select-none">
            {/* CLEAR FORM BUTTON - Clean Muted Tone */}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full md:w-auto px-8 py-3 text-xs font-black text-neutral-500 uppercase tracking-widest hover:text-black hover:bg-neutral-200 border border-transparent hover:border-neutral-400 rounded transition-all text-center"
            >
              Clear Form
            </button>

            {/* SUBMIT INFORMATION BUTTON - Solid Black Corporate Style */}
            <button
              type="submit"
              className="w-full md:w-auto cursor-pointer px-12 py-3 bg-black border border-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-sm text-center"
            >
              Submit Information
            </button>
          </div>
        </form>

        <footer className="bg-[#dbdbdb] py-6 text-center border-t border-neutral-300 select-none">
          <p className="text-neutral-800 text-[9px] font-black uppercase tracking-[6px] pl-[6px]">
            Khushi Media · Gujranwala · HR Record System
          </p>
        </footer>
      </div>
    </div>
  );
}
