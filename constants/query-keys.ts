const QueryKeys = {
  cafes: ["cafes"],
  cafe: (id: string) => [...QueryKeys.cafes, id],
  categories: ["categories"],
  category: (id: string) => [...QueryKeys.categories, id],
  products: ["products"],
  product: (id: string) => [...QueryKeys.products, id],
};

export default QueryKeys;
