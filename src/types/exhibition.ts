import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface Exhibition {
    endDate: string | number | Date;
    startDate: string | number | Date;
    imageUrl: string | StaticImport;
    id: string;
    title: string;
    date: string;
    location: string;
    description?: string;
  }