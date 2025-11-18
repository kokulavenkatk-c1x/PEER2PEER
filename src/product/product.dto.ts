export class CreateProductDto {
  title: string;
  description: string;
  price: number;
}

export class UpdateProductDto {
  title?: string;
  description?: string;
  price?: number;
}
