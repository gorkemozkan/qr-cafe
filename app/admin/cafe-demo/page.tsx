"use client";

import { useState } from "react";
import { CafeCreateModal, CafeEditModal } from "@/components/cafe";
import { Tables } from "@/types/db";

export default function CafeDemoPage() {
  const [cafes, setCafes] = useState<Tables<"cafes">[]>([]);

  const handleCafeSuccess = (cafe: Tables<"cafes">) => {
    setCafes((prev) => [...prev, cafe]);
  };

  const handleEditSuccess = (updatedCafe: Tables<"cafes">) => {
    setCafes((prev) => prev.map((cafe) => (cafe.id === updatedCafe.id ? updatedCafe : cafe)));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cafe Management Demo</h1>
        <CafeCreateModal onSuccess={handleCafeSuccess} />
      </div>

      <div className="grid gap-4">
        {cafes.map((cafe) => (
          <div key={cafe.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">/{cafe.slug}</h3>
                <p className="text-sm text-muted-foreground">{cafe.description || "No description"}</p>
                <p className="text-xs text-muted-foreground">
                  Currency: {cafe.currency || "Not set"} | Status: {cafe.is_active ? "Active" : "Inactive"}
                </p>
              </div>
              <CafeEditModal
                cafe={cafe}
                onSuccess={handleEditSuccess}
                trigger={
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                }
              />
            </div>
          </div>
        ))}

        {cafes.length === 0 && <div className="text-center py-8 text-muted-foreground">No cafes created yet. Create your first cafe using the button above.</div>}
      </div>
    </div>
  );
}
