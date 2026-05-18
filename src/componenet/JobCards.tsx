"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import Link from "next/link";

type EmployeeForm = {
  id: string;
  fullName?: string;
  empId?: string;
  department?: string;
  joiningDate?: string;
  email?: string;
  mobilePrimary?: string;
  createdAt?: { seconds: number } | null;
};

const JobCards = () => {
  const [forms, setForms] = useState<EmployeeForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        if (!db) {
          console.warn("Firebase is not configured. Skipping document fetch.");
          return;
        }
        const q = query(collection(db, "employeeForms"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EmployeeForm[];
        setForms(list);
      } catch (error) {
        console.error("Failed to load employee forms", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 py-10 px-4 font-sans text-black">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-neutral-300 pb-5">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">
              Saved Employee Forms
            </h1>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">
              Entries securely stored in Khushi Media HR Firestore.
            </p>
          </div>
          <Link 
            href="/" 
            className="rounded-xl border border-black bg-black px-5 py-2.5 text-xs font-black text-white uppercase tracking-wider hover:bg-neutral-900 transition shadow-sm text-center"
          >
            Back to Form
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center text-xs font-bold uppercase tracking-widest text-neutral-500 shadow-sm animate-pulse">
            Loading saved cards…
          </div>
        ) : forms.length === 0 ? (
          <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center text-xs font-bold uppercase tracking-widest text-neutral-500 shadow-sm">
            No saved employee forms yet.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {forms.map((form) => (
              <div 
                key={form.id} 
                className="rounded-2xl border border-neutral-300 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-neutral-400 transition-all"
              >
                {/* Card Main Info */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight leading-tight">
                        {form.fullName ?? "Unnamed Employee"}
                      </h2>
                      <p className="text-xs font-mono text-neutral-500 mt-1">
                        ID: {form.empId ?? "N/A"}
                      </p>
                    </div>
                    
                    {/* Badge Matching Your #dbdbdb Theme */}
                    <div className="rounded border border-neutral-400 bg-[#dbdbdb] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black shrink-0">
                      {form.department ?? "No department"}
                    </div>
                  </div>
                </div>

                {/* Card Action & Timestamp Footer */}
                <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between gap-3">
                  <Link
                    href={`/job-card/${form.id}`}
                    className="rounded-lg border border-black bg-white px-4 py-2 text-xs font-black text-black uppercase tracking-wider hover:bg-neutral-50 transition shadow-xs"
                  >
                    View Details
                  </Link>
                  
                  {/* Timestamp Area */}
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold">
                      Saved Timestamp
                    </p>
                    <p className="text-xs font-semibold text-neutral-700 mt-0.5">
                      {form.createdAt 
                        ? new Date(form.createdAt.seconds * 1000).toLocaleDateString() 
                        : "-"}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCards;