"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  image?: string;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

const dummyMenuData: MenuCategory[] = [
  {
    id: "coffee",
    name: "Coffee & Espresso",
    description: "Freshly brewed coffee and specialty espresso drinks",
    items: [
      {
        id: "latte",
        name: "Café Latte",
        description:
          "Smooth espresso with steamed milk and a light layer of foam",
        price: 4.5,
        category: "coffee",
        isPopular: true,
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Equal parts espresso, steamed milk, and milk foam",
        price: 4.25,
        category: "coffee",
      },
      {
        id: "americano",
        name: "Americano",
        description: "Espresso with hot water for a rich, bold flavor",
        price: 3.75,
        category: "coffee",
      },
      {
        id: "mocha",
        name: "Mocha",
        description: "Espresso with chocolate and steamed milk",
        price: 5.0,
        category: "coffee",
        isPopular: true,
      },
    ],
  },
  {
    id: "tea",
    name: "Tea & Infusions",
    description: "Premium loose-leaf teas and herbal infusions",
    items: [
      {
        id: "earl-grey",
        name: "Earl Grey",
        description: "Classic black tea with bergamot oil",
        price: 3.5,
        category: "tea",
      },
      {
        id: "chai",
        name: "Chai Latte",
        description: "Spiced black tea with steamed milk and honey",
        price: 4.75,
        category: "tea",
        isPopular: true,
      },
      {
        id: "green-tea",
        name: "Green Tea",
        description: "Light and refreshing Japanese sencha",
        price: 3.25,
        category: "tea",
      },
    ],
  },
  {
    id: "pastries",
    name: "Pastries & Sweets",
    description: "Freshly baked pastries and sweet treats",
    items: [
      {
        id: "croissant",
        name: "Butter Croissant",
        description: "Flaky, buttery French croissant",
        price: 3.5,
        category: "pastries",
        isPopular: true,
      },
      {
        id: "muffin",
        name: "Blueberry Muffin",
        description: "Moist muffin loaded with fresh blueberries",
        price: 3.25,
        category: "pastries",
      },
      {
        id: "brownie",
        name: "Chocolate Brownie",
        description: "Rich, fudgy chocolate brownie",
        price: 4.0,
        category: "pastries",
        isVegetarian: true,
      },
    ],
  },
  {
    id: "sandwiches",
    name: "Sandwiches & Light Bites",
    description: "Fresh sandwiches and light meals",
    items: [
      {
        id: "avocado-toast",
        name: "Avocado Toast",
        description:
          "Sourdough toast with smashed avocado, sea salt, and red pepper flakes",
        price: 8.5,
        category: "sandwiches",
        isVegetarian: true,
        isGlutenFree: false,
      },
      {
        id: "turkey-sandwich",
        name: "Turkey & Brie",
        description:
          "Sliced turkey with brie cheese, arugula, and cranberry sauce",
        price: 9.75,
        category: "sandwiches",
      },
      {
        id: "caprese",
        name: "Caprese Panini",
        description: "Fresh mozzarella, tomatoes, basil, and balsamic glaze",
        price: 8.25,
        category: "sandwiches",
        isVegetarian: true,
      },
    ],
  },
];

export function CafeMenu() {
  const [selectedCategory, setSelectedCategory] = useState("coffee");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ☕ Café Menu
            </h1>
            <p className="text-gray-600 text-lg">
              Discover our carefully curated selection of coffee, tea, and
              delicious treats
            </p>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {dummyMenuData.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-sm font-medium"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {dummyMenuData.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h2>
                <p className="text-gray-600 text-lg">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                            {item.name}
                          </CardTitle>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-2xl font-bold text-amber-600">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {item.isPopular && (
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-800"
                            >
                              Popular
                            </Badge>
                          )}
                          {item.isVegetarian && (
                            <Badge
                              variant="outline"
                              className="text-green-700 border-green-300"
                            >
                              Vegetarian
                            </Badge>
                          )}
                          {item.isGlutenFree && (
                            <Badge
                              variant="outline"
                              className="text-blue-700 border-blue-300"
                            >
                              Gluten-Free
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          Add to Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center">
          <Separator className="my-8" />
          <p className="text-gray-500 text-sm">
            All prices include tax. Menu items and prices subject to change.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            For special dietary requirements, please ask our staff.
          </p>
        </div>
      </div>
    </div>
  );
}
