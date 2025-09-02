"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyCafes, getCafeWithData } from "@/lib/dummy-data";

type CafeWithData = ReturnType<typeof getCafeWithData>;

const CafeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCafe, setSelectedCafe] = useState<CafeWithData | null>(null);

  const filteredCafes = dummyCafes.filter(
    (cafe) => cafe.slug.toLowerCase().includes(searchTerm.toLowerCase()) || cafe.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCafeSelect = (cafeId: number) => {
    const cafeData = getCafeWithData(cafeId);
    setSelectedCafe(cafeData);
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { USD: "$", EUR: "€", TRY: "₺" };
    const symbol = symbols[currency as keyof typeof symbols] || "$";
    return `${symbol}${amount.toFixed(2)}`;
  };

  // Helper function to get display name from slug
  const getDisplayName = (slug: string) => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6">
      {/* Cafes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cafes</span>
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
                      <Button size="sm" variant="outline" onClick={() => handleCafeSelect(cafe.id)}>
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Selected Cafe Details */}
      {selectedCafe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{getDisplayName(selectedCafe.slug)} - Menu Details</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedCafe(null)}>
                Close
              </Button>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{selectedCafe.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {selectedCafe.categories.map((category) => (
                <div key={category.id} className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {category.name}
                    <Badge variant="outline">{category.sort_order}</Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            {product.image_url && <img src={product.image_url} alt={product.name} className="w-8 h-8 rounded object-cover" />}
                            {product.name}
                          </TableCell>
                          <TableCell className="max-w-xs">{product.description}</TableCell>
                          <TableCell className="font-medium">{product.price ? formatCurrency(product.price, selectedCafe.currency || "USD") : "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={product.is_available ? "default" : "destructive"}>{product.is_available ? "Available" : "Unavailable"}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                {product.is_available ? "Disable" : "Enable"}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CafeTable;
