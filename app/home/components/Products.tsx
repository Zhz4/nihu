import { mockProducts } from "../server";
import Image from "next/image";

const Products = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {mockProducts.map((product) => (
        <div
          key={product.id}
          className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="aspect-square relative overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-3">
            <p className="text-sm font-medium text-center truncate">
              {product.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
