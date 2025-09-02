"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  description: string;
}

const dummyMenuItems: MenuItem[] = [
  {
    id: "MENU-001",
    name: "Cappuccino",
    category: "Coffee",
    price: 4.5,
    available: true,
    description: "Classic Italian coffee with steamed milk foam",
  },
  {
    id: "MENU-002",
    name: "Latte",
    category: "Coffee",
    price: 4.0,
    available: true,
    description: "Smooth espresso with steamed milk",
  },
  {
    id: "MENU-003",
    name: "Croissant",
    category: "Pastries",
    price: 3.5,
    available: true,
    description: "Buttery French pastry",
  },
  {
    id: "MENU-004",
    name: "Blueberry Muffin",
    category: "Pastries",
    price: 3.25,
    available: false,
    description: "Fresh blueberry muffin",
  },
  {
    id: "MENU-005",
    name: "Orange Juice",
    category: "Beverages",
    price: 3.0,
    available: true,
    description: "Fresh squeezed orange juice",
  },
];

const CafeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMenuItems = dummyMenuItems.filter(
    (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cafe List</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search orders or menu items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMenuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono font-medium">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={item.available ? "default" : "destructive"}>{item.available ? "Available" : "Unavailable"}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">{item.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        {item.available ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CafeTable;
