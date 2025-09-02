"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CafeEditModal from "@/components/cafe/CafeEditModal";
import { cafeRepository } from "@/lib/repositories/cafe-repository";
import { Tables } from "@/types/db";

type Cafe = Tables<"cafes">;

const CafeTable = () => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);

  const fetchCafes = useCallback(async () => {
    try {
      const result = await cafeRepository.list();

      if (result.success && result.data) {
        setCafes(result.data);
      }
    } catch (error) {
      console.error("Error fetching cafes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCafes();
  }, [fetchCafes]);

  const filteredCafes = cafes.filter(
    (cafe) => cafe.slug.toLowerCase().includes(searchTerm.toLowerCase()) || cafe.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false,
  );

  const handleCafeSelect = (cafe: Cafe) => {
    setSelectedCafe(cafe);
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { USD: "$", EUR: "€", TRY: "₺" };
    const symbol = symbols[currency as keyof typeof symbols] || "$";
    return `${symbol}${amount.toFixed(2)}`;
  };

  const getDisplayName = (slug: string) => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading cafes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cafes ({cafes.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search cafes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCafes.map((cafe) => (
                <TableRow key={cafe.id}>
                  <TableCell className="font-mono font-medium">{cafe.id}</TableCell>
                  <TableCell>{cafe.logo_url && <img src={cafe.logo_url} alt={getDisplayName(cafe.slug)} className="w-10 h-10 rounded-full object-cover" />}</TableCell>
                  <TableCell className="font-medium">{getDisplayName(cafe.slug)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{cafe.slug}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{cafe.currency || "N/A"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cafe.is_active ? "default" : "destructive"}>{cafe.is_active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleCafeSelect(cafe)}>
                        View Details
                      </Button>
                      <CafeEditModal
                        cafe={cafe}
                        trigger={
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCafe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{getDisplayName(selectedCafe.slug)} - Details</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedCafe(null)}>
                Close
              </Button>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{selectedCafe.description || "No description available"}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Currency:</strong> {selectedCafe.currency || "N/A"}
                </div>
                <div>
                  <strong>Status:</strong>
                  <Badge variant={selectedCafe.is_active ? "default" : "destructive"} className="ml-2">
                    {selectedCafe.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <strong>Created:</strong> {new Date(selectedCafe.created_at).toLocaleDateString()}
                </div>
                <div>
                  <strong>ID:</strong> {selectedCafe.id}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CafeTable;
