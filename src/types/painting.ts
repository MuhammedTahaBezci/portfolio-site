import { ReactNode } from "react";

export interface Category {
  description: ReactNode;
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  title: string;
  category: string;
}

export interface Painting {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  category: string;
  createdAt?: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  sold?: boolean;
  price?: number;
  slug?: string;
  tags?: string[];
  author?: string;
}
