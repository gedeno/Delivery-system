import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export const TOKEN_KEY = "fd_token";
export const USER_KEY = "fd_user";

export function getDashboardPath(role: string): string {
  const paths: Record<string, string> = {
    customer: "/dashboard/customer",
    delivery: "/dashboard/delivery",
    restaurant_owner: "/dashboard/owner",
    admin: "/dashboard/admin",
  };
  return paths[role] ?? "/";
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  placed: "Placed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  completed: "Completed",
  failed: "Failed",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  wallet: "Wallet",
};

export const ROLE_LABELS: Record<string, string> = {
  customer: "Customer",
  delivery: "Delivery Person",
  restaurant_owner: "Restaurant Owner",
  admin: "Admin",
};

export const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Please upload a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > IMAGE_MAX_SIZE) {
    return "Image must be smaller than 5MB.";
  }
  return null;
}

export function groupByCategory<T extends { category: string }>(items: T[]): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = item.category || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}
