const QueryKeys = {
  cafes: ["cafes"],
  cafe: (id: string) => [...QueryKeys.cafes, id],
  categories: ["categories"],
  category: (id: string) => [...QueryKeys.categories, id],
  categoriesByCafe: (cafeId: string) => [...QueryKeys.categories, "cafe", cafeId],
  products: ["products"],
  product: (id: string) => [...QueryKeys.products, id],
};

export default QueryKeys;
