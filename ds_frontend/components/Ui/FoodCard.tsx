// components/FoodCard.tsx
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";


type RestaurantCardProps = {
  variant: "restaurant";
  href: string;
  image: string;
  name: string;
  cuisine: string; // e.g. "Fresh bowls · Seasonal comfort"
  rating: number;
  reviews: string; // e.g. "240+"
  time: string; // e.g. "20–30 min"
  delivery: string; // e.g. "$2.49 delivery"
  tag: string; // e.g. "Neighborhood favorite"
};

type DishCardProps = {
  variant: "dish";
  image: string;
  name: string;
  description: string;
  price: string; // e.g. "$14.50"
  badge: string; // e.g. "Bestseller"
  onAdd?: () => void;
};

export type FoodCardProps = RestaurantCardProps | DishCardProps;

export default function FoodCard(props: FoodCardProps) {
  if (props.variant === "restaurant") {
    const { href, image, name, cuisine, rating, reviews, time, delivery, tag } =
      props;

    return (
      <Link
        href={href}
        className="group block rounded-2xl border border-neutral-200 bg-white p-2 transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4472f]"
      >
        <div className="relative aspect-[1.52/1] w-full overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover w-full h-full bg-orange-300"
          />
        </div>
        <div className="px-2 pb-2 pt-4">
          <h3 className="text-[18px] font-bold text-[#1b2b24]">{name}</h3>
          <p className="mt-2 text-[12px] text-neutral-500">{cuisine}</p>
          <p className="mt-1 text-[12px] text-neutral-500">
            ★ {rating.toFixed(1)} ({reviews}) · {time} · {delivery}
          </p>
          <p className="mt-4 text-[11px] font-semibold text-[#d4472f]">{tag}</p>
        </div>
      </Link>
    );
  }

  const { image, name, description, price, badge, onAdd } = props;

  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-2">
      <div className="relative aspect-[1.52/1] w-full overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover w-full h-full bg-orange-300"
        />
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <h3 className="text-[18px] font-bold text-[#1b2b24]">{name}</h3>
        <p className="mt-2 min-h-9 text-[12px] leading-relaxed text-neutral-500">
          {description}
        </p>
        <p className="mt-3 text-[13px] font-semibold text-[#237a57]">
          {price} · {badge}
        </p>
        <Button
          variant="outline"
          fullWidth
          className="mt-4"
          onClick={onAdd}
          aria-label={`Add ${name} to cart`}
        >
          Add to cart +
        </Button>
      </div>
    </article>
  );
}
