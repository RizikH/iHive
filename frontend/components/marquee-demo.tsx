import { cn } from "@/lib/utils"
import { Marquee } from "@/components/magicui/marquee"

const reviews = [
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img || "/placeholder.svg"} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-gray-900">{name}</figcaption>
          <p className="text-xs font-medium text-gray-500">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-gray-700">{body}</blockquote>
    </figure>
  )
}

export default function MarqueeDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-gray-100 shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-100"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gray-100"></div>
    </div>
  )
}